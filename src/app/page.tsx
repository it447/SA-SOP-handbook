import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Search from "@/components/Search";
import { getDepartmentGroups, getContentIndex } from "@/lib/content";

export default function HomePage() {
  const groups = getDepartmentGroups();
  const searchItems = getContentIndex().map((p) => ({
    title: p.frontmatter.title,
    route: p.route,
    department: p.frontmatter.department,
  }));

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-semibold mb-2">Scale Army SOP Handbook</h1>
          <p className="text-gray-600 mb-6">
            Internal knowledge base for Scale Army's standard operating procedures, organized by
            department.
          </p>

          <div className="mb-8">
            <Search items={searchItems} />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {groups.map((group) => (
              <div key={group.department} className="border border-gray-200 rounded p-4">
                <h2 className="font-medium capitalize mb-2">
                  {group.department.replace(/-/g, " ")}
                </h2>
                <ul className="space-y-1">
                  {group.pages.map((page) => (
                    <li key={page.route}>
                      <Link href={page.route} className="text-sm text-blue-600 hover:underline">
                        {page.frontmatter.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
