import Link from "next/link";
import BrandMark from "@/components/ui/BrandMark";
import { footerNav, siteInfo, socialLinks } from "@/lib/data/site";

const eyebrowClass =
  "font-mono text-xs uppercase tracking-[0.2em] text-[var(--slate)]";
const linkClass =
  "text-sm text-[var(--ink)] transition-colors hover:text-[var(--signal)]";

export default function Footer() {
  // Hide social entries that have no URL yet
  const socials = socialLinks.filter((link) =>
    /^https?:\/\//i.test(link.href || ""),
  );

  return (
    <footer
      id="footer"
      className="border-t border-[var(--line)] bg-[var(--surface)]"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Lead row: brand statement + direct email */}
        <div className="flex flex-col gap-8 py-14 md:flex-row md:items-end md:justify-between md:py-16">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3 font-display text-xl font-semibold tracking-tight text-[var(--ink)]"
            >
              <BrandMark size={32} />
              {siteInfo.name}
            </Link>
            <p className="mt-4 max-w-[44ch] text-sm leading-relaxed text-[var(--slate)]">
              {siteInfo.tagline}
            </p>
          </div>

          <div>
            <p className={eyebrowClass}>Get in touch</p>
            <a
              href={`mailto:${siteInfo.email}`}
              className="mt-3 inline-block font-display text-lg font-medium text-[var(--ink)] underline decoration-[var(--line)] decoration-1 underline-offset-[6px] transition-colors hover:text-[var(--signal)] hover:decoration-[var(--signal)] md:text-xl"
            >
              {siteInfo.email}
            </a>
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 border-t border-[var(--line)] py-12 md:grid-cols-4">
          {footerNav.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <p className={eyebrowClass}>{group.title}</p>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <nav aria-label="Connect">
            <p className={eyebrowClass}>Connect</p>
            <ul className="mt-4 space-y-3">
              <li>
                <a href={`mailto:${siteInfo.email}`} className={linkClass}>
                  Email
                </a>
              </li>
              {socials.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    {link.label}
                    <span aria-hidden className="ml-1 text-[var(--slate)]">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className={eyebrowClass}>Based in</p>
            <p className="mt-4 text-sm text-[var(--ink)]">{siteInfo.location}</p>
            <p className="mt-2 font-mono text-xs text-[var(--slate)]">
              {siteInfo.coordinates}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-start justify-between gap-3 border-t border-[var(--line)] py-6 font-mono text-xs text-[var(--slate)] sm:flex-row sm:items-center">
          <span>
            © {new Date().getFullYear()} {siteInfo.name}. All rights reserved.
          </span>
          <a href="#top" className="transition-colors hover:text-[var(--signal)]">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
