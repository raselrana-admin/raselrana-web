import SiteAnalytics from "@/components/analytics/SiteAnalytics";
import ThemeProvider from "@/components/theme/ThemeProvider";
import { siteInfo } from "@/lib/data/site";
import { pageMetadata } from "@/lib/seo";
import { plexMono, plexSans, spaceGrotesk } from "./fonts";
import "./globals.css";

const title = "Rasel Rana — Telecommunications & Electrical Engineering";
const description =
  "Personal site of Rasel Rana, Manager (Technical) at BTCL, covering telecommunications and electrical/electronic engineering.";

export const metadata = {
  // Makes relative URLs in metadata (icons, social images) absolute
  metadataBase: new URL(siteInfo.url),
  // Defaults for anything without its own; public pages use pageMetadata()
  // from lib/seo.js, so their link previews carry their own title and address.
  ...pageMetadata({ title, description, path: "/" }),
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      <body className="bg-[var(--paper)] font-[family-name:var(--font-body)] text-[var(--ink)]">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <SiteAnalytics />
      </body>
    </html>
  );
}
