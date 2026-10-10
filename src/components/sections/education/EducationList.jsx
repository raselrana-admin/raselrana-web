// `groups` is [{ title, items }]; a group with no items is not shown.
export default function EducationList({ groups }) {
  const shown = groups.filter((group) => group.items.length > 0);

  if (shown.length === 0) {
    return (
      <section className="border-t border-[var(--line)] py-16 md:py-20">
        <p className="mx-auto max-w-6xl px-6 text-[var(--slate)]">
          Qualifications will be added here soon.
        </p>
      </section>
    );
  }

  return shown.map((group) => (
    <section key={group.title} className="border-t border-[var(--line)] py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-display text-2xl font-medium text-[var(--ink)]">{group.title}</h2>
        <ol className="reveal mt-10 space-y-10">
          {group.items.map((item) => (
            <li key={item.id} className="border-l-2 border-[var(--signal)] pl-6">
              {item.period && (
                <p className="font-mono text-xs text-[var(--slate)]">{item.period}</p>
              )}
              <h3 className="mt-1 font-display text-lg font-medium text-[var(--ink)]">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-[var(--slate)]">{item.institution}</p>
              {item.details && (
                <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-[var(--slate)]">
                  {item.details}
                </p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  ));
}
