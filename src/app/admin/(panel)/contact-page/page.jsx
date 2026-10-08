import PageTextForm from "@/components/admin/PageTextForm";
import { cardClass } from "@/components/admin/styles";
import { requireAdmin } from "@/lib/auth/session";
import { getPageText } from "@/lib/services/page-text";

export const dynamic = "force-dynamic";

// The Contact page has no entries, so it only has page text to edit.
export default async function AdminContactPage() {
  await requireAdmin();
  const text = await getPageText("contact");

  return (
    <div>
      <p className="max-w-[60ch] text-sm text-[var(--slate)]">
        The heading, intro and response time on the Contact page. The email and location shown
        there come from your Public profile.
      </p>
      <div className={`${cardClass} mt-6 p-6 sm:p-8`}>
        <PageTextForm page="contact" text={text} />
      </div>
    </div>
  );
}
