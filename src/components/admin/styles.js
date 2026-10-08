// Shared class strings for the admin panel.

export const inputClass =
  "w-full rounded-lg border border-[var(--line)] bg-[var(--paper)] px-3 py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--slate)] outline-none transition-colors focus:border-[var(--signal)]";

export const labelClass = "text-sm font-medium text-[var(--ink)]";

export const helpClass = "text-xs leading-relaxed text-[var(--slate)]";

export const errorClass = "text-xs text-[var(--danger)]";

export const eyebrowClass =
  "font-mono text-xs uppercase tracking-[0.2em] text-[var(--slate)]";

export const cardClass =
  "rounded-2xl border border-[var(--line)] bg-[var(--surface)]";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60";

export const primaryButtonClass = `${buttonBase} bg-[var(--ink)] text-[var(--paper)] hover:opacity-90`;

export const secondaryButtonClass = `${buttonBase} border border-[var(--line)] text-[var(--ink)] hover:border-[var(--signal)] hover:text-[var(--signal)]`;

export const dangerButtonClass = `${buttonBase} border border-[var(--line)] text-[var(--danger)] hover:border-[var(--danger)]`;

export const iconButtonClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--line)] text-[var(--slate)] transition-colors hover:border-[var(--signal)] hover:text-[var(--signal)]";

export const badgeClass =
  "inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide";
