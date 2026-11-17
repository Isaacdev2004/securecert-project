import type {
  AuditDispatch,
  ConsentGrant,
  IssuingUniversity,
  SettlementLine,
  TamperAlert,
  VerificationBatch,
  VerificationCase,
  VerifierApiKey,
  VerifierDemoState,
} from "./types";

export const STORAGE_KEY = "legitscan.verifier.demo";

export const SEED_UNIVERSITIES: IssuingUniversity[] = [
  { code: "UNILAG", name: "University of Lagos (UNILAG)", hsmLabel: "UNILAG-HSM-ROOT-04" },
  { code: "ABU", name: "Ahmadu Bello University (ABU Zaria)", hsmLabel: "ABU-HSM-ROOT-02" },
  { code: "UI", name: "University of Ibadan (UI)", hsmLabel: "UI-HSM-ROOT-01" },
  { code: "UNN", name: "University of Nigeria, Nsukka (UNN)", hsmLabel: "UNN-HSM-ROOT-03" },
  { code: "CU", name: "Covenant University (CU Ota)", hsmLabel: "CU-HSM-ROOT-01" },
  { code: "OAU", name: "Obafemi Awolowo University (OAU)", hsmLabel: "OAU-HSM-ROOT-02" },
];

export const SEED_CASES: VerificationCase[] = [
  {
    id: "vc-001",
    candidateName: "Babatunde Adeleke Emmanuel",
    initials: "BA",
    matricNumber: "190408012",
    universityCode: "UNILAG",
    degreeLine: "B.Eng First Class Honours (4.82 CGPA)",
    artifact: "Degree + 5-Yr Transcript",
    artifactFormat: "W3C VC 2.0 // JSON-LD",
    agency: "High Commission of Canada",
    purposeRef: "Study/Work Visa IRCC #8194-e8f2",
    officer: "Marcus Vance, FSO",
    purpose: "VISA",
    consentStatus: "ACTIVE",
    cryptoStatus: "MATCH",
    did: "did:legitscan:ng:unilag:grad:2024:08194",
    merkleRoot: "0x82b4a1…31fc",
    blockRef: "SEN-2024-Q3-0812",
    attested: true,
    focused: true,
  },
  {
    id: "vc-002",
    candidateName: "Chioma Okonkwo",
    initials: "CO",
    matricNumber: "UI/2019/4821",
    universityCode: "UI",
    degreeLine: "B.Sc Computer Science · Second Class Upper",
    artifact: "Degree Parchment",
    artifactFormat: "W3C VC 2.0",
    agency: "World Education Services",
    purposeRef: "WES Eval #CA-992184",
    officer: "WES Desk · Toronto",
    purpose: "WES",
    consentStatus: "BLINDED",
    cryptoStatus: "MERKLE_VALID",
    did: "did:legitscan:ng:ui:grad:2023:4821",
    merkleRoot: "0x11ae90…c4d2",
    blockRef: "UI-SEN-2023-8841",
    attested: true,
  },
  {
    id: "vc-003",
    candidateName: "Ibrahim Musa Abdullahi",
    initials: "IM",
    matricNumber: "U19EG1021",
    universityCode: "ABU",
    degreeLine: "B.Eng Civil Engineering · First Class",
    artifact: "Transcript Pack",
    artifactFormat: "JSON-LD + EMREX",
    agency: "UK ENIC",
    purposeRef: "ENIC Statement #UK-44102",
    officer: "ENIC Intake",
    purpose: "WES",
    consentStatus: "ACTIVE",
    cryptoStatus: "ZK_OK",
    did: "did:legitscan:ng:abu:grad:2024:1021",
    merkleRoot: "0x55f0c2…9aa1",
    blockRef: "ABU-2024-T3-221",
    attested: true,
  },
  {
    id: "vc-004",
    candidateName: "Adaeze Nnamani",
    initials: "AN",
    matricNumber: "2018/184422",
    universityCode: "UNN",
    degreeLine: "LL.B · Second Class Upper",
    artifact: "Degree + Bar Eligibility Letter",
    artifactFormat: "PDF/A-3 sealed",
    agency: "Chevron Talent Acquisition",
    purposeRef: "Corporate hire · Lagos HQ",
    officer: "TA Ops",
    purpose: "CORPORATE",
    consentStatus: "ACTIVE",
    cryptoStatus: "MINISTRY_SEALED",
    did: "did:legitscan:ng:unn:grad:2022:184422",
    merkleRoot: "0x90bb12…eef0",
    blockRef: "UNN-LAW-2022-091",
    attested: true,
  },
  {
    id: "vc-005",
    candidateName: "Tunde Afolabi",
    initials: "TA",
    matricNumber: "CSC/2017/00912",
    universityCode: "OAU",
    degreeLine: "B.Sc Computer Science · Suspended record",
    artifact: "Degree Claim",
    artifactFormat: "W3C VC 2.0",
    agency: "High Commission of Canada",
    purposeRef: "Visa IRCC #7721-blocked",
    officer: "Marcus Vance, FSO",
    purpose: "EXCEPTION",
    consentStatus: "REVOKED",
    cryptoStatus: "BLOCKED",
    did: "did:legitscan:ng:oau:grad:2021:00912",
    merkleRoot: "0xdead00…rev1",
    blockRef: "OAU-REV-2025-014",
    attested: false,
  },
];

