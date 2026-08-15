"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export interface SearchItem {
  title: string;
  route: string;
  department?: string;
}

/**
 * Simple client-side fuzzy search over the page index (title/path). No
 * external search service — this just does a lightweight subsequence/substring
 * match against title and route, scored so closer/earlier matches rank higher.
 */
function fuzzyScore(query: string, target: string): number {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (q.length === 0) return 0;
  if (t.includes(q)) {
    // Prefer earlier, more exact substring matches.
    return 1000 - t.indexOf(q);
  }
  // Subsequence match: every char of q appears in order in t.
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  if (qi === q.length) return 10;
  return -1;
}

export default function Search({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return items
      .map((item) => ({
        item,
        score: Math.max(
          fuzzyScore(query, item.title),
          fuzzyScore(query, item.route)
        ),
      }))
      .filter((r) => r.score >= 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((r) => r.item);
  }, [query, items]);

  return (
    <div className="relative w-full max-w-md">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search SOPs..."
        className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
      />
      {results.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full rounded border border-gray-200 bg-white shadow-lg">
          {results.map((r) => (
            <li key={r.route}>
              <Link
                href={r.route}
                className="block px-3 py-2 text-sm hover:bg-gray-50"
                onClick={() => setQuery("")}
              >
                <div className="font-medium">{r.title}</div>
                <div className="text-xs text-gray-500">{r.route}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
