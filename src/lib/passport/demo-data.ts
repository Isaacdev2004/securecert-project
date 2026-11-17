import type {
  ActivityEvent,
  PassportCredential,
  PassportDemoState,
  ShareLink,
} from "./types";

export const STORAGE_KEY = "legitscan.passport.demo";

export const SEED_CREDENTIALS: PassportCredential[] = [
  {
    id: "pc-001",
    title: "B.Eng. Electrical & Electronics Engineering",
    issuer: "University of Lagos",
    classification: "First Class Honours",
    matricNumber: "180407044",
    did: "did:legitscan:unilag:180407044",
    status: "ACTIVE",
    issuedAt: "2024-11-12T10:22:00.000Z",
    merkleRoot: "0x9af28c1e…a91f",
  },
  {
    id: "pc-002",
    title: "NYSC Discharge Certificate",
    issuer: "National Youth Service Corps",
    classification: "Completed",
    matricNumber: "NYSC/LA/24/12345",
    did: "did:legitscan:nysc:la2412345",
    status: "ACTIVE",
    issuedAt: "2025-08-01T09:00:00.000Z",
    merkleRoot: "0x44de91…c02a",
  },
  {
    id: "pc-003",
    title: "WAEC Senior School Certificate",
    issuer: "WAEC",
    classification: "6 Distinctions",
    matricNumber: "4123456789",
    did: "did:legitscan:waec:4123456789",
    status: "ACTIVE",
    issuedAt: "2018-08-20T12:00:00.000Z",
    merkleRoot: "0xbb18f0…de44",
  },
];

export const SEED_SHARES: ShareLink[] = [
  {
    id: "sh-1",
    credentialId: "pc-001",
    token: "shr_demo_wes_044",
    revealedFields: ["title", "classification", "issuer", "did"],
    expiresAt: "2026-12-31T23:59:00.000Z",
    maxViews: 5,
    viewCount: 2,
    revokedAt: null,
    createdAt: "2026-11-01T10:00:00.000Z",
  },
];

export const SEED_ACTIVITY: ActivityEvent[] = [
  {
    id: "pa-1",
    at: "2026-11-16T09:57:00.000Z",
    kind: "VERIFY",
    label: "WES consular desk",
    detail: "Verified degree credential · VALID",
    credentialId: "pc-001",
  },
  {
    id: "pa-2",
    at: "2026-11-10T14:22:00.000Z",
    kind: "VIEW",
    label: "Share link opened",
    detail: "Employer viewed selective disclosure pack",
    credentialId: "pc-001",
  },
  {
    id: "pa-3",
    at: "2026-11-01T10:00:00.000Z",
    kind: "SHARE",
    label: "Share created",
    detail: "Token shr_demo_wes_044 · 5 max views",
    credentialId: "pc-001",
  },
  {
    id: "pa-4",
    at: "2024-11-12T10:22:00.000Z",
    kind: "ISSUE",
    label: "University of Lagos",
    detail: "Degree credential sealed into passport",
    credentialId: "pc-001",
  },
];

export function createSeedState(): PassportDemoState {
  return {
    holderName: "Babatunde Adeleke Emmanuel",
    holderEmail: "babatunde@student.unilag.edu.ng",
    university: "University of Lagos",
    credentials: structuredClone(SEED_CREDENTIALS),
    shares: structuredClone(SEED_SHARES),
    activity: structuredClone(SEED_ACTIVITY),
  };
}

export function normalizeState(
  partial: Partial<PassportDemoState> | null,
): PassportDemoState {
  const seed = createSeedState();
  if (!partial?.credentials?.length) return seed;
  return {
    ...seed,
    ...partial,
    credentials: partial.credentials,
    shares: partial.shares?.length ? partial.shares : seed.shares,
    activity: partial.activity?.length ? partial.activity : seed.activity,
  };
}

export function credentialById(
  state: PassportDemoState,
  id: string,
): PassportCredential | undefined {
  return state.credentials.find((c) => c.id === id);
}

export function randomToken(): string {
  return `shr_${Math.random().toString(36).slice(2, 10)}`;
}