export const SEED_BATCHES: VerificationBatch[] = [
  {
    id: "vb-010",
    label: "#CAN-VISA-2024-B10",
    format: "CSV + JSON-LD",
    candidateCount: 120,
    verified: 118,
    invalid: 2,
    durationMs: 1400,
    usdCleared: 540,
    status: "COMPLETED",
    createdAt: "2026-11-14T16:20:00.000Z",
  },
  {
    id: "vb-009",
    label: "#WES-CA-2024-B09",
    format: "SEVIS XML",
    candidateCount: 48,
    verified: 48,
    invalid: 0,
    durationMs: 820,
    usdCleared: 216,
    status: "COMPLETED",
    createdAt: "2026-11-10T11:05:00.000Z",
  },
];

export const SEED_CONSENTS: ConsentGrant[] = [
  {
    id: "cg-001",
    caseId: "vc-001",
    candidateName: "Babatunde Adeleke Emmanuel",
    blindedToken: "ndpa_zk_81f4…c2",
    revealed: ["fullName", "degreeTitle", "classification", "conferralDate"],
    blinded: ["NIN", "homeAddress", "phone", "guardian"],
    expiresAt: "2026-12-31T23:59:00.000Z",
    status: "ACTIVE",
  },
  {
    id: "cg-002",
    caseId: "vc-002",
    candidateName: "Chioma Okonkwo",
    blindedToken: "ndpa_zk_22aa…91",
    revealed: ["fullName", "degreeTitle"],
    blinded: ["CGPA", "NIN", "homeAddress", "transcriptLines"],
    expiresAt: "2026-11-30T23:59:00.000Z",
    status: "BLINDED",
  },
  {
    id: "cg-003",
    caseId: "vc-005",
    candidateName: "Tunde Afolabi",
    blindedToken: "ndpa_zk_revoked",
    revealed: [],
    blinded: ["fullName", "degreeTitle", "NIN"],
    expiresAt: "2026-10-01T00:00:00.000Z",
    status: "REVOKED",
  },
];

export const SEED_ALERTS: TamperAlert[] = [
  {
    id: "ta-001",
    caseId: "vc-005",
    severity: "CRITICAL",
    title: "Revocation radar hit",
    detail: "OAU senate revoked credential · ACCESS BLOCKED for IRCC desk",
    at: "2026-11-12T08:14:00.000Z",
    resolved: false,
  },
  {
    id: "ta-002",
    caseId: null,
    severity: "INFO",
    title: "Hash integrity sweep clean",
    detail: "Poseidon-2 quorum 3-of-3 · 0 tamper flags in last 24h",
    at: "2026-11-16T06:00:00.000Z",
    resolved: true,
  },
];

export const SEED_SETTLEMENTS: SettlementLine[] = [
  {
    id: "st-1",
    at: "2026-11-14T16:22:00.000Z",
    label: "Batch CAN-VISA-2024-B10 clearing",
    amountUsd: 540,
    univShareUsd: 216,
    batchId: "vb-010",
  },
  {
    id: "st-2",
    at: "2026-11-10T11:08:00.000Z",
    label: "Batch WES-CA-2024-B09 clearing",
    amountUsd: 216,
    univShareUsd: 86.4,
    batchId: "vb-009",
  },
  {
    id: "st-3",
    at: "2026-11-08T09:40:00.000Z",
    label: "Single-desk IRCC attestations",
    amountUsd: 180,
    univShareUsd: 72,
  },
];

