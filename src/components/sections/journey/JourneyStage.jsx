"use client";

import { motion } from "motion/react";

export default function JourneyStage({ stage }) {
  return (
    <motion.section
      id={stage.id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4 }}
      // scroll-mt offsets the anchor jump so the sticky navbar doesn't
      // cover the section heading when navigated to via the side nav
      className="scroll-mt-24 border-b border-[var(--line)] py-10 first:pt-0 last:border-b-0"
    >
      <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wide text-[var(--signal)]">
        {stage.era}
      </span>
      <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--ink)]">
        {stage.title}
      </h2>
      <p className="mt-1 text-sm text-[var(--slate)]">{stage.summary}</p>

      <div className="mt-4 space-y-3">
        {stage.body.map((paragraph, i) => (
          <p key={i} className="text-sm leading-relaxed text-[var(--ink)]">
            {paragraph}
          </p>
        ))}
      </div>
    </motion.section>
  );
}
