import SectionHeader from "@/components/ui/SectionHeader";
import { aboutStory } from "@/lib/data/about";

export default function AboutStory() {
  return (
    <section className="border-t border-[var(--line)] py-20 md:py-24">
      <div className="reveal mx-auto grid max-w-6xl items-start gap-10 px-6 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <SectionHeader eyebrow="Story" heading={aboutStory.heading} />
        <div className="space-y-6">
          {aboutStory.paragraphs.map((para, i) => (
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
