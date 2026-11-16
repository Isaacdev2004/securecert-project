/**
 * Converts Google Stitch code.html screens into Next.js page modules
 * that render body markup via a shared StitchRenderer (exact UI fidelity).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT = path.resolve(__dirname, "../src/content/screens");
const APP = path.resolve(__dirname, "../src/app");

const BASE = path.join(ROOT, "stitch_digital_credential_verification_platform");
const P2 = path.join(ROOT, "stitch_digital_credential_verification_platform(2)");

/** Canonical screen → route + preferred parent folder */
const SCREENS = [
  // Public
  { folder: "securecert_sovereign_credential_verification_platform", parent: BASE, route: "/", shell: "public", name: "home" },
  { folder: "securecert_platform_architecture_cryptographic_rigor", parent: BASE, route: "/architecture", shell: "public", name: "architecture" },
  { folder: "securecert_developer_apis_interactive_documentation", parent: BASE, route: "/developers", shell: "public", name: "developers" },
  { folder: "securecert_verify_a_credential_portal", parent: BASE, route: "/verify", shell: "public", name: "verify" },
  { folder: "securecert_public_credential_verification_portal", parent: BASE, route: "/verify/result", shell: "blank", name: "verify-result" },
  { folder: "securecert_wholesale_economics_margin_calculator", parent: BASE, route: "/wholesale", shell: "public", name: "wholesale" },
  { folder: "securecert_institutions_sis_partners_ecosystem", parent: BASE, route: "/partners", shell: "public", name: "partners" },
  { folder: "securecert_enterprise_onboarding_registrar_briefing", parent: BASE, route: "/onboarding", shell: "public", name: "onboarding" },

  // Institution
  { folder: "securecert_institutional_overview_dashboard", parent: BASE, route: "/institution/dashboard", shell: "institution", name: "institution-dashboard" },
  { folder: "securecert_credential_records_verification_registry", parent: BASE, route: "/institution/credentials", shell: "institution", name: "institution-credentials" },
  { folder: "securecert_candidate_record_detail_cryptographic_merkle_audit", parent: P2, route: "/institution/credentials/[id]", shell: "institution", name: "institution-credential-detail" },
  { folder: "securecert_recipients_candidates_directory", parent: P2, route: "/institution/recipients", shell: "institution", name: "institution-recipients" },
  { folder: "securecert_issue_register_credential", parent: BASE, route: "/institution/issue", shell: "institution", name: "institution-issue" },
  { folder: "securecert_bulk_processing_ingestion_pipeline", parent: BASE, route: "/institution/bulk", shell: "institution", name: "institution-bulk" },
  { folder: "securecert_certificate_designer_studio", parent: BASE, route: "/institution/designer", shell: "institution", name: "institution-designer" },
  { folder: "securecert_integration_ecosystem_hub", parent: BASE, route: "/institution/integrations", shell: "institution", name: "institution-integrations" },
  { folder: "securecert_accreditation_reports_statutory_export_dossiers", parent: P2, route: "/institution/reports", shell: "institution", name: "institution-reports" },
  { folder: "securecert_revocations_tamper_invalidation_registry", parent: P2, route: "/institution/revocations", shell: "institution", name: "institution-revocations" },
  { folder: "securecert_team_role_permissions", parent: P2, route: "/institution/team", shell: "institution", name: "institution-team" },

  // Partner
  { folder: "securecert_partner_vendor_overview_operations_hub", parent: BASE, route: "/partner", shell: "partner", name: "partner-overview" },
  { folder: "securecert_partner_connected_client_schools_tenancies", parent: BASE, route: "/partner/schools", shell: "partner", name: "partner-schools" },
  { folder: "securecert_partner_api_keys_oauth_2.0_credentials", parent: BASE, route: "/partner/apikeys", shell: "partner", name: "partner-apikeys" },
  { folder: "securecert_partner_webhook_subscriptions_event_dispatch", parent: BASE, route: "/partner/webhooks", shell: "partner", name: "partner-webhooks" },
  { folder: "securecert_partner_sis_erp_field_mapping_schema_transformer", parent: BASE, route: "/partner/mapping", shell: "partner", name: "partner-mapping" },
  { folder: "securecert_partner_white_label_verification_portal_customizer", parent: BASE, route: "/partner/customizer", shell: "partner", name: "partner-customizer" },
  { folder: "securecert_partner_reseller_invoicing_wholesale_commission_settlement", parent: BASE, route: "/partner/billing", shell: "partner", name: "partner-billing" },
  { folder: "securecert_partner_sandbox_simulation_testbed", parent: P2, route: "/partner/sandbox", shell: "partner", name: "partner-sandbox" },
  { folder: "securecert_partner_logs_live_telemetry", parent: P2, route: "/partner/logs", shell: "partner", name: "partner-logs" },

  // Super Admin
  { folder: "securecert_super_admin_global_tenant_domain_governance", parent: BASE, route: "/admin/tenants", shell: "admin", name: "admin-tenants" },
  { folder: "securecert_super_admin_multi_tenant_health_shard_governance", parent: P2, route: "/admin/shards", shell: "admin", name: "admin-shards" },
  { folder: "securecert_super_admin_hsm_root_signers_cryptographic_enclaves", parent: P2, route: "/admin/hsm", shell: "admin", name: "admin-hsm" },
  { folder: "securecert_super_admin_wholesale_tariffs_global_quotas", parent: P2, route: "/admin/tariffs", shell: "admin", name: "admin-tariffs" },

  // Verifier
  { folder: "securecert_verifier_portal_batch_single_verification_desk", parent: P2, route: "/verifier", shell: "verifier", name: "verifier" },

  // Passport
  { folder: "securecert_passport_student_sovereign_wallet", parent: P2, route: "/passport", shell: "passport", name: "passport-wallet" },
  { folder: "securecert_passport_credentials_vault", parent: P2, route: "/passport/vault", shell: "passport", name: "passport-vault" },
  { folder: "securecert_passport_credential_detail_digital_parchment", parent: P2, route: "/passport/credential", shell: "passport", name: "passport-credential" },
  { folder: "securecert_passport_selective_disclosure_share", parent: P2, route: "/passport/share", shell: "passport", name: "passport-share" },
  { folder: "securecert_passport_activity_security_audit", parent: P2, route: "/passport/activity", shell: "passport", name: "passport-activity" },
];

