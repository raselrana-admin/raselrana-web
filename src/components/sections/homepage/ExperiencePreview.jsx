import SectionHeader from "@/components/ui/SectionHeader";

export default function ExperiencePreview({ items }) {
  if (items.length === 0) return null;

  return (
    <section className="border-t border-[var(--line)] py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          eyebrow="Experience"
          heading="Where I've worked"
          href="/experience"
          linkLabel="Full history"
        />

        <ol className="reveal mt-12 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {items.map((item) => (
            <li
              key={item.id}
              className="grid gap-2 py-8 md:grid-cols-[1fr_2fr] md:gap-16"
            >
              <p className="font-mono text-sm text-[var(--slate)]">
                {item.period}
              </p>
              <div>
                <h3 className="font-display text-xl font-medium text-[var(--ink)]">
                  {item.role}
                </h3>
                <p className="mt-1 text-sm text-[var(--signal)]">{item.org}</p>
                <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-[var(--slate)]">
                  {item.summary}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
