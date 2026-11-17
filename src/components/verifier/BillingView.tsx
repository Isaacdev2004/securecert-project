"use client";

import { useState } from "react";
import { Icon } from "@/components/marketing/Icon";
import { useVerifierStore } from "@/lib/verifier/store";
import { PageFrame, Toast, formatWhen } from "./ui";

const NAFEM_RATE = 1600;

export function BillingView() {
  const { state, topUpEscrow } = useVerifierStore();
  const [toast, setToast] = useState<string | null>(null);
  const nafem = Math.round(state.escrowBalanceUsd * NAFEM_RATE);
  const inquiriesLeft = Math.floor(state.escrowBalanceUsd / state.tariffUsd);

  return (
    <PageFrame>
      <div>
        <nav className="flex items-center gap-2 font-audit-mono text-audit-mono text-secondary mb-1">
          <span>Verifier</span>
          <span className="text-outline">/</span>
          <span className="text-on-surface font-medium">Tariffs &amp; FX Escrow</span>
        </nav>
        <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
          Evaluator Tariffs &amp; FX Escrow
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 max-w-3xl">
          Consular clearing balance, per-verify tariff, and university revenue share with NAFEM
          FX reference.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded bg-surface-container-lowest shadow-sm">
          <p className="font-label-status text-label-status uppercase text-secondary">
            Escrow balance
          </p>
          <p className="font-headline-xl text-headline-xl text-primary font-bold mt-1">
            ${state.escrowBalanceUsd.toLocaleString("en-US")}
          </p>
          <p className="font-audit-mono text-audit-mono text-on-surface-variant mt-2">
            ≈ ₦{nafem.toLocaleString("en-NG")} NAFEM · ~{inquiriesLeft} inquiries
          </p>
        </div>
        <div className="p-4 rounded bg-surface-container-lowest shadow-sm">
          <p className="font-label-status text-label-status uppercase text-secondary">
            Tariff
          </p>
          <p className="font-headline-xl text-headline-xl text-primary font-bold mt-1">
            ${state.tariffUsd.toFixed(2)}
          </p>
          <p className="font-audit-mono text-audit-mono text-on-surface-variant mt-2">
            Per cryptographic verification
          </p>
        </div>
        <div className="p-4 rounded bg-surface-container-lowest shadow-sm">
          <p className="font-label-status text-label-status uppercase text-secondary">
            University share
          </p>
          <p className="font-headline-xl text-headline-xl text-primary font-bold mt-1">
            {state.univSharePct}%
          </p>
          <p className="font-audit-mono text-audit-mono text-on-surface-variant mt-2">
            30d cleared ${state.clearedUsd30d.toLocaleString("en-US")}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[500, 1000, 2500].map((amt) => (
          <button
            key={amt}
            type="button"
            onClick={() => {
              topUpEscrow(amt);
              setToast(`Escrow topped up by $${amt}`);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded bg-primary-container hover:bg-primary text-on-primary font-title-sm text-title-sm"
          >
            <Icon name="add_card" size={18} />
            Top up ${amt.toLocaleString("en-US")}
          </button>
        ))}
      </div>

      <div className="rounded bg-surface-container-lowest shadow-sm overflow-hidden">
        <div className="p-4 bg-surface-container-low">
          <h2 className="font-title-md text-title-md text-primary">Settlement manifest</h2>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="font-audit-mono text-audit-mono text-on-surface-variant uppercase text-[11px] bg-surface-container-low">
              <th className="py-3 px-4">When</th>
              <th className="py-3 px-4">Label</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Univ share</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {state.settlements.map((s) => (
              <tr key={s.id}>
                <td className="py-3 px-4 font-audit-mono text-audit-mono text-on-surface-variant">
                  {formatWhen(s.at)}
                </td>
                <td className="py-3 px-4 font-title-sm text-title-sm">{s.label}</td>
                <td className="py-3 px-4 font-title-sm text-title-sm">
                  ${s.amountUsd.toFixed(2)}
                </td>
                <td className="py-3 px-4 font-audit-mono text-audit-mono">
                  ${s.univShareUsd.toFixed(2)}
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
