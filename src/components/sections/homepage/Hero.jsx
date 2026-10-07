import Link from "next/link";
import NetworkMap from "@/components/ui/NetworkMap";
import { profile } from "@/lib/data/home";

/**
 * Hero — name and positioning on the left, the animated NetworkMap on the
 * right (large screens only), and a strip of key facts underneath. Text
 * rises in with a CSS-only stagger (.rise), so it never waits on JavaScript.
 * Shares the max-w-6xl container with the navbar so the page has one left edge.
 */
export default function Hero() {
  const { name, role, org, location, tagline, meta } = profile;

  const focus = meta
    ? meta
        .split("·")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const facts = [
    { label: "Role", value: role },
    { label: "Organization", value: org },
    { label: "Based in", value: location },
  ];

  return (
    <section className="hero-glow relative overflow-hidden">
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pt-16 pb-16 md:pt-24 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16 lg:pb-20">
        <div>
          <p className="rise flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--slate)]">
            <span aria-hidden className="h-px w-10 bg-[var(--signal)]" />
            {role}
          </p>

          <h1
            className="rise mt-6 font-display text-5xl font-semibold leading-[0.95] tracking-tight text-[var(--ink)] sm:text-7xl lg:text-8xl"
            style={{ "--delay": "80ms" }}
          >
            {name}
          </h1>

          <p
            className="rise mt-8 max-w-[52ch] text-lg leading-relaxed text-[var(--slate)] md:text-xl"
            style={{ "--delay": "160ms" }}
          >
            {tagline}
          </p>

          {focus.length > 0 && (
            <ul className="rise mt-8 flex flex-wrap gap-2" style={{ "--delay": "240ms" }}>
              {focus.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-[var(--line)] px-3 py-1 font-mono text-xs text-[var(--slate)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}

          <div
            className="rise mt-10 flex flex-wrap items-center gap-4"
            style={{ "--delay": "320ms" }}
          >
            <Link
              href="/experience"
              className="rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-medium text-[var(--paper)] transition-opacity hover:opacity-90"
            >
              View experience
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--ink)] transition-colors hover:border-[var(--signal)] hover:text-[var(--signal)]"
            >
              Get in touch
            </Link>
          </div>
        </div>

        <NetworkMap className="hidden w-full lg:block" />
      </div>

      <div className="relative border-y border-[var(--line)]">
        <dl className="mx-auto grid max-w-6xl grid-cols-1 gap-x-10 gap-y-6 px-6 py-8 sm:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--slate)]">
                {fact.label}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-[var(--ink)]">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
