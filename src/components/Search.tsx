"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { searchItems, type SearchItem } from "@/lib/search";

export type { SearchItem };

/** Quick inline search box: dropdown of top matches as you type. */
export default function Search({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => searchItems(query, items), [query, items]);

  return (
    <div className="relative w-full max-w-md">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search SOPs..."
        className="w-full rounded border border-navy-soft bg-navy-soft text-cream placeholder:text-cream-dim px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange"
      />
      {results.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full rounded border border-navy-soft bg-navy-deep shadow-lg">
          {results.map((r) => (
            <li key={r.route}>
              <Link
                href={r.route}
                className="block px-3 py-2 text-sm hover:bg-navy-soft"
                onClick={() => setQuery("")}
              >
                <div className="font-medium text-cream">{r.title}</div>
                <div className="text-xs text-cream-dim">{r.route}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
