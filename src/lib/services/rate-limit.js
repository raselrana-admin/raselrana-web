import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.MONGODB_DB || "raselrana";
const COLLECTION = "rate_limits";
// Hits are kept for an hour, so no window can be longer than that.
const TTL_SECONDS = 60 * 60;

/** Best-effort client IP. On Vercel the platform sets x-forwarded-for. */
export function getClientIp(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown"
  );
}

/**
 * Records one hit for `bucket` + `ip` and reports whether that caller is now
 * over `max` hits within `windowSeconds`. Backed by Mongo because the site
 * runs on serverless functions, where in-memory counters don't persist.
 *
 * Fails open: if Mongo is unreachable the request is allowed, so a database
 * outage never takes the public forms down with it.
 */
export async function isRateLimited({ bucket, ip, max, windowSeconds }) {
  try {
    const client = await clientPromise;
    const collection = client.db(DB_NAME).collection(COLLECTION);

    const since = new Date(Date.now() - windowSeconds * 1000);
    const hits = await collection.countDocuments({
      bucket,
      ip,
      at: { $gt: since },
    });
    if (hits >= max) return true;

    // TTL index lets Mongo delete old hits on its own; createIndex is a
    // no-op once the index exists.
    await collection.createIndex({ at: 1 }, { expireAfterSeconds: TTL_SECONDS });
    await collection.insertOne({ bucket, ip, at: new Date() });
    return false;
  } catch (err) {
    console.error("Rate limit check failed:", err);
    return false;
  }
}
