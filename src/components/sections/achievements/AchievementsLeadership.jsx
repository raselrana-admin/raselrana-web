import { affiliations, leadership } from "@/lib/data/achievements";
import ExternalLinks from "@/components/ui/ExternalLinks";

export default function AchievementsLeadership() {
  return (
    <section className="border-y border-[var(--line)] bg-[var(--paper)] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-display text-2xl text-[var(--ink)] md:text-3xl">
          Leadership
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
          {leadership.map((item) => (
            <div
              key={`${item.role}-${item.org}`}
              className="border-l-2 border-[var(--signal)] pl-6"
            >
              <p className="font-mono text-xs text-[var(--slate)]">
                {item.period}
              </p>
              <h3 className="mt-1 font-display text-lg text-[var(--ink)]">
                {item.role}
              </h3>
              <p className="mt-1 text-sm text-[var(--slate)]">{item.org}</p>
              {item.description && (
                <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-[var(--slate)]">
                  {item.description}
                </p>
              )}
              <ExternalLinks links={item.links} />
            </div>
          ))}
        </div>

        {affiliations.length > 0 && (
          <div className="mt-16 border-t border-[var(--line)] pt-8">
            <h3 className="font-display text-lg text-[var(--ink)]">
              Professional memberships
            </h3>
            <ul className="mt-4 flex flex-wrap gap-3">
              {affiliations.map((a) => (
                <li
                  key={a.org}
                  className="rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--slate)]"
                >
                  <span className="text-[var(--ink)]">{a.org}</span>, {a.status}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
