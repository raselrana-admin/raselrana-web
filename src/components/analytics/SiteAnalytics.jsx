"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Vercel Web Analytics (visitors, page views) and Speed Insights (how fast
// pages load for real visitors). Both report only from a Vercel deployment;
// in `npm run dev` they send nothing.
//
// The admin dashboard is left out: the owner's own visits are not visitors.
// Returning null from beforeSend drops the event before it leaves the browser.
function skipAdmin(event) {
  try {
    const { pathname } = new URL(event.url, window.location.origin);
    if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;
  } catch {
    // An address that cannot be read is sent as it is.
  }
  return event;
}

export default function SiteAnalytics() {
  return (
    <>
      <Analytics beforeSend={skipAdmin} />
      <SpeedInsights beforeSend={skipAdmin} />
    </>
  );
}
