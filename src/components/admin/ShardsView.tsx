"use client";

import { useState } from "react";
import { Icon } from "@/components/marketing/Icon";
import { useAdminStore } from "@/lib/admin/store";
import { MigrationChip, PageFrame, Toast } from "./ui";

export function ShardsView() {
  const { state, queueMigration, executeCutover, runFailoverDrill } =
    useAdminStore();
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState({
    tenant: "University of Ibadan",
    source: "Shard-01",
    target: "Shard-05",
  });

  return (
    <PageFrame>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 font-audit-mono text-audit-mono text-secondary mb-1">
            <span>Super Admin</span>
            <span className="text-outline">/</span>
            <span className="text-on-surface font-medium">
              Multi-Tenant Health &amp; Shards
            </span>
          </nav>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
            Multi-Tenant Cluster Health
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            {state.kpis.activeTenants} entities · lag {state.kpis.shardLagMs}ms ·
            HSM sync {state.kpis.hsmSyncMs}ms · Anycast Merkle P99 11.8ms
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            runFailoverDrill();
            setToast("Failover drill completed · RTO <2s");
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-primary-container text-on-primary font-title-sm text-title-sm"
        >
          <Icon name="crisis_alert" size={18} />
          Run failover drill
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {state.shards.map((sh) => (
          <div
            key={sh.id}
            className="rounded bg-surface-container-lowest shadow-sm p-4 space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-title-sm text-title-sm text-primary">{sh.code}</p>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  sh.status === "PRIMARY"
                    ? "bg-emerald-50 text-emerald-800"
                    : sh.status === "DEGRADED"
                      ? "bg-amber-50 text-amber-800"
                      : "bg-sky-50 text-sky-800"
                }`}
              >
                {sh.status}
              </span>
            </div>
            <p className="font-audit-mono text-audit-mono text-on-surface-variant">
              {sh.label}
            </p>
            <p className="font-body-sm text-body-sm">
              {sh.tenantCount} tenants · {sh.records.toLocaleString()} records
            </p>
            <div className="h-1.5 rounded-full bg-surface-container overflow-hidden">
              <div
                className="h-full bg-primary-container rounded-full"
                style={{
                  width: `${Math.min(100, (sh.storageUsedTb / sh.capacityTb) * 100)}%`,
                }}
              />
            </div>
            <p className="font-audit-mono text-audit-mono text-on-surface-variant">
              {sh.storageUsedTb}/{sh.capacityTb} TB · {sh.iops.toLocaleString()}{" "}
              IOPS
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 rounded bg-surface-container-lowest shadow-sm overflow-hidden">
          <div className="p-4 bg-surface-container-low flex items-center gap-2">
            <Icon name="swap_horiz" size={20} className="text-primary" />
            <h2 className="font-title-md text-title-md text-primary">
              Rebalance queue
            </h2>
          </div>
          <ul className="divide-y divide-surface-container">
            {state.migrations.map((m) => (
              <li
                key={m.id}
                className="p-4 flex flex-wrap items-center justify-between gap-3"
              >
                <div>
                  <p className="font-title-sm text-title-sm text-primary">
                    {m.tenantName}
                  </p>
                  <p className="font-audit-mono text-audit-mono text-on-surface-variant">
                    {m.source} → {m.target} · {m.payloadGb.toFixed(1)} GB ·{" "}
                    {m.leaves.toLocaleString()} leaves
                  </p>
                  <div className="mt-2 h-1.5 w-48 rounded-full bg-surface-container overflow-hidden">
                    <div
                      className="h-full bg-secondary rounded-full"
                      style={{ width: `${m.progressPct}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MigrationChip state={m.state} />
                  {m.state === "READY_CUTOVER" && (
                    <button
                      type="button"
                      onClick={() => {
                        executeCutover(m.id);
                        setToast("Cutover executed");
                      }}
                      className="px-3 py-1.5 rounded bg-primary-container text-on-primary font-title-sm text-title-sm"
                    >
                      Cutover
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="xl:col-span-4 space-y-4">
          <div className="rounded bg-surface-container-lowest shadow-sm p-4 space-y-2">
            <h2 className="font-title-md text-title-md text-primary">
              Merkle accumulator
            </h2>
            <p className="font-audit-mono text-audit-mono text-on-surface-variant">
              Depth 28 · Poseidon-2
            </p>
            <p className="font-headline-md text-headline-md text-primary font-bold">
              {state.kpis.anchors.toLocaleString()} leaves
            </p>
            <p className="font-audit-mono text-audit-mono">BLOCK #14,892,102</p>
          </div>
          <div className="rounded bg-surface-container-lowest shadow-sm p-4 space-y-2">
            <h2 className="font-title-md text-title-md text-primary">
              DR quorum (3-of-5 Shamir)
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              CBN / NSA / CVCNU armed · NIMC cold · seal SEC-L0-994182
            </p>
          </div>
          <div className="rounded bg-surface-container-lowest shadow-sm p-4 space-y-3">
            <h2 className="font-title-md text-title-md text-primary">
              Queue migration
            </h2>
            <input
              value={form.tenant}
              onChange={(e) => setForm({ ...form, tenant: e.target.value })}
              className="w-full rounded bg-surface-container-low px-3 py-2 focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                className="rounded bg-surface-container-low px-3 py-2 focus:outline-none"
              />
              <input
                value={form.target}
                onChange={(e) => setForm({ ...form, target: e.target.value })}
                className="rounded bg-surface-container-low px-3 py-2 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                queueMigration(form.tenant, form.source, form.target);
                setToast("Migration queued");
              }}
              className="w-full px-3 py-2 rounded bg-primary-container text-on-primary font-title-sm text-title-sm"
            >
              Queue
            </button>
          </div>
        </div>
      </div>

      <Toast message={toast} onClose={() => setToast(null)} />
    </PageFrame>
  );
}
