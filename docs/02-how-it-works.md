# 2. How the project works

[← Back to the guide index](README.md)

## The folder map

```
raselrana-web/
├── public/documents/        Files visitors download (portfolio PDF, contact card)
├── scripts/                 hash-password.mjs (creates admin password values)
├── next.config.mjs          Security headers and the /blog redirect
└── src/
    ├── proxy.js             Guards /admin: sends signed-out visitors to the login page
    ├── assets/              Images imported by code (your portrait)
    ├── app/                 ROUTES. Each folder is a web address
    │   ├── layout.js        The frame around every page: fonts, navbar, footer, theme
    │   ├── globals.css      Colours, font names, animations
    │   ├── page.jsx         The home page  (/)
    │   ├── about/page.jsx   The about page (/about) … and so on for each page
    │   ├── admin/           Login page, dashboard, and the actions that save data
    │   ├── api/             Small server endpoints: contact form, download counter
    │   ├── sitemap.js       List of pages for search engines
    │   └── robots.js        Tells search engines to stay out of /admin and /api
    ├── components/
    │   ├── layout/          Navbar, mobile menu, footer
    │   ├── sections/        The building blocks of each page, one folder per page
    │   ├── admin/           The dashboard screens
    │   ├── theme/           Light/dark mode
    │   ├── ui/              Shared pieces: logo, page header, section header, network map
    │   └── index.js         One file that re-exports many section components
    ├── lib/
    │   ├── data/            ALL PAGE TEXT lives here, one file per page
    │   ├── services/        Code that reads and writes MongoDB
    │   ├── auth/            Admin login: password check, session cookie
    │   ├── achievements-schema.js   The list of fields each achievement type has
    │   └── mongodb.js       The single database connection
    ├── services/email.js    Sends the contact email through Resend
    └── views/               Page parts that must read the database before showing
```

Imports use `@/` as a short name for `src/`. So `@/lib/data/home` means `src/lib/data/home.js`.

## How a normal page is built (three layers)

Take the About page as the example.

```
src/lib/data/about.js                 1. DATA   — the words
        ↓ imported by
src/components/sections/about/*.jsx   2. SECTIONS — how each part looks
        ↓ stacked by
src/app/about/page.jsx                3. PAGE   — the order of the parts + browser title
```

1. **Data.** `about.js` exports plain objects such as `aboutHero` and `aboutStory`. No design here, only content.
2. **Sections.** Each file in `sections/about/` imports its own data and returns the HTML for one part of the page, for example `AboutStory.jsx`.
3. **Page.** `app/about/page.jsx` is short. It sets the browser tab title (`metadata`) and lists the sections in order.

Because of this split, changing text never requires touching design code, and changing design never risks deleting text.

`app/layout.js` wraps every page with the navbar and footer, so pages do not include them.

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

The rule: any component that reads the database lives in `src/views/` and is imported by its full path. `views/downloads/DownloadsView.jsx` and `views/achievements/AchievementsView.jsx` are the two examples. They read the data, then pass it as plain props to ordinary section components.

## How the Achievements page works

Achievements are stored in MongoDB so you can edit them from the browser.

```
Browser asks for /achievements
        ↓
app/achievements/page.jsx
        ↓
views/achievements/AchievementsView.jsx          reads the data
        ↓ calls
lib/services/achievements-service.js             getAchievementsData()
        ↓ reads
MongoDB collection "achievements"
        ↓ returns grouped data
AchievementsView passes it as props to the section components
(AchievementsCompetitions, AchievementsLeadership, …)
```

Things to know:

- **One collection, many types.** Every item is one document with a `type`: `competition`, `judging`, `sports`, `leadership`, `press`, or `affiliation`.
- **The fields of each type** are defined once in `lib/achievements-schema.js`. The admin form is drawn from that file, and the same file checks the data before saving. That is why the form and the checks can never disagree.
- **Fallback.** `lib/data/achievements.js` holds starter content. The public page uses it only if the database is completely empty or cannot be reached.
- **Always fresh.** The page has `export const dynamic = "force-dynamic"`, which means it is built on every visit, so your edits appear immediately.
- **Detail pages.** `/achievements/<slug>` shows one competition, judging entry, or sports entry. A slug is the short name in the address, such as `robolution-2016`. Slugs must be unique across those three types.

## How the admin panel works

### Signing in

```
/admin/login  →  LoginForm.jsx  →  loginAction() in app/admin/actions.js
                                      1. Too many failed tries from this address? → stop
                                      2. Email matches ADMIN_EMAIL?
                                      3. Password matches ADMIN_PASSWORD_HASH?
                                      4. Yes → create a signed cookie "admin_session" (7 days)
                                      5. Go to /admin/achievements
```

There is one admin account, and its details come from `.env.local`. No user table exists in the database.

### Staying protected (two gates)

1. `src/proxy.js` runs before any `/admin` page. No valid cookie → redirect to the login page.
2. Every admin page and every save/delete action also calls `requireAdmin()` itself.

The second gate matters. Save and delete actions are reachable directly from the internet, so each one must check the login on its own. **Any new admin action must start with `await requireAdmin();`.**

### Saving a change

```
You press Save in the dashboard
        ↓
AchievementForm.jsx sends the form to saveAchievementAction()   (app/admin/actions.js)
        ↓ 1. requireAdmin()
        ↓ 2. normalizeAchievement()  checks and cleans the fields  (achievements-schema.js)
        ↓ 3. saveAchievement()       writes to MongoDB              (achievements-service.js)
        ↓ 4. revalidatePath()        tells Next.js the pages changed
The list refreshes with the new data
```

These functions in `actions.js` are called **Server Actions**: functions that run on the server but can be called from a form. The admin panel uses them instead of API routes.

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
               1. Is this id in lib/data/downloads.js? If not, reject
               2. Rate limit: 30 per 10 minutes per visitor
               3. Add 1 to the counter in the "download_stats" collection
```

If counting fails, the download still works. The Downloads page reads the counts from the database on every visit.

## Database collections

| Collection | Holds | Written by |
| --- | --- | --- |
| `achievements` | Every achievement item, plus one marker of type `_import` | Admin panel |
| `download_stats` | One counter per document | Download button |
| `login_attempts` | Failed sign-in tries (deleted automatically after 15 minutes) | Login |
| `rate_limits` | Recent contact and download requests (deleted automatically after 1 hour) | Contact form, download counter |

## The blog

`/blog` is not part of this project. `next.config.mjs` forwards `/blog` and everything under it to another app, whose address is in `BLOG_DOMAIN`.

Next: [3. How to… (recipes) →](03-how-to.md)
