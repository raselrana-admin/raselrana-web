// Field definitions for every achievement type. Registered as the
// "achievements" module in lib/content/modules.js; see lib/content/fields.js
// for the field types. Plain data only — safe for Client Components.

export const PLACEMENTS = ["Champion", "1st Runner-up", "2nd Runner-up"];

const eventFields = [
  { name: "sortDate", label: "Sort date", type: "date", required: true, help: "Used for ordering only. Use the first day of the event." },
  { name: "displayDate", label: "Display date", type: "text", required: true, help: "What visitors see, e.g. 5–6 May 2016." },
  { name: "organizer", label: "Organizer", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea", help: "Shown on the detail page." },
  { name: "links", label: "Links", type: "links" },
];

// Types with a slug get a /achievements/<slug> detail page. `unique` makes
// the slug unique across the whole collection, i.e. across all three types.
const slugField = {
  name: "slug",
  label: "URL slug",
  type: "slug",
  unique: true,
  help: "Leave empty to generate it from the title. The page lives at /achievements/<slug>.",
};

const orderField = {
  name: "order",
  label: "Position",
  type: "number",
  help: "Lower numbers appear first.",
};

export const ACHIEVEMENT_TYPES = {
  competition: {
    label: "Competitions",
    singular: "competition",
    titleField: "title",
    metaFields: ["placement", "displayDate"],
    sort: "newest",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      slugField,
      { name: "placement", label: "Placement", type: "select", required: true, options: PLACEMENTS },
      ...eventFields,
      { name: "showOnHome", label: "Show on the home page", type: "checkbox" },
    ],
  },
  judging: {
    label: "Judging & mentoring",
    singular: "judging entry",
    titleField: "title",
    metaFields: ["role", "displayDate"],
    sort: "newest",
    fields: [
      { name: "title", label: "Event title", type: "text", required: true },
      slugField,
      { name: "role", label: "Your role", type: "text", required: true, help: "e.g. Judge, Guest Judge, Mentor." },
      ...eventFields,
    ],
  },
  sports: {
    label: "Sports & beyond",
    singular: "sports entry",
    titleField: "title",
    metaFields: ["result", "displayDate"],
    sort: "newest",
    fields: [
      { name: "title", label: "Tournament title", type: "text", required: true },
      slugField,
      { name: "result", label: "Result", type: "text", required: true, help: "e.g. Champion." },
      ...eventFields,
    ],
  },
  leadership: {
    label: "Leadership",
    singular: "leadership role",
    titleField: "role",
    metaFields: ["org", "period"],
    fields: [
      { name: "role", label: "Role", type: "text", required: true },
      { name: "org", label: "Organization", type: "text", required: true },
      { name: "period", label: "Period", type: "text", required: true, help: "e.g. Session 2016–2017." },
      { name: "description", label: "Description", type: "textarea" },
      { name: "links", label: "Links", type: "links" },
      orderField,
    ],
  },
  press: {
    label: "Press",
    singular: "press clipping",
    titleField: "headline",
    metaFields: ["outlet", "date"],
    fields: [
      { name: "headline", label: "Headline", type: "text", required: true },
      { name: "outlet", label: "Outlet", type: "text", required: true, help: "e.g. Daily Ittefaq." },
      { name: "date", label: "Date", type: "text", required: true, help: "As shown to visitors, e.g. 25 May 2016." },
      { name: "url", label: "Article URL", type: "url", required: true },
      { name: "competition", label: "Related competition", type: "competition", help: "Optional. Shows this clipping on that competition's card and detail page." },
      { name: "featured", label: "Feature at the top of the Achievements page", type: "checkbox" },
      orderField,
    ],
  },
  affiliation: {
    label: "Memberships",
    singular: "membership",
    titleField: "org",
    metaFields: ["status"],
    fields: [
      { name: "org", label: "Organization", type: "text", required: true },
      { name: "status", label: "Status", type: "text", required: true, help: "e.g. Member, Student member." },
      orderField,
    ],
  },
};
