import PageHeader from "@/components/ui/PageHeader";
import { getPageText } from "@/lib/services/page-text";

// The header of an inner page, with its text read from the dashboard
// (lib/services/page-text.js). `page` is a key of PAGE_TEXT. Children go in
// the header's extra slot. Lives in views/ because it touches the database.
export default async function PageHeading({ page, children }) {
  const { eyebrow, heading, intro } = await getPageText(page);
  return (
    <PageHeader eyebrow={eyebrow} heading={heading} intro={intro}>
      {children}
    </PageHeader>
  );
}
