"use client";

import { ImagePlus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { getUploadSignatureAction } from "@/app/admin/actions";
import CloudImage from "@/components/ui/CloudImage";
import { errorClass, inputClass, secondaryButtonClass } from "./styles";

const MAX_BYTES = 10 * 1024 * 1024; // Cloudinary's free-plan limit per image

// Sends one file straight to Cloudinary, using a signature from the server.
// Returns { url, publicId, width, height }.
async function uploadImage(file) {
  if (!file.type.startsWith("image/")) throw new Error(`"${file.name}" is not an image.`);
  if (file.size > MAX_BYTES) throw new Error(`"${file.name}" is larger than 10 MB.`);

  const signed = await getUploadSignatureAction();
  if (signed.error) throw new Error(signed.error);

  const body = new FormData();
  body.append("file", file);
  for (const [key, value] of Object.entries(signed.params)) body.append(key, value);
  body.append("api_key", signed.apiKey);
  body.append("signature", signed.signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`,
    { method: "POST", body },
  );
  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.secure_url) {
    throw new Error(result?.error?.message || "The upload failed. Please try again.");
  }
  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
  };
}

// A hidden file input opened by a normal-looking button.
function UploadButton({ label, multiple = false, busy, onFiles }) {
  const input = useRef(null);
  return (
    <>
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple={multiple}
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          const files = [...e.target.files];
          e.target.value = ""; // allow picking the same file again
          if (files.length > 0) onFiles(files);
        }}
      />
      <button
        type="button"
        disabled={busy}
        onClick={() => input.current?.click()}
        className={secondaryButtonClass}
      >
        <ImagePlus size={16} aria-hidden />
        {busy ? "Uploading…" : label}
      </button>
    </>
  );
}

/** One photo. `value` is an image object or null. */
export function ImageInput({ field, value, onChange }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function handleFiles([file]) {
    setBusy(true);
    setError(null);
    try {
      onChange(await uploadImage(file));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* The saved value travels with the form as JSON */}
      <input type="hidden" name={field.name} value={value ? JSON.stringify(value) : ""} />

      {value && (
        <div className="w-40 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--paper)]">
          <CloudImage image={value} alt={`${field.label} preview`} sizes="160px" className="h-auto w-full" />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <UploadButton
          label={value ? "Replace photo" : "Upload photo"}
          busy={busy}
          onFiles={handleFiles}
        />
        {value && (
          <button type="button" onClick={() => onChange(null)} className={secondaryButtonClass}>
            Remove
          </button>
        )}
      </div>

      {error && (
        <p role="alert" className={errorClass}>
          {error}
        </p>
      )}
    </div>
  );
}

/** Several photos, each with a caption. `value` is an array of image objects. */
export function GalleryInput({ field, value, onChange }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function handleFiles(files) {
    setBusy(true);
    setError(null);
    const added = [];
    try {
      // One at a time, so a failure stops cleanly and keeps what already uploaded
      for (const file of files) {
        added.push({ ...(await uploadImage(file)), caption: "" });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      if (added.length > 0) onChange([...value, ...added]);
      setBusy(false);
    }
  }

  const update = (index, caption) =>
    onChange(value.map((item, i) => (i === index ? { ...item, caption } : item)));

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name={field.name} value={JSON.stringify(value)} />

      {value.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {value.map((item, index) => (
            <li
              key={item.url}
              className="flex flex-col gap-2 rounded-xl border border-[var(--line)] bg-[var(--paper)] p-2"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <CloudImage
                  image={item}
                  alt={item.caption || `Photo ${index + 1}`}
                  fill
                  sizes="240px"
                  className="object-cover"
                />
              </div>
              <div className="flex gap-2">
                <input
                  aria-label={`Caption for photo ${index + 1}`}
                  placeholder="Caption"
                  value={item.caption}
                  onChange={(e) => update(index, e.target.value)}
                  className={inputClass}
                />
                <button
                  type="button"
                  aria-label={`Remove photo ${index + 1}`}
                  title="Remove"
                  onClick={() => onChange(value.filter((_, i) => i !== index))}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--line)] text-[var(--slate)] transition-colors hover:border-[var(--danger)] hover:text-[var(--danger)]"
                >
                  <Trash2 size={15} aria-hidden />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div>
        <UploadButton label="Add photos" multiple busy={busy} onFiles={handleFiles} />
      </div>

      {error && (
        <p role="alert" className={errorClass}>
          {error}
        </p>
      )}
    </div>
  );
}
