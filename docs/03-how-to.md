# 3. How to… (recipes)

[← Back to the guide index](README.md)

Step-by-step instructions for the changes you are most likely to make. After any change, run `npm run lint` and `npm run build` before pushing.

- [Change the text on a page](#change-the-text-on-a-page)
- [Add or change a footer or social link](#add-or-change-a-footer-or-social-link)
- [Change the navbar links](#change-the-navbar-links)
- [Change the labels in the home page network animation](#change-the-labels-in-the-home-page-network-animation)
- [Add a new downloadable document](#add-a-new-downloadable-document)
- [Add a new page](#add-a-new-page)
- [Add a section to an existing page](#add-a-section-to-an-existing-page)
- [Add a field to an achievement type](#add-a-field-to-an-achievement-type)
- [Add a new server endpoint (API route)](#add-a-new-server-endpoint-api-route)
- [Add a dashboard for another kind of content](#add-a-dashboard-for-another-kind-of-content)
- [Add images hosted on another site (for example Cloudinary)](#add-images-hosted-on-another-site-for-example-cloudinary)

---

## Change the text on a page

Open the matching file in `src/lib/data/` and edit the words. Nothing else is needed.

| Page | File |
| --- | --- |
| Home | `home.js` |
| About | `about.js` |
| Journey | `journey.js` |
| Experience | `experience.js` |
| Projects | `projects.js` |
| Skills | `skills.js` |
| Education | `education.js` |
| Publications | `publications.js` |
| Downloads | `downloads.js` |
| Contact | `contact.js` |
| Footer, site name, email, location | `site.js` |
| Achievements | Not a file. Use the admin panel at `/admin` |

Most of these files are lists. To add an item, copy an existing block `{ ... },` and change its values. Keep `id` values unique within a file.

A few headings are written inside components instead of data files, for example "What I work on" on the home page (`sections/homepage/FocusAreas.jsx`). Search the `src` folder for the exact words to find them.

## Add or change a footer or social link

Open `src/lib/data/site.js`.

- **Social links** (YouTube, Facebook, GitHub, …) are in `socialLinks`. A link with an empty `href` is hidden. Paste the address to make it appear:
  ```js
  { label: "YouTube", href: "https://www.youtube.com/@yourchannel" },
  ```
  Add a new line for any other site.
- **Page links** are in `footerNav`, grouped into columns. Add `{ label: "Gallery", href: "/gallery" }` to a column's `links`.

## Change the navbar links

Open `src/components/layout/Navbar.jsx` and edit the `NAV_LINKS` list at the top. The mobile menu uses the same list automatically.

## Change the labels in the home page network animation

Open `src/components/ui/NetworkMap.jsx`.

- `CORE_LABEL` is the text under the centre node.
- `NODES` is the list of outer nodes. Change a `label` to rename a field. `lx`, `ly` and `anchor` set where the label sits, so adjust them if a longer word overlaps a line.

## Add a new downloadable document

1. Put the file in `public/documents/`.
2. Open `src/lib/data/downloads.js` and add a block:
   ```js
   {
     id: "cv",                       // short, unique, never change it later
     title: "Curriculum Vitae",
     description: "My full CV.",
     fileName: "Rasel_Rana_CV.pdf",
     filePath: "/documents/Rasel_Rana_CV.pdf",
     fileType: "PDF",
     fileSize: "120 KB",
     lastUpdated: "2026-11-01",
   },
   ```
The card and the download counter appear automatically. The counter only accepts ids listed in this file, so the `id` here is what makes counting work.

## Add a new page

Example: a Gallery page at `/gallery`.

**1. Data** — create `src/lib/data/gallery.js`:

```js
export const galleryPage = {
  eyebrow: "Gallery",
  heading: "Photos",
  intro: "Moments from work and competitions.",
};

export const galleryItems = [
  { id: "photo-1", title: "Robolution 2016", caption: "The winning team." },
];
```

**2. Section** — create `src/components/sections/gallery/GalleryGrid.jsx`:

```jsx
import { galleryItems } from "@/lib/data/gallery";

export default function GalleryGrid() {
  return (
    <section className="border-t border-[var(--line)] py-16 md:py-20">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-3">
        {galleryItems.map((item) => (
          <div
            key={item.id}
            className="reveal rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-7"
          >
            <h2 className="font-display text-xl font-medium text-[var(--ink)]">
              {item.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--slate)]">
              {item.caption}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

**3. Page** — create `src/app/gallery/page.jsx`:

```jsx
import GalleryGrid from "@/components/sections/gallery/GalleryGrid";
import PageHeader from "@/components/ui/PageHeader";
import { galleryPage } from "@/lib/data/gallery";

export const metadata = {
  title: "Gallery | Rasel Rana",
  description: "Photos from the work and competitions of Rasel Rana.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader {...galleryPage} />
      <GalleryGrid />
    </>
  );
}
```

**4. Link to it** — add it to the footer (`footerNav` in `site.js`), to the navbar (`NAV_LINKS` in `Navbar.jsx`), or both.

**5. Search engines** — add `"/gallery"` to the `PATHS` list in `src/app/sitemap.js`.

`projects`, `skills`, `education` and `publications` are the simplest existing examples to copy from.

## Add a section to an existing page

1. Add the content to the page's data file.
2. Create a new component in that page's `sections/<page>/` folder. Copy a neighbouring section as a starting point.
3. Import it in `src/app/<page>/page.jsx` and place it where it should appear.

Use `ui/SectionHeader` for the small label and heading above the section:

```jsx
<SectionHeader eyebrow="Awards" heading="Recognition" href="/achievements" linkLabel="See all" />
```

`href` and `linkLabel` are optional.

## Add a field to an achievement type

Example: add a photo address to competitions.

**1. Declare the field.** In `src/lib/achievements-schema.js`, find `competition` inside `ACHIEVEMENT_TYPES` and add a line to its `fields`:

```js
{ name: "photo", label: "Photo URL", type: "url", help: "Full address of the image." },
```

The admin form now shows the input, and the value is checked and saved. You do not edit the form.

Available field types:

| `type` | Input shown | Notes |
| --- | --- | --- |
| `text` | One line | Up to 300 characters |
| `textarea` | Several lines | Up to 5000 characters |
| `date` | Date picker | Saved as `YYYY-MM-DD` |
| `number` | Number | Whole numbers |
| `url` | Address | Must start with `http://` or `https://`. Add `required: true` if it must be filled |
| `select` | Dropdown | Needs `options: ["A", "B"]` |
| `checkbox` | Tick box | Saved as true/false |
| `links` | Repeating rows of type, label, address | Use the name `links` |
| `slug` | Address name | Only for types with a detail page |

Note: a `url` field cannot be left empty. If the photo is optional, use `type: "text"` and check it yourself where you display it.

**2. Show the field.** Open the component that displays the type, for example `src/components/sections/achievements/AchievementsCompetitions.jsx` or the detail page `src/app/achievements/[slug]/page.jsx`, and use `c.photo` or `item.photo`.

Older items will not have the new field, so always check first:

```jsx
{item.photo && <img src={item.photo} alt={item.title} />}
```

**3. Starter content (optional).** If you want the field in the fallback content too, add it to `src/lib/data/achievements.js`.

## Add a new server endpoint (API route)

Create `src/app/api/<name>/route.js`. Every public endpoint that saves or sends something must check its input and use the rate limiter:

```js
import { NextResponse } from "next/server";
import { getClientIp, isRateLimited } from "@/lib/services/rate-limit";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // 1. Check every field: is it the type you expect, and a sensible length?
  if (typeof body?.email !== "string" || body.email.length > 254) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  // 2. Limit how often one visitor can call this
  const limited = await isRateLimited({
    bucket: "newsletter",          // a unique name for this endpoint
    ip: getClientIp(request),
    max: 5,
    windowSeconds: 10 * 60,
  });
  if (limited) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  // 3. Do the work
  return NextResponse.json({ ok: true });
}
```

Put database code in a file under `src/lib/services/`, not in the route itself. `downloads-service.js` is a short example.

## Add a dashboard for another kind of content

The achievements dashboard is the model. To manage, say, Projects from the admin panel:

1. **Service** — create `src/lib/services/projects-service.js` with functions to list, save and delete in a `projects` collection. Copy the shape of `achievements-service.js`.
2. **Schema** — describe the fields, like `achievements-schema.js` does, with a function that checks and cleans the input.
3. **Actions** — add `saveProjectAction` and `deleteProjectAction` to `src/app/admin/actions.js`. **Each must begin with `await requireAdmin();`.** Call `revalidatePath()` for the admin page and the public page after saving.
4. **Admin page** — create `src/app/admin/(panel)/projects/page.jsx`. Any page inside the `(panel)` folder is automatically behind the login and gets the admin bar.
5. **Admin screens** — create the list and form in `src/components/admin/`. `AchievementsAdmin.jsx` and `AchievementForm.jsx` are written for achievements only; when you build the second dashboard, turn them into general components instead of copying them.
6. **Admin bar link** — add a link in `src/app/admin/(panel)/layout.jsx`.
7. **Public page** — read the data in a component under `src/views/projects/`, pass it to the section components as props, and add `export const dynamic = "force-dynamic";` to the page so changes show immediately.

## Add images hosted on another site (for example Cloudinary)

A plain `<img src="https://...">` tag works with no setup, but `npm run lint` will show a warning suggesting `<Image>` instead.

To use the Next.js `<Image>` component, which resizes and optimises images, the outside address must be allowed first. In `next.config.mjs`, add inside `nextConfig`:

```js
images: {
  remotePatterns: [
    { protocol: "https", hostname: "res.cloudinary.com" },
  ],
},
```

Then:

```jsx
import Image from "next/image";

<Image src={item.photo} alt={item.title} width={800} height={600} />
```

Always give images a meaningful `alt` text.

Next: [4. Design rules →](04-design-rules.md)
