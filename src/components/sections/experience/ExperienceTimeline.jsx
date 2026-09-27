"use client";

import { motion } from "motion/react";
import { experienceOrganizations } from "@/lib/data/experience";

function formatPeriod(period) {
  return `${period.start} — ${period.end ?? "Present"}`;
}

export default function ExperienceTimeline() {
  return (
    <section className="px-6 pb-20">
      <div className="mx-auto max-w-3xl space-y-16">
        {experienceOrganizations.map((org, orgIndex) => (
          <motion.div
            key={org.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, delay: orgIndex * 0.05 }}
          >
            {/* Organization header — the visual anchor that separates the two employers */}
            <div className="mb-6 border-b border-[var(--line)] pb-3">
              <h2 className="font-display text-2xl text-[var(--ink)]">
                {org.organization}
              </h2>
              {org.sector && (
                <p className="mt-1 font-mono text-sm text-[var(--signal)]">
                  {org.sector}
                </p>
              )}
            </div>

            <ol className="relative border-l border-[var(--line)] pl-8">
              {org.positions.map((position) => (
                <li key={position.id} className="mb-10 last:mb-0">
                  <span
                    aria-hidden
                    className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full bg-[var(--pulse)]"
                  />

                  <p className="font-mono text-sm text-[var(--slate)]">
                    {formatPeriod(position.period)}
                  </p>

                  <h3 className="mt-1 font-display text-xl text-[var(--ink)]">
                    {position.role}
                  </h3>

                  <p className="mt-0.5 text-[var(--slate)]">
                    {position.location}
                    {position.employmentType ? ` · ${position.employmentType}` : ""}
                  </p>

                  {position.summary && (
                    <p className="mt-3 max-w-[60ch] leading-relaxed text-[var(--ink)]">
                      {position.summary}
                    </p>
                  )}

                  {position.responsibilities?.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {position.responsibilities.map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 text-[var(--slate)] leading-relaxed"
                        >
                          <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-[var(--pulse)]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
