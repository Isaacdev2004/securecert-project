"use client";

import Link from "next/link";
import { Icon } from "@/components/marketing/Icon";
import { usePassportStore } from "@/lib/passport/store";
import { PageFrame, StatusPill, formatWhen } from "./ui";

export function HomeView() {
  const { ready, state } = usePassportStore();

  if (!ready) {
    return (
      <PageFrame>
        <p className="py-16 text-center text-on-surface-variant">Loading passport…</p>
      </PageFrame>
    );
  }

  const primary = state.credentials.find((c) => c.status === "ACTIVE");
  const activeShares = state.shares.filter((s) => !s.revokedAt).length;

  return (
    <PageFrame>
      <div className="rounded-2xl bg-gradient-to-br from-[#0b1c30] to-[#134e4a] text-white p-5 shadow-lg relative overflow-hidden">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#0f766e]/40 blur-2xl" />
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#5eead4] relative">
          Holder authenticity vault
        </p>
        <h1 className="mt-2 text-[22px] font-extrabold relative leading-tight">
          {state.holderName}
        </h1>
        <p className="mt-1 text-[13px] text-white/65 relative">{state.university}</p>
        <div className="mt-4 flex flex-wrap gap-2 relative">
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold">
            {state.credentials.length} records
          </span>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold">
            Education · Government · Products
          </span>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold">
            {activeShares} active shares
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/passport/share"
          className="rounded-xl bg-white border border-outline-variant/40 p-4 shadow-sm hover:border-[#0f766e]/40"
        >
          <Icon name="qr_code_scanner" size={22} className="text-[#0f766e]" />
          <p className="mt-2 text-[14px] font-bold">Share</p>
          <p className="text-[12px] text-on-surface-variant">Selective disclose</p>
        </Link>
        <Link
          href="/passport/vault"
          className="rounded-xl bg-white border border-outline-variant/40 p-4 shadow-sm hover:border-[#0f766e]/40"
        >
          <Icon name="folder_special" size={22} className="text-[#0f766e]" />
          <p className="mt-2 text-[14px] font-bold">Vault</p>
          <p className="text-[12px] text-on-surface-variant">All authenticity records</p>
        </Link>
      </div>

      {primary && (
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[15px] font-bold">Featured credential</h2>
            <Link
              href={`/passport/credential?id=${primary.id}`}
              className="text-[12px] font-semibold text-[#0f766e]"
            >
              Open
            </Link>
          </div>
          <Link
            href={`/passport/credential?id=${primary.id}`}
            className="block rounded-2xl bg-white border border-outline-variant/40 p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <StatusPill status={primary.status} />
                <p className="mt-2 text-[15px] font-bold leading-snug">
                  {primary.title}
                </p>
                <p className="mt-1 text-[13px] text-[#0f766e] font-semibold">
                  {primary.classification}
                </p>
                <p className="mt-2 text-[12px] text-on-surface-variant">
                  {primary.issuer} · {formatWhen(primary.issuedAt)}
                </p>
              </div>
              <span className="h-11 w-11 rounded-xl bg-[#f0fdfa] text-[#0f766e] inline-flex items-center justify-center shrink-0">
                <Icon name="verified" size={22} filled />
              </span>
            </div>
          </Link>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[15px] font-bold">Recent activity</h2>
          <Link
            href="/passport/activity"
            className="text-[12px] font-semibold text-[#0f766e]"
          >
            See all
          </Link>
        </div>
        <ul className="rounded-2xl bg-white border border-outline-variant/40 divide-y divide-outline-variant/20 overflow-hidden">
          {state.activity.slice(0, 3).map((e) => (
            <li key={e.id} className="px-4 py-3">
              <p className="text-[13px] font-semibold">{e.label}</p>
              <p className="text-[12px] text-on-surface-variant">{e.detail}</p>
              <p className="mt-1 text-[10px] font-audit-mono text-secondary">
                {formatWhen(e.at)} · {e.kind}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </PageFrame>
  );
}
