import { createHash } from "node:crypto";

// Server-side Cloudinary settings and upload signing. The API secret never
// leaves the server: the browser asks for a short-lived signature (through
// getUploadSignatureAction in app/admin/actions.js) and then sends the file
// straight to Cloudinary, so large photos never pass through this site.

// Every image the site uploads goes into this Cloudinary folder.
export const CLOUDINARY_FOLDER = "raselrana-web";

// Only ordinary photo formats can be uploaded.
const ALLOWED_FORMATS = "jpg,png,webp,avif";

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

/**
 * Cloudinary's signature: the parameters sorted by name and joined as
 * key=value&key=value, followed by the API secret, hashed with SHA-1.
 */
export function signParams(params, apiSecret) {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return createHash("sha1").update(toSign + apiSecret).digest("hex");
}

/**
 * Everything the browser needs for one signed upload into the site folder.
 * The signature is valid for about an hour and only for these exact
 * parameters (this folder, these formats).
 */
export function createUploadSignature() {
  const params = {
    allowed_formats: ALLOWED_FORMATS,
    folder: CLOUDINARY_FOLDER,
    timestamp: Math.floor(Date.now() / 1000),
  };
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    params,
    signature: signParams(params, process.env.CLOUDINARY_API_SECRET),
  };
}
