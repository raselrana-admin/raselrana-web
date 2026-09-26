"use client";

import { publicationsPreview } from "@/lib/data/home";
import { motion } from "motion/react";
import Link from "next/link";

export default function PublicationsPreview() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-xs tracking-[0.2em] text-[var(--signal)]">
            PUBLICATIONS
          </p>
          <Link
            href="/publications"
            className="font-mono text-sm text-[var(--slate)] hover:text-[var(--signal)]"
          >
            All publications →
          </Link>
        </div>

        <div className="mt-8 divide-y divide-[var(--line)]">
          {publicationsPreview.map((pub, i) => (
            <motion.div
              key={pub.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                href={pub.href}
                className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between"
              >
                <span className="text-base text-[var(--ink)]">{pub.title}</span>
                <span className="font-mono text-xs text-[var(--slate)]">
                  {pub.venue} · {pub.year}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
