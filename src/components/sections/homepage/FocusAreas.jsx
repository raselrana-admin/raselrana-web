"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { focusAreas } from "@/lib/data/home";

export default function FocusAreas() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-xs tracking-[0.2em] text-[var(--signal)]">
            FOCUS AREAS
          </p>
          <Link
            href="/skills"
            className="font-mono text-sm text-[var(--slate)] hover:text-[var(--signal)]"
          >
            All skills →
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2">
          {focusAreas.map((area, i) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-[var(--paper)] p-7"
            >
              <span className="font-mono text-xs text-[var(--slate)]">
                {area.label}
              </span>
              <h3 className="mt-3 font-display text-xl text-[var(--ink)]">
                {area.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--slate)]">
                {area.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
