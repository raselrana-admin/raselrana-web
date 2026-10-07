import AchievementsAdmin from "@/components/admin/AchievementsAdmin";
import { requireAdmin } from "@/lib/auth/session";
import { getAchievementsAdminData } from "@/lib/services/achievements-service";

export const dynamic = "force-dynamic";

export default async function AdminAchievementsPage() {
  await requireAdmin();

  let result;
  try {
    result = await getAchievementsAdminData();
  } catch (err) {
    console.error("[admin] Failed to load achievements:", err);
    return (
      <p role="alert" className="mt-10 text-sm text-[var(--danger)]">
        Could not reach the database. Check MONGODB_URI and try again.
      </p>
    );
  }

  return <AchievementsAdmin data={result.data} canImport={result.canImport} />;
}
