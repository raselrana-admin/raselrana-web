"use client";

import ThemeToggle from "@/components/theme/ThemeToggle";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import MobileMenu from "./MobileMenu";

const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "Journey", href: "/journey" },
  { label: "Experience", href: "/experience" },
  { label: "Achievements", href: "/achievements" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

// Oscilloscope-style trace — the site's one signature mark
function SignalMark() {
  return (
    <svg width="34" height="20" viewBox="0 0 34 20" fill="none">
      <motion.path
        d="M0 10 H8 L11 3 L15 17 L18 10 H34"
        stroke="var(--signal)"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: "easeInOut" }}
      />
    </svg>
  );
}

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
          <SignalMark />
          Rasel Rana
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
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
              </Link>
            );
          })}
          <Link
            href="/downloads"
            className="ml-3 rounded-md border border-[var(--ink)] px-4 py-1.5 font-[family-name:var(--font-mono)] text-xs uppercase tracking-wide text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-[var(--paper)]"
          >
            CV
          </Link>
          <ThemeToggle />
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex flex-col gap-1.5"
          >
            <span className="h-[1.5px] w-6 bg-[var(--ink)]" />
            <span className="h-[1.5px] w-6 bg-[var(--ink)]" />
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
