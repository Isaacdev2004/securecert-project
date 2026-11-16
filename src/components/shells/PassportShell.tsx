"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RoleSwitcher } from "@/components/RoleSwitcher";

const TABS = [
  { href: "/passport", label: "Passport", icon: "badge" },
  { href: "/passport/vault", label: "Credentials", icon: "school" },
  { href: "/passport/share", label: "Share", icon: "qr_code_scanner" },
  { href: "/passport/activity", label: "Audit", icon: "history_edu" },
];

export function PassportShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // no-op placeholder for future header wiring
  }, []);

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased flex flex-col min-h-screen">
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div ref={headerRef} className="h-16 px-gutter flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <div className="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center text-on-primary shadow-sm">
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs">
                <span className="font-title-sm text-title-sm text-on-surface tracking-tight leading-none">
                  SecureCert
                </span>
                <span className="font-label-status text-label-status text-secondary uppercase leading-none">
                  Passport
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container animate-pulse" />
                <span className="font-label-status text-[10px] text-on-surface-variant tracking-wider uppercase">
                  FIPS Enclave Synced
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col relative w-full pt-16 pb-24 bg-surface min-h-screen">
        {children}
      </div>

      <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface/80 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
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
                    ? "text-primary font-title-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">{tab.icon}</span>
                <span className="font-label-status text-[10px] mt-0.5 tracking-tight uppercase">
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
      <RoleSwitcher />
    </div>
  );
}
