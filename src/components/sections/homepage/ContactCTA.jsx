"use client";

import { SignalWave } from "@/components";
import { contactCta } from "@/lib/data/home";
import { motion } from "motion/react";
import Link from "next/link";

export default function ContactCTA() {
  return (
    <section className="px-6 pb-28 pt-8">
      <SignalWave variant="divider" className="mx-auto mb-16 max-w-5xl" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-2xl text-center"
      >
        <h2 className="font-display text-3xl text-[var(--ink)] sm:text-4xl">
          {contactCta.heading}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-[var(--slate)]">
          {contactCta.body}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="rounded-full bg-[var(--ink)] px-6 py-3 font-mono text-sm text-[var(--paper)] transition-opacity hover:opacity-90"
          >
            Contact form
          </Link>
          <a
            href={`mailto:${contactCta.email}`}
            className="rounded-full border border-[var(--line)] px-6 py-3 font-mono text-sm text-[var(--ink)] transition-colors hover:border-[var(--signal)] hover:text-[var(--signal)]"
          >
            {contactCta.email}
          </a>
        </div>
      </motion.div>
    </section>
  );
}
