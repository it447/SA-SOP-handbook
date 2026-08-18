import Sidebar from "@/components/Sidebar";
import SearchPageResults from "@/components/SearchPageResults";
import { getContentIndex, getDisplayTitle } from "@/lib/content";

export default function SearchPage() {
  const items = getContentIndex().map((p) => ({
    title: getDisplayTitle(p),
    route: p.route,
    department: p.frontmatter.department,
  }));

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-serif font-bold mb-6 text-cream">Search SOPs</h1>
          <SearchPageResults items={items} />
        </div>
      </main>
    </div>
  );
}
