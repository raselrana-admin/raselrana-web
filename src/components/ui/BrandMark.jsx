/**
 * BrandMark — the site logo, shown before the name in the navbar and footer.
 *
 * A rounded badge holding a drawn "R" monogram whose leg ends in a small
 * node, echoing the network map on the home page. Drawn as paths (not text)
 * so it looks identical everywhere regardless of font loading. Colours come
 * from CSS vars, so the badge inverts with the theme like the solid buttons.
 * src/app/icon.svg is the same mark with fixed colours for the browser tab.
 */
export default function BrandMark({ className = "", size = 30 }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Rasel Rana"
    >
      <rect width="32" height="32" rx="8" fill="var(--ink)" />
      <g
        fill="none"
        stroke="var(--paper)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* stem + bowl */}
        <path d="M11 24V8h6.25a4.5 4.5 0 0 1 0 9H11" />
        {/* leg */}
        <path d="M16 17l3.9 5" />
      </g>
      {/* node at the end of the leg */}
      <circle cx="21.6" cy="24" r="2.3" fill="var(--paper)" />
    </svg>
  );
}
