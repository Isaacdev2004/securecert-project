import Link from "next/link";
import { CredentialCard } from "@/components/marketing/CredentialCard";
import { LogoMarquee } from "@/components/marketing/LogoMarquee";
import { StatsCounters } from "@/components/marketing/StatsCounters";
import {
  FaqSection,
  HowItWorks,
  IntegrationsBand,
  SecurityStrip,
  TestimonialBand,
} from "@/components/marketing/HomeExtras";
import { IntroVideo } from "@/components/marketing/IntroVideo";
import { Icon } from "@/components/marketing/Icon";

const BENEFITS = [
  {
    title: "Issue any official record",
    body: "Certificates, licences, approvals, permits, and product authenticity marks — template once, bulk-issue at scale, and keep every asset on one governed ledger.",
    href: "/onboarding",
    link: "See issuer onboarding",
  },
  {
    title: "Give holders real control",
    body: "People and product owners get a passport-style vault: selective disclosure, dynamic QR shares, and a full audit of every verify ping — with one-tap revoke.",
    href: "/login",
    link: "Open holder passport demo",
  },
  {
    title: "Verify in seconds, anywhere",
    body: "Employers, agencies, customs, and consumers scan a QR or enter a code. Hardware-backed seals and Merkle proofs replace couriers, wet stamps, and guesswork.",
    href: "/verify",
    link: "Try public verify",
  },
];

const ADVANTAGES = [
  {
    title: "Three rails, one ledger",
    body: "Academic & professional credentials, government documents & approvals, and product authenticity — issued and verified on the same trust network.",
  },
  {
    title: "Public-first verification",
    body: "No account for basic authenticity checks. High-volume desks for embassies, employers, and authorised partners when you need batch workflows.",
  },
  {
    title: "Lifecycle you can defend",
    body: "Issue, store, share, verify, and revoke with evidence packs employers, regulators, and customers can trust.",
  },
  {
    title: "Your brand, not ours",
    body: "White-label templates, CNAME verify portals, and institutional or product seals that keep the issuer front and center.",
  },
  {
    title: "Issuer economy built in",
    body: "Verification fees, partner wholesale, and webhook telemetry so trust becomes revenue — not only a compliance cost.",
  },
  {
    title: "Self-serve to sovereign",
    body: "Template-driven issuance for brands and agencies — without a year-long consulting engagement to go live.",
  },
];

const SOLUTIONS = [
  {
    t: "Education & awarding bodies",
    d: "Degrees, transcripts, licences, and exam results with embassy-grade verify",
    href: "/onboarding",
  },
  {
    t: "Government & agencies",
    d: "Documents, approvals, permits, and official records with audit trails",
    href: "/onboarding",
  },
  {
    t: "Brands & manufacturers",
    d: "Product authenticity marks consumers and retailers can scan instantly",
    href: "/partners",
  },
  {
    t: "Employers & verifiers",
    d: "Instant authenticity checks — public resolve or authorised desk",
    href: "/verify",
  },
  {
    t: "Integration partners",
    d: "Wholesale APIs, webhooks, and white-label verify for SIS & ERP vendors",
    href: "/partners",
  },
  {
    t: "Developers",
    d: "APIs, sandbox keys, and evidence-pack payloads",
    href: "/developers",
  },
];

