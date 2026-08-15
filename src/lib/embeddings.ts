/**
 * Minimal Voyage AI REST client. Voyage has no official npm SDK (as of this
 * writing), so we just call the HTTP API directly with fetch — no extra
 * dependency needed.
 *
 * Docs: https://docs.voyageai.com/reference/embeddings-api
 *
 * Assumption: we use "voyage-2", which produces 1024-dimensional embeddings.
 * This matches the `vector(1024)` column in src/lib/db.ts. If you switch to a
 * different Voyage model with a different output dimension, update both the
 * VOYAGE_MODEL env var and the column definition together.
 */

const VOYAGE_EMBEDDINGS_URL = "https://api.voyageai.com/v1/embeddings";

export type VoyageInputType = "query" | "document";

export class VoyageConfigError extends Error {}

function getApiKey(): string {
  const key = process.env.VOYAGE_API_KEY;
  if (!key) {
    throw new VoyageConfigError(
      "VOYAGE_API_KEY is not set. Add it to your .env.local (see .env.example) before using embeddings/retrieval."
    );
  }
  return key;
}

function getModel(): string {
  return process.env.VOYAGE_MODEL || "voyage-2";
}

/**
 * Embed a batch of text inputs. `inputType` tells Voyage whether these are
 * search queries or documents being indexed, which some Voyage models use to
 * pick an asymmetric embedding — pass it through for best retrieval quality.
 */
export async function embedTexts(
  texts: string[],
  inputType: VoyageInputType
): Promise<number[][]> {
  const apiKey = getApiKey();
  const model = getModel();

  const response = await fetch(VOYAGE_EMBEDDINGS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      input: texts,
      model,
      input_type: inputType,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Voyage embeddings request failed (${response.status}): ${body}`);
  }

  const json = (await response.json()) as {
    data: { embedding: number[]; index: number }[];
  };

  return json.data
    .sort((a, b) => a.index - b.index)
    .map((item) => item.embedding);
}

export async function embedText(text: string, inputType: VoyageInputType): Promise<number[]> {
  const [embedding] = await embedTexts([text], inputType);
  return embedding;
}
