import Footer from "@/components/layout/Footer";
import { getSiteProfile } from "@/lib/services/site-profile";
import { getSiteUpdatedAt } from "@/lib/services/site-updated";

// Reads the public profile and the last update date and hands them to the
// footer. Lives in views/ because it touches the database; see DownloadsView.
export default async function SiteFooter() {
  const [profile, updatedAt] = await Promise.all([getSiteProfile(), getSiteUpdatedAt()]);
  return <Footer profile={profile} updatedAt={updatedAt} />;
}
