"use client";

import { SignalWave } from "@/components";
import { profile } from "@/lib/data/home";
import { motion } from "motion/react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-28 sm:pt-36">
      <div className="mx-auto max-w-5xl">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-xs tracking-[0.2em] text-[var(--signal)]"
        >
          {profile.meta}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-5 font-display text-5xl leading-[1.05] text-[var(--ink)] sm:text-6xl md:text-7xl"
        >
          {profile.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-3 font-display text-xl text-[var(--slate)] sm:text-2xl"
        >
          {profile.role} · {profile.org}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-[var(--slate)] sm:text-lg"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <Link
            href="/experience"
            className="rounded-full bg-[var(--ink)] px-6 py-3 font-mono text-sm text-[var(--paper)] transition-opacity hover:opacity-90"
          >
            View experience
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-[var(--line)] px-6 py-3 font-mono text-sm text-[var(--ink)] transition-colors hover:border-[var(--signal)] hover:text-[var(--signal)]"
          >
            Get in touch
          </Link>
        </motion.div>

        <p className="mt-8 font-mono text-xs text-[var(--slate)]">
          {profile.location}
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mx-auto mt-16 max-w-3xl"
      >
        <SignalWave variant="hero" className="w-full text-[var(--ink)]" />
      </motion.div>
    </section>
  );
}
