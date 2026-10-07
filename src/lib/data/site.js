// lib/data/site.js
// Site-wide content used by the footer. Add a link by adding a line here —
// no component changes needed.

export const siteInfo = {
  name: "Rasel Rana",
  url: "https://raselrana.com.bd", // no trailing slash
  tagline:
    "Manager (Technical), BTCL — writing and building at the intersection of telecommunications and electrical engineering.",
  email: "contact@raselrana.com.bd",
  location: "Dhaka, Bangladesh",
  coordinates: "23.8103° N, 90.4125° E",
};

// Columns of internal links, left to right.
export const footerNav = [
  {
    title: "Explore",
    links: [
      { label: "About", href: "/about" },
      { label: "Journey", href: "/journey" },
      { label: "Experience", href: "/experience" },
      { label: "Achievements", href: "/achievements" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "More",
    links: [
      { label: "Projects", href: "/projects" },
      { label: "Skills", href: "/skills" },
      { label: "Education", href: "/education" },
      { label: "Publications", href: "/publications" },
      { label: "Downloads", href: "/downloads" },
      { label: "Blog", href: "/blog" },
    ],
  },
];

// Links that leave the site (shown under "Connect" with an arrow).
// Entries with an empty href stay hidden, so fill in the URL to switch one
// on, and add new lines freely (e.g. X, ResearchGate, Google Scholar).
export const socialLinks = [
  { label: "LinkedIn", href: "https://linkedin.com/in/raselrana" },
  { label: "YouTube", href: "" }, // TODO: add channel URL
  { label: "Facebook", href: "" }, // TODO: add profile/page URL
  { label: "GitHub", href: "" }, // TODO: add profile URL
];
