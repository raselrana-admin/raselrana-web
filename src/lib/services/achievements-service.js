import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import * as defaults from "@/lib/data/achievements";
import { SLUG_TYPES } from "@/lib/achievements-schema";

const DB_NAME = process.env.MONGODB_DB || "raselrana";
const COLLECTION = "achievements";

// Every achievement item is one document in a single collection, told apart
// by `type`: competition | judging | sports | leadership | press | affiliation.
// One extra document of type IMPORT_MARKER records that the starter content
// has been imported, so it is offered once and never re-added after deletes.
const IMPORT_MARKER = "_import";

async function getCollection() {
  const client = await clientPromise;
  return client.db(DB_NAME).collection(COLLECTION);
}

function serialize({ _id, createdAt, updatedAt, ...rest }) {
  return { id: _id.toString(), ...rest };
}

const byNewest = (a, b) => String(b.sortDate).localeCompare(String(a.sortDate));
const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0);

function group(docs) {
  const of = (type) => docs.filter((d) => d.type === type).map(serialize);
  return {
    competitions: of("competition").sort(byNewest),
    judging: of("judging").sort(byNewest),
    sports: of("sports").sort(byNewest),
    leadership: of("leadership").sort(byOrder),
    press: of("press").sort(byOrder),
    affiliations: of("affiliation").sort(byOrder),
  };
}

function staticData() {
  const { competitions, judging, sports, leadership, press, affiliations } = defaults;
  return { competitions, judging, sports, leadership, press, affiliations };
}

/**
 * Data for the public Achievements pages. Falls back to the static
 * lib/data/achievements.js content while the collection is completely empty
 * or if Mongo is unreachable, so the public page always renders.
 */
export async function getAchievementsData() {
  try {
    const collection = await getCollection();
    const docs = await collection.find({}).toArray();
    return docs.length > 0 ? group(docs) : staticData();
  } catch (err) {
    console.error("Failed to fetch achievements:", err);
    return staticData();
  }
}

/** Data for the admin panel — database only, no static fallback. */
export async function getAchievementsAdminData() {
  const collection = await getCollection();
  const docs = await collection.find({}).toArray();
  return {
    canImport: !docs.some((d) => d.type === IMPORT_MARKER),
    data: group(docs),
  };
}

/** Looks a slug up across every category that has a detail page. */
export function findAchievement(data, slug) {
  const comp = data.competitions.find((c) => c.slug === slug);
  if (comp) return { category: "competition", categoryLabel: "Competition", item: comp };

  const judge = data.judging.find((j) => j.slug === slug);
  if (judge) return { category: "judging", categoryLabel: "Judging & Mentoring", item: judge };

  const sport = data.sports.find((s) => s.slug === slug);
  if (sport) return { category: "sports", categoryLabel: "Sports & Beyond", item: sport };

  return null;
}

function toObjectId(id) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

async function isSlugTaken(collection, slug, exceptId) {
  const filter = { slug, type: { $in: SLUG_TYPES } };
  if (exceptId) filter._id = { $ne: exceptId };
  return Boolean(await collection.findOne(filter));
}

/**
 * Creates (no id) or updates (with id) one item. `data` must already be
 * validated by normalizeAchievement. Returns { ok } or { error, fieldErrors }.
 */
export async function saveAchievement(type, id, data) {
  const collection = await getCollection();
  const objectId = id ? toObjectId(id) : null;
  if (id && !objectId) return { error: "That item no longer exists." };

  const hasSlug = SLUG_TYPES.includes(type);
  if (hasSlug && (await isSlugTaken(collection, data.slug, objectId))) {
    return {
      error: "Please fix the highlighted field.",
      fieldErrors: { slug: "Another achievement already uses this slug." },
    };
  }

  const now = new Date();

  if (objectId) {
    const existing = await collection.findOne({ _id: objectId, type });
    if (!existing) return { error: "That item no longer exists." };

    await collection.updateOne(
      { _id: objectId },
      { $set: { ...data, updatedAt: now } },
    );

    // Keep press clippings pointing at a competition whose slug was renamed.
    if (type === "competition" && existing.slug !== data.slug) {
      await collection.updateMany(
        { type: "press", competition: existing.slug },
        { $set: { competition: data.slug } },
      );
    }
  } else {
    const { insertedId } = await collection.insertOne({
      type,
      ...data,
      createdAt: now,
      updatedAt: now,
    });
    id = insertedId.toString();
  }

  // Only one press clipping can be featured at a time.
  if (type === "press" && data.featured) {
    await collection.updateMany(
      { type: "press", _id: { $ne: toObjectId(id) } },
      { $set: { featured: false } },
    );
  }

  return { ok: true };
}

export async function deleteAchievement(id) {
  const objectId = toObjectId(id);
  if (!objectId) return;

  const collection = await getCollection();
  const doc = await collection.findOne({ _id: objectId });
  if (!doc) return;

  await collection.deleteOne({ _id: objectId });

  if (doc.type === "competition") {
    await collection.updateMany(
      { type: "press", competition: doc.slug },
      { $set: { competition: "" } },
    );
  }
}

/**
 * Copies the starter content from lib/data/achievements.js into the
 * collection, alongside anything already there. Runs once (see
 * IMPORT_MARKER) and skips starter items whose slug is already in use, so it
 * never duplicates or overwrites edited data.
 */
export async function importDefaultAchievements() {
  const collection = await getCollection();
  const existing = await collection.find({}).toArray();
  if (existing.some((d) => d.type === IMPORT_MARKER)) return false;

  const usedSlugs = new Set(existing.map((d) => d.slug).filter(Boolean));
  const hasFeaturedPress = existing.some((d) => d.type === "press" && d.featured);

  const now = new Date();
  const stamp = (type, extra = {}) => (item, index) => ({
    type,
    ...extra,
    ...item,
    ...(extra.order === undefined ? {} : { order: index }),
    createdAt: now,
    updatedAt: now,
  });

  const docs = [
    ...defaults.competitions.map(stamp("competition")),
    ...defaults.judging.map(stamp("judging")),
    ...defaults.sports.map(stamp("sports")),
    ...defaults.leadership.map(stamp("leadership", { description: "", links: [], order: 0 })),
    ...defaults.press.map(stamp("press", { competition: "", featured: false, order: 0 })),
    ...defaults.affiliations.map(stamp("affiliation", { order: 0 })),
  ]
    .filter((doc) => !doc.slug || !usedSlugs.has(doc.slug))
    .map((doc) =>
      doc.type === "press" && hasFeaturedPress ? { ...doc, featured: false } : doc,
    );

  await collection.insertMany([
    ...docs,
    { type: IMPORT_MARKER, createdAt: now },
  ]);
  return true;
}
