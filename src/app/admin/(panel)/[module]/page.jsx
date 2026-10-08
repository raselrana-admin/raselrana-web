import { notFound } from "next/navigation";
import EntryManager from "@/components/admin/EntryManager";
import { requireAdmin } from "@/lib/auth/session";
import { getModule } from "@/lib/content/modules";
import { getAdminEntries } from "@/lib/services/content-service";

export const dynamic = "force-dynamic";

// One page serves every content module: /admin/achievements, /admin/projects…
// The module must exist in lib/content/modules.js.
export default async function AdminModulePage({ params }) {
  await requireAdmin();

  const { module: moduleKey } = await params;
  if (!getModule(moduleKey)) notFound();

  let result;
  try {
    result = await getAdminEntries(moduleKey);
  } catch (err) {
    console.error(`[admin] Failed to load ${moduleKey}:`, err);
    return (
      <p role="alert" className="text-sm text-[var(--danger)]">
        Could not reach the database. Check MONGODB_URI and try again.
      </p>
    );
  }

  return (
    <EntryManager
      // A fresh manager per module, so tabs and search don't carry over
      key={moduleKey}
      moduleKey={moduleKey}
      entries={result.entries}
      canImport={result.canImport}
    />
  );
}
