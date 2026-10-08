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

`docs/` holds the owner's developer guide (how the project works, step-by-step recipes, design rules, deployment and troubleshooting). It restates the rules in this file in plain language; when a rule here changes, update the matching page there in the same change.

## Environment

Copy `.env.example` to `.env.local`. All other `.env*` files are gitignored.

- `MONGODB_URI` — required by anything that imports `src/lib/mongodb.js`, which throws at import time if it is missing. `/downloads` and `/api/downloads/track` therefore fail without it.
- `MONGODB_DB` — defaults to `raselrana`.
- `RESEND_API_KEY`, `CONTACT_EMAIL_TO` — contact form. `CONTACT_EMAIL_FROM` is optional and falls back to Resend's `onboarding@resend.dev` sender.
- `SESSION_SECRET` — signs the admin session cookie (32+ characters). Required for any login.
- `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` — the *starter* admin login, used until the account is saved from `/admin/account` (then the database copy wins) and again if that saved account is deleted. Generate the hash and the secret with `npm run hash-password`.
- `BLOG_DOMAIN` — used by `next.config.mjs` to rewrite `/blog` and `/blog/*` to a separately deployed blog app. The blog is not part of this repo.

## Stack

Next.js 16 (App Router) with React 19, Tailwind CSS v4, Motion (`motion/react`), next-themes, MongoDB driver, Resend, Vercel Analytics. Deployed on Vercel; pushes to `main` deploy to raselrana.com.bd.

Branch workflow: every feature gets its own `feature/<name>` branch, merged into `develop` by PR. `develop` is merged into `main` to release. Do not commit feature work directly on `develop` or `main`.


## Architecture

Everything lives under `src/`, imported through the `@/*` alias (`jsconfig.json`).

### Content is data, pages are composition

Route files live in two places under `src/app/`: the public site in the `(site)/` route group (its `layout.jsx` adds the navbar and footer) and the dashboard in `admin/`. The root `layout.js` holds only `<html>`, fonts, theme and analytics. `not-found.jsx` sits at the root and brings the navbar/footer itself.

Pages follow a three-layer split:

1. **Content** — either a code file in `src/lib/data/<page>.js` (About, Journey, Skills, Education, Contact copy, home "About"/"Focus areas" text, footer link columns) or MongoDB, edited in the dashboard (Achievements, Projects, Publications, Experience, Downloads, and the public profile). See "Dashboard content" below.
2. `src/components/sections/<page>/` — one component per page section. Sections for code-file content import their own data; sections for dashboard content take props.
3. `src/app/(site)/<route>/page.jsx` — thin Server Components that set `metadata` and stack sections (through a `views/` component when the content comes from MongoDB).

Adding a code-file page means adding a data file, a `sections/<page>/` folder and a `page.jsx`, then linking it from `NAV_LINKS` in `src/components/layout/Navbar.jsx` (the mobile menu reuses it) and/or `footerNav` in `src/lib/data/site.js`, and adding the path to `src/app/sitemap.js`.

### Server/client boundary and the `views/` rule

- `src/components/index.js` is a barrel that pages import sections from. It must only export components that are safe for a client bundle.
- Anything that touches MongoDB (or other server-only code) goes in `src/views/`, not `src/components/`, and is imported by direct path. Every dashboard-backed page has one (`views/home/HomeView.jsx`, `views/projects/ProjectsView.jsx`, `views/layout/SiteFooter.jsx`, …): async Server Components that read from Mongo and pass plain data down to section components as props. Putting such a component in the barrel previously leaked the `mongodb` driver into a client bundle and broke the build.
- Section components are Server Components unless they need interactivity. Where Motion is needed, import it as `motion/react`.
- `src/lib/use-is-mounted.js` (`useIsMounted`) is the way to hold back browser-only UI without a hydration mismatch; do not use `setState` in an effect for this.

### Downloads tracking

