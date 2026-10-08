import Navbar from "@/components/layout/Navbar";
import SiteFooter from "@/views/layout/SiteFooter";

// The public site: navbar and footer around every page in this (site)
// folder. The admin panel has its own shell and does not use this layout.

// The footer reads the public profile from MongoDB, so otherwise-static
// pages are rebuilt at most hourly, and immediately when something is saved
// in the dashboard (revalidatePath in app/admin/actions.js).
export const revalidate = 3600;

export default function SiteLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <SiteFooter />
    </>
  );
}
