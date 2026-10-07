import { scryptSync, timingSafeEqual } from "node:crypto";

// Stored format: scrypt:<salt hex>:<hash hex>
// Generate one with `npm run hash-password` (scripts/hash-password.mjs).
export function verifyPassword(password, stored) {
  const [scheme, saltHex, hashHex] = String(stored || "").split(":");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;

  const expected = Buffer.from(hashHex, "hex");
  const actual = scryptSync(String(password), Buffer.from(saltHex, "hex"), expected.length);
  return timingSafeEqual(actual, expected);
}
