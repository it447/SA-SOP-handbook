export interface SearchItem {
  title: string;
  route: string;
  department?: string;
}

/**
 * Simple client-side fuzzy search over the page index (title/path). No
 * external search service — this just does a lightweight subsequence/substring
 * match against title and route, scored so closer/earlier matches rank higher.
 * Shared between the quick inline search box and the dedicated /search page.
 */
export function fuzzyScore(query: string, target: string): number {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (q.length === 0) return 0;
  if (t.includes(q)) {
    // Prefer earlier, more exact substring matches.
    return 1000 - t.indexOf(q);
  }
  // Subsequence match: every char of q appears in order in t.
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  if (qi === q.length) return 10;
  return -1;
}

export function searchItems(query: string, items: SearchItem[], limit = 10): SearchItem[] {
  if (!query.trim()) return [];
  return items
    .map((item) => ({
      item,
      score: Math.max(fuzzyScore(query, item.title), fuzzyScore(query, item.route)),
    }))
    .filter((r) => r.score >= 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.item);
}
