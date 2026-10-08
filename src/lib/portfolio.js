// Shapes the portfolio for display. Used by both the /portfolio page and the
// PDF, so the two can never show different content. Pure functions.

/** Newest "updatedAt" (ISO text) among the portfolio's entries, or null. */
export function latestUpdate(entries) {
  const stamps = [...(entries.summary ?? []), ...(entries.entry ?? [])]
    .map((item) => item.updatedAt)
    .filter(Boolean)
    .sort();
  return stamps.length > 0 ? stamps[stamps.length - 1] : null;
}

/**
 * `profile` is the public profile, `entries` is getEntries("portfolio").
 * Returns { header, summaries, sections: [{ name, items }], updatedAt }.
 */
export function buildPortfolio(profile, entries, siteUrl) {
  // Group entries under their section name, keeping first-appearance order
  const groups = new Map();
  for (const item of entries.entry ?? []) {
    const name = String(item.section || "").trim() || "Other";
    if (!groups.has(name)) groups.set(name, []);
    groups.get(name).push(item);
  }

  return {
    header: {
      name: profile.name,
      role: profile.role,
      org: profile.org,
      // The phone number is deliberately left out: it is only in the contact card
      contacts: [
        profile.email,
        siteUrl ? siteUrl.replace(/^https?:\/\//, "") : "",
        profile.location,
      ].filter(Boolean),
    },
    summaries: entries.summary ?? [],
    sections: [...groups].map(([name, items]) => ({ name, items })),
    updatedAt: latestUpdate(entries),
  };
}

/** A safe file name for the PDF, e.g. "Rasel_Rana_Portfolio.pdf". */
export function portfolioFileName(profile) {
  const base = profile.name.trim().replace(/[^A-Za-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  return `${base || "Portfolio"}_Portfolio.pdf`;
}
