// The portfolio as a web page. `portfolio` comes from buildPortfolio() in
// lib/portfolio.js; the PDF (lib/pdf/PortfolioPdf.jsx) shows the same data.
export default function PortfolioDocument({ portfolio }) {
  const { header, summaries, sections } = portfolio;

  return (
    <section className="border-t border-[var(--line)] py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <article className="reveal mx-auto max-w-4xl rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-7 sm:p-10 md:p-14">
          <header className="border-b border-[var(--line)] pb-8">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
              {header.name}
            </h2>
            <p className="mt-2 text-[var(--slate)]">
              {[header.role, header.org].filter(Boolean).join(" · ")}
            </p>
            {header.contacts.length > 0 && (
              <p className="mt-4 font-mono text-xs leading-relaxed text-[var(--slate)]">
                {header.contacts.join("  ·  ")}
              </p>
            )}
          </header>

          {summaries.map((block) => (
            <section key={block.id} className="border-b border-[var(--line)] py-8">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--signal)]">
                {block.heading}
              </h3>
              <p className="mt-4 max-w-[70ch] whitespace-pre-line leading-relaxed text-[var(--ink)]">
                {block.text}
              </p>
            </section>
          ))}

          {sections.map((section) => (
            <section
              key={section.name}
              className="border-b border-[var(--line)] py-8 last:border-b-0 last:pb-0"
            >
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--signal)]">
                {section.name}
              </h3>

              <div className="mt-6 space-y-8">
                {section.items.map((item) => (
                  <div key={item.id}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                      <h4 className="font-display text-lg font-medium text-[var(--ink)]">
                        {item.title}
                      </h4>
                      {item.period && (
                        <p className="font-mono text-xs text-[var(--slate)]">{item.period}</p>
                      )}
                    </div>
                    {item.subtitle && (
                      <p className="mt-1 text-sm text-[var(--signal)]">{item.subtitle}</p>
                    )}
                    {item.description && (
                      <p className="mt-3 max-w-[70ch] whitespace-pre-line text-sm leading-relaxed text-[var(--slate)]">
                        {item.description}
                      </p>
                    )}
                    {item.points?.length > 0 && (
                      <ul className="mt-3 space-y-2">
                        {item.points.map((point) => (
                          <li
                            key={point}
                            className="flex max-w-[70ch] gap-3 text-sm leading-relaxed text-[var(--slate)]"
                          >
                            <span
                              aria-hidden
                              className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--signal)]"
                            />
                            {point}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </article>
      </div>
    </section>
  );
}
