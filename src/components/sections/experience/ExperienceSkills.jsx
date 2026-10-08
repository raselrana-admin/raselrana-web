import SectionHeader from "@/components/ui/SectionHeader";

// `skills` is every tool listed on any role, without repeats.
export default function ExperienceSkills({ skills }) {
  if (!skills?.length) return null;

  return (
    <section className="border-t border-[var(--line)] py-16 md:py-20">
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-6 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <SectionHeader eyebrow="Toolkit" heading="Tools & systems" />

        <ul className="reveal flex flex-wrap gap-2">
          {skills.map((skill) => (
            <li
              key={skill}
              className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-1.5 font-mono text-sm text-[var(--slate)]"
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
