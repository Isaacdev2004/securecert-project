import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const EXTS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".json",
  ".md",
  ".css",
]);

function shouldSkip(rel) {
  const n = rel.replace(/\\/g, "/");
  if (n.includes("node_modules/") || n.startsWith("node_modules")) return true;
  if (n.includes(".next/") || n.startsWith(".next")) return true;
  if (n.includes("content/screens/")) return true;
  if (n === "package-lock.json") return true;
  return false;
}

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const rel = path.relative(ROOT, full);
    if (shouldSkip(rel)) continue;
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (EXTS.has(path.extname(name))) out.push(full);
  }
  return out;
}

// Rename video asset if present
const oldVid = "public/videos/legitscan-intro.mp4";
const newVid = "public/videos/legitscan-intro.mp4";
if (fs.existsSync(oldVid) && !fs.existsSync(newVid)) {
  fs.renameSync(oldVid, newVid);
  console.log("renamed intro video");
}

const replacements = [
  ["/brand/legitscan-logo.png", "/brand/legitscan-logo.png"],
  ["/brand/legitscan-mark.png", "/brand/legitscan-mark.png"],
  ["legitscan-logo.png", "legitscan-logo.png"],
  ["legitscan-mark.png", "legitscan-mark.png"],
  ["legitscan-intro.mp4", "legitscan-intro.mp4"],
  ["legitscan-intro-poster.jpg", "legitscan-intro-poster.jpg"],
  ["did:legitscan:", "did:legitscan:"],
  ["LegitScan", "LegitScan"],
  ["LEGITSCAN", "LEGITSCAN"],
  ["legitscan", "legitscan"],
];

const files = walk(ROOT);
let changed = 0;
for (const file of files) {
  const rel = path.relative(ROOT, file).replace(/\\/g, "/");
  let text = fs.readFileSync(file, "utf8");
  const before = text;
  for (const [from, to] of replacements) {
    text = text.split(from).join(to);
  }
  if (text !== before) {
    fs.writeFileSync(file, text);
    changed++;
    console.log("updated", rel);
  }
}

console.log("done,", changed, "files");
