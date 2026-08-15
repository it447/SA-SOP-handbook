import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { getPageByStem } from "./content";

/**
 * Resolves Obsidian-flavored syntax that plain remark/rehype doesn't know
 * about, before handing the markdown to the unified pipeline:
 *   - [[Note Name]]            -> link to the matching page, text = its title
 *   - [[Note Name|Alias]]      -> link to the matching page, text = Alias
 *   - ![[image.png]]           -> image embed (renders as a normal <img>; if
 *                                 the asset doesn't exist under SOPs/ this is
 *                                 an intentionally "broken" image tag rather
 *                                 than special-cased away, since the vault
 *                                 currently has no attachments to test against)
 *   - ![[Note Name]]           -> transcluded note embed; rendered as a link
 *                                 to the note (full transclusion is out of
 *                                 scope for this scaffold)
 */
function resolveWikiLinksAndEmbeds(markdown: string): string {
  // Image/attachment embeds: ![[something.png]] -> ![something](/attachments/something.png)
  const withImageEmbeds = markdown.replace(
    /!\[\[([^\]|]+\.(?:png|jpe?g|gif|svg|webp))(?:\|([^\]]+))?\]\]/gi,
    (_match, target: string, alias?: string) => {
      const cleanTarget = target.trim();
      const altText = (alias ?? cleanTarget).trim();
      // No attachments folder exists in the vault yet; this path is a
      // reasonable guess for where one would live and intentionally 404s
      // (renders as a broken image) until real attachments are added.
      return `![${altText}](/attachments/${encodeURIComponent(cleanTarget)})`;
    }
  );

  // Note embeds: ![[Note Name]] or ![[Note Name|Alias]] -> link to the note
  const withNoteEmbeds = withImageEmbeds.replace(
    /!\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g,
    (match, target: string, alias?: string) => {
      const cleanTarget = target.trim();
      const page = getPageByStem(cleanTarget);
      const label = (alias ?? cleanTarget).trim();
      if (!page) return `*[embedded note not found: ${cleanTarget}]*`;
      return `[${page.frontmatter.title || label}](${page.route})`;
    }
  );

  // Plain wikilinks: [[Note Name]] or [[Note Name|Alias]]
  const withWikiLinks = withNoteEmbeds.replace(
    /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g,
    (match, target: string, alias?: string) => {
      const cleanTarget = target.trim();
      const page = getPageByStem(cleanTarget);
      const label = (alias ?? cleanTarget).trim();
      if (!page) return `*${label}*`;
      return `[${label}](${page.route})`;
    }
  );

  return withWikiLinks;
}

export async function renderMarkdownToHtml(markdown: string): Promise<string> {
  const preprocessed = resolveWikiLinksAndEmbeds(markdown);

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeStringify)
    .process(preprocessed);

  return String(file);
}
