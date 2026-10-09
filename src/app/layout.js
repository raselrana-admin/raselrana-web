import ThemeProvider from "@/components/theme/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";
import { plexMono, plexSans, spaceGrotesk } from "./fonts";
import "./globals.css";

export const metadata = {
  title: "Rasel Rana — Telecommunications & Electrical Engineering",
  description:
    "Personal site of Rasel Rana, Manager (Technical) at BTCL, covering telecommunications and electrical/electronic engineering.",
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
          {/* Navbar and Footer are left out while the site is under
              development: every address shows one page (see src/proxy.js) */}
          <main className="min-h-screen">{children}</main>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
