"use client";

import Image from "next/image";
import { cldUrl } from "@/lib/cloudinary-url";

// Lets Cloudinary do the resizing: next/image asks this for each size it
// needs, and Cloudinary serves that size in the best format.
const loader = ({ src, width, quality }) => cldUrl(src, { width, quality });

/**
 * Shows an image stored in Cloudinary. `image` is { url, width, height } as
 * saved by the dashboard. Pass `fill` to cover a sized parent (which needs
 * `relative` and a fixed aspect ratio); otherwise the image keeps its own
 * proportions. Always give a meaningful `alt`.
 *
 * A Client Component only because the loader is a function, which a Server
 * Component cannot pass to next/image.
 */
export default function CloudImage({ image, alt, fill = false, sizes = "100vw", ...rest }) {
  if (!image?.url) return null;

  return (
    <Image
      loader={loader}
      src={image.url}
      alt={alt}
      sizes={sizes}
      {...(fill ? { fill: true } : { width: image.width, height: image.height })}
      {...rest}
    />
  );
}
