import Link from "next/link";
import BrandMark from "@/components/ui/BrandMark";
import { footerNav } from "@/lib/data/site";

const eyebrowClass =
  "font-mono text-xs uppercase tracking-[0.2em] text-[var(--slate)]";
const linkClass =
  "text-sm text-[var(--ink)] transition-colors hover:text-[var(--signal)]";

// `profile` is the public profile (lib/services/site-profile.js), passed in
// by views/layout/SiteFooter.jsx. The link columns stay in lib/data/site.js.
export default function Footer({ profile }) {
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
              {profile.name}
            </Link>
            {profile.footerTagline && (
              <p className="mt-4 max-w-[44ch] text-sm leading-relaxed text-[var(--slate)]">
                {profile.footerTagline}
              </p>
            )}
          </div>

          <div>
            <p className={eyebrowClass}>Get in touch</p>
            <a
              href={`mailto:${profile.email}`}
              className="mt-3 inline-block font-display text-lg font-medium text-[var(--ink)] underline decoration-[var(--line)] decoration-1 underline-offset-[6px] transition-colors hover:text-[var(--signal)] hover:decoration-[var(--signal)] md:text-xl"
            >
              {profile.email}
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
                <a href={`mailto:${profile.email}`} className={linkClass}>
                  Email
                </a>
              </li>
              {profile.socialLinks.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
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
            <p className="mt-4 text-sm text-[var(--ink)]">{profile.location}</p>
            {profile.coordinates && (
              <p className="mt-2 font-mono text-xs text-[var(--slate)]">
                {profile.coordinates}
              </p>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-start justify-between gap-3 border-t border-[var(--line)] py-6 font-mono text-xs text-[var(--slate)] sm:flex-row sm:items-center">
          <span>
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </span>
          <a href="#top" className="transition-colors hover:text-[var(--signal)]">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
