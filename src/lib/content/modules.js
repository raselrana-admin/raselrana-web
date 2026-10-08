import { ACHIEVEMENT_TYPES } from "@/lib/achievements-schema";

// Registry of everything the dashboard can manage. One module = one MongoDB
// collection = one screen at /admin/<key>. A module has one or more entry
// types (Achievements has six; the others have one), and every document
// carries its type in a `type` field.
//
// To add a module: add it here, add its starter content in
// lib/content/starter.js, and read it on the public page with getEntries()
// from lib/services/content-service.js. The dashboard screen, form,
// validation and save/delete actions come for free.
//
// Plain data only — this file is imported by Client Components.

const publishedField = {
  name: "published",
  label: "Published — visible on the site",
  type: "checkbox",
  default: true,
};

const homeField = { name: "showOnHome", label: "Show on the home page", type: "checkbox" };

const orderField = {
  name: "order",
  label: "Position",
  type: "number",
  help: "Lower numbers appear first.",
};

// Every type gets the Published tick box as its last field.
function withPublished(types) {
  return Object.fromEntries(
    Object.entries(types).map(([key, type]) => [
      key,
      { ...type, fields: [...type.fields, publishedField] },
    ]),
  );
}

export const MODULES = {
  about: {
    key: "about",
    label: "About",
    description: "The About page: its text above, and the two lists on it below.",
    collection: "about",
    publicPath: "/about",
    types: withPublished({
      principle: {
        label: "How I work",
        singular: "principle",
        titleField: "title",
        metaFields: [],
        fields: [
          { name: "title", label: "Title", type: "text", required: true },
          { name: "description", label: "Description", type: "textarea", required: true },
          orderField,
        ],
      },
      highlight: {
        label: "Career snapshot",
        singular: "career row",
        titleField: "title",
        metaFields: ["org", "year"],
        fields: [
          { name: "year", label: "Years", type: "text", required: true, help: "e.g. 2024 — Present." },
          { name: "title", label: "Title", type: "text", required: true },
          { name: "org", label: "Organization", type: "text" },
          { name: "description", label: "Description", type: "textarea" },
          orderField,
        ],
      },
    }),
  },

  journey: {
    key: "journey",
    label: "Journey",
    description: "The stages of your story, shown in order on the Journey page.",
    collection: "journey",
    publicPath: "/journey",
    types: withPublished({
      stage: {
        label: "Stages",
        singular: "stage",
        titleField: "title",
        metaFields: ["era"],
        fields: [
          { name: "era", label: "Era", type: "text", required: true, help: "A year, a range, or a word such as Present." },
          { name: "title", label: "Title", type: "text", required: true },
          { name: "summary", label: "Summary", type: "text", help: "One line under the title." },
          { name: "body", label: "Text", type: "textarea", help: "Leave an empty line between paragraphs." },
          orderField,
        ],
      },
    }),
  },

  achievements: {
    key: "achievements",
    label: "Achievements",
    description: "Competitions, judging, sports, leadership, press and memberships.",
    collection: "achievements",
    publicPath: "/achievements",
    types: withPublished(ACHIEVEMENT_TYPES),
  },

  projects: {
    key: "projects",
    label: "Projects",
    description: "Engineering projects shown on the Projects page.",
    collection: "projects",
    publicPath: "/projects",
    types: withPublished({
      project: {
        label: "Projects",
        singular: "project",
        titleField: "title",
        metaFields: ["category", "period"],
        fields: [
          { name: "title", label: "Title", type: "text", required: true },
          { name: "category", label: "Category", type: "text", required: true, help: "e.g. Network Infrastructure." },
          { name: "period", label: "Period", type: "text", help: "e.g. 2023 or 2021–2022." },
          { name: "description", label: "Description", type: "textarea", required: true },
          { name: "tags", label: "Tags", type: "list", help: "One per line." },
          { name: "link", label: "Link", type: "url", help: "Optional. A page with more about the project." },
          homeField,
          orderField,
        ],
      },
    }),
  },

  skills: {
    key: "skills",
    label: "Skills",
    description: "Groups of skills shown on the Skills page.",
    collection: "skills",
    publicPath: "/skills",
    types: withPublished({
      group: {
        label: "Skill groups",
        singular: "skill group",
        titleField: "title",
        metaFields: [],
        fields: [
          { name: "title", label: "Group name", type: "text", required: true, help: "e.g. Telecommunications." },
          { name: "items", label: "Skills", type: "list", required: true, help: "One per line." },
          orderField,
        ],
      },
    }),
  },

  education: {
    key: "education",
    label: "Education",
    description: "Qualifications shown on the Education page.",
    collection: "education",
    publicPath: "/education",
    types: withPublished({
      qualification: {
        label: "Qualifications",
        singular: "qualification",
        titleField: "degree",
        metaFields: ["institution", "period"],
        fields: [
          { name: "degree", label: "Degree or certificate", type: "text", required: true },
          { name: "institution", label: "Institution", type: "text", required: true },
          { name: "period", label: "Period", type: "text", help: "e.g. 2012 — 2016." },
          { name: "details", label: "Details", type: "textarea", help: "Result, thesis, notable coursework." },
          orderField,
        ],
      },
    }),
  },

  publications: {
    key: "publications",
    label: "Publications",
    description: "Papers, articles and technical write-ups.",
    collection: "publications",
    publicPath: "/publications",
    types: withPublished({
      publication: {
        label: "Publications",
        singular: "publication",
        titleField: "title",
        metaFields: ["venue", "year"],
        fields: [
          { name: "title", label: "Title", type: "text", required: true },
          { name: "venue", label: "Venue", type: "text", required: true, help: "Journal, conference or outlet." },
          { name: "year", label: "Year", type: "text", required: true },
          { name: "summary", label: "Summary", type: "textarea" },
          { name: "url", label: "Link", type: "url", help: "Optional. Where the publication can be read." },
          orderField,
        ],
      },
    }),
  },

  experience: {
    key: "experience",
    label: "Experience",
    description: "Roles held, grouped by organization on the Experience page.",
    collection: "experience",
    publicPath: "/experience",
    types: withPublished({
      role: {
        label: "Roles",
        singular: "role",
        titleField: "role",
        metaFields: ["organization", "start"],
        fields: [
          { name: "organization", label: "Organization", type: "text", required: true, help: "Roles with exactly the same organization name are grouped together." },
          { name: "sector", label: "Sector", type: "text", help: "e.g. Government / Telecommunications." },
          { name: "role", label: "Role", type: "text", required: true },
          { name: "location", label: "Location", type: "text" },
          { name: "start", label: "Start", type: "text", required: true, help: "As shown to visitors, e.g. April 2018." },
          { name: "end", label: "End", type: "text", help: "Leave empty for a current role." },
          { name: "employmentType", label: "Employment type", type: "text", help: "e.g. Full-time, Additional Charge." },
          { name: "summary", label: "Summary", type: "textarea" },
          { name: "responsibilities", label: "Responsibilities", type: "list", help: "One per line." },
          { name: "tools", label: "Tools & systems", type: "list", help: "One per line." },
          homeField,
          orderField,
        ],
      },
    }),
  },

  portfolio: {
    key: "portfolio",
    label: "Portfolio",
    description:
      "The text of your portfolio, shown at /portfolio and used to build the downloadable PDF. Your name, role and contact details at the top come from the public profile.",
    collection: "portfolio",
    publicPath: "/portfolio",
    types: withPublished({
      summary: {
        label: "Summary blocks",
        singular: "summary block",
        titleField: "heading",
        metaFields: [],
        fields: [
          { name: "heading", label: "Heading", type: "text", required: true, help: "e.g. Profile." },
          { name: "text", label: "Text", type: "textarea", required: true },
          orderField,
        ],
      },
      entry: {
        label: "Entries",
        singular: "entry",
        titleField: "title",
        metaFields: ["section", "period"],
        fields: [
          { name: "section", label: "Section", type: "text", required: true, help: "The heading this entry goes under, e.g. Experience, Education, Skills. Entries with exactly the same section name are grouped; sections appear in the order of their first entry." },
          { name: "title", label: "Title", type: "text", required: true, help: "e.g. a job title, a degree, a skill area." },
          { name: "subtitle", label: "Subtitle", type: "text", help: "e.g. the organization or institution." },
          { name: "period", label: "Period", type: "text", help: "e.g. 2018 — 2021." },
          { name: "description", label: "Description", type: "textarea" },
          { name: "points", label: "Bullet points", type: "list", help: "One per line." },
          orderField,
        ],
      },
    }),
  },

  downloads: {
    key: "downloads",
    label: "Downloads",
    description: "Documents offered on the Downloads page. Files are not stored on the site: each entry links to a file hosted elsewhere, such as Google Drive.",
    collection: "downloads",
    publicPath: "/downloads",
    types: withPublished({
      document: {
        label: "Documents",
        singular: "document",
        titleField: "title",
        metaFields: ["fileType", "lastUpdated"],
        fields: [
          { name: "title", label: "Title", type: "text", required: true },
          { name: "key", label: "ID", type: "slug", unique: true, help: "Short name used to count downloads. Leave empty to generate it. Changing it later restarts the count." },
          { name: "description", label: "Description", type: "textarea", required: true },
          { name: "fileUrl", label: "File address", type: "file", help: "The share link of the file, e.g. from Google Drive (shared as \"Anyone with the link\"). Two documents are made by the site itself: use /portfolio.pdf for the portfolio and /contact-card.vcf for the contact card." },
          { name: "fileName", label: "File name", type: "text", required: true, help: "The name the file is saved as, e.g. Rasel_Rana_CV.pdf." },
          { name: "fileType", label: "File type", type: "text", required: true, help: "e.g. PDF." },
          { name: "fileSize", label: "File size", type: "text", help: "e.g. 120 KB." },
          { name: "lastUpdated", label: "Last updated", type: "date", help: "Set to today automatically when you add the document or change its file address. If you replace the file in Google Drive without changing the link, change this date yourself." },
          orderField,
        ],
      },
    }),
  },
};

export const MODULE_LIST = Object.values(MODULES);

export function getModule(key) {
  return Object.hasOwn(MODULES, key) ? MODULES[key] : null;
}
