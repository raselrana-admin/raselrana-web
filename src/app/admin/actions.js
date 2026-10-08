"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { isLoginBlocked, recordLoginFailure } from "@/lib/auth/login-attempts";
import { verifyPassword } from "@/lib/auth/password";
import { endSession, requireAdmin, startSession } from "@/lib/auth/session";
import { hasSessionSecret } from "@/lib/auth/session-token";
import { createUploadSignature, isCloudinaryConfigured } from "@/lib/cloudinary";
import { normalizeFields } from "@/lib/content/fields";
import { getModule } from "@/lib/content/modules";
import { PAGE_TEXT, hasPageText } from "@/lib/content/page-text";
import { PROFILE_FIELDS } from "@/lib/content/profile";
import {
  changePassword,
  getAdminAccount,
  updateAccountProfile,
} from "@/lib/services/admin-account";
import { deleteEntry, importStarter, saveEntry } from "@/lib/services/content-service";
import { savePageText } from "@/lib/services/page-text";
import { saveSiteProfile } from "@/lib/services/site-profile";

// Every action except login must call requireAdmin() first — Server Actions
// are public POST endpoints, so the proxy and page checks don't cover them.

const MIN_PASSWORD_LENGTH = 12;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Content shows up on several pages (its own page, the home page previews,
// the footer), so refresh everything rather than track which.
function refreshSite() {
  revalidatePath("/", "layout");
}

async function clientIp() {
  const requestHeaders = await headers();
  return requestHeaders.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}

function rawValues(fields, formData) {
  return Object.fromEntries(fields.map((f) => [f.name, formData.get(f.name)]));
}

// ---- Sign in / out -------------------------------------------------------

export async function loginAction(_prevState, formData) {
  const account = hasSessionSecret() ? await getAdminAccount() : null;
  if (!account) {
    return { error: "Admin login is not configured on the server yet." };
  }

  const ip = await clientIp();
  if (await isLoginBlocked(ip)) {
    return { error: "Too many failed attempts. Try again in 15 minutes." };
  }

  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  // Always run the password check so a wrong email takes as long as a wrong password.
  const passwordOk = verifyPassword(password, account.passwordHash);

  if (email !== account.email || !passwordOk) {
    await recordLoginFailure(ip);
    return { error: "Incorrect email or password." };
  }

  await startSession(account);
  redirect("/admin");
}

export async function logoutAction() {
  await endSession();
  redirect("/admin/login");
}

// ---- Content entries -----------------------------------------------------

export async function saveEntryAction(_prevState, formData) {
  await requireAdmin();

  const moduleKey = String(formData.get("module") || "");
  const typeKey = String(formData.get("type") || "");
  const id = String(formData.get("id") || "");

  const type = getModule(moduleKey)?.types[typeKey];
  if (!type) return { error: "Unknown content type." };

  const { data, errors } = normalizeFields(type.fields, rawValues(type.fields, formData), {
    titleField: type.titleField,
  });
  if (Object.keys(errors).length > 0) {
    return { error: "Please fix the highlighted fields.", fieldErrors: errors };
  }

  try {
    const result = await saveEntry(moduleKey, typeKey, id, data);
    if (!result.ok) return result;
  } catch (err) {
    console.error("[admin] saveEntry failed:", err);
    return { error: "Could not save. Please try again." };
  }

  refreshSite();
  return { ok: true, savedAt: Date.now() };
}

export async function deleteEntryAction(formData) {
  await requireAdmin();
  await deleteEntry(String(formData.get("module") || ""), String(formData.get("id") || ""));
  refreshSite();
}

export async function importStarterAction(formData) {
  await requireAdmin();
  await importStarter(String(formData.get("module") || ""));
  refreshSite();
}

// ---- Image uploads -------------------------------------------------------

// Gives a signed-in admin a short-lived signature for ONE kind of upload:
// an image into the site's Cloudinary folder. The browser then sends the
// file directly to Cloudinary; the API secret stays on the server.
export async function getUploadSignatureAction() {
  await requireAdmin();
  if (!isCloudinaryConfigured()) {
    return {
      error:
        "Image uploads are not set up yet: add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to the site settings.",
    };
  }
  return createUploadSignature();
}

// ---- Page text (headings, intros) ----------------------------------------

export async function savePageTextAction(_prevState, formData) {
  await requireAdmin();

  const page = String(formData.get("page") || "");
  if (!hasPageText(page)) return { error: "Unknown page." };

  const { fields } = PAGE_TEXT[page];
  const { data, errors } = normalizeFields(fields, rawValues(fields, formData));
  if (Object.keys(errors).length > 0) {
    return { error: "Please fix the highlighted fields.", fieldErrors: errors };
  }

  try {
    await savePageText(page, data);
  } catch (err) {
    console.error("[admin] savePageText failed:", err);
    return { error: "Could not save. Please try again." };
  }

  refreshSite();
  return { ok: true, savedAt: Date.now() };
}

// ---- Public profile ------------------------------------------------------

export async function saveProfileAction(_prevState, formData) {
  await requireAdmin();

  const { data, errors } = normalizeFields(PROFILE_FIELDS, rawValues(PROFILE_FIELDS, formData));
  if (Object.keys(errors).length > 0) {
    return { error: "Please fix the highlighted fields.", fieldErrors: errors };
  }

  try {
    await saveSiteProfile(data);
  } catch (err) {
    console.error("[admin] saveSiteProfile failed:", err);
    return { error: "Could not save. Please try again." };
  }

  refreshSite();
  return { ok: true, savedAt: Date.now() };
}

// ---- Account -------------------------------------------------------------

// Checks the current password, counting failures like failed sign-ins so the
// account page can't be used to guess it. Returns an error message or null.
async function confirmCurrentPassword(formData) {
  const ip = await clientIp();
  if (await isLoginBlocked(ip)) {
    return "Too many failed attempts. Try again in 15 minutes.";
  }
  const account = await getAdminAccount();
  const current = String(formData.get("currentPassword") || "");
  if (!verifyPassword(current, account?.passwordHash)) {
    await recordLoginFailure(ip);
    return "Your current password is incorrect.";
  }
  return null;
}

export async function updateAccountAction(_prevState, formData) {
  await requireAdmin();

  const name = String(formData.get("name") || "").trim().slice(0, 80);
  const email = String(formData.get("email") || "").trim().toLowerCase();

  const fieldErrors = {};
  if (!name) fieldErrors.name = "Display name is required.";
  if (email.length > 254 || !EMAIL.test(email)) {
    fieldErrors.email = "Login email must be a valid email address.";
  }
  if (Object.keys(fieldErrors).length > 0) {
    return { error: "Please fix the highlighted fields.", fieldErrors };
  }

  const passwordError = await confirmCurrentPassword(formData);
  if (passwordError) {
    return { error: passwordError, fieldErrors: { currentPassword: passwordError } };
  }

  try {
    const account = await updateAccountProfile({ name, email });
    // The cookie carries the email, so issue a fresh one.
    await startSession(account);
  } catch (err) {
    console.error("[admin] updateAccountProfile failed:", err);
    return { error: "Could not save. Please try again." };
  }

  revalidatePath("/admin", "layout");
  return { ok: true, savedAt: Date.now() };
}

export async function changePasswordAction(_prevState, formData) {
  await requireAdmin();

  const next = String(formData.get("newPassword") || "");
  const confirm = String(formData.get("confirmPassword") || "");

  const fieldErrors = {};
  if (next.length < MIN_PASSWORD_LENGTH) {
    fieldErrors.newPassword = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  } else if (next.length > 200) {
    fieldErrors.newPassword = "That password is too long.";
  }
  if (next !== confirm) fieldErrors.confirmPassword = "The two passwords do not match.";
  if (Object.keys(fieldErrors).length > 0) {
    return { error: "Please fix the highlighted fields.", fieldErrors };
  }

  const passwordError = await confirmCurrentPassword(formData);
  if (passwordError) {
    return { error: passwordError, fieldErrors: { currentPassword: passwordError } };
  }

  try {
    // Raises the session version (signing out every other device), then
    // gives this browser a cookie for the new version.
    const account = await changePassword(next);
    await startSession(account);
  } catch (err) {
    console.error("[admin] changePassword failed:", err);
    return { error: "Could not change the password. Please try again." };
  }

  return { ok: true, savedAt: Date.now() };
}
