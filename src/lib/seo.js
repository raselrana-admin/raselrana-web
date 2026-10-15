import { siteInfo } from "@/lib/data/site";

// Metadata for one public page, including what Facebook, LinkedIn, X,
// WhatsApp and others show when its link is shared. Next.js replaces a
// parent's `openGraph` as a whole (and then also drops the picture from
// app/opengraph-image.jsx), so every page sets all of it here.
//
//   title, description  as shown in the browser tab and the preview
//   path                the page's own address, e.g. "/about"
//   image               optional { url, width, height, alt } for this page;
//                       otherwise the site's picture (app/opengraph-image.jsx)

const SITE_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Rasel Rana, Manager (Technical) at BTCL",
};

export function pageMetadata({ title, description, path, image = SITE_IMAGE }) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: siteInfo.name,
      locale: "en_US",
      url: path,
      title,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
