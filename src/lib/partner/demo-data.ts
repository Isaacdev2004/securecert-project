import type {
  FieldMapping,
  LogEvent,
  MappingCandidate,
  PartnerApiKey,
  PartnerApp,
  PartnerDemoState,
  PartnerInvoice,
  PartnerSchool,
  PartnerWebhook,
  SandboxRun,
  SandboxScenario,
  StreamEvent,
  WhiteLabelConfig,
} from "./types";

export const STORAGE_KEY = "legitscan.partner.demo";

export const SEED_SCHOOLS: PartnerSchool[] = [
  {
    id: "ps-unilag",
    name: "University of Lagos",
    did: "did:sc:ng-unilag-01",
    region: "Lagos",
    status: "ACTIVE",
    sisProduct: "EduNova Enterprise",
    syncedRecords: 428400,
    lastHeartbeat: "2026-11-16T22:14:00.000Z",
  },
  {
    id: "ps-laspo",
    name: "Lagos State Polytechnic",
    did: "did:sc:ng-laspo-02",
    region: "Lagos",
    status: "ACTIVE",
    sisProduct: "EduNova Cloud",
    syncedRecords: 112880,
    lastHeartbeat: "2026-11-16T21:50:00.000Z",
  },
  {
    id: "ps-edo",
    name: "Edo State TVET Board",
    did: "did:sc:ng-edo-tvet-03",
    region: "Edo",
    status: "ACTIVE",
    sisProduct: "Banner Ethos",
    syncedRecords: 88420,
    lastHeartbeat: "2026-11-16T20:02:00.000Z",
  },
  {
    id: "ps-apex",
    name: "Apex Institute of Technology",
    did: "did:sc:ng-apex-04",
    region: "Abuja",
    status: "PENDING",
    sisProduct: "EduNova Cloud",
    syncedRecords: 0,
    lastHeartbeat: "2026-11-10T09:00:00.000Z",
  },
  {
    id: "ps-fce",
    name: "Federal College of Education Oyo",
    did: "did:sc:ng-fceoyo-05",
    region: "Oyo",
    status: "ACTIVE",
    sisProduct: "PowerSchool SIS",
    syncedRecords: 64110,
    lastHeartbeat: "2026-11-16T18:40:00.000Z",
  },
  {
    id: "ps-caleb",
    name: "Caleb University",
    did: "did:sc:ng-caleb-06",
    region: "Lagos",
    status: "SANDBOX",
    sisProduct: "EduNova Cloud",
    syncedRecords: 2140,
    lastHeartbeat: "2026-11-15T11:22:00.000Z",
  },
];

export const SEED_APPS: PartnerApp[] = [
  {
    id: "app-1",
    name: "EduNova SIS",
    clientId: "app_edunova_prod_9930f1",
    env: "PROD",
    schoolsAttached: 32,
    scopes: ["credential:register", "cert:batch_sync", "webhook:listen"],
    health: "HEALTHY",
    peakRps: 840,
  },
  {
    id: "app-2",
    name: "Apex Portal Bridge",
    clientId: "app_apex_bridge_1044ba",
    env: "PROD",
    schoolsAttached: 8,
    scopes: ["credential:register", "webhook:listen"],
    health: "DEGRADED",
    peakRps: 120,
  },
  {
    id: "app-3",
    name: "State EMIS Daemon",
    clientId: "app_emis_daemon_stage_08",
    env: "SANDBOX",
    schoolsAttached: 3,
    scopes: ["cert:batch_sync"],
    health: "SANDBOX",
    peakRps: 40,
  },
];

