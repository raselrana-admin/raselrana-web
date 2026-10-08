import { cache } from "react";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { HOOKS } from "@/lib/content/hooks";
import { MODULE_LIST, getModule } from "@/lib/content/modules";
import { STARTERS } from "@/lib/content/starter";

const DB_NAME = process.env.MONGODB_DB || "raselrana";

// One marker document per collection records that its starter content has
// been imported, so the import is offered once and never re-adds deleted items.
const IMPORT_MARKER = "_import";

// Words that mean an entry still holds sample text (for the overview page).
const SAMPLE_PATTERN = /\bsample\b|example\.com|\bEXAMPLE\b|\bTODO\b|\[placeholder|20XX|^test$/i;

export async function getDb() {
  const client = await clientPromise;
  return client.db(DB_NAME);
}

async function getCollection(mod) {
  return (await getDb()).collection(mod.collection);
}

function toObjectId(id) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

function serialize({ _id, createdAt, updatedAt, ...rest }) {
  return {
    id: _id.toString(),
    ...rest,
    updatedAt: updatedAt instanceof Date ? updatedAt.toISOString() : null,
  };
}

// Keys of the published download documents, cached briefly for the tracking
// API and cleared whenever a download entry is saved or deleted.
let downloadKeysCache = { at: 0, keys: new Set() };

const sorters = {
  // Events: newest first
  newest: (a, b) => String(b.sortDate).localeCompare(String(a.sortDate)),
  // Everything else: the Position number, then oldest first
  order: (a, b) =>
    (a.order ?? 0) - (b.order ?? 0) ||
    (a.createdAt?.getTime?.() ?? 0) - (b.createdAt?.getTime?.() ?? 0),
};

/** { [typeKey]: [entries] } for every type of the module, sorted. */
function groupByType(mod, docs, { publishedOnly }) {
  return Object.fromEntries(
    Object.entries(mod.types).map(([typeKey, type]) => [
      typeKey,
      docs
        .filter((d) => d.type === typeKey && (!publishedOnly || d.published !== false))
        .sort(sorters[type.sort] ?? sorters.order)
        .map(serialize),
    ]),
  );
}

function starterEntries(mod) {
  const docs = STARTERS[mod.key]().map((doc, index) => ({
    _id: `starter-${index}`,
    published: true,
    ...doc,
  }));
  return groupByType(mod, docs, { publishedOnly: true });
}

/**
 * Published entries of a module for the public pages, as
 * { [typeKey]: [entries] }. Falls back to the starter content while the
 * collection is completely empty or Mongo is unreachable, so public pages
 * always render. Memoised per request.
 */
export const getEntries = cache(async (moduleKey) => {
  const mod = getModule(moduleKey);
  if (!mod) throw new Error(`Unknown content module: ${moduleKey}`);

  try {
    const collection = await getCollection(mod);
    const docs = await collection.find({}).toArray();
    if (docs.length === 0) return starterEntries(mod);
    return groupByType(mod, docs, { publishedOnly: true });
  } catch (err) {
    console.error(`Failed to fetch ${moduleKey}:`, err);
    return starterEntries(mod);
  }
});

/** Everything in a module for the dashboard — database only, drafts included. */
export async function getAdminEntries(moduleKey) {
  const mod = getModule(moduleKey);
  const collection = await getCollection(mod);
  const docs = await collection.find({}).toArray();
  return {
    canImport: !docs.some((d) => d.type === IMPORT_MARKER),
    entries: groupByType(mod, docs, { publishedOnly: false }),
  };
}

/**
 * Creates (no id) or updates (with id) one entry. `data` must already be
 * validated with normalizeFields. Returns { ok } or { error, fieldErrors }.
 */
export async function saveEntry(moduleKey, typeKey, id, data) {
  const mod = getModule(moduleKey);
  const type = mod?.types[typeKey];
  if (!type) return { error: "Unknown content type." };

  const collection = await getCollection(mod);
  const objectId = id ? toObjectId(id) : null;
  if (id && !objectId) return { error: "That entry no longer exists." };

  // Fields marked `unique` must not repeat anywhere in the collection.
  for (const field of type.fields.filter((f) => f.unique)) {
    const filter = { [field.name]: data[field.name] };
    if (objectId) filter._id = { $ne: objectId };
    if (await collection.findOne(filter)) {
      return {
        error: "Please fix the highlighted field.",
        fieldErrors: {
          [field.name]: `Another entry already uses this ${field.label.toLowerCase()}.`,
        },
      };
    }
  }

  const now = new Date();
  let previous = null;
  let savedId = objectId;

  if (objectId) {
    previous = await collection.findOne({ _id: objectId, type: typeKey });
    if (!previous) return { error: "That entry no longer exists." };
  }
  HOOKS[moduleKey]?.beforeSave?.(data, previous);

  if (objectId) {
    await collection.updateOne({ _id: objectId }, { $set: { ...data, updatedAt: now } });
  } else {
    const result = await collection.insertOne({
      type: typeKey,
      ...data,
      createdAt: now,
      updatedAt: now,
    });
    savedId = result.insertedId;
  }

  await HOOKS[moduleKey]?.afterSave?.(collection, {
    type: typeKey,
    objectId: savedId,
    data,
    previous,
  });
  if (moduleKey === "downloads") downloadKeysCache.at = 0;

  return { ok: true };
}

export async function deleteEntry(moduleKey, id) {
  const mod = getModule(moduleKey);
  const objectId = toObjectId(id);
  if (!mod || !objectId) return;

  const collection = await getCollection(mod);
  const doc = await collection.findOne({ _id: objectId });
  if (!doc || doc.type === IMPORT_MARKER) return;

  await collection.deleteOne({ _id: objectId });
  await HOOKS[moduleKey]?.afterDelete?.(collection, doc);
  if (moduleKey === "downloads") downloadKeysCache.at = 0;
}

/**
 * Copies a module's starter content into its collection, next to anything
 * already there. Runs once per module (see IMPORT_MARKER) and skips starter
 * entries whose unique fields are already in use, so it never duplicates or
 * overwrites edited data.
 */
export async function importStarter(moduleKey) {
  const mod = getModule(moduleKey);
  if (!mod) return false;

  const collection = await getCollection(mod);
  const existing = await collection.find({}).toArray();
  if (existing.some((d) => d.type === IMPORT_MARKER)) return false;

  const uniqueNames = [
    ...new Set(
      Object.values(mod.types).flatMap((t) =>
        t.fields.filter((f) => f.unique).map((f) => f.name),
      ),
    ),
  ];
  const taken = Object.fromEntries(
    uniqueNames.map((name) => [name, new Set(existing.map((d) => d[name]).filter(Boolean))]),
  );
  const hasFeaturedPress = existing.some((d) => d.type === "press" && d.featured);

  const now = new Date();
  const docs = STARTERS[moduleKey]()
    .filter((doc) => uniqueNames.every((name) => !doc[name] || !taken[name].has(doc[name])))
    .map((doc) => ({
      published: true,
      ...doc,
      ...(doc.type === "press" && hasFeaturedPress ? { featured: false } : {}),
      createdAt: now,
      updatedAt: now,
    }));

  await collection.insertMany([...docs, { type: IMPORT_MARKER, createdAt: now }]);
  return true;
}


// ---- Downloads -----------------------------------------------------------

/** Keys of the published documents, cached for a minute (used by the tracking API). */
export async function getDownloadKeys() {
  if (Date.now() - downloadKeysCache.at < 60_000) return downloadKeysCache.keys;
  const { document } = await getEntries("downloads");
  downloadKeysCache = { at: Date.now(), keys: new Set(document.map((d) => d.key)) };
  return downloadKeysCache.keys;
}

// ---- Overview --------------------------------------------------------------

/** Numbers and lists for the dashboard's first page. */
export async function getOverview() {
  const db = await getDb();

  const modules = await Promise.all(
    MODULE_LIST.map(async (mod) => {
      const docs = (await db.collection(mod.collection).find({}).toArray()).filter(
        (d) => d.type !== IMPORT_MARKER,
      );
      const entries = docs.map((doc) => {
        const type = mod.types[doc.type];
        return {
          id: doc._id.toString(),
          moduleKey: mod.key,
          moduleLabel: mod.label,
          typeLabel: type?.singular ?? doc.type,
          title: String(doc[type?.titleField] ?? "Untitled"),
          published: doc.published !== false,
          updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : null,
          // Check the visible text only, not ids or dates
          isSample: SAMPLE_PATTERN.test(
            Object.values(doc)
              .filter((v) => typeof v === "string" || Array.isArray(v))
              .map((v) => (Array.isArray(v) ? JSON.stringify(v) : v))
              .join(" \n "),
          ),
        };
      });
      return {
        key: mod.key,
        label: mod.label,
        total: entries.length,
        drafts: entries.filter((e) => !e.published).length,
        entries,
      };
    }),
  );

  const all = modules.flatMap((m) => m.entries);
  const stats = await db.collection("download_stats").find({}).toArray();

  return {
    modules: modules.map(({ entries, ...rest }) => rest),
    totalDownloads: stats.reduce((sum, s) => sum + (s.count ?? 0), 0),
    recent: all
      .filter((e) => e.updatedAt)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 6),
    sample: all.filter((e) => e.isSample),
  };
}
