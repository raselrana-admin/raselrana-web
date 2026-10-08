import { AccountDetailsForm, PasswordForm } from "@/components/admin/AccountForms";
import { cardClass } from "@/components/admin/styles";
import { requireAdmin } from "@/lib/auth/session";
import { getAdminAccount } from "@/lib/services/admin-account";

export const dynamic = "force-dynamic";

export default async function AdminAccountPage() {
  const session = await requireAdmin();
  const account = await getAdminAccount();

  return (
    <div className="flex flex-col gap-6">
      {account?.source === "env" && (
        <div className={`${cardClass} border-[var(--signal)] p-5`}>
          <p className="text-sm text-[var(--ink)]">
            You are signed in with the starter login from the site settings. Saving your account
            or changing your password here stores it in the database, and that becomes your
            login from then on.
          </p>
        </div>
      )}

      <section className={`${cardClass} p-6 sm:p-8`}>
        <h2 className="font-display text-xl font-semibold text-[var(--ink)]">Account details</h2>
        <p className="mb-6 mt-1 text-sm text-[var(--slate)]">Your name and the email you sign in with.</p>
        <AccountDetailsForm account={session} />
      </section>

      <section className={`${cardClass} p-6 sm:p-8`}>
        <h2 className="font-display text-xl font-semibold text-[var(--ink)]">Change password</h2>
        <p className="mb-6 mt-1 text-sm text-[var(--slate)]">
          Changing your password signs you out on every other device.
        </p>
        <PasswordForm />
      </section>
    </div>
  );
}
