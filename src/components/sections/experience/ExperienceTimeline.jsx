// `organizations` is [{ organization, sector, positions: [role, …] }],
// built in views/experience/ExperienceView.jsx.
export default function ExperienceTimeline({ organizations }) {
  return (
    <>
      {organizations.map((org) => (
        <section
          key={org.organization}
          className="border-t border-[var(--line)] py-16 md:py-20"
        >
          <div className="mx-auto grid max-w-6xl items-start gap-10 px-6 lg:grid-cols-[1fr_2fr] lg:gap-16">
            {/* Organization — the anchor that separates one employer from the next */}
            <div className="lg:sticky lg:top-24">
              {org.sector && (
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--signal)]">
                  {org.sector}
                </p>
              )}
              <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-[var(--ink)] md:text-3xl">
                {org.organization}
              </h2>
            </div>

            <ol className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
              {org.positions.map((position) => (
                <li key={position.id} className="reveal py-8">
                  <p className="font-mono text-sm text-[var(--slate)]">
                    {position.start} — {position.end || "Present"}
                  </p>

                  <h3 className="mt-2 font-display text-xl font-medium text-[var(--ink)]">
                    {position.role}
                  </h3>

                  <p className="mt-1 text-sm text-[var(--slate)]">
                    {[position.location, position.employmentType]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>

                  {position.summary && (
                    <p className="mt-4 max-w-[60ch] leading-relaxed text-[var(--ink)]">
                      {position.summary}
                    </p>
                  )}

                  {position.responsibilities?.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {position.responsibilities.map((item) => (
                        <li
                          key={item}
                          className="flex max-w-[60ch] gap-3 text-sm leading-relaxed text-[var(--slate)]"
                        >
                          <span
                            aria-hidden
                            className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--signal)]"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>
      ))}
    </>
  );
}
