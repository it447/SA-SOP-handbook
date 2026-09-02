import { sql } from "@vercel/postgres";

/**
 * pgvector-backed chunk store on Vercel Postgres.
 *
 * IMPORTANT: nothing in this module runs at module-import/build time — every
 * exported function only touches the database when actually called, which
 * happens from request handlers (app/api/chat/route.ts) or the ingest script,
 * never during `next build`'s static analysis/prerendering. This keeps
 * `next build` working with no live database configured.
 */

// Voyage's voyage-2 model (see .env.example) outputs 1024-dim embeddings.
// If you switch VOYAGE_MODEL to something with a different dimension, update
// this constant and re-run ingest against a fresh table.
export const EMBEDDING_DIMENSIONS = 1024;

let schemaEnsured = false;

/**
 * Idempotently ensures the pgvector extension, kb_chunks table, and its
 * cosine-similarity index exist. Safe to call on every request; after the
 * first successful call in a process it's a no-op.
 */
export async function ensureSchema(): Promise<void> {
  if (schemaEnsured) return;

  await sql`CREATE EXTENSION IF NOT EXISTS vector;`;

  await sql`
    CREATE TABLE IF NOT EXISTS kb_chunks (
      id TEXT PRIMARY KEY,
      file_path TEXT NOT NULL,
      heading TEXT,
      page_url TEXT NOT NULL,
      chunk_index INTEGER NOT NULL,
      chunk_text TEXT NOT NULL,
      content_hash TEXT NOT NULL,
      embedding vector(1024) NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE (file_path, content_hash)
    );
  `;

  // ivfflat index for approximate cosine-similarity search. Requires at least
  // a handful of rows to be useful; harmless (and cheap) to create early.
  await sql`
    CREATE INDEX IF NOT EXISTS kb_chunks_embedding_cosine_idx
    ON kb_chunks USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);
  `;

  schemaEnsured = true;
}

export interface KbChunkRow {
  id: string;
  file_path: string;
  heading: string | null;
  page_url: string;
  chunk_index: number;
  chunk_text: string;
  content_hash: string;
}

/** Upsert a single chunk, keyed on (file_path, content_hash) per the ingest spec. */
export async function upsertChunk(params: {
  id: string;
  filePath: string;
  heading: string | null;
  pageUrl: string;
  chunkIndex: number;
  chunkText: string;
  contentHash: string;
  embedding: number[];
}): Promise<void> {
  await ensureSchema();
  const embeddingLiteral = `[${params.embedding.join(",")}]`;

  await sql`
    INSERT INTO kb_chunks (id, file_path, heading, page_url, chunk_index, chunk_text, content_hash, embedding, updated_at)
    VALUES (
      ${params.id},
      ${params.filePath},
      ${params.heading},
      ${params.pageUrl},
      ${params.chunkIndex},
      ${params.chunkText},
      ${params.contentHash},
      ${embeddingLiteral}::vector,
      now()
    )
    ON CONFLICT (file_path, content_hash)
    DO UPDATE SET
      heading = EXCLUDED.heading,
      page_url = EXCLUDED.page_url,
      chunk_index = EXCLUDED.chunk_index,
      chunk_text = EXCLUDED.chunk_text,
      embedding = EXCLUDED.embedding,
      updated_at = now();
  `;
}

/** Remove chunks for a file whose content_hash no longer matches (stale chunks from a shrunk file). */
export async function deleteStaleChunks(filePath: string, keepHashes: string[]): Promise<void> {
  await ensureSchema();
  if (keepHashes.length === 0) {
    await sql`DELETE FROM kb_chunks WHERE file_path = ${filePath};`;
    return;
  }
  // @vercel/postgres's sql tag only accepts primitive bind params, so encode
  // the list of hashes to keep as a Postgres array literal string.
  const keepHashesLiteral = `{${keepHashes.map((h) => `"${h.replace(/"/g, '\\"')}"`).join(",")}}`;

  await sql`
    DELETE FROM kb_chunks
    WHERE file_path = ${filePath}
    AND content_hash NOT IN (SELECT unnest(${keepHashesLiteral}::text[]));
  `;
}

