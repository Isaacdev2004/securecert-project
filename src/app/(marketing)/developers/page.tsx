import Link from "next/link";
import { PageIntro } from "@/components/marketing/PageIntro";

export default function DevelopersPage() {
  return (
    <>
      <PageIntro
        eyebrow="Developers · APIs · Webhooks · Sandbox"
        title="Ship authenticity into your product — not a side portal."
        lede="Issue, revoke, and resolve credentials, official records, and product marks from the systems you already run. Sandbox keys, webhooks, and field mapping when you are ready to go live."
        actions={[
          { href: "/signup", label: "Get sandbox access" },
          { href: "/architecture", label: "See architecture", variant: "secondary" },
        ]}
      />

      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8 pb-10 grid gap-10 lg:grid-cols-[1fr_0.95fr]">
          <div className="space-y-8">
            {[
              {
                t: "Credentials API",
                d: "Create, batch-ingest, and fetch signed JSON-LD with Merkle proofs attached.",
                icon: "api",
              },
              {
                t: "Webhooks",
                d: "Subscribe to issuance, verification ingress, and revocation events.",
                icon: "webhook",
              },
              {
                t: "Field mapping",
                d: "Transform Banner / PowerSchool schemas into VC 2.0 without rewriting your ERP.",
                icon: "schema",
              },
              {
                t: "Sandbox & logs",
                d: "Ship synthetic degrees, inspect callbacks, and debug ingress telemetry before go-live.",
                icon: "terminal",
              },
            ].map((item) => (
              <div key={item.t} className="flex gap-4 border-t border-gray-100 pt-6">
                <span className="h-11 w-11 rounded-xl bg-[#f0fdfa] text-[#0f766e] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">{item.icon}</span>
                </span>
                <div>
                  <h2 className="text-[1.25rem] font-extrabold text-gray-950">
                    {item.t}
                  </h2>
                  <p className="mt-2 text-[15px] text-gray-600">{item.d}</p>
                </div>
              </div>
            ))}
          </div>

          <aside className="rounded-2xl bg-[#0b1c30] text-white p-8 h-fit sticky top-28">
            <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-teal-300">
              Example resolve
            </p>
            <pre className="mt-5 overflow-x-auto font-mono text-[12px] leading-relaxed text-teal-50/80">
{`POST /v1/verify
{ "did": "did:legitscan:unilag:180407044" }

→ status: VALID
→ merkle: verified
→ issuer: University of Lagos`}
            </pre>
            <Link
              href="/login"
              className="mt-8 marketing-btn-primary !bg-[#0f766e] w-full"
            >
              Create sandbox API key
            </Link>
            <Link
              href="/partners"
              className="mt-3 inline-flex w-full h-11 items-center justify-center rounded-full border border-white/20 text-[14px] font-semibold hover:bg-white/5"
            >
              Partner program
            </Link>
          </aside>
        </div>
      </section>

      <section className="bg-gray-50 border-t border-gray-100">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-16 grid sm:grid-cols-3 gap-6 text-center">
          {[
            { t: "< 15 min", d: "to first sandbox credential" },
            { t: "REST + webhooks", d: "no proprietary SDK lock-in" },
            { t: "W3C VC 2.0", d: "portable JSON-LD payloads" },
          ].map((x) => (
            <div key={x.t} className="rounded-2xl bg-white border border-gray-100 p-6">
              <p className="text-[1.35rem] font-extrabold text-[#0f766e]">{x.t}</p>
              <p className="mt-2 text-[14px] text-gray-600">{x.d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
