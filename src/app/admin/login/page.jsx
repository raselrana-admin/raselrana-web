import Link from "next/link";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { cardClass, eyebrowClass } from "@/components/admin/styles";
import BrandMark from "@/components/ui/BrandMark";
import { getSession } from "@/lib/auth/session";

export default async function AdminLoginPage() {
  // Already signed in (and the session is still valid)? Go straight in.
  if (await getSession()) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <BrandMark size={44} />
          <p className={`${eyebrowClass} mt-6`}>Admin</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[var(--ink)]">
            Sign in
          </h1>
          <p className="mt-2 text-sm text-[var(--slate)]">
            This area is for the site owner only.
          </p>
        </div>

        <div className={`${cardClass} p-6 sm:p-8`}>
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-sm">
          <Link href="/" className="text-[var(--slate)] hover:text-[var(--signal)]">
            ← Back to the site
          </Link>
        </p>
      </div>
    </main>
  );
}
