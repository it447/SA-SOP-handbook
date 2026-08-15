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
          <h1 className="text-2xl font-serif font-bold mb-2 text-cream">Scale Army SOP Handbook</h1>
          <div className="orange-bar h-[3px] w-9 bg-orange rounded-full mb-4" />
          <p className="text-cream-dim mb-6">
            Internal knowledge base for Scale Army's standard operating procedures, organized by
            department.
          </p>

          <div className="mb-8">
            <Search items={searchItems} />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {groups.map((group) => (
              <div key={group.department} className="border border-navy-soft bg-navy-soft rounded p-4">
                <h2 className="font-serif font-semibold capitalize mb-2 text-cream">
                  {group.department.replace(/-/g, " ")}
                </h2>
                <ul className="space-y-1">
                  {group.pages.map((page) => (
                    <li key={page.route}>
                      <Link href={page.route} className="text-sm text-orange hover:underline">
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
