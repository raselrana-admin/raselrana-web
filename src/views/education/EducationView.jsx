import EducationList from "@/components/sections/education/EducationList";
import { getEntries } from "@/lib/services/content-service";
import PageHeading from "@/views/layout/PageHeading";

// Server Component — reads the qualifications from MongoDB. Lives in views/
// because it touches the database; see DownloadsView.
export default async function EducationView() {
  const { qualification } = await getEntries("education");

  return (
    <>
      <PageHeading page="education" />
      <EducationList items={qualification} />
    </>
  );
}
