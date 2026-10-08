// lib/data/site.js
// Site-wide content. `footerNav` (the footer's page links) is always read
// from here. `siteInfo` and `socialLinks` are only the starting values of the
// public profile: once the profile is saved from the dashboard
// (/admin/profile), the saved name, email, location and social links are
// used instead. `siteInfo.url` is always read from here.

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
