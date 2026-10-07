"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";
import { inputClass, labelClass, primaryButtonClass } from "./styles";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, {});

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-[var(--danger)]">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className={primaryButtonClass}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