export const SEED_API_KEYS: VerifierApiKey[] = [
  {
    id: "vak-1",
    name: "IRCC Gateway Ingress",
    prefix: "vfy_live_ircc_",
    status: "ACTIVE",
    createdAt: "2026-09-01T10:00:00.000Z",
    lastUsedAt: "2026-11-16T09:12:00.000Z",
  },
  {
    id: "vak-2",
    name: "WES Sandbox",
    prefix: "vfy_test_wes_",
    status: "ACTIVE",
    createdAt: "2026-10-15T14:00:00.000Z",
    lastUsedAt: "2026-11-14T18:01:00.000Z",
  },
];

export const SEED_DISPATCHES: AuditDispatch[] = [
  {
    id: "ad-1",
    at: "2026-11-16T09:57:00.000Z",
    kind: "VERIFY",
    actor: "Marcus Vance, FSO",
    message: "Instant seal verified · Babatunde Adeleke Emmanuel · MATCH",
    caseId: "vc-001",
  },
  {
    id: "ad-2",
    at: "2026-11-15T13:20:00.000Z",
    kind: "DOSSIER",
    actor: "System",
    message: "Diplomatic PDF/A-3 compiled for IRCC #8194-e8f2",
    caseId: "vc-001",
    dossierRef: "DOS-CAN-8194",
  },
  {
    id: "ad-3",
    at: "2026-11-12T08:14:00.000Z",
    kind: "TAMPER",
    actor: "Revocation Radar",
    message: "Blocked Tunde Afolabi · OAU revocation ledger",
    caseId: "vc-005",
  },
  {
    id: "ad-4",
    at: "2026-11-14T16:20:00.000Z",
    kind: "INGRESS",
    actor: "Batch Runner",
    message: "Cohort #CAN-VISA-2024-B10 completed · 118/120",
    caseId: undefined,
  },
];

export function createSeedState(): VerifierDemoState {
  return {
    orgName: "High Commission of Canada",
    section: "Immigration & Visa Section",
    officer: "Marcus Vance, FSO",
    sessionId: "CAN-CONSULAR-0894",
    mtlsPeer: "ircc-gateway.diplomatique.gc.ca",
    universities: structuredClone(SEED_UNIVERSITIES),
    cases: structuredClone(SEED_CASES),
    batches: structuredClone(SEED_BATCHES),
    consents: structuredClone(SEED_CONSENTS),
    alerts: structuredClone(SEED_ALERTS),
    settlements: structuredClone(SEED_SETTLEMENTS),
    apiKeys: structuredClone(SEED_API_KEYS),
    dispatches: structuredClone(SEED_DISPATCHES),
    escrowBalanceUsd: 3850,
    tariffUsd: 4.5,
    univSharePct: 40,
    inquiries30d: 2840,
    consentRate: 98.6,
    activeGrants: 2801,
    timedOutGrants: 39,
    clearedUsd30d: 12780,
    selectedCaseId: "vc-001",
    lastAttestation: {
      candidateName: "Babatunde Adeleke Emmanuel",
      detail: "Degree Conferred 14 Oct 2024 by UNILAG Senate (Docket #SEN-2024-Q3-0812)",
      merkleRoot: "0x82b4a1…31fc",
      ingressToken: "CAN-IRCC-V4-9982",
      universityCode: "UNILAG",
      at: "2026-11-16T09:57:00.000Z",
    },
  };
}

export function normalizeState(
  partial: Partial<VerifierDemoState>,
): VerifierDemoState {
  const seed = createSeedState();
  return {
    ...seed,
    ...partial,
    universities: partial.universities?.length
      ? partial.universities
      : seed.universities,
    cases: partial.cases?.length ? partial.cases : seed.cases,
    batches: partial.batches?.length ? partial.batches : seed.batches,
    consents: partial.consents?.length ? partial.consents : seed.consents,
    alerts: partial.alerts?.length ? partial.alerts : seed.alerts,
    settlements: partial.settlements?.length
      ? partial.settlements
      : seed.settlements,
    apiKeys: partial.apiKeys?.length ? partial.apiKeys : seed.apiKeys,
    dispatches: partial.dispatches?.length
      ? partial.dispatches
      : seed.dispatches,
  };
}

export function caseById(state: VerifierDemoState, id: string | null) {
  if (!id) return undefined;
  return state.cases.find((c) => c.id === id);
}

export function randomMerkle() {
  const hex = Math.random().toString(16).slice(2, 10);
  return `0x${hex}…${Math.random().toString(16).slice(2, 6)}`;
}

export function randomToken(prefix = "vfy_live_") {
  return `${prefix}${Math.random().toString(36).slice(2, 10)}_`;
}
