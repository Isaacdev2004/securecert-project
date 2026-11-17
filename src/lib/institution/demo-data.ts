import type {
  ApiKeyRecord,
  BulkJob,
  CertificateTemplate,
  DemoCredential,
  DemoRecipient,
  FieldMapping,
  InstitutionDemoState,
  StreamEvent,
  TeamMember,
  WebhookRecord,
} from "./types";

const TENANT = "11111111-1111-1111-1111-111111111111";

export const STORAGE_KEY = "legitscan.institution.demo.v3";

export const SEED_RECIPIENTS: DemoRecipient[] = [
  {
    id: "rec-001",
    fullName: "Babatunde Adeleke Emmanuel",
    email: "babatunde@student.unilag.edu.ng",
    matricNumber: "180407044",
    program: "B.Eng. Electrical & Electronics Engineering",
    graduationYear: 2024,
  },
  {
    id: "rec-002",
    fullName: "Chioma Okeke",
    email: "chioma.okeke@student.unilag.edu.ng",
    matricNumber: "190302118",
    program: "B.Sc. Computer Science",
    graduationYear: 2025,
  },
  {
    id: "rec-003",
    fullName: "Ibrahim Musa",
    email: "ibrahim.musa@student.unilag.edu.ng",
    matricNumber: "170501203",
    program: "LL.B. Law",
    graduationYear: 2023,
  },
  {
    id: "rec-004",
    fullName: "Adaora Nwosu",
    email: "adaora.nwosu@student.unilag.edu.ng",
    matricNumber: "200214055",
    program: "B.Pharm. Pharmacy",
    graduationYear: 2026,
  },
  {
    id: "rec-005",
    fullName: "Emeka Obi",
    email: "emeka.obi@student.unilag.edu.ng",
    matricNumber: "160908077",
    program: "M.Sc. Data Science",
    graduationYear: 2024,
  },

  {
    id: "rec-006",
    fullName: "Ngozi Adebayo",
    email: "ngozi.adebayo@citizens.lagos.ng",
    matricNumber: "LAG/BLD/2024/88421",
    program: "Building Plan Approval",
    graduationYear: 2024,
  },
  {
    id: "rec-007",
    fullName: "OceanFresh Beverages Ltd",
    email: "compliance@oceanfresh.ng",
    matricNumber: "SKU-OF-500ML-BATCH-441",
    program: "Bottled water authenticity",
    graduationYear: 2026,
  },
  {
    id: "rec-008",
    fullName: "Chinedu Okonkwo",
    email: "chinedu.okonkwo@gmail.com",
    matricNumber: "NIMC/NIN/9988776655",
    program: "National ID verification pack",
    graduationYear: 2025,
  },
  {
    id: "rec-009",
    fullName: "Tolu Aina",
    email: "tolu.aina@parent.mail",
    matricNumber: "PSLC/2012/88421",
    program: "Primary School Leaving Certificate",
    graduationYear: 2012,
  },
  {
    id: "rec-010",
    fullName: "Babatunde Adeleke Emmanuel",
    email: "babatunde@student.unilag.edu.ng",
    matricNumber: "4123456789",
    program: "WAEC Senior School Certificate",
    graduationYear: 2018,
  },
  {
    id: "rec-011",
    fullName: "Funmilayo Ajayi",
    email: "funmilayo.ajayi@ican.ng",
    matricNumber: "ICAN/ACA/77821",
    program: "ICAN Associate Membership",
    graduationYear: 2023,
  },
];

