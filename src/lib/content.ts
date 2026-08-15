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

/** Group pages by their top-level SOPs/ folder (the "department"). */
export function getDepartmentGroups(): DepartmentGroup[] {
  const index = getContentIndex();
  const groups = new Map<string, PageEntry[]>();

  for (const entry of index) {
    const dept = entry.slugParts[0] ?? "misc";
    const list = groups.get(dept) ?? [];
    list.push(entry);
    groups.set(dept, list);
  }

  return Array.from(groups.entries())
    .map(([department, pages]) => ({
      department,
      pages: pages.sort((a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title)),
    }))
    .sort((a, b) => a.department.localeCompare(b.department));
}
