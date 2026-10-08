import PublicationsList from "@/components/sections/publications/PublicationsList";
import { getEntries } from "@/lib/services/content-service";

// Server Component — reads publications from MongoDB. Lives in views/
// because it touches the database; see DownloadsView.
export default async function PublicationsView() {
  const { publication } = await getEntries("publications");
  return <PublicationsList publications={publication} />;
}
