import Link from "next/link";
import { contactCta } from "@/lib/data/home";

export default function ContactCTA() {
  return (
    <section className="border-t border-[var(--line)] py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Inverted panel: ink background with paper text, in both themes */}
        <div className="reveal rounded-3xl bg-[var(--ink)] px-8 py-14 text-[var(--paper)] md:px-16 md:py-20">
          <p className="font-mono text-xs uppercase tracking-[0.2em] opacity-60">
            Contact
          </p>
          <h2 className="mt-4 max-w-[18ch] font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            {contactCta.heading}
          </h2>
          <p className="mt-5 max-w-[48ch] text-base leading-relaxed opacity-75 md:text-lg">
            {contactCta.body}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-[var(--paper)] px-6 py-3 text-sm font-medium text-[var(--ink)] transition-opacity hover:opacity-90"
            >
              Contact form
            </Link>
            <a
              href={`mailto:${contactCta.email}`}
              className="rounded-full border border-current px-6 py-3 text-sm font-medium opacity-80 transition-opacity hover:opacity-100"
            >
              {contactCta.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
