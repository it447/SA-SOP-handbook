import { NextRequest, NextResponse } from "next/server";
import { answerQuestion } from "@/lib/assistant";
import {
  addSlackReaction,
  getBotUserId,
  getSlackPermalink,
  postSlackMessage,
  verifySlackSignature,
} from "@/lib/slack";
import { findAwaitingReason, recordFeedbackMessage, setFeedbackReason, setFeedbackRating } from "@/lib/db";
import { resolveSlackAsker, workhubConfigProblem } from "@/lib/workhub";

export const runtime = "nodejs";
export const maxDuration = 60;

// Either thumbs-up counts as a 👍, either thumbs-down as a 👎 -- Slack's
// reaction name omits the skin-tone variant suffix some clients add.
const UP_REACTIONS = new Set(["+1", "thumbsup"]);
const DOWN_REACTIONS = new Set(["-1", "thumbsdown"]);

interface SlackEvent {
  type: string;
  subtype?: string;
  channel: string;
  channel_type?: string;
  user?: string;
  bot_id?: string;
  text?: string;
  ts: string;
  thread_ts?: string;
  // reaction_added/reaction_removed only:
  reaction?: string;
  item?: { type: string; channel: string; ts: string };
}

interface SlackPayload {
  type: string;
  challenge?: string;
  event?: SlackEvent;
}

/** Strips a leading "<@BOTID>" mention (app_mention events include it) so the assistant sees just the question. */
function stripBotMention(text: string): string {
  return text.replace(/^\s*<@[^>]+>\s*/, "").trim();
}

/**
 * Slack Events API endpoint. Handles the one-time URL verification handshake
 * and app_mention / DM message events, answering with the same retrieval +
 * Claude-via-OpenRouter logic as the web chat widget (see lib/assistant.ts),
 * then posting the reply back into the same channel/thread via chat.postMessage.
 *
 * Slack expects a response within ~3s or it retries the same event; since
 * answering a question can take longer than that, we let the original
 * invocation run to completion (Vercel doesn't kill it just because Slack
 * stopped waiting) and simply no-op on retried deliveries (identified by the
 * X-Slack-Retry-Num header) to avoid posting the same answer twice.
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  const signingSecret = process.env.SLACK_SIGNING_SECRET;
  if (!signingSecret) {
    return NextResponse.json({ error: "SLACK_SIGNING_SECRET is not set on the server." }, { status: 503 });
  }

  const isValid = verifySlackSignature({
    signingSecret,
    timestamp: req.headers.get("x-slack-request-timestamp"),
    signature: req.headers.get("x-slack-signature"),
    rawBody,
  });
  if (!isValid) {
    return NextResponse.json({ error: "Invalid Slack signature." }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as SlackPayload;

  // One-time handshake when configuring the Events API request URL in Slack.
  if (payload.type === "url_verification") {
    return NextResponse.json({ challenge: payload.challenge });
  }

  // Don't reprocess (and double-post) a retried delivery.
  if (req.headers.get("x-slack-retry-num")) {
    return NextResponse.json({ ok: true });
  }

  const event = payload.event;
  if (!event) {
    return NextResponse.json({ ok: true });
  }

  // A 👍/👎 on one of the bot's own answers -- see lib/db.ts's kb_feedback.
  if (event.type === "reaction_added") {
    await handleReaction(event);
    return NextResponse.json({ ok: true });
  }

  // Ignore anything from a bot (including ourselves) and message edits/etc.
  if (event.bot_id || event.subtype) {
    return NextResponse.json({ ok: true });
  }

  // A reply inside a thread we're tracking for a "what went wrong?" reason,
  // from the same person who gave the 👎 -- consume it as the reason instead
  // of treating it as a new question.
  if (event.type === "message" && event.thread_ts && event.user && event.text) {
    const consumed = await tryConsumeFeedbackReason(event);
    if (consumed) return NextResponse.json({ ok: true });
  }

  const isMention = event.type === "app_mention";
  const isDirectMessage = event.type === "message" && event.channel_type === "im";
  if (!isMention && !isDirectMessage) {
    return NextResponse.json({ ok: true });
  }

  const question = stripBotMention(event.text || "");
  if (!question) {
    return NextResponse.json({ ok: true });
  }

  try {
    // Who's asking (Slack profile email + timezone), so WorkHub questions
    // like "how many overdue tasks do I have?" read their own tasks.
    // If WorkHub lookups aren't possible, the answer says exactly why
    // (missing setting or Slack permission) instead of "not in the SOPs".
    const configProblem = workhubConfigProblem();
    const { asker, problem } = configProblem ? { asker: null, problem: configProblem } : await resolveSlackAsker(event.user);
    console.log(`WorkHub lookup for ${event.user}: ${asker ? `ok (${asker.email})` : `unavailable (${problem})`}`);
    const { answer, sources } = await answerQuestion(question, asker, problem);
    // Slack's <url|text> link syntax needs an absolute URL — page_url from
    // the retriever is a relative site path (e.g. "/hr/..."), which Slack
    // can't render as a link and just shows as broken raw text instead.
    const appUrl = process.env.APP_URL || `https://${req.headers.get("host")}`;
    const sourcesBlock =
      sources.length > 0
        ? "\n\n*Sources:*\n" +
          sources.map((s) => (s.url ? `• <${appUrl}${s.url}|${s.title}>` : `• ${s.title}`)).join("\n")
        : "";

    const threadTs = event.thread_ts || event.ts;
    const { ts: messageTs } = await postSlackMessage({
      channel: event.channel,
      text: answer + sourcesBlock,
      threadTs,
    });

    // Best-effort feedback tracking: hint at the reaction options and record
    // this message so a later 👍/👎 can be matched back to this Q&A. None of
    // this should block or fail the actual answer if Slack hiccups.
    try {
      const permalink = await getSlackPermalink({ channel: event.channel, messageTs });
      await recordFeedbackMessage({
        channel: event.channel,
        messageTs,
        threadTs,
        permalink,
        askerUserId: event.user ?? null,
        question,
        answer,
      });
      await Promise.all([
        addSlackReaction({ channel: event.channel, timestamp: messageTs, name: "thumbsup" }),
        addSlackReaction({ channel: event.channel, timestamp: messageTs, name: "thumbsdown" }),
      ]);
    } catch (feedbackErr) {
      console.error("Feedback tracking setup failed (answer was still posted):", feedbackErr);
    }
  } catch (err) {
    // Best-effort: let the user know something broke instead of silently
    // never replying.
    await postSlackMessage({
      channel: event.channel,
      text: `Sorry, something went wrong answering that: ${err instanceof Error ? err.message : String(err)}`,
      threadTs: event.thread_ts || event.ts,
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}

/**
 * Handles a reaction_added event on one of the bot's own tracked answers.
 * Ignores reactions on anything else (including the bot's own 👍/👎 hint
 * reactions, and reactions on messages we never recorded), and ignores a
 * reaction from the bot itself so its own hint reactions never get counted
 * as feedback. On a 👎, posts a short in-thread ask for what went wrong.
 */
