"use client";

import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  deleteEntryAction,
  importStarterAction,
  saveEntryAction,
} from "@/app/admin/actions";
import { MODULES } from "@/lib/content/modules";
import SchemaForm from "./SchemaForm";
import { useToast } from "./Toast";
import {
  badgeClass,
  cardClass,
  dangerButtonClass,
  iconButtonClass,
  inputClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "./styles";

function Badges({ item }) {
  return (
    <>
      {item.published === false && (
        <span className={`${badgeClass} border-[var(--slate)] text-[var(--slate)]`}>Draft</span>
      )}
      {item.showOnHome && (
        <span className={`${badgeClass} border-[var(--signal)] text-[var(--signal)]`}>Home</span>
      )}
      {item.featured && (
        <span className={`${badgeClass} border-[var(--signal)] text-[var(--signal)]`}>Featured</span>
      )}
    </>
  );
}

/**
 * The list + form screen for one content module (see lib/content/modules.js).
 * `entries` is { [typeKey]: [items] } from getAdminEntries().
 */
export default function EntryManager({ moduleKey, entries, canImport }) {
  const mod = MODULES[moduleKey];
  const typeKeys = Object.keys(mod.types);
  const toast = useToast();

  const [activeType, setActiveType] = useState(typeKeys[0]);
  // null = list only, "new" = adding, otherwise the id of the entry being edited
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);

  const type = mod.types[activeType];
  const items = entries[activeType] ?? [];
  const editingItem =
    editing && editing !== "new" ? items.find((item) => item.id === editing) : null;

  const needle = query.trim().toLowerCase();
  const visible = needle
    ? items.filter((item) =>
        [type.titleField, ...type.metaFields]
          .map((name) => String(item[name] ?? ""))
          .join(" ")
          .toLowerCase()
          .includes(needle),
      )
    : items;

  function switchType(next) {
    setActiveType(next);
    setEditing(null);
    setQuery("");
  }

  return (
    <div>
      <p className="max-w-[60ch] text-sm text-[var(--slate)]">{mod.description}</p>

      {canImport && (
        <div className={`${cardClass} mt-6 border-[var(--signal)] p-5`}>
          <p className="text-sm text-[var(--ink)]">
            The starter content from the code has not been imported yet. Import it to add it to
            the database, next to anything you have already created, and edit it here.
          </p>
          <form action={importStarterAction} className="mt-4">
            <input type="hidden" name="module" value={moduleKey} />
            <button type="submit" className={primaryButtonClass}>
              Import starter content
            </button>
          </form>
        </div>
      )}

      {typeKeys.length > 1 && (
        <div
          role="tablist"
          aria-label={`${mod.label} types`}
          className="mt-8 flex flex-wrap gap-2"
        >
          {typeKeys.map((key) => {
            const active = key === activeType;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => switchType(key)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  active
                    ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                    : "border-[var(--line)] text-[var(--slate)] hover:text-[var(--ink)]"
                }`}
              >
                {mod.types[key].label}
                <span className="ml-2 font-mono text-xs opacity-70">
                  {(entries[key] ?? []).length}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-xs">
          <Search
            size={16}
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--slate)]"
          />
          <input
            type="search"
            aria-label={`Search ${type.label.toLowerCase()}`}
            placeholder="Search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`${inputClass} pl-9`}
          />
        </div>
        {editing === null && (
          <button type="button" onClick={() => setEditing("new")} className={primaryButtonClass}>
            <Plus size={16} aria-hidden />
            Add {type.singular}
          </button>
        )}
      </div>

      {editing !== null && (editing === "new" || editingItem) && (
        <div className={`${cardClass} mt-6 p-6 sm:p-8`}>
          <h2 className="mb-6 font-display text-xl font-semibold text-[var(--ink)]">
            {editing === "new" ? `New ${type.singular}` : `Edit ${type.singular}`}
          </h2>
          <SchemaForm
            // Remount when switching entry so the form starts from its values
            key={`${activeType}-${editing}`}
            fields={type.fields}
            item={editingItem}
            action={saveEntryAction}
            hidden={{ module: moduleKey, type: activeType, id: editingItem?.id ?? "" }}
            competitions={entries.competition ?? []}
            onDone={() => setEditing(null)}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      <div className={`${cardClass} mt-6 overflow-hidden`}>
        {visible.length === 0 ? (
          <p className="p-8 text-center text-sm text-[var(--slate)]">
            {items.length === 0
              ? `No ${type.label.toLowerCase()} yet.`
              : "Nothing matches your search."}
          </p>
        ) : (
          <ul className="divide-y divide-[var(--line)]">
            {visible.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-6"
              >
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 text-[var(--ink)]">
                    <span className="font-medium">{item[type.titleField]}</span>
                    <Badges item={item} />
                  </p>
                  <p className="mt-1 font-mono text-xs text-[var(--slate)]">
                    {type.metaFields
                      .map((name) => item[name])
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    aria-label={`Edit ${item[type.titleField]}`}
                    title="Edit"
                    onClick={() => setEditing(item.id)}
                    className={iconButtonClass}
                  >
                    <Pencil size={15} aria-hidden />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${item[type.titleField]}`}
                    title="Delete"
                    onClick={() => setPendingDelete(item)}
                    className={`${iconButtonClass} hover:border-[var(--danger)] hover:text-[var(--danger)]`}
                  >
                    <Trash2 size={15} aria-hidden />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {pendingDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <button
            type="button"
            aria-label="Cancel"
            onClick={() => setPendingDelete(null)}
            className="absolute inset-0 bg-black/40"
          />
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className={`${cardClass} relative w-full max-w-md p-6`}
          >
            <h2 id="delete-title" className="font-display text-lg font-semibold text-[var(--ink)]">
              Delete this {type.singular}?
            </h2>
            <p className="mt-2 text-sm text-[var(--slate)]">
              “{pendingDelete[type.titleField]}” will be removed from the site. This cannot be
              undone. To hide it instead, edit it and untick Published.
            </p>
            <form
              action={async (formData) => {
                await deleteEntryAction(formData);
                if (editing === pendingDelete.id) setEditing(null);
                setPendingDelete(null);
                toast("Deleted");
              }}
              className="mt-6 flex justify-end gap-3"
            >
              <input type="hidden" name="module" value={moduleKey} />
              <input type="hidden" name="id" value={pendingDelete.id} />
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className={secondaryButtonClass}
              >
                Cancel
              </button>
              <button type="submit" className={dangerButtonClass}>
                Delete
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
