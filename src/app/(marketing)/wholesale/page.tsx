import Link from "next/link";
import { PageIntro } from "@/components/marketing/PageIntro";
import { StatsCounters } from "@/components/marketing/StatsCounters";

export default function WholesalePage() {
  return (
    <>
      <PageIntro
        eyebrow="Pricing"
        title="Wholesale economics that scale with every verification."
        lede="Institutions earn sovereign dividends on consular lookups. Partners lock tiered rates without a spreadsheet wall."
      />

      <section className="bg-gray-50">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-16 md:py-20 grid gap-5 md:grid-cols-3">
          {[
            {
              tier: "Campus",
              price: "₦85",
              note: "per anchored record",
              detail: "Single-university tenancies issuing under 50k credentials / year.",
              featured: false,
            },
            {
              tier: "Consortium",
              price: "₦62",
              note: "volume blended",
              detail: "State systems and multi-campus networks with shared HSM custody.",
              featured: true,
            },
            {
              tier: "Partner",
              price: "40%",
              note: "of consular fee",
              detail: "SIS resellers settle wholesale commissions on every embassy resolve.",
              featured: false,
            },
          ].map((t) => (
            <article
              key={t.tier}
              className={`rounded-2xl p-8 flex flex-col border shadow-sm ${
                t.featured
                  ? "bg-[#134e4a] text-white border-[#134e4a] scale-[1.02]"
                  : "bg-white text-gray-950 border-gray-100"
              }`}
            >
              {t.featured && (
                <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#5eead4]">
                  Most chosen
                </span>
              )}
              <h2
                className={`text-[1.25rem] font-extrabold ${t.featured ? "mt-2" : ""}`}
              >
                {t.tier}
              </h2>
              <p
                className={`mt-6 marketing-display text-5xl ${
                  t.featured ? "text-white" : "text-[#0f766e]"
                }`}
              >
                {t.price}
              </p>
              <p
                className={`mt-1 text-[13px] font-semibold ${
                  t.featured ? "text-teal-100/80" : "text-gray-500"
                }`}
              >
                {t.note}
              </p>
              <p
                className={`mt-5 text-[14px] leading-relaxed flex-1 ${
                  t.featured ? "text-teal-50/85" : "text-gray-600"
                }`}
              >
                {t.detail}
              </p>
              <Link
                href="/onboarding"
                className={`mt-8 inline-flex h-11 items-center justify-center rounded-full text-[14px] font-semibold ${
                  t.featured
                    ? "bg-white text-[#134e4a]"
                    : "bg-[#0f766e] text-white"
                }`}
              >
                Choose {t.tier}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <StatsCounters />

      <section className="bg-white">
        <div className="mx-auto max-w-[800px] px-5 md:px-8 py-16 text-center">
          <h2 className="marketing-display text-[clamp(1.75rem,3vw,2.4rem)] text-gray-950">
            Simulate your institution dividend
          </h2>
          <p className="mt-3 text-gray-600">
            Book a briefing and we&apos;ll model consular volume against your
            wholesale tier.
          </p>
          <Link href="/onboarding" className="marketing-btn-primary mt-8">
            Lock in a wholesale tier
          </Link>
        </div>
      </section>
    </>
  );
}
