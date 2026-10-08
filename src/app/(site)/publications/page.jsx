import PageHeading from "@/views/layout/PageHeading";
import PublicationsView from "@/views/publications/PublicationsView";

export const metadata = {
  title: "Publications | Rasel Rana",
  description: "Papers, articles and technical write-ups by Rasel Rana.",
};

// Publications are edited from /admin and read from MongoDB on every
// request, so changes show up immediately.
export const dynamic = "force-dynamic";

export default function PublicationsPage() {
  return (
    <>
      <PageHeading page="publications" />
      <PublicationsView />
    </>
  );
}
