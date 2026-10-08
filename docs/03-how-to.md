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

First find where the content lives:

| Content | Where to change it |
| --- | --- |
| Achievements, Projects, Publications, Experience, Downloads | Dashboard → the matching screen |
| Name, role, organization, tagline, focus tags, location, contact email, social links | Dashboard → Public profile |
| Which projects, roles and competitions show on the home page | Dashboard → edit the entry → tick "Show on the home page" |
| About | `src/lib/data/about.js` |
| Journey | `src/lib/data/journey.js` |
| Skills | `src/lib/data/skills.js` |
| Education | `src/lib/data/education.js` |
| Contact page text and form wording | `src/lib/data/contact.js` |
| Home page "Profile" paragraph and "What I work on" cards | `src/lib/data/home.js` |
| Page headings and intros (the top of Projects, Publications, Experience) | the `...Page` / `...Intro` object in that page's `lib/data` file |
| Footer page links | `footerNav` in `src/lib/data/site.js` |

Dashboard changes appear on the site immediately. File changes need a commit and a publish.

The code files are mostly lists. To add an item, copy an existing block `{ ... },` and change its values. Keep `id` values unique within a file.

A few headings are written inside components instead of data files, for example "What I work on" on the home page (`sections/homepage/FocusAreas.jsx`). Search the `src` folder for the exact words to find them.

Note: `projects.js`, `publications.js`, `experience.js`, `downloads.js` and `achievements.js` in `lib/data` now hold only the **starter content** (plus the page heading). After you import it into the dashboard, editing the lists in those files changes nothing on the site.

## Add or change a footer or social link

- **Social links** (YouTube, Facebook, GitHub, …): Dashboard → Public profile → Social links → Add link.
- **Page links**: open `src/lib/data/site.js` and add `{ label: "Gallery", href: "/gallery" }` to a column's `links` in `footerNav`.

## Change the navbar links

Open `src/components/layout/Navbar.jsx` and edit the `NAV_LINKS` list at the top. The mobile menu uses the same list automatically.

## Change the labels in the home page network animation

Open `src/components/ui/NetworkMap.jsx`.

- `CORE_LABEL` is the text under the centre node.
- `NODES` is the list of outer nodes. Change a `label` to rename a field. `lx`, `ly` and `anchor` set where the label sits, so adjust them if a longer word overlaps a line.

## Add a new downloadable document

1. Make the file reachable. Either put it in `public/documents/` and publish the site (its address is then `/documents/<file name>`), or upload it somewhere else (Cloudinary, Google Drive) and copy its `https://` link.
2. Dashboard → Downloads → Add document. Fill in the title, description, file address, file name and type.

The card and its download counter appear automatically. The **ID** field is the name the counter is stored under; leave it empty to generate one, and avoid changing it later, because the count restarts.

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

**3. Page** — create `src/app/(site)/gallery/page.jsx` (inside `(site)` so it gets the navbar and footer):

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

`skills` and `education` are the simplest existing examples to copy from. This recipe makes a page whose content is in a code file. To edit the content from the dashboard instead, see "Add a dashboard for another kind of content".

## Add a section to an existing page

1. Add the content to the page's data file.
2. Create a new component in that page's `sections/<page>/` folder. Copy a neighbouring section as a starting point.
3. Import it in `src/app/(site)/<page>/page.jsx` and place it where it should appear.

Use `ui/SectionHeader` for the small label and heading above the section:

```jsx
<SectionHeader eyebrow="Awards" heading="Recognition" href="/achievements" linkLabel="See all" />
```

`href` and `linkLabel` are optional.

## Add a field to dashboard content

Example: add a photo address to projects.

**1. Declare the field.** Open `src/lib/content/modules.js`, find `projects`, and add a line to its `fields`:

```js
{ name: "photo", label: "Photo", type: "url", help: "Optional. Full address of the image." },
```

(Achievement fields are in `src/lib/achievements-schema.js`.)

The dashboard form now shows the input, and the value is checked and saved. You do not edit the form.

Available field types (defined in `src/lib/content/fields.js`):

| `type` | Input shown | Notes |
| --- | --- | --- |
| `text` | One line | Up to 300 characters |
| `textarea` | Several lines | Up to 5000 characters |
| `list` | Several lines | One item per line; saved as a list |
| `date` | Date picker | Saved as `YYYY-MM-DD` |
| `number` | Number | Whole numbers |
| `url` | Address | Must start with `http://` or `https://`. May be empty unless `required: true` |
| `file` | Address | A site path such as `/documents/x.pdf`, or an `https://` address |
| `email` | Email | Must look like an email address |
| `select` | Dropdown | Needs `options: ["A", "B"]` |
| `checkbox` | Tick box | Saved as true/false. `default: true` starts it ticked |
| `links` | Repeating rows of type, label, address | `withType: false` gives label and address only |
| `slug` | Address name | Lower-case with dashes; generated from the title if left empty |

Add `required: true` to make a field compulsory, and `unique: true` to forbid two entries with the same value.

**2. Show the field.** Open the section component that displays the entry, here `src/components/sections/projects/ProjectsList.jsx`, and use `project.photo`.

Older entries will not have the new field, so always check first:

```jsx
{project.photo && <img src={project.photo} alt={project.title} />}
```

**3. Starter content (optional).** If the fallback content should have it too, add it to the mapping in `src/lib/content/starter.js`.

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

The list screen, form, checks, save and delete are shared. A new module needs four small additions. Example: a Gallery.

**1. Register the module** in `src/lib/content/modules.js`, inside `MODULES`:

```js
gallery: {
  key: "gallery",
  label: "Gallery",
  description: "Photos shown on the Gallery page.",
  collection: "gallery",
  publicPath: "/gallery",
  types: withPublished({
    photo: {
      label: "Photos",
      singular: "photo",
      titleField: "title",          // shown as the row's name in the list
      metaFields: ["takenAt"],      // shown under it
      fields: [
        { name: "title", label: "Title", type: "text", required: true },
        { name: "image", label: "Image address", type: "url", required: true },
        { name: "caption", label: "Caption", type: "textarea" },
        { name: "takenAt", label: "Taken", type: "text" },
        orderField,
      ],
    },
  }),
},
```

**2. Give it starter content** in `src/lib/content/starter.js` (an empty list is fine):

```js
gallery: () => [],
```

**3. Give it a sidebar icon** in `src/components/admin/shell/AdminShell.jsx`: add `gallery: Images` to `MODULE_ICONS` and import `Images` from `lucide-react`.

The screen at `/admin/gallery` now works.

**4. Show it on the site.** Create a view that reads the entries:

```jsx
// src/views/gallery/GalleryView.jsx
import GalleryGrid from "@/components/sections/gallery/GalleryGrid";
import { getEntries } from "@/lib/services/content-service";

export default async function GalleryView() {
  const { photo } = await getEntries("gallery");
  return <GalleryGrid photos={photo} />;
}
```

`getEntries` returns an object with one list per entry type, here `photo`. Write `GalleryGrid` as a normal section component that takes `photos` as a prop, then use the view in the page and keep the page fresh:

```jsx
// src/app/(site)/gallery/page.jsx
import PageHeader from "@/components/ui/PageHeader";
import GalleryView from "@/views/gallery/GalleryView";

export const dynamic = "force-dynamic";

export default function GalleryPage() {
  return (
    <>
      <PageHeader eyebrow="Gallery" heading="Photos" />
      <GalleryView />
    </>
  );
}
```

Remember the footer or navbar link and the sitemap, as in "Add a new page".

Rule to keep: `modules.js` is also loaded by the browser, so it must contain plain data only. Never import database code into it.

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
