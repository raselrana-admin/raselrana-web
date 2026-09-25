import DownloadCard from "./DownloadCard";
import { downloads } from "@/lib/data/downloads";

export default function DownloadsGrid() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <div className="grid gap-6 sm:grid-cols-2">
        {downloads.map((item) => (
          <DownloadCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
