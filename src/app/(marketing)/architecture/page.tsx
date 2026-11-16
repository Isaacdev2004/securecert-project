import Link from "next/link";
import { PageIntro } from "@/components/marketing/PageIntro";
import { SecurityStrip } from "@/components/marketing/HomeExtras";

export default function ArchitecturePage() {
  return (
    <>
      <PageIntro
        eyebrow="Platform"
        title="Cryptography built for program growth — and national trust."
        lede="Hardware-backed seals, Merkle registries, and selective disclosure — so your institution can issue at scale and the world can verify with confidence."
      />

      <SecurityStrip />

      <section className="bg-gray-50">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-16 md:py-24 grid gap-5 md:grid-cols-2">
          {[
            {
              t: "Institutional HSM seals",
              d: "Ed25519 keys in FIPS-oriented modules with senate M-of-N ceremonies — never a shared software secret.",
              icon: "vpn_key",
            },
            {
              t: "Merkle registry",
              d: "Every credential is a leaf. Cohort issuance commits a root. Verifiers recompute inclusion in milliseconds.",
              icon: "account_tree",
            },
            {
              t: "Selective disclosure",
              d: "Graduates reveal only what an embassy needs. Identity tokens and grades stay private unless granted.",
              icon: "visibility_off",
            },
            {
              t: "Sovereign tenancy",
              d: "Isolated institutional enclaves with partner wholesale rails and shard-aware operations.",
              icon: "domain",
            },
          ].map((item) => (
            <article
              key={item.t}
              className="rounded-2xl bg-white border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="h-11 w-11 rounded-xl bg-[#f0fdfa] text-[#0f766e] inline-flex items-center justify-center">
                <span className="material-symbols-outlined">{item.icon}</span>
              </span>
              <h2 className="mt-4 text-[1.35rem] font-extrabold text-gray-950">
                {item.t}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-gray-600">
                {item.d}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-16 md:py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[13px] font-bold tracking-[0.14em] uppercase text-[#0f766e]">
              Proof path
            </p>
            <h2 className="marketing-display mt-3 text-[clamp(1.75rem,3vw,2.5rem)] text-gray-950">
              Verification that recomputes — never “trust the PDF.”
            </h2>
            <p className="mt-4 text-[16px] text-gray-600 leading-relaxed">
              Every public resolve walks the Merkle path, checks the HSM seal,
              and consults the revocation registry before returning VALID.
            </p>
            <Link href="/verify" className="marketing-btn-primary mt-8">
              Try it live
            </Link>
          </div>
          <div className="rounded-2xl bg-[#0b1c30] text-white p-6 sm:p-8 space-y-3 font-mono text-[12px]">
            {[
              ["Leaf hash", "sha256(credential)"],
              ["Sibling", "0x7c1a…e92f"],
              ["Root", "batch://unilag/2024-11"],
              ["HSM seal", "ed25519 · VALID"],
              ["Revocation", "not listed"],
            ].map(([k, v]) => (
              <div
                key={k}
                className="flex justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <span className="text-white/45">{k}</span>
                <span className="text-[#5eead4] truncate">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 border-t border-gray-100">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-14 flex flex-wrap gap-3">
          <Link href="/onboarding" className="marketing-btn-primary">
            Book a demo
          </Link>
          <Link href="/developers" className="marketing-btn-secondary">
            View developer APIs
          </Link>
        </div>
      </section>
    </>
  );
}
