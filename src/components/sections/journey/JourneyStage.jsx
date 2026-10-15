import RichText from "@/components/ui/RichText";

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
      {stage.summary && <p className="mt-2 text-[var(--slate)]">{stage.summary}</p>}

      {/* The text is stored whole; an empty line starts a new paragraph */}
      <RichText
        text={stage.body}
        spacing="space-y-4"
        className="mt-6 max-w-[65ch] leading-relaxed text-[var(--ink)]"
      />
    </section>
  );
}