export function HomePage() {
  return (
    <>
      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8 pt-14 md:pt-20 pb-16 md:pb-24 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="text-[13px] font-bold tracking-[0.14em] uppercase text-[#0f766e]">
              Verify · Authenticate · Trust
            </p>
            <h1 className="marketing-rise marketing-display mt-3 text-[clamp(2.4rem,5vw,4.25rem)] text-gray-950">
              Authenticate credentials, documents, and products — on one network.
            </h1>
            <p className="marketing-rise-delay mt-6 text-[17px] md:text-[18px] leading-relaxed text-gray-600 max-w-xl">
              LegitScan is a secure digital credential and official-record
              platform. Organisations issue and manage certificates, government
              records, and product authenticity marks — while employers,
              agencies, and consumers verify authenticity in seconds.
            </p>
            <div className="marketing-rise-delay-2 mt-8 flex flex-wrap gap-3">
              <Link href="/onboarding" className="marketing-btn-primary">
                Book a demo
              </Link>
              <Link href="/signup" className="marketing-btn-secondary">
                Sign up
              </Link>
              <Link
                href="/verify"
                className="inline-flex items-center h-12 px-2 text-[15px] font-semibold text-gray-700 hover:text-[#0f766e]"
              >
                Verify now →
              </Link>
            </div>
          </div>
          <div className="marketing-rise-delay">
            <CredentialCard />
          </div>
        </div>
      </section>

      <LogoMarquee />

      <SecurityStrip />

      <IntroVideo />

      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="marketing-display text-[clamp(1.85rem,3.5vw,2.75rem)] text-gray-950">
              One platform for every authenticity workflow
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-gray-600">
              Beyond certificates — help businesses authenticate products and
              help agencies issue documents and approvals the world can trust.
            </p>
          </div>

          <div className="mt-16 space-y-20 md:space-y-28">
            {BENEFITS.map((b, i) => (
              <div
                key={b.title}
                className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
                  i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div>
                  <h3 className="text-[1.75rem] md:text-[2rem] font-extrabold tracking-tight text-gray-950">
                    {b.title}
                  </h3>
                  <p className="mt-4 text-[16px] leading-relaxed text-gray-600">
                    {b.body}
                  </p>
                  <Link
                    href={b.href}
                    className="mt-6 inline-flex items-center gap-1 text-[15px] font-semibold text-[#0f766e] hover:underline"
                  >
                    {b.link}
                    <Icon name="arrow_forward" size={18} />
                  </Link>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-[#f0fdfa] to-[#ecfeff] border border-teal-100 p-8 md:p-10 min-h-[260px] flex items-center justify-center">
                  <div className="w-full max-w-sm rounded-xl bg-white shadow-md border border-gray-100 p-5">
                    <div className="flex items-center gap-2 text-[12px] font-bold text-[#0f766e] uppercase tracking-wider">
                      <span className="h-2 w-2 rounded-full bg-[#0f766e]" />
                      LegitScan · Live
                    </div>
                    <p className="mt-4 text-[15px] font-semibold text-gray-900">
                      {b.title}
                    </p>
                    <div className="mt-4 h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full bg-[#14b8a6] rounded-full"
                        style={{ width: `${70 + i * 10}%` }}
                      />
                    </div>
                    <p className="mt-3 text-[13px] text-gray-500">
                      Dashboard preview · issuer console
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/architecture" className="marketing-btn-secondary">
              Explore our platform
            </Link>
          </div>
        </div>
      </section>

      <HowItWorks />
      <TestimonialBand />

      <section className="bg-gray-50 border-y border-gray-100">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <h2 className="marketing-display text-[clamp(1.85rem,3.5vw,2.75rem)] text-gray-950">
              Why LegitScan is different
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-gray-600">
              Not another consulting-only identity stack. A self-serve issuance
              and public verification network for credentials, official records,
              and product authenticity — with evidence you can defend.
            </p>
          </div>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ADVANTAGES.map((a) => (
              <article
                key={a.title}
                className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md hover:border-[#0f766e]/30 transition-all"
              >
                <div className="h-11 w-11 rounded-xl bg-[#ccfbf1] text-[#0f766e] flex items-center justify-center mb-4">
                  <Icon name="check_circle" size={24} filled weight={600} />
                </div>
                <h3 className="text-[17px] font-extrabold text-gray-950">
                  {a.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-gray-600">
                  {a.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <StatsCounters />
      <IntegrationsBand />

      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-20 md:py-28">
          <h2 className="marketing-display text-[clamp(1.85rem,3.5vw,2.5rem)] text-gray-950 text-center max-w-2xl mx-auto">
            Solutions for every authenticity program
          </h2>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SOLUTIONS.map((s) => (
              <Link
                key={s.t}
                href={s.href}
                className="rounded-2xl border border-gray-200 p-6 hover:border-[#0f766e] hover:shadow-md transition-all group"
              >
                <h3 className="text-[17px] font-extrabold text-gray-950 group-hover:text-[#0f766e]">
                  {s.t}
                </h3>
                <p className="mt-2 text-[14px] text-gray-600">{s.d}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FaqSection />

      <section className="bg-[#134e4a]">
        <div className="mx-auto max-w-[800px] px-5 md:px-8 py-20 md:py-24 text-center text-white">
          <h2 className="marketing-display text-[clamp(1.85rem,3.5vw,2.75rem)]">
            Ready to get started?
          </h2>
          <p className="mt-4 text-[17px] text-teal-50/85 leading-relaxed">
            Schedule a demo and see how LegitScan helps organisations issue,
            manage, and verify credentials, official records, and products —
            on one trust network.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/onboarding"
              className="inline-flex h-12 items-center rounded-full px-7 text-[15px] font-semibold bg-white text-[#134e4a] hover:bg-teal-50"
            >
              Book a demo
            </Link>
            <Link
              href="/architecture"
              className="inline-flex h-12 items-center rounded-full px-6 text-[15px] font-semibold border border-white/30 text-white hover:bg-white/10"
            >
              Explore architecture
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
