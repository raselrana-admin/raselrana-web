export default function EducationList({ items }) {
  if (items.length === 0) {
    return (
      <section className="border-t border-[var(--line)] py-16 md:py-20">
        <p className="mx-auto max-w-6xl px-6 text-[var(--slate)]">
          Qualifications will be added here soon.
        </p>
      </section>
    );
  }

  return (
    <section className="border-t border-[var(--line)] py-16 md:py-20">
      <ol className="reveal mx-auto max-w-6xl space-y-10 px-6">
        {items.map((item) => (
          <li key={item.id} className="border-l-2 border-[var(--signal)] pl-6">
            {item.period && (
              <p className="font-mono text-xs text-[var(--slate)]">{item.period}</p>
            )}
            <h2 className="mt-1 font-display text-lg font-medium text-[var(--ink)]">
              {item.degree}
            </h2>
            <p className="mt-1 text-sm text-[var(--slate)]">{item.institution}</p>
            {item.details && (
              <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-[var(--slate)]">
                {item.details}
              </p>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
