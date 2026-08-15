import { createOpenAI } from "@ai-sdk/openai";
import { streamText, type CoreMessage } from "ai";
import { retrieveRelevantChunks } from "@/lib/retrieve";
import { VoyageConfigError } from "@/lib/embeddings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Chat endpoint: embeds the incoming query via Voyage, retrieves the top-6
 * most similar chunks from kb_chunks (pgvector), and streams a Claude
 * (via OpenRouter) completion that's restricted to that retrieved context.
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

  let sources: { title: string; url: string }[] = [];
  let contextBlock = "(no context retrieved)";

  try {
    const chunks = await retrieveRelevantChunks(query, 6);
    sources = chunks.map((c) => ({
      title: c.heading || c.file_path,
      url: c.page_url,
    }));
    contextBlock = chunks
      .map(
        (c, i) =>
          `[Source ${i + 1}: ${c.heading || c.file_path} (${c.page_url})]\n${c.chunk_text}`
      )
      .join("\n\n---\n\n");
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

  const systemPrompt = `You are the Scale Army internal knowledge-base assistant — a helpful colleague who has read all the SOPs, not a document search tool.

Ground every answer ONLY in the context below, retrieved from Scale Army's internal SOP handbook. But don't just quote or copy it verbatim:
- Read the retrieved material, understand what it's actually saying, and explain it in your own words, the way a knowledgeable teammate would when someone asks them a question in Slack.
- Synthesize across multiple retrieved chunks/sources when the question calls for it, rather than pasting one chunk at a time.
- Answer follow-up questions conversationally, using the earlier turns in this conversation plus the newly retrieved context for the latest question — don't restart from scratch or re-explain things already covered unless the user asks you to.
- If the user asks for something more specific, more concise, a checklist, or clarification, adapt your answer style to what they're asking for while staying grounded in the SOP content.
- Keep answers reasonably concise by default — a clear explanation, not the full source text restated.

If the answer isn't contained in the context, say "I don't know — that isn't covered in the SOP handbook I have access to." Do not make anything up or fill gaps with general knowledge about how other companies do things.

When you answer, mention which SOP(s) the information came from by name (e.g. "per the Offboarding SOP...") so the user knows where to look for the full detail, but the source links shown in the UI already handle precise citation — you don't need to dump raw quotes to prove it.

Context:
${contextBlock}`;

  try {
    const result = await streamText({
      model: openrouter(model),
      system: systemPrompt,
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
