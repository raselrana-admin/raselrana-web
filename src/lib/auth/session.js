import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  verifySessionToken,
} from "@/lib/auth/session-token";
import { getAdminAccount } from "@/lib/services/admin-account";

/**
 * The signed-in admin account, or null. A cookie counts only if it is
 * genuine, unexpired, and still matches the account's email and session
 * version (changing the password raises the version and so ends old sessions).
 */
export async function getSession() {
  const store = await cookies();
  const token = await verifySessionToken(store.get(SESSION_COOKIE)?.value);
  if (!token) return null;

  const account = await getAdminAccount();
  if (!account) return null;
  if (token.sub !== account.email) return null;
  if ((token.v ?? 0) !== account.sessionVersion) return null;

  return { email: account.email, name: account.name };
}

/**
 * Call at the top of every admin page and Server Action. src/proxy.js also
 * guards /admin, but it must not be the only check.
 */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

/** Issues the session cookie for an account ({ email, sessionVersion }). */
export async function startSession(account) {
  const store = await cookies();
  store.set(
    SESSION_COOKIE,
    await createSessionToken(account.email, account.sessionVersion ?? 0),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    },
  );
}

export async function endSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
