import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.resolve(__dirname, "../src/content/screens");

const groups = {
  institution: [
    "institution-dashboard",
    "institution-credentials",
    "institution-issue",
    "institution-bulk",
    "institution-designer",
    "institution-recipients",
    "institution-integrations",
    "institution-reports",
    "institution-revocations",
    "institution-team",
    "institution-credential-detail",
  ],
  partner: [
    "partner-overview",
    "partner-schools",
    "partner-apikeys",
    "partner-webhooks",
    "partner-mapping",
    "partner-customizer",
    "partner-billing",
    "partner-sandbox",
    "partner-logs",
  ],
  admin: ["admin-tenants", "admin-shards", "admin-hsm", "admin-tariffs"],
};

function extractAside(html) {
  const m = html.match(/<aside[\s\S]*?<\/aside>/i);
  return m ? m[0] : null;
}

function navPaths(aside) {
  return [...aside.matchAll(/data-path="([^"]+)"/g)].map((x) => x[1]);
}

function loadHtml(name) {
  const file = path.join(contentDir, `${name}.ts`);
  if (!fs.existsSync(file)) return null;
  const src = fs.readFileSync(file, "utf8");
  const htmlMatch = src.match(/export const html = `([\s\S]*)`;/);
  return htmlMatch ? htmlMatch[1] : null;
}

for (const [group, screens] of Object.entries(groups)) {
  console.log(`\n######## ${group} ########`);
  const signatures = new Map();
  for (const name of screens) {
    const html = loadHtml(name);
    if (!html) {
      console.log("MISSING", name);
      continue;
    }
    const aside = extractAside(html);
    const paths = aside ? navPaths(aside).join("|") : "NONE";
    if (!signatures.has(paths)) signatures.set(paths, []);
    signatures.get(paths).push(name);
    console.log(name, "->", aside ? `${navPaths(aside).length} links, ${aside.length}c` : "NO ASIDE");
  }
  console.log("variants:", signatures.size);
  for (const [sig, names] of signatures) {
    console.log("  ", names.join(", "));
    console.log("   paths:", sig.split("|").join(", "));
  }
}
