import { embedText } from "./embeddings";
import { searchSimilarChunks, searchKeywordChunks, type RetrievedChunk } from "./db";

// Reciprocal-rank-fusion constant -- the standard choice (see the original
// RRF paper), not tuned for this dataset specifically.
const RRF_K = 60;

/**
 * Merges two ranked result lists (keyword and vector) by reciprocal rank
 * fusion instead of one list flatly first -- a naive "all keyword hits
 * before any vector hit" concatenation meant a single-word, high-value
 * query (e.g. "what is HubSpot") let through EVERY chunk that merely
 * mentions the word once (a troubleshooting note about a HubSpot sync
 * failure, a "log this in HubSpot" aside in an unrelated SOP), ranked
 * ahead of the one chunk that's actually ABOUT HubSpot -- because keyword
 * rank order was blindly trusted over vector similarity, which is exactly
 * what's good at telling "mentions X" apart from "is about X". RRF instead
 * rewards a chunk that ranks well in both lists, without letting either
 * list's raw order override the other outright.
 */
function reciprocalRankFusion(
  keywordResults: RetrievedChunk[],
  vectorResults: RetrievedChunk[]
): RetrievedChunk[] {
  const scores = new Map<string, number>();
  const chunkByKey = new Map<string, RetrievedChunk>();

  for (const results of [keywordResults, vectorResults]) {
    results.forEach((chunk, rank) => {
      const key = `${chunk.file_path}#${chunk.chunk_index}`;
      chunkByKey.set(key, chunk);
      scores.set(key, (scores.get(key) ?? 0) + 1 / (RRF_K + rank + 1));
    });
  }

  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => chunkByKey.get(key)!);
}

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
 * context -- merged by reciprocal rank fusion (see above) rather than one
 * list unconditionally before the other.
 */
export async function retrieveRelevantChunks(
  query: string,
  topK = 8
): Promise<RetrievedChunk[]> {
  const queryEmbedding = await embedText(query, "query");
  const [vectorResults, keywordResults] = await Promise.all([
    searchSimilarChunks(queryEmbedding, topK),
    searchKeywordChunks(query, topK),
  ]);

  const merged = reciprocalRankFusion(keywordResults, vectorResults);

  // Keep both full topK vector results AND full topK keyword results in
  // play (deduped by the fusion step) rather than capping at topK overall --
  // otherwise the vector results alone would already fill the cap and every
  // keyword-only match (the whole point of this safety net) would get
  // sliced away before it had a chance. Callers that merge results from
  // multiple queries (see lib/assistant.ts's retrieveContext) apply their
  // own final cap on top of this.
  return merged.slice(0, topK * 2);
}
