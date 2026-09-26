import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a contact form email using Resend.
 * @param {{ name: string, email: string, subject?: string, message: string }} data
 */
export async function sendContactEmail({ name, email, subject, message }) {
  const emailSubject = subject
    ? `[Website] ${subject}`
    : `New message from ${name}`;

  const { data: result, error } = await resend.emails.send({
    from:
      process.env.CONTACT_EMAIL_FROM ||
      "Portfolio Contact <onboarding@resend.dev>", // replace with your verified domain later
    to: process.env.CONTACT_EMAIL_TO,
    replyTo: email,
    subject: emailSubject,
    text: `From: ${name} (${email})${subject ? `\nSubject: ${subject}` : ""}\n\n${message}`,
    html: `
      <div>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message || "Failed to send email");
  }

  return result;
}
