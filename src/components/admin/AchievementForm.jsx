"use client";

import { useActionState, useEffect, useState } from "react";
import { saveAchievementAction } from "@/app/admin/actions";
import { ACHIEVEMENT_TYPES, LINK_TYPES } from "@/lib/achievements-schema";
import {
  inputClass,
  labelClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "./styles";

function initialValues(fields, item) {
  return Object.fromEntries(
    fields.map((field) => {
      const value = item?.[field.name];
      if (field.type === "links") return [field.name, Array.isArray(value) ? value : []];
      if (field.type === "checkbox") return [field.name, Boolean(value)];
      if (field.type === "number") return [field.name, value ?? 0];
      return [field.name, value ?? ""];
    }),
  );
}

function LinksEditor({ links, onChange }) {
  const update = (index, patch) =>
    onChange(links.map((link, i) => (i === index ? { ...link, ...patch } : link)));

  return (
    <div className="flex flex-col gap-3">
      {links.map((link, index) => (
        <div key={index} className="grid gap-2 sm:grid-cols-[10rem_1fr_1.5fr_auto]">
          <select
            aria-label="Link type"
            value={link.type}
            onChange={(e) => update(index, { type: e.target.value })}
            className={inputClass}
          >
            {LINK_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <input
            aria-label="Link label"
            placeholder="Label, e.g. Final run"
            value={link.label}
            onChange={(e) => update(index, { label: e.target.value })}
            className={inputClass}
          />
          <input
            aria-label="Link URL"
            type="url"
            placeholder="https://…"
            value={link.url}
            onChange={(e) => update(index, { url: e.target.value })}
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => onChange(links.filter((_, i) => i !== index))}
            className={secondaryButtonClass}
          >
            Remove
          </button>
        </div>
      ))}
      <div>
        <button
          type="button"
          onClick={() => onChange([...links, { type: "youtube", label: "", url: "" }])}
          className={secondaryButtonClass}
        >
          Add link
        </button>
      </div>
    </div>
  );
}

export default function AchievementForm({ type, item, competitions, onDone }) {
  const { fields } = ACHIEVEMENT_TYPES[type];
  // Controlled inputs: React resets uncontrolled fields after a form action,
  // which would wipe the form whenever the server returns a validation error.
  const [values, setValues] = useState(() => initialValues(fields, item));
  const [state, formAction, pending] = useActionState(saveAchievementAction, {});

  useEffect(() => {
    if (state?.ok) onDone();
    // Only react to a new save result, not to onDone changing identity
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.savedAt]);

  const set = (name, value) => setValues((prev) => ({ ...prev, [name]: value }));
  const fieldErrors = state?.fieldErrors || {};

  function renderControl(field) {
    const id = `field-${field.name}`;
    const common = {
      id,
      name: field.name,
      value: values[field.name],
      onChange: (e) => set(field.name, e.target.value),
      className: inputClass,
      "aria-invalid": fieldErrors[field.name] ? true : undefined,
    };

    switch (field.type) {
      case "textarea":
        return <textarea {...common} rows={5} />;
      case "select":
        return (
          <select {...common}>
            <option value="">Choose…</option>
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "competition":
        return (
          <select {...common}>
            <option value="">None</option>
            {competitions.map((competition) => (
              <option key={competition.slug} value={competition.slug}>
                {competition.title}
              </option>
            ))}
          </select>
        );
      case "links":
        return (
          <>
            <input type="hidden" name="links" value={JSON.stringify(values.links)} />
            <LinksEditor links={values.links} onChange={(links) => set("links", links)} />
          </>
        );
      case "date":
        return <input {...common} type="date" />;
      case "number":
        return <input {...common} type="number" step="1" />;
      case "url":
        return <input {...common} type="url" placeholder="https://…" />;
      default:
        return <input {...common} type="text" />;
    }
  }

  return (
    <form action={formAction} className="mt-5 flex flex-col gap-5">
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="id" value={item?.id ?? ""} />

      {fields.map((field) => {
        if (field.type === "checkbox") {
          return (
            <label key={field.name} className="flex items-center gap-3 text-sm text-[var(--ink)]">
              <input
                type="checkbox"
                name={field.name}
                checked={values[field.name]}
                onChange={(e) => set(field.name, e.target.checked)}
                className="h-4 w-4 accent-[var(--signal)]"
              />
              {field.label}
            </label>
          );
        }

        return (
          <div key={field.name} className="flex flex-col gap-2">
            <label
              htmlFor={field.type === "links" ? undefined : `field-${field.name}`}
              className={labelClass}
            >
              {field.label}
              {field.required && <span className="text-[var(--signal)]"> *</span>}
            </label>
            {renderControl(field)}
            {field.help && (
              <p className="text-xs text-[var(--slate)]">{field.help}</p>
            )}
            {fieldErrors[field.name] && (
              <p role="alert" className="text-xs text-red-500">
                {fieldErrors[field.name]}
              </p>
            )}
          </div>
        );
      })}

      {state?.error && (
        <p role="alert" className="text-sm text-red-500">
          {state.error}
        </p>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={onDone}
          disabled={pending}
          className={secondaryButtonClass}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
