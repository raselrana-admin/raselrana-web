import ProfileForm from "@/components/admin/ProfileForm";
import { cardClass } from "@/components/admin/styles";
import { requireAdmin } from "@/lib/auth/session";
import { getSiteProfile } from "@/lib/services/site-profile";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  await requireAdmin();
  const profile = await getSiteProfile();

  return (
    <div>
      <p className="max-w-[60ch] text-sm text-[var(--slate)]">
        The details visitors see about you: on the home page, in the footer and on the Contact
        page.
      </p>
      <div className={`${cardClass} mt-6 p-6 sm:p-8`}>
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}
