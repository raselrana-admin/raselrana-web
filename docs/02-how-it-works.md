# 2. How the project works

[← Back to the guide index](README.md)

## The folder map

```
raselrana-web/
├── public/documents/        Files visitors download (portfolio PDF, contact card)
├── scripts/                 hash-password.mjs (creates the starter admin password values)
├── next.config.mjs          Security headers and the /blog redirect
└── src/
    ├── proxy.js             Guards /admin: sends signed-out visitors to the login page
    ├── assets/              Images imported by code (your portrait)
    ├── app/                 ROUTES. Each folder is a web address
    │   ├── layout.js        The outer frame of everything: fonts, theme, analytics
    │   ├── globals.css      Colours, font names, animations
    │   ├── (site)/          THE PUBLIC SITE. The brackets mean "group only":
    │   │   │                the folder name is not part of the address
    │   │   ├── layout.jsx   Adds the navbar and footer around every public page
    │   │   ├── page.jsx     The home page  (/)
    │   │   └── about/page.jsx   The about page (/about) … and so on
    │   ├── admin/           THE DASHBOARD
    │   │   ├── login/       The sign-in page
    │   │   ├── (panel)/     Every page that needs you to be signed in
    │   │   └── actions.js   The functions that save, delete and sign in
    │   ├── api/             Small server endpoints: contact form, download counter
    │   ├── not-found.jsx    The "page not found" page
    │   ├── sitemap.js       List of pages for search engines
    │   └── robots.js        Tells search engines to stay out of /admin and /api
    ├── components/
    │   ├── layout/          Navbar, mobile menu, footer
    │   ├── sections/        The building blocks of each page, one folder per page
    │   ├── admin/           The dashboard screens (shell/, forms, lists)
    │   ├── theme/           Light/dark mode
    │   ├── ui/              Shared pieces: logo, page header, section header, network map
    │   └── index.js         One file that re-exports many section components
    ├── lib/
    │   ├── data/            Text kept in code, one file per page (also the
    │   │                    starter content for the dashboard)
    │   ├── content/         THE DASHBOARD'S RULE BOOK: which content exists,
    │   │                    which fields each has, how they are checked
    │   ├── services/        Code that reads and writes MongoDB
    │   ├── auth/            Admin login: password check, session cookie
    │   ├── achievements-schema.js   The fields of each achievement type
    │   └── mongodb.js       The single database connection
    ├── services/email.js    Sends the contact email through Resend
    └── views/               Page parts that must read the database before showing
```

Imports use `@/` as a short name for `src/`. So `@/lib/data/home` means `src/lib/data/home.js`.

## Where content lives

| Content | Where | How you change it |
| --- | --- | --- |
| Achievements, Projects, Publications, Experience, Downloads | MongoDB | Dashboard: `/admin/<name>` |
| Your public profile: name, role, organization, tagline, focus tags, location, contact email, social links | MongoDB | Dashboard: `/admin/profile` |
| Home page previews (featured projects, roles, competitions) | Taken from the entries above | Tick "Show on the home page" on an entry |
| About, Journey, Skills, Education, Contact page text, home "Profile" and "What I work on" text, footer page links | Files in `src/lib/data/` | Edit the file, commit, publish |

## How a code-file page is built (three layers)

Take the About page as the example. (Pages whose content comes from the dashboard are explained further down.)

```
src/lib/data/about.js                 1. DATA   — the words
        ↓ imported by
src/components/sections/about/*.jsx   2. SECTIONS — how each part looks
        ↓ stacked by
src/app/(site)/about/page.jsx         3. PAGE   — the order of the parts + browser title
```

1. **Data.** `about.js` exports plain objects such as `aboutHero` and `aboutStory`. No design here, only content.
2. **Sections.** Each file in `sections/about/` imports its own data and returns the HTML for one part of the page, for example `AboutStory.jsx`.
3. **Page.** `app/(site)/about/page.jsx` is short. It sets the browser tab title (`metadata`) and lists the sections in order.

Because of this split, changing text never requires touching design code, and changing design never risks deleting text.

