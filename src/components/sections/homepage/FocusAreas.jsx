import SectionHeader from "@/components/ui/SectionHeader";
import { focusAreas } from "@/lib/data/home";

export default function FocusAreas() {
  return (
    <section className="border-t border-[var(--line)] py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          eyebrow="Focus areas"
          heading="What I work on"
          href="/skills"
          linkLabel="All skills"
        />

        {/* gap-px over a line-coloured background draws hairlines between cells */}
        <div className="reveal mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
          {focusAreas.map((area) => (
            <div key={area.title} className="bg-[var(--surface)] p-7">
              <span className="font-mono text-xs text-[var(--signal)]">
                {area.label}
              </span>
              <h3 className="mt-6 font-display text-xl font-medium text-[var(--ink)]">
                {area.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--slate)]">
                {area.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
