# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Next.js dev server on http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint (flat config, eslint-config-next/core-web-vitals)
npm run hash-password   # prompts for a password, prints ADMIN_PASSWORD_HASH and SESSION_SECRET
```

There is no test suite and no TypeScript — the project is plain JavaScript/JSX. `npm run lint` and `npm run build` are the only automated checks.

## Environment

Copy `.env.example` to `.env.local`. All other `.env*` files are gitignored.

- `MONGODB_URI` — required by anything that imports `src/lib/mongodb.js`, which throws at import time if it is missing. `/downloads` and `/api/downloads/track` therefore fail without it.
- `MONGODB_DB` — defaults to `raselrana`.
- `RESEND_API_KEY`, `CONTACT_EMAIL_TO` — contact form. `CONTACT_EMAIL_FROM` is optional and falls back to Resend's `onboarding@resend.dev` sender.
- `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET` — admin login. Generate the last two with `npm run hash-password`. If any is missing (or the secret is under 32 characters) nobody can log in.
- `BLOG_DOMAIN` — used by `next.config.mjs` to rewrite `/blog` and `/blog/*` to a separately deployed blog app. The blog is not part of this repo.

## Stack

Next.js 16 (App Router) with React 19, Tailwind CSS v4, Motion (`motion/react`), next-themes, MongoDB driver, Resend, Vercel Analytics. Deployed on Vercel; pushes to `main` deploy to raselrana.com.bd.

Branch workflow: every feature gets its own `feature/<name>` branch, merged into `develop` by PR. `develop` is merged into `main` to release. Do not commit feature work directly on `develop` or `main`.


## Architecture

Everything lives under `src/`, imported through the `@/*` alias (`jsconfig.json`).

### Content is data, pages are composition

The site is a content-driven portfolio with a strict three-layer split:

1. `src/lib/data/<page>.js` — all copy and structured content as plain exported objects/arrays, plus derived values where needed. Editing site content means editing these files, not components.
2. `src/components/sections/<page>/` — one component per page section, which imports its own data from `lib/data`. Sections take few or no props.
3. `src/app/<route>/page.jsx` — thin Server Components that set `metadata` and stack section components.

Adding a page means adding a data file, a `sections/<page>/` folder, and a `page.jsx`, then registering the route in `NAV_LINKS` in `src/components/layout/Navbar.jsx` (the mobile menu reuses `NAV_LINKS`). Footer links are data: `src/lib/data/site.js` holds the footer's link columns (`footerNav`) and external links (`socialLinks`, where an entry with an empty `href` stays hidden), so not every page is in the navbar.

Achievements are the exception to "content lives in `lib/data`": see "Achievements and the admin panel" below.

### Server/client boundary and the `views/` rule

- `src/components/index.js` is a barrel that pages import sections from. It must only export components that are safe for a client bundle.
- Anything that touches MongoDB (or other server-only code) goes in `src/views/`, not `src/components/`, and is imported by direct path. `src/views/downloads/DownloadsView.jsx` and `src/views/achievements/AchievementsView.jsx` are the examples: async Server Components that read from Mongo and pass plain data down to section components as props. Putting such a component in the barrel previously leaked the `mongodb` driver into a client bundle and broke the build.
- Section components are Server Components unless they need interactivity. Where Motion is needed, import it as `motion/react`.
- `src/lib/use-is-mounted.js` (`useIsMounted`) is the way to hold back browser-only UI without a hydration mismatch; do not use `setState` in an effect for this.

### Downloads tracking

`src/lib/data/downloads.js` lists the documents (files live in `public/documents/`). A click on `DownloadButton` fires a Vercel Analytics event and a `keepalive` POST to `/api/downloads/track`, which upserts a counter in the `download_stats` collection through `src/lib/services/downloads-service.js`. `/downloads` is `force-dynamic` so counts are read per request. Reads fail soft (empty counts) so the page renders when Mongo is down; tracking errors never block the download itself.

### Achievements and the admin panel

Achievement content lives in MongoDB and is edited at `/admin/achievements`.

- Storage: one `achievements` collection, one document per item, told apart by `type` (`competition`, `judging`, `sports`, `leadership`, `press`, `affiliation`). All reads and writes go through `src/lib/services/achievements-service.js`.
- `src/lib/achievements-schema.js` defines each type's fields. The admin form renders from it and `normalizeAchievement` validates against it, so adding a field means editing that file plus the section component that displays it.
- `src/lib/data/achievements.js` is now only the starter content (much of it sample text, marked as such in the file header). The admin "Import starter content" button copies it into the collection once, next to any existing items; a marker document of type `_import` records that it ran. The public page falls back to this file only while the collection is completely empty or Mongo is unreachable.
- `/achievements` and `/achievements/[slug]` are `force-dynamic`. The detail route serves competitions, judging and sports, so slugs are unique across those three types (enforced on save). Renaming or deleting a competition updates the press clippings that point at it.
- Mutations are Server Actions in `src/app/admin/actions.js`, not API routes.

Auth is a single admin account with no auth library:

- `src/lib/auth/session-token.js` signs and verifies an HMAC session cookie (`admin_session`, 7 days) with Web Crypto; `password.js` verifies a scrypt hash; `session.js` wraps `cookies()`; `login-attempts.js` blocks an IP after 5 failures in 15 minutes (stored in Mongo).
- `src/proxy.js` (the Next 16 replacement for `middleware.js`) redirects signed-out requests under `/admin` to `/admin/login`. It is only the first gate: every admin page and every Server Action except login must also call `requireAdmin()`.
- Pages that need a session go in the `src/app/admin/(panel)/` route group, whose layout checks the session and renders the admin bar. `/admin/login` sits outside it.
- Admin components live in `src/components/admin/` and are not exported from the barrel.

### Contact form

`sections/contact/ContactForm.jsx` POSTs to `/api/contact`, which validates input, silently accepts submissions that fill the `company` honeypot field, and sends through `src/services/email.js` (Resend). Visitor input is escaped before it goes into the email HTML; keep it that way when changing the template.

### Security

- Public write endpoints are rate-limited per IP through `src/lib/services/rate-limit.js` (`isRateLimited`, Mongo-backed, fails open): contact form 5 per 10 minutes, download tracking 30 per 10 minutes. Use it for any new public endpoint that writes or sends.
- `/api/downloads/track` only accepts ids listed in `lib/data/downloads.js`.
- `next.config.mjs` sets security headers on every response, including `/blog`. The Content-Security-Policy is deliberately limited to `frame-ancestors`, `base-uri`, `form-action` and `object-src`; adding `script-src` would need nonces because Next and next-themes use inline scripts.
- `next` is pinned to an exact version; check `npm audit --omit=dev` before releases. The remaining `npm audit` findings are in ESLint tooling only and are not shipped.

Note the two service locations: `src/services/` (email) and `src/lib/services/` (downloads).

### Styling and theming

- Tailwind v4 with no `tailwind.config` — setup is `@import "tailwindcss"` in `src/app/globals.css`.
- Colors are eight CSS variables (`--ink`, `--slate`, `--paper`, `--surface` for cards and panels, `--signal`, `--pulse`, `--line`, `--danger` for errors) defined for light in `:root` and overridden under `.dark`. Use them as arbitrary values (`text-[var(--ink)]`, `border-[var(--line)]`) rather than Tailwind palette colors or `dark:` variants, so both themes work automatically.
- Dark mode is class-based through next-themes (`attribute="class"`, system default). Components that read the theme must guard against hydration mismatch as `ThemeToggle` does.
- Fonts: `src/app/fonts.js` loads Space Grotesk, IBM Plex Sans and IBM Plex Mono as raw variables, and the `@theme static` block in `globals.css` maps them to `--font-display`, `--font-body` and `--font-mono`. Use the `font-display` / `font-body` / `font-mono` utilities; the older `font-[family-name:var(--font-display)]` form still works.
- Layout: every page uses the navbar's `mx-auto max-w-6xl px-6` container, sections are separated by a hairline `border-t border-[var(--line)]`, and cards sit on `bg-[var(--surface)]`. `ui/PageHeader` is the single header for inner pages (About keeps its own two-column hero with the portrait); `ui/SectionHeader` gives sections their eyebrow + heading + optional link.
- Motion is CSS-only (defined in `globals.css`): `.rise` fades content in on load (stagger with `style={{ "--delay": "80ms" }}`), `.reveal` fades it in on scroll where the browser supports scroll-driven animations, and `.net-*` drives the hero `ui/NetworkMap`. Never hide content pending JavaScript (no `motion` with `initial={{ opacity: 0 }}` for entrance effects) — pages must be readable in the server HTML. `motion` is still used for interactive pieces (navbar indicator, mobile menu, journey side nav, form feedback).

### SEO

`src/app/layout.js` sets `metadataBase` and site-wide Open Graph/Twitter defaults from `siteInfo` in `lib/data/site.js`. `src/app/sitemap.js` lists the public paths by hand (add new pages there) and `src/app/robots.js` blocks `/admin` and `/api`. Pages set their own `title` and `description`; they do not set per-page Open Graph values yet.

### Still sample content

Most `lib/data` files and many achievement entries in MongoDB still hold sample text (marked "Sample", "EXAMPLE", "TODO", "[Placeholder]" or "20XX"). `/projects`, `/skills`, `/education` and `/publications` are simple pages (shared `ui/PageHeader` plus one list section each) linked from the footer, not the navbar.
