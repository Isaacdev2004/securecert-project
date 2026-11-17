"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { BrandLogo } from "@/components/BrandLogo";
import { Icon } from "@/components/marketing/Icon";

const TABS = [
  { href: "/passport", label: "Passport", icon: "badge" },
  { href: "/passport/vault", label: "Credentials", icon: "school" },
  { href: "/passport/share", label: "Share", icon: "qr_code_scanner" },
  { href: "/passport/activity", label: "Audit", icon: "history_edu" },
];

export function PassportShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased flex flex-col min-h-screen">
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 px-gutter flex items-center justify-between gap-3">
          <div className="flex items-center gap-space-sm min-w-0">
            <BrandLogo height={32} className="shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="font-label-status text-label-status text-secondary uppercase leading-none">
                Passport
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0f766e] animate-pulse" />
                <span className="font-label-status text-[10px] text-on-surface-variant tracking-wider uppercase">
                  FIPS Enclave Synced
                </span>
              </div>
            </div>
          </div>
          <RoleSwitcher />
        </div>
      </header>

      <div className="flex flex-col relative w-full pt-16 pb-24 bg-surface min-h-screen">
        {children}
      </div>

      <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface/80 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.04)] border-t border-outline-variant/20">
        <div className="h-16 px-space-xs flex items-center justify-around">
          {TABS.map((tab) => {
            const active =
              tab.href === "/passport"
                ? pathname === "/passport"
                : pathname === tab.href || pathname.startsWith(`${tab.href}/`);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`flex-1 flex flex-col items-center justify-center h-12 transition-colors ${
                  active
                    ? "text-[#0f766e] font-title-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <Icon name={tab.icon} size={22} filled={active} weight={500} />
                <span className="font-label-status text-[10px] mt-0.5 tracking-tight uppercase">
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
