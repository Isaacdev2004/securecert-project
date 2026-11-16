import { createRequire } from "node:module";
import { register } from "node:module";
import { pathToFileURL } from "node:url";

// Load TS via dynamic import through tsx by reading raw and evaluating strip in plain JS
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.resolve(__dirname, "../src/content/screens");

function loadHtml(name) {
  const src = fs.readFileSync(path.join(contentDir, `${name}.ts`), "utf8");
  const m = src.match(/export const html = `([\s\S]*)`;/);
  return m[1]
    .replace(/\\`/g, "`")
    .replace(/\\\$\{/g, "${")
    .replace(/\\\\/g, "\\");
}

function stripDashboardChrome(html) {
  let out = html;
  out = out.replace(/<aside\b[\s\S]*?<\/aside>/i, "");
  out = out.replace(/<header\b[\s\S]*?<\/header>/i, "");
  out = out.replace(/<div class="pl-72">\s*([\s\S]*?)\s*<\/div>\s*$/i, "$1");
  out = out.replace(/<div class="pl-72([^"]*)">\s*([\s\S]*?)\s*<\/div>\s*$/i, "$2");
  const mainMatch = out.match(/<main\b[\s\S]*?<\/main>/i);
  if (mainMatch) return mainMatch[0];
  return out.trim();
}

for (const name of ["institution-credentials", "institution-dashboard", "partner-webhooks"]) {
  const h = loadHtml(name);
  const s = stripDashboardChrome(h);
  console.log(name, {
    hasAside: /<aside/i.test(s),
    hasHeader: /<header/i.test(s),
    hasMain: /<main/i.test(s),
    start: s.slice(0, 90).replace(/\s+/g, " "),
    len: s.length,
  });
}
