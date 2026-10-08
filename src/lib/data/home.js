// lib/data/home.js
//
// EXAMPLE CONTENT — everything below is a placeholder so the homepage has
// something real to render. Replace freely; the section components only
// care about the shape of each object, not the values.

// Starting values for the public profile. Once the profile is saved from the
// dashboard (/admin/profile), the saved values are used instead.
export const profile = {
  name: "Rasel Rana",
  role: "Manager (Technical)",
  org: "Bangladesh Telecommunications Company Limited (BTCL)",
  location: "Dhaka, Bangladesh",
  tagline:
    "I plan, build, and keep telecommunications networks running — with a background in electrical and electronic engineering behind every decision.",
  meta: "TELECOM · POWER SYSTEMS · NETWORK ENGINEERING",
};

export const aboutPreview = {
  body: "I work at the intersection of telecommunications infrastructure and electrical engineering — from transmission networks to the power systems that keep them alive. Over the past several years at BTCL, that's meant everything from field-level troubleshooting to planning decisions that affect service for thousands of subscribers.",
  href: "/about",
};

export const focusAreas = [
  {
    label: "01",
    title: "Telecommunications Systems",
    description:
      "Transmission networks, switching, and the day-to-day engineering that keeps voice and data services reliable.",
  },
  {
    label: "02",
    title: "Power & Electrical Systems",
    description:
      "Rectifiers, backup power, and the electrical infrastructure that telecom equipment depends on to stay online.",
  },
  {
    label: "03",
    title: "Network Planning",
    description:
      "Capacity planning and technical decisions that balance current load against where a network needs to go next.",
  },
  {
    label: "04",
    title: "Technical Management",
    description:
      "Leading field teams, coordinating maintenance windows, and translating engineering constraints into working plans.",
  },
];

// The email shown here comes from the public profile (dashboard).
export const contactCta = {
  heading: "Let's talk shop.",
  body: "Open to conversations on network engineering, telecom infrastructure, or technical collaboration.",
};