export const SEED_CREDENTIALS: DemoCredential[] = [
  {
    id: "cred-001",
    recipientId: "rec-001",
    did: "did:legitscan:unilag:180407044",
    status: "ISSUED",
    rail: "EDUCATION" as const,
    educationLevel: "UNIVERSITY",
    credentialType: "UniversityDegreeCredential",
    title: "B.Eng. Electrical & Electronics Engineering",
    classification: "First Class Honours",
    issuedAt: "2024-11-12T10:22:00.000Z",
    revokedAt: null,
    revokeReason: null,
    merkleRoot: "0x9af28c1e7d4b…a91f",
    createdAt: "2024-11-12T10:20:00.000Z",
  },
  {
    id: "cred-002",
    recipientId: "rec-002",
    did: "did:legitscan:unilag:190302118",
    status: "PENDING_SIGNATURE",
    rail: "EDUCATION" as const,
    educationLevel: "UNIVERSITY",
    credentialType: "UniversityDegreeCredential",
    title: "B.Sc. Computer Science",
    classification: "Second Class Upper",
    issuedAt: null,
    revokedAt: null,
    revokeReason: null,
    merkleRoot: "0xpending…sync",
    createdAt: "2026-03-01T08:14:00.000Z",
  },
  {
    id: "cred-003",
    recipientId: "rec-003",
    did: "did:legitscan:unilag:170501203",
    status: "REVOKED",
    rail: "EDUCATION" as const,
    educationLevel: "UNIVERSITY",
    credentialType: "UniversityDegreeCredential",
    title: "LL.B. Law",
    classification: "Second Class Lower",
    issuedAt: "2023-09-18T14:05:00.000Z",
    revokedAt: "2025-01-09T11:40:00.000Z",
    revokeReason: "Administrative reissue required",
    merkleRoot: "0x7c21aa…91b0",
    createdAt: "2023-09-18T14:00:00.000Z",
  },
  {
    id: "cred-004",
    recipientId: "rec-004",
    did: "did:legitscan:unilag:200214055",
    status: "ISSUED",
    rail: "EDUCATION" as const,
    educationLevel: "UNIVERSITY",
    credentialType: "UniversityDegreeCredential",
    title: "B.Pharm. Pharmacy",
    classification: "Distinction",
    issuedAt: "2026-02-20T09:30:00.000Z",
    revokedAt: null,
    revokeReason: null,
    merkleRoot: "0x44de91…c02a",
    createdAt: "2026-02-20T09:28:00.000Z",
  },
  {
    id: "cred-005",
    recipientId: "rec-005",
    did: "did:legitscan:unilag:160908077",
    status: "ISSUED",
    rail: "EDUCATION" as const,
    educationLevel: "UNIVERSITY",
    credentialType: "UniversityDegreeCredential",
    title: "M.Sc. Data Science",
    classification: "Merit",
    issuedAt: "2024-12-02T16:12:00.000Z",
    revokedAt: null,
    revokeReason: null,
    merkleRoot: "0xbb18f0…de44",
    createdAt: "2024-12-02T16:10:00.000Z",
  },

  {
    id: "cred-006",
    recipientId: "rec-006",
    did: "did:legitscan:lagos:bld:88421",
    status: "ISSUED",
    rail: "GOVERNMENT" as const,
    educationLevel: null,
    credentialType: "BuildingApprovalCredential",
    title: "Lagos Building Plan Approval",
    classification: "Residential · Valid",
    issuedAt: "2024-06-18T11:00:00.000Z",
    revokedAt: null,
    revokeReason: null,
    merkleRoot: "0xgov81a…c4e2",
    createdAt: "2024-06-18T10:58:00.000Z",
  },
  {
    id: "cred-007",
    recipientId: "rec-007",
    did: "did:legitscan:brand:oceanfresh:441",
    status: "ISSUED",
    rail: "PRODUCT" as const,
    educationLevel: null,
    credentialType: "ProductAuthenticityCredential",
    title: "OceanFresh 500ml · Batch 441",
    classification: "Genuine · Anti-counterfeit seal",
    issuedAt: "2026-10-02T08:15:00.000Z",
    revokedAt: null,
    revokeReason: null,
    merkleRoot: "0xprod55…9aa1",
    createdAt: "2026-10-02T08:12:00.000Z",
  },
  {
    id: "cred-008",
    recipientId: "rec-008",
    did: "did:legitscan:nimc:9988776655",
    status: "PENDING_SIGNATURE",
    rail: "GOVERNMENT" as const,
    educationLevel: null,
    credentialType: "OfficialIdentityPack",
    title: "NIMC Identity Attestation Pack",
    classification: "Citizen · Selective disclosure",
    issuedAt: null,
    revokedAt: null,
    revokeReason: null,
    merkleRoot: "0xpending…gov",
    createdAt: "2026-11-10T09:00:00.000Z",
  },
  {
    id: "cred-009",
    recipientId: "rec-009",
    did: "did:legitscan:primary:pslc201288421",
    status: "ISSUED",
    rail: "EDUCATION" as const,
    educationLevel: "PRIMARY",
    credentialType: "PrimarySchoolCertificate",
    title: "Primary School Leaving Certificate",
    classification: "Completed",
    issuedAt: "2012-07-15T10:00:00.000Z",
    revokedAt: null,
    revokeReason: null,
    merkleRoot: "0xprim12…aa01",
    createdAt: "2012-07-15T09:58:00.000Z",
  },
  {
    id: "cred-010",
    recipientId: "rec-010",
    did: "did:legitscan:waec:4123456789",
    status: "ISSUED",
    rail: "EDUCATION" as const,
    educationLevel: "SECONDARY",
    credentialType: "SecondarySchoolCertificate",
    title: "WAEC Senior School Certificate",
    classification: "6 Distinctions",
    issuedAt: "2018-08-20T12:00:00.000Z",
    revokedAt: null,
    revokeReason: null,
    merkleRoot: "0xbb18f0…de44",
    createdAt: "2018-08-20T11:55:00.000Z",
  },
  {
    id: "cred-011",
    recipientId: "rec-011",
    did: "did:legitscan:ican:aca77821",
    status: "ISSUED",
    rail: "EDUCATION" as const,
    educationLevel: "PROFESSIONAL",
    credentialType: "ProfessionalQualificationCredential",
    title: "ICAN Associate Membership",
    classification: "ACA · Active",
    issuedAt: "2023-05-20T12:00:00.000Z",
    revokedAt: null,
    revokeReason: null,
    merkleRoot: "0xprof77…bb02",
    createdAt: "2023-05-20T11:58:00.000Z",
  },
];

