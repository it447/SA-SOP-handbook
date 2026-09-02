"use client";

import { useEffect, useState } from "react";

interface UserSummary {
  id: string;
  email: string;
  createdAt: string;
}

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteResult, setInviteResult] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const [users, setUsers] = useState<UserSummary[]>([]);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const [ingesting, setIngesting] = useState(false);
  const [ingestResult, setIngestResult] = useState<string | null>(null);
  const [ingestError, setIngestError] = useState<string | null>(null);

  async function loadUsers() {
    const res = await fetch("/api/admin/users").then((r) => r.json());
    if (res.ok) setUsers(res.users);
  }

  useEffect(() => {
    if (unlocked) loadUsers();
  }, [unlocked]);

  async function unlock() {
    setUnlockError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret }),
    });
    const data = await res.json();
    if (data.ok) setUnlocked(true);
    else setUnlockError(data.error || "Incorrect admin secret.");
  }

  async function invite() {
    setInviting(true);
    setInviteResult(null);
    setInviteError(null);
    try {
      const res = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      if (data.emailSent) {
        setInviteResult(`Invited ${email} — they'll get an email with their login.`);
      } else {
        setInviteResult(
          `Invited ${email}, but the invite email didn't send (${data.emailError ?? "no email provider configured yet"}). ` +
            `Share this with them manually — Email: ${email} / Temporary password: ${data.tempPassword}`
        );
      }
      setEmail("");
      await loadUsers();
    } catch (e) {
      setInviteError(e instanceof Error ? e.message : String(e));
    } finally {
      setInviting(false);
    }
  }

  async function ingest() {
    setIngesting(true);
    setIngestResult(null);
    setIngestError(null);
    try {
      const res = await fetch("/api/admin/ingest");
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Ingest failed.");
      setIngestResult(
        `Done — re-embedded ${data.notesFound} SOP notes (${data.totalChunks} chunks) into the chatbot's knowledge base.`
      );
    } catch (e) {
      setIngestError(e instanceof Error ? e.message : String(e));
    } finally {
      setIngesting(false);
    }
  }

  async function revoke(id: string) {
    setRemovingId(id);
    try {
      await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      await loadUsers();
    } finally {
      setRemovingId(null);
    }
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy">
        <div className="w-full max-w-sm bg-navy-soft border border-navy-soft rounded-lg p-8 shadow-sm">
          <h1 className="text-xl font-serif font-bold mb-1 text-cream">Admin</h1>
          <div className="h-[3px] w-9 bg-orange rounded-full mb-4" />
          <p className="text-sm text-cream-dim mb-6">Enter the admin secret to manage access.</p>
          <input
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            type="password"
            placeholder="Admin secret"
            onKeyDown={(e) => e.key === "Enter" && unlock()}
            className="w-full rounded border border-navy-soft bg-navy text-cream placeholder:text-cream-dim px-3 py-2 text-sm mb-3"
          />
          {unlockError && <p className="text-xs text-danger mb-3">{unlockError}</p>}
          <button
            onClick={unlock}
            disabled={!secret}
            className="w-full rounded bg-orange text-cream py-2 text-sm font-medium hover:bg-orange-dark disabled:opacity-50"
          >
            Unlock
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-serif font-bold mb-6 text-cream">Admin — Manage access</h1>

        <div className="bg-navy-soft border border-navy-soft rounded-lg p-6 mb-6">
          <h2 className="font-serif font-semibold text-cream mb-3">Chatbot knowledge base</h2>
          <p className="text-xs text-cream-dim mb-3">
            The chatbot (web + Slack) only knows about SOPs as of the last time this ran. Every time an SOP is
            added or edited in GitHub, click this to re-embed the vault so the chatbot's answers reflect it.
          </p>
          <button
            onClick={ingest}
            disabled={ingesting}
            className="rounded bg-orange text-cream px-4 py-2 text-sm font-medium hover:bg-orange-dark disabled:opacity-50"
          >
            {ingesting ? "Refreshing…" : "Refresh knowledge base"}
          </button>
          {ingestResult && <p className="text-xs text-ok mt-3">{ingestResult}</p>}
          {ingestError && <p className="text-xs text-danger mt-3">{ingestError}</p>}
        </div>

        <div className="bg-navy-soft border border-navy-soft rounded-lg p-6 mb-6">
          <h2 className="font-serif font-semibold text-cream mb-3">Invite someone</h2>
          <div className="flex gap-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="teammate@scalearmy.com"
              onKeyDown={(e) => e.key === "Enter" && invite()}
              className="flex-1 rounded border border-navy-soft bg-navy text-cream placeholder:text-cream-dim px-3 py-2 text-sm"
            />
            <button
              onClick={invite}
              disabled={inviting || !email}
              className="rounded bg-orange text-cream px-4 py-2 text-sm font-medium hover:bg-orange-dark disabled:opacity-50"
            >
              {inviting ? "Inviting…" : "Invite"}
            </button>
          </div>
          {inviteResult && <p className="text-xs text-ok mt-3">{inviteResult}</p>}
          {inviteError && <p className="text-xs text-danger mt-3">{inviteError}</p>}
        </div>

        <div className="bg-navy-soft border border-navy-soft rounded-lg p-6">
          <h2 className="font-serif font-semibold text-cream mb-3">People with access</h2>
          {users.length === 0 && <p className="text-sm text-cream-dim">No one invited yet.</p>}
          <ul className="space-y-2">
            {users.map((u) => (
              <li
                key={u.id}
                className="flex items-center justify-between border border-navy-soft rounded px-3 py-2"
              >
                <span className="text-sm text-cream">{u.email}</span>
                <button
                  onClick={() => revoke(u.id)}
                  disabled={removingId === u.id}
                  className="text-xs text-danger hover:underline disabled:opacity-50"
                >
                  {removingId === u.id ? "Revoking…" : "Revoke access"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