`app/(site)/layout.jsx` wraps every public page with the navbar and footer, so pages do not include them. The dashboard has its own layout and never shows them.

## Server components and client components

Next.js runs components in two places:

- **Server components** (the default) run on the server and send ready HTML to the browser. They can read the database. They cannot use `useState`, `onClick`, or other browser features.
- **Client components** start with the line `"use client"`. They also run in the browser, so they can react to clicks and typing. They must never import database code.

In this project most components are server components. These are the client ones, because they need interaction:

- `layout/Navbar.jsx`, `layout/MobileMenu.jsx` — menu open/close, active link
- `theme/ThemeToggle.jsx`, `theme/ThemeProvider.jsx` — light/dark switch
- `sections/contact/ContactForm.jsx` — the form
- `sections/journey/JourneyNav.jsx` — the side menu that follows your scrolling
- `ui/DownloadButton.jsx` — counts the download on click
- everything in `components/admin/`

### Why `src/views/` exists (important)

`components/index.js` re-exports many components so pages can import them in one line. Client components import from it too. If a component that uses the database were exported there, the database driver would be pulled into the browser code and **the build would fail**. This happened once.

The rule: any component that reads the database lives in `src/views/` and is imported by its full path. Every dashboard-backed page has one, for example `views/projects/ProjectsView.jsx` and `views/home/HomeView.jsx`. They read the data, then pass it as plain props to ordinary section components.

## How dashboard content works

Achievements, Projects, Publications, Experience and Downloads all work the same way. Each one is a **module**.

### The rule book: `src/lib/content/`

| File | What it holds |
| --- | --- |
| `modules.js` | The list of modules. For each: its name, its MongoDB collection, and the **fields** of each entry type |
| `fields.js` | The kinds of field (text, date, list, links, …) and the code that checks and cleans what you typed |
| `profile.js` | The fields of the public profile |
| `starter.js` | Turns the `lib/data` files into ready-made entries (the starter content) |
| `hooks.js` | Extra rules that only one module needs |

The dashboard form is **drawn from the field list**, and the same list is used to **check** the data before saving. That is why the form and the checks can never disagree, and why adding a field needs no form code.

A module has one or more *entry types*. Achievements has six (competition, judging, sports, leadership, press, membership). The others have one. Every saved entry records its type in a `type` field.

### Reading: a visitor opens `/projects`

```
app/(site)/projects/page.jsx
        ↓
views/projects/ProjectsView.jsx                  reads the data
        ↓ calls
lib/services/content-service.js                  getEntries("projects")
        ↓ reads
MongoDB collection "projects"   → only entries with Published ticked, sorted
        ↓
ProjectsView passes them as props to sections/projects/ProjectsList.jsx
```

- **Fallback.** If a collection is completely empty, or the database cannot be reached, `getEntries` returns the starter content, so the page never breaks.
- **Published.** Every entry has a "Published" tick box. Unticked entries are drafts: kept in the dashboard, hidden from the site.
- **Always fresh.** These pages have `export const dynamic = "force-dynamic"`, so they are built on every visit.
- **Achievement detail pages.** `/achievements/<slug>` shows one competition, judging entry or sports entry. A slug is the short name in the address, such as `robolution-2016`. Slugs must be unique.
- **Experience.** Each role is saved on its own. The page groups roles that have exactly the same organization name.

### Writing: you press Save in the dashboard

```
components/admin/SchemaForm.jsx sends the form to saveEntryAction()   (app/admin/actions.js)
        ↓ 1. requireAdmin()        are you signed in?
        ↓ 2. normalizeFields()     check and clean every field        (lib/content/fields.js)
        ↓ 3. saveEntry()           write to MongoDB                   (content-service.js)
        ↓ 4. revalidatePath()      tell Next.js the site changed
The list refreshes and a "Saved" message appears
```

These functions in `actions.js` are called **Server Actions**: functions that run on the server but can be called from a form. The dashboard uses them instead of API routes.

### The home page

`views/home/HomeView.jsx` gathers the home page. The featured projects, roles and competitions are the entries where you ticked **"Show on the home page"**. If nothing is ticked, the first few are shown, so a section is never empty.

