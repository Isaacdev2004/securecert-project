import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const parents = [
  path.join(ROOT, "stitch_digital_credential_verification_platform"),
  path.join(ROOT, "stitch_digital_credential_verification_platform(2)"),
];

const samples = {
  institution: [
    "securecert_institutional_overview_dashboard",
    "securecert_credential_records_verification_registry",
    "securecert_team_role_permissions",
  ],
  partner: [
    "securecert_partner_vendor_overview_operations_hub",
    "securecert_partner_api_keys_oauth_2.0_credentials",
    "securecert_partner_logs_live_telemetry",
  ],
  admin: [
    "securecert_super_admin_global_tenant_domain_governance",
    "securecert_super_admin_multi_tenant_health_shard_governance",
    "securecert_super_admin_hsm_root_signers_cryptographic_enclaves",
    "securecert_super_admin_wholesale_tariffs_global_quotas",
  ],
  verifier: ["securecert_verifier_portal_batch_single_verification_desk"],
  passport: [
    "securecert_passport_student_sovereign_wallet",
    "securecert_passport_credentials_vault",
    "securecert_passport_selective_disclosure_share",
    "securecert_passport_activity_security_audit",
  ],
};

function findFile(folder) {
  for (const p of parents) {
    const f = path.join(p, folder, "code.html");
    if (fs.existsSync(f)) return f;
  }
  return null;
}

for (const [shell, folders] of Object.entries(samples)) {
  console.log(`\n=== ${shell} ===`);
  const seen = new Map();
  for (const folder of folders) {
    const file = findFile(folder);
    if (!file) continue;
    const html = fs.readFileSync(file, "utf8");
    const aside = (html.match(/<aside[\s\S]*?<\/aside>/) || [])[0] || "";
    const bottomNav =
      (html.match(/<nav[^>]*fixed bottom[\s\S]*?<\/nav>/) || [])[0] || "";
    const src = aside || bottomNav || html;
    for (const m of src.matchAll(/data-path="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
      if (seen.has(m[1])) continue;
      const label = m[2]
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 70);
      seen.set(m[1], label);
      console.log(`${m[1]}  |  ${label}`);
    }
  }
}
