"use client";

import { savePageTextAction } from "@/app/admin/actions";
import { PAGE_TEXT } from "@/lib/content/page-text";
import SchemaForm from "./SchemaForm";

/** The form for one page's heading and other one-off text. `page` is a key of PAGE_TEXT. */
export default function PageTextForm({ page, text }) {
  return (
    <SchemaForm
      fields={PAGE_TEXT[page].fields}
      item={text}
      action={savePageTextAction}
      hidden={{ page }}
      submitLabel="Save page text"
      successMessage="Page text saved"
    />
  );
}
