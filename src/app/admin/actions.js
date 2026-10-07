"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { ACHIEVEMENT_TYPES, normalizeAchievement } from "@/lib/achievements-schema";
import { isLoginBlocked, recordLoginFailure } from "@/lib/auth/login-attempts";
import { verifyPassword } from "@/lib/auth/password";
import { endSession, requireAdmin, startSession } from "@/lib/auth/session";
import { isAuthConfigured } from "@/lib/auth/session-token";
import {
  deleteAchievement,
  importDefaultAchievements,
  saveAchievement,
} from "@/lib/services/achievements-service";

// Every action except login must call requireAdmin() first — Server Actions
// are public POST endpoints, so the proxy and page checks don't cover them.

function refreshAchievements() {
  revalidatePath("/admin/achievements");
  revalidatePath("/achievements", "layout");
}

export async function loginAction(_prevState, formData) {
  if (!isAuthConfigured()) {
    return { error: "Admin login is not configured on the server yet." };
  }

  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";

  if (await isLoginBlocked(ip)) {
    return { error: "Too many failed attempts. Try again in 15 minutes." };
  }

  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const adminEmail = process.env.ADMIN_EMAIL.trim().toLowerCase();

  // Always run the password check so a wrong email takes as long as a wrong password.
  const passwordOk = verifyPassword(password, process.env.ADMIN_PASSWORD_HASH);

  if (email !== adminEmail || !passwordOk) {
    await recordLoginFailure(ip);
    return { error: "Incorrect email or password." };
  }

  await startSession(adminEmail);
  redirect("/admin/achievements");
}

export async function logoutAction() {
  await endSession();
  redirect("/admin/login");
}

export async function saveAchievementAction(_prevState, formData) {
  await requireAdmin();

  const type = String(formData.get("type") || "");
  const id = String(formData.get("id") || "");
  if (!ACHIEVEMENT_TYPES[type]) return { error: "Unknown achievement type." };

  const raw = Object.fromEntries(
    ACHIEVEMENT_TYPES[type].fields.map((field) => [
      field.name,
      formData.get(field.name),
    ]),
  );
  const { data, errors } = normalizeAchievement(type, raw);

  if (Object.keys(errors).length > 0) {
    return {
      error: errors._form || "Please fix the highlighted fields.",
      fieldErrors: errors,
    };
  }

  try {
    const result = await saveAchievement(type, id, data);
    if (!result.ok) return result;
  } catch (err) {
    console.error("[admin] saveAchievement failed:", err);
    return { error: "Could not save. Please try again." };
  }

  refreshAchievements();
  return { ok: true, savedAt: Date.now() };
}

export async function deleteAchievementAction(formData) {
  await requireAdmin();
  await deleteAchievement(String(formData.get("id") || ""));
  refreshAchievements();
}

export async function importDefaultsAction() {
  await requireAdmin();
  await importDefaultAchievements();
  refreshAchievements();
}
