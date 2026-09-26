import { competitions } from "@/lib/data/achievements";
import Link from "next/link";

const placementStyle = {
  Champion: "border-[var(--signal)] text-[var(--signal)]",
  "1st Runner-up": "border-[var(--ink)] text-[var(--ink)]",
  "2nd Runner-up": "border-[var(--slate)] text-[var(--slate)]",
};

export default function AchievementsCompetitions() {
  return (
    <section className="bg-[var(--paper)] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-display text-2xl text-[var(--ink)] md:text-3xl">
          Competitions
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {competitions.map((c) => (
            <Link
              key={c.slug}
              href={`/achievements/${c.slug}`}
              className="group block rounded-2xl border border-[var(--line)] p-6 transition-colors hover:border-[var(--signal)]"
            >
              <span
                className={`inline-block rounded-full border px-3 py-1 text-xs font-mono ${
                  placementStyle[c.placement] ??
                  "border-[var(--slate)] text-[var(--slate)]"
                }`}
              >
                {c.placement}
              </span>
              <h3 className="mt-4 font-display text-lg text-[var(--ink)]">
                {c.title}
              </h3>
              <p className="mt-1 font-mono text-xs text-[var(--slate)]">
                {c.organizer} · {c.year}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--slate)]">
                {c.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
