import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/lib/userStore";
import { hashPassword, generateTempPassword } from "@/lib/passwordUtils";
import { sendTransactionalEmail } from "@/lib/email";
import { ADMIN_SESSION_COOKIE, isValidAdminToken } from "@/lib/session";

export async function POST(req: NextRequest) {
  const adminToken = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!(await isValidAdminToken(adminToken))) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }

  const body = await req.json();
  const email = (body.email as string | undefined)?.trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ ok: false, error: "Missing email." }, { status: 400 });
  }

  try {
    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ ok: false, error: "That email already has an account." }, { status: 409 });
    }

    const tempPassword = generateTempPassword();
    const passwordHash = await hashPassword(tempPassword);
    await createUser(email, passwordHash);

    const appUrl = process.env.APP_URL || `https://${req.headers.get("host")}`;
    const loginMessage =
      `Hi,\n\nYou've been invited to the Scale Army SOP Handbook. Log in here:\n${appUrl}/login\n\n` +
      `Email: ${email}\nTemporary password: ${tempPassword}\n\n` +
      `You'll be asked to set your own password the first time you log in.\n`;

    // Don't let an email-sending failure orphan the account with a
    // password nobody can see — if Resend isn't configured yet (or the
    // send fails for any reason), fall back to returning the temp password
    // directly in this response instead of losing it. This response is only
    // ever seen by whoever already unlocked /admin.
    let emailSent = false;
    let emailError: string | undefined;
    try {
      await sendTransactionalEmail(email, "You've been invited to the Scale Army SOP Handbook", loginMessage);
      emailSent = true;
    } catch (err) {
      emailError = String(err);
    }

    return NextResponse.json({
      ok: true,
      emailSent,
      emailError,
      tempPassword: emailSent ? undefined : tempPassword,
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