async function handleReaction(event: SlackEvent): Promise<void> {
  if (!event.item || event.item.type !== "message" || !event.reaction || !event.user) return;

  const botUserId = await getBotUserId().catch(() => null);
  if (botUserId && event.user === botUserId) return;

  let rating: "up" | "down" | null = null;
  if (UP_REACTIONS.has(event.reaction)) rating = "up";
  else if (DOWN_REACTIONS.has(event.reaction)) rating = "down";
  if (!rating) return;

  try {
    const row = await setFeedbackRating({
      channel: event.item.channel,
      messageTs: event.item.ts,
      rating,
      ratedByUserId: event.user,
    });
    if (!row) return; // Reaction on a message we aren't tracking.

    if (rating === "down") {
      await postSlackMessage({
        channel: event.item.channel,
        text: "Thanks for the feedback — mind replying here with what went wrong? It'll help improve future answers.",
        threadTs: row.thread_ts,
      });
    }
  } catch (err) {
    console.error("Failed to record Slack reaction feedback:", err);
  }
}

/**
 * If this thread reply is the reason for a pending 👎 from the same person,
 * records it and returns true (caller should stop, not treat it as a new
 * question). Returns false for any other reply.
 */
async function tryConsumeFeedbackReason(event: SlackEvent): Promise<boolean> {
  if (!event.thread_ts || !event.user || !event.text) return false;

  try {
    const row = await findAwaitingReason({
      channel: event.channel,
      threadTs: event.thread_ts,
      userId: event.user,
    });
    if (!row) return false;

    await setFeedbackReason(row.id, event.text);
    await postSlackMessage({
      channel: event.channel,
      text: "Got it, thanks — logged for review. 🙏",
      threadTs: event.thread_ts,
    }).catch(() => {});
    return true;
  } catch (err) {
    console.error("Failed to record Slack feedback reason:", err);
    return false;
  }
}
