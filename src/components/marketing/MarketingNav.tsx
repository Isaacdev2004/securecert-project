"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { Icon } from "@/components/marketing/Icon";

type NavItem = {
  href: string;
  label: string;
  desc?: string;
  icon?: string;
};

type NavGroup = {
  id: string;
  label: string;
  intro: {
    title?: string;
    body: string;
    primary?: { href: string; label: string };
    secondary?: { href: string; label: string };
  };
  sectionHeading?: string;
  items: NavItem[];
};

const ACCENT = "#0f766e";

const UTILITY: NavItem[] = [
  { href: "/architecture", label: "Resources" },
  { href: "/architecture", label: "Trust Centre" },
  { href: "/partners", label: "Partners" },
  { href: "/onboarding", label: "Support" },
];

const GROUPS: NavGroup[] = [
  {
    id: "solutions",
    label: "What we solve",
    intro: {
      title: "Start with the failure, not the product.",
      body: "Not sure which rail fits? Describe the authenticity process in your own words. We will route it from there.",
      primary: { href: "/onboarding", label: "Describe your process" },
      secondary: { href: "/partners", label: "See all problems" },
    },
    items: [
      {
        href: "/partners",
        label: "Authenticate credentials",
        desc: "Degrees, licences, and certificates that travel.",
        icon: "verified",
      },
      {
        href: "/partners",
        label: "Issue government records",
        desc: "Approvals, permits, and official documents.",
        icon: "account_balance",
      },
      {
        href: "/partners",
        label: "Prove product authenticity",
        desc: "Anti-counterfeit seals anyone can scan.",
        icon: "qr_code_2",
      },
      {
        href: "/verify",
        label: "Verify across borders",
        desc: "Employers, agencies, and customs in seconds.",
        icon: "public",
      },
      {
        href: "/onboarding",
        label: "Govern issuer workforces",
        desc: "Registrars, agents, and partner operators.",
        icon: "groups",
      },
      {
        href: "/architecture",
        label: "Defend the evidence pack",
        desc: "Merkle proofs and audit trails that hold up.",
        icon: "shield",
      },
    ],
  },
  {
    id: "platform",
    label: "Platform",
    intro: {
      body: "A maintained product core for credentials, official records, and product authenticity — not a separate codebase for every client.",
    },
    sectionHeading: "The LegitScan Platform",
    items: [
      {
        href: "/architecture",
        label: "Platform overview",
        desc: "One trust stack for issue, share, verify, and revoke.",
        icon: "layers",
      },
      {
        href: "/architecture",
        label: "Capabilities",
        desc: "Custody, evidence packs, selective disclosure, audit.",
        icon: "grid_view",
      },
      {
        href: "/wholesale",
        label: "Licensing & pricing",
        desc: "What recurs, what is implementation, how tiers scale.",
        icon: "autorenew",
      },
      {
        href: "/developers",
        label: "APIs & integrations",
        desc: "Sandbox keys, webhooks, and SIS / ERP connectors.",
        icon: "hub",
      },
    ],
  },
  {
    id: "industries",
    label: "Industries",
    intro: {
      title: "The same trust network, shaped to your sector.",
      body: "Education, government, brands, and verifiers share one ledger — with controls that match how you operate.",
      primary: { href: "/onboarding", label: "Discuss your project" },
      secondary: { href: "/partners", label: "Explore partners" },
    },
    sectionHeading: "Sectors we serve",
    items: [
      {
        href: "/partners",
        label: "Higher education",
        desc: "Degrees, transcripts, and awarding-body results.",
        icon: "school",
      },
      {
        href: "/partners",
        label: "Government & regulators",
        desc: "Citizen services, permits, and official records.",
        icon: "account_balance",
      },
      {
        href: "/partners",
        label: "Brands & manufacturing",
        desc: "SKU and batch authenticity for physical goods.",
        icon: "inventory_2",
      },
      {
        href: "/verify",
        label: "Screening & employers",
        desc: "Instant authenticity without courier theatre.",
        icon: "work",
      },
    ],
  },
];

const SIMPLE_LINKS: NavItem[] = [
  { href: "/developers", label: "Developers" },
  { href: "/wholesale", label: "Pricing" },
  { href: "/verify", label: "Proof" },
];

