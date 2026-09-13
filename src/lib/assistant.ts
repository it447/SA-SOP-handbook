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

Default to SHORT answers. This is the most important rule — err toward brevity every time. Before answering, silently classify what KIND of question this is — this is a general judgment call you make on every question, not a match against a fixed list of example phrases:
- **A single-fact lookup** — the user wants exactly one piece of information (a link, a URL, a form name, a number, a date, a name, a channel, a policy value, "where do I find/go to/submit...", "what's my/the ___ for..."), regardless of how it's phrased or which SOP it touches. Give a ONE-LINE answer: just the fact they asked for, nothing else — no restating the surrounding SOP section, no listing unrelated steps or policies from the same document, no unrequested caveats, no closing pointer to "read more." If asked "what's the link to submit an expense" or "what's my referral link" or "what channel do I post X in" or any other question shaped like "give me this one thing," the whole reply should usually be under 20 words.
- **A how-to / process question** — the user wants to understand or perform a multi-step process ("how do I...", "what's the process for...", "walk me through..."). Give the direct answer in 1-3 sentences, or a tight bulleted list of the key steps — not a restatement of the whole SOP section.
- **A broad/exhaustive request** — the user explicitly asks for everything ("walk me through the entire process end to end," "list every restricted country"). Only here should you go long, and only as long as what was actually asked, not as long as the source material happens to be.
- **A troubleshooting / something's-broken report** — the user is describing a problem with a tool, not asking to be taught how it works ("X isn't showing up," "Y is blank," "I'm getting an error on Z"). If the SOP's troubleshooting section names a most-likely cause for this, lead with that ONE cause as a direct statement, not a hedge — e.g. "That's most likely a tab name change in the Google Sheet — check that first." Then, in the same sentence or the next, give exactly one fallback: who to check with if that's not it (e.g. "if the sheet looks fine, check with Engineering/IT"). Do not restate what the tool is, how it works, or every other unrelated troubleshooting entry in the SOP — that's for a how-to question, not a "this is broken" report.
- Whichever type it is, do NOT walk through every step, exception, and caveat in the source material by default. Give the headline answer; leave the fine print in the source document, which is exactly what the citation is for.
- For how-to and broad questions, end with a short pointer to go deeper, e.g. "See the full SOP for exceptions and edge cases" — but never add that pointer to a single-fact lookup answer, since a one-line answer doesn't need one.
- If the user then asks a follow-up like "give me more detail," "explain that," or "what about X edge case," go deeper at that point — the short-by-default rule applies to the first answer to a new question, not to explicit requests for more.

Write in plain text only — no markdown formatting (no **bold**, no _italics_, no # headers). Neither the web chat widget nor Slack render markdown, so anything like that shows up as literal asterisks/hashes. Use plain sentences, and a simple "-" at the start of a line for lists if needed, without any bold/emphasis markers around words.

If the answer isn't contained in the context, say "I don't know — that isn't covered in the SOP handbook I have access to." Do not make anything up or fill gaps with general knowledge about how other companies do things.

If a question has several parts and the context answers most of them but is silent on just one sub-detail (e.g. it gives the full process but doesn't state a turnaround time, or gives the policy but not one specific edge case), answer the parts you can fully, then note the specific missing piece in a natural sentence — don't tack on the full "I don't know — that isn't covered..." boilerplate for a partial gap in an otherwise-answered question. Save that exact phrase for when the context has nothing relevant at all.

When you answer, mention which SOP(s) the information came from by name (e.g. "per the Offboarding SOP...") so the user knows where to look for the full detail, but the source links shown alongside the answer already handle precise citation — you don't need to dump raw quotes to prove it.

Context:
${contextBlock}`;
}

/**
 * Retrieves relevant SOP chunks for one or more candidate queries and formats
 * them as a context block + source list.
 *
 * Accepting multiple queries (rather than one combined string) matters for
 * multi-turn chat: retrieving only against "last 2 user turns joined into one
 * string" works for a vague follow-up ("what about for contractors?") but
 * actively hurts when the user pivots to a brand-new, unrelated topic —
 * the embedding gets dragged toward the previous question's subject and the
 * new question's actual answer (e.g. a name in the Team Directory) loses out
 * to chunks from whatever the prior turn was about. So callers pass both the
 * latest message alone AND the combined recent-turns string; results from
 * every query are merged (first query's matches ranked first) and deduped by
 * chunk identity, giving the model a shot at both interpretations instead of
 * guessing which one the retrieval step should have committed to.
 */
export async function retrieveContext(
  query: string | string[]
): Promise<{ contextBlock: string; sources: AssistantSource[] }> {
  const queries = [...new Set((Array.isArray(query) ? query : [query]).map((q) => q.trim()).filter(Boolean))];
  const perQueryResults = await Promise.all(queries.map((q) => retrieveRelevantChunks(q, 8)));

  const seen = new Set<string>();
  const chunks: Awaited<ReturnType<typeof retrieveRelevantChunks>>[number][] = [];
  for (const results of perQueryResults) {
    for (const c of results) {
      const key = `${c.file_path}#${c.chunk_index}`;
      if (seen.has(key)) continue;
      seen.add(key);
      chunks.push(c);
    }
  }
  // Cap the total so context doesn't balloon just because we ran more than
  // one query — 14 chunks across both queries. Bumped up from 10: a
  // two-entity comparison question ("difference between X and Y") needs
  // room for chunks from BOTH docs to survive, and a large document
  // shouldn't be able to crowd out a smaller, equally relevant one just by
  // having more chunks in the running.
  const topChunks = chunks.slice(0, 14);

  const index = getContentIndex();

  // Sources are for display, not grounding — the model still gets all
  // `topChunks` in contextBlock below. Two things chunk-level sources get
  // wrong for display: (1) the same page can contribute several chunks,
  // showing up as several near-duplicate bullets for one source; (2) with
  // the cap raised to 14 chunks (to help comparison/broad questions), that's
  // a lot of bullets to dump on someone in Slack for an ordinary answer.
  // Dedupe to one entry per page (first chunk wins) and cap the *displayed*
  // list well below the chunk cap.
  const seenPages = new Set<string>();
  const sources: AssistantSource[] = [];
  for (const c of topChunks) {
    if (seenPages.has(c.file_path)) continue;
    seenPages.add(c.file_path);
    const page = index.find((p) => p.relPath === c.file_path);
    const hidden = page?.frontmatter.hidden === true;
    sources.push({
      // "Internal Reference" -- not "Legal Reference": hidden pages now also
      // include non-legal tool docs (Deal Calculator, JD Generator, Pricing
      // Calculator) whose commission/margin figures are business-sensitive,
      // not legal ones. Labeling all of them "Legal" was misleading.
      title: hidden ? `Internal Reference: ${page?.frontmatter.title || c.heading || c.file_path}` : c.heading || c.file_path,
      url: hidden ? null : c.page_url,
    });
    if (sources.length >= 5) break;
  }

  const contextBlock =
    topChunks.length > 0
      ? topChunks
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
