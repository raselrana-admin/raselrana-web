import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.MONGODB_DB || "raselrana";
const COLLECTION = "download_stats";

/**
 * Returns { [documentId]: count } for every tracked download.
 * Used by the Downloads Server Component so counts render on first paint.
 */
export async function getDownloadCounts() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const docs = await db.collection(COLLECTION).find({}).toArray();
    return Object.fromEntries(docs.map((d) => [d.id, d.count ?? 0]));
  } catch (err) {
    console.error("Failed to fetch download counts:", err);
    // Fail soft — the page should still render without counts if Mongo is down
    return {};
  }
}

/**
 * Returns the count for a single document id.
 */
export async function getDownloadCount(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const doc = await db.collection(COLLECTION).findOne({ id });
    return doc?.count ?? 0;
  } catch (err) {
    console.error("Failed to fetch download count:", err);
    return 0;
  }
}

/**
 * Increments a document's download counter (upserts on first download).
 * Returns the new count.
 */
export async function trackDownload(id) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const result = await db.collection(COLLECTION).findOneAndUpdate(
    { id },
    {
      $inc: { count: 1 },
      $set: { lastDownloadedAt: new Date() },
      $setOnInsert: { id },
    },
    { upsert: true, returnDocument: "after" }
  );

  // Driver versions differ on whether the updated doc is returned directly
  // or under `.value` — handle both.
  const doc = result?.value ?? result;
  return doc?.count ?? 1;
}
