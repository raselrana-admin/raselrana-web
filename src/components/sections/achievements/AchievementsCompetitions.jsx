import Link from "next/link";
import CloudImage from "@/components/ui/CloudImage";
import { LinkTypes } from "@/components/ui/ExternalLinks";

const placementStyle = {
  Champion: "border-[var(--signal)] text-[var(--signal)]",
  "1st Runner-up": "border-[var(--ink)] text-[var(--ink)]",
  "2nd Runner-up": "border-[var(--slate)] text-[var(--slate)]",
};

const placementRank = { Champion: 0, "1st Runner-up": 1, "2nd Runner-up": 2 };

const byRankThenNewest = (a, b) =>
  (placementRank[a.placement] ?? 9) - (placementRank[b.placement] ?? 9) ||
  b.sortDate.localeCompare(a.sortDate);

function PlacementBadge({ placement }) {
  return (
    <span
      className={`inline-block rounded-full border px-3 py-1 font-mono text-xs ${
        placementStyle[placement] ?? "border-[var(--slate)] text-[var(--slate)]"
      }`}
    >
      {placement}
    </span>
  );
}

export default function AchievementsCompetitions({ competitions, press }) {
  const sorted = [...competitions].sort(byRankThenNewest);
  const champions = sorted.filter((c) => c.placement === "Champion");
  const others = sorted.filter((c) => c.placement !== "Champion");

  return (
    <section className="border-t border-[var(--line)] py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
          Competitions
        </h2>

        {champions.length > 0 && (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {champions.map((c) => {
              const clip = press.find((p) => p.competition === c.slug);
              return (
                <Link
                  key={c.slug}
                  href={`/achievements/${c.slug}`}
                  className="group flex flex-col rounded-2xl border border-[var(--signal)] bg-[color-mix(in_srgb,var(--signal)_6%,var(--surface))] p-7 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--signal)]"
                >
                  {c.cover && (
                    <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-xl border border-[var(--line)]">
                      <CloudImage
                        image={c.cover}
                        alt={c.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 560px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-4">
                    <PlacementBadge placement={c.placement} />
                    <span className="font-mono text-xs text-[var(--slate)]">
                      {c.displayDate}
                    </span>
                  </div>
                  <h3 className="mt-8 font-display text-2xl text-[var(--ink)] md:text-3xl">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--slate)]">
                    Organized by {c.organizer}
                  </p>
                  {clip && (
                    <p className="mt-1 text-sm text-[var(--slate)]">
                      Covered by {clip.outlet}, {clip.date}
                    </p>
                  )}
                  <LinkTypes links={c.links} />
                  <span className="mt-8 text-sm text-[var(--signal)] group-hover:underline">
                    Read the full story
                  </span>
                </Link>
              );
            })}
          </div>
        )}

        {others.length > 0 && (
          <ul className="mt-10 divide-y divide-[var(--line)] border-y border-[var(--line)]">
            {others.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/achievements/${c.slug}`}
                  className="group grid grid-cols-1 gap-2 py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--signal)] md:grid-cols-[9rem_1fr_9rem] md:items-center md:gap-6"
                >
                  <div>
                    <PlacementBadge placement={c.placement} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-[var(--ink)] group-hover:text-[var(--signal)]">
                      {c.title}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--slate)]">
                      {c.organizer}
                    </p>
                    <LinkTypes links={c.links} />
                  </div>
                  <p className="font-mono text-xs text-[var(--slate)] md:text-right">
                    {c.displayDate}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
