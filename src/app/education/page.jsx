import EducationList from "@/components/sections/education/EducationList";
import PageHeader from "@/components/ui/PageHeader";
import { educationPage } from "@/lib/data/education";

export const metadata = {
  title: "Education | Rasel Rana",
  description: "Academic qualifications and training of Rasel Rana.",
};

export default function EducationPage() {
  return (
    <>
      <PageHeader {...educationPage} />
      <EducationList />
    </>
  );
}
