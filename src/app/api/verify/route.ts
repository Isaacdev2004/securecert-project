import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { EducationLevel } from "@/lib/authenticity/symbols";

type DemoRecord = {
  did: string;
  status: "VALID" | "REVOKED" | "INVALID";
  holder: string;
  title: string;
  issuer: string;
  issuedAt: string;
  matric: string;
  family: "EDUCATION" | "GOVERNMENT";
  educationLevel: EducationLevel | null;
};

/** Demo credential ledger used when Supabase is not configured */
const DEMO_LEDGER: Record<string, DemoRecord> = {
  "did:legitscan:unilag:180407044": {
    did: "did:legitscan:unilag:180407044",
    status: "VALID",
    holder: "Babatunde Adeleke Emmanuel",
    title: "B.Eng. Electrical & Electronics Engineering — First Class",
    issuer: "University of Lagos",
    issuedAt: "2024-11-28",
    matric: "180407044",
    family: "EDUCATION",
    educationLevel: "UNIVERSITY",
  },
  "180407044": {
    did: "did:legitscan:unilag:180407044",
    status: "VALID",
    holder: "Babatunde Adeleke Emmanuel",
    title: "B.Eng. Electrical & Electronics Engineering — First Class",
    issuer: "University of Lagos",
    issuedAt: "2024-11-28",
    matric: "180407044",
    family: "EDUCATION",
    educationLevel: "UNIVERSITY",
  },
  "did:legitscan:waec:4123456789": {
    did: "did:legitscan:waec:4123456789",
    status: "VALID",
    holder: "Babatunde Adeleke Emmanuel",
    title: "WAEC Senior School Certificate",
    issuer: "WAEC",
    issuedAt: "2018-08-20",
    matric: "4123456789",
    family: "EDUCATION",
    educationLevel: "SECONDARY",
  },
  "4123456789": {
    did: "did:legitscan:waec:4123456789",
    status: "VALID",
    holder: "Babatunde Adeleke Emmanuel",
    title: "WAEC Senior School Certificate",
    issuer: "WAEC",
    issuedAt: "2018-08-20",
    matric: "4123456789",
    family: "EDUCATION",
    educationLevel: "SECONDARY",
  },
  "did:legitscan:primary:pslc201288421": {
    did: "did:legitscan:primary:pslc201288421",
    status: "VALID",
    holder: "Tolu Aina",
    title: "Primary School Leaving Certificate",
    issuer: "Lagos State Universal Basic Education Board",
    issuedAt: "2012-07-15",
    matric: "PSLC/2012/88421",
    family: "EDUCATION",
    educationLevel: "PRIMARY",
  },
  "did:legitscan:ican:aca77821": {
    did: "did:legitscan:ican:aca77821",
    status: "VALID",
    holder: "Funmilayo Ajayi",
    title: "ICAN Associate Membership",
    issuer: "Institute of Chartered Accountants of Nigeria",
    issuedAt: "2023-05-20",
    matric: "ICAN/ACA/77821",
    family: "EDUCATION",
    educationLevel: "PROFESSIONAL",
  },
  "did:legitscan:lagos:bld:88421": {
    did: "did:legitscan:lagos:bld:88421",
    status: "VALID",
    holder: "Ngozi Adebayo",
    title: "Lagos Building Plan Approval",
    issuer: "Lagos State Building Authority",
    issuedAt: "2024-06-18",
    matric: "LAG/BLD/2024/88421",
    family: "GOVERNMENT",
    educationLevel: null,
  },
  "did:legitscan:nysc:la2412345": {
    did: "did:legitscan:nysc:la2412345",
    status: "VALID",
    holder: "Babatunde Adeleke Emmanuel",
    title: "NYSC Discharge Certificate",
    issuer: "National Youth Service Corps",
    issuedAt: "2025-08-01",
    matric: "NYSC/LA/24/12345",
    family: "GOVERNMENT",
    educationLevel: null,
  },
};

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const query = String(body.query || body.did || body.nonce || "")
    .trim()
    .toLowerCase();

  if (!query) {
    return NextResponse.json(
      { ok: false, error: "Provide a DID, matric number, or nonce." },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  if (supabase) {
    const { data: credential } = await supabase
      .from("credentials")
      .select(
        "id, did, status, title, issued_at, payload, recipients(full_name, matric_number), tenants(name)",
      )
      .or(`did.ilike.%${query}%,payload->>matric.ilike.%${query}%`)
      .limit(1)
      .maybeSingle();

    if (credential) {
      const status =
        credential.status === "ISSUED"
          ? "VALID"
          : credential.status === "REVOKED"
            ? "REVOKED"
            : "INVALID";

      await supabase.from("verification_events").insert({
        credential_id: credential.id,
        did_or_nonce: query,
        verifier_label: "public-verify",
        result: status,
        metadata: { source: "api/verify" },
      });

      const recipient = Array.isArray(credential.recipients)
        ? credential.recipients[0]
        : credential.recipients;
      const tenant = Array.isArray(credential.tenants)
        ? credential.tenants[0]
        : credential.tenants;
      const payload =
        credential.payload && typeof credential.payload === "object"
          ? (credential.payload as Record<string, unknown>)
          : {};

      return NextResponse.json({
        ok: true,
        result: status,
        credential: {
          did: credential.did,
          holder: recipient?.full_name ?? "Unknown",
          title: credential.title,
          issuer: tenant?.name ?? "Institution",
          issuedAt: credential.issued_at,
          matric: recipient?.matric_number,
          family: (payload.family as string) || "EDUCATION",
          educationLevel: (payload.educationLevel as string) || "UNIVERSITY",
        },
      });
    }
  }

  const demo =
    DEMO_LEDGER[query] ||
    Object.entries(DEMO_LEDGER).find(
      ([key, c]) =>
        key.toLowerCase() === query ||
        c.did.toLowerCase() === query ||
        c.matric.toLowerCase() === query ||
        c.holder.toLowerCase().includes(query),
    )?.[1];

  if (!demo) {
    return NextResponse.json({
      ok: true,
      result: "NOT_FOUND",
      message: "No anchored credential matched that identifier.",
    });
  }

  return NextResponse.json({
    ok: true,
    result: demo.status,
    credential: demo,
    demo: true,
  });
}
