import PageHeading from "@/views/layout/PageHeading";
import ProjectsView from "@/views/projects/ProjectsView";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Projects | Rasel Rana",
  description:
    "Selected engineering projects by Rasel Rana across telecommunications, power systems and robotics.",
  path: "/projects",
});

// Projects are edited from /admin and read from MongoDB on every request,
// so changes show up immediately.
export const dynamic = "force-dynamic";

export default function ProjectsPage() {
  return (
    <>
      <PageHeading page="projects" />
      <ProjectsView />
    </>
  );
}
