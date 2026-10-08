// Fields of the public profile, edited at /admin/profile and stored as one
// document. Read on the site through lib/services/site-profile.js.
// Plain data only — safe for Client Components.

export const PROFILE_FIELDS = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "role", label: "Role", type: "text", required: true, help: "e.g. Manager (Technical)." },
  { name: "org", label: "Organization", type: "text", required: true },
  { name: "tagline", label: "Tagline", type: "textarea", required: true, help: "The sentence under your name on the home page." },
  { name: "footerTagline", label: "Footer description", type: "textarea", help: "The short description beside the logo in the footer." },
  { name: "focus", label: "Focus tags", type: "list", help: "Shown as small tags on the home page. One per line." },
  { name: "location", label: "Location", type: "text", required: true },
  { name: "coordinates", label: "Coordinates", type: "text", help: "Optional. Shown in the footer." },
  { name: "email", label: "Public contact email", type: "email", help: "Shown on the site. This is not your login email." },
  { name: "socialLinks", label: "Social links", type: "links", withType: false, help: "Shown under Connect in the footer." },
];
