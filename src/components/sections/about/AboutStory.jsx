import { aboutStory } from "@/lib/data/about";

export default function AboutStory() {
  return (
    <section className="bg-[var(--paper)] py-20">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="font-display text-2xl text-[var(--ink)] md:text-3xl">
          {aboutStory.heading}
        </h2>
        <div className="mt-6 space-y-5">
          {aboutStory.paragraphs.map((para, i) => (
            <p
              key={i}
              className="max-w-[70ch] text-base leading-relaxed text-[var(--slate)]"
            >
              {para}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
