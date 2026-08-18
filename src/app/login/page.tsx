"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function login() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      if (data.mustChangePassword) {
        router.push("/change-password");
      } else {
        router.push(searchParams.get("callbackUrl") || "/");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm bg-navy-soft border border-navy-soft rounded-lg p-8 shadow-sm">
      <h1 className="text-xl font-serif font-bold mb-1 text-cream">Scale Army SOP Handbook</h1>
      <div className="h-[3px] w-9 bg-orange rounded-full mb-4" />
      <p className="text-sm text-cream-dim mb-6">Sign in to continue.</p>

      <div className="space-y-3">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          className="w-full rounded border border-navy-soft bg-navy text-cream placeholder:text-cream-dim px-3 py-2 text-sm"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          onKeyDown={(e) => e.key === "Enter" && login()}
          className="w-full rounded border border-navy-soft bg-navy text-cream placeholder:text-cream-dim px-3 py-2 text-sm"
        />
        {error && <p className="text-xs text-danger">{error}</p>}
        <button
          onClick={login}
          disabled={loading || !email || !password}
          className="w-full rounded bg-orange text-cream py-2 text-sm font-medium hover:bg-orange-dark disabled:opacity-50"
        >
          {loading ? "Logging in…" : "Log in"}
        </button>
      </div>

      <p className="text-xs text-cream-dim mt-4">
        Access is invite-only. If you need an account, ask whoever administers this handbook to
        invite you.
      </p>

      <Link
        href="/admin"
        className="block text-center text-xs text-cream-dim hover:text-orange mt-6 pt-4 border-t border-navy-soft"
      >
        Log in as admin
      </Link>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-navy">
      <Suspense fallback={<div className="w-full max-w-sm h-64" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