export const SEED_STREAM: StreamEvent[] = [
  {
    id: "evt-1",
    at: "2026-11-16T09:57:00.000Z",
    kind: "VERIFY",
    message: "Employer desk verified degree did:…044 · VALID",
  },
  {
    id: "evt-2",
    at: "2026-11-16T09:56:00.000Z",
    kind: "WEBHOOK",
    message: "POST /hooks/issuance · 200 · Banner sync ack",
  },
  {
    id: "evt-3",
    at: "2026-11-16T09:55:00.000Z",
    kind: "ISSUE",
    message: "Product mark sealed · cred-007 · HSM ED25519",
  },
  {
    id: "evt-4",
    at: "2026-11-16T09:52:00.000Z",
    kind: "SYNC",
    message: "Merkle shard tip advanced · height 1,482,119",
  },
];

export const SEED_TEAM: TeamMember[] = [
  {
    id: "tm-1",
    fullName: "Dr. A. Adeleke",
    email: "registrar@unilag.edu.ng",
    role: "OWNER",
    status: "ACTIVE",
  },
  {
    id: "tm-2",
    fullName: "Funke Adebayo",
    email: "funke.adebayo@unilag.edu.ng",
    role: "REGISTRAR",
    status: "ACTIVE",
  },
  {
    id: "tm-3",
    fullName: "Chidi Okoro",
    email: "chidi.okoro@unilag.edu.ng",
    role: "OPERATOR",
    status: "ACTIVE",
  },
  {
    id: "tm-4",
    fullName: "Ngozi Audit",
    email: "ngozi.audit@unilag.edu.ng",
    role: "AUDITOR",
    status: "INVITED",
  },
];

export const SEED_BULK: BulkJob[] = [
  {
    id: "bulk-1",
    name: "2024 Engineering cohort",
    rowCount: 420,
    successCount: 418,
    failCount: 2,
    status: "COMPLETED",
    createdAt: "2024-11-10T08:00:00.000Z",
    completedAt: "2024-11-10T08:14:00.000Z",
  },
  {
    id: "bulk-2",
    name: "Pharmacy mid-year patch",
    rowCount: 86,
    successCount: 40,
    failCount: 0,
    status: "RUNNING",
    createdAt: "2026-11-16T09:40:00.000Z",
    completedAt: null,
  },

  {
    id: "bulk-3",
    name: "Q4 product seal campaign",
    rowCount: 12000,
    successCount: 11940,
    failCount: 12,
    status: "COMPLETED",
    createdAt: "2026-10-01T07:00:00.000Z",
    completedAt: "2026-10-01T09:22:00.000Z",
  },
  {
    id: "bulk-4",
    name: "Agency permit cohort · Oct",
    rowCount: 860,
    successCount: 200,
    failCount: 0,
    status: "RUNNING",
    createdAt: "2026-11-16T08:10:00.000Z",
    completedAt: null,
  },
];

