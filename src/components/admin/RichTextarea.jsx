"use client";

import { Bold, Italic } from "lucide-react";
import { useRef } from "react";
import { iconButtonClass } from "./styles";

// A text box with Bold and Italic buttons for the fields marked `rich`.
// The buttons wrap the selected words in ** or * (the markup ui/RichText
// draws on the site); with nothing selected they insert the pair and put
// the cursor between them.
export default function RichTextarea({ value, onChange, ...props }) {
  const ref = useRef(null);

  function wrap(marker) {
    const box = ref.current;
    if (!box) return;
    const { selectionStart: start, selectionEnd: end } = box;
    const selected = value.slice(start, end);
    onChange(value.slice(0, start) + marker + selected + marker + value.slice(end));
    // Keep the same words selected once React has drawn the new value
    requestAnimationFrame(() => {
      box.focus();
      box.setSelectionRange(start + marker.length, end + marker.length);
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2" role="toolbar" aria-label="Text style">
        <button
          type="button"
          onClick={() => wrap("**")}
          title="Bold: **text**"
          aria-label="Bold"
          className={iconButtonClass}
        >
          <Bold size={15} aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => wrap("*")}
          title="Italic: *text*"
          aria-label="Italic"
          className={iconButtonClass}
        >
          <Italic size={15} aria-hidden />
        </button>
      </div>
      <textarea ref={ref} value={value} onChange={(e) => onChange(e.target.value)} {...props} />
    </div>
  );
}
