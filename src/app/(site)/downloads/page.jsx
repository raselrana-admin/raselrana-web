import DownloadsView from "@/views/downloads/DownloadsView";
import PageHeading from "@/views/layout/PageHeading";

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
      <PageHeading page="downloads" />
      <DownloadsView />
    </>
  );
}
