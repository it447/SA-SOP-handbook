import Link from "next/link";
import {
  getDepartmentGroups,
  getDepartmentLabel,
  getDisplayTitle,
  getFeaturedPage,
} from "@/lib/content";
import SidebarNav from "@/components/SidebarNav";

/**
 * Server component: fetches the nav tree (grouped by department, from the
 * top-level SOPs/ folders) and hands it to the client-side collapsible nav.
 * Labels/titles are resolved here (where fs-backed lib/content is safe to
 * import) into plain strings before crossing into the client component.
 */
export default function Sidebar() {
  const groups = getDepartmentGroups().map((group) => ({
    department: group.department,
    label: getDepartmentLabel(group.department),
    pages: group.pages.map((page) => ({
      route: page.route,
      title: getDisplayTitle(page),
    })),
  }));
  const featured = getFeaturedPage();

  return (
    <nav className="w-64 shrink-0 bg-navy-deep border-r border-navy-soft p-4 overflow-y-auto h-full">
      <Link
        href="/"
        className="block font-serif font-bold mb-4 text-sm uppercase tracking-wide text-cream"
      >
        SA SOP Handbook
      </Link>
      {featured && (
        <Link
          href={featured.route}
          className="block mb-4 rounded border border-orange/40 bg-orange/10 px-3 py-2 text-sm font-medium text-orange hover:bg-orange/20"
        >
          {getDisplayTitle(featured)}
        </Link>
      )}
      <SidebarNav groups={groups} />
    </nav>
  );
}
