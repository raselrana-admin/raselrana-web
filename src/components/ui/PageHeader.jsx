/**
 * PageHeader — the one header used by every inner page: eyebrow, heading,
 * intro, and an optional slot (children) for page-specific extras. Shares
 * the max-w-6xl container with the navbar. Text rises in via CSS (.rise).
 */
export default function PageHeader({ eyebrow, heading, intro, children }) {
  return (
    <section className="bg-[var(--paper)]">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-16 md:pt-24 md:pb-20">
        {eyebrow && (
          <p className="rise flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--slate)]">
            <span aria-hidden className="h-px w-10 bg-[var(--signal)]" />
            {eyebrow}
          </p>
        )}
        <h1
          className="rise mt-6 max-w-[20ch] font-display text-4xl font-semibold leading-[1.05] tracking-tight text-[var(--ink)] md:text-6xl"
          style={{ "--delay": "80ms" }}
        >
          {heading}
        </h1>
        {intro && (
          <p
            className="rise mt-6 max-w-[60ch] text-lg leading-relaxed text-[var(--slate)] md:text-xl"
            style={{ "--delay": "160ms" }}
          >
            {intro}
          </p>
        )}
        {children && (
          <div className="rise mt-10" style={{ "--delay": "240ms" }}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
