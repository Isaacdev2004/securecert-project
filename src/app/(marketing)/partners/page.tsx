import Link from "next/link";
import { PageIntro } from "@/components/marketing/PageIntro";
import { LogoMarquee } from "@/components/marketing/LogoMarquee";
import { Icon } from "@/components/marketing/Icon";

export default function PartnersPage() {
  return (
    <>
      <PageIntro
        eyebrow="Solutions"
        title="Connect the systems universities already run."
        lede="SecureCert sits beside Banner, PowerSchool, and custom ERPs — white-label verification and wholesale margins included."
      />

      <LogoMarquee />

      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-16 md:py-20 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 p-8 md:p-10 hover:border-[#0f766e] transition-colors">
            <span className="h-12 w-12 rounded-2xl bg-[#f0fdfa] text-[#0f766e] inline-flex items-center justify-center">
              <Icon name="school" size={28} weight={500} />
            </span>
            <h2 className="mt-5 text-[1.5rem] font-extrabold text-gray-950">
              For universities
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-gray-600">
              Stand up a tenant, design parchment templates, and issue cohorts
              without replacing your student information system.
            </p>
            <ul className="mt-5 space-y-2 text-[14px] text-gray-600">
              {[
                "Single + bulk issuance",
                "Accreditation export dossiers",
                "Revocation governance",
                "Team M-of-N custody",
              ].map((x) => (
                <li key={x} className="flex gap-2 items-center">
                  <Icon name="check" size={18} className="text-[#0f766e]" weight={600} />
                  {x}
                </li>
              ))}
            </ul>
            <Link href="/onboarding" className="marketing-btn-primary mt-8">
              Become an issuing institution
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-200 p-8 md:p-10 hover:border-[#0f766e] transition-colors">
            <span className="h-12 w-12 rounded-2xl bg-[#f0fdfa] text-[#0f766e] inline-flex items-center justify-center">
              <Icon name="hub" size={28} weight={500} />
            </span>
            <h2 className="mt-5 text-[1.5rem] font-extrabold text-gray-950">
              For software vendors
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-gray-600">
              Map fields, ship webhooks, theme the verify portal, and settle
              wholesale commissions from one partner hub.
            </p>
            <ul className="mt-5 space-y-2 text-[14px] text-gray-600">
              {[
                "OAuth API keys",
                "SIS field mapping",
                "White-label verify portals",
                "Commission settlement",
              ].map((x) => (
                <li key={x} className="flex gap-2 items-center">
                  <Icon name="check" size={18} className="text-[#0f766e]" weight={600} />
                  {x}
                </li>
              ))}
            </ul>
            <Link href="/login" className="marketing-btn-secondary mt-8">
              Partner portal login
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#134e4a] text-white">
        <div className="mx-auto max-w-[800px] px-5 md:px-8 py-16 text-center">
          <h2 className="marketing-display text-[clamp(1.75rem,3vw,2.5rem)]">
            Ready to connect your first school?
          </h2>
          <p className="mt-3 text-teal-50/85">
            Book a partner briefing and lock your wholesale tier.
          </p>
          <Link
            href="/onboarding"
            className="mt-8 inline-flex h-12 items-center rounded-full px-7 font-semibold bg-white text-[#134e4a]"
          >
            Talk to partnerships
          </Link>
        </div>
      </section>
    </>
  );
}
