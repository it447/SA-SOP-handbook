import { sql } from "@vercel/postgres";

/**
 * Invite-only user accounts, stored in Vercel Postgres (the same database
 * already used for the chatbot's vector store — no separate service to
 * provision). Accounts are created only by /api/admin/invite; there is no
 * public signup form anywhere in this app on purpose.
 *
 * Nothing here runs at module-import/build time — every exported function
 * only touches the database when called, from a request handler.
 */

let authSchemaEnsured = false;

/** Idempotently ensures the kb_users / kb_sessions tables exist. */
export async function ensureAuthSchema(): Promise<void> {
  if (authSchemaEnsured) return;

  // gen_random_uuid() lives in pgcrypto on Postgres < 16; harmless no-op if
  // the server already has it built in.
  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto;`;

  await sql`
    CREATE TABLE IF NOT EXISTS kb_users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      must_change_password BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS kb_sessions (
      token UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES kb_users(id) ON DELETE CASCADE,
      is_admin BOOLEAN NOT NULL DEFAULT false,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;

  authSchemaEnsured = true;
}

export interface KbUser {
  id: string;
  email: string;
  passwordHash: string;
  mustChangePassword: boolean;
  createdAt: string;
  updatedAt: string;
}

function rowToUser(row: Record<string, unknown>): KbUser {
  return {
    id: row.id as string,
    email: row.email as string,
    passwordHash: row.password_hash as string,
    mustChangePassword: row.must_change_password as boolean,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export async function createUser(email: string, passwordHash: string): Promise<KbUser> {
  await ensureAuthSchema();
  const { rows } = await sql`
    INSERT INTO kb_users (email, password_hash, must_change_password)
    VALUES (${email}, ${passwordHash}, true)
    RETURNING *;
  `;
  return rowToUser(rows[0]);
}

export async function getUserByEmail(email: string): Promise<KbUser | null> {
  await ensureAuthSchema();
  const { rows } = await sql`SELECT * FROM kb_users WHERE email = ${email.trim().toLowerCase()};`;
  return rows[0] ? rowToUser(rows[0]) : null;
}

export async function getUserById(id: string): Promise<KbUser | null> {
  await ensureAuthSchema();
  const { rows } = await sql`SELECT * FROM kb_users WHERE id = ${id};`;
  return rows[0] ? rowToUser(rows[0]) : null;
}

export async function setPassword(id: string, passwordHash: string): Promise<void> {
  await ensureAuthSchema();
  await sql`
    UPDATE kb_users
    SET password_hash = ${passwordHash}, must_change_password = false, updated_at = now()
    WHERE id = ${id};
  `;
}

export interface UserSummary {
  id: string;
  email: string;
  createdAt: string;
}

export async function listUsers(): Promise<UserSummary[]> {
  await ensureAuthSchema();
  const { rows } = await sql`SELECT id, email, created_at FROM kb_users ORDER BY created_at DESC;`;
  return rows.map((row) => ({
    id: row.id as string,
    email: row.email as string,
    createdAt: row.created_at as string,
  }));
}

/** Revokes an invited account (and, via ON DELETE CASCADE, its sessions). */
export async function deleteUser(id: string): Promise<void> {
  await ensureAuthSchema();
  await sql`DELETE FROM kb_users WHERE id = ${id};`;
}
