import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import PageHeader from "@/components/ui/PageHeader";
import SiteFooter from "@/views/layout/SiteFooter";

export const metadata = {
  title: "Page not found | Rasel Rana",
};

// Sits outside the (site) folder, so it brings the navbar and footer itself.
export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <PageHeader
          eyebrow="404"
          heading="Page not found"
          intro="The page you are looking for does not exist or has been moved."
        >
          <Link
            href="/"
            className="inline-block rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-medium text-[var(--paper)] transition-opacity hover:opacity-90"
          >
            Back to home
          </Link>
        </PageHeader>
      </main>
      <SiteFooter />
    </>
  );
}
