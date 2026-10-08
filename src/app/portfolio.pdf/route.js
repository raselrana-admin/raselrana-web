import { renderToBuffer } from "@react-pdf/renderer";
import { siteInfo } from "@/lib/data/site";
import { formatDate } from "@/lib/file-links";
import PortfolioPdf from "@/lib/pdf/PortfolioPdf";
import { buildPortfolio, portfolioFileName } from "@/lib/portfolio";
import { getEntries } from "@/lib/services/content-service";
import { getClientIp, isRateLimited } from "@/lib/services/rate-limit";
import { getSiteProfile } from "@/lib/services/site-profile";

// GET /portfolio.pdf — the portfolio as a PDF, built from the dashboard
// content on request, so it always matches the /portfolio page.
export const dynamic = "force-dynamic";

export async function GET(request) {
  // Building a PDF costs far more than serving a page, so limit how often
  // one visitor can ask for it.
  const limited = await isRateLimited({
    bucket: "portfolio-pdf",
    ip: getClientIp(request),
    max: 20,
    windowSeconds: 10 * 60,
  });
  if (limited) {
    return new Response("Too many requests. Please try again in a few minutes.", {
      status: 429,
    });
  }

  try {
    const [profile, entries] = await Promise.all([getSiteProfile(), getEntries("portfolio")]);
    const portfolio = buildPortfolio(profile, entries, siteInfo.url);

    const pdf = await renderToBuffer(
      <PortfolioPdf portfolio={portfolio} updated={formatDate(portfolio.updatedAt)} />,
    );

    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${portfolioFileName(profile)}"`,
        // Let Vercel's cache answer repeat requests for five minutes
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (err) {
    console.error("[portfolio.pdf] Failed to build the PDF:", err);
    return new Response("The portfolio PDF could not be created right now.", { status: 500 });
  }
}
