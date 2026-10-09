// Creates (or resets) the admin login from two lines in .env.local.
//
//   1. In .env.local write:   ADMIN_EMAIL=you@example.com
//                             ADMIN_PASSWORD=your-password
//   2. npm run create-admin
//
// The script writes ADMIN_PASSWORD_HASH (scrypt, same format
// src/lib/auth/password.js verifies) and empties ADMIN_PASSWORD, so the plain
// password does not stay in the file. SESSION_SECRET is only added when it is
// missing. If an account was already saved from /admin/account, that database
// copy is given the same email and password, because it wins over the
// environment values.

import { randomBytes, scryptSync } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { MongoClient } from "mongodb";

const ENV_FILE = new URL("../.env.local", import.meta.url);

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!existsSync(ENV_FILE)) fail("There is no .env.local file. Copy .env.example to .env.local first.");

let env = readFileSync(ENV_FILE, "utf8");
const newline = env.includes("\r\n") ? "\r\n" : "\n";

// The value of `name` in the file, without surrounding quotes.
function getValue(name) {
  const match = env.match(new RegExp(`^${name}=(.*)$`, "m"));
  return (match?.[1] ?? "").trim().replace(/^(["'])(.*)\1$/, "$2");
}

// Replaces the line for `name`, or adds it at the end when there is none.
function setValue(name, value) {
  const line = new RegExp(`^${name}=.*$`, "m");
  if (line.test(env)) {
    env = env.replace(line, () => `${name}=${value}`);
  } else {
    if (env && !env.endsWith("\n")) env += newline;
    env += `${name}=${value}${newline}`;
  }
}

const email = getValue("ADMIN_EMAIL").toLowerCase();
const password = getValue("ADMIN_PASSWORD");

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  fail("Write your login email in .env.local first:  ADMIN_EMAIL=you@example.com");
}
if (!password) {
  fail("Write the password you want in .env.local first:  ADMIN_PASSWORD=your-password");
}
if (password.length < 10) {
  fail("Password is too short — use at least 10 characters.");
}

const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64);
const passwordHash = `scrypt:${salt.toString("hex")}:${hash.toString("hex")}`;

setValue("ADMIN_PASSWORD_HASH", passwordHash);
setValue("ADMIN_PASSWORD", "");

const hasSecret = Boolean(getValue("SESSION_SECRET"));
if (!hasSecret) setValue("SESSION_SECRET", randomBytes(32).toString("hex"));

writeFileSync(ENV_FILE, env);

// Updates the account saved from the dashboard, if there is one. Returns
// "updated", "none" (no saved account, the environment login is used) or
// "failed".
async function updateSavedAccount() {
  const uri = getValue("MONGODB_URI");
  if (!uri) return "none";

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
  try {
    await client.connect();
    const result = await client
      .db(getValue("MONGODB_DB") || "raselrana")
      .collection("settings")
      .updateOne(
        { _id: "admin-account" },
        { $set: { email, passwordHash, updatedAt: new Date() }, $inc: { sessionVersion: 1 } }
      );
    return result.matchedCount ? "updated" : "none";
  } catch (err) {
    console.error(`\nCould not reach the database: ${err.message}`);
    return "failed";
  } finally {
    await client.close();
  }
}

const saved = await updateSavedAccount();

console.log(`\nAdmin login set for ${email}.`);
console.log(
  ".env.local updated: ADMIN_PASSWORD_HASH written, ADMIN_PASSWORD emptied" +
    (hasSecret ? "." : ", SESSION_SECRET added.")
);
if (saved === "updated") {
  console.log("The account saved in the database was updated too; other sessions are signed out.");
}
if (saved === "failed") {
  console.log("If an account was saved from /admin/account, it still has the old password. Write ADMIN_PASSWORD again and rerun when the database is reachable.");
}
console.log("Restart `npm run dev`, then sign in at /admin/login.");
console.log("\nFor the live site, put these in Vercel's environment variables and redeploy:\n");
console.log(`ADMIN_EMAIL=${email}`);
console.log(`ADMIN_PASSWORD_HASH=${passwordHash}`);
if (!hasSecret) console.log("SESSION_SECRET: copy the new line from .env.local");
