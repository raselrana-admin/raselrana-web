"use client";

import { motion } from "motion/react";

export default function DownloadsHero() {
  return (
    <section className="mx-auto max-w-4xl px-6 pt-20 pb-4 text-center">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-[var(--signal)]"
      >
        Downloads
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--ink)] sm:text-4xl"
      >
        Portfolio &amp; Documents
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mx-auto mt-3 max-w-lg text-sm text-[var(--slate)]"
      >
        Grab a copy of my professional portfolio, or save my contact card
        directly to your device.
      </motion.p>
    </section>
  );
}
