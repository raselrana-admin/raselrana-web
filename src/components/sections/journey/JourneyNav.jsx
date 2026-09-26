"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export default function JourneyNav({ stages }) {
  const [activeId, setActiveId] = useState(stages[0]?.id);
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top of the viewport among those
        // currently intersecting, so the nav highlight tracks scroll
        // position smoothly rather than jumping around.
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          const topMost = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          setActiveId(topMost.target.id);
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );

    stages.forEach((stage) => {
      const el = document.getElementById(stage.id);
      if (el) observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [stages]);

  return (
    <nav
      aria-label="Journey stages"
      className="sticky top-24 hidden h-fit w-48 shrink-0 flex-col gap-1 lg:flex"
    >
      {stages.map((stage) => {
        const active = stage.id === activeId;
        return (
          <a
            key={stage.id}
            href={`#${stage.id}`}
            className="relative py-2 pl-4 font-[family-name:var(--font-mono)] text-xs uppercase tracking-wide text-[var(--slate)] transition-colors hover:text-[var(--ink)]"
          >
            {active && (
              <motion.span
                layoutId="journey-nav-active"
                className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 bg-[var(--signal)]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className={active ? "text-[var(--ink)]" : ""}>
              {stage.title}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
