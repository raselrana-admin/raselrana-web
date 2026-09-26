"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="w-full max-w-md">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.p
            key="success"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-sm text-accent tracking-wide text-center"
          >
            Message sent — I&apos;ll get back to you soon.
          </motion.p>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex flex-col gap-3"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label htmlFor="name" className="sr-only">
                  Your name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full bg-transparent border border-line rounded-sm px-4 py-3 text-sm font-body text-fg placeholder:text-fg-muted focus:border-accent transition-colors"
                />
              </div>

              <div className="flex-1">
                <label htmlFor="email" className="sr-only">
                  Your email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email"
                  className="w-full bg-transparent border border-line rounded-sm px-4 py-3 text-sm font-body text-fg placeholder:text-fg-muted focus:border-accent transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="sr-only">
                Your message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message"
                className="w-full bg-transparent border border-line rounded-sm px-4 py-3 text-sm font-body text-fg placeholder:text-fg-muted focus:border-accent transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-1 border border-accent text-accent rounded-sm px-5 py-3 text-sm font-mono tracking-wide hover:bg-accent hover:text-bg transition-colors disabled:opacity-50"
            >
              {status === "submitting" ? "Sending…" : "Send Message"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {status === "error" && (
        <p className="mt-2 text-xs font-mono text-red-400 text-center">
          Something went wrong — try again in a moment.
        </p>
      )}
    </div>
  );
}
