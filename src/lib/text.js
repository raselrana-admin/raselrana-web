// Long texts from the dashboard use a small markup, drawn by ui/RichText:
// an empty line starts a new paragraph, a single line break stays a line
// break, **text** is bold and *text* is italic.

/** Removes the bold/italic stars, for places that need plain text. */
export function stripFormatting(text) {
  return String(text || "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(?!\s)(.+?)(?<!\s)\*/g, "$1");
}

/** Splits text into paragraphs wherever there is a blank line. */
export function toParagraphs(text) {
  return String(text || "")
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
