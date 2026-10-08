import DownloadCard from "@/components/sections/downloads/DownloadCard";
import { siteInfo } from "@/lib/data/site";
import { qrPath } from "@/lib/qr";
import { getEntries } from "@/lib/services/content-service";
import { getDownloadCounts } from "@/lib/services/downloads-service";
import { getSiteProfile } from "@/lib/services/site-profile";
import { buildVCard, contactDetails } from "@/lib/vcard";

const isContactCard = (item) =>
  item.fileType?.toLowerCase() === "vcf" || /\.vcf(\?.*)?$/i.test(item.fileUrl);

// Server Component — fetches the documents and their download counts at
// request time so they're correct on first paint. Lives in views/, not
// components/, because it touches the mongodb driver: keeping all
// server-only, data-fetching components out of components/ means a Client
// Component can never accidentally pull this import chain into a client
// bundle (that barrel-file leak is what caused the earlier build error).
export default async function DownloadsView() {
  const [{ document: documents }, counts, profile] = await Promise.all([
    getEntries("downloads"),
    getDownloadCounts(),
    getSiteProfile(),
  ]);

  // A contact card can't be shown in a browser tab, so its preview is a
  // dialog with the details and a QR code, both built from the public profile.
  const contact = documents.some(isContactCard)
    ? {
        details: contactDetails(profile, siteInfo.url),
        qr: qrPath(buildVCard(profile, siteInfo.url)),
      }
    : null;

  return (
    <section className="border-t border-[var(--line)] py-16 md:py-20">
      {documents.length === 0 ? (
        <p className="mx-auto max-w-6xl px-6 text-[var(--slate)]">
          Documents will be added here soon.
        </p>
      ) : (
        <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-2">
          {documents.map((item) => (
            <DownloadCard
              key={item.id}
              // The contact card is built from the profile, so it was last
              // updated when the profile was last saved
              item={
                isContactCard(item) && profile.updatedAt
                  ? { ...item, lastUpdated: profile.updatedAt.slice(0, 10) }
                  : item
              }
              count={counts[item.key] ?? 0}
              contact={isContactCard(item) ? contact : undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
}
