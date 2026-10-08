export default function ProjectsList({ projects }) {
  if (projects.length === 0) {
    return (
      <section className="border-t border-[var(--line)] py-16 md:py-20">
        <p className="mx-auto max-w-6xl px-6 text-[var(--slate)]">
          Projects will be added here soon.
        </p>
      </section>
    );
  }

  return (
    <section className="border-t border-[var(--line)] py-16 md:py-20">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <article
            key={project.id}
            // The home page links to /projects#<id>
            id={project.id}
            className="reveal flex scroll-mt-24 flex-col rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-7"
          >
            <p className="font-mono text-xs text-[var(--signal)]">
              {project.category}
              {project.period ? ` · ${project.period}` : ""}
            </p>
            <h2 className="mt-3 font-display text-xl font-medium text-[var(--ink)]">
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
                    className="rounded-full border border-[var(--line)] px-3 py-1 font-mono text-xs text-[var(--slate)]"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto pt-6 text-sm text-[var(--signal)] hover:underline"
              >
                Learn more ↗
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
