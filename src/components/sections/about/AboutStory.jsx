import SectionHeader from "@/components/ui/SectionHeader";

export default function AboutStory({ heading, paragraphs }) {
  if (paragraphs.length === 0) return null;

  return (
    <section className="border-t border-[var(--line)] py-20 md:py-24">
      <div className="reveal mx-auto grid max-w-6xl items-start gap-10 px-6 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <SectionHeader eyebrow="Story" heading={heading} />
        <div className="space-y-6">
          {paragraphs.map((para, i) => (
            <p
              key={i}
              className="max-w-[65ch] text-lg leading-relaxed text-[var(--slate)]"
            >
              {para}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
