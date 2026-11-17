"use client";

import { Icon } from "@/components/marketing/Icon";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import type { PortalShell } from "@/lib/path-map";

type ShellKey = Exclude<PortalShell, "public" | "blank" | "passport">;

const META: Record<
  ShellKey,
  {
    org: string;
    eyebrow: string;
    search: string;
    statuses: { label: string }[];
    icon: string;
  }
> = {
  institution: {
    org: "Lagos Authenticity Hub",
    eyebrow: "Issuer · Unique QR · Education levels · Gov seal",
    search: "Search records, DID, serial, reference…",
    statuses: [{ label: "QR symbols live" }, { label: "Webhooks active" }],
    icon: "verified_user",
  },
  partner: {
    org: "TrustLink Channel Partners",
    eyebrow: "Wholesale · Brands · Agencies · SIS",
    search: "Search issuers, apps, keys…",
    statuses: [{ label: "Gateway 99.99%" }, { label: "18ms mean" }],
    icon: "hub",
  },
  admin: {
    org: "LegitScan Root Governance",
    eyebrow: "Zone-0 · Multi-sector network",
    search: "Search tenants, shards, keys…",
    statuses: [{ label: "HSM online" }, { label: "Clusters healthy" }],
    icon: "admin_panel_settings",
  },
  verifier: {
    org: "National Authenticity Desk",
    eyebrow: "Scan unique QR · Education marks · Gov seal",
    search: "Search DID, serial, batch, reference…",
    statuses: [{ label: "HSM validated" }, { label: "Public + desk" }],
    icon: "fact_check",
  },
};

type Props = {
  shell: ShellKey;
  navOpen: boolean;
  onToggleNav: () => void;
};

export function PortalTopBar({ shell, navOpen, onToggleNav }: Props) {
  const meta = META[shell];

  return (
    <header className="sticky top-0 z-40 border-b border-outline-variant/25 bg-surface-container-lowest/95 backdrop-blur-xl">
      <div className="flex h-14 items-center gap-2 px-3 sm:px-4 lg:px-6">
        <button
          type="button"
          aria-label={navOpen ? "Close menu" : "Open menu"}
          aria-expanded={navOpen}
          onClick={onToggleNav}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-outline-variant/30 bg-surface-container-low text-on-surface lg:hidden"
        >
          <Icon name={navOpen ? "close" : "menu"} size={20} />
        </button>

        <div className="min-w-0 flex items-center gap-2 shrink">
          <span className="hidden sm:inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-container text-on-primary">
            <Icon name={meta.icon} size={18} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-bold text-on-surface leading-tight">
              {meta.org}
            </p>
            <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-on-surface-variant leading-tight">
              {meta.eyebrow}
            </p>
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-2 lg:mx-4">
          <label className="relative w-full">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline">
              <Icon name="search" size={18} />
            </span>
            <input
              type="search"
              placeholder={meta.search}
              className="h-9 w-full rounded-lg border border-outline-variant/25 bg-surface-container-low pl-9 pr-3 text-[13px] text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </label>
        </div>

        <div className="ml-auto flex items-center gap-2 shrink-0">
          <div className="hidden xl:flex items-center gap-2">
            {meta.statuses.map((s) => (
              <span
                key={s.label}
                className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-low px-2.5 py-1 text-[11px] font-medium text-on-surface-variant"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {s.label}
              </span>
            ))}
          </div>

          <RoleSwitcher />
        </div>
      </div>
    </header>
  );
}
