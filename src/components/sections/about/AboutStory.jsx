import RichText from "@/components/ui/RichText";
import SectionHeader from "@/components/ui/SectionHeader";
import { toParagraphs } from "@/lib/text";

export default function AboutStory({ heading, text }) {
  if (toParagraphs(text).length === 0) return null;

  return (
    <section className="border-t border-[var(--line)] py-20 md:py-24">
      <div className="reveal mx-auto grid max-w-6xl items-start gap-10 px-6 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <SectionHeader eyebrow="Story" heading={heading} />
        <RichText
          text={text}
          spacing="space-y-6"
          className="max-w-[65ch] text-lg leading-relaxed text-[var(--slate)]"
        />
      </div>
    </section>
  );
}
