import DownloadCard from "@/components/sections/downloads/DownloadCard";
import { downloads } from "@/lib/data/downloads";
import { getDownloadCounts } from "@/lib/services/downloads-service";

// Server Component — fetches counts at request time so they're correct on
// first paint, no client-side loading flash. Lives in views/, not
// components/, because it touches the mongodb driver: keeping all
// server-only, data-fetching components out of components/ means a Client
// Component can never accidentally pull this import chain into a client
// bundle (that barrel-file leak is what caused the earlier build error).
export default async function DownloadsView() {
  const counts = await getDownloadCounts();

  return (
    <section className="border-t border-[var(--line)] py-16 md:py-20">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-2">
        {downloads.map((item) => (
          <DownloadCard key={item.id} item={item} count={counts[item.id] ?? 0} />
        ))}
      </div>
    </section>
  );
}
