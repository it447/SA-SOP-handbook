import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * Content indexing over the SOPs/ Obsidian vault.
 *
 * SOPs/ lives at the repo root, one level above this Next.js app. All reads
 * here happen at request time (or build time for static params) — never
 * bundled — so the vault can be edited without rebuilding the app's JS.
 */

export const CONTENT_ROOT = path.join(process.cwd(), "SOPs");

export interface PageFrontmatter {
  title: string;
  department?: string;
  category?: string;
  owner?: string;
  last_updated?: string;
  /** When true, this page is excluded from the site entirely (nav, search,
   * and the wiki route itself 404s) but still embedded for the chatbot to
   * use as knowledge — see docs/ for the access-control caveat on this. */
  hidden?: boolean;
}

export interface PageHeading {
  depth: number;
  text: string;
  slug: string;
}

export interface PageEntry {
  /** Route slug segments, e.g. ["hr", "payroll-sop"] */
  slugParts: string[];
  /** Route path, e.g. "/hr/payroll-sop" */
  route: string;
  /** Absolute path to the source markdown file. */
  filePath: string;
  /** Path relative to SOPs/, e.g. "hr/payroll-sop.md" */
  relPath: string;
  /** File name stem, e.g. "payroll-sop" — used for wikilink resolution. */
  stem: string;
  frontmatter: PageFrontmatter;
  headings: PageHeading[];
  /** Raw markdown body (frontmatter stripped). */
  body: string;
}

function walkMarkdownFiles(dir: string): string[] {
  const out: string[] = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkMarkdownFiles(full));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      out.push(full);
    }
  }
  return out;
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function extractHeadings(body: string): PageHeading[] {
  const headings: PageHeading[] = [];
  const lines = body.split("\n");
  for (const line of lines) {
    const match = /^(#{1,6})\s+(.*)$/.exec(line.trim());
    if (match) {
      const depth = match[1].length;
      const text = match[2].trim();
      headings.push({ depth, text, slug: slugifyHeading(text) });
    }
  }
  return headings;
}

function fileToSlugParts(relPath: string): string[] {
  const withoutExt = relPath.replace(/\.md$/i, "");
  return withoutExt.split(path.sep).filter(Boolean);
}

let cachedIndex: PageEntry[] | null = null;

/**
 * Build (and memoize) the full content index by walking SOPs/**\/*.md.
 * Cheap enough to rebuild per-process; memoized to avoid repeated disk I/O
 * within a single server lifetime. Not cached across builds/deploys.
 */
export function getContentIndex(): PageEntry[] {
  if (cachedIndex) return cachedIndex;

  const files = walkMarkdownFiles(CONTENT_ROOT);
  const entries: PageEntry[] = files.map((filePath) => {
    const relPath = path.relative(CONTENT_ROOT, filePath);
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = matter(raw);
    const slugParts = fileToSlugParts(relPath);
    const stem = path.basename(relPath, path.extname(relPath));

    const fm = parsed.data as Record<string, unknown>;
    // gray-matter's YAML parser turns unquoted dates like `2026-07-20` into
    // JS Date objects, not strings — normalize back to a plain string so
    // frontmatter is always safely renderable (e.g. directly in JSX).
    const toStringOrUndefined = (value: unknown): string | undefined => {
      if (value === undefined || value === null) return undefined;
      if (value instanceof Date) return value.toISOString().slice(0, 10);
      return String(value);
    };

    const frontmatter: PageFrontmatter = {
      title: toStringOrUndefined(fm.title) || stem,
      department: toStringOrUndefined(fm.department),
      category: toStringOrUndefined(fm.category),
      owner: toStringOrUndefined(fm.owner),
      last_updated: toStringOrUndefined(fm.last_updated),
      hidden: fm.hidden === true,
    };

    return {
      slugParts,
      route: "/" + slugParts.join("/"),
      filePath,
      relPath,
      stem,
      frontmatter,
      headings: extractHeadings(parsed.content),
      body: parsed.content,
    };
  });

  cachedIndex = entries;
  return entries;
}

/** Clears the memoized index — useful for scripts/tests that run long-lived. */
export function invalidateContentIndex(): void {
  cachedIndex = null;
  cachedOutgoing = null;
  cachedBacklinks = null;
}

/** All pages the site itself should ever list, nav, or search — excludes
 * `hidden: true` pages, which are chatbot-knowledge-only (see PageFrontmatter). */
export function getVisibleContentIndex(): PageEntry[] {
  return getContentIndex().filter((entry) => !entry.frontmatter.hidden);
}

export function getPageBySlugParts(slugParts: string[]): PageEntry | undefined {
  const target = slugParts.join("/");
  // Hidden pages 404 like any nonexistent route — not just absent from nav.
  return getVisibleContentIndex().find((entry) => entry.slugParts.join("/") === target);
}

/** Find a page by filename stem (case-insensitive) — used for wikilink resolution. */
export function getPageByStem(stem: string): PageEntry | undefined {
  const target = stem.toLowerCase();
  return getContentIndex().find((entry) => entry.stem.toLowerCase() === target);
}

/** Every `[[Note]]` / `[[Note|Alias]]` / `![[Note]]` target stem referenced in
 * a page's raw body, matching the same syntax lib/markdown.ts resolves for
 * rendering. Used to build the note-to-note link graph. */
function extractWikilinkStems(body: string): string[] {
  const stems: string[] = [];
  const pattern = /!?\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(body)) !== null) {
    stems.push(match[1].trim());
  }
  return stems;
}

