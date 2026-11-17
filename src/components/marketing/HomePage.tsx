import Link from "next/link";
import { CredentialCard } from "@/components/marketing/CredentialCard";
import { EducationLevelLegend } from "@/components/authenticity/VerificationSymbol";
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
import { VerificationSymbol } from "@/components/authenticity/VerificationSymbol";

const BENEFITS = [
  {
    title: "Issue with a unique QR symbol",
    body: "Every certificate gets its own verification QR. Education levels are segmented by mark colour — orange, blue, green, violet — so authenticity is visible before you even scan.",
    href: "/onboarding",
    link: "See issuer onboarding",
  },
  {
    title: "Holders share the real proof",
    body: "People keep certificates in a passport vault and share selective QR links — employers and agencies verify without calling the school.",
    href: "/login",
    link: "Open holder passport demo",
  },
  {
    title: "Scan once. Know if it is genuine.",
    body: "Public verify resolves the unique QR against the ledger. No courier theatre. No wet-stamp guesswork.",
    href: "/verify",
    link: "Try public verify",
  },
];

const ADVANTAGES = [
  {
    title: "Segmented education QR marks",
    body: "Primary (orange), secondary (blue), university (green), and professional (violet) each carry a distinctive verification mark on the shield QR.",
  },
  {
    title: "Separate government seal",
    body: "Official documents use a different seal design language — so a building approval never looks like a school certificate.",
  },
  {
    title: "Unique code per certificate",
    body: "No two issued records share a QR payload. Scan resolves that specific credential — not a generic portal screenshot.",
  },
  {
    title: "Public-first verification",
    body: "Anyone can scan or enter a reference. Authorised desks handle batch employer, embassy, and agency workflows.",
  },
  {
    title: "Lifecycle you can defend",
    body: "Issue, store, share, verify, and revoke with evidence packs employers and regulators can trust.",
  },
  {
    title: "Your issuer brand, front and centre",
    body: "Templates and seals keep the school or agency identity visible — LegitScan is the authenticity layer underneath.",
  },
];

const SOLUTIONS = [
  {
    t: "Primary & basic education",
    d: "Leaving certificates with an orange verification mark on a unique shield QR",
    href: "/onboarding",
  },
  {
    t: "Secondary & exam bodies",
    d: "WAEC, NECO, and SSCE results with a blue verification mark",
    href: "/onboarding",
  },
  {
    t: "Universities & awarding bodies",
    d: "Degrees and transcripts with a green university verification mark",
    href: "/onboarding",
  },
  {
    t: "Professional bodies",
    d: "Licences and memberships with a violet professional mark",
    href: "/onboarding",
  },
  {
    t: "Government & agencies",
    d: "Approvals and official records with a distinct government seal QR",
    href: "/onboarding",
  },
  {
    t: "Employers & verifiers",
    d: "Scan the symbol — confirm authenticity in seconds",
    href: "/verify",
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
              Unique QR codes that prove a certificate is genuine.
            </h1>
            <p className="marketing-rise-delay mt-6 text-[17px] md:text-[18px] leading-relaxed text-gray-600 max-w-xl">
              Someone presents a primary, secondary, university, or professional
              certificate — or a government document. Instead of calling the
              issuer, you scan its unique verification symbol. Education levels
              use coloured marks; government documents use a separate official
              seal.
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
              From paper doubt to scan-and-know
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-gray-600">
              Issuers seal each certificate with a unique QR verification
              symbol. Holders share it. Employers and agencies confirm
              authenticity in seconds — without manual letters or courier stamps.
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

      <section className="bg-white border-y border-gray-100">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-20 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-[13px] font-bold tracking-[0.14em] uppercase text-[#0f766e]">
              Education segmentation
            </p>
            <h2 className="marketing-display mt-3 text-[clamp(1.75rem,3.2vw,2.5rem)] text-gray-950">
              One shield QR. Four coloured marks.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-gray-600">
              The green mark on a university certificate becomes orange for
              primary and blue for secondary — so the level is visible before
              you scan. Professional qualifications use a violet mark.
            </p>
          </div>
          <div className="mt-12">
            <EducationLevelLegend />
          </div>
          <div className="mt-14 grid md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
            <div className="rounded-2xl border border-gray-100 bg-[#0b1c3a]/[0.03] p-6 flex flex-col items-center">
              <VerificationSymbol
                family="GOVERNMENT"
                value="did:legitscan:lagos:bld:88421"
                size="lg"
                showLegend
              />
            </div>
            <div>
              <p className="text-[13px] font-bold tracking-[0.14em] uppercase text-[#c9a227]">
                Government documents
              </p>
              <h3 className="mt-2 text-[1.5rem] font-extrabold text-gray-950">
                A different seal entirely
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-gray-600">
                Approvals, permits, and official records use a distinct
                government seal design — so they are never confused with an
                education certificate QR.
              </p>
              <Link
                href="/verify"
                className="mt-5 inline-flex text-[15px] font-semibold text-[#0f766e] hover:underline"
              >
                Try verifying a government DID →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <TestimonialBand />

      <section className="bg-gray-50 border-y border-gray-100">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <h2 className="marketing-display text-[clamp(1.85rem,3.5vw,2.75rem)] text-gray-950">
              Why LegitScan is different
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-gray-600">
              Not another consulting-only identity stack. A certificate
              authenticity network built around unique QR verification symbols —
              segmented for education levels, with a separate seal for government
              documents.
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
            Schedule a demo and see unique QR verification symbols for primary,
            secondary, university, and professional certificates — plus a
            separate seal for government documents.
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
