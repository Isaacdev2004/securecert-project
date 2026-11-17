"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/marketing/Icon";
import { BrandLogo } from "@/components/BrandLogo";

const LINKS = [
  { href: "/architecture", label: "Platform" },
  { href: "/partners", label: "Solutions" },
  { href: "/developers", label: "Developers" },
  { href: "/wholesale", label: "Pricing" },
];

export function MarketingNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <Link
        href="/architecture"
        className="block bg-[#134e4a] text-white text-center text-[13px] sm:text-[14px] font-medium py-2.5 px-4 hover:bg-[#0f766e] transition-colors"
      >
        National Ledger brief: how universities issue &amp; embassies verify in
        under a second →
      </Link>

      <div className="mx-auto max-w-[1200px] px-5 md:px-8 h-[72px] flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center shrink-0" aria-label="SecureCert home">
          <BrandLogo height={36} />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {LINKS.map((link) => {
            const active =
              pathname === link.href ||
              (link.href === "/architecture" && pathname.startsWith("/architecture"));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-lg text-[15px] font-medium transition-colors ${
                  active
                    ? "text-[#0f766e]"
                    : "text-gray-700 hover:text-gray-950 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href="/login"
            className="hidden sm:inline-flex text-[15px] font-semibold text-gray-800 hover:text-[#0f766e]"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="hidden md:inline-flex text-[15px] font-semibold text-gray-800 hover:text-[#0f766e]"
          >
            Sign Up
          </Link>
          <Link href="/onboarding" className="marketing-btn-primary !h-10 !px-5 !text-[14px]">
            Get a Demo
          </Link>
          <button
            type="button"
            className="lg:hidden h-10 w-10 flex items-center justify-center text-gray-900"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "close" : "menu"} size={24} weight={500} />
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-5 py-4 flex flex-col gap-1">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-3 text-[15px] font-medium text-gray-800 border-b border-gray-50"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/verify"
            onClick={() => setOpen(false)}
            className="py-3 text-[15px] font-medium text-gray-800"
          >
            Verify a credential
          </Link>
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="py-3 text-[15px] font-semibold text-gray-800"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            onClick={() => setOpen(false)}
            className="py-3 text-[15px] font-semibold text-gray-800"
          >
            Sign Up
          </Link>
          <Link
            href="/onboarding"
            onClick={() => setOpen(false)}
            className="py-3 text-[15px] font-semibold text-[#0f766e]"
          >
            Get a Demo
          </Link>
        </div>
      )}
    </header>
  );
}
