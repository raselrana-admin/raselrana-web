import EducationList from "@/components/sections/education/EducationList";
import { getEntries } from "@/lib/services/content-service";
import PageHeading from "@/views/layout/PageHeading";

// Server Component — reads the degrees and training courses from MongoDB.
// Lives in views/ because it touches the database; see DownloadsView.
export default async function EducationView() {
  const { qualification, training } = await getEntries("education");

  const groups = [
    {
      title: "Education",
      items: qualification.map((item) => ({ ...item, title: item.degree })),
    },
    {
      title: "Training",
      items: training.map((item) => ({ ...item, title: item.course })),
    },
  ];

  return (
    <>
      <PageHeading page="education" />
      <EducationList groups={groups} />
    </>
  );
}
