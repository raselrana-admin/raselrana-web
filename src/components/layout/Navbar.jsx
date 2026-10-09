"use client";

import BrandMark from "@/components/ui/BrandMark";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { isBlogLink } from "@/lib/zones";
import MobileMenu from "./MobileMenu";

const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "Journey", href: "/journey" },
  { label: "Experience", href: "/experience" },
  { label: "Achievements", href: "/achievements" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Downloads", href: "/downloads" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--paper)]/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-3 font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--ink)]"
        >
          <BrandMark size={30} />
          Rasel Rana
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            // The blog is another app, so its link is a normal page load
            const NavLink = isBlogLink(link.href) ? "a" : Link;
            return (
              <NavLink
                key={link.href}
                href={link.href}
                className="relative px-3 py-2 font-[family-name:var(--font-body)] text-sm text-[var(--slate)] transition-colors hover:text-[var(--ink)]"
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-2 -bottom-px h-[2px] bg-[var(--signal)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={active ? "text-[var(--ink)]" : ""}>
                  {link.label}
                </span>
              </NavLink>
            );
          })}
          {/* <DownloadButton
            href={cvDownload.filePath}
            fileName={cvDownload.fileName}
            label="CV"
            variant="navbar"
            className="ml-3"
          /> */}
          <ThemeToggle />
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--line)] text-[var(--ink)] transition-colors hover:border-[var(--signal)]"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <MobileMenu
            links={NAV_LINKS}
            pathname={pathname}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </header>
  );
}
