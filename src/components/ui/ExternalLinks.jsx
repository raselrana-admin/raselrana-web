const TYPE_LABEL = {
  youtube: "Video",
  facebook: "Facebook",
  web: "Website",
  news: "News",
};

/** Keeps only real http(s) links, so "" and "#" placeholders stay hidden. */
export function getValidLinks(links) {
  if (!Array.isArray(links)) return [];
  return links.filter(
    (l) => l && typeof l.url === "string" && /^https?:\/\//i.test(l.url.trim()),
  );
}

/** Small plain-text summary such as "Video, Facebook" for cards. */
export function LinkTypes({ links }) {
  const valid = getValidLinks(links);
  if (valid.length === 0) return null;
  const types = [...new Set(valid.map((l) => TYPE_LABEL[l.type] ?? "Link"))];
  return (
    <p className="mt-1 text-sm text-[var(--slate)]">
      Also on {types.join(", ")}
    </p>
  );
}

export default function ExternalLinks({ links, heading }) {
  const valid = getValidLinks(links);
  if (valid.length === 0) return null;

  return (
    <div>
      {heading && (
        <h2 className="font-display text-xl text-[var(--ink)]">{heading}</h2>
      )}
      <ul className={`flex flex-wrap gap-3 ${heading ? "mt-4" : "mt-3"}`}>
        {valid.map((l) => (
          <li key={l.url}>
            <a
              href={l.url.trim()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--ink)] transition-colors hover:border-[var(--signal)] hover:text-[var(--signal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--signal)]"
            >
              <span className="font-mono text-xs text-[var(--signal)]">
                {TYPE_LABEL[l.type] ?? "Link"}
              </span>
              <span>{l.label || "Open link"}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
