"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const QUIET_ZONE = 2; // blank modules around the code, needed by scanners

/**
 * The "Preview" of a contact card: a dialog with a QR code that saves the
 * contact when scanned with a phone camera, and the contact details under it.
 * `contact` is { details: [{ label, value, href? }], qr: { size, d } },
 * prepared on the server in views/downloads/DownloadsView.jsx.
 */
export default function ContactCardPreview({ contact, className }) {
  const [open, setOpen] = useState(false);

  // Close on Escape and stop the page behind from scrolling while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const { details, qr } = contact;
  const box = qr.size + QUIET_ZONE * 2;

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        Preview &amp; QR code
      </button>

      {/* Rendered into <body>, not inside the card. The card has the .reveal
          scroll animation, and an animated (transformed) ancestor makes
          "position: fixed" relative to that ancestor instead of the screen,
          which trapped the dialog inside the card and cut off its close
          button. A portal takes it out of the card entirely. */}
      {open &&
        createPortal(
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close preview"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/50"
          />
          {/* One column at every size: heading (stays put), then a scrolling
              body with the QR code first and the details under it. The panel
              is never taller than the visible screen. */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-card-title"
            className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface)]"
          >
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[var(--line)] px-6 py-5">
              <div className="min-w-0">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--signal)]">
                  Contact card
                </p>
                <h2
                  id="contact-card-title"
                  className="mt-1 font-display text-2xl font-semibold tracking-tight text-[var(--ink)]"
                >
                  {details[0]?.value}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--line)] text-[var(--ink)] transition-colors hover:border-[var(--signal)] hover:text-[var(--signal)]"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-6">
              <div className="mx-auto flex w-56 max-w-full flex-col items-center text-center">
                {/* Always dark-on-white, in both themes, so phones can read it */}
                <svg
                  viewBox={`${-QUIET_ZONE} ${-QUIET_ZONE} ${box} ${box}`}
                  role="img"
                  aria-label="QR code that saves this contact when scanned"
                  shapeRendering="crispEdges"
                  className="w-full rounded-xl border border-[var(--line)]"
                >
                  <rect
                    x={-QUIET_ZONE}
                    y={-QUIET_ZONE}
                    width={box}
                    height={box}
                    fill="#ffffff"
                  />
                  <path d={qr.d} fill="#0f2438" />
                </svg>
                <p className="mt-3 text-xs leading-relaxed text-[var(--slate)]">
                  Point your phone camera at the code to save this contact.
                </p>
              </div>

              <dl className="mt-6 divide-y divide-[var(--line)] border-t border-[var(--line)]">
                {details.slice(1).map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3 py-3"
                  >
                    <dt className="font-mono text-xs uppercase tracking-wide text-[var(--slate)]">
                      {row.label}
                    </dt>
                    <dd className="text-sm text-[var(--ink)] [overflow-wrap:anywhere]">
                      {row.href ? (
                        <a
                          href={row.href}
                          className="underline decoration-[var(--line)] underline-offset-4 hover:text-[var(--signal)]"
                        >
                          {row.value}
                        </a>
                      ) : (
                        row.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>,
          document.body,
        )}
    </>
  );
}
