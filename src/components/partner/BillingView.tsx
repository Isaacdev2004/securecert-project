"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/components/marketing/Icon";
import { usePartnerStore } from "@/lib/partner/store";
import { PageFrame, Toast, formatNgn, formatWhen } from "./ui";

export function BillingView() {
  const { state } = usePartnerStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab =
    searchParams.get("tab") === "commissions" ? "commissions" : "usage";
  const [toast, setToast] = useState<string | null>(null);
  const b = state.billing;

  function downloadSettlement() {
    const payload = {
      partner: state.partnerName,
      tier: state.tier,
      billing: b,
      invoices: state.invoices,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "partner-settlement.json";
    a.click();
    URL.revokeObjectURL(url);
    setToast("Settlement pack downloaded");
  }

  return (
    <PageFrame>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 font-audit-mono text-audit-mono text-secondary mb-1">
            <span>Partner</span>
            <span className="text-outline">/</span>
            <span className="text-on-surface font-medium">Issuance &amp; Commissions</span>
          </nav>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
            {tab === "commissions"
              ? "Commissions & License Tiers"
              : "Issuance Volume, Usage & Invoices"}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            {state.tier} ({state.kpis.commissionPct}%) · next wire{" "}
            {formatWhen(b.nextWireAt)}
          </p>
          <div className="flex gap-1 mt-3">
            {(
              [
                ["usage", "Issuance & Usage"],
                ["commissions", "Commissions & Tiers"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => router.replace(`/partner/billing?tab=${id}`)}
                className={`px-3 py-1.5 rounded font-title-sm text-title-sm ${
                  tab === id
                    ? "bg-primary-container text-on-primary"
                    : "bg-surface-container text-on-surface-variant"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={downloadSettlement}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-primary-container text-on-primary font-title-sm text-title-sm"
        >
          <Icon name="download" size={18} />
          Download settlement
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="p-4 rounded bg-surface-container-lowest shadow-sm">
          <p className="font-label-status text-label-status uppercase text-secondary">
            Accrued margin
          </p>
          <p className="font-headline-md text-headline-md text-primary font-bold mt-1">
            {formatNgn(state.kpis.marginAccruedNgn)}
          </p>
        </div>
        <div className="p-4 rounded bg-surface-container-lowest shadow-sm">
          <p className="font-label-status text-label-status uppercase text-secondary">
            Gross MTD
          </p>
          <p className="font-headline-md text-headline-md text-primary font-bold mt-1">
            {formatNgn(b.mtdGrossNgn)}
          </p>
        </div>
        <div className="p-4 rounded bg-surface-container-lowest shadow-sm">
          <p className="font-label-status text-label-status uppercase text-secondary">
            Net wire (after WHT)
          </p>
          <p className="font-headline-md text-headline-md text-primary font-bold mt-1">
            {formatNgn(b.mtdNetNgn)}
          </p>
        </div>
        <div className="p-4 rounded bg-surface-container-lowest shadow-sm">
          <p className="font-label-status text-label-status uppercase text-secondary">
            Certs MTD
          </p>
          <p className="font-headline-md text-headline-md text-primary font-bold mt-1">
            {b.mtdCerts.toLocaleString()}
          </p>
          <p className="font-audit-mono text-audit-mono text-on-surface-variant mt-1">
            @ {formatNgn(state.kpis.unitMarginNgn)} margin
          </p>
        </div>
      </div>

      <div className="rounded bg-surface-container-lowest shadow-sm p-4 flex flex-wrap gap-6">
        <div>
          <p className="font-label-status text-label-status uppercase text-secondary">
            Settlement account
          </p>
          <p className="font-title-sm text-title-sm mt-1">
            {b.bankName} · {b.accountNumber}
          </p>
          <p className="font-audit-mono text-audit-mono text-on-surface-variant">
            NIBSS RTGS
          </p>
        </div>
        <div>
          <p className="font-label-status text-label-status uppercase text-secondary">
            Tier ladder
          </p>
          <p className="font-audit-mono text-audit-mono mt-1">
            Silver ₦100 · Gold ₦130 · Platinum ₦155
          </p>
        </div>
        <div>
          <p className="font-label-status text-label-status uppercase text-secondary">
            COGS MTD
          </p>
          <p className="font-title-sm text-title-sm mt-1">{formatNgn(b.mtdCogsNgn)}</p>
        </div>
      </div>

      <div className="rounded bg-surface-container-lowest shadow-sm overflow-hidden">
        <div className="p-4 bg-surface-container-low">
          <h2 className="font-title-md text-title-md text-primary">Per-tenant invoices</h2>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="font-audit-mono text-audit-mono text-on-surface-variant uppercase text-[11px] bg-surface-container-low">
              <th className="py-3 px-4">School</th>
              <th className="py-3 px-4">Period</th>
              <th className="py-3 px-4">Certs</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {state.invoices.map((inv) => (
              <tr key={inv.id}>
                <td className="py-3 px-4 font-title-sm text-title-sm">
                  {inv.schoolName}
                </td>
                <td className="py-3 px-4 font-audit-mono text-audit-mono">
                  {inv.period}
                </td>
                <td className="py-3 px-4 font-audit-mono text-audit-mono">
                  {inv.certs.toLocaleString()}
                </td>
                <td className="py-3 px-4 font-title-sm text-title-sm">
                  {formatNgn(inv.amountNgn)}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                      inv.status === "SETTLED"
                        ? "bg-emerald-50 text-emerald-800"
                        : inv.status === "PENDING"
                          ? "bg-amber-50 text-amber-800"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Toast message={toast} onClose={() => setToast(null)} />
    </PageFrame>
  );
}
