"use client";

import { track } from "@vercel/analytics";
import { motion } from "motion/react";

function DownloadIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

/**
 * Generic download CTA. Fires a Vercel Analytics event on click so you can
 * see download counts in the Vercel dashboard without any extra backend.
 *
 * Usage:
 *   <DownloadButton href={cvDownload.filePath} fileName={cvDownload.fileName} />
 */
export default function DownloadButton({
  href,
  fileName,
  label = "Download CV",
  variant = "solid", // "solid" | "outline" | "ghost" | "navbar"
  eventName = "cv_download",
  showIcon = true,
  className = "",
}) {
  const handleClick = () => {
    try {
      track(eventName, { file: fileName });
    } catch (err) {
      // Analytics failures should never block the actual download
    }
  };

  // "navbar" reproduces the original CV button styling from Navbar.jsx —
  // bordered, rounded-md, uppercase mono label, invert-on-hover — just wired
  // to trigger a real file download (with analytics) instead of routing to
  // the /downloads page.
  const isNavbar = variant === "navbar";

  const base = isNavbar
    ? "inline-flex items-center gap-1.5 rounded-md border border-[var(--ink)] px-4 py-1.5 font-[family-name:var(--font-mono)] text-xs uppercase tracking-wide text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-[var(--paper)]"
    : "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium font-[family-name:var(--font-mono)] transition-colors duration-200";

  const variants = {
    solid: "bg-[var(--signal)] text-[var(--paper)] hover:bg-[var(--pulse)]",
    outline:
      "border border-[var(--line)] text-[var(--ink)] hover:border-[var(--signal)] hover:text-[var(--signal)]",
    ghost: "text-[var(--ink)] hover:text-[var(--signal)]",
    navbar: "",
  };

  return (
    <motion.a
      href={href}
      download={fileName}
      onClick={handleClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {showIcon && <DownloadIcon />}
      {label}
    </motion.a>
  );
}
