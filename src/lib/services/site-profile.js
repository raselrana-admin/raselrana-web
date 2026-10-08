import { cache } from "react";
import { PROFILE_FIELDS } from "@/lib/content/profile";
import { profile as homeProfile } from "@/lib/data/home";
import { siteInfo, socialLinks } from "@/lib/data/site";
import { getDb } from "@/lib/services/content-service";

const SETTINGS = "settings";
const DOC_ID = "site-profile";

// What the site shows until the profile is saved from the dashboard, and
// whenever Mongo is unreachable.
function defaults() {
  return {
    name: siteInfo.name,
    role: homeProfile.role,
    org: homeProfile.org,
    tagline: homeProfile.tagline,
    footerTagline: siteInfo.tagline,
    focus: homeProfile.meta
      .split("·")
      .map((t) => t.trim())
      .filter(Boolean),
    location: siteInfo.location,
    coordinates: siteInfo.coordinates,
    email: siteInfo.email,
    socialLinks: socialLinks
      .filter((l) => /^https?:\/\//i.test(l.href || ""))
      .map((l) => ({ label: l.label, url: l.href })),
  };
}

function pick(doc) {
  return Object.fromEntries(
    PROFILE_FIELDS.filter((f) => doc[f.name] !== undefined).map((f) => [f.name, doc[f.name]]),
  );
}

/** The public profile: saved values over the defaults. Memoised per request. */
export const getSiteProfile = cache(async () => {
  try {
    const doc = await (await getDb()).collection(SETTINGS).findOne({ _id: DOC_ID });
    return doc ? { ...defaults(), ...pick(doc) } : defaults();
  } catch (err) {
    console.error("Failed to fetch site profile:", err);
    return defaults();
  }
});

/** `data` must already be validated against PROFILE_FIELDS. */
export async function saveSiteProfile(data) {
  await (await getDb())
    .collection(SETTINGS)
    .updateOne({ _id: DOC_ID }, { $set: { ...data, updatedAt: new Date() } }, { upsert: true });
}
