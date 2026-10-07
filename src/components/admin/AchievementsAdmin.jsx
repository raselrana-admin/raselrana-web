"use client";

import { useState } from "react";
import { deleteAchievementAction, importDefaultsAction } from "@/app/admin/actions";
import { ACHIEVEMENT_TYPES } from "@/lib/achievements-schema";
import AchievementForm from "./AchievementForm";
import {
  dangerButtonClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "./styles";

// Which key of the grouped data each type's items live under.
const DATA_KEY = {
  competition: "competitions",
  judging: "judging",
  sports: "sports",
  leadership: "leadership",
  press: "press",
  affiliation: "affiliations",
};

const TYPE_KEYS = Object.keys(ACHIEVEMENT_TYPES);

export default function AchievementsAdmin({ data, canImport }) {
  const [activeType, setActiveType] = useState("competition");
  // null = list only, "new" = adding, otherwise the id of the item being edited
  const [editing, setEditing] = useState(null);

  const config = ACHIEVEMENT_TYPES[activeType];
  const items = data[DATA_KEY[activeType]];
  const editingItem =
    editing && editing !== "new" ? items.find((item) => item.id === editing) : null;

  function switchType(type) {
    setActiveType(type);
    setEditing(null);
  }

  return (
    <div className="mt-8">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--ink)]">
        Achievements
      </h1>

      {canImport && (
        <div className="mt-6 rounded-xl border border-[var(--signal)] p-5">
          <p className="text-sm text-[var(--ink)]">
            The starter content from the code has not been imported yet.
            Import it to add it to the database, next to anything you have
            already created, and edit it here.
          </p>
          <form action={importDefaultsAction} className="mt-4">
            <button type="submit" className={primaryButtonClass}>
              Import starter content
            </button>
          </form>
        </div>
      )}

      <div
        role="tablist"
        aria-label="Achievement types"
        className="mt-8 flex flex-wrap gap-2 border-b border-[var(--line)] pb-4"
      >
        {TYPE_KEYS.map((type) => {
          const active = type === activeType;
          return (
            <button
              key={type}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => switchType(type)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                active
                  ? "border-[var(--signal)] text-[var(--signal)]"
                  : "border-[var(--line)] text-[var(--slate)] hover:text-[var(--ink)]"
              }`}
            >
              {ACHIEVEMENT_TYPES[type].label}
              <span className="ml-2 font-[family-name:var(--font-mono)] text-xs">
                {data[DATA_KEY[type]].length}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
          {config.label}
        </h2>
        {editing === null && (
          <button
            type="button"
            onClick={() => setEditing("new")}
            className={primaryButtonClass}
          >
            Add {config.singular}
          </button>
        )}
      </div>

      {editing !== null && (editing === "new" || editingItem) && (
        <div className="mt-6 rounded-xl border border-[var(--line)] p-6">
          <h3 className="font-[family-name:var(--font-display)] text-lg text-[var(--ink)]">
            {editing === "new" ? `New ${config.singular}` : `Edit ${config.singular}`}
          </h3>
          <AchievementForm
            // Remount when switching item so the form starts from that item's values
            key={`${activeType}-${editing}`}
            type={activeType}
            item={editingItem}
            competitions={data.competitions}
            onDone={() => setEditing(null)}
          />
        </div>
      )}

      {items.length === 0 ? (
        <p className="mt-8 text-sm text-[var(--slate)]">
          No {config.label.toLowerCase()} yet.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-4 py-4"
            >
              <div className="min-w-0">
                <p className="text-[var(--ink)]">
                  {item[config.titleField]}
                  {item.featured && (
                    <span className="ml-2 rounded-full border border-[var(--signal)] px-2 py-0.5 font-[family-name:var(--font-mono)] text-xs text-[var(--signal)]">
                      Featured
                    </span>
                  )}
                </p>
                <p className="mt-1 font-[family-name:var(--font-mono)] text-xs text-[var(--slate)]">
                  {config.metaFields
                    .map((name) => item[name])
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(item.id)}
                  className={secondaryButtonClass}
                >
                  Edit
                </button>
                <form
                  action={deleteAchievementAction}
                  onSubmit={(e) => {
                    if (!window.confirm(`Delete "${item[config.titleField]}"? This cannot be undone.`)) {
                      e.preventDefault();
                    }
                  }}
                >
                  <input type="hidden" name="id" value={item.id} />
                  <button type="submit" className={dangerButtonClass}>
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
