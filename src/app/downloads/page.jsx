import DownloadsHero from "@/components/sections/downloads/DownloadsHero";
import DownloadsView from "@/views/downloads/DownloadsView";

export const metadata = {
  title: "Downloads | Rasel Rana",
  description:
    "Download Rasel Rana's professional portfolio, contact card, and other documents.",
};

// This page reads live download counts from MongoDB (via DownloadsView) on
// every request — opt out of static rendering so counts don't get baked in
// at build time.
export const dynamic = "force-dynamic";

export default function DownloadsPage() {
  return (
    <main>
      <DownloadsHero />
      <DownloadsView />
    </main>
  );
}
