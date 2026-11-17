import fs from "fs";

function patch(path, fn) {
  const before = fs.readFileSync(path, "utf8");
  const after = fn(before);
  if (after !== before) {
    fs.writeFileSync(path, after);
    console.log("updated", path);
  } else {
    console.log("unchanged", path);
  }
}

// Partner demo
patch("src/lib/partner/demo-data.ts", (s) => {
  s = s.replace(
    'STORAGE_KEY = "legitscan.partner.demo"',
    'STORAGE_KEY = "legitscan.partner.demo.v2"',
  );
  s = s.replace(
    'partnerName: "EduTech Global Solutions"',
    'partnerName: "TrustLink Channel Partners"',
  );
  if (!s.includes("OceanFresh Beverages")) {
    s = s.replace(
      "];\n\nexport const SEED_APPS",
      `,
  {
    id: "ps-ocean",
    name: "OceanFresh Beverages",
    did: "did:sc:ng-oceanfresh-07",
    region: "Lagos",
    status: "ACTIVE",
    sisProduct: "Brand Catalogue API",
    syncedRecords: 240000,
    lastHeartbeat: "2026-11-16T22:00:00.000Z",
  },
  {
    id: "ps-lagos-bldg",
    name: "Lagos State Building Authority",
    did: "did:sc:ng-lagos-bldg-08",
    region: "Lagos",
    status: "ACTIVE",
    sisProduct: "Agency Registry",
    syncedRecords: 91200,
    lastHeartbeat: "2026-11-16T21:10:00.000Z",
  },
];

export const SEED_APPS`,
    );
  }
  return s;
});

// Admin demo — add BRAND sector tenants
patch("src/lib/admin/types.ts", (s) =>
  s.replace(
    'export type TenantSector = "ACADEMIA" | "GOV" | "EXAM" | "PARTNER";',
    'export type TenantSector = "ACADEMIA" | "GOV" | "EXAM" | "PARTNER" | "BRAND";',
  ),
);

patch("src/lib/admin/demo-data.ts", (s) => {
  s = s.replace(
    'STORAGE_KEY = "legitscan.admin.demo"',
    'STORAGE_KEY = "legitscan.admin.demo.v2"',
  );
  s = s.replaceAll("did:sc:", "did:ls:");
  if (!s.includes("OceanFresh Beverages")) {
    s = s.replace(
      "];\n\nexport const SEED_SHARDS",
      `,
  {
    id: "tn-ocean",
    name: "OceanFresh Beverages",
    did: "did:ls:ng-oceanfresh-01",
    sector: "BRAND",
    domain: "verify.oceanfresh.ng",
    hsmNode: "HSM-NG-LAGOS-01",
    algo: "Ed25519",
    anchoredCerts: 240000,
    partner: "TrustLink Channel Partners",
    status: "COMPLIANT",
    rateLimit: "8,000 req/min",
    established: "2016",
  },
  {
    id: "tn-lagos-bldg",
    name: "Lagos State Building Authority",
    did: "did:ls:ng-lagos-bldg-01",
    sector: "GOV",
    domain: "approvals.lagosstate.gov.ng",
    hsmNode: "GOV-HSM-ABUJA-01",
    algo: "Ed25519",
    anchoredCerts: 91200,
    partner: "Direct",
    status: "COMPLIANT",
    rateLimit: "2,500 req/min",
    established: "2008",
  },
];

export const SEED_SHARDS`,
    );
  }
  return s;
});

// Verifier types + demo
patch("src/lib/verifier/types.ts", (s) =>
  s.replace(
    `export type CasePurpose =
  | "VISA"
  | "WES"
  | "CORPORATE"
  | "EXCEPTION";`,
    `export type CasePurpose =
  | "VISA"
  | "WES"
  | "CORPORATE"
  | "PRODUCT"
  | "GOVERNMENT"
  | "EXCEPTION";`,
  ),
);

