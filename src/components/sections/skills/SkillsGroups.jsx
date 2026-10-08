export default function SkillsGroups({ groups }) {
  if (groups.length === 0) {
    return (
      <section className="border-t border-[var(--line)] py-16 md:py-20">
        <p className="mx-auto max-w-6xl px-6 text-[var(--slate)]">
          Skills will be added here soon.
        </p>
      </section>
    );
  }

  return (
    <section className="border-t border-[var(--line)] py-16 md:py-20">
      <div className="reveal mx-auto grid max-w-6xl gap-10 px-6 sm:grid-cols-2 lg:grid-cols-4">
        {groups.map((group) => (
          <div key={group.id} className="border-t-2 border-[var(--signal)] pt-4">
            <h2 className="font-display text-lg font-medium text-[var(--ink)]">
              {group.title}
            </h2>
            <ul className="mt-3 space-y-2">
              {(group.items ?? []).map((item) => (
                <li key={item} className="text-sm leading-relaxed text-[var(--slate)]">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
