/** Education certificate levels — each gets a unique verification-mark colour. */
export type EducationLevel =
  | "PRIMARY"
  | "SECONDARY"
  | "UNIVERSITY"
  | "PROFESSIONAL";

/** Document family that drives the verification symbol design language. */
export type DocumentFamily = "EDUCATION" | "GOVERNMENT";

export type EducationLevelMeta = {
  id: EducationLevel;
  label: string;
  shortLabel: string;
  /** Colour of the verification checkmark badge on the education shield QR. */
  markColor: string;
  markColorDark: string;
  description: string;
  credentialType: string;
  exampleTitle: string;
};

export const EDUCATION_LEVELS: Record<EducationLevel, EducationLevelMeta> = {
  PRIMARY: {
    id: "PRIMARY",
    label: "Primary school",
    shortLabel: "Primary",
    markColor: "#f97316",
    markColorDark: "#ea580c",
    description: "Primary leaving certificates and basic education awards.",
    credentialType: "PrimarySchoolCertificate",
    exampleTitle: "Primary School Leaving Certificate",
  },
  SECONDARY: {
    id: "SECONDARY",
    label: "Secondary school",
    shortLabel: "Secondary",
    markColor: "#2563eb",
    markColorDark: "#1d4ed8",
    description: "WAEC, NECO, SSCE, and secondary completion certificates.",
    credentialType: "SecondarySchoolCertificate",
    exampleTitle: "Senior School Certificate Examination",
  },
  UNIVERSITY: {
    id: "UNIVERSITY",
    label: "University",
    shortLabel: "University",
    markColor: "#16a34a",
    markColorDark: "#15803d",
    description: "Degrees, diplomas, and transcripts from higher education.",
    credentialType: "UniversityDegreeCredential",
    exampleTitle: "Bachelor of Science",
  },
  PROFESSIONAL: {
    id: "PROFESSIONAL",
    label: "Professional",
    shortLabel: "Professional",
    markColor: "#7c3aed",
    markColorDark: "#6d28d9",
    description: "Licences, chartered memberships, and professional awards.",
    credentialType: "ProfessionalQualificationCredential",
    exampleTitle: "Professional Practising Licence",
  },
};

export const EDUCATION_LEVEL_LIST = Object.values(EDUCATION_LEVELS);

export const GOVERNMENT_SEAL = {
  brand: "LEGITSCAN",
  ringTop: "LEGITSCAN",
  ringBottom: "GOVERNMENT APPROVED",
  certified: "CERTIFIED · VERIFIED",
  confirmed: "AUTHENTICITY CONFIRMED",
  navy: "#0b1c3a",
  gold: "#c9a227",
  goldLight: "#e8c547",
} as const;

export function educationLevelFromUnknown(
  value: string | null | undefined,
): EducationLevel | null {
  if (!value) return null;
  const key = value.toUpperCase().replace(/\s+/g, "_");
  if (key in EDUCATION_LEVELS) return key as EducationLevel;
  const lower = value.toLowerCase();
  if (lower.includes("primary")) return "PRIMARY";
  if (lower.includes("secondary") || lower.includes("waec") || lower.includes("neco"))
    return "SECONDARY";
  if (lower.includes("professional") || lower.includes("licence") || lower.includes("license"))
    return "PROFESSIONAL";
  if (
    lower.includes("university") ||
    lower.includes("degree") ||
    lower.includes("bachelor") ||
    lower.includes("master")
  )
    return "UNIVERSITY";
  return null;
}

export function verifyPayloadUrl(didOrToken: string) {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/verify?q=${encodeURIComponent(didOrToken)}`;
  }
  return `/verify?q=${encodeURIComponent(didOrToken)}`;
}
