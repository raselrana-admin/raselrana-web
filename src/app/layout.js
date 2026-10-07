import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ThemeProvider from "@/components/theme/ThemeProvider";
import { siteInfo } from "@/lib/data/site";
import { Analytics } from "@vercel/analytics/next";
import { plexMono, plexSans, spaceGrotesk } from "./fonts";
import "./globals.css";

const title = "Rasel Rana — Telecommunications & Electrical Engineering";
const description =
  "Personal site of Rasel Rana, Manager (Technical) at BTCL, covering telecommunications and electrical/electronic engineering.";

export const metadata = {
  // Makes relative URLs in metadata (icons, social images) absolute
  metadataBase: new URL(siteInfo.url),
  title,
  description,
  // Defaults for link previews when the site is shared
  openGraph: {
    type: "website",
    siteName: siteInfo.name,
    locale: "en_US",
    url: "/",
    title,
    description,
  },
  twitter: { card: "summary", title, description },
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
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
