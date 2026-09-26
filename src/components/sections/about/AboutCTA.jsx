import { aboutCTA } from "@/lib/data/about";
import Link from "next/link";

export default function AboutCTA() {
  return (
    <section className="border-t border-[var(--line)] bg-[var(--paper)] py-20">
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-6 px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-xl text-[var(--ink)] md:text-2xl">
            {aboutCTA.heading}
          </h2>
          <p className="mt-2 text-sm text-[var(--slate)]">
            {aboutCTA.description}
          </p>
        </div>

        <div className="flex shrink-0 gap-3">
          <Link
            href={aboutCTA.primaryCta.href}
            className="rounded-full border border-[var(--ink)] px-5 py-2 text-sm text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-[var(--paper)]"
          >
            {aboutCTA.primaryCta.label}
          </Link>
          <Link
            href={aboutCTA.secondaryCta.href}
            className="rounded-full bg-[var(--signal)] px-5 py-2 text-sm text-[var(--paper)] transition-opacity hover:opacity-90"
          >
            {aboutCTA.secondaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
