import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

type Props = {
  children: React.ReactNode;
  /** Right-panel marketing copy */
  panelTitle?: string;
  panelBody?: string;
  panelBullets?: string[];
};

export function AuthShell({
  children,
  panelTitle = "LegitScan access",
  panelBody = "Issue, hold, and verify credentials, official records, and product authenticity marks across issuers, partners, and verifier desks.",
  panelBullets = [
    "Role-based portals for every stakeholder",
    "Demo accounts ready in one click",
    "Hardware-backed trust — not PDF theatre",
  ],
}: Props) {
  return (
    <div className="marketing-root min-h-screen bg-gray-50 flex flex-col">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center" aria-label="LegitScan home">
            <BrandLogo height={34} />
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-gray-700 hover:text-[#0f766e] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to home
          </Link>
        </div>
      </header>

      <div className="flex-1 mx-auto w-full max-w-[1200px] px-5 md:px-8 py-10 md:py-14 grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        <aside className="hidden lg:block rounded-3xl bg-[#0b1c30] text-white p-10 min-h-[520px] relative overflow-hidden">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#0f766e]/40 blur-3xl" />
          <div className="absolute -left-10 bottom-10 h-40 w-40 rounded-full bg-teal-400/20 blur-3xl" />
          <div className="relative">
            <p className="text-[12px] font-bold tracking-[0.16em] uppercase text-teal-300">
              LegitScan
            </p>
            <h2 className="mt-4 text-[2rem] font-extrabold tracking-tight leading-tight">
              {panelTitle}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-white/65">
              {panelBody}
            </p>
            <ul className="mt-8 space-y-3">
              {panelBullets.map((b) => (
                <li key={b} className="flex gap-3 text-[14px] text-white/80">
                  <span className="material-symbols-outlined text-[#5eead4] text-[20px] shrink-0">
                    check_circle
                  </span>
                  {b}
                </li>
              ))}
            </ul>
            <Link
              href="/"
              className="mt-10 inline-flex items-center gap-2 text-[14px] font-semibold text-[#5eead4] hover:underline"
            >
              ← Return to marketing site
            </Link>
          </div>
        </aside>

        <div className="w-full max-w-md mx-auto lg:mx-0 lg:max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
}
