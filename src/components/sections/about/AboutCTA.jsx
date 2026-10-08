import { aboutCTA } from "@/lib/data/about";
import Link from "next/link";

// The heading and text come from Dashboard → About; the two buttons stay in
// lib/data/about.js.
export default function AboutCTA({ heading, description }) {
  return (
    <section className="border-t border-[var(--line)] py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="reveal flex flex-col items-start gap-8 rounded-3xl border border-[var(--line)] bg-[var(--surface)] px-8 py-10 md:flex-row md:items-center md:justify-between md:px-12 md:py-12">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--ink)] md:text-3xl">
              {heading}
            </h2>
            {description && <p className="mt-2 text-[var(--slate)]">{description}</p>}
          </div>

          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              href={aboutCTA.primaryCta.href}
              className="rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-medium text-[var(--paper)] transition-opacity hover:opacity-90"
            >
              {aboutCTA.primaryCta.label}
            </Link>
            <Link
              href={aboutCTA.secondaryCta.href}
              className="rounded-full border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--ink)] transition-colors hover:border-[var(--signal)] hover:text-[var(--signal)]"
            >
              {aboutCTA.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
