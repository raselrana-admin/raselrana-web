import { SignalWave } from "@/components";
import { achievementsHero } from "@/lib/data/achievements";

export default function AchievementsHero() {
  return (
    <section className="border-b border-[var(--line)] bg-[var(--paper)]">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <h1 className="font-display text-4xl text-[var(--ink)] md:text-5xl">
          {achievementsHero.heading}
        </h1>
        <p className="mt-4 max-w-[60ch] text-lg text-[var(--slate)]">
          {achievementsHero.intro}
        </p>

        <dl className="mt-12 grid grid-cols-2 gap-8 border-t border-[var(--line)] pt-10 md:grid-cols-4">
          {achievementsHero.stats.map((stat) => (
            <div key={stat.label}>
              <dt className="font-display text-3xl text-[var(--signal)] md:text-4xl">
                {stat.value}
              </dt>
              <dd className="mt-1 text-sm text-[var(--slate)]">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <SignalWave variant="divider" />
    </section>
  );
}
