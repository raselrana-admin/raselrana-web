import Link from "next/link";

const SITEMAP = [
  { label: "About", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "Skills", href: "/skills" },
  { label: "Projects", href: "/projects" },
  { label: "Achievements", href: "/achievements" },
  { label: "Education", href: "/education" },
  { label: "Publications", href: "/publications" },
  { label: "Blog", href: "/blog" },
  { label: "Downloads", href: "/downloads" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--ink)] text-[var(--paper)]">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <p className="font-[family-name:var(--font-display)] text-xl font-semibold">
              Rasel Rana
            </p>
            <p className="mt-3 max-w-xs font-[family-name:var(--font-body)] text-sm text-[var(--paper)]/70">
              Manager (Technical), BTCL — writing and building at the
              intersection of telecommunications and electrical engineering.
            </p>
          </div>

          <div>
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wide text-[var(--paper)]/50">
              Sitemap
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
              {SITEMAP.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-[family-name:var(--font-body)] text-sm text-[var(--paper)]/80 hover:text-[var(--pulse)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wide text-[var(--paper)]/50">
              Connect
            </p>
            <ul className="mt-3 space-y-2 font-[family-name:var(--font-body)] text-sm text-[var(--paper)]/80">
              <li>
                <a
                  href="mailto:contact@raselrana.com.bd"
                  className="hover:text-[var(--pulse)]"
                >
                  contact@raselrana.com.bd
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/raselrana"
                  className="hover:text-[var(--pulse)]"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-2 border-t border-[var(--paper)]/15 pt-6 font-[family-name:var(--font-mono)] text-xs text-[var(--paper)]/50 sm:flex-row sm:items-center">
          <span>
            © {new Date().getFullYear()} Rasel Rana. All rights reserved.
          </span>
          <span>Dhaka, Bangladesh — 23.8103° N, 90.4125° E</span>
        </div>
      </div>
    </footer>
  );
}
