import { cache } from "react";
import { MODULE_LIST } from "@/lib/content/modules";
import { getDb } from "@/lib/services/content-service";

// When the site last changed, for the "Last updated" date in the footer:
// the newer of the newest dashboard save that visitors can see (published
// entries, the public profile, page texts) and the build of the running
// version, so design changes count too. Blog posts are not included; they
// live in the blog app.

// Set at build time in next.config.mjs
const BUILT_AT = process.env.SITE_BUILT_AT || null;

async function newestIn(collection, filter) {
  const doc = await collection.findOne(
    { ...filter, updatedAt: { $type: "date" } },
    { sort: { updatedAt: -1 }, projection: { updatedAt: 1 } },
  );
  return doc?.updatedAt ?? null;
}

/** ISO date-time of the last update, or null. Memoised per request; never throws. */
export const getSiteUpdatedAt = cache(async () => {
  const dates = BUILT_AT ? [new Date(BUILT_AT)] : [];
  try {
    const db = await getDb();
    const found = await Promise.all([
      ...MODULE_LIST.map((mod) =>
        newestIn(db.collection(mod.collection), { published: { $ne: false } }),
      ),
      // The login account is not part of the public site
      newestIn(db.collection("settings"), { _id: { $ne: "admin-account" } }),
    ]);
    dates.push(...found.filter(Boolean));
  } catch (err) {
    console.error("Failed to read the last update date:", err);
  }
  const valid = dates.filter((d) => !Number.isNaN(d.getTime()));
  if (valid.length === 0) return null;
  return new Date(Math.max(...valid.map((d) => d.getTime()))).toISOString();
});
