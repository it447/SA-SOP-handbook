import Link from "next/link";
import Sidebar from "@/components/Sidebar";

export default function HomePage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
        <div className="max-w-xl text-center">
          <h1 className="text-3xl font-serif font-bold mb-4 text-cream">
            Welcome to Scale Army's SOP Handbook
          </h1>
          <p className="text-cream-dim mb-8">
            Your go to resource for Scale Army's policies, processes, and best practices. Browse
            by department or search for exactly what you need, and if you can't find it, just ask
            our assistant.
          </p>
          <Link
            href="/search"
            className="inline-block rounded bg-orange text-cream px-6 py-3 text-sm font-medium hover:bg-orange-dark"
          >
            Search for SOPs
          </Link>
        </div>
      </main>
    </div>
  );
}
