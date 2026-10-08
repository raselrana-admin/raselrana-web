import DownloadButton from "@/components/ui/DownloadButton";
import { fileLinks, formatDate } from "@/lib/file-links";
import ContactCardPreview from "./ContactCardPreview";

const previewButtonClass =
  "inline-flex items-center rounded-full border border-[var(--line)] px-5 py-2.5 text-sm font-medium text-[var(--ink)] transition-colors hover:border-[var(--signal)] hover:text-[var(--signal)]";

function FileIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

// `contact` is given for contact cards (.vcf): { details, qr } for the
// preview dialog. See views/downloads/DownloadsView.jsx.
export default function DownloadCard({ item, count = 0, contact }) {
  // Google Drive links are turned into direct-download and viewer addresses
  const links = fileLinks(item.fileUrl, item.fileType);
  const updated = formatDate(item.lastUpdated);

  return (
    <div className="reveal flex flex-col gap-5 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-7">
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--signal)]/10 text-[var(--signal)]">
          <FileIcon />
        </div>
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--slate)]">
          {item.fileType}
        </span>
      </div>

      <div>
        <h2 className="font-display text-xl font-medium text-[var(--ink)]">
          {item.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--slate)]">
          {item.description}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-[var(--slate)]">
        {item.fileSize && (
          <>
            <span>{item.fileSize}</span>
            <span aria-hidden="true">·</span>
          </>
        )}
        {updated && (
          <>
            <span>Updated {updated}</span>
            <span aria-hidden="true">·</span>
          </>
        )}
        <span>
          {count} {count === 1 ? "download" : "downloads"}
        </span>
      </div>

      <div className="mt-auto flex flex-wrap gap-3 pt-2">
        <DownloadButton
          href={links.download}
          fileName={item.fileName}
          // `key` is the document's ID from the dashboard; counts are stored under it
          docId={item.key}
          label="Download"
          variant="solid"
          eventName={`${item.key}_download`}
        />
        {contact ? (
          <ContactCardPreview contact={contact} className={previewButtonClass} />
        ) : (
          links.preview && (
            <a
              href={links.preview}
              target="_blank"
              rel="noopener noreferrer"
              className={previewButtonClass}
            >
              Preview
            </a>
          )
        )}
      </div>
    </div>
  );
}
