import { publications } from "@/lib/data/publications";

export default function PublicationsList() {
  return (
    <section className="bg-[var(--paper)] py-16">
      <ul className="mx-auto max-w-3xl divide-y divide-[var(--line)] px-6">
        {publications.map((item) => (
          <li key={item.id} className="py-6">
            <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--slate)]">
              {item.venue} · {item.year}
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-lg text-[var(--ink)]">
              {item.title}
            </h2>
            {item.summary && (
              <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-[var(--slate)]">
                {item.summary}
              </p>
            )}
            {/^https?:\/\//i.test(item.url || "") && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm text-[var(--signal)] hover:underline"
              >
                Read the publication
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
