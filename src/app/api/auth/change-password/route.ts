import { NextRequest, NextResponse } from "next/server";
import { setPassword } from "@/lib/userStore";
import { hashPassword } from "@/lib/passwordUtils";
import { getUserFromSessionToken, SESSION_COOKIE } from "@/lib/session";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const user = await getUserFromSessionToken(token);
  if (!user) {
    return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });
  }

  const body = await req.json();
  const newPassword = body.newPassword as string | undefined;
  if (!newPassword || newPassword.length < 8) {
    return NextResponse.json(
      { ok: false, error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  await setPassword(user.id, await hashPassword(newPassword));
  return NextResponse.json({ ok: true });
}
