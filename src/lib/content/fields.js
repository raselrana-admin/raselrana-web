// Field types shared by every dashboard form. The form renders an input per
// field (components/admin/SchemaForm.jsx) and the Server Actions validate
// with normalizeFields below, so the two can't drift apart. Plain data and
// pure functions only — safe to import from Client Components.
//
// Field: { name, label, type, required?, help?, options?, unique?, default?, withType? }
//   text      one line (max 300)
//   textarea  several lines (max 5000)
//   email     one line, must look like an email address
//   date      YYYY-MM-DD
//   number    whole number
//   url       http(s) address; may be empty unless `required`
//   file      a site path (/documents/x.pdf) or an http(s) address; required
//   select    one of `options`
//   checkbox  true / false
//   list      textarea, one item per line -> array of strings
//   links     rows of { type, label, url }; `withType: false` -> { label, url }
//   image     one uploaded photo -> { url, publicId, width, height } or null
//   gallery   several uploaded photos, each with a caption -> array of those
//   slug      lower-case-with-dashes; empty -> generated from the title field
//   competition  slug of a competition (achievements press only)

import { cleanImage } from "@/lib/cloudinary-url";

export const LINK_TYPES = [
  { value: "youtube", label: "Video (YouTube)" },
  { value: "facebook", label: "Facebook" },
  { value: "web", label: "Website" },
  { value: "news", label: "News" },
];

const HTTP_URL = /^https?:\/\/\S+$/i;
const FILE_URL = /^(https?:\/\/\S+|\/[^\s/]\S*)$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function cleanLinks(raw, field, errors) {
  let rows = raw;
  if (typeof raw === "string") {
    try {
      rows = JSON.parse(raw || "[]");
    } catch {
      rows = null;
    }
  }
  if (!Array.isArray(rows)) {
    errors[field.name] = `${field.label} could not be read.`;
    return [];
  }

  const links = [];
  for (const row of rows.slice(0, 30)) {
    const url = String(row?.url || "").trim();
    const label = String(row?.label || "").trim().slice(0, 120);
    if (!url && !label) continue; // ignore fully empty rows
    if (!HTTP_URL.test(url)) {
      errors[field.name] =
        "Every link needs a full address starting with http:// or https://.";
      continue;
    }
    if (field.withType === false) {
      if (!label) {
        errors[field.name] = "Every link needs a label.";
        continue;
      }
      links.push({ label, url });
    } else {
      const type = LINK_TYPES.some((t) => t.value === row?.type) ? row.type : "web";
      links.push({ type, label, url });
    }
  }
  return links;
}

function parseJson(value, fallback) {
  if (typeof value !== "string") return value ?? fallback;
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return undefined; // unreadable
  }
}

/** Starting values for a form: the item's values, or each field's default. */
export function initialValues(fields, item) {
  return Object.fromEntries(
    fields.map((field) => {
      const value = item?.[field.name];
      switch (field.type) {
        case "links":
        case "gallery":
          return [field.name, Array.isArray(value) ? value : []];
        case "image":
          return [field.name, value && typeof value === "object" ? value : null];
        case "list":
          return [field.name, Array.isArray(value) ? value.join("\n") : ""];
        case "checkbox":
          return [field.name, value === undefined ? Boolean(field.default) : Boolean(value)];
        case "number":
          return [field.name, value ?? 0];
        default:
          return [field.name, value ?? ""];
      }
    }),
  );
}

/**
 * Validates and cleans raw form input against a list of fields.
 * `raw` is a plain object of field name -> submitted value.
 * Returns { data, errors }; `errors` is empty when everything is valid.
 */
export function normalizeFields(fields, raw, { titleField } = {}) {
  const errors = {};
  const data = {};

  for (const field of fields) {
    const value = raw?.[field.name];
    const text = typeof value === "string" ? value.trim() : "";
    const requiredError = `${field.label} is required.`;

    switch (field.type) {
      case "links":
        data[field.name] = cleanLinks(value ?? [], field, errors);
        break;
      case "image": {
        const parsed = parseJson(value, null);
        const image = parsed ? cleanImage(parsed) : null;
        if (parsed && !image) errors[field.name] = `${field.label} could not be read. Upload it again.`;
        if (!parsed && field.required) errors[field.name] = requiredError;
        data[field.name] = image;
        break;
      }
      case "gallery": {
        const parsed = parseJson(value, []);
        if (!Array.isArray(parsed)) {
          errors[field.name] = `${field.label} could not be read.`;
          data[field.name] = [];
          break;
        }
        data[field.name] = parsed
          .slice(0, 24)
          .map((item) => {
            const image = cleanImage(item);
            return image && { ...image, caption: String(item.caption || "").trim().slice(0, 200) };
          })
          .filter(Boolean);
        break;
      }
      case "list":
        data[field.name] = String(typeof value === "string" ? value : "")
          .split(/\r?\n/)
          .map((line) => line.trim().slice(0, 300))
          .filter(Boolean)
          .slice(0, 50);
        if (field.required && data[field.name].length === 0) errors[field.name] = requiredError;
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
        data[field.name] = slugify(text) || slugify(raw?.[titleField]);
        if (!data[field.name]) errors[field.name] = requiredError;
        break;
      case "date":
        if (text && !/^\d{4}-\d{2}-\d{2}$/.test(text)) {
          errors[field.name] = `${field.label} must be a date.`;
        } else if (!text && field.required) {
          errors[field.name] = requiredError;
        }
        data[field.name] = text;
        break;
      case "url":
        if (text && !HTTP_URL.test(text)) {
          errors[field.name] = `${field.label} must start with http:// or https://.`;
        } else if (!text && field.required) {
          errors[field.name] = requiredError;
        }
        data[field.name] = text;
        break;
      case "file":
        if (!FILE_URL.test(text)) {
          errors[field.name] =
            `${field.label} must be a site path such as /documents/file.pdf, or a full https:// address.`;
        }
        data[field.name] = text;
        break;
      case "email":
        if (text.length > 254 || !EMAIL.test(text)) {
          errors[field.name] = `${field.label} must be a valid email address.`;
        }
        data[field.name] = text.toLowerCase();
        break;
      case "select":
        if (!field.options.includes(text)) {
          errors[field.name] = `Choose a ${field.label.toLowerCase()}.`;
        }
        data[field.name] = text;
        break;
      case "competition":
        data[field.name] = slugify(text);
        break;
      default: {
        const limit = field.type === "textarea" ? 5000 : 300;
        data[field.name] = text.slice(0, limit);
        if (field.required && !data[field.name]) errors[field.name] = requiredError;
      }
    }
  }

  return { data, errors };
}
