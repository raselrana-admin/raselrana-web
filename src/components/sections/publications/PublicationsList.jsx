export default function PublicationsList({ publications }) {
  if (publications.length === 0) {
    return (
      <section className="border-t border-[var(--line)] py-16 md:py-20">
        <p className="mx-auto max-w-6xl px-6 text-[var(--slate)]">
          Publications will be added here soon.
        </p>
      </section>
    );
  }

  return (
    <section className="border-t border-[var(--line)] py-16 md:py-20">
      <ul className="reveal mx-auto max-w-6xl divide-y divide-[var(--line)] px-6">
        {publications.map((item) => (
          <li key={item.id} className="py-6 first:pt-0">
            <p className="font-mono text-xs text-[var(--slate)]">
              {item.venue} · {item.year}
            </p>
            <h2 className="mt-1 font-display text-lg font-medium text-[var(--ink)]">
              {item.title}
            </h2>
            {item.summary && (
              <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-[var(--slate)]">
                {item.summary}
              </p>
            )}
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm text-[var(--signal)] hover:underline"
              >
                Read the publication ↗
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
