"use client";

import { saveProfileAction } from "@/app/admin/actions";
import { PROFILE_FIELDS } from "@/lib/content/profile";
import SchemaForm from "./SchemaForm";

export default function ProfileForm({ profile }) {
  return (
    <SchemaForm
      fields={PROFILE_FIELDS}
      item={profile}
      action={saveProfileAction}
      submitLabel="Save profile"
      successMessage="Profile saved"
    />
  );
}
