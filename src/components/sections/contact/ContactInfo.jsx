import { Mail, MapPin, Clock } from "lucide-react";
import { contactChannels } from "@/lib/data/contact";

const icons = { Mail, MapPin, Clock };

export default function ContactInfo() {
  return (
    <div className="flex flex-col gap-6">
      {contactChannels.map((channel) => {
        const Icon = icons[channel.icon] ?? Mail;
        const content = (
          <div className="flex items-start gap-4">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[color:var(--line)] text-[color:var(--signal)]">
              <Icon size={16} strokeWidth={1.75} />
            </span>
            <div>
              <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wide text-[color:var(--slate)]">
                {channel.label}
              </p>
              <p className="mt-1 text-[color:var(--ink)]">{channel.value}</p>
              {channel.note && (
                <p className="mt-1 text-sm text-[color:var(--slate)]">{channel.note}</p>
              )}
            </div>
          </div>
        );

        return channel.href ? (
          <a
            key={channel.id}
            href={channel.href}
            className="rounded-lg transition-colors hover:bg-[color:var(--paper)]"
          >
            {content}
          </a>
        ) : (
          <div key={channel.id}>{content}</div>
        );
      })}
    </div>
  );
}
