import Link from "next/link";
import { isBlogLink } from "@/lib/zones";

const linkClass =
  "font-mono text-sm text-[var(--slate)] transition-colors hover:text-[var(--signal)]";

/**
 * SectionHeader — eyebrow + heading, with an optional "see all" link on the
 * right. Used by the homepage sections so they share one type scale.
 */
export default function SectionHeader({ eyebrow, heading, href, linkLabel }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--signal)]">
          {eyebrow}
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
          {heading}
        </h2>
      </div>
      {href &&
        (isBlogLink(href) ? (
          // The blog is another app: a normal page load, not an in-app link
          <a href={href} className={linkClass}>
            {linkLabel} →
          </a>
        ) : (
          <Link href={href} className={linkClass}>
            {linkLabel} →
          </Link>
        ))}
    </div>
  );
}
