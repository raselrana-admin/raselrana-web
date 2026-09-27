/**
 * Divider — plain hairline used between homepage sections, replacing
 * SignalWave's divider variant. No motion: a looping pulse on every
 * section break reads as decoration, not signal. The small centered
 * notch echoes BrandMark's step motif without animating.
 */
export default function Divider({ className = "" }) {
  return (
    <div className={`relative h-px w-full bg-[var(--line)] ${className}`}>
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--signal)]"
      />
    </div>
  );
}
