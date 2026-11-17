"use client";

import { useState } from "react";
import { Icon } from "@/components/marketing/Icon";
import { useAdminStore } from "@/lib/admin/store";
import { PageFrame, Toast, formatNgn } from "./ui";

export function TariffsView() {
  const { state, topUpQuota, recalculateMargins } = useAdminStore();
  const [toast, setToast] = useState<string | null>(null);
  const [grads, setGrads] = useState(state.economics.grads);
  const [sisPct, setSisPct] = useState(state.economics.sisMarginPct);

  return (
    <PageFrame>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 font-audit-mono text-audit-mono text-secondary mb-1">
            <span>Super Admin</span>
            <span className="text-outline">/</span>
            <span className="text-on-surface font-medium">
              Wholesale Tariffs &amp; Quotas
            </span>
          </nav>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
            Wholesale Tariffs &amp; Global Quotas
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Mint run-rate {(state.kpis.mintRunRate / 1e6).toFixed(2)}M/yr · avg{" "}
            {formatNgn(state.kpis.wholesaleAvgNgn)} · FX ₦1,600/$1
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            const payload = {
              tariffs: state.tariffs,
              quotas: state.quotas,
              clearing: state.clearing,
              economics: state.economics,
            };
            const blob = new Blob([JSON.stringify(payload, null, 2)], {
              type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "tariff-dossier.json";
            a.click();
            URL.revokeObjectURL(url);
            setToast("Tariff dossier exported");
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-primary-container text-on-primary font-title-sm text-title-sm"
        >
          <Icon name="download" size={18} />
          Export dossier
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="p-4 rounded bg-surface-container-lowest shadow-sm">
          <p className="font-label-status text-label-status uppercase text-secondary">
            Clearing pool
          </p>
          <p className="font-headline-md text-headline-md text-primary font-bold mt-1">
            {formatNgn(state.kpis.clearingPoolNgn)}
          </p>
        </div>
        <div className="p-4 rounded bg-surface-container-lowest shadow-sm">
          <p className="font-label-status text-label-status uppercase text-secondary">
            Escrow
          </p>
          <p className="font-headline-md text-headline-md text-primary font-bold mt-1">
            {formatNgn(state.kpis.escrowNgn)}
          </p>
        </div>
        <div className="p-4 rounded bg-surface-container-lowest shadow-sm">
          <p className="font-label-status text-label-status uppercase text-secondary">
            Wholesale avg
          </p>
          <p className="font-headline-md text-headline-md text-primary font-bold mt-1">
            {formatNgn(state.kpis.wholesaleAvgNgn)}
          </p>
        </div>
        <div className="p-4 rounded bg-surface-container-lowest shadow-sm">
          <p className="font-label-status text-label-status uppercase text-secondary">
            API headroom
          </p>
          <p className="font-headline-md text-headline-md text-primary font-bold mt-1">
            88.4M reqs
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {state.tariffs.map((t) => (
          <div
            key={t.id}
            className="rounded bg-surface-container-lowest shadow-sm p-4 space-y-2"
          >
            <p className="font-label-status text-label-status uppercase text-secondary">
              Tier {t.code}
            </p>
            <p className="font-title-md text-title-md text-primary">{t.label}</p>
            <p className="font-body-sm text-body-sm">
              Mint {formatNgn(t.mintNgn)}
              {t.queryUsd
                ? ` · Query $${t.queryUsd.toFixed(2)}`
                : ` · Query ${formatNgn(t.queryNgn)}`}
            </p>
            <p className="font-audit-mono text-audit-mono text-on-surface-variant">
              {t.tenancyCount} tenancies · {t.burstRpm.toLocaleString()} rpm ·{" "}
              {t.discountPct}% off retail
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {t.examples.join(" · ")}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 rounded bg-surface-container-lowest shadow-sm overflow-hidden">
          <div className="p-4 bg-surface-container-low">
            <h2 className="font-title-md text-title-md text-primary">
              Quota ledger
            </h2>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="font-audit-mono text-audit-mono text-on-surface-variant uppercase text-[11px] bg-surface-container-low">
                <th className="py-3 px-4">Tenant</th>
                <th className="py-3 px-4">Tier</th>
                <th className="py-3 px-4">Usage</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {state.quotas.map((q) => {
                const pct = Math.round((q.consumed / q.monthlyQuota) * 1000) / 10;
                return (
                  <tr key={q.id}>
                    <td className="py-3 px-4 font-title-sm text-title-sm">
                      {q.tenantName}
                      {q.nearCeiling && (
                        <span className="ml-2 text-[10px] font-bold text-error uppercase">
                          Near ceiling
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-audit-mono text-audit-mono">
                      {q.tier} · {q.currency}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-audit-mono text-audit-mono">
                        {q.consumed.toLocaleString()}/{q.monthlyQuota.toLocaleString()}{" "}
                        ({pct}%)
                      </p>
                      <div className="mt-1 h-1.5 w-40 rounded-full bg-surface-container overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            q.nearCeiling ? "bg-error" : "bg-primary-container"
                          }`}
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          topUpQuota(q.id, 5000);
                          setToast(`Topped up ${q.tenantName}`);
                        }}
                        className="text-[12px] font-semibold text-secondary"
                      >
                        Top up +5k
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="xl:col-span-5 space-y-4">
          <div className="rounded bg-surface-container-lowest shadow-sm p-4 space-y-3">
            <h2 className="font-title-md text-title-md text-primary">
              Unit economics modeler
            </h2>
            <label className="font-audit-mono text-audit-mono text-on-surface-variant flex items-center justify-between gap-2">
              Graduating cohort
              <input
                type="number"
                value={grads}
                onChange={(e) => setGrads(Number(e.target.value) || 0)}
                className="w-28 rounded bg-surface-container-low px-2 py-1 text-on-surface"
              />
            </label>
            <label className="font-audit-mono text-audit-mono text-on-surface-variant flex items-center justify-between gap-2">
              SIS margin %
              <input
                type="number"
                value={sisPct}
                onChange={(e) => setSisPct(Number(e.target.value) || 0)}
                className="w-28 rounded bg-surface-container-low px-2 py-1 text-on-surface"
              />
            </label>
            <button
              type="button"
              onClick={() => {
                recalculateMargins(grads, sisPct);
                setToast("Margins recalculated");
              }}
              className="w-full px-3 py-2 rounded bg-primary-container text-on-primary font-title-sm text-title-sm"
            >
              Recalculate margins
            </button>
            <p className="font-body-sm text-body-sm">
              Dividend / grad{" "}
              <span className="font-bold text-primary">
                {formatNgn(state.economics.dividendPerGrad)}
              </span>
            </p>
            <p className="font-body-sm text-body-sm">
              Annual surplus{" "}
              <span className="font-bold text-primary">
                {formatNgn(state.economics.annualSurplus)}
              </span>
            </p>
          </div>

          <div className="rounded bg-surface-container-lowest shadow-sm p-4">
            <h2 className="font-title-md text-title-md text-primary mb-3">
              Statutory clearing
            </h2>
            <ul className="space-y-2">
              {state.clearing.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between gap-2 font-body-sm text-body-sm"
                >
                  <span>{c.label}</span>
                  <span className="font-audit-mono text-audit-mono">
                    {formatNgn(c.amountNgn)} · {c.pct}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Toast message={toast} onClose={() => setToast(null)} />
    </PageFrame>
  );
}
