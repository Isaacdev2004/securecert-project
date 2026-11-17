import fs from "fs";
import sharp from "sharp";

/** Build shield-only PNG icons from the official LegitScan wordmark. */
const src = "public/brand/legitscan-logo.png";
const meta = await sharp(src).metadata();
const w = meta.width ?? 1024;
const h = meta.height ?? 341;
const extract = {
  left: 0,
  top: 0,
  width: Math.min(Math.round(h * 1.05), w),
  height: h,
};

const base = sharp(src)
  .extract(extract)
  .resize(256, 256, {
    fit: "contain",
    background: { r: 255, g: 255, b: 255, alpha: 1 },
  })
  .ensureAlpha();

await base.clone().png().toFile("public/brand/legitscan-mark.png");
await base.clone().resize(32, 32).png().toFile("src/app/icon.png");
await base.clone().resize(180, 180).png().toFile("src/app/apple-icon.png");
await base.clone().resize(32, 32).png().toFile("public/favicon.png");

for (const p of [
  "src/app/favicon.ico",
  "public/favicon.ico",
  "src/app/icon.jpg",
  "src/app/apple-icon.jpg",
]) {
  if (fs.existsSync(p)) fs.unlinkSync(p);
}

console.log("LegitScan brand icons ready");
