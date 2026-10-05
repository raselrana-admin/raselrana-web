import Link from "next/link";
import { judging } from "@/lib/data/achievements";
import { LinkTypes } from "@/components/ui/ExternalLinks";

export default function AchievementsJudging() {
  if (judging.length === 0) return null;

  return (
    <section className="bg-[var(--paper)] py-20">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="font-display text-2xl text-[var(--ink)] md:text-3xl">
          Judging &amp; mentoring
        </h2>

        <div className="mt-10 space-y-8">
          {judging.map((j) => (
            <Link
              key={j.slug}
              href={`/achievements/${j.slug}`}
              className="group block border-l-2 border-[var(--pulse)] pl-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--signal)]"
            >
              <span className="inline-block rounded-full border border-[var(--pulse)] px-3 py-1 font-mono text-xs text-[var(--pulse)]">
                {j.role}
              </span>
              <h3 className="mt-3 font-display text-lg text-[var(--ink)] group-hover:text-[var(--signal)]">
                {j.title}
              </h3>
              <p className="mt-1 font-mono text-xs text-[var(--slate)]">
                {j.organizer} · {j.displayDate}
              </p>
              {j.description && (
                <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-[var(--slate)]">
                  {j.description}
                </p>
              )}
              <LinkTypes links={j.links} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