let cachedOutgoing: Map<string, PageEntry[]> | null = null;
let cachedBacklinks: Map<string, PageEntry[]> | null = null;

function buildLinkGraph(): { outgoing: Map<string, PageEntry[]>; backlinks: Map<string, PageEntry[]> } {
  if (cachedOutgoing && cachedBacklinks) {
    return { outgoing: cachedOutgoing, backlinks: cachedBacklinks };
  }

  const index = getContentIndex();
  const outgoing = new Map<string, PageEntry[]>();
  const backlinks = new Map<string, PageEntry[]>();

  for (const page of index) {
    const targets: PageEntry[] = [];
    for (const stem of extractWikilinkStems(page.body)) {
      const target = getPageByStem(stem);
      // Skip self-links and anything that failed to resolve.
      if (!target || target.relPath === page.relPath) continue;
      targets.push(target);

      const existingBacklinks = backlinks.get(target.relPath) ?? [];
      existingBacklinks.push(page);
      backlinks.set(target.relPath, existingBacklinks);
    }
    outgoing.set(page.relPath, targets);
  }

  cachedOutgoing = outgoing;
  cachedBacklinks = backlinks;
  return { outgoing, backlinks };
}

/** Pages this page's wikilinks point to, in the order they first appear. */
export function getOutgoingLinks(page: PageEntry): PageEntry[] {
  return buildLinkGraph().outgoing.get(page.relPath) ?? [];
}

/** Pages elsewhere in the vault that link to this page via a wikilink. */
export function getBacklinks(page: PageEntry): PageEntry[] {
  return buildLinkGraph().backlinks.get(page.relPath) ?? [];
}

/** Related SOPs for site navigation: the union of a page's outgoing links
 * and its backlinks, deduplicated, with hidden pages filtered out (they
 * aren't linkable from the public site regardless of which direction the
 * link graph found them from). */
export function getRelatedPages(page: PageEntry): PageEntry[] {
  const combined = [...getOutgoingLinks(page), ...getBacklinks(page)];
  const seen = new Set<string>();
  const related: PageEntry[] = [];
  for (const candidate of combined) {
    if (candidate.frontmatter.hidden) continue;
    if (seen.has(candidate.relPath)) continue;
    seen.add(candidate.relPath);
    related.push(candidate);
  }
  return related;
}

export interface DepartmentGroup {
  department: string;
  pages: PageEntry[];
}

/** Folder name -> department slug excluded from normal browsable groups (its
 * one note is surfaced as a pinned/featured link instead — see
 * FEATURED_STEM below). */
const FEATURED_DEPARTMENT = "sopsop";
const FEATURED_STEM = "how-to-write-an-sop";
const FEATURED_TITLE = "How to Write an SOP at Scale Army";

/** Department folder name -> full display label. Anything not listed here
 * falls back to replacing hyphens with spaces and capitalizing each word. */
const DEPARTMENT_LABELS: Record<string, string> = {
  hr: "Human Resources",
  it: "Information Technology",
};

export function getDepartmentLabel(department: string): string {
  if (DEPARTMENT_LABELS[department]) return DEPARTMENT_LABELS[department];
  return department
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Display title for a page: the one SOP-writing-guide note gets a fixed
 * featured title (set in the vault's frontmatter or not, doesn't matter —
 * this always wins for that specific note); every other note has the
 * standalone word "SOP" stripped from its title for display, without
 * touching the underlying frontmatter/vault content.
 */
export function getDisplayTitle(page: PageEntry): string {
  if (page.stem === FEATURED_STEM) return FEATURED_TITLE;
  return page.frontmatter.title
    .replace(/\bSOP\b\s*:?/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s:–-]+|[\s:–-]+$/g, "")
    .trim();
}

/** The pinned "how to write an SOP" note, surfaced outside the normal
 * department groups as a featured link. */
export function getFeaturedPage(): PageEntry | undefined {
  return getContentIndex().find((entry) => entry.stem === FEATURED_STEM);
}

/** Group pages by their top-level SOPs/ folder (the "department"), excluding
 * the featured SOP-writing-guide note's own folder (surfaced separately via
 * getFeaturedPage()). */
export function getDepartmentGroups(): DepartmentGroup[] {
  const index = getVisibleContentIndex();
  const groups = new Map<string, PageEntry[]>();

  for (const entry of index) {
    const dept = entry.slugParts[0] ?? "misc";
    if (dept === FEATURED_DEPARTMENT) continue;
    const list = groups.get(dept) ?? [];
    list.push(entry);
    groups.set(dept, list);
  }

  return Array.from(groups.entries())
    .map(([department, pages]) => ({
      department,
      // Glossary pages pin to the top of each department's list (usually the
      // first thing someone wants when opening a department they're less
      // familiar with); everything else sorts alphabetically after that.
      pages: pages.sort((a, b) => {
        const aGlossary = a.frontmatter.category?.toLowerCase() === "glossary";
        const bGlossary = b.frontmatter.category?.toLowerCase() === "glossary";
        if (aGlossary !== bGlossary) return aGlossary ? -1 : 1;
        return getDisplayTitle(a).localeCompare(getDisplayTitle(b));
      }),
    }))
    .sort((a, b) => a.department.localeCompare(b.department));
}
