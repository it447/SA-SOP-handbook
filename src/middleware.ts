import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Route protection gate: every request except /login and NextAuth's own
 * /api/auth/* routes must have a valid session, otherwise redirect to /login.
 */
export default auth((req: NextRequest & { auth?: unknown }) => {
  const { pathname } = req.nextUrl;

  const isPublic =
    pathname === "/login" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico";

  if (isPublic) {
    return NextResponse.next();
  }

  if (!req.auth) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  // Run on everything except static assets; the isPublic check above still
  // exempts /login and /api/auth/* explicitly.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
