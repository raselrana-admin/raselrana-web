"use client";

import { useActionState, useEffect, useState } from "react";
import { changePasswordAction, updateAccountAction } from "@/app/admin/actions";
import { useToast } from "./Toast";
import { errorClass, helpClass, inputClass, labelClass, primaryButtonClass } from "./styles";

function Field({ label, name, error, help, ...input }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={`account-${name}`} className={labelClass}>
        {label}
      </label>
      <input
        id={`account-${name}`}
        name={name}
        className={inputClass}
        aria-invalid={error ? true : undefined}
        {...input}
      />
      {help && <p className={helpClass}>{help}</p>}
      {error && (
        <p role="alert" className={errorClass}>
          {error}
        </p>
      )}
    </div>
  );
}

/** Display name and login email. Needs the current password to save. */
export function AccountDetailsForm({ account }) {
  const [name, setName] = useState(account.name);
  const [email, setEmail] = useState(account.email);
  const [state, formAction, pending] = useActionState(updateAccountAction, {});
  const toast = useToast();
  const errors = state?.fieldErrors || {};

  useEffect(() => {
    if (state?.ok) toast("Account saved");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.savedAt]);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Field
        label="Display name"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        help="Shown in the dashboard sidebar."
        required
      />
      <Field
        label="Login email"
        name="email"
        type="email"
        autoComplete="username"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        help="The email you sign in with. It is not shown on the public site."
        required
      />
      <Field
        label="Current password"
        name="currentPassword"
        type="password"
        autoComplete="current-password"
        error={errors.currentPassword}
        help="Needed to confirm the change."
        required
      />

      {state?.error && !errors.currentPassword && (
        <p role="alert" className="text-sm text-[var(--danger)]">
          {state.error}
        </p>
      )}

      <div>
        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? "Saving…" : "Save account"}
        </button>
      </div>
    </form>
  );
}

/** Change password. Signs out every other device on success. */
export function PasswordForm() {
  const [state, formAction, pending] = useActionState(changePasswordAction, {});
  const toast = useToast();
  const errors = state?.fieldErrors || {};

  useEffect(() => {
    if (state?.ok) toast("Password changed");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.savedAt]);

  return (
    // Uncontrolled on purpose: React clears these fields after each submit,
    // which is what we want for passwords.
    <form action={formAction} className="flex flex-col gap-6">
      <Field
        label="Current password"
        name="currentPassword"
        type="password"
        autoComplete="current-password"
        error={errors.currentPassword}
        required
      />
      <Field
        label="New password"
        name="newPassword"
        type="password"
        autoComplete="new-password"
        error={errors.newPassword}
        help="At least 12 characters. A few unrelated words make a strong, memorable password."
        required
      />
      <Field
        label="Repeat new password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword}
        required
      />

      {state?.error && Object.keys(errors).length === 0 && (
        <p role="alert" className="text-sm text-[var(--danger)]">
          {state.error}
        </p>
      )}

      <div>
        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? "Changing…" : "Change password"}
        </button>
      </div>
    </form>
  );
}
