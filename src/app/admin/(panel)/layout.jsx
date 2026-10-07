import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth/session";

export default async function AdminPanelLayout({ children }) {
  const session = await requireAdmin();

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
        <nav className="flex items-center gap-5 font-[family-name:var(--font-mono)] text-xs uppercase tracking-wide">
          <span className="text-[var(--signal)]">Admin</span>
          <Link
            href="/admin/achievements"
            className="text-[var(--ink)] hover:text-[var(--signal)]"
          >
            Achievements
          </Link>
          <Link
            href="/achievements"
            className="text-[var(--slate)] hover:text-[var(--signal)]"
          >
            View public page
          </Link>
        </nav>

        <form action={logoutAction} className="flex items-center gap-4">
          <span className="text-xs text-[var(--slate)]">{session.sub}</span>
          <button
            type="submit"
            className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wide text-[var(--ink)] hover:text-[var(--signal)]"
          >
            Log out
          </button>
        </form>
      </div>

      {children}
    </div>
  );
}
