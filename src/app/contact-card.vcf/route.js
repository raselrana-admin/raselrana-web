import { siteInfo } from "@/lib/data/site";
import { getSiteProfile } from "@/lib/services/site-profile";
import { buildVCard, vCardFileName } from "@/lib/vcard";

// GET /contact-card.vcf — the contact card, generated from the public
// profile on every request so it never goes out of date. Use this address as
// the "File address" of the Contact Card entry in the Downloads dashboard.
export const dynamic = "force-dynamic";

export async function GET() {
  const profile = await getSiteProfile();

  return new Response(buildVCard(profile, siteInfo.url), {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${vCardFileName(profile)}"`,
      "Cache-Control": "no-store",
    },
  });
}
