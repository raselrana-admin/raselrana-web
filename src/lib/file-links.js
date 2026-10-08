// Helpers for the Downloads page. Pure functions — safe anywhere.

const DRIVE_FILE = /drive\.google\.com\/file\/d\/([\w-]+)/i;
const DRIVE_ID_PARAM = /drive\.google\.com\/(?:open|uc)\?(?:[^#]*&)?id=([\w-]+)/i;

// Files a browser can show in a tab. Anything else would just download again.
const VIEWABLE = /\.(pdf|png|jpe?g|webp|gif|svg)(\?.*)?$/i;

/**
 * Works out where "Download" and "Preview" should go for a file address.
 * A Google Drive share link opens Drive's viewer, not a download, so it is
 * turned into Drive's direct-download and preview addresses. `preview` is
 * null when the file can't be shown in a browser tab.
 */
export function fileLinks(url, fileType) {
  const address = String(url || "");
  const drive = DRIVE_FILE.exec(address) || DRIVE_ID_PARAM.exec(address);
  if (drive) {
    return {
      download: `https://drive.google.com/uc?export=download&id=${drive[1]}`,
      preview: `https://drive.google.com/file/d/${drive[1]}/preview`,
    };
  }

  const viewable = VIEWABLE.test(address) || String(fileType || "").toLowerCase() === "pdf";
  return { download: address, preview: viewable ? address : null };
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-09-26" -> "26 Sep 2026". Returns "" for anything that is not a date. */
export function formatDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value || ""));
  if (!match) return "";
  const month = MONTHS[Number(match[2]) - 1];
  return month ? `${Number(match[3])} ${month} ${match[1]}` : "";
}

/** Today's date as YYYY-MM-DD in Bangladesh time. */
export function today() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka" }).format(new Date());
}
