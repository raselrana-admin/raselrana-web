import { Fragment } from "react";
import { toParagraphs } from "@/lib/text";

// Draws a long text from the dashboard (see lib/text.js for the markup):
// paragraphs on empty lines, line breaks on single ones, **bold**, *italic*.
// Everything becomes React elements; no HTML from the text is ever inserted.

const BOLD_OR_ITALIC = /\*\*(.+?)\*\*|\*(?!\s)(.+?)(?<!\s)\*/g;
const ITALIC = /\*(?!\s)(.+?)(?<!\s)\*/g;

function formatted(text, pattern = BOLD_OR_ITALIC, prefix = "") {
  const parts = [];
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const key = `${prefix}${match.index}`;
    if (pattern === BOLD_OR_ITALIC && match[1] !== undefined) {
      // Italic may sit inside bold: **bold and *italic***
      parts.push(
        <strong key={key} className="font-semibold text-[var(--ink)]">
          {formatted(match[1], ITALIC, `${key}-`)}
        </strong>,
      );
    } else {
      parts.push(<em key={key}>{pattern === ITALIC ? match[1] : match[2]}</em>);
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function withLineBreaks(paragraph) {
  return paragraph.split(/\r?\n/).map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {formatted(line.trim())}
    </Fragment>
  ));
}

/**
 *   text       the stored text
 *   className  classes for the block (margins, width, font size, colour)
 *   spacing    the gap between paragraphs
 *   inline     one <p> with the paragraphs run together, for short previews
 */
export default function RichText({ text, className = "", spacing = "space-y-3", inline = false }) {
  const paragraphs = toParagraphs(text);
  if (paragraphs.length === 0) return null;

  if (inline) {
    return <p className={className}>{formatted(paragraphs.join(" ").replace(/\s*\r?\n\s*/g, " "))}</p>;
  }

  return (
    <div className={[spacing, className].filter(Boolean).join(" ")}>
      {paragraphs.map((paragraph, i) => (
        <p key={i}>{withLineBreaks(paragraph)}</p>
      ))}
    </div>
  );
}
