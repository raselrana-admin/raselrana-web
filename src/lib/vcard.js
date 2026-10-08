// Builds the contact card from the public profile, so the downloadable
// .vcf file, the on-page preview and the QR code always say the same thing.
// Pure functions — no database access.

// vCard text values must escape backslash, comma, semicolon and line breaks.
function escape(value) {
  return String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/([,;])/g, "\\$1")
    .replace(/\r?\n/g, "\\n");
}

// "+880 1550-151897" -> "+8801550151897"
function cleanPhone(phone) {
  const trimmed = String(phone ?? "").trim();
  const digits = trimmed.replace(/[^\d]/g, "");
  if (!digits) return "";
  return (trimmed.startsWith("+") ? "+" : "") + digits;
}

/** The profile as vCard 3.0 text (what phones read from the file or the QR code). */
export function buildVCard(profile, siteUrl) {
  const words = profile.name.trim().split(/\s+/);
  const family = words.length > 1 ? words[words.length - 1] : "";
  const given = words.length > 1 ? words.slice(0, -1).join(" ") : words[0];
  const [city = "", country = ""] = String(profile.location ?? "")
    .split(",")
    .map((part) => part.trim());
  const phone = cleanPhone(profile.phone);

  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escape(family)};${escape(given)};;;`,
    `FN:${escape(profile.name)}`,
    profile.org && `ORG:${escape(profile.org)}`,
    profile.role && `TITLE:${escape(profile.role)}`,
    phone && `TEL;TYPE=CELL,VOICE:${phone}`,
    profile.email && `EMAIL;TYPE=WORK:${escape(profile.email)}`,
    siteUrl && `URL:${siteUrl}`,
    (city || country) && `ADR;TYPE=WORK:;;;${escape(city)};;;${escape(country)}`,
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\r\n");
}

/** The same details as rows for the on-page preview. */
export function contactDetails(profile, siteUrl) {
  const phone = cleanPhone(profile.phone);
  return [
    { label: "Name", value: profile.name },
    { label: "Role", value: profile.role },
    { label: "Organization", value: profile.org },
    phone && { label: "Phone", value: profile.phone.trim(), href: `tel:${phone}` },
    profile.email && { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    siteUrl && { label: "Website", value: siteUrl.replace(/^https?:\/\//, ""), href: siteUrl },
    profile.location && { label: "Location", value: profile.location },
  ].filter((row) => row && row.value);
}

/** A safe file name for the card, e.g. "Rasel_Rana.vcf". */
export function vCardFileName(profile) {
  const base = profile.name.trim().replace(/[^A-Za-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  return `${base || "contact"}.vcf`;
}
