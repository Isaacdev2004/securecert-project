export type TenantSector = "ACADEMIA" | "GOV" | "EXAM" | "PARTNER";

export type TenantStatus =
  | "COMPLIANT"
  | "WARNING"
  | "QUARANTINED"
  | "STAGING";

export type ShardStatus = "PRIMARY" | "SECONDARY" | "DEGRADED" | "COLD";

export type MigrationState =
  | "WAL_REPLAY"
  | "READY_CUTOVER"
  | "PENDING_LOCK"
  | "QUEUED"
  | "DONE";

export type EnclaveRole = "PRIMARY" | "STANDBY" | "COLD";

export type EnclaveStatus = "ONLINE" | "STANDBY" | "ISOLATED";

export type KeyState = "ACTIVE" | "ROTATING" | "RETIRED";

export type CustodianState = "ARMED" | "STANDBY" | "AIR_GAPPED";

export type EventKind = "NOTICE" | "WARNING" | "AUDIT" | "HSM" | "BILLING";

export type AdminTenant = {
  id: string;
  name: string;
  did: string;
  sector: TenantSector;
  domain: string;
  hsmNode: string;
  algo: string;
  anchoredCerts: number;
  partner: string;
  status: TenantStatus;
  rateLimit: string;
  established: string;
};

export type AdminShard = {
  id: string;
  code: string;
  label: string;
  status: ShardStatus;
  tenantCount: number;
  storageUsedTb: number;
  capacityTb: number;
  iops: number;
  records: number;
};

export type ShardMigration = {
  id: string;
  tenantName: string;
  source: string;
  target: string;
  payloadGb: number;
  leaves: number;
  progressPct: number;
  state: MigrationState;
};

export type HsmEnclave = {
  id: string;
  name: string;
  role: EnclaveRole;
  fipsLevel: string;
  hardware: string;
  status: EnclaveStatus;
  tempC: number;
  sigs30d: number;
};

export type RootKey = {
  id: string;
  kid: string;
  suite: string;
  quorum: string;
  slot: string;
  state: KeyState;
  publicHash: string;
};

export type CeremonyCustodian = {
  id: string;
  name: string;
  org: string;
  tokenId: string;
  state: CustodianState;
};

export type TariffTier = {
  id: string;
  code: "A" | "B" | "C" | "FX";
  label: string;
  mintNgn: number;
  queryNgn: number;
  queryUsd?: number;
  discountPct: number;
  burstRpm: number;
  tenancyCount: number;
  examples: string[];
};

export type QuotaAllocation = {
  id: string;
  tenantName: string;
  tier: string;
  monthlyQuota: number;
  consumed: number;
  currency: "NGN" | "USD";
  nearCeiling: boolean;
};

export type ClearingSplit = {
  id: string;
  label: string;
  amountNgn: number;
  pct: number;
};

export type GovernanceEvent = {
  id: string;
  at: string;
  kind: EventKind;
  message: string;
};

export type AdminDemoState = {
  officer: string;
  title: string;
  tenants: AdminTenant[];
  shards: AdminShard[];
  migrations: ShardMigration[];
  enclaves: HsmEnclave[];
  rootKeys: RootKey[];
  custodians: CeremonyCustodian[];
  tariffs: TariffTier[];
  quotas: QuotaAllocation[];
  clearing: ClearingSplit[];
  events: GovernanceEvent[];
  selectedTenantId: string | null;
  kpis: {
    activeTenants: number;
    domains: number;
    anchors: number;
    ndpaPct: number;
    shardLagMs: number;
    hsmSyncMs: number;
    mintRunRate: number;
    wholesaleAvgNgn: number;
    clearingPoolNgn: number;
    escrowNgn: number;
    sigsPerSec: number;
    rotationDaysLeft: number;
  };
  economics: {
    grads: number;
    sisMarginPct: number;
    dividendPerGrad: number;
    annualSurplus: number;
  };
};
