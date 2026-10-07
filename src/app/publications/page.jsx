import PublicationsList from "@/components/sections/publications/PublicationsList";
import PageHeader from "@/components/ui/PageHeader";
import { publicationsPage } from "@/lib/data/publications";

export const metadata = {
  title: "Publications | Rasel Rana",
  description: "Papers, articles and technical write-ups by Rasel Rana.",
};

export default function PublicationsPage() {
  return (
    <>
      <PageHeader {...publicationsPage} />
      <PublicationsList />
    </>
  );
}
