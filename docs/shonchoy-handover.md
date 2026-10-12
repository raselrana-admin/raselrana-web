# Shonchoy: what to change so it works at raselrana.com.bd/shonchoy

This document is for whoever works on the **Shonchoy project** (the investment tracker deployed at `https://shonchoy.raselrana.com.bd`). It lists the changes that project needs. Nothing here is done in the main website's code; that side is already finished.

## 1. The goal

Shonchoy should open at `https://raselrana.com.bd/shonchoy`, as if it were a part of the main website, and only for the site owner.

## 2. How the two apps are joined

- The main website forwards every request for `/shonchoy` and `/shonchoy/...` to the Shonchoy app, **keeping the same path**. A request for `raselrana.com.bd/shonchoy/login` arrives at Shonchoy as `/shonchoy/login`.
- The main website forwards only when the visitor is signed in to its admin dashboard. Everyone else is sent to the dashboard login. Shonchoy's own login comes after that, unchanged.
- The browser's address bar always shows `raselrana.com.bd`. The browser never learns that a second app exists.

Because of this, **every address Shonchoy uses must start with `/shonchoy`**: pages, scripts, styles, images, API calls, redirects. Today none of them do. `/` redirects to `/login` and scripts load from `/_next/...`; on the main website those addresses belong to the main website, so the page would be "not found" or unstyled.

## 3. The required change: a base path

In Shonchoy's `next.config` (`.js`, `.mjs` or `.ts`):

```js
const nextConfig = {
  basePath: "/shonchoy",
  // ...the rest stays as it is
};
```

Next.js then serves the whole app under `/shonchoy` and fixes most addresses by itself: `next/link`, `useRouter()`, `redirect()` from `next/navigation`, and all `/_next/...` files.

## 4. What the base path does not fix

Go through the code for each of these. Searching for `"/` and `'/` in the project finds most of them.

| Where | What to do |
| --- | --- |
| `fetch("/api/...")` and other hand-written request addresses | Write `/shonchoy/api/...`. Next.js does not change these |
| Plain `<a href="/...">` and `<img src="/...">` | Add `/shonchoy` in front, or use `next/link` for page links |
| `next/image` with a text address (`src="/logo.png"`) | Add `/shonchoy` in front. Imported image files (`import logo from "./logo.png"`) need no change |
| Files in `public/`, the favicon, a web manifest | They are now served under `/shonchoy/...`. Fix any hand-written address to them |
| `middleware.js` or `proxy.js` | Inside this file, `request.nextUrl.pathname` and the `matcher` are written **without** `/shonchoy`; leave them. But a redirect built with `new URL("/login", request.url)` loses the base path. Build it like this instead: `const url = request.nextUrl.clone(); url.pathname = "/login"; return NextResponse.redirect(url);` |
| `redirects()` / `rewrites()` in `next.config` | The base path is added automatically. No change, unless an entry has `basePath: false` |
| Sign-in library settings (for example `NEXTAUTH_URL`, `AUTH_URL`, allowed callback addresses) | Set the public address to `https://raselrana.com.bd/shonchoy` and include `/shonchoy` in any callback path |
| Email links, `metadataBase`, any full address written in code or environment variables | Use `https://raselrana.com.bd/shonchoy/...` |

## 5. Sign-in through the main website

Three things that only appear once the app is opened through `raselrana.com.bd`:

- **Server Actions.** If the login form (or any form) uses a Server Action, Next.js compares the browser's address with the app's own and may refuse with "Invalid Server Actions request". Allow the main website in `next.config`:

  ```js
  experimental: {
    serverActions: {
      allowedOrigins: ["raselrana.com.bd", "www.raselrana.com.bd", "localhost:3000"],
    },
  },
  ```

- **Cookies.** The browser stores Shonchoy's cookies under `raselrana.com.bd`. Do not set a `Domain` on them. Set `Path=/shonchoy` so they are not sent to the rest of the main website. Do not name a cookie `admin_session`: that name belongs to the main website's dashboard, and its cookie arrives with every forwarded request (ignore it).
- **Headers added by the main website.** Every page under `/shonchoy` is sent with `X-Frame-Options: DENY` and a Content-Security-Policy of `frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'`. So Shonchoy cannot be shown inside a frame, and a form cannot post to another website.

## 6. The old address

After the change, the app lives at `https://shonchoy.raselrana.com.bd/shonchoy`. The bare address `https://shonchoy.raselrana.com.bd/` shows "not found". That is fine. If a redirect is wanted, add this to `redirects()`:

```js
{ source: "/", destination: "/shonchoy", basePath: false, permanent: false }
```

Do not rename or remove the `shonchoy.raselrana.com.bd` domain: the main website reaches the app through it.

## 7. Optional: close the direct address

The main website's gate covers `raselrana.com.bd/shonchoy` only. Anyone who knows `shonchoy.raselrana.com.bd` can still open Shonchoy's login page directly. To close that, Shonchoy would have to refuse any request that lacks a secret header, and the main website would have to add that header when it forwards. This needs a small change on both sides and is **not built yet**. Ask for it if it is wanted.

Also worth doing either way: tell search engines to stay out (`robots: { index: false, follow: false }` in the root layout's `metadata`).

## 8. Testing

**On your computer, both apps together**

1. Run Shonchoy on another port: `npm run dev -- -p 3001`.
2. In the main website's `.env.local` set `SHONCHOY_DOMAIN=http://localhost:3001` and restart it (`npm run dev`).
3. Sign in at `http://localhost:3000/admin`, then click **Apps → Shonchoy** in the sidebar.

**Checklist**

- [ ] `https://shonchoy.raselrana.com.bd/shonchoy` redirects to `/shonchoy/login` (not `/login`).
- [ ] In the page source, scripts and styles start with `/shonchoy/_next/`.
- [ ] Signed out of the main dashboard, `raselrana.com.bd/shonchoy` goes to `/admin/login`.
- [ ] Signed in to the dashboard, **Apps → Shonchoy** shows the Shonchoy login with its styles.
- [ ] Signing in to Shonchoy works through `raselrana.com.bd/shonchoy`, and the address bar stays on `raselrana.com.bd`.
- [ ] After sign-in, every page, every button that saves data, and sign-out work; no link leaves `/shonchoy` by accident.
- [ ] The browser's Network tab shows no request to `/api/...`, `/_next/...` or an image that lacks `/shonchoy` in front.

## 9. On the main website (already done, for reference)

- `SHONCHOY_DOMAIN=https://shonchoy.raselrana.com.bd` (no `/` at the end) in `.env.local`. **It must also be added on Vercel** for the main website, followed by a redeploy.
- How the main website's side works is described in [How it works → Shonchoy](02-how-it-works.md#shonchoy-a-private-app).
