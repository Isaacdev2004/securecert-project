/**
 * Shell-scoped Stitch navigation.
 * Shared data-path keys (e.g. "credentials", "api-keys-*") resolve differently
 * depending on which portal shell the page was rendered with.
 */

export type PortalShell =
  | "public"
  | "institution"
  | "partner"
  | "admin"
  | "verifier"
  | "passport"
  | "blank";

/** Public marketing / trust site */
const PUBLIC_MAP: Record<string, string> = {
  "interactive-verifier": "/verify",
  "platform-architecture": "/architecture",
  "institutions-and-sis-partners": "/partners",
  "developer-apis": "/developers",
  "api-documentation": "/developers",
  "sdks-developer-docs": "/developers",
  "wholesale-economics": "/wholesale",
  "book-enterprise-onboarding": "/onboarding",
  "enterprise-onboarding": "/onboarding",
  "exam-bodies-national": "/partners",
  "government-state-ministries": "/partners",
  "software-vendors-resellers": "/partners",
  "legal-and-cryptographic-audits": "/architecture",
};

/**
 * Institutional registrar portal — never leave /institution/*
 * (except explicit Partner portal cross-link).
 */
const INSTITUTION_MAP: Record<string, string> = {
  overview: "/institution/dashboard",
  "overview-dashboard": "/institution/dashboard",
  "credentials-records": "/institution/credentials",
  "credentials-registry": "/institution/credentials",
  registry: "/institution/credentials",
  credentials: "/institution/credentials",
  "issue-register": "/institution/issue",
  issue: "/institution/issue",
  "bulk-processing": "/institution/bulk",
  "bulk-ingest": "/institution/bulk",
  "batch-issuance": "/institution/bulk",
  "cohort-candidate-ingestion": "/institution/bulk",
  "certificate-designer": "/institution/designer",
  designer: "/institution/designer",
  "schema-designer": "/institution/designer",
  "recipients-candidates": "/institution/recipients",
  "integrations-connectors": "/institution/integrations",
  integrations: "/institution/integrations",
  // Stitch also lists these under institution chrome — keep them in-institution
  "api-keys-oauth-apps": "/institution/integrations",
  "api-keys-oauth-credentials": "/institution/integrations",
  "api-keys-automated-ingress": "/institution/integrations",
  "webhooks-event-streams": "/institution/integrations",
  "webhook-subscriptions-delivery": "/institution/integrations",
  "request-logs-telemetry": "/institution/integrations",
  "system-telemetry": "/institution/integrations",
  "field-mapping-schemas": "/institution/integrations",
  "verification-activity": "/institution/credentials",
  "revocations-audit-logs": "/institution/revocations",
  "revocation-registry": "/institution/revocations",
  "revocations-anomaly-watch": "/institution/revocations",
  "revocation-blacklist-anomaly-watch": "/institution/revocations",
  "tamper-revocation-radar": "/institution/revocations",
  "reports-data-exports": "/institution/reports",
  "diplomatic-dossiers-w3c-transcripts": "/institution/reports",
  "ndpa-statutory-compliance-audits": "/institution/reports",
  audit: "/institution/reports",
  "activity-and-audit": "/institution/reports",
  "cryptographic-audit": "/institution/credentials/demo",
  "team-role-permissions": "/institution/team",
  "organization-profile-branding": "/institution/dashboard",
  // Public ecosystem page (role guard would bounce INSTITUTION off /partner)
  "partner-reseller-portal": "/partners",
};

/** Partner / reseller hub — stay in /partner/* */
const PARTNER_MAP: Record<string, string> = {
  "partner-overview-health": "/partner",
  "partner-reseller-portal": "/partner",
  overview: "/partner",
  "overview-dashboard": "/partner",
  "connected-client-schools-tenancies": "/partner/schools",
  "sovereign-tenants-universities": "/partner/schools",
  "tenant-partners": "/partner/schools",
  "registered-applications-services": "/partner/apikeys",
  "api-keys-oauth-apps": "/partner/apikeys",
  "api-keys-oauth-credentials": "/partner/apikeys",
  "api-keys-automated-ingress": "/partner/apikeys",
  "webhooks-event-streams": "/partner/webhooks",
  "webhook-subscriptions-delivery": "/partner/webhooks",
  "field-mapping-schemas": "/partner/mapping",
  "whitelabel-custom-verification": "/partner/customizer",
  "issuance-volume-usage-invoices": "/partner/billing",
  "reseller-commission-license-tiers": "/partner/billing",
  "sandbox-simulation-runner": "/partner/sandbox",
  "request-logs-telemetry": "/partner/logs",
  "system-telemetry": "/partner/logs",
  "partner-support-sla": "/partner",
  "sdks-developer-docs": "/developers",
  "developer-apis": "/developers",
};

