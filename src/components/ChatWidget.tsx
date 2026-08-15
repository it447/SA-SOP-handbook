"use client";

import { useChat } from "ai/react";
import { useState } from "react";

interface Source {
  title: string;
  url: string;
}

/**
 * Site-wide chat widget (rendered from app/layout.tsx, behind the same auth
 * gate as everything else via middleware.ts). Uses the Vercel AI SDK's
 * useChat hook against /api/chat, which streams a Claude-via-OpenRouter
 * answer restricted to retrieved SOP context.
 */
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    onResponse: (response) => {
      setErrorMessage(null);
      const header = response.headers.get("x-kb-sources");
      if (header) {
        try {
          setSources(JSON.parse(decodeURIComponent(header)));
        } catch {
          setSources([]);
        }
      }
    },
    onError: (err) => {
      setErrorMessage(err.message || "Something went wrong talking to the assistant.");
    },
  });

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 rounded-full bg-orange text-cream px-5 py-3 shadow-lg hover:bg-orange-dark"
      >
        Ask the SOP assistant
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] h-[32rem] max-h-[calc(100vh-3rem)] bg-navy-deep border border-navy-soft rounded-lg shadow-xl flex flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-navy-soft px-4 py-2">
        <span className="font-serif font-semibold text-sm text-cream">SOP Assistant</span>
        <button onClick={() => setOpen(false)} className="text-cream-dim hover:text-cream text-sm">
          Close
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
        {messages.length === 0 && (
          <p className="text-cream-dim">
            Ask a question about any Scale Army SOP. Answers are restricted to what's in the
            handbook.
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "text-right" : "text-left"}>
            <div
              className={
                "inline-block rounded px-3 py-2 max-w-[85%] whitespace-pre-wrap " +
                (m.role === "user" ? "bg-orange text-cream" : "bg-navy-soft text-cream")
              }
            >
              {m.content}
            </div>
          </div>
        ))}
        {sources.length > 0 && (
          <div className="border-t border-navy-soft pt-2 mt-2">
            <div className="text-xs font-medium text-cream-dim mb-1">Sources</div>
            <ul className="space-y-1">
              {sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} className="text-xs text-orange hover:underline">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {errorMessage && <p className="text-xs text-danger">{errorMessage}</p>}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-navy-soft p-3 flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask a question..."
          className="flex-1 rounded border border-navy-soft bg-navy-soft text-cream placeholder:text-cream-dim px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="rounded bg-orange text-cream px-3 py-1 text-sm disabled:opacity-50 hover:bg-orange-dark"
        >
          Send
        </button>
      </form>
    </div>
  );
}
