# 4. Design rules

[← Back to the guide index](README.md)

The site looks consistent because every page follows the same few rules. Follow them and new pages will match without extra effort.

## Colours

All colours are defined once in `src/app/globals.css` as named variables. Each has a light value (under `:root`) and a dark value (under `.dark`).

| Name | Used for |
| --- | --- |
| `--ink` | Main text, solid buttons, the logo badge |
| `--slate` | Secondary text, small labels |
| `--paper` | Page background |
| `--surface` | Cards and panels (one step above the page) |
| `--signal` | Accent: links, active states, highlights |
| `--pulse` | Second accent, used rarely |
| `--line` | Thin borders and dividers |
| `--danger` | Error messages |

Use them inside Tailwind classes like this:

```jsx
<p className="text-[var(--slate)]">…</p>
<div className="border border-[var(--line)] bg-[var(--surface)]">…</div>
```

**Do not** use Tailwind's built-in colours (`text-gray-500`, `bg-white`) or `dark:` classes. The variables switch between light and dark by themselves; fixed colours do not.

To change a colour everywhere, edit its value in `globals.css`. Change both the light and the dark value, then look at the site in both modes.

## Fonts

| Class | Font | Used for |
| --- | --- | --- |
| `font-display` | Space Grotesk | Headings, the name, large numbers |
| `font-body` (the default) | IBM Plex Sans | Paragraphs |
| `font-mono` | IBM Plex Mono | Small labels, dates, tags |

The fonts are loaded in `src/app/fonts.js` and given their class names in the `@theme` block at the top of `globals.css`. To change a font, change it in `fonts.js`; the class names stay the same.

Common text styles, to copy:

```jsx
{/* Small label above a heading */}
<p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--signal)]">Label</p>

{/* Section heading */}
<h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">Heading</h2>

{/* Card heading */}
<h3 className="font-display text-xl font-medium text-[var(--ink)]">Card title</h3>

{/* Body text */}
<p className="text-sm leading-relaxed text-[var(--slate)]">Text</p>
```

## Layout

- **One width for everything.** Every section's content sits in this container, the same one the navbar uses, so all left edges line up:
  ```jsx
  <div className="mx-auto max-w-6xl px-6">…</div>
  ```
- **One rhythm.** Sections use `py-16 md:py-20` or `py-20 md:py-24`.
- **Hairline between sections.** Each section after the first starts with `border-t border-[var(--line)]`.
- **Cards** use `rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-7`.
- **Buttons** are pills:
  ```jsx
  {/* Main button */}
  className="rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-medium text-[var(--paper)] transition-opacity hover:opacity-90"

  {/* Second button */}
  className="rounded-full border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--ink)] transition-colors hover:border-[var(--signal)] hover:text-[var(--signal)]"
  ```
- **Two-column sections** (label on the left, content on the right) use:
  ```jsx
  <div className="mx-auto grid max-w-6xl items-start gap-10 px-6 lg:grid-cols-[1fr_2fr] lg:gap-16">
  ```
- **Mobile first.** Write the phone layout first, then add `md:` and `lg:` classes for wider screens.

## Shared building blocks

| Component | Use it for |
| --- | --- |
| `ui/PageHeader` | The top of every inner page. Props: `eyebrow`, `heading`, `intro`, and optional children shown below the intro |
| `ui/SectionHeader` | The label and heading of a section. Props: `eyebrow`, `heading`, optional `href` and `linkLabel` |
| `ui/BrandMark` | The logo. Prop: `size` |
| `ui/ExternalLinks` | A row of outside links that hides empty ones |
| `ui/DownloadButton` | A download button that also counts the download |
| `ui/NetworkMap` | The home page animation |

The About page keeps its own header (`sections/about/AboutHero.jsx`) because it shows the portrait.

## Animation

Entrance animations are plain CSS classes defined in `globals.css`:

| Class | Effect |
| --- | --- |
| `rise` | Fades and slides the element in when the page loads. Add `style={{ "--delay": "80ms" }}` to make items appear one after another |
| `reveal` | Fades the element in as it scrolls into view. Browsers that do not support this simply show it |

```jsx
<h1 className="rise" style={{ "--delay": "80ms" }}>Title</h1>
<div className="reveal">Appears on scroll</div>
```

Both are switched off automatically for visitors who ask their device to reduce motion.

### Why not animate entrances with the Motion library?

An earlier version used Motion with `initial={{ opacity: 0 }}`. That writes "invisible" into the page's HTML, and the content only appears after the JavaScript loads and runs. On a slow connection, or if a script fails, visitors see a blank page, and search engines may see nothing.

So the rule is: **content must be visible in the HTML the server sends.** Use `rise` and `reveal` for entrances. Motion (`import { motion } from "motion/react"`) is still fine for things that respond to the visitor: the moving underline in the navbar, the mobile menu sliding in, button presses.

## Light and dark mode

- Handled by the `next-themes` library through `theme/ThemeProvider.jsx`. It adds the class `dark` to the page, which switches the colour variables.
- The site follows the visitor's device setting by default; the button in the navbar overrides it.
- A component cannot know the theme while the server builds the page. If something must look different per theme in code (not just colour), wait until the page is in the browser:
  ```jsx
  import { useIsMounted } from "@/lib/use-is-mounted";

  const mounted = useIsMounted();
  if (!mounted) return <div className="h-8 w-8" />;   // same size, empty
  ```
  `ThemeToggle.jsx` is the example. Do not use `useState` + `useEffect` for this; the code checker reports it as an error.

## Accessibility basics

- Every image needs `alt` text. Purely decorative graphics get `aria-hidden`.
- Buttons with only an icon need `aria-label`.
- Use real headings in order: one `h1` per page, then `h2`, then `h3`.
- Links that open a new tab need `target="_blank" rel="noopener noreferrer"`.

Next: [5. Deploy and maintain →](05-deploy-and-maintain.md)
