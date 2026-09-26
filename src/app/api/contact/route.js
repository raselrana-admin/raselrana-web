// app/api/contact/route.js
// Validates the submission, rejects obvious bot traffic via a honeypot
// field, then hands off to service/email.js (sendContactEmail) to do the
// actual sending through Resend.

import { NextResponse } from "next/server";

import { sendContactEmail } from "@/services/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const { name, email, subject, message, company } = body || {};

  // Honeypot: real users never fill this hidden field in.
  if (company) {
    // Pretend success so bots don't learn anything from the response.
    return NextResponse.json({ ok: true });
  }

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 },
    );
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  if (message.length > 5000) {
    return NextResponse.json(
      { error: "Message is too long." },
      { status: 400 },
    );
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("[api/contact] RESEND_API_KEY missing — cannot send email.");
    return NextResponse.json(
      { error: "Email is not configured on the server yet." },
      { status: 500 },
    );
  }

  try {
    await sendContactEmail({
      name: String(name).slice(0, 200),
      email,
      subject: subject ? String(subject).slice(0, 200) : undefined,
      message,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/contact] sendContactEmail failed:", err);
    return NextResponse.json(
      { error: "Failed to send message." },
      { status: 502 },
    );
  }
}

// TODO: consider adding rate limiting (e.g. Upstash Ratelimit keyed by IP)
// once the form is public, to reduce abuse potential.
