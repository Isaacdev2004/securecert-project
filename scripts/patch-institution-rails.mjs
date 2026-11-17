import fs from "fs";

const p = "src/lib/institution/demo-data.ts";
let s = fs.readFileSync(p, "utf8");

s = s.replace(
  'export const STORAGE_KEY = "legitscan.institution.demo";',
  'export const STORAGE_KEY = "legitscan.institution.demo.v2";',
);
s = s.replace(
  'tenantName: "University of Lagos",',
  'tenantName: "Lagos Authenticity Hub",',
);

// Add rail before credentialType if missing
s = s.replace(
  /(\n    )credentialType: "UniversityDegreeCredential",/g,
  '$1rail: "EDUCATION" as const,\n    credentialType: "UniversityDegreeCredential",',
);

const extraRecipients = `
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
];
`;

if (!s.includes("rec-006")) {
  s = s.replace(
    "];\n\nexport const SEED_CREDENTIALS",
    extraRecipients.trimEnd() + "\n];\n\nexport const SEED_CREDENTIALS",
  );
}

const extraCreds = `
  {
    id: "cred-006",
    recipientId: "rec-006",
    did: "did:legitscan:lagos:bld:88421",
    status: "ISSUED",
    rail: "GOVERNMENT" as const,
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
    credentialType: "OfficialIdentityPack",
    title: "NIMC Identity Attestation Pack",
    classification: "Citizen · Selective disclosure",
    issuedAt: null,
    revokedAt: null,
    revokeReason: null,
    merkleRoot: "0xpending…gov",
    createdAt: "2026-11-10T09:00:00.000Z",
  },
];
`;

if (!s.includes("cred-006")) {
  s = s.replace(
    "];\n\nexport const SEED_STREAM",
    extraCreds.trimEnd() + "\n];\n\nexport const SEED_STREAM",
  );
}

const extraTemplates = `
  {
    id: "tpl-gov",
    name: "Government Approval",
    accent: "#0f766e",
    sealLabel: "Agency Seal",
    fields: [
      { id: "f1", label: "Subject name", source: "recipient.fullName" },
      { id: "f2", label: "Approval title", source: "credential.title" },
      { id: "f3", label: "File reference", source: "recipient.matricNumber" },
    ],
    updatedAt: "2026-03-01T12:00:00.000Z",
  },
  {
    id: "tpl-product",
    name: "Product Authenticity Mark",
    accent: "#134e4a",
    sealLabel: "Brand Seal",
    fields: [
      { id: "f1", label: "Brand / owner", source: "recipient.fullName" },
      { id: "f2", label: "SKU / batch", source: "recipient.matricNumber" },
      { id: "f3", label: "Product title", source: "credential.title" },
    ],
    updatedAt: "2026-04-01T12:00:00.000Z",
  },
];
`;

if (!s.includes("tpl-gov")) {
  s = s.replace(
    "];\n\nexport const SEED_API_KEYS",
    extraTemplates.trimEnd() + "\n];\n\nexport const SEED_API_KEYS",
  );
}

const extraBulk = `
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
`;

if (!s.includes("bulk-3")) {
  s = s.replace(
    "];\n\nexport const SEED_TEMPLATES",
    extraBulk.trimEnd() + "\n];\n\nexport const SEED_TEMPLATES",
  );
}

s = s.replace(
  /message: "WES consular desk verified/,
  'message: "Employer desk verified degree',
);
s = s.replace(
  /message: "Credential sealed · cred-004/,
  'message: "Product mark sealed · cred-007',
);

fs.writeFileSync(p, s);
console.log("institution demo patched");
