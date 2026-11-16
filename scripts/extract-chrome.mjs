import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.resolve(__dirname, "../src/content/screens");
const outDir = path.resolve(__dirname, "../src/content/chrome");

const sources = {
  institution: "institution-dashboard",
  partner: "partner-overview",
  admin: "admin-tenants",
  verifier: "verifier",
};

function loadHtml(name) {
  const src = fs.readFileSync(path.join(contentDir, `${name}.ts`), "utf8");
  const m = src.match(/export const html = `([\s\S]*)`;/);
  if (!m) throw new Error(`no html in ${name}`);
  // Unescape template literals
  return m[1].replace(/\\`/g, "`").replace(/\\\$\{/g, "${").replace(/\\\\/g, "\\");
}

function extract(html) {
  const asideMatch = html.match(/<aside[\s\S]*?<\/aside>/i);
  const headerMatch = html.match(/<header[\s\S]*?<\/header>/i);
  if (!asideMatch) throw new Error("no aside");
  if (!headerMatch) throw new Error("no header");
  return { aside: asideMatch[0], header: headerMatch[0] };
}

fs.mkdirSync(outDir, { recursive: true });

for (const [portal, screen] of Object.entries(sources)) {
  const html = loadHtml(screen);
  const { aside, header } = extract(html);
  const body = `/* Canonical ${portal} chrome — extracted from ${screen} */
export const asideHtml = ${JSON.stringify(aside)};
export const headerHtml = ${JSON.stringify(header)};
`;
  fs.writeFileSync(path.join(outDir, `${portal}.ts`), body, "utf8");
  console.log("wrote", portal, "aside", aside.length, "header", header.length);
}