### The public profile

Your name, role, organization, tagline, focus tags, location, contact email and social links are one saved document, edited at `/admin/profile` and read with `getSiteProfile()`. It feeds the home page hero, the footer and the Contact page. Until you save it for the first time, the values come from `lib/data/site.js` and `lib/data/home.js`.

Because the footer is on every page, saving the profile refreshes the whole site.

## How the admin panel works

### The screens

| Address | What it is |
| --- | --- |
| `/admin/login` | Sign in |
| `/admin` | Overview: counts, recent edits, and a list of entries that still contain sample text |
| `/admin/achievements`, `/projects`, `/publications`, `/experience`, `/downloads` | One list-and-form screen per module, all served by the single file `app/admin/(panel)/[module]/page.jsx` |
| `/admin/profile` | Your public profile |
| `/admin/account` | Your display name, login email and password |

The sidebar, top bar and pop-up messages come from `components/admin/shell/AdminShell.jsx`.

### Your account

There is one admin account. It is stored in the database (collection `settings`, document `admin-account`) with your email, name and a scrambled password.

The very first time, no account is saved yet, so the site uses the **starter login** from `.env.local` (`ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`). As soon as you save your account or change your password in the dashboard, the database copy is used and the starter values are ignored.

### Signing in

```
/admin/login  →  LoginForm.jsx  →  loginAction() in app/admin/actions.js
                                      1. Too many failed tries from this address? → stop
                                      2. Email matches the account?
                                      3. Password matches the account's scrambled password?
                                      4. Yes → create a signed cookie "admin_session" (7 days)
                                      5. Go to /admin
```

### Staying protected (two gates)

1. `src/proxy.js` runs before any `/admin` page. No genuine, unexpired cookie → redirect to the login page.
2. Every admin page and every save/delete action also calls `requireAdmin()` itself, which checks the cookie against the account in the database.

The second gate matters. Save and delete actions are reachable directly from the internet, so each one must check the login on its own. **Any new admin action must start with `await requireAdmin();`.**

### Changing the password

The cookie carries a *session version* number, and the account stores the current one. Changing your password raises the number, so every cookie issued before the change stops working. That signs you out everywhere else. The browser you used gets a fresh cookie and stays signed in.

## How the contact form works

```
ContactForm.jsx  →  POST /api/contact   (app/api/contact/route.js)
                       1. Hidden "company" field filled? It is a bot → pretend success, send nothing
                       2. Check the fields (types, email shape, length)
                       3. Rate limit: 5 messages per 10 minutes per visitor
                       4. sendContactEmail()   (services/email.js) → Resend → your inbox
```

The visitor's text is **escaped** before it goes into the email. Escaping turns characters such as `<` into harmless text, so nobody can inject links or images into the email you open. Keep this if you ever change the email layout.

## How download counting works

```
Visitor clicks Download  →  DownloadButton.jsx
        ├─ the file downloads normally
        ├─ sends an event to Vercel Analytics
        └─ POST /api/downloads/track
               1. Is this the ID of a published Downloads entry? If not, reject
               2. Rate limit: 30 per 10 minutes per visitor
               3. Add 1 to the counter in the "download_stats" collection
```

If counting fails, the download still works. The Downloads page reads the counts from the database on every visit.

## Database collections

| Collection | Holds | Written by |
| --- | --- | --- |
| `achievements`, `projects`, `publications`, `experience`, `downloads` | The entries of each module, plus one marker of type `_import` once the starter content has been imported | Dashboard |
| `settings` | Two documents: `site-profile` (public profile) and `admin-account` (your login) | Dashboard |
| `download_stats` | One counter per document | Download button |
| `login_attempts` | Failed sign-in tries (deleted automatically after 15 minutes) | Login |
| `rate_limits` | Recent contact and download requests (deleted automatically after 1 hour) | Contact form, download counter |

## The blog

`/blog` is not part of this project. `next.config.mjs` forwards `/blog` and everything under it to another app, whose address is in `BLOG_DOMAIN`.

Next: [3. How to… (recipes) →](03-how-to.md)
