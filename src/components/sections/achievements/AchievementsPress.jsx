import { press } from "@/lib/data/achievements";

export default function AchievementsPress() {
  return (
    <section className="bg-[var(--paper)] py-20">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="font-display text-2xl text-[var(--ink)] md:text-3xl">
          Press &amp; recognition
        </h2>

        <div className="mt-10 space-y-6">
          {press.map((item) => (
            <a
              key={item.headline}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border border-[var(--line)] p-5 transition-colors hover:border-[var(--signal)]"
            >
              <p className="font-mono text-xs text-[var(--slate)]">
                {item.outlet} · {item.date}
              </p>
              <p className="mt-1 text-sm text-[var(--ink)]">{item.headline}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
