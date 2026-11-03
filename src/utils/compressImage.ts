/**
 * Shrink an image in the browser before uploading it.
 *
 * The server's PHP is configured with `upload_max_filesize=2M`, and PHP drops
 * anything larger *before* Laravel sees it — the request then looks like it had
 * no file at all, which surfaces as "Image upload failed". Phone photos are
 * routinely 3–8MB, so without this most uploads fail.
 *
 * Re-encoding here keeps uploads well under that ceiling no matter how the
 * server is configured, and makes the storefront lighter as a side effect.
 */

// Comfortably below the 2MB PHP ceiling, leaving room for the other form fields.
const TARGET_BYTES = 1.5 * 1024 * 1024;
const MAX_DIMENSION = 1600;
const QUALITY_STEPS = [0.82, 0.7, 0.6, 0.5];

function withJpegExtension(name: string): string {
  const base = name.replace(/\.[^./\\]+$/, "");
  return `${base || "image"}.jpg`;
}

export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  // Animated GIFs would be flattened to a single frame by canvas re-encoding.
  if (file.type === "image/gif") return file;

  // Already small enough — don't re-encode and lose quality for nothing.
  if (file.size <= TARGET_BYTES) return file;

  try {
    const bitmap = await createImageBitmap(file);

    const scale = Math.min(
      1,
      MAX_DIMENSION / Math.max(bitmap.width, bitmap.height),
    );
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);

    const context = canvas.getContext("2d");
    if (!context) return file;

    // JPEG has no alpha channel; without this, transparent PNGs turn black.
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    let smallest: Blob | null = null;
    for (const quality of QUALITY_STEPS) {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", quality),
      );
      if (!blob) continue;
      if (!smallest || blob.size < smallest.size) smallest = blob;
      if (blob.size <= TARGET_BYTES) break;
    }

    // Keep the best attempt even if it is still over target — it is strictly
    // smaller than the original, and the server will report if it is too big.
    if (!smallest || smallest.size >= file.size) return file;

    return new File([smallest], withJpegExtension(file.name), {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch {
    // Canvas or createImageBitmap unavailable — send the original and let the
    // server decide rather than blocking the upload entirely.
    return file;
  }
}
