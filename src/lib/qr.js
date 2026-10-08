import QRCode from "qrcode";

/**
 * Turns text into a QR code drawn as one SVG path. Returns { size, d }:
 * `size` is the number of modules per side and `d` the path of the dark
 * modules in a 0..size coordinate space. Server-side only (the result is
 * plain data, so it can be passed to a Client Component).
 */
export function qrPath(text) {
  const { modules } = QRCode.create(text, { errorCorrectionLevel: "L" });
  const { size, data } = modules;

  let d = "";
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (data[y * size + x]) d += `M${x} ${y}h1v1h-1z`;
    }
  }
  return { size, d };
}
