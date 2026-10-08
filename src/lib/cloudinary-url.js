// Helpers for Cloudinary image addresses. Pure functions — safe in Client
// Components. (Signing uploads needs the secret and lives in lib/cloudinary.js.)

// https://res.cloudinary.com/<cloud>/image/upload/<...>
const CLOUDINARY_IMAGE = /^https:\/\/res\.cloudinary\.com\/[\w-]+\/image\/upload\/[^\s"'<>\\]+$/;

export function isCloudinaryUrl(url) {
  return typeof url === "string" && url.length <= 600 && CLOUDINARY_IMAGE.test(url);
}

/**
 * Adds delivery settings to a Cloudinary image address: the best format for
 * the visitor's browser (f_auto), automatic quality (q_auto) and a maximum
 * width, so a phone never downloads a full-size photo.
 */
export function cldUrl(url, { width, quality } = {}) {
  if (!isCloudinaryUrl(url)) return url;
  const settings = [
    "f_auto",
    quality ? `q_${quality}` : "q_auto",
    width ? `c_limit,w_${Math.round(width)}` : "",
  ]
    .filter(Boolean)
    .join(",");
  return url.replace("/image/upload/", `/image/upload/${settings}/`);
}

/**
 * Checks an image object coming from a form and returns a clean copy
 * ({ url, publicId, width, height }), or null if it is not a usable
 * Cloudinary image.
 */
export function cleanImage(raw) {
  if (!raw || typeof raw !== "object" || !isCloudinaryUrl(raw.url)) return null;
  const width = Number.parseInt(raw.width, 10);
  const height = Number.parseInt(raw.height, 10);
  if (!(width > 0 && width <= 30000) || !(height > 0 && height <= 30000)) return null;
  return {
    url: raw.url,
    publicId: String(raw.publicId || "").slice(0, 300),
    width,
    height,
  };
}
