// Field definitions for every achievement type. Shared by the admin form
// (which renders inputs from it) and the Server Actions (which validate
// against it), so the two can't drift apart. Plain data + pure functions
// only — safe to import from Client Components.

export const LINK_TYPES = [
  { value: "youtube", label: "Video (YouTube)" },
  { value: "facebook", label: "Facebook" },
  { value: "web", label: "Website" },
  { value: "news", label: "News" },
];

export const PLACEMENTS = ["Champion", "1st Runner-up", "2nd Runner-up"];

const eventFields = [
  { name: "sortDate", label: "Sort date", type: "date", required: true, help: "Used for ordering only. Use the first day of the event." },
  { name: "displayDate", label: "Display date", type: "text", required: true, help: "What visitors see, e.g. 5–6 May 2016." },
  { name: "organizer", label: "Organizer", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea", help: "Shown on the detail page." },
  { name: "links", label: "Links", type: "links" },
];

const slugField = {
  name: "slug",
  label: "URL slug",
  type: "slug",
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
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      slugField,
      { name: "placement", label: "Placement", type: "select", required: true, options: PLACEMENTS },
      ...eventFields,
    ],
  },
  judging: {
    label: "Judging & mentoring",
    singular: "judging entry",
    titleField: "title",
    metaFields: ["role", "displayDate"],
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

// Types that get a /achievements/<slug> detail page. Slugs are unique across all of them.
export const SLUG_TYPES = ["competition", "judging", "sports"];

const HTTP_URL = /^https?:\/\/\S+$/i;

export function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function cleanLinks(raw, errors) {
  let rows = raw;
  if (typeof raw === "string") {
    try {
      rows = JSON.parse(raw || "[]");
    } catch {
      rows = null;
    }
  }
  if (!Array.isArray(rows)) {
    errors.links = "Links could not be read.";
    return [];
  }

  const links = [];
  for (const row of rows) {
    const url = String(row?.url || "").trim();
    const label = String(row?.label || "").trim().slice(0, 120);
    if (!url && !label) continue; // ignore fully empty rows
    if (!HTTP_URL.test(url)) {
      errors.links = "Every link needs a full URL starting with http:// or https://.";
      continue;
    }
    const type = LINK_TYPES.some((t) => t.value === row?.type) ? row.type : "web";
    links.push({ type, label, url });
  }
  return links;
}

/**
 * Validates and normalises raw form input for one item.
 * `raw` is a plain object of field name -> submitted value.
 * Returns { data, errors }; `errors` is empty when the item is valid.
 */
export function normalizeAchievement(type, raw) {
  const config = ACHIEVEMENT_TYPES[type];
  const errors = {};
  const data = {};

  if (!config) return { data, errors: { _form: "Unknown achievement type." } };

  for (const field of config.fields) {
    const value = raw?.[field.name];

    switch (field.type) {
      case "links":
        data.links = cleanLinks(value ?? [], errors);
        break;
      case "checkbox":
        data[field.name] = value === true || value === "on" || value === "true";
        break;
      case "number": {
        const number = Number.parseInt(value, 10);
        data[field.name] = Number.isFinite(number) ? number : 0;
        break;
      }
      case "slug":
        data.slug = slugify(value) || slugify(raw?.[config.titleField]);
        if (!data.slug) errors.slug = "A slug is required.";
        break;
      case "date": {
        const text = String(value || "").trim();
        if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
          errors[field.name] = `${field.label} must be a date.`;
        }
        data[field.name] = text;
        break;
      }
      case "url": {
        const text = String(value || "").trim();
        if (!HTTP_URL.test(text)) {
          errors[field.name] = `${field.label} must start with http:// or https://.`;
        }
        data[field.name] = text;
        break;
      }
      case "select": {
        const text = String(value || "").trim();
        if (!field.options.includes(text)) {
          errors[field.name] = `Choose a ${field.label.toLowerCase()}.`;
        }
        data[field.name] = text;
        break;
      }
      case "competition":
        data[field.name] = slugify(value);
        break;
      default: {
        const limit = field.type === "textarea" ? 5000 : 300;
        const text = String(value || "").trim().slice(0, limit);
        if (field.required && !text) errors[field.name] = `${field.label} is required.`;
        data[field.name] = text;
      }
    }
  }

  return { data, errors };
}
