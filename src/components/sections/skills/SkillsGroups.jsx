import { skillGroups } from "@/lib/data/skills";

export default function SkillsGroups() {
  return (
    <section className="bg-[var(--paper)] py-16">
      <div className="mx-auto grid max-w-3xl gap-10 px-6 sm:grid-cols-2">
        {skillGroups.map((group) => (
          <div key={group.id} className="border-t-2 border-[var(--signal)] pt-4">
            <h2 className="font-[family-name:var(--font-display)] text-lg text-[var(--ink)]">
              {group.title}
            </h2>
            <ul className="mt-3 space-y-2">
              {group.items.map((item) => (
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
