// The one-off text of each page (heading, intro and so on), as opposed to
// its list of entries. Edited in the dashboard: on the page's own screen, or
// at /admin/contact-page for Contact, which has no entries. Stored one
// document per page and read with getPageText() in
// lib/services/page-text.js; the defaults are in lib/content/page-defaults.js.
//
// Plain data only — imported by Client Components. See lib/content/fields.js
// for the field types.

const header = [
  { name: "eyebrow", label: "Small label", type: "text", help: "The short label above the heading. Leave empty to hide it." },
  { name: "heading", label: "Heading", type: "text", required: true },
  { name: "intro", label: "Intro", type: "textarea", help: "The sentence or two under the heading." },
];

export const PAGE_TEXT = {
  about: {
    label: "About",
    fields: [
      { name: "eyebrow", label: "Small label", type: "text", help: "The short label above the headline. Leave empty to hide it." },
      { name: "heading", label: "Headline", type: "textarea", required: true },
      { name: "intro", label: "Intro", type: "textarea" },
      { name: "storyHeading", label: "Story: heading", type: "text", required: true },
      { name: "storyText", label: "Story: text", type: "textarea", help: "Leave an empty line between paragraphs." },
      { name: "focusHeading", label: "\"How I work\" heading", type: "text", required: true, help: "The cards under it are the How I work entries below." },
      { name: "highlightsHeading", label: "Career snapshot heading", type: "text", required: true, help: "The rows under it are the Career snapshot entries below." },
      { name: "ctaHeading", label: "Closing panel: heading", type: "text", required: true },
      { name: "ctaDescription", label: "Closing panel: text", type: "text" },
    ],
  },
  journey: { label: "Journey", fields: header },
  experience: { label: "Experience", fields: header },
  achievements: { label: "Achievements", fields: header },
  projects: { label: "Projects", fields: header },
  skills: { label: "Skills", fields: header },
  education: { label: "Education", fields: header },
  publications: { label: "Publications", fields: header },
  portfolio: { label: "Portfolio", fields: header },
  downloads: { label: "Downloads", fields: header },
  contact: {
    label: "Contact",
    fields: [
      ...header,
      { name: "responseTime", label: "Response time", type: "text", help: "Shown beside the clock on the Contact page, e.g. Within 2–3 business days. Leave empty to hide that row." },
    ],
  },
};

export function hasPageText(key) {
  return Object.hasOwn(PAGE_TEXT, key);
}
