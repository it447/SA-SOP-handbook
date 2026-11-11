import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isValidAdminToken } from "@/lib/session";
import { getFeedbackSummary, listBadFeedback } from "@/lib/db";

/**
 * Protected admin endpoint: lists every Slack answer that got a 👎 reaction
 * (plus the in-thread reason, when the asker gave one) and the overall
 * 👍/👎 counts. See lib/db.ts's kb_feedback table and
 * app/api/slack/events/route.ts for how these get recorded.
 */
export async function GET(req: NextRequest) {
  const isAdmin = await isValidAdminToken(req.cookies.get(ADMIN_SESSION_COOKIE)?.value);
  if (!isAdmin) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  try {
    const [items, summary] = await Promise.all([listBadFeedback(), getFeedbackSummary()]);
    return NextResponse.json({ ok: true, items, summary });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
