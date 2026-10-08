import Footer from "@/components/layout/Footer";
import { getSiteProfile } from "@/lib/services/site-profile";

// Reads the public profile and hands it to the footer. Lives in views/
// because it touches the database; see DownloadsView.
export default async function SiteFooter() {
  return <Footer profile={await getSiteProfile()} />;
}