export const SEED_TEMPLATES: CertificateTemplate[] = [
  {
    id: "tpl-primary",
    name: "Primary School Certificate",
    accent: "#f97316",
    sealLabel: "Primary QR · Orange mark",
    symbolFamily: "EDUCATION",
    educationLevel: "PRIMARY",
    fields: [
      { id: "f1", label: "Recipient name", source: "recipient.fullName" },
      { id: "f2", label: "Certificate title", source: "credential.title" },
      { id: "f3", label: "Candidate number", source: "recipient.matricNumber" },
    ],
    updatedAt: "2026-02-01T12:00:00.000Z",
  },
  {
    id: "tpl-secondary",
    name: "Secondary School Certificate",
    accent: "#2563eb",
    sealLabel: "Secondary QR · Blue mark",
    symbolFamily: "EDUCATION",
    educationLevel: "SECONDARY",
    fields: [
      { id: "f1", label: "Recipient name", source: "recipient.fullName" },
      { id: "f2", label: "Exam / certificate", source: "credential.title" },
      { id: "f3", label: "Candidate number", source: "recipient.matricNumber" },
    ],
    updatedAt: "2026-02-01T12:00:00.000Z",
  },
  {
    id: "tpl-degree",
    name: "University Degree",
    accent: "#16a34a",
    sealLabel: "University QR · Green mark",
    symbolFamily: "EDUCATION",
    educationLevel: "UNIVERSITY",
    fields: [
      { id: "f1", label: "Recipient name", source: "recipient.fullName" },
      { id: "f2", label: "Program title", source: "credential.title" },
      { id: "f3", label: "Classification", source: "credential.classification" },
      { id: "f4", label: "Matric number", source: "recipient.matricNumber" },
    ],
    updatedAt: "2026-02-01T12:00:00.000Z",
  },
  {
    id: "tpl-professional",
    name: "Professional Qualification",
    accent: "#7c3aed",
    sealLabel: "Professional QR · Violet mark",
    symbolFamily: "EDUCATION",
    educationLevel: "PROFESSIONAL",
    fields: [
      { id: "f1", label: "Member name", source: "recipient.fullName" },
      { id: "f2", label: "Qualification", source: "credential.title" },
      { id: "f3", label: "Membership number", source: "recipient.matricNumber" },
    ],
    updatedAt: "2026-02-01T12:00:00.000Z",
  },
  {
    id: "tpl-gov",
    name: "Government Document Seal",
    accent: "#c9a227",
    sealLabel: "Government Approved Seal",
    symbolFamily: "GOVERNMENT",
    educationLevel: null,
    fields: [
      { id: "f1", label: "Subject name", source: "recipient.fullName" },
      { id: "f2", label: "Document title", source: "credential.title" },
      { id: "f3", label: "File reference", source: "recipient.matricNumber" },
    ],
    updatedAt: "2026-03-01T12:00:00.000Z",
  },
];

export const SEED_API_KEYS: ApiKeyRecord[] = [
  {
    id: "key-1",
    name: "Banner production",
    prefix: "sc_live_8f2a",
    createdAt: "2025-06-01T10:00:00.000Z",
    lastUsedAt: "2026-11-16T09:50:00.000Z",
    status: "ACTIVE",
  },
  {
    id: "key-2",
    name: "Sandbox SIS",
    prefix: "sc_test_91bc",
    createdAt: "2025-08-12T10:00:00.000Z",
    lastUsedAt: "2026-11-10T14:22:00.000Z",
    status: "ACTIVE",
  },
];

