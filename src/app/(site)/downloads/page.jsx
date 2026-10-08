import PageHeader from "@/components/ui/PageHeader";
import DownloadsView from "@/views/downloads/DownloadsView";

export const metadata = {
  title: "Downloads | Rasel Rana",
  description:
    "Download the professional portfolio, contact card, and other documents of Rasel Rana.",
};

// This page reads live download counts from MongoDB (via DownloadsView) on
// every request — opt out of static rendering so counts are not baked in
// at build time.
export const dynamic = "force-dynamic";

export default function DownloadsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Downloads"
        heading="Portfolio & documents"
        intro="Grab a copy of my professional portfolio, or save my contact card directly to your device."
      />
      <DownloadsView />
    </>
  );
}
