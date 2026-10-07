export default function JourneyStage({ stage }) {
  return (
    <section
      id={stage.id}
      // scroll-mt offsets the anchor jump so the sticky navbar doesn't
      // cover the section heading when navigated to via the side nav
      className="reveal scroll-mt-24 border-b border-[var(--line)] py-12 first:pt-0 last:border-b-0 last:pb-0"
    >
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--signal)]">
        {stage.era}
      </span>
      <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-[var(--ink)] md:text-3xl">
        {stage.title}
      </h2>
      <p className="mt-2 text-[var(--slate)]">{stage.summary}</p>

      <div className="mt-6 space-y-4">
        {stage.body.map((paragraph, i) => (
          <p key={i} className="max-w-[65ch] leading-relaxed text-[var(--ink)]">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
