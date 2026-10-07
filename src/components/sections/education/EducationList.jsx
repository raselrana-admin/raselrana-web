import { education } from "@/lib/data/education";

export default function EducationList() {
  return (
    <section className="bg-[var(--paper)] py-16">
      <ol className="mx-auto max-w-3xl space-y-10 px-6">
        {education.map((item) => (
          <li key={item.id} className="border-l-2 border-[var(--signal)] pl-6">
            <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--slate)]">
              {item.period}
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-lg text-[var(--ink)]">
              {item.degree}
            </h2>
            <p className="mt-1 text-sm text-[var(--slate)]">{item.institution}</p>
            {item.details && (
              <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-[var(--slate)]">
                {item.details}
              </p>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
