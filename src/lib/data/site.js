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
    "Telecommunications, electronics and robotics: engineering that connects and builds.",
  email: "contact@raselrana.com.bd",
  phone: "02226603333", // contact card and its QR code only
  location: "Dhaka, Bangladesh",
  coordinates: "23.81° N · 90.41° E",
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
      { label: "Portfolio", href: "/portfolio" },
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
  { label: "LinkedIn", href: "https://www.linkedin.com/in/rasel62" },
  { label: "Facebook", href: "https://www.facebook.com/rasel.62" },
  { label: "GitHub", href: "https://github.com/raselrana-admin" },
];
