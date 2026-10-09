# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Next.js dev server on http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint (flat config, eslint-config-next/core-web-vitals)
npm run create-admin    # sets the admin login from ADMIN_EMAIL + ADMIN_PASSWORD in .env.local (writes the hash, empties the password)
```

There is no test suite and no TypeScript — the project is plain JavaScript/JSX. `npm run lint` and `npm run build` are the only automated checks.

`docs/` holds the owner's developer guide (how the project works, step-by-step recipes, design rules, deployment and troubleshooting). It restates the rules in this file in plain language; when a rule here changes, update the matching page there in the same change.

## Environment

Copy `.env.example` to `.env.local`. All other `.env*` files are gitignored.

- `MONGODB_URI` — required by anything that imports `src/lib/mongodb.js`, which throws at import time if it is missing. `/downloads` and `/api/downloads/track` therefore fail without it.
- `MONGODB_DB` — defaults to `raselrana`.
- `RESEND_API_KEY`, `CONTACT_EMAIL_TO` — contact form. `CONTACT_EMAIL_FROM` is optional and falls back to Resend's `onboarding@resend.dev` sender.
- `SESSION_SECRET` — signs the admin session cookie (32+ characters). Required for any login.
- `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` — the *starter* admin login, used until the account is saved from `/admin/account` (then the database copy wins) and again if that saved account is deleted. To set or reset the login, write `ADMIN_EMAIL` and `ADMIN_PASSWORD` (plain, 10+ characters) in `.env.local` and run `npm run create-admin` (`scripts/create-admin.mjs`): it writes the hash, empties `ADMIN_PASSWORD`, adds `SESSION_SECRET` when there is none, updates the saved database account if one exists (raising its session version), and prints the values for Vercel. `ADMIN_PASSWORD` is read only by that script, never by the site.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — image uploads from the dashboard. Without them the upload buttons report that uploads are not set up; everything else works.
- `BLOG_DOMAIN` — the separately deployed blog app. `next.config.mjs` rewrites `/blog` and `/blog/*` to it, and the home page fetches the latest posts from it. The blog is not part of this repo.

## Stack

Next.js 16 (App Router) with React 19, Tailwind CSS v4, Motion (`motion/react`), next-themes, MongoDB driver, Resend, Vercel Analytics. Deployed on Vercel; pushes to `main` deploy to raselrana.com.bd.

Branch workflow: every feature gets its own `feature/<name>` branch, merged into `develop` by PR. `develop` is merged into `main` to release. Do not commit feature work directly on `develop` or `main`.


## Architecture

Everything lives under `src/`, imported through the `@/*` alias (`jsconfig.json`).

### Content is data, pages are composition

Route files live in two places under `src/app/`: the public site in the `(site)/` route group (its `layout.jsx` adds the navbar and footer) and the dashboard in `admin/`. The root `layout.js` holds only `<html>`, fonts, theme and analytics. `not-found.jsx` sits at the root and brings the navbar/footer itself.

Pages follow a three-layer split:

1. **Content** — almost all of it is in MongoDB, edited in the dashboard: every inner page's entries and heading, and the public profile. See "Dashboard content" below. Still in code files under `src/lib/data/`: the home page's "Profile" paragraph, focus cards and contact-panel wording (`home.js`), the Contact page's channel rows, subjects and form messages (`contact.js`), the footer link columns (`site.js`), About's two buttons (`about.js`), and the navbar links (`Navbar.jsx`). The other `lib/data` files are only starter content and defaults.
2. `src/components/sections/<page>/` — one component per page section. Sections for code-file content import their own data; sections for dashboard content take props.
3. `src/app/(site)/<route>/page.jsx` — thin Server Components that set `metadata` and stack sections (through a `views/` component when the content comes from MongoDB).

A new page should normally be a dashboard module (see "To add a module" below) with a `PAGE_TEXT` entry for its heading. Either way, link it from `NAV_LINKS` in `src/components/layout/Navbar.jsx` (the mobile menu reuses it) and/or `footerNav` in `src/lib/data/site.js`, and adding the path to `src/app/sitemap.js`.

### Server/client boundary and the `views/` rule

- `src/components/index.js` is a barrel that pages import sections from. It must only export components that are safe for a client bundle.
- Anything that touches MongoDB (or other server-only code) goes in `src/views/`, not `src/components/`, and is imported by direct path. Every dashboard-backed page has one (`views/home/HomeView.jsx`, `views/projects/ProjectsView.jsx`, `views/layout/SiteFooter.jsx`, …): async Server Components that read from Mongo and pass plain data down to section components as props. Putting such a component in the barrel previously leaked the `mongodb` driver into a client bundle and broke the build.
- Section components are Server Components unless they need interactivity. Where Motion is needed, import it as `motion/react`.
- `src/lib/use-is-mounted.js` (`useIsMounted`) is the way to hold back browser-only UI without a hydration mismatch; do not use `setState` in an effect for this.

### Downloads tracking

The documents are a dashboard module. No files are stored in the repo (there is no `public/` folder): an entry's file address is an `https://` link to a file hosted elsewhere, usually a Google Drive share link, which `fileLinks()` in `src/lib/file-links.js` turns into Drive's direct-download and viewer addresses. The contact card and the portfolio are the exceptions: both are generated by the site (see "Contact card" and "Portfolio"). "Last updated" is stamped with today's date by the `downloads.beforeSave` hook when an entry is new or its file address changes, unless the date was edited by hand in the same save. A click on `DownloadButton` fires a Vercel Analytics event and a `keepalive` POST to `/api/downloads/track`, which upserts a counter in the `download_stats` collection through `src/lib/services/downloads-service.js`. `/downloads` is `force-dynamic` so counts are read per request. Reads fail soft (empty counts) so the page renders when Mongo is down; tracking errors never block the download itself.

### Dashboard content

`/admin` is a separate app shell (`components/admin/shell/AdminShell.jsx`: sidebar, top bar, toasts) with an overview page, one screen per content module, a public-profile page and an account page.

**Modules.** `src/lib/content/modules.js` is the registry: one module = one MongoDB collection = one screen at `/admin/<key>` (served by `app/admin/(panel)/[module]/page.jsx`). Current modules: `about` (types `principle` and `highlight`), `journey` (`stage`; `body` is one text, split into paragraphs on blank lines by `toParagraphs()` in `src/lib/text.js`), `achievements` (six entry types), `projects`, `skills`, `education`, `publications`, `experience` (one document per role; grouped by organization in `views/experience/ExperienceView.jsx`), `portfolio` (types `summary` and `entry`), `downloads`. Every document has a `type`; every type gets a `published` tick box (unticked = hidden from the site).

- Field types and validation live in `src/lib/content/fields.js` (`normalizeFields`). The form (`components/admin/SchemaForm.jsx`) is drawn from the same field list, so adding a field to a type in `modules.js` (or `achievements-schema.js`) is enough for the dashboard; then display it in the section component.
- `src/lib/services/content-service.js` does all reads and writes: `getEntries(key)` for public pages (published only; falls back to starter content when the collection is completely empty or Mongo is unreachable), `getAdminEntries`, `saveEntry`, `deleteEntry`, `importStarter`, `getOverview`. Fields marked `unique` are enforced on save. Module-specific rules (achievements: press follows a renamed/deleted competition, one featured press item) are in `src/lib/content/hooks.js`.
- `src/lib/content/starter.js` maps the `lib/data` files to entries. It feeds both the fallback and the one-time "Import starter content" button (a marker document of type `_import` in each collection records that it ran).
- `modules.js`, `fields.js`, `profile.js` and `achievements-schema.js` are imported by Client Components: plain data only. Server-only pieces (`hooks.js`, `starter.js`, services) must not be imported from them.
- To add a module: register it in `modules.js`, add a starter mapping in `starter.js`, give the sidebar an icon in `AdminShell.jsx`, and read it on the public page with `getEntries()` from a `views/` component.

**Page text.** The one-off wording of each page (small label, heading, intro; About also has its story and section headings) is separate from its entries. `src/lib/content/page-text.js` (`PAGE_TEXT`, client-safe) lists the fields per page; `src/lib/content/page-defaults.js` holds the starting values taken from `lib/data`; `getPageText(key)` in `src/lib/services/page-text.js` returns saved values over defaults (one `settings` document per page, `_id: "page-<key>"`) and never throws. Pages render it with `views/layout/PageHeading.jsx`. In the dashboard it is the fold-out "Page heading and text" card at the top of the page's module screen (`app/admin/(panel)/[module]/page.jsx`), saved by `savePageTextAction`; Contact, which has no entries, has its own screen at `/admin/contact-page`; its page text also carries the `responseTime` shown on the page. To make another page's text editable: add it to `PAGE_TEXT` and `PAGE_DEFAULTS`, then use `<PageHeading page="…" />`.

**Public profile.** One document (`settings` collection, `_id: "site-profile"`), fields in `src/lib/content/profile.js`, read with `getSiteProfile()` (`src/lib/services/site-profile.js`; defaults come from `lib/data/site.js` and `profile` in `lib/data/home.js`). Used by the home hero and contact panel, the footer, and the email/location rows on the Contact page.

**Images (Cloudinary).** Field types `image` (one photo) and `gallery` (photos with captions) in `fields.js` store `{ url, publicId, width, height }` objects. In the dashboard, `components/admin/ImageInputs.jsx` asks the server for a signature (`getUploadSignatureAction` → `src/lib/cloudinary.js`, which holds the secret and fixes the folder to `raselrana-web` and the formats to jpg/png/webp/avif) and then POSTs the file straight from the browser to Cloudinary, so files never pass through Vercel. On save, `cleanImage()` in `src/lib/cloudinary-url.js` accepts only `https://res.cloudinary.com/.../image/upload/...` addresses. Display with `ui/CloudImage` (next/image with a Cloudinary loader that adds `f_auto,q_auto` and a width), never a bare `<img>`. Currently used for the portrait (`photo` in the public profile → About page, falling back to `src/assets/Rasel_profile_photo.jpg`) and for `cover` + `gallery` on competitions, judging and sports entries. Removing or replacing a photo in the dashboard does not delete it from Cloudinary.

**Contact card.** `GET /contact-card.vcf` (`app/contact-card.vcf/route.js`) generates the vCard from the public profile with `src/lib/vcard.js`; the profile's optional `phone` is used only there. On the Downloads page a `.vcf` entry gets a "Preview & QR code" dialog (`sections/downloads/ContactCardPreview.jsx`) instead of an open-in-tab link: details plus a QR code of the same vCard, drawn server-side by `src/lib/qr.js` (the `qrcode` package). Only files a browser can display (PDF, images, Drive links) get the plain "Preview" link. The card's "Updated" date on the page is the profile's last-saved date. `/documents/Rasel_Rana.vcf` (the old static file) redirects to `/contact-card.vcf` in `next.config.mjs`.

**Portfolio.** Written in the `portfolio` module, independent of the other pages. `buildPortfolio()` in `src/lib/portfolio.js` shapes it (header from the public profile, summary blocks, entries grouped by their `section` text) for both outputs, so they cannot differ: the page `/portfolio` (`views/portfolio/PortfolioView.jsx` → `sections/portfolio/PortfolioDocument.jsx`) and the PDF `GET /portfolio.pdf` (`app/portfolio.pdf/route.js` renders `src/lib/pdf/PortfolioPdf.jsx` with `@react-pdf/renderer`, which must stay in `serverExternalPackages`). The PDF uses built-in Helvetica (Latin text only; no Bangla), is rate-limited, and has no page numbers because the library's `render` prop produced no text in this setup. A Downloads entry whose address is `/portfolio.pdf` (or the old `/documents/Rasel_Rana_Portfolio.pdf`, which redirects) downloads the PDF, previews `/portfolio`, and takes its "Updated" date from the newest portfolio entry.

**Home page.** `views/home/HomeView.jsx` builds the previews from dashboard content: entries ticked "Show on the home page" (projects, roles, competitions), or the first few when none are ticked.

**Blog (another app).** The blog is a separate project and zone served at `/blog`. Three things here touch it: (1) `getLatestPosts()` in `src/lib/services/blog-posts.js` fetches `${BLOG_DOMAIN}/blog/api/posts?limit=3` for the home page's "Latest writing" section (`sections/homepage/LatestWriting.jsx`); it validates every field (the link comes from the post's `url` and must be a `/blog/…` address; the card label is the category name, else the content-type label; the date is the day in `Asia/Dhaka`), keeps the answer for 10 minutes, and returns `[]` on any failure so the section just disappears; (2) links into the blog must be plain `<a>` tags, not `next/link` — `isBlogLink()` in `src/lib/zones.js` is used by the navbar, mobile menu, footer and `SectionHeader`; (3) `@view-transition { navigation: auto; }` in `globals.css` cross-fades full page loads between the two apps. `docs/blog-design-brief.md` is the hand-over document for the blog project: the design tokens to copy, the page specs, and the API contract the home page depends on. Keep it in step with `globals.css` and `blog-posts.js`.

**Freshness.** Every dashboard-backed inner page (About, Journey, Skills, Education, Achievements, Projects, Publications, Experience, Portfolio, Downloads) is `force-dynamic`. Everything else under `(site)` is static with `revalidate = 3600` (set in `(site)/layout.jsx`, because the footer reads the profile). Every save calls `revalidatePath("/", "layout")`, so changes appear immediately.

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
- Motion is CSS-only (defined in `globals.css`): `.rise` fades content in on load (stagger with `style={{ "--delay": "80ms" }}`), `.reveal` fades it in on scroll where the browser supports scroll-driven animations, and `.net-*` drives the hero `ui/NetworkMap`. Never hide content pending JavaScript (no `motion` with `initial={{ opacity: 0 }}` for entrance effects) — pages must be readable in the server HTML. An element with `.rise` or `.reveal` is transformed, so a `position: fixed` child is positioned against it instead of the screen: render dialogs and overlays into `document.body` with `createPortal` (see `sections/downloads/ContactCardPreview.jsx`, `layout/MobileMenu.jsx`). `motion` is still used for interactive pieces (navbar indicator, mobile menu, journey side nav, form feedback).

### SEO

`src/app/layout.js` sets `metadataBase` and site-wide Open Graph/Twitter defaults from `siteInfo` in `lib/data/site.js`. `src/app/sitemap.js` lists the public paths by hand (add new pages there) and `src/app/robots.js` blocks `/admin` and `/api`. Pages set their own `title` and `description`; they do not set per-page Open Graph values yet.

### Still sample content

Most starter content and most dashboard entries still hold sample text (marked "Sample", "EXAMPLE", "TODO", "[Placeholder]" or "20XX"). The dashboard overview lists the dashboard entries that still contain it. Skills, Education, Projects, Publications and Portfolio are linked from the footer, not the navbar.
