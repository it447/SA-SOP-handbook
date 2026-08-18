import { sql } from "@vercel/postgres";
import { ensureAuthSchema } from "./userStore";

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function futureExpiry(): string {
  return new Date(Date.now() + SESSION_TTL_MS).toISOString();
}

/** Creates a normal per-user session, returning the opaque token to set as a cookie. */
export async function createSession(userId: string): Promise<string> {
  await ensureAuthSchema();
  const { rows } = await sql`
    INSERT INTO kb_sessions (user_id, is_admin, expires_at)
    VALUES (${userId}, false, ${futureExpiry()}::timestamptz)
    RETURNING token;
  `;
  return rows[0].token as string;
}

/** Returns the user id for a valid, unexpired session token, or null. */
export async function getSessionUserId(token: string): Promise<string | null> {
  await ensureAuthSchema();
  const { rows } = await sql`
    SELECT user_id FROM kb_sessions
    WHERE token = ${token}::uuid AND is_admin = false AND expires_at > now();
  `;
  return (rows[0]?.user_id as string | undefined) ?? null;
}

export async function deleteSession(token: string): Promise<void> {
  await ensureAuthSchema();
  await sql`DELETE FROM kb_sessions WHERE token = ${token}::uuid;`;
}

/** Creates an admin session (unlocked via ADMIN_SECRET, not tied to any user account). */
export async function createAdminSession(): Promise<string> {
  await ensureAuthSchema();
  const { rows } = await sql`
    INSERT INTO kb_sessions (user_id, is_admin, expires_at)
    VALUES (NULL, true, ${futureExpiry()}::timestamptz)
    RETURNING token;
  `;
  return rows[0].token as string;
}

export async function isAdminSessionValid(token: string): Promise<boolean> {
  await ensureAuthSchema();
  const { rows } = await sql`
    SELECT 1 FROM kb_sessions
    WHERE token = ${token}::uuid AND is_admin = true AND expires_at > now();
  `;
  return rows.length > 0;
}
