import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isValidAdminToken } from "@/lib/session";
import { runIngest } from "../../../../../scripts/ingest";

/**
 * Protected admin endpoint: re-runs the ingest pipeline (chunk SOPs/, embed
 * via Voyage, upsert into pgvector) using whatever POSTGRES_URL/VOYAGE_API_KEY
 * are configured on this deployment. Exists so ingest can be triggered from a
 * browser (while unlocked as admin) without ever needing to hand the Postgres
 * connection string to anyone outside Vercel's environment variables.
 *
 * Gated by the admin session (not a regular user session) since re-ingesting
 * everything is a privileged, costly operation — same admin_session cookie
 * used by /admin and the other /api/admin/* routes.
 */
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const isAdmin = await isValidAdminToken(req.cookies.get(ADMIN_SESSION_COOKIE)?.value);
  if (!isAdmin) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  try {
    const summary = await runIngest();
    return NextResponse.json({ ok: true, ...summary });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
