"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { aboutPreview } from "@/lib/data/home";

export default function AboutPreview() {
  return (
    <section className="px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl"
      >
        <p className="font-mono text-xs tracking-[0.2em] text-[var(--signal)]">
          ABOUT
        </p>
        <p className="mt-4 text-xl leading-relaxed text-[var(--ink)] sm:text-2xl">
          {aboutPreview.body}
        </p>
        <Link
          href={aboutPreview.href}
          className="mt-6 inline-flex items-center gap-2 font-mono text-sm text-[var(--signal)] hover:underline"
        >
          Read full profile →
        </Link>
      </motion.div>
    </section>
  );
}
