import { SignalWave } from "@/components";
import { achievementsHero, getFeaturedPress } from "@/lib/data/achievements";

export default function AchievementsHero() {
  const featured = getFeaturedPress();

  return (
    <section className="border-b border-[var(--line)] bg-[var(--paper)]">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <h1 className="font-display text-4xl text-[var(--ink)] md:text-5xl">
          {achievementsHero.heading}
        </h1>
        <p className="mt-4 max-w-[60ch] text-lg text-[var(--slate)]">
          {achievementsHero.intro}
        </p>

        {featured && (
          <a
            href={featured.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-12 block max-w-2xl border-l-2 border-[var(--signal)] py-1 pl-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--signal)]"
          >
            <p className="text-sm text-[var(--slate)]">
              Featured in{" "}
              <span className="font-medium text-[var(--ink)]">
                {featured.outlet}
              </span>
              , {featured.date}
            </p>
            <p className="mt-2 font-display text-xl text-[var(--ink)] group-hover:text-[var(--signal)] md:text-2xl">
              {featured.headline}
            </p>
            <p className="mt-3 text-sm text-[var(--signal)] group-hover:underline">
              Read the article
            </p>
          </a>
        )}
      </div>

      <SignalWave variant="divider" />
    </section>
  );
}
