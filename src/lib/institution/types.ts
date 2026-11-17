export type CredentialStatus =
  | "DRAFT"
  | "PENDING_SIGNATURE"
  | "ISSUED"
  | "REVOKED"
  | "SUSPENDED";

/** Three LegitScan authenticity rails. */
export type AssetRail = "EDUCATION" | "GOVERNMENT" | "PRODUCT";

export type DemoRecipient = {
  id: string;
  fullName: string;
  email: string;
  /** Reference ID: matric, file no., SKU/batch, etc. */
  matricNumber: string;
  program: string;
  graduationYear: number;
};

export type DemoCredential = {
  id: string;
  recipientId: string;
  did: string;
  status: CredentialStatus;
  rail: AssetRail;
  credentialType: string;
  title: string;
  classification?: string;
  issuedAt: string | null;
  revokedAt: string | null;
  revokeReason: string | null;
  merkleRoot: string;
  createdAt: string;
};

export type StreamEvent = {
  id: string;
  at: string;
  kind: "VERIFY" | "ISSUE" | "WEBHOOK" | "REVOKE" | "SYNC";
  message: string;
};

export type TeamRole = "OWNER" | "REGISTRAR" | "OPERATOR" | "AUDITOR";

export type TeamMember = {
  id: string;
  fullName: string;
  email: string;
  role: TeamRole;
  status: "ACTIVE" | "INVITED";
};

export type BulkJobStatus = "QUEUED" | "RUNNING" | "COMPLETED" | "FAILED";

export type BulkJob = {
  id: string;
  name: string;
  rowCount: number;
  successCount: number;
  failCount: number;
  status: BulkJobStatus;
  createdAt: string;
  completedAt: string | null;
};

export type TemplateField = {
  id: string;
  label: string;
  source: string;
};

export type CertificateTemplate = {
  id: string;
  name: string;
  accent: string;
  sealLabel: string;
  fields: TemplateField[];
  updatedAt: string;
};

export type ApiKeyRecord = {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsedAt: string | null;
  status: "ACTIVE" | "REVOKED";
};

export type WebhookRecord = {
  id: string;
  url: string;
  events: string[];
  status: "ACTIVE" | "PAUSED";
  lastDelivery: string | null;
};

export type FieldMapping = {
  id: string;
  sisField: string;
  legitscanField: string;
};

export type InstitutionDemoState = {
  tenantName: string;
  chainId: string;
  recipients: DemoRecipient[];
  credentials: DemoCredential[];
  stream: StreamEvent[];
  kpis: {
    authenticatedRecords: number;
    publicQueries: number;
    connectedPortals: number;
    integrityRate: number;
  };
  team: TeamMember[];
  bulkJobs: BulkJob[];
  templates: CertificateTemplate[];
  activeTemplateId: string;
  apiKeys: ApiKeyRecord[];
  webhooks: WebhookRecord[];
  fieldMappings: FieldMapping[];
};

export type IssueInput = {
  fullName: string;
  email: string;
  matricNumber: string;
  program: string;
  graduationYear: number;
  title: string;
  classification: string;
  rail?: AssetRail;
};

export type RecipientInput = {
  fullName: string;
  email: string;
  matricNumber: string;
  program: string;
  graduationYear: number;
};
