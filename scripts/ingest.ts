/**
 * Ingest script: walk SOPs/, chunk each note by heading into ~500-800 token
 * pieces (small overlap), embed each chunk via Voyage AI, and upsert into
 * the kb_chunks pgvector table.
 *
 * Idempotent: chunks are keyed on (file_path, content_hash), so re-running
 * this after editing a handful of notes only re-embeds/updates the chunks
 * that actually changed, and removes chunks for content that no longer
 * exists in a file.
 *
 * Usage: npm run ingest
 * Requires VOYAGE_API_KEY and POSTGRES_URL to be set (see .env.example).
 */
import "dotenv/config";
import crypto from "node:crypto";
import { getContentIndex, type PageEntry } from "../src/lib/content";
import { embedTexts } from "../src/lib/embeddings";
import { upsertChunk, deleteStaleChunks, ensureSchema } from "../src/lib/db";

// Rough heuristic: ~4 characters per token for English text.
const CHARS_PER_TOKEN = 4;
const TARGET_MIN_TOKENS = 500;
const TARGET_MAX_TOKENS = 800;
const OVERLAP_TOKENS = 50;

const TARGET_MIN_CHARS = TARGET_MIN_TOKENS * CHARS_PER_TOKEN;
const TARGET_MAX_CHARS = TARGET_MAX_TOKENS * CHARS_PER_TOKEN;
const OVERLAP_CHARS = OVERLAP_TOKENS * CHARS_PER_TOKEN;

interface RawSection {
  heading: string | null;
  text: string;
}

/** Split a note's body into sections at markdown headings (any level). */
function splitByHeading(body: string): RawSection[] {
  const lines = body.split("\n");
  const sections: RawSection[] = [];
  let currentHeading: string | null = null;
  let currentLines: string[] = [];

  const flush = () => {
    const text = currentLines.join("\n").trim();
    if (text.length > 0) {
      sections.push({ heading: currentHeading, text });
    }
    currentLines = [];
  };

  for (const line of lines) {
    const match = /^(#{1,6})\s+(.*)$/.exec(line.trim());
    if (match) {
      flush();
      currentHeading = match[2].trim();
    }
    currentLines.push(line);
  }
  flush();

  return sections.length > 0 ? sections : [{ heading: null, text: body.trim() }];
}

interface Chunk {
  heading: string | null;
  text: string;
  index: number;
}

/** Further split an (already heading-scoped) section into ~500-800 token chunks with overlap. */
function chunkSection(section: RawSection, startIndex: number): Chunk[] {
  const { heading, text } = section;
  if (text.length <= TARGET_MAX_CHARS) {
    return [{ heading, text, index: startIndex }];
  }

  const chunks: Chunk[] = [];
  let position = 0;
  let index = startIndex;

  while (position < text.length) {
    let end = Math.min(position + TARGET_MAX_CHARS, text.length);

    // Try to break on a paragraph boundary near the target size rather than
    // mid-sentence, when there's room to look back for one.
    if (end < text.length) {
      const paragraphBreak = text.lastIndexOf("\n\n", end);
      if (paragraphBreak > position + TARGET_MIN_CHARS) {
        end = paragraphBreak;
      }
    }

    chunks.push({ heading, text: text.slice(position, end).trim(), index });
    index += 1;

    if (end >= text.length) break;
    position = Math.max(end - OVERLAP_CHARS, position + 1);
  }

  return chunks;
}

function buildChunksForPage(page: PageEntry): Chunk[] {
  const sections = splitByHeading(page.body);
  const chunks: Chunk[] = [];
  let index = 0;

  for (const section of sections) {
    const sectionChunks = chunkSection(section, index);
    chunks.push(...sectionChunks);
    index += sectionChunks.length;
  }

  return chunks.filter((c) => c.text.length > 0);
}

function contentHash(text: string): string {
  return crypto.createHash("sha256").update(text).digest("hex");
}

export interface IngestSummary {
  notesFound: number;
  totalChunks: number;
  perFile: { filePath: string; chunks: number }[];
}

/**
 * Runs the full ingest pass and returns a summary. Shared by the CLI
 * entrypoint below (`npm run ingest`) and the protected `/api/admin/ingest`
 * route, so the same logic works whether triggered from a local machine with
 * `.env.local` set, or from Vercel where the env vars already live.
 */
export async function runIngest(): Promise<IngestSummary> {
  if (!process.env.VOYAGE_API_KEY) {
    throw new Error(
      "VOYAGE_API_KEY is not set. Copy .env.example to .env.local and fill it in before running ingest."
    );
  }
  if (!process.env.POSTGRES_URL) {
    throw new Error(
      "POSTGRES_URL is not set. Copy .env.example to .env.local and fill it in before running ingest."
    );
  }

  await ensureSchema();

  const pages = getContentIndex();
  const perFile: { filePath: string; chunks: number }[] = [];
  let totalChunks = 0;

  for (const page of pages) {
    const chunks = buildChunksForPage(page);
    const hashes = chunks.map((c) => contentHash(c.text));

    if (chunks.length === 0) {
      await deleteStaleChunks(page.relPath, []);
      perFile.push({ filePath: page.relPath, chunks: 0 });
      continue;
    }

    // Embed in one batch per file to minimize API calls.
    const embeddings = await embedTexts(
      chunks.map((c) => c.text),
      "document"
    );

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const hash = hashes[i];
      await upsertChunk({
        id: `${page.relPath}#${chunk.index}:${hash.slice(0, 12)}`,
        filePath: page.relPath,
        heading: chunk.heading,
        pageUrl: page.route,
        chunkIndex: chunk.index,
        chunkText: chunk.text,
        contentHash: hash,
        embedding: embeddings[i],
      });
      totalChunks += 1;
    }

    // Remove any chunks left over from a previous run whose content no
    // longer matches (e.g. the file shrank or a section was removed).
    await deleteStaleChunks(page.relPath, hashes);

    perFile.push({ filePath: page.relPath, chunks: chunks.length });
  }

  return { notesFound: pages.length, totalChunks, perFile };
}

async function main() {
  try {
    const summary = await runIngest();
    console.log(`Found ${summary.notesFound} SOP notes under SOPs/.`);
    for (const f of summary.perFile) {
      console.log(`  ingested ${f.filePath} (${f.chunks} chunks)`);
    }
    console.log(`Done. Upserted ${summary.totalChunks} chunks across ${summary.notesFound} notes.`);
  } catch (err) {
    console.error("Ingest failed:", err);
    process.exit(1);
  }
}

// Only auto-run when executed directly as a script (`npm run ingest`), not
// when imported by the admin API route.
if (require.main === module) {
  main();
}
