import Link from "next/link";
import { getDepartmentGroups } from "@/lib/content";

/**
 * Server component: nav tree grouped by department (top-level SOPs/ folders).
 */
export default function Sidebar() {
  const groups = getDepartmentGroups();

  return (
    <nav className="w-64 shrink-0 bg-navy-deep border-r border-navy-soft p-4 overflow-y-auto h-full">
      <Link
        href="/"
        className="block font-serif font-bold mb-4 text-sm uppercase tracking-wide text-cream"
      >
        SA SOP Handbook
      </Link>
      <ul className="space-y-4">
        {groups.map((group) => (
          <li key={group.department}>
            <div className="font-medium text-sm capitalize mb-1 text-cream-dim">
              {group.department.replace(/-/g, " ")}
            </div>
            <ul className="space-y-1 pl-2 border-l border-navy-soft">
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
          </li>
        ))}
      </ul>
    </nav>
  );
}
