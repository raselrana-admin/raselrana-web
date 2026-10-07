/**
 * NetworkMap — the homepage hero illustration: Rasel drawn as a network.
 * The core node is him; each outer node is one of his fields (edit the
 * labels in NODES below). Links draw themselves once on load, after which
 * data pulses travel along them in a slow loop.
 *
 * Pure SVG + CSS (the .net-* rules in globals.css), so it is a Server
 * Component and is fully drawn even with no JavaScript or with reduced
 * motion. Colours come from CSS vars, so it follows light/dark on its own.
 */

const CORE = { x: 240, y: 240 };

const CORE_LABEL = "RASEL RANA";

// Outer nodes, clockwise from the top-left. `label` is the field shown next
// to the node; lx / ly / anchor place it (in viewBox units).
const NODES = [
  { id: "n1", x: 96, y: 120, label: "TELECOM", anchor: "start", lx: 52, ly: 100 },
  { id: "n2", x: 250, y: 66, label: "PROGRAMMING", anchor: "middle", lx: 250, ly: 44 },
  { id: "n3", x: 392, y: 132, label: "ROBOTICS", anchor: "end", lx: 426, ly: 112 },
  { id: "n4", x: 424, y: 290, label: "ELECTRONICS", anchor: "end", lx: 444, ly: 318 },
  { id: "n5", x: 318, y: 410, label: "POWER SYSTEMS", anchor: "middle", lx: 318, ly: 438 },
  { id: "n6", x: 150, y: 400, label: "NETWORKING", anchor: "middle", lx: 150, ly: 428 },
  { id: "n7", x: 56, y: 270, label: "MANAGEMENT", anchor: "start", lx: 30, ly: 246 },
];

// Shared label style. The paper-coloured stroke painted under the letters
// is a halo that keeps labels readable where a link passes behind them.
const labelProps = {
  fontFamily: "var(--font-mono)",
  fontSize: "10",
  letterSpacing: "2",
  fill: "var(--slate)",
  stroke: "var(--paper)",
  strokeWidth: "5",
  strokeLinejoin: "round",
  paintOrder: "stroke",
};

const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

// Ring segments between neighbouring outer nodes (not a closed loop).
const RING = [
  ["n1", "n2"],
  ["n2", "n3"],
  ["n3", "n4"],
  ["n5", "n6"],
  ["n6", "n7"],
];

const line = (a, b) => `M${a.x} ${a.y} L${b.x} ${b.y}`;

// Pulses: which path each travels, how long a trip takes, and its start offset.
const PULSES = [
  { d: line(CORE, byId.n1), duration: "3.6s", delay: "1.6s" },
  { d: line(byId.n3, CORE), duration: "4.2s", delay: "2.4s" },
  { d: line(CORE, byId.n5), duration: "3.9s", delay: "3.1s" },
  { d: line(byId.n7, CORE), duration: "4.6s", delay: "2s" },
  { d: line(byId.n2, byId.n3), duration: "5s", delay: "3.6s" },
];

export default function NetworkMap({ className = "" }) {
  return (
    <svg
      viewBox="0 0 480 480"
      overflow="visible"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <pattern id="net-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="1" fill="var(--line)" />
        </pattern>
      </defs>
      <rect width="480" height="480" fill="url(#net-grid)" />

      {/* Ring segments, drawn after the spokes */}
      {RING.map(([from, to], i) => (
        <path
          key={`${from}-${to}`}
          d={line(byId[from], byId[to])}
          pathLength="1"
          fill="none"
          stroke="var(--line)"
          strokeWidth="1.5"
          className="net-link"
          style={{ "--delay": `${900 + i * 120}ms` }}
        />
      ))}

      {/* Spokes from the core */}
      {NODES.map((node, i) => (
        <path
          key={node.id}
          d={line(CORE, node)}
          pathLength="1"
          fill="none"
          stroke="var(--signal)"
          strokeWidth="1.5"
          strokeOpacity="0.55"
          className="net-link"
          style={{ "--delay": `${200 + i * 90}ms` }}
        />
      ))}

      {PULSES.map((pulse, i) => (
        <circle
          key={i}
          r="3.5"
          fill="var(--pulse)"
          className="net-pulse"
          style={{
            offsetPath: `path("${pulse.d}")`,
            "--duration": pulse.duration,
            "--delay": pulse.delay,
          }}
        />
      ))}

      {NODES.map((node, i) => (
        <g
          key={node.id}
          className="net-node"
          style={{ "--delay": `${700 + i * 90}ms` }}
        >
          <circle cx={node.x} cy={node.y} r="9" fill="var(--paper)" stroke="var(--line)" strokeWidth="1.5" />
          <circle cx={node.x} cy={node.y} r="3.5" fill="var(--signal)" />
          {node.label && (
            <text x={node.lx} y={node.ly} textAnchor={node.anchor} {...labelProps}>
              {node.label}
            </text>
          )}
        </g>
      ))}

      {/* Core node, with two expanding rings */}
      <circle cx={CORE.x} cy={CORE.y} r="22" fill="none" stroke="var(--signal)" strokeWidth="1.5" className="net-ring" style={{ "--delay": "1.4s" }} />
      <circle cx={CORE.x} cy={CORE.y} r="22" fill="none" stroke="var(--signal)" strokeWidth="1.5" className="net-ring" style={{ "--delay": "3.2s" }} />
      <g className="net-node">
        <circle cx={CORE.x} cy={CORE.y} r="22" fill="var(--surface)" stroke="var(--signal)" strokeWidth="1.5" />
        <circle cx={CORE.x} cy={CORE.y} r="7" fill="var(--signal)" />
        <text
          x={CORE.x}
          y={CORE.y + 46}
          textAnchor="middle"
          {...labelProps}
          fill="var(--ink)"
        >
          {CORE_LABEL}
        </text>
      </g>
    </svg>
  );
}
