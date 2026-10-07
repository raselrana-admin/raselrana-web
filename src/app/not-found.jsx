import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";

export const metadata = {
  title: "Page not found | Rasel Rana",
};

export default function NotFound() {
  return (
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
  );
}
