"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * Plain, pre-formatted shape for the client component — labels and display
 * titles are computed server-side (in Sidebar.tsx, which can import
 * lib/content's fs-backed helpers) and passed down as already-resolved
 * strings, so this client component never needs to import fs-touching code.
 */
export interface DisplayGroup {
  department: string;
  label: string;
  pages: { route: string; title: string }[];
}

/**
 * Collapsible nav tree: each department header toggles its page list open
 * or closed. All groups start collapsed so only the department headers show
 * until the user clicks one.
 */
export default function SidebarNav({ groups }: { groups: DisplayGroup[] }) {
  const [openDepartments, setOpenDepartments] = useState<Set<string>>(new Set());

  function toggle(department: string) {
    setOpenDepartments((prev) => {
      const next = new Set(prev);
      if (next.has(department)) {
        next.delete(department);
      } else {
        next.add(department);
      }
      return next;
    });
  }

  return (
    <ul className="space-y-1">
      {groups.map((group) => {
        const isOpen = openDepartments.has(group.department);
        return (
          <li key={group.department}>
            <button
              type="button"
              onClick={() => toggle(group.department)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-2 text-sm font-medium text-cream-dim hover:text-orange px-2 py-1 rounded transition-colors hover:bg-orange/10"
            >
              <span>{group.label}</span>
              <span
                className={
                  "text-xs transition-transform " + (isOpen ? "rotate-90" : "")
                }
                aria-hidden="true"
              >
                ▶
              </span>
            </button>
            {isOpen && (
              <ul className="space-y-1 pl-2 border-l border-navy-soft mt-1 mb-2">
                {group.pages.map((page) => (
                  <li key={page.route}>
                    <Link
                      href={page.route}
                      className="text-sm text-cream/70 hover:text-orange hover:underline"
                    >
                      {page.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}
