import SectionHeader from "@/components/ui/SectionHeader";

export default function AboutFocus({ heading, principles }) {
  if (principles.length === 0) return null;

  return (
    <section className="border-t border-[var(--line)] py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader eyebrow="Approach" heading={heading} />

        <div className="reveal mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {principles.map((item, i) => (
            <div
              key={item.id}
              className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-7"
            >
              <span className="font-mono text-xs text-[var(--signal)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-6 font-display text-xl font-medium text-[var(--ink)]">
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
