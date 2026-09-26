import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error(
    "Missing MONGODB_URI. Add it to your .env.local file (see .env.local.example)."
  );
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In dev, Next.js hot-reloads modules, which would otherwise create a new
  // MongoClient on every save. Cache the promise on the global object so
  // HMR reuses the same connection.
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, no HMR — a module-scoped client per server instance is fine.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Import this in server-only code (API routes, Server Components):
//   import clientPromise from "@/lib/mongodb";
//   const client = await clientPromise;
//   const db = client.db(process.env.MONGODB_DB);
export default clientPromise;
