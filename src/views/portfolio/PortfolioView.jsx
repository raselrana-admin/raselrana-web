import PortfolioDocument from "@/components/sections/portfolio/PortfolioDocument";
import DownloadButton from "@/components/ui/DownloadButton";
import PageHeader from "@/components/ui/PageHeader";
import { portfolioPage } from "@/lib/data/portfolio";
import { siteInfo } from "@/lib/data/site";
import { formatDate, isPortfolioFile } from "@/lib/file-links";
import { buildPortfolio, portfolioFileName } from "@/lib/portfolio";
import { getEntries } from "@/lib/services/content-service";
import { getSiteProfile } from "@/lib/services/site-profile";

// Server Component — reads the portfolio from MongoDB. Lives in views/
// because it touches the database; see DownloadsView.
export default async function PortfolioView() {
  const [profile, entries, downloads] = await Promise.all([
    getSiteProfile(),
    getEntries("portfolio"),
    getEntries("downloads"),
  ]);

  const portfolio = buildPortfolio(profile, entries, siteInfo.url);
  const updated = formatDate(portfolio.updatedAt);
  // Count PDF downloads under the Downloads entry that points at the
  // portfolio, if there is one
  const downloadEntry = downloads.document.find((d) => isPortfolioFile(d.fileUrl));

  return (
    <>
      <PageHeader {...portfolioPage}>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <DownloadButton
            href="/portfolio.pdf"
            fileName={portfolioFileName(profile)}
            docId={downloadEntry?.key}
            label="Download PDF"
            variant="solid"
            eventName="portfolio_download"
          />
          {updated && (
            <p className="font-mono text-xs text-[var(--slate)]">Updated {updated}</p>
          )}
        </div>
      </PageHeader>
      <PortfolioDocument portfolio={portfolio} />
    </>
  );
}
