/**
 * Transactional email (invite emails) via Resend's API.
 *
 * Sending to arbitrary recipients typically requires verifying a sending
 * domain in Resend's dashboard; the default `onboarding@resend.dev` sender
 * works without that for quick testing, but check Resend's current docs for
 * their free-tier specifics before relying on it for real teammates.
 */
export async function sendTransactionalEmail(to: string, subject: string, text: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("Missing RESEND_API_KEY.");
  const from = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject, text }),
  });
  if (!res.ok) throw new Error(`Resend send failed: ${await res.text()}`);
}
