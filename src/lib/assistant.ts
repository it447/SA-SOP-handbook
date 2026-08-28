import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { retrieveRelevantChunks } from "@/lib/retrieve";
import { getContentIndex } from "@/lib/content";

export interface AssistantSource {
  title: string;
  /** Null for chunks from a `hidden: true` page — that page has no public
   * route to link to (see PageFrontmatter.hidden), so the UI should render
   * this as plain text instead of a link. */
  url: string | null;
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

Default to SHORT answers. This is the most important rule — err toward brevity every time, and match the answer's length to what kind of question was actually asked:
- **Lookup questions** (asking for one specific fact — a link, a URL, a form, a number, a name, a channel, "where do I go to...", "what's the link for...") get a ONE-LINE answer: just the thing they asked for, nothing else. E.g. if someone asks "what's the link to submit an expense" or "what's my referral link," give them the link/answer in a single sentence — do not restate the surrounding SOP section, do not list unrelated steps or policies from the same document, do not add caveats they didn't ask about.
- **How-to / process questions** ("how do I...", "what's the process for...", "walk me through...") get the direct answer in 1-3 sentences, or a tight bulleted list of the key steps — not a restatement of the whole SOP section.
- Do NOT walk through every step, exception, and caveat in the source material by default. Give the headline answer; leave the fine print in the source document, which is exactly what the citation is for.
- Only go long when the question genuinely requires it (e.g. "walk me through the entire process end to end" or "list every restricted country") — match your length to what was actually asked, not to how much the source material contains.
- End with a short pointer to go deeper, e.g. "See the full SOP for exceptions and edge cases" or "Ask me for more detail if you need the complete list" — but skip even that pointer for a plain one-fact lookup answer, since it doesn't need one.
- If the user then asks a follow-up like "give me more detail," "explain that," or "what about X edge case," go deeper at that point — the short-by-default rule applies to the first answer to a new question, not to explicit requests for more.

Write in plain text only — no markdown formatting (no **bold**, no _italics_, no # headers). Neither the web chat widget nor Slack render markdown, so anything like that shows up as literal asterisks/hashes. Use plain sentences, and a simple "-" at the start of a line for lists if needed, without any bold/emphasis markers around words.

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
  const index = getContentIndex();
  const sources: AssistantSource[] = chunks.map((c) => {
    const page = index.find((p) => p.relPath === c.file_path);
    const hidden = page?.frontmatter.hidden === true;
    return {
      title: hidden ? `Internal Legal Reference: ${c.heading || page?.frontmatter.title || c.file_path}` : c.heading || c.file_path,
      url: hidden ? null : c.page_url,
    };
  });
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
