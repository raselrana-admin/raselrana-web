# 3. How to… (recipes)

[← Back to the guide index](README.md)

Step-by-step instructions for the changes you are most likely to make. After any change, run `npm run lint` and `npm run build` before pushing.

- [Change the text on a page](#change-the-text-on-a-page)
- [Add photos](#add-photos)
- [Edit the portfolio](#edit-the-portfolio)
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
| Achievements, Projects, Publications, Experience, Portfolio, Downloads | Dashboard → the matching screen |
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

## Add photos

- **Your portrait:** Dashboard → Public profile → Portrait → Upload photo → Save profile. It appears on the About page. A photo taller than it is wide works best.
- **An achievement:** Dashboard → Achievements → edit a competition, judging or sports entry. **Cover photo** is shown at the top of its page (and on the card, for champions). **Photo gallery** takes several photos at once; give each a caption, which also describes the photo to visitors who cannot see it.
- Remember to press **Save** after uploading. An uploaded photo is only attached to the entry when the entry is saved.

Limits: JPG, PNG, WebP or AVIF, up to 10 MB each, up to 24 photos in a gallery.

To let another kind of entry have a photo, add a field of type `image` or `gallery` to it in `src/lib/content/modules.js` (see "Add a field to dashboard content"), then show it in the page component with `CloudImage`:

```jsx
import CloudImage from "@/components/ui/CloudImage";

{project.cover && (
  <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
    <CloudImage image={project.cover} alt={project.title} fill sizes="(max-width: 768px) 100vw, 560px" className="object-cover" />
  </div>
)}
```

## Edit the portfolio

Dashboard → Portfolio. The page at `/portfolio` and the PDF both change as soon as you save.

- **Summary blocks** tab: the paragraphs at the top. Each has a heading (for example "Profile") and text.
- **Entries** tab: everything else. Each entry has a **Section** (the heading it goes under), a title, and optionally a subtitle, period, description and bullet points.
- Entries with exactly the same Section text are grouped together. To start a new section, type a new Section name. Sections appear in the order of their first entry, and **Position** (lower first) orders the entries.
- Untick **Published** to keep an entry out of the page and the PDF without deleting it.
- Your name, role, organization and contact details at the top come from Dashboard → Public profile.

Two limits of the PDF: it has no page numbers, and its built-in font prints English and other Latin letters only, so Bangla text would not appear in the PDF (it is fine on the web page).

To change how the PDF looks (sizes, colours, spacing), edit `src/lib/pdf/PortfolioPdf.jsx`. To change the web page's look, edit `src/components/sections/portfolio/PortfolioDocument.jsx`.

## Add or change a footer or social link

- **Social links** (YouTube, Facebook, GitHub, …): Dashboard → Public profile → Social links → Add link.
- **Page links**: open `src/lib/data/site.js` and add `{ label: "Gallery", href: "/gallery" }` to a column's `links` in `footerNav`.

## Change the navbar links

Open `src/components/layout/Navbar.jsx` and edit the `NAV_LINKS` list at the top. The mobile menu uses the same list automatically.

## Change the labels in the home page network animation

Open `src/components/ui/NetworkMap.jsx`.

- `CORE_LABEL` is the text under the centre node.
- `NODES` is the list of outer nodes. Change a `label` to rename a field. `lx`, `ly` and `anchor` set where the label sits, so adjust them if a longer word overlaps a line.

## Add or replace a downloadable document

No files are stored in the project. A document on the Downloads page is a **link** to a file you keep somewhere else, such as Google Drive.

**Add a document**

1. Upload the file to Google Drive.
2. Right-click it → Share → set "General access" to **Anyone with the link** → Copy link.
3. Dashboard → Downloads → Add document. Paste the link into **File address**, and fill in the title, description, file name and type.

The site turns a Google Drive link into a direct download for the Download button and into Drive's viewer for the Preview button, so you paste the normal share link.

**"Last updated"** is filled in for you:

- It is set to today when you add a document, and again whenever you change its file address.
- If you replace the file in Google Drive **without** changing its link (Drive → right-click → File information → Manage versions → Upload new version), the site cannot know. Open the entry and change the date yourself.
- A date you type by hand is always kept.

A **Preview** button is shown only for files a browser can display: Google Drive links, PDFs and images.

**The portfolio is special.** Its file address is `/portfolio.pdf`. That is not a stored file: the site builds the PDF from Dashboard → Portfolio each time. Its Preview button opens the `/portfolio` page, and its "Updated" date is the day you last saved a portfolio entry.

**The contact card is special too.** Its file address is `/contact-card.vcf`, which is not a real file: the site builds it from your public profile each time (name, role, organization, phone, email, website, location). To change what the card and its QR code contain, edit Dashboard → Public profile. The phone number is used only in the card; leave it empty to keep your number off the site. The card's "Updated" date is the day you last saved your profile. On the Downloads page the card's button reads "Preview & QR code" and opens a panel with the details and a code that saves the contact when scanned with a phone camera.

The **ID** field is the name the download counter is stored under; leave it empty to generate one, and avoid changing it later, because the count restarts.

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
| `image` | Upload button with a preview | One photo, stored in Cloudinary |
| `gallery` | Upload button, photo grid with captions | Several photos, stored in Cloudinary |
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
