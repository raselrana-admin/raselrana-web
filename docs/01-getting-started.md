# 1. Getting started

[← Back to the guide index](README.md)

## What you need installed

- **Node.js** version 20.9 or newer (`node -v` shows your version)
- **Git**
- A code editor (VS Code is what this project was built in)

## Run the site on your computer

```bash
npm install        # only needed the first time, or after package changes
npm run dev        # starts the site at http://localhost:3000
```

The page reloads by itself when you save a file.

## The settings file: `.env.local`

Secret values (passwords, keys) are not stored in the code. They live in a file named `.env.local` in the project root. This file is never uploaded to GitHub.

If the file is missing, copy `.env.example` to `.env.local` and fill in the values:

| Name | What it is | What breaks without it |
| --- | --- | --- |
| `MONGODB_URI` | Connection string for the MongoDB database | Downloads page, achievements from the database, admin panel, rate limits |
| `MONGODB_DB` | Database name. Default is `raselrana` | Nothing (the default is used) |
| `RESEND_API_KEY` | Key for the Resend email service | The contact form cannot send |
| `CONTACT_EMAIL_TO` | The inbox that receives contact messages | The contact form cannot send |
| `CONTACT_EMAIL_FROM` | Optional sender address on a domain verified in Resend | Nothing (a Resend test sender is used) |
| `SESSION_SECRET` | A random secret that signs the login cookie | Nobody can sign in |
| `ADMIN_EMAIL` | The **starter** email for signing in to `/admin` | Nobody can sign in the first time |
| `ADMIN_PASSWORD_HASH` | A scrambled form of the **starter** password | Nobody can sign in the first time |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary account name | Photos cannot be uploaded from the dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Photos cannot be uploaded from the dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret. Keep it private | Photos cannot be uploaded from the dashboard |
| `BLOG_DOMAIN` | Address of the separate blog app | The `/blog` link does not work |

After changing `.env.local`, stop and restart `npm run dev`.

### Finding the Cloudinary values

Sign in to Cloudinary → **Settings** (the gear) → **API Keys**. The page shows the cloud name, the API key and (after you click to reveal it) the API secret. Copy the three into `.env.local` and into Vercel. Photos already uploaded keep showing even without these values; they are only needed for uploading new ones.

### Creating the admin password values

Write the email and the password you want in `.env.local` (at least 10 characters for the password):

```
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=your-password
```

Then run:

```bash
npm run create-admin
```

The command turns the password into `ADMIN_PASSWORD_HASH=...` in `.env.local`, replacing the old line, and **empties `ADMIN_PASSWORD`** so the plain password does not stay in the file. It adds `SESSION_SECRET=...` only if there is none yet (an existing secret is kept). Restart `npm run dev` afterwards and sign in at `/admin/login`. Do the same again whenever you want a new email or password.

The command also prints the `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH` lines. Vercel is not updated automatically: paste those values into Vercel's environment variables and redeploy if the live site should use the same login. Never put `ADMIN_PASSWORD` in Vercel; the site does not read it.

These values are the *starter* login. Once you save your account or change your password in the dashboard (`/admin/account`), the login is stored in the database and that copy is the one the site checks. `npm run create-admin` handles this for you: if a saved account exists in the database `.env.local` points to, it gets the same email and password, and every other session is signed out. If that is the live site's database, the live login changes too. If you ever forget the password, see "I forgot my admin password" in [Deploy and maintain](05-deploy-and-maintain.md#i-forgot-my-admin-password).

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Run the site locally while you work |
| `npm run lint` | Check the code for mistakes. It should report no problems |
| `npm run build` | Build the site exactly as Vercel will. **Run this before every push** |
| `npm run start` | Serve the built site locally (after `npm run build`) |
| `npm run create-admin` | Set the admin login from `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.local` |

There are no automated tests. `npm run lint` and `npm run build` are the checks.

## How changes travel: the branch workflow

```
feature/<name>  →  develop  →  main
   (your work)     (testing)   (the live site)
```

1. Start from the newest `develop`:
   ```bash
   git switch develop
   git pull
   git switch -c feature/my-change
   ```
2. Make your change. Check it with `npm run lint` and `npm run build`.
3. Commit and push:
   ```bash
   git add -A
   git commit -m "Describe what changed"
   git push -u origin feature/my-change
   ```
4. On GitHub, open a pull request from `feature/my-change` into `develop` and merge it.
5. When `develop` is ready to go public, open a pull request from `develop` into `main` and merge it. Vercel publishes automatically.

Never commit directly on `develop` or `main`.

Next: [2. How the project works →](02-how-it-works.md)
