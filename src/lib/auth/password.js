import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

// Stored format: scrypt:<salt hex>:<hash hex>
// scripts/hash-password.mjs produces the same format for the first password.

export function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = scryptSync(String(password), salt, 64);
  return `scrypt:${salt.toString("hex")}:${hash.toString("hex")}`;
}

export function verifyPassword(password, stored) {
  const [scheme, saltHex, hashHex] = String(stored || "").split(":");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;

  const expected = Buffer.from(hashHex, "hex");
  const actual = scryptSync(String(password), Buffer.from(saltHex, "hex"), expected.length);
  return timingSafeEqual(actual, expected);
}
