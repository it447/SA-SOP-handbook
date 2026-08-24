import { notFound } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Search from "@/components/Search";
import Link from "next/link";
import {
  getVisibleContentIndex,
  getDepartmentLabel,
  getDisplayTitle,
  getPageBySlugParts,
  getRelatedPages,
} from "@/lib/content";
import { renderMarkdownToHtml } from "@/lib/markdown";

export function generateStaticParams() {
  return getVisibleContentIndex().map((page) => ({ slug: page.slugParts }));
}

export default async function WikiPage({ params }: { params: { slug: string[] } }) {
  const page = getPageBySlugParts(params.slug);
  if (!page) {
    notFound();
  }

  const html = await renderMarkdownToHtml(page.body);
  const relatedPages = getRelatedPages(page);
  const searchItems = getVisibleContentIndex().map((p) => ({
    title: getDisplayTitle(p),
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

          <div className="mb-4 text-xs uppercase tracking-wide text-cream-dim flex gap-3">
            {page.frontmatter.department && <span>{getDepartmentLabel(page.frontmatter.department)}</span>}
            {page.frontmatter.category && <span>{page.frontmatter.category}</span>}
            {page.frontmatter.owner && <span>Owner: {page.frontmatter.owner}</span>}
            {page.frontmatter.last_updated && <span>Updated {page.frontmatter.last_updated}</span>}
          </div>

          <h1 className="text-2xl font-serif font-bold mb-6 text-cream">{getDisplayTitle(page)}</h1>

          <article
            className="markdown-body"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {relatedPages.length > 0 && (
            <div className="mt-10 pt-6 border-t border-cream/10">
              <h2 className="text-xs uppercase tracking-wide text-cream-dim mb-3">Related SOPs</h2>
              <ul className="flex flex-col gap-2">
                {relatedPages.map((related) => (
                  <li key={related.relPath}>
                    <Link href={related.route} className="text-sm text-orange hover:underline">
                      {getDisplayTitle(related)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
