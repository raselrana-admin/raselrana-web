// app/api/contact/route.js
// Validates the submission, rejects obvious bot traffic via a honeypot
// field, rate-limits by IP, then hands off to services/email.js
// (sendContactEmail) to do the actual sending through Resend.

import { NextResponse } from "next/server";

import { getClientIp, isRateLimited } from "@/lib/services/rate-limit";
import { sendContactEmail } from "@/services/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Collapses line breaks and control characters so a value can't smuggle
// extra lines into the email subject or headers.
function singleLine(value, maxLength) {
  return String(value)
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .trim()
    .slice(0, maxLength);
}

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

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    (subject != null && typeof subject !== "string")
  ) {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const cleanName = singleLine(name, 200);
  const cleanEmail = email.trim();
  const cleanSubject = subject ? singleLine(subject, 200) : undefined;
  const cleanMessage = message.trim();

  if (!cleanName || !cleanEmail || !cleanMessage) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 },
    );
  }

  if (cleanEmail.length > 254 || !EMAIL_RE.test(cleanEmail)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  if (cleanMessage.length > 5000) {
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

  // 5 messages per 10 minutes per IP — enough for a real person, and it
  // stops the form being used to flood the inbox or burn the Resend quota.
  const limited = await isRateLimited({
    bucket: "contact",
    ip: getClientIp(request),
    max: 5,
    windowSeconds: 10 * 60,
  });
  if (limited) {
    return NextResponse.json(
      { error: "Too many messages. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  try {
    await sendContactEmail({
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject,
      message: cleanMessage,
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
