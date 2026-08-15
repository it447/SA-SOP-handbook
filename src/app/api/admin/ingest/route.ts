import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { runIngest } from "../../../../../scripts/ingest";

/**
 * Protected admin endpoint: re-runs the ingest pipeline (chunk SOPs/, embed
 * via Voyage, upsert into pgvector) using whatever POSTGRES_URL/VOYAGE_API_KEY
 * are configured on this deployment. Exists so ingest can be triggered from a
 * browser (while signed in) without ever needing to hand the Postgres
 * connection string to anyone outside Vercel's environment variables.
 *
 * Auth: `middleware.ts` already gates every non-public route behind a valid
 * session, but we double check here too since this performs a write.
 */
export const maxDuration = 60;

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
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
