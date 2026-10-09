export const metadata = {
  title: "Rasel Rana — Under development",
  description:
    "The personal site of Rasel Rana, Manager (Technical) at BTCL, is being rebuilt. Please check back soon.",
};

const EMAIL = "contact@raselrana.com.bd";

// Shown for every address while the site is being rebuilt (see src/proxy.js).
export default function UnderDevelopmentPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6">
      <header className="flex items-center gap-3 py-8">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          aria-hidden="true"
          className="shrink-0"
        >
          <rect width="32" height="32" rx="8" fill="var(--ink)" />
          <g
            fill="none"
            stroke="var(--paper)"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 24V8h6.25a4.5 4.5 0 0 1 0 9H11" />
            <path d="M16 17l3.9 5" />
          </g>
          <circle cx="21.6" cy="24" r="2.3" fill="var(--paper)" />
        </svg>
        <span className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--ink)]">
          Rasel Rana
        </span>
      </header>

      <div className="flex flex-1 flex-col justify-center py-16">
        <p className="flex items-center gap-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-[var(--signal)]">
          <span
            aria-hidden="true"
            className="h-2 w-2 animate-pulse rounded-full bg-[var(--pulse)]"
          />
          Under development
        </p>

        <h1 className="mt-6 max-w-[18ch] font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.08] tracking-tight text-[var(--ink)] sm:text-5xl md:text-6xl">
          This site is being rebuilt.
        </h1>

        <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-[var(--slate)] md:text-lg">
          I am Rasel Rana, Manager (Technical) at BTCL, working in
          telecommunications and electrical and electronic engineering. A new
          version of this site is on the way. Please check back soon.
        </p>

        <div className="mt-10 border-t border-[var(--line)] pt-8">
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-[var(--slate)]">
            Get in touch
          </p>
          <a
            href={`mailto:${EMAIL}`}
            className="mt-3 inline-block font-[family-name:var(--font-display)] text-lg font-medium text-[var(--ink)] underline decoration-[var(--line)] decoration-1 underline-offset-[6px] transition-colors hover:text-[var(--signal)] hover:decoration-[var(--signal)] md:text-xl"
          >
            {EMAIL}
          </a>
        </div>
      </div>

      <footer className="border-t border-[var(--line)] py-6 font-[family-name:var(--font-mono)] text-xs text-[var(--slate)]">
        © {new Date().getFullYear()} Rasel Rana
      </footer>
    </div>
  );
}
