import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const organization_name = String(body.organization_name || body.organization || "").trim();
  const contact_email = String(body.contact_email || body.email || "").trim();
  const contact_name = String(body.contact_name || body.name || "").trim();
  const persona = String(body.persona || "").trim() || null;
  const notes = String(body.notes || "").trim() || null;
  const preferred_tier = String(body.preferred_tier || body.tier || "").trim() || null;

  if (!organization_name || !contact_email) {
    return NextResponse.json(
      { ok: false, error: "organization_name and contact_email are required." },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("onboarding_requests")
      .insert({
        organization_name,
        contact_email,
        contact_name: contact_name || null,
        persona,
        notes,
        preferred_tier,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: data.id });
  }

  // Demo fallback — acknowledge without persistence
  return NextResponse.json({
    ok: true,
    id: `demo-${Date.now()}`,
    demo: true,
    message: "Onboarding request accepted in demo mode.",
  });
}
