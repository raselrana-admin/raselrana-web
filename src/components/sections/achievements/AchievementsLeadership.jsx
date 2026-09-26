import { leadership } from "@/lib/data/achievements";

export default function AchievementsLeadership() {
  return (
    <section className="border-y border-[var(--line)] bg-[var(--paper)] py-20">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="font-display text-2xl text-[var(--ink)] md:text-3xl">
          Leadership
        </h2>

        <div className="mt-10 space-y-8">
          {leadership.map((role) => (
            <div
              key={role.role}
              className="border-l-2 border-[var(--signal)] pl-6"
            >
              <p className="font-mono text-xs text-[var(--slate)]">
                {role.period}
              </p>
              <h3 className="mt-1 font-display text-lg text-[var(--ink)]">
                {role.role}, {role.org}
              </h3>
              <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-[var(--slate)]">
                {role.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