export const SEED_WEBHOOKS: WebhookRecord[] = [
  {
    id: "wh-1",
    url: "https://sis.unilag.edu.ng/hooks/legitscan",
    events: ["credential.issued", "credential.revoked"],
    status: "ACTIVE",
    lastDelivery: "2026-11-16T09:56:00.000Z",
  },
  {
    id: "wh-2",
    url: "https://ops.edusoft.ng/webhooks/ledger",
    events: ["verification.completed"],
    status: "PAUSED",
    lastDelivery: "2026-10-02T11:00:00.000Z",
  },
];

export const SEED_MAPPINGS: FieldMapping[] = [
  { id: "map-1", sisField: "STU_ID", legitscanField: "matricNumber" },
  { id: "map-2", sisField: "FULL_NAME", legitscanField: "fullName" },
  { id: "map-3", sisField: "PROG_TITLE", legitscanField: "title" },
  { id: "map-4", sisField: "CLASS_OF", legitscanField: "graduationYear" },
];

export function createSeedState(): InstitutionDemoState {
  return {
    tenantName: "Lagos Authenticity Hub",
    chainId: "0x9AF28 · ED25519-HSM",
    recipients: structuredClone(SEED_RECIPIENTS),
    credentials: structuredClone(SEED_CREDENTIALS),
    stream: structuredClone(SEED_STREAM),
    kpis: {
      authenticatedRecords: 184_920,
      publicQueries: 41_830,
      connectedPortals: 14,
      integrityRate: 0.04,
    },
    team: structuredClone(SEED_TEAM),
    bulkJobs: structuredClone(SEED_BULK),
    templates: structuredClone(SEED_TEMPLATES),
    activeTemplateId: "tpl-degree",
    apiKeys: structuredClone(SEED_API_KEYS),
    webhooks: structuredClone(SEED_WEBHOOKS),
    fieldMappings: structuredClone(SEED_MAPPINGS),
  };
}

/** Upgrade older localStorage payloads missing newer demo slices */
export function normalizeState(
  partial: Partial<InstitutionDemoState> | null,
): InstitutionDemoState {
  const seed = createSeedState();
  if (!partial?.credentials?.length) return seed;
  const credentials = partial.credentials.map((c) => ({
    ...c,
    rail: c.rail ?? ("EDUCATION" as const),
  }));
  return {
    ...seed,
    ...partial,
    recipients: partial.recipients?.length ? partial.recipients : seed.recipients,
    credentials,
    stream: partial.stream?.length ? partial.stream : seed.stream,
    kpis: partial.kpis ?? seed.kpis,
    team: partial.team?.length ? partial.team : seed.team,
    bulkJobs: partial.bulkJobs?.length ? partial.bulkJobs : seed.bulkJobs,
    templates: partial.templates?.length ? partial.templates : seed.templates,
    activeTemplateId: partial.activeTemplateId || seed.activeTemplateId,
    apiKeys: partial.apiKeys?.length ? partial.apiKeys : seed.apiKeys,
    webhooks: partial.webhooks?.length ? partial.webhooks : seed.webhooks,
    fieldMappings: partial.fieldMappings?.length
      ? partial.fieldMappings
      : seed.fieldMappings,
  };
}

export function recipientFor(
  state: InstitutionDemoState,
  recipientId: string,
): DemoRecipient | undefined {
  return state.recipients.find((r) => r.id === recipientId);
}

export function credentialWithRecipient(
  state: InstitutionDemoState,
  credentialId: string,
) {
  const credential = state.credentials.find((c) => c.id === credentialId);
  if (!credential) return null;
  return {
    credential,
    recipient: recipientFor(state, credential.recipientId) ?? null,
  };
}

/** Stable pseudo id for demo credentials */
export function nextCredentialId(existing: DemoCredential[]): string {
  const n = existing.length + 1;
  return `cred-${String(n).padStart(3, "0")}-${Date.now().toString(36)}`;
}

export function nextRecipientId(existing: DemoRecipient[]): string {
  const n = existing.length + 1;
  return `rec-${String(n).padStart(3, "0")}-${Date.now().toString(36)}`;
}

export function makeDid(matric: string): string {
  return `did:legitscan:unilag:${matric || "unknown"}`;
}

export function randomMerkle(): string {
  const hex = Math.random().toString(16).slice(2, 10);
  return `0x${hex}…${Math.random().toString(16).slice(2, 6)}`;
}

export { TENANT };
