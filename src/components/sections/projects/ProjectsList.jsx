import { projects } from "@/lib/data/projects";

export default function ProjectsList() {
  return (
    <section className="bg-[var(--paper)] py-16">
      <div className="mx-auto grid max-w-3xl gap-6 px-6">
        {projects.map((project) => (
          <article
            key={project.id}
            id={project.id}
            className="scroll-mt-24 rounded-2xl border border-[var(--line)] p-6"
          >
            <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--pulse)]">
              {project.tag}
              {project.period ? ` · ${project.period}` : ""}
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
              {project.title}
            </h2>
            <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-[var(--slate)]">
              {project.description}
            </p>
            {project.tags?.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-[var(--line)] px-3 py-1 font-[family-name:var(--font-mono)] text-xs text-[var(--slate)]"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
