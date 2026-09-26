import { aboutFocus } from "@/lib/data/about";

export default function AboutFocus() {
  return (
    <section className="border-y border-[var(--line)] bg-[var(--paper)] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-display text-2xl text-[var(--ink)] md:text-3xl">
          {aboutFocus.heading}
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {aboutFocus.principles.map((item) => (
            <div
              key={item.title}
              className="border-t-2 border-[var(--signal)] pt-4"
            >
              <h3 className="font-display text-lg text-[var(--ink)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--slate)]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
