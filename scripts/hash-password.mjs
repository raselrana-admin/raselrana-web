// Generates the admin login values for .env.local / Vercel.
//
//   npm run hash-password
//
// Prints ADMIN_PASSWORD_HASH (scrypt, same format src/lib/auth/password.js
// verifies) and a fresh SESSION_SECRET. The password itself is never stored.

import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline/promises";

const rl = createInterface({ input: process.stdin, output: process.stdout });
const password = (await rl.question("Admin password (min 10 characters): ")).trim();
rl.close();

if (password.length < 10) {
  console.error("Password is too short — use at least 10 characters.");
  process.exit(1);
}

const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64);

console.log("\nAdd these to .env.local (and to Vercel's environment variables):\n");
console.log(`ADMIN_PASSWORD_HASH=scrypt:${salt.toString("hex")}:${hash.toString("hex")}`);
console.log(`SESSION_SECRET=${randomBytes(32).toString("hex")}`);
