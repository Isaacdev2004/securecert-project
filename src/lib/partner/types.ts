export type PartnerEnv = "PROD" | "SANDBOX";

export type SchoolStatus = "ACTIVE" | "PENDING" | "SANDBOX";

export type KeyStatus = "ACTIVE" | "PENDING_ROTATION" | "REVOKED";

export type WebhookStatus = "ACTIVE" | "DEGRADED" | "DISABLED";

export type AppHealth = "HEALTHY" | "DEGRADED" | "SANDBOX";

export type BrandMode = "DUAL" | "SOVEREIGN" | "GOVERNMENT";

export type StreamKind =
  | "INGEST"
  | "WEBHOOK"
  | "BILLING"
  | "AUTH"
  | "SANDBOX"
  | "ERROR";

export type PartnerSchool = {
  id: string;
  name: string;
  did: string;
  region: string;
  status: SchoolStatus;
  sisProduct: string;
  syncedRecords: number;
  lastHeartbeat: string;
};

export type PartnerApp = {
  id: string;
  name: string;
  clientId: string;
  env: PartnerEnv;
  schoolsAttached: number;
  scopes: string[];
  health: AppHealth;
  peakRps: number;
};

export type PartnerApiKey = {
  id: string;
  label: string;
  prefix: string;
  kind: "OAUTH_M2M" | "API_KEY" | "MTLS_RELAY";
  status: KeyStatus;
  rateLimit: string;
  ips: string[];
  scopes: string[];
  createdAt: string;
  lastUsedAt: string | null;
};

export type PartnerWebhook = {
  id: string;
  name: string;
  url: string;
  events: string[];
  secretMasked: string;
  status: WebhookStatus;
  latencyMs: number;
  lastSuccessAt: string | null;
  failReason?: string;
};

export type FieldMapping = {
  id: string;
  sisField: string;
  transform: string;
  targetClaim: string;
};

export type MappingCandidate = {
  id: string;
  name: string;
  matric: string;
  program: string;
  cgpa: number;
};

export type WhiteLabelConfig = {
  schoolId: string;
  fqdn: string;
  brandMode: BrandMode;
  obfuscateMatric: boolean;
  lockGpa: boolean;
  deployStatus: "DRAFT" | "SANDBOX" | "LIVE";
  updatedAt: string;
};

export type PartnerInvoice = {
  id: string;
  schoolId: string;
  schoolName: string;
  certs: number;
  amountNgn: number;
  status: "SETTLED" | "PENDING" | "DRAFT";
  period: string;
};

export type SandboxScenario = {
  id: string;
  title: string;
  detail: string;
};

export type SandboxRun = {
  id: string;
  scenarioId: string;
  at: string;
  batchSize: number;
  success: number;
  failed: number;
  note: string;
};

export type LogEvent = {
  id: string;
  at: string;
  school: string;
  connector: string;
  method: string;
  path: string;
  status: number;
  latencyMs: number;
  detail: string;
};

export type StreamEvent = {
  id: string;
  at: string;
  kind: StreamKind;
  message: string;
};

export type PartnerDemoState = {
  partnerName: string;
  partnerId: string;
  officer: string;
  tier: string;
  env: PartnerEnv;
  schools: PartnerSchool[];
  applications: PartnerApp[];
  apiKeys: PartnerApiKey[];
  webhooks: PartnerWebhook[];
  dlqCount: number;
  mappings: FieldMapping[];
  mappingCandidates: MappingCandidate[];
  whiteLabel: WhiteLabelConfig;
  invoices: PartnerInvoice[];
  sandboxScenarios: SandboxScenario[];
  sandboxRuns: SandboxRun[];
  selectedScenarioId: string;
  sandboxBatchSize: number;
  logEvents: LogEvent[];
  stream: StreamEvent[];
  kpis: {
    tenancies: number;
    monthlyIngest: number;
    ingestQuota: number;
    ytdRevenueNgn: number;
    latencyMs: number;
    marginAccruedNgn: number;
    commissionPct: number;
    unitMarginNgn: number;
  };
  billing: {
    mtdGrossNgn: number;
    mtdCogsNgn: number;
    mtdNetNgn: number;
    mtdCerts: number;
    bankName: string;
    accountNumber: string;
    nextWireAt: string;
  };
};
