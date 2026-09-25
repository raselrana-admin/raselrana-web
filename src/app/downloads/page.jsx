import DownloadsHero from "@/components/sections/downloads/DownloadsHero";
import DownloadsGrid from "@/components/sections/downloads/DownloadsGrid";

export const metadata = {
  title: "Downloads | Rasel Rana",
  description: "Download Rasel Rana's CV and other professional documents.",
};

export default function DownloadsPage() {
  return (
    <main>
      <DownloadsHero />
      <DownloadsGrid />
    </main>
  );
}
