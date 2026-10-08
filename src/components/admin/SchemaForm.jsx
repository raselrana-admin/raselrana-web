"use client";

import { useActionState, useEffect, useState } from "react";
import { LINK_TYPES, initialValues } from "@/lib/content/fields";
import { useToast } from "./Toast";
import {
  errorClass,
  helpClass,
  inputClass,
  labelClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "./styles";

function LinksEditor({ field, links, onChange }) {
  const withType = field.withType !== false;
  const update = (index, patch) =>
    onChange(links.map((link, i) => (i === index ? { ...link, ...patch } : link)));

  return (
    <div className="flex flex-col gap-3">
      {links.map((link, index) => (
        <div
          key={index}
          className={`grid gap-2 ${withType ? "sm:grid-cols-[10rem_1fr_1.5fr_auto]" : "sm:grid-cols-[1fr_1.5fr_auto]"}`}
        >
          {withType && (
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
          )}
          <input
            aria-label="Link label"
            placeholder={withType ? "Label, e.g. Final run" : "Label, e.g. YouTube"}
            value={link.label}
            onChange={(e) => update(index, { label: e.target.value })}
            className={inputClass}
          />
          <input
            aria-label="Link address"
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
          onClick={() =>
            onChange([...links, withType ? { type: "youtube", label: "", url: "" } : { label: "", url: "" }])
          }
          className={secondaryButtonClass}
        >
          Add link
        </button>
      </div>
    </div>
  );
}

/**
 * A form drawn from a list of fields (see lib/content/fields.js).
 *
 *   fields        the field definitions
 *   item          existing values, or undefined for a new entry
 *   action        a Server Action for useActionState: (prevState, formData)
 *   hidden        extra values sent with the form, e.g. { module, type, id }
 *   competitions  options for the "competition" field type
 *   onDone        called after a successful save
 *   onCancel      shows a Cancel button when given
 */
export default function SchemaForm({
  fields,
  item,
  action,
  hidden = {},
  competitions = [],
  submitLabel = "Save",
  successMessage = "Saved",
  onDone,
  onCancel,
}) {
  // Controlled inputs: React resets uncontrolled fields after a form action,
  // which would wipe the form whenever the server returns a validation error.
  const [values, setValues] = useState(() => initialValues(fields, item));
  const [state, formAction, pending] = useActionState(action, {});
  const toast = useToast();

  useEffect(() => {
    if (state?.ok) {
      toast(successMessage);
      onDone?.();
    }
    // Only react to a new save result, not to callbacks changing identity
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.savedAt]);

  const set = (name, value) => setValues((prev) => ({ ...prev, [name]: value }));
  const fieldErrors = state?.fieldErrors || {};

  function renderControl(field) {
    const common = {
      id: `field-${field.name}`,
      name: field.name,
      value: values[field.name],
      onChange: (e) => set(field.name, e.target.value),
      className: inputClass,
      "aria-invalid": fieldErrors[field.name] ? true : undefined,
    };

    switch (field.type) {
      case "textarea":
        return <textarea {...common} rows={5} />;
      case "list":
        return <textarea {...common} rows={4} />;
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
            <input type="hidden" name={field.name} value={JSON.stringify(values[field.name])} />
            <LinksEditor
              field={field}
              links={values[field.name]}
              onChange={(links) => set(field.name, links)}
            />
          </>
        );
      case "date":
        return <input {...common} type="date" />;
      case "number":
        return <input {...common} type="number" step="1" />;
      case "email":
        return <input {...common} type="email" />;
      case "url":
        return <input {...common} type="url" placeholder="https://…" />;
      default:
        return <input {...common} type="text" />;
    }
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {Object.entries(hidden).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value ?? ""} />
      ))}

      {fields.map((field) => {
        if (field.type === "checkbox") {
          return (
            <label
              key={field.name}
              className="flex items-center gap-3 text-sm text-[var(--ink)]"
            >
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
            {field.help && <p className={helpClass}>{field.help}</p>}
            {fieldErrors[field.name] && (
              <p role="alert" className={errorClass}>
                {fieldErrors[field.name]}
              </p>
            )}
          </div>
        );
      })}

      {state?.error && (
        <p role="alert" className="text-sm text-[var(--danger)]">
          {state.error}
        </p>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? "Saving…" : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className={secondaryButtonClass}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
