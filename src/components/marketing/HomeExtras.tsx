import Link from "next/link";
import { Icon } from "@/components/marketing/Icon";

export function HowItWorks() {
  const steps = [
    {
      n: "01",
      t: "Design & map",
      d: "Brand templates for credentials, documents, or products — then connect custody for your tenancy.",
    },
    {
      n: "02",
      t: "Issue at scale",
      d: "Seal single records or bulk cohorts into the registry with cryptographic inclusion proofs.",
    },
    {
      n: "03",
      t: "Holders control",
      d: "People and product owners share selective proofs via QR or link — and revoke in one tap.",
    },
    {
      n: "04",
      t: "World verifies",
      d: "Employers, agencies, customs, and consumers resolve authenticity in milliseconds.",
    },
  ];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="text-[13px] font-bold tracking-[0.14em] uppercase text-[#0f766e]">
            How it works
          </p>
          <h2 className="marketing-display mt-3 text-[clamp(1.85rem,3.5vw,2.75rem)] text-gray-950">
            From issuance to instant authenticity
          </h2>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s) => (
            <article
              key={s.n}
              className="relative rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 p-6 overflow-hidden"
            >
              <span className="text-[2.5rem] font-extrabold text-[#ccfbf1] leading-none">
                {s.n}
              </span>
              <h3 className="mt-3 text-[17px] font-extrabold text-gray-950">
                {s.t}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-gray-600">
                {s.d}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialBand() {
  return (
    <section className="bg-[#0b1c30] text-white relative overflow-hidden">
      <div className="absolute -right-20 top-0 h-64 w-64 rounded-full bg-[#0f766e]/30 blur-3xl" />
      <div className="relative mx-auto max-w-[900px] px-5 md:px-8 py-20 md:py-24 text-center">
        <Icon name="format_quote" size={40} className="text-[#5eead4]" filled weight={600} />
        <blockquote className="mt-4 text-[clamp(1.25rem,2.5vw,1.85rem)] font-semibold leading-snug tracking-tight">
          “LegitScan let us retire courier transcripts for high commissions —
          and the same verify flow now protects our licensed product seals.
          Authenticity that used to take weeks resolves before intake finishes.”
        </blockquote>
        <div className="mt-8 flex flex-col items-center gap-1">
          <p className="font-bold">Dr. A. Adeleke</p>
          <p className="text-[14px] text-white/60">
            Institutional Registrar · Tier-1 Issuer Node
          </p>
        </div>
      </div>
    </section>
  );
}

export function SecurityStrip() {
  const items = [
    { icon: "encrypted", t: "HSM root custody", d: "FIPS-oriented enclave signing" },
    { icon: "account_tree", t: "Merkle proofs", d: "Inclusion path on every record" },
    { icon: "visibility_off", t: "Selective disclosure", d: "Share proof, hide the rest" },
    { icon: "gavel", t: "Audit-ready evidence", d: "Consent, revoke & verify logs" },
  ];

  return (
    <section className="bg-white border-y border-gray-100">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-14 md:py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.t} className="flex gap-3">
            <span className="h-12 w-12 rounded-xl bg-[#f0fdfa] text-[#0f766e] flex items-center justify-center shrink-0">
              <Icon name={item.icon} size={26} weight={500} />
            </span>
            <div>
              <p className="font-extrabold text-gray-950 text-[15px]">{item.t}</p>
              <p className="text-[13px] text-gray-500 mt-0.5">{item.d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FaqSection() {
  const faqs = [
    {
      q: "Is LegitScan only for universities?",
      a: "No. Education is one rail. The same platform supports government documents and approvals, plus product authenticity for brands and manufacturers.",
    },
    {
      q: "How do people verify?",
      a: "Public resolve for a single QR or code — no account required. Authorised desks handle batch employer, embassy, customs, and partner workflows.",
    },
    {
      q: "What about privacy?",
      a: "Holders control selective disclosure. Sensitive attributes stay blinded unless they grant access — with a full audit of every ping.",
    },
    {
      q: "Is cryptography optional?",
      a: "No. Every issued record is sealed and Merkle-anchored. Verification recomputes proof — it never trusts a portal screenshot.",
    },
  ];

  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-[800px] px-5 md:px-8 py-20 md:py-24">
        <h2 className="marketing-display text-[clamp(1.75rem,3vw,2.5rem)] text-gray-950 text-center">
          Questions teams ask first
        </h2>
        <div className="mt-10 space-y-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl bg-white border border-gray-200 open:border-[#0f766e]/40 open:shadow-sm"
            >
              <summary className="cursor-pointer list-none px-5 py-4 font-bold text-gray-950 flex items-center justify-between gap-3">
                {f.q}
                <Icon
                  name="expand_more"
                  size={22}
                  className="text-gray-400 group-open:rotate-180 transition-transform"
                />
              </summary>
              <p className="px-5 pb-5 text-[15px] leading-relaxed text-gray-600">
                {f.a}
              </p>
            </details>
          ))}
        </div>
        <p className="mt-8 text-center">
          <Link href="/onboarding" className="font-semibold text-[#0f766e] hover:underline">
            Still curious? Book a demo →
          </Link>
        </p>
      </div>
    </section>
  );
}

export function IntegrationsBand() {
  const tools = [
    "Banner",
    "PowerSchool",
    "PeopleSoft",
    "Custom ERP",
    "Product SKU APIs",
    "W3C VC 2.0",
    "OAuth 2.0",
    "Webhooks",
  ];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-16 md:py-20 text-center">
        <h2 className="marketing-display text-[clamp(1.6rem,3vw,2.25rem)] text-gray-950">
          Connect the systems you already run
        </h2>
        <p className="mt-3 text-[16px] text-gray-600 max-w-2xl mx-auto">
          LegitScan plugs into campus SIS, agency registries, and brand
          catalogues — so issuance and verification never require a rip-and-replace
          project.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {tools.map((t) => (
            <span
              key={t}
              className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-[13px] font-semibold text-gray-700"
            >
              {t}
            </span>
          ))}
        </div>
        <Link href="/developers" className="marketing-btn-secondary mt-8 inline-flex">
          View all integrations
        </Link>
      </div>
    </section>
  );
}
