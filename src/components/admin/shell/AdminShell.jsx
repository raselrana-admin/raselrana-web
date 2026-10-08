"use client";

import {
  BookOpen,
  Briefcase,
  CircleUser,
  Download,
  ExternalLink,
  FileText,
  FolderKanban,
  GraduationCap,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Route,
  Trophy,
  UserRound,
  Wrench,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAction } from "@/app/admin/actions";
import ThemeToggle from "@/components/theme/ThemeToggle";
import BrandMark from "@/components/ui/BrandMark";
import { MODULE_LIST } from "@/lib/content/modules";
import { ToastProvider } from "../Toast";
import { eyebrowClass, iconButtonClass } from "../styles";

const MODULE_ICONS = {
  about: CircleUser,
  journey: Route,
  skills: Wrench,
  education: GraduationCap,
  achievements: Trophy,
  projects: FolderKanban,
  publications: BookOpen,
  experience: Briefcase,
  portfolio: FileText,
  downloads: Download,
};

// The sidebar. Content links come from the module registry, so a new module
// appears here by itself.
const NAV_GROUPS = [
  { title: null, links: [{ label: "Overview", href: "/admin", icon: LayoutDashboard }] },
  {
    title: "Content",
    links: MODULE_LIST.map((mod) => ({
      label: mod.label,
      href: `/admin/${mod.key}`,
      icon: MODULE_ICONS[mod.key] ?? FolderKanban,
    })),
  },
  {
    title: "Settings",
    links: [
      { label: "Public profile", href: "/admin/profile", icon: UserRound },
      { label: "Contact page", href: "/admin/contact-page", icon: Mail },
      { label: "Account", href: "/admin/account", icon: KeyRound },
    ],
  },
];

const ALL_LINKS = NAV_GROUPS.flatMap((group) => group.links);

function SidebarNav({ pathname, onNavigate }) {
  return (
    <nav className="flex flex-col gap-6" aria-label="Admin">
      {NAV_GROUPS.map((group) => (
        <div key={group.title ?? "main"}>
          {group.title && <p className={`${eyebrowClass} mb-2 px-3`}>{group.title}</p>}
          <ul className="flex flex-col gap-0.5">
            {group.links.map((link) => {
              const active = pathname === link.href;
              const Icon = link.icon;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      active
                        ? "bg-[var(--ink)] font-medium text-[var(--paper)]"
                        : "text-[var(--slate)] hover:bg-[var(--paper)] hover:text-[var(--ink)]"
                    }`}
                  >
                    <Icon size={16} strokeWidth={1.75} aria-hidden />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-3 px-3">
      <BrandMark size={30} />
      <span>
        <span className="block font-display text-base font-semibold leading-tight text-[var(--ink)]">
          Rasel Rana
        </span>
        <span className={`${eyebrowClass} text-[10px]`}>Admin</span>
      </span>
    </Link>
  );
}

export default function AdminShell({ account, children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const title = ALL_LINKS.find((link) => link.href === pathname)?.label ?? "Admin";

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[var(--paper)] lg:grid lg:grid-cols-[16.5rem_minmax(0,1fr)]">
        {/* Sidebar — large screens */}
        <aside className="sticky top-0 hidden h-screen flex-col gap-8 overflow-y-auto border-r border-[var(--line)] bg-[var(--surface)] px-3 py-6 lg:flex">
          <Brand />
          <SidebarNav pathname={pathname} />
          <div className="mt-auto border-t border-[var(--line)] px-3 pt-4">
            <p className="truncate text-sm font-medium text-[var(--ink)]">{account.name}</p>
            <p className="truncate text-xs text-[var(--slate)]">{account.email}</p>
          </div>
        </aside>

        {/* Drawer — small screens */}
        {open && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/40"
            />
            <aside className="relative flex h-full w-72 max-w-[82%] flex-col gap-8 overflow-y-auto bg-[var(--surface)] px-3 py-6">
              <div className="flex items-center justify-between pr-3">
                <Brand />
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className={iconButtonClass}
                >
                  <X size={16} aria-hidden />
                </button>
              </div>
              <SidebarNav pathname={pathname} onNavigate={() => setOpen(false)} />
            </aside>
          </div>
        )}

        <div className="min-w-0">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-[var(--line)] bg-[var(--paper)]/90 px-4 backdrop-blur-sm sm:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                aria-label="Open menu"
                onClick={() => setOpen(true)}
                className={`${iconButtonClass} lg:hidden`}
              >
                <Menu size={16} aria-hidden />
              </button>
              <p className="truncate font-display text-lg font-semibold text-[var(--ink)]">
                {title}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/"
                target="_blank"
                className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--slate)] transition-colors hover:text-[var(--signal)] sm:flex"
              >
                View site
                <ExternalLink size={14} aria-hidden />
              </Link>
              <ThemeToggle />
              <form action={logoutAction}>
                <button type="submit" aria-label="Sign out" title="Sign out" className={iconButtonClass}>
                  <LogOut size={16} aria-hidden />
                </button>
              </form>
            </div>
          </header>

          <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-10">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
