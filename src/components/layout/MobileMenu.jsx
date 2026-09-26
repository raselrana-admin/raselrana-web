"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // client snapshot
    () => false, // server snapshot
  );
}

export default function MobileMenu({ links, pathname, onClose }) {
  const mounted = useIsMounted();

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[var(--ink)]/40 md:hidden"
      onClick={onClose}
    >
      <motion.nav
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        className="ml-auto flex h-full w-[78%] max-w-xs flex-col bg-[var(--paper)] px-6 py-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-8 flex items-center justify-between">
          <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wide text-[var(--slate)]">
            Menu
          </span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="text-[var(--ink)]"
          >
            ✕
          </button>
        </div>

        <ul className="flex flex-col gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className={`block border-b border-[var(--line)] py-3 font-[family-name:var(--font-body)] text-base ${
                    active ? "text-[var(--signal)]" : "text-[var(--ink)]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <Link
          href="/downloads"
          onClick={onClose}
          className="mt-6 rounded-md border border-[var(--ink)] py-2.5 text-center font-[family-name:var(--font-mono)] text-xs uppercase tracking-wide text-[var(--ink)]"
        >
          Download CV
        </Link>
      </motion.nav>
    </motion.div>,
    document.body,
  );
}
