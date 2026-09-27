"use client";

import { motion } from "motion/react";
import { experienceIntro } from "@/lib/data/experience";

export default function ExperienceHero() {
  const { eyebrow, heading, summary } = experienceIntro;

  return (
    <section className="px-6 pt-32 pb-16 md:pt-40 md:pb-20">
      <div className="mx-auto max-w-3xl">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-3 font-mono text-sm text-[var(--signal)]"
        >
          {eyebrow}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-display text-4xl leading-tight text-[var(--ink)] md:text-5xl"
        >
          {heading}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-5 max-w-[60ch] text-lg leading-relaxed text-[var(--slate)]"
        >
          {summary}
        </motion.p>
      </div>
    </section>
  );
}
