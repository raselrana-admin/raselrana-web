import { ArrowUpRight, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { badgeClass, cardClass, eyebrowClass } from "@/components/admin/styles";
import { requireAdmin } from "@/lib/auth/session";
import { getOverview } from "@/lib/services/content-service";

export const dynamic = "force-dynamic";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminOverviewPage() {
  const session = await requireAdmin();

  let overview;
  try {
    overview = await getOverview();
  } catch (err) {
    console.error("[admin] Failed to load overview:", err);
    return (
      <p role="alert" className="text-sm text-[var(--danger)]">
        Could not reach the database. Check MONGODB_URI and try again.
      </p>
    );
  }

  const drafts = overview.modules.reduce((sum, m) => sum + m.drafts, 0);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--ink)]">
          Welcome back, {session.name}
        </h1>
        <p className="mt-2 text-sm text-[var(--slate)]">
          Here is what is on your site right now.
        </p>
      </div>

      <section aria-label="Content">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {overview.modules.map((mod) => (
            <Link
              key={mod.key}
              href={`/admin/${mod.key}`}
              className={`${cardClass} group p-6 transition-colors hover:border-[var(--signal)]`}
            >
              <div className="flex items-start justify-between">
                <p className={eyebrowClass}>{mod.label}</p>
                <ArrowUpRight
                  size={16}
                  aria-hidden
                  className="text-[var(--slate)] transition-colors group-hover:text-[var(--signal)]"
                />
              </div>
              <p className="mt-4 font-display text-4xl font-semibold tracking-tight text-[var(--ink)]">
                {mod.total}
              </p>
              <p className="mt-1 text-sm text-[var(--slate)]">
                {mod.total === 1 ? "entry" : "entries"}
                {mod.drafts > 0 ? ` · ${mod.drafts} draft${mod.drafts === 1 ? "" : "s"}` : ""}
              </p>
            </Link>
          ))}

          <div className={`${cardClass} p-6`}>
            <p className={eyebrowClass}>File downloads</p>
            <p className="mt-4 font-display text-4xl font-semibold tracking-tight text-[var(--signal)]">
              {overview.totalDownloads}
            </p>
            <p className="mt-1 text-sm text-[var(--slate)]">
              total, across all documents{drafts > 0 ? ` · ${drafts} drafts across the site` : ""}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={`${cardClass} p-6`}>
          <h2 className="font-display text-lg font-semibold text-[var(--ink)]">Recently edited</h2>
          {overview.recent.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--slate)]">Nothing edited yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-[var(--line)]">
              {overview.recent.map((entry) => (
                <li key={`${entry.moduleKey}-${entry.id}`} className="py-3">
                  <Link
                    href={`/admin/${entry.moduleKey}`}
                    className="group flex items-baseline justify-between gap-4"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-[var(--ink)] group-hover:text-[var(--signal)]">
                        {entry.title}
                      </span>
                      <span className="text-xs text-[var(--slate)]">
                        {entry.moduleLabel} · {entry.typeLabel}
                      </span>
                    </span>
                    <span className="shrink-0 font-mono text-xs text-[var(--slate)]">
                      {formatDate(entry.updatedAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={`${cardClass} p-6`}>
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-[var(--ink)]">
            Sample content remaining
            <span className={`${badgeClass} border-[var(--line)] text-[var(--slate)]`}>
              {overview.sample.length}
            </span>
          </h2>
          {overview.sample.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--slate)]">
              No sample text found in the dashboard content.
            </p>
          ) : (
            <>
              <p className="mt-2 flex items-start gap-2 text-sm text-[var(--slate)]">
                <TriangleAlert size={16} aria-hidden className="mt-0.5 shrink-0" />
                These entries still contain sample or placeholder text. Replace or delete them
                before going live.
              </p>
              <ul className="mt-4 max-h-72 divide-y divide-[var(--line)] overflow-y-auto">
                {overview.sample.map((entry) => (
                  <li key={`${entry.moduleKey}-${entry.id}`} className="py-3">
                    <Link href={`/admin/${entry.moduleKey}`} className="group block">
                      <span className="block truncate text-sm font-medium text-[var(--ink)] group-hover:text-[var(--signal)]">
                        {entry.title}
                      </span>
                      <span className="text-xs text-[var(--slate)]">
                        {entry.moduleLabel} · {entry.typeLabel}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