patch("src/lib/verifier/demo-data.ts", (s) => {
  s = s.replace(
    'STORAGE_KEY = "legitscan.verifier.demo"',
    'STORAGE_KEY = "legitscan.verifier.demo.v2"',
  );
  if (!s.includes("case-prod-1")) {
    s = s.replace(
      "];\n\nexport const SEED_BATCHES",
      `,
  {
    id: "case-prod-1",
    candidateName: "OceanFresh 500ml Batch 441",
    initials: "OF",
    matricNumber: "SKU-OF-500ML-BATCH-441",
    universityCode: "BRAND",
    degreeLine: "Product authenticity mark · Genuine",
    artifact: "QR seal pack",
    artifactFormat: "W3C-VC",
    agency: "Retail / Customs",
    purposeRef: "ANTI-COUNTERFEIT",
    officer: "Desk · Product rail",
    purpose: "PRODUCT",
    consentStatus: "ACTIVE",
    cryptoStatus: "MERKLE_VALID",
    did: "did:legitscan:brand:oceanfresh:441",
    merkleRoot: "0xprod55…9aa1",
    blockRef: "blk-prod-441",
    attested: true,
  },
  {
    id: "case-gov-1",
    candidateName: "Ngozi Adebayo",
    initials: "NA",
    matricNumber: "LAG/BLD/2024/88421",
    universityCode: "LAGOS",
    degreeLine: "Lagos Building Plan Approval",
    artifact: "Agency approval pack",
    artifactFormat: "W3C-VC",
    agency: "Municipal planning",
    purposeRef: "PERMIT-CHECK",
    officer: "Desk · Government rail",
    purpose: "GOVERNMENT",
    consentStatus: "ACTIVE",
    cryptoStatus: "MINISTRY_SEALED",
    did: "did:legitscan:lagos:bld:88421",
    merkleRoot: "0xgov81a…c4e2",
    blockRef: "blk-gov-88421",
    attested: true,
  },
];

export const SEED_BATCHES`,
    );
  }
  if (!s.includes('code: "BRAND"')) {
    s = s.replace(
      "];\n\nexport const SEED_CASES",
      `,
  { code: "BRAND", name: "Brand / Manufacturer issuers", hsmLabel: "BRAND-HSM-ROOT-01" },
  { code: "LAGOS", name: "Lagos State Building Authority", hsmLabel: "LAGOS-GOV-HSM-01" },
];

export const SEED_CASES`,
    );
  }
  return s;
});

// Passport
patch("src/lib/passport/types.ts", (s) => {
  if (!s.includes("AssetRail")) {
    s = s.replace(
      'export type PassportCredentialStatus = "ACTIVE" | "REVOKED" | "EXPIRED";',
      `export type AssetRail = "EDUCATION" | "GOVERNMENT" | "PRODUCT";

export type PassportCredentialStatus = "ACTIVE" | "REVOKED" | "EXPIRED";`,
    );
    s = s.replace(
      "export type PassportCredential = {\n  id: string;\n  title: string;\n  issuer: string;\n  classification: string;\n  matricNumber: string;",
      "export type PassportCredential = {\n  id: string;\n  title: string;\n  issuer: string;\n  classification: string;\n  rail: AssetRail;\n  matricNumber: string;",
    );
    s = s.replace(
      "  university: string;",
      "  /** Primary issuer org / affiliation label */\n  university: string;",
    );
  }
  return s;
});

patch("src/lib/passport/demo-data.ts", (s) => {
  s = s.replace(
    'STORAGE_KEY = "legitscan.passport.demo"',
    'STORAGE_KEY = "legitscan.passport.demo.v2"',
  );
  s = s.replace(
    'university: "University of Lagos"',
    'university: "Multi-rail holder vault"',
  );
  // add rail to existing seeds
  s = s.replace(
    /title: "B\.Eng\. Electrical & Electronics Engineering",\n    issuer: "University of Lagos",\n    classification: "First Class Honours",/,
    `title: "B.Eng. Electrical & Electronics Engineering",
    issuer: "University of Lagos",
    classification: "First Class Honours",
    rail: "EDUCATION",`,
  );
  s = s.replace(
    /title: "NYSC Discharge Certificate",\n    issuer: "National Youth Service Corps",\n    classification: "Completed",/,
    `title: "NYSC Discharge Certificate",
    issuer: "National Youth Service Corps",
    classification: "Completed",
    rail: "GOVERNMENT",`,
  );
  s = s.replace(
    /title: "WAEC Senior School Certificate",\n    issuer: "WAEC",\n    classification: "6 Distinctions",/,
    `title: "WAEC Senior School Certificate",
    issuer: "WAEC",
    classification: "6 Distinctions",
    rail: "EDUCATION",`,
  );
  if (!s.includes("OceanFresh 500ml")) {
    s = s.replace(
      "];\n\nexport const SEED_SHARES",
      `  {
    id: "pc-004",
    title: "OceanFresh 500ml · Batch 441",
    issuer: "OceanFresh Beverages",
    classification: "Genuine product seal",
    rail: "PRODUCT",
    matricNumber: "SKU-OF-500ML-BATCH-441",
    did: "did:legitscan:brand:oceanfresh:441",
    status: "ACTIVE",
    issuedAt: "2026-10-02T08:15:00.000Z",
    merkleRoot: "0xprod55…9aa1",
  },
  {
    id: "pc-005",
    title: "Lagos Building Plan Approval",
    issuer: "Lagos State Building Authority",
    classification: "Residential · Valid",
    rail: "GOVERNMENT",
    matricNumber: "LAG/BLD/2024/88421",
    did: "did:legitscan:lagos:bld:88421",
    status: "ACTIVE",
    issuedAt: "2024-06-18T11:00:00.000Z",
    merkleRoot: "0xgov81a…c4e2",
  },
];

export const SEED_SHARES`,
    );
  }
  return s;
});

console.log("portal rails patch done");
