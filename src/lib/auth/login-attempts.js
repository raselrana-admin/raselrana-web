import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.MONGODB_DB || "raselrana";
const COLLECTION = "login_attempts";
const WINDOW_SECONDS = 15 * 60;
const MAX_FAILURES = 5;

async function getCollection() {
  const client = await clientPromise;
  return client.db(DB_NAME).collection(COLLECTION);
}

/**
 * True when this IP has failed too many logins recently. Fails open: if
 * Mongo is unreachable the login is still allowed, since the password check
 * itself is what protects the panel.
 */
export async function isLoginBlocked(ip) {
  try {
    const collection = await getCollection();
    const since = new Date(Date.now() - WINDOW_SECONDS * 1000);
    const failures = await collection.countDocuments({ ip, at: { $gt: since } });
    return failures >= MAX_FAILURES;
  } catch (err) {
    console.error("Login attempt check failed:", err);
    return false;
  }
}

export async function recordLoginFailure(ip) {
  try {
    const collection = await getCollection();
    // TTL index lets Mongo delete old attempts on its own; createIndex is a
    // no-op once the index exists.
    await collection.createIndex({ at: 1 }, { expireAfterSeconds: WINDOW_SECONDS });
    await collection.insertOne({ ip, at: new Date() });
  } catch (err) {
    console.error("Recording login failure failed:", err);
  }
}
