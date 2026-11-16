"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/marketing/Icon";
import { useInstitutionStore } from "@/lib/institution/store";
import type { CredentialStatus } from "@/lib/institution/types";
import { PageFrame, Toast } from "./ui";

export function ReportsView() {
  const { ready, state } = useInstitutionStore();
  const [toast, setToast] = useState<string | null>(null);

  const stats = useMemo(() => {
    const byStatus: Record<CredentialStatus, number> = {
      DRAFT: 0,
      PENDING_SIGNATURE: 0,
      ISSUED: 0,
      REVOKED: 0,
      SUSPENDED: 0,
    };
    for (const c of state.credentials) {
      byStatus[c.status] += 1;
    }
    const total = state.credentials.length || 1;
    return { byStatus, total: state.credentials.length, pct: byStatus };
  }, [state.credentials]);

  function exportCsv() {
    const header = "id,did,status,title,issuedAt,recipientId\n";
    const lines = state.credentials
      .map((c) =>
        [
          c.id,
          c.did,
          c.status,
          `"${c.title.replace(/"/g, '""')}"`,
          c.issuedAt ?? "",
          c.recipientId,
        ].join(","),
      )
      .join("\n");
    const blob = new Blob([header + lines], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `securecert-credentials-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setToast("CSV export downloaded");
  }

  if (!ready) {
    return (
      <PageFrame>
        <p className="py-20 text-center text-on-surface-variant">Loading…</p>
      </PageFrame>
    );
  }

  const bars: { key: CredentialStatus; label: string; color: string }[] = [
    { key: "ISSUED", label: "Verified / issued", color: "bg-emerald-500" },
    {
      key: "PENDING_SIGNATURE",
      label: "Pending sync",
      color: "bg-amber-500",
    },
    { key: "REVOKED", label: "Revoked", color: "bg-red-500" },
    { key: "DRAFT", label: "Draft", color: "bg-gray-400" },
    { key: "SUSPENDED", label: "Suspended", color: "bg-orange-500" },
  ];

  return (
    <PageFrame>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-on-surface">
            Issuance reports
          </h1>
          <p className="text-[14px] text-on-surface-variant mt-1">
            Aggregates from the shared demo ledger · {state.tenantName}
          </p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          className="h-11 px-4 rounded-xl bg-[#0f766e] text-white text-[14px] font-semibold inline-flex items-center gap-1.5 hover:bg-[#0d9488]"
        >
          <Icon name="download" size={18} />
          Export CSV
        </button>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          {
            label: "Ledger credentials",
            value: stats.total,
            icon: "database",
          },
          {
            label: "Recipients",
            value: state.recipients.length,
            icon: "group",
          },
          {
            label: "Authenticated (KPI)",
            value: state.kpis.authenticatedRecords.toLocaleString(),
            icon: "verified",
          },
          {
            label: "Public queries (KPI)",
            value: state.kpis.publicQueries.toLocaleString(),
            icon: "travel_explore",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl bg-white border border-outline-variant/30 p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                {card.label}
              </p>
              <span className="text-[#0f766e]">
                <Icon name={card.icon} size={20} />
              </span>
            </div>
            <p className="mt-2 text-[28px] font-bold tabular-nums">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <section className="rounded-xl bg-white border border-outline-variant/30 p-6 shadow-sm">
        <h2 className="text-[16px] font-bold text-on-surface">
          Status distribution
        </h2>
        <p className="text-[13px] text-on-surface-variant mt-1">
          Share of credentials currently in the demo store
        </p>
        <div className="mt-6 space-y-4">
          {bars.map((b) => {
            const count = stats.byStatus[b.key];
            const pct =
              stats.total === 0 ? 0 : Math.round((count / stats.total) * 100);
            return (
              <div key={b.key}>
                <div className="flex items-center justify-between text-[13px] mb-1.5">
                  <span className="font-semibold text-on-surface">{b.label}</span>
                  <span className="text-on-surface-variant tabular-nums">
                    {count} · {pct}%
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-surface-container-low overflow-hidden">
                  <div
                    className={`h-full rounded-full ${b.color} transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl bg-[#0b1c30] text-white p-6">
        <h2 className="text-[16px] font-bold">Integrity snapshot</h2>
        <p className="mt-2 text-[14px] text-white/70 max-w-2xl">
          Demo integrity rate {state.kpis.integrityRate}% ·{" "}
          {state.kpis.connectedPortals} connected verify portals · chain{" "}
          {state.chainId}
        </p>
      </section>

      <Toast message={toast} onClose={() => setToast(null)} />
    </PageFrame>
  );
}
