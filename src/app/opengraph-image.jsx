import { ImageResponse } from "next/og";
import { cldUrl } from "@/lib/cloudinary-url";
import { siteInfo } from "@/lib/data/site";
import { getSiteProfile } from "@/lib/services/site-profile";

// The picture shown when a link to the site is shared (Facebook, LinkedIn,
// WhatsApp, X, …): name, role, focus tags and portrait, in the site's dark
// colours. Used by every page that has no picture of its own. The words and
// the portrait come from the public profile, so they follow the dashboard.

export const alt = "Rasel Rana, Manager (Technical) at BTCL";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

// Dark theme tokens from globals.css
const C = {
  paper: "#0b1420",
  surface: "#111d2c",
  ink: "#eef1f0",
  slate: "#93a1ab",
  signal: "#2dd4c7",
  line: "#223244",
};

const FONT_BASE = "https://cdn.jsdelivr.net/npm/@fontsource";
const FONTS = [
  { name: "Space Grotesk", weight: 600, file: "space-grotesk@5.3.0/files/space-grotesk-latin-600-normal.woff" },
  { name: "IBM Plex Sans", weight: 400, file: "ibm-plex-sans@5.3.0/files/ibm-plex-sans-latin-400-normal.woff" },
  { name: "IBM Plex Mono", weight: 400, file: "ibm-plex-mono@5.3.0/files/ibm-plex-mono-latin-400-normal.woff" },
];

// Anything that cannot be fetched is left out (default font, no portrait),
// so the picture is always produced.
async function fetchBuffer(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

async function loadFonts() {
  const loaded = await Promise.all(
    FONTS.map(async (font) => ({ ...font, data: await fetchBuffer(`${FONT_BASE}/${font.file}`) })),
  );
  return loaded
    .filter((font) => font.data)
    .map(({ name, weight, data }) => ({ name, weight, data, style: "normal" }));
}

async function loadPortrait(photo) {
  if (!photo?.url) return null;
  // A square crop around the face, as JPEG
  const url = cldUrl(photo.url).replace("/f_auto,q_auto/", "/c_fill,g_face,w_320,h_320,f_jpg,q_80/");
  const data = await fetchBuffer(url);
  return data ? `data:image/jpeg;base64,${Buffer.from(data).toString("base64")}` : null;
}

export default async function OpenGraphImage() {
  const profile = await getSiteProfile();
  const [fonts, portrait] = await Promise.all([loadFonts(), loadPortrait(profile.photo)]);
  const domain = new URL(siteInfo.url).hostname;
  const tags = (profile.focus || []).slice(0, 4);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: C.paper,
          color: C.ink,
          fontFamily: "IBM Plex Sans",
          padding: "64px 72px",
        }}
      >
        {/* Text column */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <svg width="56" height="56" viewBox="0 0 32 32">
              <rect width="32" height="32" rx="8" fill={C.ink} />
              <g fill="none" stroke={C.paper} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 24V8h6.25a4.5 4.5 0 0 1 0 9H11" />
                <path d="M16 17l3.9 5" />
              </g>
              <circle cx="21.6" cy="24" r="2.3" fill={C.paper} />
            </svg>
            <div style={{ display: "flex", fontFamily: "IBM Plex Mono", fontSize: 24, color: C.slate, letterSpacing: 2 }}>
              {domain}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", width: 72, height: 4, background: C.signal, marginBottom: 28 }} />
            <div style={{ display: "flex", fontFamily: "Space Grotesk", fontSize: 76, fontWeight: 600, lineHeight: 1.05, letterSpacing: -1 }}>
              {profile.name}
            </div>
            <div style={{ display: "flex", fontSize: 34, marginTop: 18, color: C.ink }}>{profile.role}</div>
            <div style={{ display: "flex", fontSize: 26, marginTop: 8, color: C.slate, maxWidth: 640 }}>
              {profile.org}
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {tags.map((tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  fontFamily: "IBM Plex Mono",
                  fontSize: 20,
                  color: C.signal,
                  border: `1px solid ${C.line}`,
                  background: C.surface,
                  borderRadius: 999,
                  padding: "8px 18px",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Portrait */}
        {portrait && (
          <div style={{ display: "flex", alignItems: "center", marginLeft: 48 }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse needs a plain img */}
            <img
              src={portrait}
              width={300}
              height={300}
              alt=""
              style={{ borderRadius: 32, border: `2px solid ${C.line}`, objectFit: "cover" }}
            />
          </div>
        )}
      </div>
    ),
    { ...size, fonts },
  );
}
