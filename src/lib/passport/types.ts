export type AssetRail = "EDUCATION" | "GOVERNMENT" | "PRODUCT";

export type PassportCredentialStatus = "ACTIVE" | "REVOKED" | "EXPIRED";

export type PassportCredential = {
  id: string;
  title: string;
  issuer: string;
  classification: string;
  rail: AssetRail;
  matricNumber: string;
  did: string;
  status: PassportCredentialStatus;
  issuedAt: string;
  merkleRoot: string;
};

export type ShareLink = {
  id: string;
  credentialId: string;
  token: string;
  revealedFields: string[];
  expiresAt: string | null;
  maxViews: number;
  viewCount: number;
  revokedAt: string | null;
  createdAt: string;
};

export type ActivityKind =
  | "VERIFY"
  | "SHARE"
  | "REVOKE_SHARE"
  | "VIEW"
  | "ISSUE";

export type ActivityEvent = {
  id: string;
  at: string;
  kind: ActivityKind;
  label: string;
  detail: string;
  credentialId?: string;
};

export type PassportDemoState = {
  holderName: string;
  holderEmail: string;
  /** Primary issuer org / affiliation label */
  university: string;
  credentials: PassportCredential[];
  shares: ShareLink[];
  activity: ActivityEvent[];
};
