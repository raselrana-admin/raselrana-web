// Signed session tokens for the admin panel. Uses Web Crypto only (no
// next/headers, no node:crypto) so src/proxy.js can import it safely.
//
// Token format: <base64url JSON payload>.<base64url HMAC-SHA256 signature>

export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, in seconds

const encoder = new TextEncoder();

function toBase64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

export function isAuthConfigured() {
  return Boolean(
    process.env.ADMIN_EMAIL &&
      process.env.ADMIN_PASSWORD_HASH &&
      process.env.SESSION_SECRET &&
      process.env.SESSION_SECRET.length >= 32,
  );
}

async function getKey() {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(process.env.SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function createSessionToken(email) {
  const payload = toBase64Url(
    encoder.encode(
      JSON.stringify({
        sub: email,
        exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
      }),
    ),
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    await getKey(),
    encoder.encode(payload),
  );
  return `${payload}.${toBase64Url(new Uint8Array(signature))}`;
}

/** Returns the session payload ({ sub, exp }) or null if the token is invalid. */
export async function verifySessionToken(token) {
  if (!token || typeof token !== "string" || !isAuthConfigured()) return null;

  const [payload, signature, ...rest] = token.split(".");
  if (!payload || !signature || rest.length > 0) return null;

  try {
    const valid = await crypto.subtle.verify(
      "HMAC",
      await getKey(),
      fromBase64Url(signature),
      encoder.encode(payload),
    );
    if (!valid) return null;

    const session = JSON.parse(new TextDecoder().decode(fromBase64Url(payload)));
    if (typeof session.exp !== "number" || session.exp < Date.now() / 1000) {
      return null;
    }
    // Changing ADMIN_EMAIL invalidates every existing session.
    if (session.sub !== process.env.ADMIN_EMAIL.trim().toLowerCase()) return null;

    return session;
  } catch {
    return null;
  }
}
