// lib/data/contact.js
// Structured content for the Contact page.
// Follows the same lib/data/*.js convention used for Home, About, etc.
// Anything marked TODO is intentionally left for you to fill in later.

export const contactPage = {
  eyebrow: "Contact",
  heading: "Let's talk",
  intro:
    "Whether it's a question about a project, a collaboration, or a technical discussion around telecommunications and electrical engineering — feel free to reach out. I try to respond within a couple of business days.",
};

export const contactChannels = [
  {
    id: "email",
    label: "Email",
    value: "contact@raselrana.com.bd",
    href: "mailto:contact@raselrana.com.bd",
    icon: "Mail",
    note: "Best way to reach me — used for all site inquiries.",
  },
  {
    id: "location",
    label: "Location",
    value: "Dhaka, Bangladesh",
    href: null,
    icon: "MapPin",
    note: null, // TODO: add a more specific area/office note if you want one shown
  },
  {
    id: "response-time",
    label: "Response time",
    value: "Within 2–3 business days",
    href: null,
    icon: "Clock",
    note: null,
  },
  // TODO: add more channels if you want them shown, e.g.:
  // { id: "linkedin", label: "LinkedIn", value: "@yourhandle", href: "https://linkedin.com/in/...", icon: "Linkedin" },
  // { id: "phone", label: "Phone", value: "+880 ...", href: "tel:+880...", icon: "Phone" },
];

// Subjects offered in the contact form's dropdown.
// TODO: adjust to taste once real inbox routing/labels are finalized.
export const contactSubjects = [
  { value: "general", label: "General inquiry" },
  { value: "collaboration", label: "Collaboration / project" },
  { value: "technical", label: "Technical discussion" },
  { value: "other", label: "Something else" },
];

export const contactFormCopy = {
  successTitle: "Message sent",
  successBody:
    "Thanks for reaching out — your message has landed in my inbox and I'll get back to you soon.",
  errorTitle: "Something went wrong",
  errorBody:
    "The message couldn't be sent right now. Please try again in a moment, or email me directly at contact@raselrana.com.bd.",
};