/** Map Stitch data-path / nav labels → real app routes */
const PATH_MAP = {
  "interactive-verifier": "/verify",
  "platform-architecture": "/architecture",
  "institutions-and-sis-partners": "/partners",
  "developer-apis": "/developers",
  "wholesale-economics": "/wholesale",
  "book-enterprise-onboarding": "/onboarding",
  "overview-dashboard": "/institution/dashboard",
  "credentials-records": "/institution/credentials",
  "issue-register": "/institution/issue",
  "bulk-processing": "/institution/bulk",
  "certificate-designer": "/institution/designer",
  "recipients-candidates": "/institution/recipients",
  "integrations-connectors": "/institution/integrations",
  "api-keys-oauth-apps": "/partner/apikeys",
  "webhooks-event-streams": "/partner/webhooks",
  "request-logs-telemetry": "/partner/logs",
  "field-mapping-schemas": "/partner/mapping",
  "verification-activity": "/verifier",
  "revocations-audit-logs": "/institution/revocations",
  "reports-data-exports": "/institution/reports",
  "organization-profile-branding": "/institution/dashboard",
  "team-role-permissions": "/institution/team",
  "partner-reseller-portal": "/partner",
};

function extractBodyInner(html) {
  const match = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  return match ? match[1].trim() : html;
}

function extractBodyClass(html) {
  const match = html.match(/<body([^>]*)>/i);
  if (!match) return "bg-surface font-body-md text-on-surface antialiased";
  const classMatch = match[1].match(/class="([^"]*)"/);
  return classMatch ? classMatch[1] : "bg-surface font-body-md text-on-surface antialiased";
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function routeToAppPath(route) {
  if (route === "/") return path.join(APP, "page.tsx");
  const cleaned = route.replace(/^\//, "").replace(/\[id\]/g, "[id]");
  return path.join(APP, cleaned, "page.tsx");
}

function pageSource(name, shell) {
  return `'use client';

import { StitchRenderer } from "@/components/StitchRenderer";
import { html, bodyClass } from "@/content/screens/${name}";

export default function Page() {
  return <StitchRenderer html={html} bodyClass={bodyClass} shell="${shell}" />;
}
`;
}

function contentSource(bodyInner, bodyClass) {
  // Escape backticks and ${ for template literal safety
  const escaped = bodyInner
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");
  return `/* Auto-generated from Google Stitch — do not edit by hand */
export const bodyClass = ${JSON.stringify(bodyClass)};
export const html = \`${escaped}\`;
`;
}

ensureDir(OUT);

const manifest = [];

for (const screen of SCREENS) {
  const htmlPath = path.join(screen.parent, screen.folder, "code.html");
  if (!fs.existsSync(htmlPath)) {
    console.warn("MISSING:", htmlPath);
    continue;
  }
  const raw = fs.readFileSync(htmlPath, "utf8");
  const bodyInner = extractBodyInner(raw);
  const bodyClass = extractBodyClass(raw);

  const contentFile = path.join(OUT, `${screen.name}.ts`);
  fs.writeFileSync(contentFile, contentSource(bodyInner, bodyClass), "utf8");

  const pageFile = routeToAppPath(screen.route);
  ensureDir(path.dirname(pageFile));
  fs.writeFileSync(pageFile, pageSource(screen.name, screen.shell), "utf8");

  manifest.push({
    name: screen.name,
    route: screen.route,
    shell: screen.shell,
    folder: screen.folder,
  });
  console.log("OK", screen.route, "←", screen.folder);
}

fs.writeFileSync(
  path.join(OUT, "manifest.json"),
  JSON.stringify({ screens: manifest, pathMap: PATH_MAP }, null, 2),
  "utf8",
);

// path-map.ts is maintained by hand (shell-scoped). Do not overwrite it here.
fs.writeFileSync(
  path.join(OUT, "path-map.snapshot.json"),
  JSON.stringify({ pathMap: PATH_MAP }, null, 2),
  "utf8",
);

console.log(`\nConverted ${manifest.length} screens.`);
