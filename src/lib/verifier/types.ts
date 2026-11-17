export type CasePurpose =
  | "VISA"
  | "WES"
  | "CORPORATE"
  | "PRODUCT"
  | "GOVERNMENT"
  | "EXCEPTION";

export type ConsentStatus =
  | "ACTIVE"
  | "BLINDED"
  | "TIMED_OUT"
  | "REVOKED"
  | "PENDING";

export type CryptoStatus =
  | "MATCH"
  | "MERKLE_VALID"
  | "ZK_OK"
  | "MINISTRY_SEALED"
  | "BLOCKED";

export type BatchStatus = "QUEUED" | "RUNNING" | "COMPLETED" | "FAILED";

export type ApiKeyStatus = "ACTIVE" | "REVOKED";

export type DispatchKind =
  | "VERIFY"
  | "DOSSIER"
  | "CONSENT"
  | "TAMPER"
  | "BILLING"
  | "INGRESS";

export type IssuingUniversity = {
  code: string;
  name: string;
  hsmLabel: string;
};

export type VerificationCase = {
  id: string;
  candidateName: string;
  initials: string;
  matricNumber: string;
  universityCode: string;
  degreeLine: string;
  artifact: string;
  artifactFormat: string;
  agency: string;
  purposeRef: string;
  officer: string;
  purpose: CasePurpose;
  consentStatus: ConsentStatus;
  cryptoStatus: CryptoStatus;
  did: string;
  merkleRoot: string;
  blockRef: string;
  attested: boolean;
  focused?: boolean;
};

export type VerificationBatch = {
  id: string;
  label: string;
  format: string;
  candidateCount: number;
  verified: number;
  invalid: number;
  durationMs: number;
  usdCleared: number;
  status: BatchStatus;
  createdAt: string;
};

export type ConsentGrant = {
  id: string;
  caseId: string;
  candidateName: string;
  blindedToken: string;
  revealed: string[];
  blinded: string[];
  expiresAt: string;
  status: ConsentStatus;
};

export type TamperAlert = {
  id: string;
  caseId: string | null;
  severity: "INFO" | "WARN" | "CRITICAL";
  title: string;
  detail: string;
  at: string;
  resolved: boolean;
};

export type SettlementLine = {
  id: string;
  at: string;
  label: string;
  amountUsd: number;
  univShareUsd: number;
  batchId?: string;
};

export type VerifierApiKey = {
  id: string;
  name: string;
  prefix: string;
  status: ApiKeyStatus;
  createdAt: string;
  lastUsedAt: string | null;
};

export type AuditDispatch = {
  id: string;
  at: string;
  kind: DispatchKind;
  actor: string;
  message: string;
  caseId?: string;
  dossierRef?: string;
};

export type InstantAttestation = {
  candidateName: string;
  detail: string;
  merkleRoot: string;
  ingressToken: string;
  universityCode: string;
  at: string;
} | null;

export type VerifierDemoState = {
  orgName: string;
  section: string;
  officer: string;
  sessionId: string;
  mtlsPeer: string;
  universities: IssuingUniversity[];
  cases: VerificationCase[];
  batches: VerificationBatch[];
  consents: ConsentGrant[];
  alerts: TamperAlert[];
  settlements: SettlementLine[];
  apiKeys: VerifierApiKey[];
  dispatches: AuditDispatch[];
  escrowBalanceUsd: number;
  tariffUsd: number;
  univSharePct: number;
  inquiries30d: number;
  consentRate: number;
  activeGrants: number;
  timedOutGrants: number;
  clearedUsd30d: number;
  selectedCaseId: string | null;
  lastAttestation: InstantAttestation;
};
