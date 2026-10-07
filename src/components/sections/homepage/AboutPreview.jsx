import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import { aboutPreview } from "@/lib/data/home";

export default function AboutPreview() {
  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-6 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <SectionHeader eyebrow="About" heading="Profile" />
        <div>
          <p className="max-w-[60ch] text-xl leading-relaxed text-[var(--ink)] md:text-2xl md:leading-relaxed">
            {aboutPreview.body}
          </p>
          <Link
            href={aboutPreview.href}
            className="mt-8 inline-block font-mono text-sm text-[var(--signal)] hover:underline"
          >
            Read full profile →
          </Link>
        </div>
      </div>
    </section>
  );
}
