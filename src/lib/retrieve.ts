import { embedText } from "./embeddings";
import { searchSimilarChunks, type RetrievedChunk } from "./db";

/**
 * Embed a user query and return the top-K most similar chunks from kb_chunks.
 * All I/O here (Voyage call + Postgres query) happens at call time — this
 * must only ever be invoked from a request handler, never at build time.
 */
export async function retrieveRelevantChunks(
  query: string,
  topK = 6
): Promise<RetrievedChunk[]> {
  const queryEmbedding = await embedText(query, "query");
  return searchSimilarChunks(queryEmbedding, topK);
}
