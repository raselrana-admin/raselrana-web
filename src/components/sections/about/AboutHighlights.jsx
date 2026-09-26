import { aboutHighlights } from "@/lib/data/about";

export default function AboutHighlights() {
  return (
    <section className="bg-[var(--paper)] py-20">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="font-display text-2xl text-[var(--ink)] md:text-3xl">
          {aboutHighlights.heading}
        </h2>

        <ol className="mt-10 space-y-10">
          {aboutHighlights.timeline.map((item, i) => (
            <li key={item.title} className="relative pl-12">
              <span className="absolute left-0 top-0 font-mono text-sm text-[var(--signal)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="font-mono text-xs text-[var(--slate)]">
                {item.year}
              </p>
              <h3 className="mt-1 font-display text-lg text-[var(--ink)]">
                {item.title}
              </h3>
              <p className="text-sm text-[var(--slate)]">{item.org}</p>
              <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-[var(--slate)]">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
