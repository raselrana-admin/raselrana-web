/**
 * BrandMark — short logo mark for the navbar, placed before the name.
 *
 * A single "R" with a small right-angle signal-step notch beside it —
 * the same step-trace device used in the Hero. Static by design: no
 * loop, no continuous motion, so it reads as a mark rather than a gif.
 * Color comes from CSS vars (--ink / --signal) so it adapts to dark mode
 * automatically.
 */
export default function BrandMark({ className = "", size = 28 }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Rasel Rana"
    >
      <text
        x="2"
        y="24"
        fontFamily="var(--font-display), 'Space Grotesk', sans-serif"
        fontSize="24"
        fontWeight="600"
        fill="var(--ink)"
      >
        R
      </text>
      <path
        d="M22 21 h5 v-6"
        stroke="var(--signal)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
