import AdminShell from "@/components/admin/shell/AdminShell";
import { requireAdmin } from "@/lib/auth/session";

// Every page in this (panel) folder is behind the login and gets the
// dashboard shell (sidebar + top bar).
export default async function AdminPanelLayout({ children }) {
  const session = await requireAdmin();
  return <AdminShell account={session}>{children}</AdminShell>;
}
