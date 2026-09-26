"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { contactSubjects, contactFormCopy } from "@/lib/data/contact";

const initialForm = { name: "", email: "", subject: "general", message: "", company: "" };

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg(null);

    try {
      const subjectLabel =
        contactSubjects.find((s) => s.value === form.subject)?.label || form.subject;

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, subject: subjectLabel }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong.");
      }

      setStatus("success");
      setForm(initialForm);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  }

  const isLoading = status === "loading";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {/* Honeypot field — hidden from real users, catches simple bots */}
      <input
        type="text"
        name="company"
        value={form.company}
        onChange={handleChange}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor="name">
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            className={inputClass}
          />
        </Field>

        <Field label="Email" htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Subject" htmlFor="subject">
        <select
          id="subject"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          className={inputClass}
        >
          {contactSubjects.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Message" htmlFor="message">
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          value={form.message}
          onChange={handleChange}
          placeholder="Write your message..."
          className={`${inputClass} resize-none`}
        />
      </Field>

      <div className="flex items-center gap-4 pt-1">
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ y: isLoading ? 0 : -1 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className="inline-flex items-center gap-2 rounded-md bg-[color:var(--signal)] px-6 py-3 font-[family-name:var(--font-mono)] text-sm uppercase tracking-wide text-[color:var(--paper)] transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Sending…" : "Send Message"}
        </motion.button>

        <AnimatePresence mode="wait">
          {status === "success" && (
            <motion.p
              key="success"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="font-[family-name:var(--font-mono)] text-sm text-[color:var(--pulse)]"
            >
              {contactFormCopy.successTitle} — {contactFormCopy.successBody}
            </motion.p>
          )}
          {status === "error" && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="font-[family-name:var(--font-mono)] text-sm text-red-500"
            >
              {errorMsg || contactFormCopy.errorBody}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-md border border-[color:var(--line)] bg-[color:var(--paper)] px-4 py-3 text-[color:var(--ink)] placeholder:text-[color:var(--slate)] outline-none transition-colors focus:border-[color:var(--signal)]";

function Field({ label, htmlFor, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wide text-[color:var(--slate)]"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
