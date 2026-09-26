"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { featuredProjects } from "@/lib/data/home";

export default function ProjectsPreview() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-xs tracking-[0.2em] text-[var(--signal)]">
            FEATURED PROJECTS
          </p>
          <Link
            href="/projects"
            className="font-mono text-sm text-[var(--slate)] hover:text-[var(--signal)]"
          >
            All projects →
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {featuredProjects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                href={project.href}
                className="group block h-full rounded-2xl border border-[var(--line)] p-6 transition-colors hover:border-[var(--signal)]"
              >
                <span className="font-mono text-xs text-[var(--pulse)]">
                  {project.tag}
                </span>
                <h3 className="mt-3 font-display text-lg text-[var(--ink)]">
                  {project.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--slate)]">
                  {project.description}
                </p>
                <span className="mt-4 inline-block font-mono text-xs text-[var(--signal)] opacity-0 transition-opacity group-hover:opacity-100">
                  View project →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
