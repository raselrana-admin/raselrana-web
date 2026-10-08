import { ChevronDown } from "lucide-react";
import { notFound } from "next/navigation";
import EntryManager from "@/components/admin/EntryManager";
import PageTextForm from "@/components/admin/PageTextForm";
import { cardClass } from "@/components/admin/styles";
import { requireAdmin } from "@/lib/auth/session";
import { getModule } from "@/lib/content/modules";
import { hasPageText } from "@/lib/content/page-text";
import { getAdminEntries } from "@/lib/services/content-service";
import { getPageText } from "@/lib/services/page-text";

export const dynamic = "force-dynamic";

// One page serves every content module: /admin/achievements, /admin/projects…
// The module must exist in lib/content/modules.js. If the public page has
// editable text of its own (lib/content/page-text.js), its form sits in a
// fold-out card above the entries.
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

  const pageText = hasPageText(moduleKey) ? await getPageText(moduleKey) : null;

  return (
    <>
      {pageText && (
        <details className={`${cardClass} group mb-8`}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 [&::-webkit-details-marker]:hidden">
            <span>
              <span className="block font-medium text-[var(--ink)]">Page heading and text</span>
              <span className="block text-sm text-[var(--slate)]">
                The wording at the top of the public page.
              </span>
            </span>
            <ChevronDown
              size={18}
              aria-hidden
              className="shrink-0 text-[var(--slate)] transition-transform group-open:rotate-180"
            />
          </summary>
          <div className="border-t border-[var(--line)] p-6 sm:p-8">
            <PageTextForm key={moduleKey} page={moduleKey} text={pageText} />
          </div>
        </details>
      )}

      <EntryManager
        // A fresh manager per module, so tabs and search don't carry over
        key={moduleKey}
        moduleKey={moduleKey}
        entries={result.entries}
        canImport={result.canImport}
      />
    </>
  );
}
