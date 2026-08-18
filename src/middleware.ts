import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserFromSessionToken, SESSION_COOKIE } from "@/lib/session";

/**
 * Route protection gate: every request except /login, /admin, and the auth
 * API routes must have a valid session, otherwise redirect to /login.
 *
 * /admin and /api/admin/* are intentionally excluded from this normal
 * user-session gate — they're protected separately by the admin-secret
 * session checked inside each admin route/page (see src/lib/session.ts,
 * ADMIN_SESSION_COOKIE), since unlocking /admin doesn't require (or grant)
 * a regular user account.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublic =
    pathname === "/login" ||
    pathname === "/admin" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/admin") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico";

  if (isPublic) {
    return NextResponse.next();
  }

  const user = await getUserFromSessionToken(req.cookies.get(SESSION_COOKIE)?.value);
  if (!user) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except static assets; the isPublic check above still
  // exempts /login, /admin, and the auth API routes explicitly.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
