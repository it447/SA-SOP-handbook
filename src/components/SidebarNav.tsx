"use client";

import { useState } from "react";
import Link from "next/link";
import type { DepartmentGroup } from "@/lib/content";

/**
 * Collapsible nav tree: each department header toggles its page list open
 * or closed. All groups start collapsed so only the department headers show
 * until the user clicks one.
 */
export default function SidebarNav({ groups }: { groups: DepartmentGroup[] }) {
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
              className="w-full flex items-center justify-between gap-2 text-sm font-medium capitalize text-cream-dim hover:text-cream py-1"
            >
              <span>{group.department.replace(/-/g, " ")}</span>
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
                      {page.frontmatter.title}
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
