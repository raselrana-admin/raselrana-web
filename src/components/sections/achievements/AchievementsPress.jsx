export default function AchievementsPress({ press, competitions }) {
  return (
    <section className="bg-[var(--paper)] py-20">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="font-display text-2xl text-[var(--ink)] md:text-3xl">
          Press and recognition
        </h2>

        <div className="mt-10 space-y-5">
          {press.map((item) => {
            const related = item.competition
              ? competitions.find((c) => c.slug === item.competition)
              : null;
            return (
              <a
                key={item.id ?? item.url}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl border border-[var(--line)] p-5 transition-colors hover:border-[var(--signal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--signal)]"
              >
                <p className="font-mono text-xs text-[var(--slate)]">
                  {item.outlet}, {item.date}
                </p>
                <p className="mt-2 font-display text-lg text-[var(--ink)] group-hover:text-[var(--signal)]">
                  {item.headline}
                </p>
                {related && (
                  <p className="mt-2 text-sm text-[var(--slate)]">
                    About {related.title} ({related.placement})
                  </p>
                )}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