export interface RetrievedChunk extends KbChunkRow {
  similarity: number;
}

/** Top-K cosine-similarity search against kb_chunks for a query embedding. */
export async function searchSimilarChunks(
  queryEmbedding: number[],
  topK = 6
): Promise<RetrievedChunk[]> {
  await ensureSchema();
  const embeddingLiteral = `[${queryEmbedding.join(",")}]`;

  const { rows } = await sql`
    SELECT
      id, file_path, heading, page_url, chunk_index, chunk_text, content_hash,
      1 - (embedding <=> ${embeddingLiteral}::vector) AS similarity
    FROM kb_chunks
    ORDER BY embedding <=> ${embeddingLiteral}::vector
    LIMIT ${topK};
  `;

  return rows as unknown as RetrievedChunk[];
}

/**
 * Keyword/lexical search against kb_chunks, as a safety net alongside vector
 * similarity search. Pure vector search can lose an exact match on a
 * specific product/tool name (e.g. "Keeper") to a large, broad-vocabulary
 * document that merely uses similar general language (e.g. long internal
 * reference docs that happen to cover "escalation," "access," "approval" as
 * generic topics) -- the small, precise chunk that actually names the term
 * doesn't necessarily win on embedding similarity alone. Postgres full-text
 * search on the heading + chunk text catches those exact-term matches
 * deterministically, regardless of how the embeddings rank them.
 */
/**
 * Builds an OR-combined tsquery string ("word1 | word2 | word3") from a raw
 * query's significant words. Deliberately NOT plainto_tsquery/websearch_to_tsquery
 * -- both of those AND every word together, requiring a single chunk to
 * contain ALL of them to match at all. A natural question like "What's the
 * escalation order if I need a password from Keeper?" has its distinctive
 * terms ("escalation", "password", "keeper") split across different chunks
 * of the same SOP (a table titled "Escalation order" vs. a paragraph that
 * says "password"), so an AND match finds nothing in either. OR + ts_rank
 * instead lets a chunk match on any subset of terms, ranked by how many/how
 * well it matches -- much closer to what "keyword search" should mean here.
 */
function buildOrTsQuery(query: string): string | null {
  const STOPWORDS = new Set([
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "and", "or", "but", "if", "then", "so", "of", "to", "in", "on", "at",
    "for", "with", "from", "by", "about", "as", "it", "its", "this", "that",
    "what", "whats", "who", "when", "where", "how", "why", "do", "does",
    "did", "can", "could", "should", "would", "i", "my", "me", "you", "your",
  ]);

  const words = query
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));

  const unique = [...new Set(words)];
  if (unique.length === 0) return null;

  // Escape single quotes defensively even though the words above are
  // already alphanumeric-only; each word becomes its own to_tsquery lexeme.
  return unique.map((w) => w.replace(/'/g, "''")).join(" | ");
}

export async function searchKeywordChunks(query: string, topK = 6): Promise<RetrievedChunk[]> {
  await ensureSchema();

  const tsQueryString = buildOrTsQuery(query);
  if (!tsQueryString) return [];

  const { rows } = await sql`
    SELECT
      id, file_path, heading, page_url, chunk_index, chunk_text, content_hash,
      ts_rank(
        to_tsvector('english', coalesce(heading, '') || ' ' || chunk_text),
        to_tsquery('english', ${tsQueryString})
      ) AS similarity
    FROM kb_chunks
    WHERE to_tsvector('english', coalesce(heading, '') || ' ' || chunk_text)
          @@ to_tsquery('english', ${tsQueryString})
    ORDER BY similarity DESC
    LIMIT ${topK};
  `;

  return rows as unknown as RetrievedChunk[];
}
