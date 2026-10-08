import { Mail, MapPin, Clock } from "lucide-react";
import { contactChannels } from "@/lib/data/contact";

const icons = { Mail, MapPin, Clock };

// The channel list (labels, icons, notes) lives in lib/data/contact.js; the
// email and location values come from the public profile so they match the
// rest of the site.
export default function ContactInfo({ profile }) {
  const channels = contactChannels.map((channel) => {
    if (channel.id === "email") {
      return { ...channel, value: profile.email, href: `mailto:${profile.email}` };
    }
    if (channel.id === "location") return { ...channel, value: profile.location };
    return channel;
  });

  return (
    <ul className="flex flex-col gap-8">
      {channels.map((channel) => {
        const Icon = icons[channel.icon] ?? Mail;

        return (
          <li key={channel.id} className="flex items-start gap-4">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--signal)]">
              <Icon size={16} strokeWidth={1.75} aria-hidden />
            </span>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--slate)]">
                {channel.label}
              </p>
              {channel.href ? (
                <a
                  href={channel.href}
                  className="mt-1 block text-[var(--ink)] underline decoration-[var(--line)] underline-offset-4 transition-colors hover:text-[var(--signal)] hover:decoration-[var(--signal)]"
                >
                  {channel.value}
                </a>
              ) : (
                <p className="mt-1 text-[var(--ink)]">{channel.value}</p>
              )}
              {channel.note && (
                <p className="mt-1 text-sm text-[var(--slate)]">{channel.note}</p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
