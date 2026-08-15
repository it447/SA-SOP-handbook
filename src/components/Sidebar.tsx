import Link from "next/link";
import { getDepartmentGroups } from "@/lib/content";

/**
 * Server component: nav tree grouped by department (top-level SOPs/ folders).
 */
export default function Sidebar() {
  const groups = getDepartmentGroups();

  return (
    <nav className="w-64 shrink-0 border-r border-gray-200 p-4 overflow-y-auto h-full">
      <Link href="/" className="block font-semibold mb-4 text-sm uppercase tracking-wide text-gray-500">
        SA SOP Handbook
      </Link>
      <ul className="space-y-4">
        {groups.map((group) => (
          <li key={group.department}>
            <div className="font-medium text-sm capitalize mb-1">
              {group.department.replace(/-/g, " ")}
            </div>
            <ul className="space-y-1 pl-2 border-l border-gray-100">
              {group.pages.map((page) => (
                <li key={page.route}>
                  <Link
                    href={page.route}
                    className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
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
