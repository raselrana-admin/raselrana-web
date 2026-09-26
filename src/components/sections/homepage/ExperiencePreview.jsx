"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { experiencePreview } from "@/lib/data/home";

export default function ExperiencePreview() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-xs tracking-[0.2em] text-[var(--signal)]">
            EXPERIENCE
          </p>
          <Link
            href="/experience"
            className="font-mono text-sm text-[var(--slate)] hover:text-[var(--signal)]"
          >
            Full history →
          </Link>
        </div>

        <div className="mt-8 border-l border-[var(--line)]">
          {experiencePreview.map((item, i) => (
            <motion.div
              key={item.role + item.period}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative py-6 pl-8"
            >
              <span className="absolute left-[-4.5px] top-8 h-2 w-2 rounded-full bg-[var(--signal)]" />
              <p className="font-mono text-xs text-[var(--slate)]">
                {item.period}
              </p>
              <h3 className="mt-1 font-display text-lg text-[var(--ink)]">
                {item.role}
              </h3>
              <p className="text-sm text-[var(--slate)]">{item.org}</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--slate)]">
                {item.summary}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
