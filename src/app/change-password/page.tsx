"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError(null);
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      router.push("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy">
      <div className="w-full max-w-sm bg-navy-soft border border-navy-soft rounded-lg p-8 shadow-sm">
        <h1 className="text-xl font-serif font-bold mb-1 text-cream">Set your password</h1>
        <div className="h-[3px] w-9 bg-orange rounded-full mb-4" />
        <p className="text-sm text-cream-dim mb-6">
          You logged in with a temporary password. Choose a new one before continuing.
        </p>

        <div className="space-y-3">
          <input
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            type="password"
            placeholder="New password"
            className="w-full rounded border border-navy-soft bg-navy text-cream placeholder:text-cream-dim px-3 py-2 text-sm"
          />
          <input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            type="password"
            placeholder="Confirm new password"
            onKeyDown={(e) => e.key === "Enter" && submit()}
            className="w-full rounded border border-navy-soft bg-navy text-cream placeholder:text-cream-dim px-3 py-2 text-sm"
          />
          {error && <p className="text-xs text-danger">{error}</p>}
          <button
            onClick={submit}
            disabled={loading || !newPassword || !confirm}
            className="w-full rounded bg-orange text-cream py-2 text-sm font-medium hover:bg-orange-dark disabled:opacity-50"
          >
            {loading ? "Saving…" : "Save password"}
          </button>
        </div>
      </div>
    </div>
  );
}