/** Super-admin governance — stay in /admin/* */
const ADMIN_MAP: Record<string, string> = {
  "global-tenant-domain-governance": "/admin/tenants",
  "global-tenant-domains": "/admin/tenants",
  "multi-tenant-health-sharding": "/admin/shards",
  "multi-tenant-health-shards": "/admin/shards",
  "hsm-root-signers-key-enclaves": "/admin/hsm",
  "hsm-root-signers-cryptographic-enclaves": "/admin/hsm",
  "hsm-key-lifecycle": "/admin/hsm",
  "global-cryptographic-ledgers": "/admin/hsm",
  "wholesale-tariffs-subscriptions": "/admin/tariffs",
  "wholesale-tariffs-global-quotas": "/admin/tariffs",
  "evaluator-tariffs-fx-escrow": "/admin/tariffs",
  "global-audit-trail-access-policies": "/admin/tenants",
  "global-audit-iam-root": "/admin/tenants",
  "apex-dns-tls-enforcement": "/admin/shards",
  "ndpa-statutory-compliance-audits": "/admin/tenants",
  "sovereign-tenants-universities": "/admin/tenants",
  "government-state-ministries": "/admin/tenants",
  "exam-bodies-national": "/admin/tenants",
  "software-vendors-resellers": "/admin/tenants",
  "tenant-partners": "/admin/tenants",
  // Secondary admin nav items that share names with other portals
  "credentials-registry": "/admin/tenants",
  credentials: "/admin/tenants",
  registry: "/admin/tenants",
  "batch-issuance": "/admin/tenants",
  "schema-designer": "/admin/hsm",
  designer: "/admin/hsm",
  "revocation-registry": "/admin/tenants",
  "revocations-anomaly-watch": "/admin/tenants",
  "revocation-blacklist-anomaly-watch": "/admin/tenants",
  "cryptographic-audit": "/admin/hsm",
  "system-telemetry": "/admin/shards",
  overview: "/admin/tenants",
  "overview-dashboard": "/admin/tenants",
};

/** Embassy / WES desk — single workspace for now */
const VERIFIER_MAP: Record<string, string> = {
  "batch-single-verification-desk": "/verifier",
  "cohort-candidate-ingestion": "/verifier",
  "live-merkle-proof-inspector": "/verifier",
  "diplomatic-dossiers-w3c-transcripts": "/verifier",
  "ndpa-blinded-consent-grants": "/verifier",
  "tamper-revocation-radar": "/verifier",
  "evaluator-tariffs-fx-escrow": "/verifier",
  "api-keys-automated-ingress": "/verifier",
  "audit-logs-diplomatic-dispatches": "/verifier",
  "verification-activity": "/verifier",
  overview: "/verifier",
  "overview-dashboard": "/verifier",
};

/** Student passport mobile shell */
const PASSPORT_MAP: Record<string, string> = {
  passport: "/passport",
  credentials: "/passport/vault",
  "credentials-records": "/passport/vault",
  "credentials-registry": "/passport/vault",
  "share-and-disclose": "/passport/share",
  "activity-and-audit": "/passport/activity",
  audit: "/passport/activity",
  "ndpa-blinded-consent-grants": "/passport/share",
};

export const SHELL_PATH_MAPS: Record<PortalShell, Record<string, string>> = {
  public: PUBLIC_MAP,
  blank: PUBLIC_MAP,
  institution: INSTITUTION_MAP,
  partner: PARTNER_MAP,
  admin: ADMIN_MAP,
  verifier: VERIFIER_MAP,
  passport: PASSPORT_MAP,
};

/** @deprecated Prefer resolveStitchPath(shell, dataPath) */
export const STITCH_PATH_MAP: Record<string, string> = {
  ...PUBLIC_MAP,
  ...INSTITUTION_MAP,
};

export function resolveStitchPath(
  shell: PortalShell | string | undefined,
  dataPath: string | null | undefined,
): string | null {
  if (!dataPath) return null;
  const key = dataPath.trim();
  const portal = (shell || "public") as PortalShell;
  const local = SHELL_PATH_MAPS[portal];
  if (local?.[key]) return local[key];
  // Public CTAs can appear inside authenticated chrome (e.g. docs link)
  if (portal !== "public" && PUBLIC_MAP[key]) return PUBLIC_MAP[key];
  return null;
}

