import DownloadCard from "@/components/sections/downloads/DownloadCard";
import { getEntries } from "@/lib/services/content-service";
import { getDownloadCounts } from "@/lib/services/downloads-service";

// Server Component — fetches the documents and their download counts at
// request time so they're correct on first paint. Lives in views/, not
// components/, because it touches the mongodb driver: keeping all
// server-only, data-fetching components out of components/ means a Client
// Component can never accidentally pull this import chain into a client
// bundle (that barrel-file leak is what caused the earlier build error).
export default async function DownloadsView() {
  const [{ document: documents }, counts] = await Promise.all([
    getEntries("downloads"),
    getDownloadCounts(),
  ]);

  return (
    <section className="border-t border-[var(--line)] py-16 md:py-20">
      {documents.length === 0 ? (
        <p className="mx-auto max-w-6xl px-6 text-[var(--slate)]">
          Documents will be added here soon.
        </p>
      ) : (
        <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-2">
          {documents.map((item) => (
            <DownloadCard key={item.id} item={item} count={counts[item.key] ?? 0} />
          ))}
        </div>
      )}
    </section>
  );
}
