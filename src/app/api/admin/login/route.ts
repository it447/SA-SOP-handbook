import { NextRequest, NextResponse } from "next/server";
import { createAdminSession } from "@/lib/sessionStore";
import { ADMIN_SESSION_COOKIE } from "@/lib/session";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const secret = process.env.ADMIN_SECRET;
  if (!secret || body.secret !== secret) {
    return NextResponse.json({ ok: false, error: "Incorrect admin secret." }, { status: 401 });
  }

  const token = await createAdminSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
