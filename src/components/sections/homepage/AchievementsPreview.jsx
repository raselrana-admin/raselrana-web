"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { achievementsPreview } from "@/lib/data/home";

export default function AchievementsPreview() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-xs tracking-[0.2em] text-[var(--signal)]">
            ACHIEVEMENTS
          </p>
          <Link
            href="/achievements"
            className="font-mono text-sm text-[var(--slate)] hover:text-[var(--signal)]"
          >
            All achievements →
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {achievementsPreview.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-[var(--line)] p-6"
            >
              {item.stat && (
                <p className="font-display text-4xl text-[var(--signal)]">
                  {item.stat}
                </p>
              )}
              <p className="mt-1 font-mono text-xs text-[var(--slate)]">
                {item.year}
              </p>
              <h3 className="mt-3 font-display text-lg text-[var(--ink)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--slate)]">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