export const SEED_KEYS: PartnerApiKey[] = [
  {
    id: "key-1",
    label: "EduNova SIS Core",
    prefix: "sc_partner_live_89f0",
    kind: "OAUTH_M2M",
    status: "ACTIVE",
    rateLimit: "1000 req/min",
    ips: ["102.89.44.12", "102.89.44.13"],
    scopes: ["credential:register", "cert:batch_sync", "webhook:listen"],
    createdAt: "2026-08-12T10:00:00.000Z",
    lastUsedAt: "2026-11-16T22:10:00.000Z",
  },
  {
    id: "key-2",
    label: "Sandbox Integration",
    prefix: "sc_partner_test_33a1",
    kind: "API_KEY",
    status: "ACTIVE",
    rateLimit: "200 req/min",
    ips: ["*"],
    scopes: ["credential:register"],
    createdAt: "2026-09-01T08:00:00.000Z",
    lastUsedAt: "2026-11-15T16:00:00.000Z",
  },
  {
    id: "key-3",
    label: "State EMIS Relay",
    prefix: "sc_partner_live_4499",
    kind: "MTLS_RELAY",
    status: "PENDING_ROTATION",
    rateLimit: "500 req/min",
    ips: ["41.203.64.18"],
    scopes: ["cert:batch_sync", "webhook:listen"],
    createdAt: "2026-06-20T12:00:00.000Z",
    lastUsedAt: "2026-11-14T09:30:00.000Z",
  },
];

export const SEED_WEBHOOKS: PartnerWebhook[] = [
  {
    id: "wh-1",
    name: "EduNova Prod",
    url: "https://api.edunova.io/v2/webhooks/legitscan/events",
    events: ["credential.anchored", "credential.revoked", "batch.completed"],
    secretMasked: "whsec_••••a91f",
    status: "ACTIVE",
    latencyMs: 42,
    lastSuccessAt: "2026-11-16T22:08:00.000Z",
  },
  {
    id: "wh-2",
    name: "UNILAG Senate",
    url: "https://senate.unilag.edu.ng/hooks/legitscan",
    events: ["credential.anchored", "billing.invoice_settled"],
    secretMasked: "whsec_••••c220",
    status: "ACTIVE",
    latencyMs: 88,
    lastSuccessAt: "2026-11-16T21:55:00.000Z",
  },
  {
    id: "wh-3",
    name: "Moodle OpenBadge",
    url: "https://lms.partner.ng/badges/legitscan",
    events: ["credential.anchored"],
    secretMasked: "whsec_••••11bb",
    status: "DEGRADED",
    latencyMs: 1200,
    lastSuccessAt: "2026-11-15T04:12:00.000Z",
    failReason: "HTTP 502 Bad Gateway",
  },
  {
    id: "wh-4",
    name: "Zenith Escrow",
    url: "https://escrow.zenithbank.com/hooks/sc",
    events: ["billing.invoice_settled"],
    secretMasked: "whsec_••••77e0",
    status: "ACTIVE",
    latencyMs: 65,
    lastSuccessAt: "2026-11-16T18:00:00.000Z",
  },
];

export const SEED_MAPPINGS: FieldMapping[] = [
  {
    id: "fm-1",
    sisField: "student_id",
    transform: "prefix('did:sc:ng-unilag:std:') + hash160(value)",
    targetClaim: "credentialSubject.id",
  },
  {
    id: "fm-2",
    sisField: "matric_no",
    transform: "trim(upper(value))",
    targetClaim: "credentialSubject.matricNo",
  },
  {
    id: "fm-3",
    sisField: "cgpa_score",
    transform: "number(value, 2)",
    targetClaim: "credentialSubject.claims.cgpa",
  },
  {
    id: "fm-4",
    sisField: "program_title",
    transform: "asIs",
    targetClaim: "credentialSubject.degree",
  },
];

export const SEED_CANDIDATES: MappingCandidate[] = [
  {
    id: "mc-1",
    name: "Chukwuemeka David Okafor",
    matric: "180404092",
    program: "B.Sc Computer Science",
    cgpa: 4.82,
  },
  {
    id: "mc-2",
    name: "Amina Chioma Adebayo",
    matric: "190201118",
    program: "B.Eng Electrical Engineering",
    cgpa: 4.41,
  },
  {
    id: "mc-3",
    name: "Babajide Femi Adeleke",
    matric: "170308044",
    program: "B.A Economics",
    cgpa: 3.92,
  },
];

export const SEED_WHITELABEL: WhiteLabelConfig = {
  schoolId: "ps-unilag",
  fqdn: "verify.unilag.edu.ng",
  brandMode: "DUAL",
  obfuscateMatric: true,
  lockGpa: true,
  deployStatus: "LIVE",
  updatedAt: "2026-11-12T14:00:00.000Z",
};

