import crypto from "node:crypto";

/**
 * Verifies a Slack Events API request signature per Slack's docs
 * (https://api.slack.com/authentication/verifying-requests-from-slack).
 * Requires the *raw* request body — hashing must happen before any JSON
 * parsing touches it.
 */
export function verifySlackSignature(params: {
  signingSecret: string;
  timestamp: string | null;
  signature: string | null;
  rawBody: string;
}): boolean {
  const { signingSecret, timestamp, signature, rawBody } = params;
  if (!timestamp || !signature) return false;

  // Reject requests older than 5 minutes to guard against replay attacks.
  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > 60 * 5) return false;

  const base = `v0:${timestamp}:${rawBody}`;
  const expected = "v0=" + crypto.createHmac("sha256", signingSecret).update(base).digest("hex");

  // Constant-time comparison.
  const expectedBuf = Buffer.from(expected);
  const actualBuf = Buffer.from(signature);
  if (expectedBuf.length !== actualBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}

/** Posts a message to a Slack channel/DM/thread via chat.postMessage. Returns its ts (needed to react to it or look up its permalink). */
export async function postSlackMessage(params: {
  channel: string;
  text: string;
  threadTs?: string;
}): Promise<{ ts: string }> {
  const token = process.env.SLACK_BOT_TOKEN;
  if (!token) throw new Error("Missing SLACK_BOT_TOKEN.");

  const res = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      channel: params.channel,
      text: params.text,
      thread_ts: params.threadTs,
    }),
  });

  const json = (await res.json()) as { ok: boolean; error?: string; ts?: string };
  if (!json.ok || !json.ts) throw new Error(`Slack chat.postMessage failed: ${json.error}`);
  return { ts: json.ts };
}

/**
 * Adds an emoji reaction (e.g. "thumbsup"/"thumbsdown") to a message -- used
 * to hint at the feedback reactions on every answer the bot posts. Swallows
 * "already_reacted" (harmless race, e.g. a retried delivery) but surfaces
 * anything else so the caller can log it; never thrown as fatal since a
 * missing hint reaction shouldn't break answering the question.
 */
export async function addSlackReaction(params: {
  channel: string;
  timestamp: string;
  name: string;
}): Promise<void> {
  const token = process.env.SLACK_BOT_TOKEN;
  if (!token) throw new Error("Missing SLACK_BOT_TOKEN.");

  const res = await fetch("https://slack.com/api/reactions.add", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({ channel: params.channel, timestamp: params.timestamp, name: params.name }),
  });

  const json = (await res.json()) as { ok: boolean; error?: string };
  if (!json.ok && json.error !== "already_reacted") {
    throw new Error(`Slack reactions.add failed: ${json.error}`);
  }
}

/** Looks up a message's permalink (for linking out to the Slack thread from the admin feedback page). */
export async function getSlackPermalink(params: { channel: string; messageTs: string }): Promise<string | null> {
  const token = process.env.SLACK_BOT_TOKEN;
  if (!token) return null;

  const url = new URL("https://slack.com/api/chat.getPermalink");
  url.searchParams.set("channel", params.channel);
  url.searchParams.set("message_ts", params.messageTs);

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const json = (await res.json()) as { ok: boolean; permalink?: string };
  return json.ok && json.permalink ? json.permalink : null;
}

let cachedBotUserId: string | null = null;

/** The bot's own Slack user ID, cached for the life of the process -- used to ignore the bot's own hint reactions as if they were user feedback. */
export async function getBotUserId(): Promise<string | null> {
  if (cachedBotUserId) return cachedBotUserId;
  const token = process.env.SLACK_BOT_TOKEN;
  if (!token) return null;

  const res = await fetch("https://slack.com/api/auth.test", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = (await res.json()) as { ok: boolean; user_id?: string };
  if (json.ok && json.user_id) cachedBotUserId = json.user_id;
  return cachedBotUserId;
}
