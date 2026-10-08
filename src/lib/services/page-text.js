import { cache } from "react";
import { PAGE_DEFAULTS } from "@/lib/content/page-defaults";
import { PAGE_TEXT } from "@/lib/content/page-text";
import { getDb } from "@/lib/services/content-service";

const SETTINGS = "settings";
const docId = (key) => `page-${key}`;

function pick(key, doc) {
  return Object.fromEntries(
    PAGE_TEXT[key].fields
      .filter((field) => doc[field.name] !== undefined)
      .map((field) => [field.name, doc[field.name]]),
  );
}

/**
 * The text of one page: what was saved in the dashboard over the defaults
 * from the code. Never throws — an unreachable database gives the defaults.
 * Memoised per request.
 */
export const getPageText = cache(async (key) => {
  if (!PAGE_TEXT[key]) throw new Error(`Unknown page: ${key}`);
  try {
    const doc = await (await getDb()).collection(SETTINGS).findOne({ _id: docId(key) });
    return doc ? { ...PAGE_DEFAULTS[key], ...pick(key, doc) } : PAGE_DEFAULTS[key];
  } catch (err) {
    console.error(`Failed to fetch page text for ${key}:`, err);
    return PAGE_DEFAULTS[key];
  }
});

/** `data` must already be validated against PAGE_TEXT[key].fields. */
export async function savePageText(key, data) {
  await (await getDb())
    .collection(SETTINGS)
    .updateOne({ _id: docId(key) }, { $set: { ...data, updatedAt: new Date() } }, { upsert: true });
}