export const SEED_INVOICES: PartnerInvoice[] = [
  {
    id: "inv-1",
    schoolId: "ps-unilag",
    schoolName: "University of Lagos",
    certs: 12400,
    amountNgn: 1612000,
    status: "SETTLED",
    period: "2026-Q1",
  },
  {
    id: "inv-2",
    schoolId: "ps-laspo",
    schoolName: "Lagos State Polytechnic",
    certs: 6200,
    amountNgn: 806000,
    status: "SETTLED",
    period: "2026-Q1",
  },
  {
    id: "inv-3",
    schoolId: "ps-edo",
    schoolName: "Edo State TVET Board",
    certs: 4100,
    amountNgn: 533000,
    status: "PENDING",
    period: "2026-Q1",
  },
  {
    id: "inv-4",
    schoolId: "ps-fce",
    schoolName: "Federal College of Education Oyo",
    certs: 2800,
    amountNgn: 364000,
    status: "SETTLED",
    period: "2026-Q1",
  },
  {
    id: "inv-5",
    schoolId: "ps-caleb",
    schoolName: "Caleb University",
    certs: 900,
    amountNgn: 117000,
    status: "DRAFT",
    period: "2026-Q1",
  },
  {
    id: "inv-6",
    schoolId: "ps-apex",
    schoolName: "Apex Institute of Technology",
    certs: 0,
    amountNgn: 0,
    status: "DRAFT",
    period: "2026-Q1",
  },
];

export const SEED_SCENARIOS: SandboxScenario[] = [
  {
    id: "sc-banner",
    title: "Banner cohort 1000",
    detail: "Simulate 1,000 Banner Ethos credential anchors with healthy quorum.",
  },
  {
    id: "sc-tamper",
    title: "Tampered GPA",
    detail: "Inject CGPA 4.82→4.95 and expect WES desk rejection.",
  },
  {
    id: "sc-odbc",
    title: "ODBC drop mid-batch",
    detail: "Drop connector at row #412; expect partial commit + retry queue.",
  },
  {
    id: "sc-quorum",
    title: "M-of-N quorum fail",
    detail: "Only 2 of 4 senate keys present — batch should fail closed.",
  },
];

export const SEED_SANDBOX_RUNS: SandboxRun[] = [
  {
    id: "sr-1",
    scenarioId: "sc-banner",
    at: "2026-11-14T10:20:00.000Z",
    batchSize: 1000,
    success: 1000,
    failed: 0,
    note: "All anchors sealed",
  },
];

export const SEED_LOGS: LogEvent[] = [
  {
    id: "lg-1",
    at: "2026-11-16T22:12:00.000Z",
    school: "University of Lagos",
    connector: "EduNova SIS",
    method: "POST",
    path: "/v1/credentials/batch",
    status: 200,
    latencyMs: 18,
    detail: "batch_ref bch_01h8q7k9_los · 240 records",
  },
  {
    id: "lg-2",
    at: "2026-11-16T21:58:00.000Z",
    school: "Covenant University",
    connector: "REST Gateway",
    method: "POST",
    path: "/v1/credentials",
    status: 422,
    latencyMs: 32,
    detail: "Schema validation · missing matricNo",
  },
  {
    id: "lg-3",
    at: "2026-11-16T21:40:00.000Z",
    school: "University of Lagos",
    connector: "Banner Ethos",
    method: "POST",
    path: "/v1/sync/odbc",
    status: 504,
    latencyMs: 8000,
    detail: "Upstream SIS timeout",
  },
  {
    id: "lg-4",
    at: "2026-11-16T20:15:00.000Z",
    school: "EduNova Gateway",
    connector: "gRPC",
    method: "Invoke",
    path: "legitscan.v1.Ingest/Anchor",
    status: 200,
    latencyMs: 12,
    detail: "Adewale Babatunde Adeleke · B.Sc ECE 4.82",
  },
];

