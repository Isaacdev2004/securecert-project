import Link from "next/link";
import { PageIntro } from "@/components/marketing/PageIntro";
import { LogoMarquee } from "@/components/marketing/LogoMarquee";
import { Icon } from "@/components/marketing/Icon";

export default function PartnersPage() {
  return (
    <>
      <PageIntro
        eyebrow="Solutions"
        title="Serve every organisation that needs authenticity."
        lede="LegitScan sits beside SIS, agency registries, and brand catalogues — white-label verification and wholesale margins included."
      />

      <LogoMarquee />

      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-16 md:py-20 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 p-8 hover:border-[#0f766e] transition-colors">
            <span className="h-12 w-12 rounded-2xl bg-[#f0fdfa] text-[#0f766e] inline-flex items-center justify-center">
              <Icon name="school" size={28} weight={500} />
            </span>
            <h2 className="mt-5 text-[1.35rem] font-extrabold text-gray-950">
              Education &amp; agencies
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-gray-600">
              Issue certificates, licences, approvals, and official records
              without replacing systems of record.
            </p>
            <ul className="mt-5 space-y-2 text-[14px] text-gray-600">
              {[
                "Single + bulk issuance",
                "Revocation governance",
                "Evidence packs for audits",
                "Team custody controls",
              ].map((x) => (
                <li key={x} className="flex gap-2 items-center">
                  <Icon name="check" size={18} className="text-[#0f766e]" weight={600} />
                  {x}
                </li>
              ))}
            </ul>
            <Link href="/onboarding" className="marketing-btn-primary mt-8">
              Become an issuer
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-200 p-8 hover:border-[#0f766e] transition-colors">
            <span className="h-12 w-12 rounded-2xl bg-[#f0fdfa] text-[#0f766e] inline-flex items-center justify-center">
              <Icon name="qr_code_2" size={28} weight={500} />
            </span>
            <h2 className="mt-5 text-[1.35rem] font-extrabold text-gray-950">
              Brands &amp; manufacturers
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-gray-600">
              Attach authenticity marks consumers, retailers, and customs can
              scan — fight counterfeits with verifiable product proofs.
            </p>
            <ul className="mt-5 space-y-2 text-[14px] text-gray-600">
              {[
                "SKU / batch authenticity",
                "Public scan verify",
                "Revoke compromised lots",
                "Partner channel reporting",
              ].map((x) => (
                <li key={x} className="flex gap-2 items-center">
                  <Icon name="check" size={18} className="text-[#0f766e]" weight={600} />
                  {x}
                </li>
              ))}
            </ul>
            <Link href="/onboarding" className="marketing-btn-secondary mt-8">
              Talk product authenticity
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-200 p-8 hover:border-[#0f766e] transition-colors">
            <span className="h-12 w-12 rounded-2xl bg-[#f0fdfa] text-[#0f766e] inline-flex items-center justify-center">
              <Icon name="hub" size={28} weight={500} />
            </span>
            <h2 className="mt-5 text-[1.35rem] font-extrabold text-gray-950">
              Software &amp; channel partners
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-gray-600">
              Map fields, ship webhooks, theme the verify portal, and settle
              wholesale commissions from one partner hub.
            </p>
            <ul className="mt-5 space-y-2 text-[14px] text-gray-600">
              {[
                "OAuth API keys",
                "Field mapping",
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
          <h2 className="marketing-display text-[clamp(1.6rem,3vw,2.25rem)]">
            Grow with authenticity demand
          </h2>
          <p className="mt-4 text-[16px] text-teal-50/85 leading-relaxed">
            Whether you issue credentials, government approvals, or product
            seals — LegitScan gives verifiers a reliable way to confirm
            authenticity and gives issuers a path to verification revenue.
          </p>
          <Link
            href="/onboarding"
            className="mt-8 inline-flex h-12 items-center rounded-full px-7 text-[15px] font-semibold bg-white text-[#134e4a] hover:bg-teal-50"
          >
            Book a partner demo
          </Link>
        </div>
      </section>
    </>
  );
}
