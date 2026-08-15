import Link from "next/link";
import { getDepartmentGroups } from "@/lib/content";
import SidebarNav from "@/components/SidebarNav";

/**
 * Server component: fetches the nav tree (grouped by department, from the
 * top-level SOPs/ folders) and hands it to the client-side collapsible nav.
 */
export default function Sidebar() {
  const groups = getDepartmentGroups();

  return (
    <nav className="w-64 shrink-0 bg-navy-deep border-r border-navy-soft p-4 overflow-y-auto h-full">
      <Link
        href="/"
        className="block font-serif font-bold mb-4 text-sm uppercase tracking-wide text-cream"
      >
        SA SOP Handbook
      </Link>
      <SidebarNav groups={groups} />
    </nav>
  );
}
