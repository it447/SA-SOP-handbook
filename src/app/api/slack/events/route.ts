import { NextRequest, NextResponse } from "next/server";
import { answerQuestion } from "@/lib/assistant";
import { postSlackMessage, verifySlackSignature } from "@/lib/slack";

export const runtime = "nodejs";
export const maxDuration = 60;

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

  // Ignore anything from a bot (including ourselves) and message edits/etc.
  if (event.bot_id || event.subtype) {
    return NextResponse.json({ ok: true });
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
    const { answer, sources } = await answerQuestion(question);
    const sourcesBlock =
      sources.length > 0
        ? "\n\n*Sources:*\n" + sources.map((s) => `• <${s.url}|${s.title}>`).join("\n")
        : "";

    await postSlackMessage({
      channel: event.channel,
      text: answer + sourcesBlock,
      threadTs: event.thread_ts || event.ts,
    });
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
