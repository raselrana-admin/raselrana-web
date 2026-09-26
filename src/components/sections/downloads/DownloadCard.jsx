"use client";

import { motion } from "motion/react";
import DownloadButton from "@/components/ui/DownloadButton";

function FileIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

export default function DownloadCard({ item, count = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-4 rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--signal)]/10 text-[var(--signal)]">
          <FileIcon />
        </div>
        <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wide text-[var(--slate)]">
          {item.fileType}
        </span>
      </div>

      <div>
        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--ink)]">
          {item.title}
        </h3>
        <p className="mt-1 text-sm text-[var(--slate)]">{item.description}</p>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-[family-name:var(--font-mono)] text-xs text-[var(--slate)]">
        <span>{item.fileSize}</span>
        <span aria-hidden="true">·</span>
        <span>Updated {item.lastUpdated}</span>
        <span aria-hidden="true">·</span>
        <span>
          {count} {count === 1 ? "download" : "downloads"}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap gap-3">
        <DownloadButton
          href={item.filePath}
          fileName={item.fileName}
          docId={item.id}
          label="Download"
          variant="solid"
          eventName={`${item.id}_download`}
        />
        <a
          href={item.filePath}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-full border border-[var(--line)] px-5 py-2.5 text-sm font-medium text-[var(--ink)] transition-colors hover:border-[var(--signal)] hover:text-[var(--signal)]"
        >
          Preview
        </a>
      </div>
    </motion.div>
  );
}
