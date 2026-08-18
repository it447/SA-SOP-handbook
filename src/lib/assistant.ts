import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { retrieveRelevantChunks } from "@/lib/retrieve";

export interface AssistantSource {
  title: string;
  url: string;
}

/**
 * Shared system prompt for the SOP assistant, used by both the streaming web
 * chat widget (app/api/chat/route.ts) and the non-streaming Slack bot
 * (app/api/slack/events/route.ts) so the two surfaces answer consistently.
 */
export function buildSystemPrompt(contextBlock: string): string {
  return `You are the Scale Army internal knowledge-base assistant — a helpful colleague who has read all the SOPs, not a document search tool.

Ground every answer ONLY in the context below, retrieved from Scale Army's internal SOP handbook. But don't just quote or copy it verbatim:
- Read the retrieved material, understand what it's actually saying, and explain it in your own words, the way a knowledgeable teammate would when someone asks them a question in Slack.
- Synthesize across multiple retrieved chunks/sources when the question calls for it, rather than pasting one chunk at a time.
- Answer follow-up questions conversationally, using the earlier turns in this conversation plus the newly retrieved context for the latest question — don't restart from scratch or re-explain things already covered unless the user asks you to.
- If the user asks for something more specific, more concise, a checklist, or clarification, adapt your answer style to what they're asking for while staying grounded in the SOP content.
- Keep answers reasonably concise by default — a clear explanation, not the full source text restated.

If the answer isn't contained in the context, say "I don't know — that isn't covered in the SOP handbook I have access to." Do not make anything up or fill gaps with general knowledge about how other companies do things.

When you answer, mention which SOP(s) the information came from by name (e.g. "per the Offboarding SOP...") so the user knows where to look for the full detail, but the source links shown alongside the answer already handle precise citation — you don't need to dump raw quotes to prove it.

Context:
${contextBlock}`;
}

/** Retrieves relevant SOP chunks for a query and formats them as a context block + source list. */
export async function retrieveContext(
  query: string
): Promise<{ contextBlock: string; sources: AssistantSource[] }> {
  const chunks = await retrieveRelevantChunks(query, 6);
  const sources = chunks.map((c) => ({ title: c.heading || c.file_path, url: c.page_url }));
  const contextBlock =
    chunks.length > 0
      ? chunks
          .map((c, i) => `[Source ${i + 1}: ${c.heading || c.file_path} (${c.page_url})]\n${c.chunk_text}`)
          .join("\n\n---\n\n")
      : "(no context retrieved)";
  return { contextBlock, sources };
}

/**
 * Non-streaming ask: embeds the query, retrieves context, calls Claude via
 * OpenRouter, and returns the full answer + sources in one shot. Used by
 * surfaces that can't stream tokens (Slack), unlike the web chat widget
 * (app/api/chat/route.ts), which streams via the same retrieval + prompt.
 */
export async function answerQuestion(
  query: string
): Promise<{ answer: string; sources: AssistantSource[] }> {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (!openRouterKey) {
    throw new Error("OPENROUTER_API_KEY is not set on the server.");
  }

  const { contextBlock, sources } = await retrieveContext(query);

  const openrouter = createOpenAI({ apiKey: openRouterKey, baseURL: "https://openrouter.ai/api/v1" });
  const model = process.env.OPENROUTER_MODEL || "anthropic/claude-sonnet-5";

  const { text } = await generateText({
    model: openrouter(model),
    system: buildSystemPrompt(contextBlock),
    messages: [{ role: "user", content: query }],
  });

  return { answer: text, sources };
}