/** Label heuristics scoped to the current portal (never jump shells). */
export function resolveLabelPath(
  shell: PortalShell | string | undefined,
  label: string,
): string | null {
  const text = label.trim().toLowerCase();
  if (!text) return null;
  const portal = (shell || "public") as PortalShell;

  if (portal === "institution") {
    if (text.includes("overview") || text.includes("dashboard"))
      return "/institution/dashboard";
    if (text.includes("credential") || text.includes("registry"))
      return "/institution/credentials";
    if (text.includes("issue") || text.includes("register"))
      return "/institution/issue";
    if (text.includes("bulk") || text.includes("ingest"))
      return "/institution/bulk";
    if (text.includes("designer") || text.includes("template"))
      return "/institution/designer";
    if (text.includes("recipient") || text.includes("candidate"))
      return "/institution/recipients";
    if (
      text.includes("integration") ||
      text.includes("api key") ||
      text.includes("webhook") ||
      text.includes("telemetry") ||
      text.includes("mapping") ||
      text.includes("schema")
    )
      return "/institution/integrations";
    if (text.includes("revocation")) return "/institution/revocations";
    if (text.includes("report") || text.includes("export") || text.includes("audit"))
      return "/institution/reports";
    if (text.includes("team") || text.includes("role")) return "/institution/team";
    if (text.includes("partner") && text.includes("reseller")) return "/partner";
    return null;
  }

  if (portal === "partner") {
    if (text.includes("overview") || text.includes("health")) return "/partner";
    if (text.includes("school") || text.includes("tenanc")) return "/partner/schools";
    if (text.includes("api key") || text.includes("oauth") || text.includes("application"))
      return "/partner/apikeys";
    if (text.includes("webhook")) return "/partner/webhooks";
    if (text.includes("mapping") || text.includes("schema")) return "/partner/mapping";
    if (text.includes("white") || text.includes("custom")) return "/partner/customizer";
    if (text.includes("billing") || text.includes("commission") || text.includes("invoice"))
      return "/partner/billing";
    if (text.includes("sandbox") || text.includes("simulation")) return "/partner/sandbox";
    if (text.includes("log") || text.includes("telemetry")) return "/partner/logs";
    if (text.includes("sdk") || text.includes("developer")) return "/developers";
    return null;
  }

  if (portal === "admin") {
    if (text.includes("tenant") || text.includes("domain") || text.includes("iam"))
      return "/admin/tenants";
    if (text.includes("shard") || text.includes("health") || text.includes("dns") || text.includes("telemetry"))
      return "/admin/shards";
    if (text.includes("hsm") || text.includes("enclave") || text.includes("signer") || text.includes("key lifecycle"))
      return "/admin/hsm";
    if (text.includes("tariff") || text.includes("quota") || text.includes("wholesale"))
      return "/admin/tariffs";
    return "/admin/tenants";
  }

  if (portal === "verifier") {
    return "/verifier";
  }

  if (portal === "passport") {
    if (text.includes("passport") || text.includes("wallet") || text.includes("home"))
      return "/passport";
    if (text.includes("credential") || text.includes("vault") || text.includes("school"))
      return "/passport/vault";
    if (text.includes("share") || text.includes("disclose") || text.includes("qr"))
      return "/passport/share";
    if (text.includes("audit") || text.includes("activity")) return "/passport/activity";
    return null;
  }

  // Public marketing heuristics
  if (text.includes("verify")) return "/verify";
  if (text.includes("architecture")) return "/architecture";
  if (text.includes("developer") || text.includes("api doc")) return "/developers";
  if (text.includes("wholesale")) return "/wholesale";
  if (text.includes("partner") && text.includes("sis")) return "/partners";
  if (text.includes("onboard") || text.includes("briefing") || text.includes("book"))
    return "/onboarding";
  if (text.includes("sign in") || text === "portal") return "/login";
  return null;
}

export const ROLE_HOME: Record<string, string> = {
  INSTITUTION: "/institution/dashboard",
  PARTNER: "/partner",
  VERIFIER: "/verifier",
  STUDENT: "/passport",
  SUPER_ADMIN: "/admin/tenants",
};

export const ROLE_GUARDS: Record<string, string[]> = {
  "/institution": ["INSTITUTION", "SUPER_ADMIN"],
  "/partner": ["PARTNER", "SUPER_ADMIN"],
  "/admin": ["SUPER_ADMIN"],
  "/verifier": ["VERIFIER", "SUPER_ADMIN", "INSTITUTION"],
  "/passport": ["STUDENT", "SUPER_ADMIN"],
};

/** Infer portal shell from the current URL when page shell prop is missing. */
export function shellFromPathname(pathname: string): PortalShell {
  if (pathname.startsWith("/institution")) return "institution";
  if (pathname.startsWith("/partner")) return "partner";
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/verifier")) return "verifier";
  if (pathname.startsWith("/passport")) return "passport";
  if (pathname.startsWith("/verify/result")) return "blank";
  return "public";
}
