# Developer Guide

This guide explains how the website is built, so that you can come back after a long break and change the code with confidence.

Read the pages in this order the first time. Later, jump straight to the one you need.

| Page | Read it when |
| --- | --- |
| [1. Getting started](01-getting-started.md) | You want to run the project on your computer again |
| [2. How the project works](02-how-it-works.md) | You want to understand the structure before changing anything |
| [3. How to… (recipes)](03-how-to.md) | You know what you want to change and need the steps |
| [4. Design rules](04-design-rules.md) | You are building or restyling something visual |
| [5. Deploy and maintain](05-deploy-and-maintain.md) | You want to publish, update packages, or fix a problem |

## The project in one minute

- It is a **Next.js** website (JavaScript, no TypeScript), styled with **Tailwind CSS**.
- Almost all text lives in plain files under `src/lib/data/`. To change what a page says, you edit one of those files.
- The **Achievements** page is different: its content is in **MongoDB** and you edit it from the admin panel at `/admin`.
- The site is hosted on **Vercel**. Merging into the `main` branch publishes it.

## Three rules that prevent most mistakes

1. **Text goes in `src/lib/data/`, not inside components.** Components only decide how things look.
2. **Code that talks to the database must never be imported by a browser component.** Keep it in `src/lib/services/` and `src/views/`. (Page 2 explains why.)
3. **Never hide content until JavaScript runs.** Use the CSS classes `rise` and `reveal` for entrance animations. (Page 4 explains why.)

## Other documents

- `README.md` in the project root — the short public description.
- `CLAUDE.md` in the project root — a compact technical summary for AI coding assistants. It covers the same rules as this guide in fewer words. If you change a rule, update both.
