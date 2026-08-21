import { createOpenAI } from "@ai-sdk/openai";
import { streamText, type CoreMessage } from "ai";
import { buildSystemPrompt, retrieveContext, type AssistantSource } from "@/lib/assistant";
import { VoyageConfigError } from "@/lib/embeddings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Chat endpoint: embeds the incoming query via Voyage, retrieves the top-6
 * most similar chunks from kb_chunks (pgvector), and streams a Claude
 * (via OpenRouter) completion that's restricted to that retrieved context.
 * Shares its retrieval + system prompt with the Slack bot (lib/assistant.ts),
 * which answers non-streaming instead since Slack can't stream tokens.
 *
 * Nothing here touches Voyage/Postgres/OpenRouter until a request actually
 * comes in — all config/env reads happen inside the POST handler, so
 * `next build` never needs live credentials.
 */
export async function POST(req: Request): Promise<Response> {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (!openRouterKey) {
    return Response.json(
      {
        error:
          "OPENROUTER_API_KEY is not set on the server. Add it to .env.local (see .env.example) to enable the chatbot.",
      },
      { status: 503 }
    );
  }

  const { messages } = (await req.json()) as { messages: CoreMessage[] };

  // Build the retrieval query from the last couple of user turns, not just
  // the latest one in isolation — a vague follow-up like "what about for
  // contractors?" needs the prior turn's topic to retrieve the right chunks.
  const recentUserMessages = messages
    .filter((m) => m.role === "user" && typeof m.content === "string")
    .slice(-2) as { content: string }[];
  const query = recentUserMessages.map((m) => m.content).join("\n");

  let sources: AssistantSource[] = [];
  let contextBlock = "(no context retrieved)";

  try {
    ({ contextBlock, sources } = await retrieveContext(query));
  } catch (err) {
    if (err instanceof VoyageConfigError) {
      return Response.json(
        {
          error:
            "VOYAGE_API_KEY is not set on the server. Add it to .env.local (see .env.example) to enable retrieval.",
        },
        { status: 503 }
      );
    }
    // Postgres not configured / unreachable — surface a clear error instead
    // of crashing, since no live database exists in this scaffold either.
    return Response.json(
      {
        error:
          "Could not query the knowledge base (is POSTGRES_URL set and has `npm run ingest` been run?). " +
          `Underlying error: ${err instanceof Error ? err.message : String(err)}`,
      },
      { status: 503 }
    );
  }

  const openrouter = createOpenAI({
    apiKey: openRouterKey,
    baseURL: "https://openrouter.ai/api/v1",
  });

  const model = process.env.OPENROUTER_MODEL || "anthropic/claude-sonnet-5";

  try {
    const result = await streamText({
      model: openrouter(model),
      system: buildSystemPrompt(contextBlock),
      messages,
    });

    // Vercel AI SDK data stream response, with retrieved sources attached as a
    // stream annotation so the client can render "cited from" links alongside
    // the streamed answer.
    return result.toDataStreamResponse({
      headers: {
        "x-kb-sources": encodeURIComponent(JSON.stringify(sources)),
      },
    });
  } catch (err) {
    // Surface the real OpenRouter/model error instead of a bare 500, since
    // this is the step most likely to fail on a misconfigured model id,
    // missing OpenRouter credit, or an invalid API key.
    return Response.json(
      {
        error: `OpenRouter/Claude request failed: ${err instanceof Error ? err.message : String(err)}`,
      },
      { status: 502 }
    );
  }
}
