import { notFound } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Search from "@/components/Search";
import { getContentIndex, getPageBySlugParts } from "@/lib/content";
import { renderMarkdownToHtml } from "@/lib/markdown";

export function generateStaticParams() {
  return getContentIndex().map((page) => ({ slug: page.slugParts }));
}

export default async function WikiPage({ params }: { params: { slug: string[] } }) {
  const page = getPageBySlugParts(params.slug);
  if (!page) {
    notFound();
  }

  const html = await renderMarkdownToHtml(page.body);
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
          <div className="mb-6">
            <Search items={searchItems} />
          </div>

          <div className="mb-4 text-xs uppercase tracking-wide text-gray-400 flex gap-3">
            {page.frontmatter.department && <span>{page.frontmatter.department}</span>}
            {page.frontmatter.category && <span>{page.frontmatter.category}</span>}
            {page.frontmatter.owner && <span>Owner: {page.frontmatter.owner}</span>}
            {page.frontmatter.last_updated && <span>Updated {page.frontmatter.last_updated}</span>}
          </div>

          <h1 className="text-2xl font-semibold mb-6">{page.frontmatter.title}</h1>

          <article
            className="markdown-body"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </main>
    </div>
  );
}
