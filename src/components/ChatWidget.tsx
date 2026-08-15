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
        className="fixed bottom-6 right-6 rounded-full bg-gray-900 text-white px-5 py-3 shadow-lg hover:bg-gray-700"
      >
        Ask the SOP assistant
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] h-[32rem] max-h-[calc(100vh-3rem)] bg-white border border-gray-200 rounded-lg shadow-xl flex flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
        <span className="font-medium text-sm">SOP Assistant</span>
        <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-900 text-sm">
          Close
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
        {messages.length === 0 && (
          <p className="text-gray-500">
            Ask a question about any Scale Army SOP. Answers are restricted to what's in the
            handbook.
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "text-right" : "text-left"}>
            <div
              className={
                "inline-block rounded px-3 py-2 max-w-[85%] whitespace-pre-wrap " +
                (m.role === "user" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900")
              }
            >
              {m.content}
            </div>
          </div>
        ))}
        {sources.length > 0 && (
          <div className="border-t border-gray-100 pt-2 mt-2">
            <div className="text-xs font-medium text-gray-500 mb-1">Sources</div>
            <ul className="space-y-1">
              {sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} className="text-xs text-blue-600 hover:underline">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3 flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask a question..."
          className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="rounded bg-gray-900 text-white px-3 py-1 text-sm disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