export function MarketingNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const rootRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setOpenId(null);
    setMobileOpen(false);
    setMobileSection(null);
  }, [pathname]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpenId(null);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenId(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function openMenu(id: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenId(id);
  }

  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenId(null), 160);
  }

  const activeGroup = GROUPS.find((g) => g.id === openId) ?? null;

  return (
    <header
      ref={rootRef}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/80"
    >
      {/* Light utility bar */}
      <div className="hidden lg:block border-b border-gray-100 bg-[#f8faf9]">
        <div className="mx-auto max-w-[1240px] px-5 md:px-8 h-9 flex items-center justify-between gap-4">
          <p className="text-[12px] font-medium text-gray-500 tracking-wide">
            Verify · Authenticate · Trust
          </p>
          <div className="flex items-center gap-6">
            {UTILITY.map((u) => (
              <Link
                key={u.href + u.label}
                href={u.href}
                className="text-[12px] font-medium text-gray-600 hover:text-[#0f766e] transition-colors"
              >
                {u.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Primary bar */}
      <div className="mx-auto max-w-[1240px] px-5 md:px-8 h-[64px] flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center shrink-0" aria-label="LegitScan home">
          <BrandLogo height={32} />
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5" aria-label="Primary">
          {GROUPS.map((group) => {
            const isOpen = openId === group.id;
            return (
              <div
                key={group.id}
                className="relative"
                onMouseEnter={() => openMenu(group.id)}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  onClick={() => setOpenId(isOpen ? null : group.id)}
                  className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-[14px] font-medium transition-colors ${
                    isOpen
                      ? "text-[#0f766e] border border-[#0f766e]/40 bg-[#f0fdfa]"
                      : "text-gray-800 border border-transparent hover:text-gray-950 hover:bg-gray-50"
                  }`}
                >
                  {group.label}
                  <Icon
                    name="expand_more"
                    size={18}
                    className={`opacity-70 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            );
          })}

          {SIMPLE_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-full text-[14px] font-medium transition-colors ${
                  active
                    ? "text-[#0f766e]"
                    : "text-gray-800 hover:text-gray-950 hover:bg-gray-50"
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
            className="hidden sm:inline-flex text-[14px] font-semibold text-gray-800 hover:text-[#0f766e]"
          >
            Sign in
          </Link>
          <Link
            href="/onboarding"
            className="inline-flex h-9 items-center rounded-full px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#0d9488]"
            style={{ backgroundColor: ACCENT }}
          >
            Discuss your project
          </Link>
          <button
            type="button"
            className="lg:hidden h-10 w-10 flex items-center justify-center text-gray-900 rounded-md hover:bg-gray-50"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <Icon name={mobileOpen ? "close" : "menu"} size={24} weight={500} />
          </button>
        </div>
      </div>

      {/* Desktop mega panel — light */}
      {activeGroup && (
        <div
          className="hidden lg:block absolute left-0 right-0 top-full border-b border-gray-200 bg-white shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)]"
          onMouseEnter={() => openMenu(activeGroup.id)}
          onMouseLeave={scheduleClose}
        >
          <div className="mx-auto max-w-[1240px] px-5 md:px-8 py-9 grid gap-8 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-0">
            <div className="flex flex-col justify-center lg:pr-10">
              {activeGroup.intro.title && (
                <h3 className="text-[22px] font-semibold leading-tight tracking-tight text-gray-950">
                  {activeGroup.intro.title}
                </h3>
              )}
              <p
                className={`text-[15px] leading-relaxed text-gray-500 ${
                  activeGroup.intro.title ? "mt-3" : "text-[16px]"
                }`}
              >
                {activeGroup.intro.body}
              </p>
              {(activeGroup.intro.primary || activeGroup.intro.secondary) && (
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {activeGroup.intro.secondary && (
                    <Link
                      href={activeGroup.intro.secondary.href}
                      onClick={() => setOpenId(null)}
                      className="inline-flex h-10 items-center rounded-full border border-gray-300 px-4 text-[13px] font-semibold text-gray-800 hover:border-gray-400 transition-colors"
                    >
                      {activeGroup.intro.secondary.label}
                      <span className="ml-1.5 opacity-60">→</span>
                    </Link>
                  )}
                  {activeGroup.intro.primary && (
                    <Link
                      href={activeGroup.intro.primary.href}
                      onClick={() => setOpenId(null)}
                      className="inline-flex h-10 items-center rounded-full px-4 text-[13px] font-semibold text-white hover:bg-[#0d9488] transition-colors"
                      style={{ backgroundColor: ACCENT }}
                    >
                      {activeGroup.intro.primary.label}
                    </Link>
                  )}
                </div>
              )}
            </div>

            <div className="lg:border-l lg:border-gray-100 lg:pl-10">
              {activeGroup.sectionHeading && (
                <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-gray-400 mb-3">
                  {activeGroup.sectionHeading}
                </p>
              )}
              <ul className="space-y-0.5">
                {activeGroup.items.map((item) => (
                  <li key={item.href + item.label}>
                    <Link
                      href={item.href}
                      onClick={() => setOpenId(null)}
                      className="group flex items-start gap-3.5 rounded-xl px-2.5 py-2.5 hover:bg-[#f0fdfa] transition-colors"
                    >
                      <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#f0fdfa] text-[#0f766e]">
                        <Icon name={item.icon ?? "chevron_right"} size={18} />
                      </span>
                      <span className="min-w-0 pt-0.5">
                        <span className="block text-[15px] font-semibold text-gray-950 group-hover:text-[#0f766e] transition-colors">
                          {item.label}
                        </span>
                        {item.desc && (
                          <span className="mt-0.5 block text-[13px] leading-snug text-gray-500">
                            {item.desc}
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white max-h-[min(78vh,640px)] overflow-y-auto">
          <div className="px-5 py-3 flex flex-wrap gap-x-4 gap-y-2 border-b border-gray-50">
            {UTILITY.map((u) => (
              <Link
                key={u.href + u.label}
                href={u.href}
                onClick={() => setMobileOpen(false)}
                className="text-[12px] font-medium text-gray-500"
              >
                {u.label}
              </Link>
            ))}
          </div>

          <div className="px-5 py-2">
            {GROUPS.map((group) => {
              const expanded = mobileSection === group.id;
              return (
                <div key={group.id} className="border-b border-gray-50">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between py-3.5 text-left text-[15px] font-semibold text-gray-900"
                    onClick={() => setMobileSection(expanded ? null : group.id)}
                  >
                    {group.label}
                    <Icon
                      name="expand_more"
                      size={20}
                      className={expanded ? "rotate-180" : ""}
                    />
                  </button>
                  {expanded && (
                    <div className="pb-3 space-y-1">
                      {group.items.map((item) => (
                        <Link
                          key={item.href + item.label}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="block py-2 text-[14px] font-medium text-gray-700"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {SIMPLE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-3.5 text-[15px] font-semibold text-gray-900 border-b border-gray-50"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="block py-3.5 text-[15px] font-semibold text-gray-900"
            >
              Sign in
            </Link>
            <Link
              href="/onboarding"
              onClick={() => setMobileOpen(false)}
              className="block py-3.5 text-[15px] font-semibold text-[#0f766e]"
            >
              Discuss your project
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
