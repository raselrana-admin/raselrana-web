/**
 * PageHeader — plain eyebrow / heading / intro block for simple content
 * pages (Projects, Skills, Education, Publications). No motion.
 */
export default function PageHeader({ eyebrow, heading, intro }) {
  return (
    <section className="border-b border-[var(--line)] bg-[var(--paper)]">
      <div className="mx-auto max-w-3xl px-6 py-20 md:py-24">
        {eyebrow && (
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-[var(--signal)]">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold text-[var(--ink)] md:text-5xl">
          {heading}
        </h1>
        {intro && (
          <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-[var(--slate)]">
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}
