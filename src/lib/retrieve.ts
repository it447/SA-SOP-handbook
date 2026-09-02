import { embedText } from "./embeddings";
import { searchSimilarChunks, searchKeywordChunks, type RetrievedChunk } from "./db";

/**
 * Embed a user query and return the top-K most relevant chunks from
 * kb_chunks, combining vector similarity with a keyword/full-text search.
 *
 * Vector-only search can lose an exact match on a specific term (a tool
 * name, a person's name, an acronym) to a large document that merely shares
 * generic vocabulary -- e.g. asking about "Keeper" password escalation can
 * rank below broad internal reference docs that separately discuss
 * "escalation" and "access" at length. The keyword pass catches literal term
 * matches the vector search might rank lower, so both get a chance to be in
 * context; vector results are ranked first since they still generally
 * reflect meaning better, with unique keyword hits appended after.
 */
export async function retrieveRelevantChunks(
  query: string,
  topK = 6
): Promise<RetrievedChunk[]> {
  const queryEmbedding = await embedText(query, "query");
  const [vectorResults, keywordResults] = await Promise.all([
    searchSimilarChunks(queryEmbedding, topK),
    searchKeywordChunks(query, topK),
  ]);

  // Keyword hits go first: an exact term match (a tool name, a person, an
  // acronym) is a stronger, more deterministic signal than embedding
  // similarity, and needs to survive any later cap on total chunk count
  // rather than get crowded out by a large document's many vector matches.
  const seen = new Set<string>();
  const merged: RetrievedChunk[] = [];
  for (const chunk of [...keywordResults, ...vectorResults]) {
    const key = `${chunk.file_path}#${chunk.chunk_index}`;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(chunk);
  }

  // Keep both full topK vector results AND full topK keyword results in
  // play (deduped) rather than capping at topK overall -- otherwise the
  // vector results alone would already fill the cap and every keyword-only
  // match (the whole point of this safety net) would get sliced away before
  // it had a chance. Callers that merge results from multiple queries (see
  // lib/assistant.ts's retrieveContext) apply their own final cap on top of
  // this.
  return merged.slice(0, topK * 2);
}
