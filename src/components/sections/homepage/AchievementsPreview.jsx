import SectionHeader from "@/components/ui/SectionHeader";
import { achievementsPreview } from "@/lib/data/home";

export default function AchievementsPreview() {
  return (
    <section className="border-t border-[var(--line)] py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          eyebrow="Achievements"
          heading="Recognition"
          href="/achievements"
          linkLabel="All achievements"
        />

        <div className="reveal mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {achievementsPreview.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-7"
            >
              <p className="font-mono text-xs text-[var(--slate)]">
                {item.year}
              </p>
              {item.stat && (
                <p className="mt-4 font-display text-5xl font-semibold tracking-tight text-[var(--signal)]">
                  {item.stat}
                </p>
              )}
              <h3 className="mt-4 font-display text-xl font-medium text-[var(--ink)]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--slate)]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
