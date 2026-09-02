"use client";

import { useRouter } from "next/navigation";
import { CHAT_HISTORY_KEY } from "@/lib/chatStorage";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    // Chat history is scoped to a login session, not kept forever — a new
    // login should start the assistant fresh rather than carrying over
    // whatever the previous person (or the previous session) was asking.
    try {
      window.localStorage.removeItem(CHAT_HISTORY_KEY);
    } catch {
      // Storage can fail (private browsing, quota) — not worth blocking
      // logout over.
    }
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      className="block w-full text-left text-sm text-cream-dim hover:text-orange py-1"
    >
      Log out
    </button>
  );
}
