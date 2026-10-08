/** Splits text into paragraphs wherever there is a blank line. */
export function toParagraphs(text) {
  return String(text || "")
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
