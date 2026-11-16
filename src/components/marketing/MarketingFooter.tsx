import Link from "next/link";
import { Icon } from "@/components/marketing/Icon";

export function MarketingFooter() {
  return (
    <footer className="bg-[#0b1c30] text-white">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-16 md:py-20 grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="h-9 w-9 rounded-lg bg-[#0f766e] flex items-center justify-center text-white">
              <Icon name="verified" size={20} filled weight={600} />
            </span>
            <span className="text-[1.25rem] font-extrabold">SecureCert</span>
          </div>
          <p className="mt-4 text-[14px] leading-relaxed text-white/65 max-w-sm">
            SecureCert is the sovereign digital credential platform enabling
            universities and partners to issue, share, and verify tamper-proof
            academic credentials.
          </p>
        </div>

        <div>
          <p className="text-[12px] font-bold tracking-[0.12em] uppercase text-white/45">
            Platform
          </p>
          <div className="mt-4 flex flex-col gap-2.5 text-[14px]">
            <Link href="/architecture" className="text-white/75 hover:text-white">
              Architecture
            </Link>
            <Link href="/developers" className="text-white/75 hover:text-white">
              Developer APIs
            </Link>
            <Link href="/verify" className="text-white/75 hover:text-white">
              Public verify
            </Link>
            <Link href="/wholesale" className="text-white/75 hover:text-white">
              Pricing / Wholesale
            </Link>
          </div>
        </div>

        <div>
          <p className="text-[12px] font-bold tracking-[0.12em] uppercase text-white/45">
            Solutions
          </p>
          <div className="mt-4 flex flex-col gap-2.5 text-[14px]">
            <Link href="/onboarding" className="text-white/75 hover:text-white">
              Higher Education
            </Link>
            <Link href="/partners" className="text-white/75 hover:text-white">
              SIS Partners
            </Link>
            <Link href="/verify" className="text-white/75 hover:text-white">
              Embassies &amp; WES
            </Link>
          </div>
        </div>

        <div>
          <p className="text-[12px] font-bold tracking-[0.12em] uppercase text-white/45">
            Company
          </p>
          <div className="mt-4 flex flex-col gap-2.5 text-[14px]">
            <Link href="/onboarding" className="text-white/75 hover:text-white">
              Book a demo
            </Link>
            <Link href="/signup" className="text-white/75 hover:text-white">
              Sign up
            </Link>
            <Link href="/login" className="text-white/75 hover:text-white">
              Sign in
            </Link>
            <Link href="/developers" className="text-white/75 hover:text-white">
              API docs
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-5 flex flex-col sm:flex-row gap-2 sm:justify-between text-[12px] text-white/45">
          <span>© 2026 SecureCert. All rights reserved.</span>
          <span>NDPA 2023 · NUC Consortium · W3C VC 2.0</span>
        </div>
      </div>
    </footer>
  );
}
