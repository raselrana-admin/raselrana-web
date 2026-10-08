import PortfolioView from "@/views/portfolio/PortfolioView";

export const metadata = {
  title: "Portfolio | Rasel Rana",
  description:
    "Professional portfolio of Rasel Rana: background, experience and work, with a downloadable PDF.",
};

// The portfolio is edited from /admin and read from MongoDB on every
// request, so changes show up immediately.
export const dynamic = "force-dynamic";

export default function PortfolioPage() {
  return <PortfolioView />;
}
