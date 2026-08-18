"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { searchItems, type SearchItem } from "@/lib/search";

/** Dedicated search page: a search bar with results populating as a plain
 * list below it (not a dropdown overlay) as the user types. */
export default function SearchPageResults({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchItems(query, items, 50), [query, items]);

  return (
    <div>
      <input
        type="search"
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search SOPs..."
        className="w-full rounded border border-navy-soft bg-navy-soft text-cream placeholder:text-cream-dim px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-orange"
      />

      <ul className="mt-6 space-y-2">
        {results.map((r) => (
          <li key={r.route}>
            <Link
              href={r.route}
              className="block rounded border border-navy-soft bg-navy-soft px-4 py-3 hover:border-orange/40"
            >
              <div className="font-medium text-cream">{r.title}</div>
              <div className="text-xs text-cream-dim mt-0.5">{r.route}</div>
            </Link>
          </li>
        ))}
      </ul>

      {query.trim() && results.length === 0 && (
        <p className="mt-6 text-sm text-cream-dim">No SOPs matched "{query}".</p>
      )}
    </div>
  );
}
