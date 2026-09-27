"use client";

import { experienceSkills } from "@/lib/data/experience";

export default function ExperienceSkills() {
  if (!experienceSkills?.length) return null;

  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-3xl border-t border-[var(--line)] pt-10">
        <h2 className="font-display text-2xl text-[var(--ink)]">
          Tools & systems
        </h2>

        <div className="mt-5 flex flex-wrap gap-2">
          {experienceSkills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-[var(--line)] px-3 py-1 font-mono text-sm text-[var(--slate)]"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