export const SEED_STREAM: StreamEvent[] = [
  {
    id: "st-1",
    at: "2026-11-16T22:14:00.000Z",
    kind: "INGEST",
    message: "Lagos City Polytechnic · 180 anchors · digest 0x8a9f…c21",
  },
  {
    id: "st-2",
    at: "2026-11-16T22:02:00.000Z",
    kind: "INGEST",
    message: "Federal University Akure · 96 anchors · digest 0x44de…91a0",
  },
  {
    id: "st-3",
    at: "2026-11-16T21:50:00.000Z",
    kind: "WEBHOOK",
    message: "EduNova Prod delivered credential.anchored · 200 · 41ms",
  },
];

export function createSeedState(): PartnerDemoState {
  return {
    partnerName: "EduTech Global Solutions",
    partnerId: "ETG-SIS-77092-NG",
    officer: "Engr. D. Adeleke",
    tier: "GOLD PARTNER TIER-1",
    env: "PROD",
    schools: structuredClone(SEED_SCHOOLS),
    applications: structuredClone(SEED_APPS),
    apiKeys: structuredClone(SEED_KEYS),
    webhooks: structuredClone(SEED_WEBHOOKS),
    dlqCount: 14,
    mappings: structuredClone(SEED_MAPPINGS),
    mappingCandidates: structuredClone(SEED_CANDIDATES),
    whiteLabel: structuredClone(SEED_WHITELABEL),
    invoices: structuredClone(SEED_INVOICES),
    sandboxScenarios: structuredClone(SEED_SCENARIOS),
    sandboxRuns: structuredClone(SEED_SANDBOX_RUNS),
    selectedScenarioId: "sc-banner",
    sandboxBatchSize: 1250,
    logEvents: structuredClone(SEED_LOGS),
    stream: structuredClone(SEED_STREAM),
    kpis: {
      tenancies: 48,
      monthlyIngest: 142580,
      ingestQuota: 200000,
      ytdRevenueNgn: 18400000,
      latencyMs: 24,
      marginAccruedNgn: 3850000,
      commissionPct: 52,
      unitMarginNgn: 130,
    },
    billing: {
      mtdGrossNgn: 7403750,
      mtdCogsNgn: 3553750,
      mtdNetNgn: 3657500,
      mtdCerts: 29615,
      bankName: "Zenith Bank Plc",
      accountNumber: "1014892019",
      nextWireAt: "2026-03-31T00:00:00.000Z",
    },
  };
}

export function normalizeState(
  partial: Partial<PartnerDemoState>,
): PartnerDemoState {
  const seed = createSeedState();
  return {
    ...seed,
    ...partial,
    schools: partial.schools?.length ? partial.schools : seed.schools,
    applications: partial.applications?.length
      ? partial.applications
      : seed.applications,
    apiKeys: partial.apiKeys?.length ? partial.apiKeys : seed.apiKeys,
    webhooks: partial.webhooks?.length ? partial.webhooks : seed.webhooks,
    mappings: partial.mappings?.length ? partial.mappings : seed.mappings,
    mappingCandidates: partial.mappingCandidates?.length
      ? partial.mappingCandidates
      : seed.mappingCandidates,
    whiteLabel: partial.whiteLabel
      ? { ...seed.whiteLabel, ...partial.whiteLabel }
      : seed.whiteLabel,
    invoices: partial.invoices?.length ? partial.invoices : seed.invoices,
    sandboxScenarios: partial.sandboxScenarios?.length
      ? partial.sandboxScenarios
      : seed.sandboxScenarios,
    sandboxRuns: partial.sandboxRuns?.length
      ? partial.sandboxRuns
      : seed.sandboxRuns,
    logEvents: partial.logEvents?.length ? partial.logEvents : seed.logEvents,
    stream: partial.stream?.length ? partial.stream : seed.stream,
    kpis: partial.kpis ? { ...seed.kpis, ...partial.kpis } : seed.kpis,
    billing: partial.billing
      ? { ...seed.billing, ...partial.billing }
      : seed.billing,
  };
}

export function randomPrefix(kind: "live" | "test" = "live") {
  const hex = Math.random().toString(16).slice(2, 10);
  return `sc_partner_${kind}_${hex}`;
}

export function schoolById(state: PartnerDemoState, id: string) {
  return state.schools.find((s) => s.id === id);
}