The documents are a dashboard module (starter content in `src/lib/data/downloads.js`; a document's file address is a `/documents/...` path in `public/` or an `https://` link). A click on `DownloadButton` fires a Vercel Analytics event and a `keepalive` POST to `/api/downloads/track`, which upserts a counter in the `download_stats` collection through `src/lib/services/downloads-service.js`. `/downloads` is `force-dynamic` so counts are read per request. Reads fail soft (empty counts) so the page renders when Mongo is down; tracking errors never block the download itself.

### Dashboard content

`/admin` is a separate app shell (`components/admin/shell/AdminShell.jsx`: sidebar, top bar, toasts) with an overview page, one screen per content module, a public-profile page and an account page.

**Modules.** `src/lib/content/modules.js` is the registry: one module = one MongoDB collection = one screen at `/admin/<key>` (served by `app/admin/(panel)/[module]/page.jsx`). Current modules: `achievements` (six entry types), `projects`, `publications`, `experience` (one document per role; grouped by organization in `views/experience/ExperienceView.jsx`), `downloads`. Every document has a `type`; every type gets a `published` tick box (unticked = hidden from the site).

- Field types and validation live in `src/lib/content/fields.js` (`normalizeFields`). The form (`components/admin/SchemaForm.jsx`) is drawn from the same field list, so adding a field to a type in `modules.js` (or `achievements-schema.js`) is enough for the dashboard; then display it in the section component.
- `src/lib/services/content-service.js` does all reads and writes: `getEntries(key)` for public pages (published only; falls back to starter content when the collection is completely empty or Mongo is unreachable), `getAdminEntries`, `saveEntry`, `deleteEntry`, `importStarter`, `getOverview`. Fields marked `unique` are enforced on save. Module-specific rules (achievements: press follows a renamed/deleted competition, one featured press item) are in `src/lib/content/hooks.js`.
- `src/lib/content/starter.js` maps the `lib/data` files to entries. It feeds both the fallback and the one-time "Import starter content" button (a marker document of type `_import` in each collection records that it ran).
- `modules.js`, `fields.js`, `profile.js` and `achievements-schema.js` are imported by Client Components: plain data only. Server-only pieces (`hooks.js`, `starter.js`, services) must not be imported from them.
- To add a module: register it in `modules.js`, add a starter mapping in `starter.js`, give the sidebar an icon in `AdminShell.jsx`, and read it on the public page with `getEntries()` from a `views/` component.

**Public profile.** One document (`settings` collection, `_id: "site-profile"`), fields in `src/lib/content/profile.js`, read with `getSiteProfile()` (`src/lib/services/site-profile.js`; defaults come from `lib/data/site.js` and `profile` in `lib/data/home.js`). Used by the home hero and contact panel, the footer, and the email/location rows on the Contact page.

**Home page.** `views/home/HomeView.jsx` builds the previews from dashboard content: entries ticked "Show on the home page" (projects, roles, competitions), or the first few when none are ticked.

**Freshness.** Achievements, Projects, Publications, Experience and Downloads pages are `force-dynamic`. Everything else under `(site)` is static with `revalidate = 3600` (set in `(site)/layout.jsx`, because the footer reads the profile). Every save calls `revalidatePath("/", "layout")`, so changes appear immediately.

**Mutations** are Server Actions in `src/app/admin/actions.js`, not API routes.

### Admin authentication

One admin account, no auth library.

- The account is a document in `settings` (`_id: "admin-account"`: email, name, passwordHash, sessionVersion), read through `src/lib/services/admin-account.js`. Until it exists, the account is built from `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH`. Deleting the document restores the environment login (the recovery path for a forgotten password).
- `src/lib/auth/session-token.js` signs and verifies the HMAC cookie (`admin_session`, 7 days, payload `{ sub, v, exp }`) with Web Crypto; it has no database access so `src/proxy.js` can use it. `src/lib/auth/session.js` (`getSession`, `requireAdmin`) additionally requires the token's email and session version to match the account. Changing the password raises the version, ending every other session.
- `src/proxy.js` (the Next 16 replacement for `middleware.js`) redirects requests without a genuine, unexpired cookie to `/admin/login`. It is only the first gate: every admin page and every Server Action except login must call `requireAdmin()`.
- `password.js` hashes and verifies with scrypt; `login-attempts.js` blocks an IP after 5 failures in 15 minutes (also applied to "current password" checks on the account page).
- Pages that need a session go in `src/app/admin/(panel)/`, whose layout checks the session and renders the shell. `/admin/login` sits outside it. Admin components live in `src/components/admin/` and are not exported from the barrel.

### Contact form

`sections/contact/ContactForm.jsx` POSTs to `/api/contact`, which validates input, silently accepts submissions that fill the `company` honeypot field, and sends through `src/services/email.js` (Resend). Visitor input is escaped before it goes into the email HTML; keep it that way when changing the template.

### Security

- Public write endpoints are rate-limited per IP through `src/lib/services/rate-limit.js` (`isRateLimited`, Mongo-backed, fails open): contact form 5 per 10 minutes, download tracking 30 per 10 minutes. Use it for any new public endpoint that writes or sends.
- `/api/downloads/track` only accepts the `key` of a published Downloads entry (`getDownloadKeys()`, cached for a minute).
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

Most `lib/data` files and most dashboard entries still hold sample text (marked "Sample", "EXAMPLE", "TODO", "[Placeholder]" or "20XX"). The dashboard overview lists the dashboard entries that still contain it. `/skills` and `/education` are simple code-file pages linked from the footer, not the navbar.
