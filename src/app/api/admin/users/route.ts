import { NextRequest, NextResponse } from "next/server";
import { deleteUser, listUsers } from "@/lib/userStore";
import { ADMIN_SESSION_COOKIE, isValidAdminToken } from "@/lib/session";

async function requireAdmin(req: NextRequest): Promise<boolean> {
  return isValidAdminToken(req.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}

export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }
  const users = await listUsers();
  return NextResponse.json({ ok: true, users });
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }
  const { id } = (await req.json()) as { id?: string };
  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing id." }, { status: 400 });
  }
  await deleteUser(id);
  return NextResponse.json({ ok: true });
}
