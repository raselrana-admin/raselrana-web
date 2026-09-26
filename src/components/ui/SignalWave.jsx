"use client";

import { motion } from "motion/react";

/**
 * SignalWave — the site's signature mark.
 *
 * variant="hero"   → large, draws itself on load, faint ambient pulse loop
 * variant="divider"→ thin full-width trace used between sections
 *
 * Colors are read from CSS vars (--signal / --pulse) so the mark adapts
 * automatically to light/dark without any extra classes.
 *
 * NOTE: if you already have a SignalWave implementation wired into the
 * Navbar, compare the two and keep whichever is more complete — this one
 * adds a "divider" variant for use between homepage sections, so you may
 * want to merge that variant into your existing component instead of
 * having two files.
 */
export default function SignalWave({ variant = "hero", className = "" }) {
  if (variant === "divider") {
    return (
      <div className={`relative h-px w-full overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-[var(--line)]" />
        <motion.div
          className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[var(--pulse)]"
          initial={{ left: "-2%" }}
          animate={{ left: "102%" }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut",
          }}
        />
      </div>
    );
  }

  // Hand-authored path: a carrier signal that settles into a clean,
  // regular sine — a small visual thesis for "engineering brings signal
  // out of noise."
  const path =
    "M0,60 L20,60 L28,30 L36,90 L44,45 L52,75 L60,60 " +
    "C 90,60 90,20 120,20 C 150,20 150,100 180,100 " +
    "C 210,100 210,20 240,20 C 270,20 270,100 300,100 " +
    "C 330,100 330,20 360,20 C 390,20 390,60 420,60 L440,60";

  return (
    <svg
      viewBox="0 0 440 120"
      className={className}
      role="img"
      aria-label="Signal waveform settling from noise into a clean sine wave"
    >
      <motion.path
        d={path}
        fill="none"
        stroke="var(--line)"
        strokeWidth="1"
        opacity="0.6"
      />
      <motion.path
        d={path}
        fill="none"
        stroke="var(--signal)"
        strokeWidth="2.5"
        strokeLinecap="round"
        pathLength={1}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.2, ease: "easeInOut" }}
      />
      <motion.circle
        r="4"
        fill="var(--pulse)"
        initial={{ offsetDistance: "0%", opacity: 0 }}
        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 3,
          delay: 2.4,
          repeat: Infinity,
          repeatDelay: 1.5,
          ease: "linear",
        }}
        style={{ offsetPath: `path("${path}")` }}
      />
    </svg>
  );
}
