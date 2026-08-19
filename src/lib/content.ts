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
}

export function getPageBySlugParts(slugParts: string[]): PageEntry | undefined {
  const target = slugParts.join("/");
  return getContentIndex().find((entry) => entry.slugParts.join("/") === target);
}

/** Find a page by filename stem (case-insensitive) — used for wikilink resolution. */
export function getPageByStem(stem: string): PageEntry | undefined {
  const target = stem.toLowerCase();
  return getContentIndex().find((entry) => entry.stem.toLowerCase() === target);
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
  const index = getContentIndex();
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
