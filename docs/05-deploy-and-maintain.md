# 5. Deploy and maintain

[← Back to the guide index](README.md)

## Publishing

The site is hosted on Vercel, connected to the GitHub repository.

| When you push or merge to… | Vercel does this |
| --- | --- |
| a `feature/...` branch or `develop` | Builds a **preview** at a temporary address, for checking |
| `main` | Builds and publishes the **live site** at raselrana.com.bd |

To publish: merge your feature branch into `develop`, check the preview, then merge `develop` into `main`.

### Before merging into `main`

1. `npm run lint` reports no problems.
2. `npm run build` finishes without errors.
3. You looked at the changed pages in light mode, dark mode, and at phone width.
4. `npm audit --omit=dev` reports no vulnerabilities.

### After publishing

- Open the live site and the pages you changed.
- If you touched the contact form, send one test message.
- If you touched the admin panel, sign in once.

## Settings in Vercel

Vercel does not read your `.env.local`. Every value must also be entered in Vercel:

**Project → Settings → Environment Variables**

- Add all the names listed in [Getting started](01-getting-started.md#the-settings-file-envlocal).
- Tick both **Production** and **Preview**.
- Paste values without quotation marks.
- A changed value only applies to new builds. After changing one, redeploy.

## Keeping packages up to date

Every few months, and whenever GitHub or `npm` warns you:

```bash
npm audit --omit=dev      # security problems in what the site ships
npm outdated              # what has newer versions
```

- Fix what is safe: `npm audit fix`.
- Next.js is fixed to an exact version in `package.json`. To update it, install the new version of both packages together:
  ```bash
  npm install next@<version> eslint-config-next@<version> --save-exact
  ```
- After any update, run `npm run lint` and `npm run build`, and click through the site.

A plain `npm audit` (without `--omit=dev`) may still list a few findings in the code-checking tools. Those are used only on your computer and are never published.

## Security rules to keep

These are already in place. Keep them when you change related code.

- **Secrets stay out of the code.** Keys and passwords belong only in `.env.local` and in Vercel.
- **Admin actions check the login.** Every function in `app/admin/actions.js` except the login starts with `await requireAdmin();`.
- **Passwords are never stored readable.** Only a scrambled (hashed) form is saved, in the database or in the settings.
- **Public endpoints are limited.** Anything a visitor can call that saves or sends uses `isRateLimited()` from `lib/services/rate-limit.js`.
- **Check all input on the server.** Never trust what the browser sends, even from your own form.
- **Escape visitor text in emails.** See `escapeHtml` in `services/email.js`.
- **Security headers** are set in `next.config.mjs` for every page.

## Troubleshooting

| What you see | Likely cause | Fix |
| --- | --- | --- |
| "Admin login is not configured on the server yet." | `SESSION_SECRET` is missing, or there is no saved account and no starter login (`ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`) where the site is running | Add them to `.env.local` and restart, or add them in Vercel and redeploy |
| "Incorrect email or password" but you are sure | After you save your account in the dashboard, the starter login in the settings no longer works; only the dashboard email and password do | Use the dashboard login. If it is lost, see "I forgot my admin password" below |
| You were signed out on your phone after changing the password on your computer | Changing the password signs out every other device | Sign in again with the new password |
| "Too many failed attempts" | Five wrong tries from your address | Wait 15 minutes |
| Error starting with `Missing MONGODB_URI` | The database address is not set | Add `MONGODB_URI` to `.env.local` and restart |
| Build fails mentioning `mongodb`, `net`, `tls` or `dns` cannot be resolved | A browser component imports database code, directly or through `components/index.js` | Move the database-reading component to `src/views/` and import it by its full path |
| A dashboard-backed page shows the starter content | Its collection is empty or the database is unreachable, so the fallback is used | Check `MONGODB_URI`; sign in to `/admin` and import or add entries |
| An entry is in the dashboard but not on the site | "Published" is unticked (it shows a Draft badge) | Edit the entry and tick Published |
| A new download is not being counted | Its ID was changed, or it is a draft | Keep the ID stable and tick Published |
| A download opens a Google "You need access" page | The Drive file is not shared publicly | In Drive, set the file's General access to "Anyone with the link" |
| The "Updated" date on a download is old although you replaced the file | The file was replaced in Drive behind the same link, which the site cannot detect | Edit the entry and set Last updated |
| An edit in the admin panel does not appear on the public page | The page is not marked as always fresh | Make sure the page has `export const dynamic = "force-dynamic";` |
| Part of a page is blank until it "pops in" | An entrance animation hides content until JavaScript runs | Use the `rise` or `reveal` class instead of Motion's `initial={{ opacity: 0 }}` |
| Headings appear in the wrong font | The font class is misspelled, or the `@theme` block in `globals.css` was changed | Use `font-display`, `font-body` or `font-mono`; restore the `@theme` block |
| A colour looks wrong in dark mode only | A fixed Tailwind colour was used | Replace it with a variable such as `text-[var(--ink)]` |
| Console warning about "hydration mismatch" | A component shows something different on the server and in the browser (theme, date, random value) | Wait for the browser with `useIsMounted()` |
| Contact form says "Too many messages" | Five messages from your address within 10 minutes | Wait a few minutes |
| Contact form says "Email is not configured" | `RESEND_API_KEY` is missing | Add it, then restart or redeploy |
| Contact form reports success but no email arrives | Wrong `CONTACT_EMAIL_TO`, or the sender domain is not verified in Resend | Check the value; look at the logs in the Resend dashboard; check your spam folder |
| `/blog` shows an error | `BLOG_DOMAIN` is missing or the blog app is down | Check the value and the blog app |
| Lint error "Calling setState synchronously within an effect" | `useState` + `useEffect` used to detect the browser | Use `useIsMounted()` from `lib/use-is-mounted.js` |

### I forgot my admin password

You cannot read the old password back, but you can return to the starter login:

1. Open **MongoDB Atlas** → your cluster → **Browse Collections** → your database → the `settings` collection.
2. Delete the document whose `_id` is `admin-account`. (Leave `site-profile` alone.)
3. The site now accepts the starter login again: the `ADMIN_EMAIL` and the password behind `ADMIN_PASSWORD_HASH` in Vercel. If you have forgotten that one too, run `npm run hash-password`, put the new `ADMIN_PASSWORD_HASH` in Vercel, and redeploy.
4. Sign in and set a new password in the dashboard under Account.

### Where to look when something fails on the live site

- **Vercel → your project → Deployments**: build errors.
- **Vercel → your project → Logs**: errors while the site runs. The code writes clear messages there, for example `[api/contact] sendContactEmail failed`.
- **Resend dashboard**: whether an email was accepted and delivered.
- **MongoDB Atlas**: whether the database is running and reachable.

## Keeping this guide useful

When you change how something works, update the page here that describes it, and the matching part of `CLAUDE.md`, in the same pull request. A guide that is a little out of date is worse than a short one that is correct.
