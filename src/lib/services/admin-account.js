import { cache } from "react";
import { hashPassword } from "@/lib/auth/password";
import { getDb } from "@/lib/services/content-service";

const SETTINGS = "settings";
const DOC_ID = "admin-account";

// The account the site starts with: the login from the environment
// variables. It is used until the account is first saved from the
// dashboard, and again if the saved account is ever deleted (the way back
// in after a forgotten password).
function envAccount() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!email || !passwordHash) return null;
  return { email, name: "Admin", passwordHash, sessionVersion: 0, source: "env" };
}

async function readAccount() {
  try {
    const doc = await (await getDb()).collection(SETTINGS).findOne({ _id: DOC_ID });
    if (doc) {
      return {
        email: doc.email,
        name: doc.name || "Admin",
        passwordHash: doc.passwordHash,
        sessionVersion: doc.sessionVersion ?? 0,
        source: "db",
      };
    }
  } catch (err) {
    console.error("Failed to read admin account:", err);
  }
  return envAccount();
}

/** The single admin account, or null if none is configured. Memoised per request. */
export const getAdminAccount = cache(readAccount);

async function writeAccount(account) {
  const { source, ...fields } = account;
  await (await getDb())
    .collection(SETTINGS)
    .updateOne({ _id: DOC_ID }, { $set: { ...fields, updatedAt: new Date() } }, { upsert: true });
  return { ...fields, source: "db" };
}

/** Changes the display name and login email. Returns the saved account. */
export async function updateAccountProfile({ name, email }) {
  const current = await readAccount();
  if (!current) throw new Error("No admin account is configured.");
  return writeAccount({ ...current, name, email });
}

/**
 * Sets a new password and raises the session version, which signs out every
 * existing session. Returns the saved account so the caller can issue a new
 * cookie for the current browser.
 */
export async function changePassword(newPassword) {
  const current = await readAccount();
  if (!current) throw new Error("No admin account is configured.");
  return writeAccount({
    ...current,
    passwordHash: hashPassword(newPassword),
    sessionVersion: current.sessionVersion + 1,
  });
}
