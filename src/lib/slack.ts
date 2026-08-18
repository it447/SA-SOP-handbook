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

/** Posts a message to a Slack channel/DM/thread via chat.postMessage. */
export async function postSlackMessage(params: {
  channel: string;
  text: string;
  threadTs?: string;
}): Promise<void> {
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

  const json = (await res.json()) as { ok: boolean; error?: string };
  if (!json.ok) throw new Error(`Slack chat.postMessage failed: ${json.error}`);
}
