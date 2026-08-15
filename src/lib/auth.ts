import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";

/**
 * NextAuth.js (Auth.js) v5 configuration.
 *
 * Two providers are wired up:
 *   - GitHub OAuth: the intended real-world login for this dev/eng team —
 *     reuses org membership. Requires AUTH_GITHUB_ID/AUTH_GITHUB_SECRET
 *     (see .env.example). Falls back to being effectively unusable (NextAuth
 *     will error only if someone attempts to sign in with it) when unset —
 *     it does not crash the app at import time.
 *   - Credentials: a placeholder provider so the app is fully click-through
 *     testable without any real OAuth app configured. THIS IS NOT REAL AUTH —
 *     it accepts any non-empty username/password pair. Replace with a real
 *     identity check (or remove entirely) before this goes anywhere near
 *     production.
 */
export const authConfig: NextAuthConfig = {
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Credentials({
      name: "Placeholder Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Placeholder only: accepts any non-empty username/password so the
        // scaffold is testable end-to-end without a real identity provider.
        // Replace this with a real check (SSO, directory lookup, etc.)
        // before going to production.
        const username = credentials?.username;
        const password = credentials?.password;
        if (typeof username === "string" && username.length > 0 && typeof password === "string" && password.length > 0) {
          return { id: username, name: username, email: `${username}@scalearmy.com` };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
