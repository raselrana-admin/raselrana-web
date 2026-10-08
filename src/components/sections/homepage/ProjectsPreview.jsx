import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";

export default function ProjectsPreview({ projects }) {
  if (projects.length === 0) return null;

  return (
    <section className="border-t border-[var(--line)] py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          eyebrow="Featured projects"
          heading="Selected work"
          href="/projects"
          linkLabel="All projects"
        />

        <div className="reveal mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={project.href}
              className="group flex h-full flex-col rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-7 transition-colors hover:border-[var(--signal)]"
            >
              <span className="font-mono text-xs text-[var(--signal)]">
                {project.tag}
              </span>
              <h3 className="mt-6 font-display text-xl font-medium text-[var(--ink)]">
                {project.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--slate)]">
                {project.description}
              </p>
              <span className="mt-auto pt-8 font-mono text-xs text-[var(--slate)] transition-colors group-hover:text-[var(--signal)]">
                View project →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
