import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Demo credential ledger used when Supabase is not configured */
const DEMO_LEDGER: Record<
  string,
  {
    did: string;
    status: "VALID" | "REVOKED" | "INVALID";
    holder: string;
    title: string;
    issuer: string;
    issuedAt: string;
    matric: string;
  }
> = {
  "did:legitscan:unilag:180407044": {
    did: "did:legitscan:unilag:180407044",
    status: "VALID",
    holder: "Babatunde Adeleke Emmanuel",
    title: "B.Eng. Electrical & Electronics Engineering — First Class",
    issuer: "University of Lagos",
    issuedAt: "2024-11-28",
    matric: "180407044",
  },
  "180407044": {
    did: "did:legitscan:unilag:180407044",
    status: "VALID",
    holder: "Babatunde Adeleke Emmanuel",
    title: "B.Eng. Electrical & Electronics Engineering — First Class",
    issuer: "University of Lagos",
    issuedAt: "2024-11-28",
    matric: "180407044",
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
        },
      });
    }
  }

  const demo =
    DEMO_LEDGER[query] ||
    Object.values(DEMO_LEDGER).find(
      (c) =>
        c.did.toLowerCase() === query ||
        c.matric.toLowerCase() === query ||
        c.holder.toLowerCase().includes(query),
    );

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
