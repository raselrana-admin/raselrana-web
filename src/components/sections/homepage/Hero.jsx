"use client";

import { motion } from "motion/react";
import { profile } from "@/lib/data/home";

/**
 * Hero — full-width, two-column layout. The outer section has no max-width
 * wrapper, so it spans the full viewport; only the text block is capped for
 * readable line length. The step-trace becomes a larger side panel instead
 * of a small strip under the CTAs — still a single draw-once animation.
 */
export default function Hero() {
  const { name, role, org, location, tagline, meta } = profile;

  const tags = meta ? meta.split("·").map((t) => t.trim()).filter(Boolean) : [];

  return (
    <section className="w-full px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-20 lg:px-20">
      <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        {/* Text column */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-[family-name:var(--font-mono)] text-sm text-[var(--slate)]"
          >
            {role} · {org} · {location}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-4 font-[family-name:var(--font-display)] text-5xl leading-[1.05] text-[var(--ink)] md:text-6xl lg:text-7xl"
          >
            {name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 max-w-[58ch] text-lg leading-relaxed text-[var(--slate)]"
          >
            {tagline}
          </motion.p>

          {tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-6 flex flex-wrap gap-2"
            >
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[var(--line)] px-3 py-1 font-[family-name:var(--font-mono)] text-xs text-[var(--slate)]"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 flex flex-wrap items-center gap-6"
          >
            <a
              href="/experience"
              className="rounded-md bg-[var(--ink)] px-5 py-2.5 text-[var(--paper)] transition-opacity hover:opacity-90"
            >
              View experience
            </a>
            <a
              href="/contact"
              className="text-[var(--ink)] underline decoration-[var(--line)] underline-offset-4 transition-colors hover:decoration-[var(--signal)]"
            >
              Get in touch
            </a>
          </motion.div>
        </div>

        {/* Signature panel — grid of faint reference lines with the
            step-trace drawn once across it, larger and more architectural
            than a thin strip. Hidden on mobile to keep the layout clean. */}
        <div className="relative hidden aspect-square w-full lg:block">
          <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden>
            {/* faint grid */}
            {[80, 160, 240, 320].map((pos) => (
              <line
                key={`h-${pos}`}
                x1="0"
                y1={pos}
                x2="400"
                y2={pos}
                stroke="var(--line)"
                strokeWidth="1"
              />
            ))}
            {[80, 160, 240, 320].map((pos) => (
              <line
                key={`v-${pos}`}
                x1={pos}
                y1="0"
                x2={pos}
                y2="400"
                stroke="var(--line)"
                strokeWidth="1"
              />
            ))}

            {/* step-trace, drawn once on load */}
            <motion.path
              d="M0,320 H80 V240 H160 V120 H280 V80 H400"
              fill="none"
              stroke="var(--signal)"
              strokeWidth="2.5"
              strokeLinecap="round"
              pathLength={1}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.6, delay: 0.4, ease: "easeInOut" }}
            />

            {/* node markers at each step corner */}
            {[
              { cx: 80, cy: 320 },
              { cx: 80, cy: 240 },
              { cx: 160, cy: 240 },
              { cx: 160, cy: 120 },
              { cx: 280, cy: 120 },
              { cx: 280, cy: 80 },
            ].map((point, i) => (
              <motion.circle
                key={`${point.cx}-${point.cy}`}
                cx={point.cx}
                cy={point.cy}
                r="4"
                fill="var(--pulse)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.18 }}
              />
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}
