"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/components/marketing/Icon";
import { useAdminStore } from "@/lib/admin/store";
import type { TenantSector, TenantStatus } from "@/lib/admin/types";
import { PageFrame, TenantChip, Toast, formatWhen } from "./ui";

type Filter = "ALL" | TenantSector | TenantStatus | "ANOMALIES";

function useCountUp(target: number, active: boolean, decimals = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 900);
      setValue(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active]);
  return decimals > 0
    ? value.toFixed(decimals)
    : Math.round(value).toLocaleString("en-US");
}

export function TenantsView() {
  const {
    ready,
    state,
    reset,
    selectTenant,
    provisionTenant,
    setTenantStatus,
    reverifyDns,
    bulkKeyRotation,
  } = useAdminStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<Filter>("ALL");
  const [toast, setToast] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    sector: "ACADEMIA" as TenantSector,
    domain: "",
  });

  useEffect(() => {
    const sector = searchParams.get("sector");
    const view = searchParams.get("view");
    if (
      sector === "ACADEMIA" ||
      sector === "GOV" ||
      sector === "EXAM" ||
      sector === "PARTNER"
    ) {
      setFilter(sector);
      return;
    }
    if (view === "anomalies") {
      setFilter("ANOMALIES");
      return;
    }
    if (view === "compliance" || view === "audit") {
      setFilter("ALL");
      return;
    }
    if (!sector && !view) setFilter("ALL");
  }, [searchParams]);

  const rows = useMemo(() => {
    return state.tenants.filter((t) => {
      if (filter === "ALL") return true;
      if (filter === "ANOMALIES") {
        return t.status === "WARNING" || t.status === "QUARANTINED";
      }
      if (
        filter === "COMPLIANT" ||
        filter === "WARNING" ||
        filter === "QUARANTINED" ||
        filter === "STAGING"
      ) {
        return t.status === filter;
      }
      return t.sector === filter;
    });
  }, [state.tenants, filter]);

  function applyFilter(next: Filter) {
    setFilter(next);
    if (
      next === "ACADEMIA" ||
      next === "GOV" ||
      next === "EXAM" ||
      next === "PARTNER"
    ) {
      router.replace(`/admin/tenants?sector=${next}`);
      return;
    }
    if (next === "ANOMALIES") {
      router.replace("/admin/tenants?view=anomalies");
      return;
    }
    router.replace("/admin/tenants");
  }

  const selected =
    state.tenants.find((t) => t.id === state.selectedTenantId) ||
    state.tenants[0];

  const tenants = useCountUp(state.kpis.activeTenants, ready);
  const domains = useCountUp(state.kpis.domains, ready);
  const anchors = useCountUp(state.kpis.anchors, ready);
  const ndpa = useCountUp(state.kpis.ndpaPct, ready, 2);

  return (
    <PageFrame>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 font-audit-mono text-audit-mono text-secondary mb-1">
            <span>Super Admin</span>
            <span className="text-outline">/</span>
            <span className="text-on-surface font-medium">
              Global Tenant &amp; Domains
            </span>
          </nav>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
            Global Tenant &amp; Domain Governance
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            {state.officer} · {state.title} · NDPA &amp; Lisbon compliance plane
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              bulkKeyRotation();
              setToast("Bulk key rotation completed");
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-surface-container font-title-sm text-title-sm"
          >
            <Icon name="autorenew" size={18} />
            Bulk key rotation
          </button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-primary-container text-on-primary font-title-sm text-title-sm"
          >
            <Icon name="add" size={18} />
            Provision tenant
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 px-4 py-2.5 rounded bg-surface-container-low font-audit-mono text-audit-mono text-on-surface-variant">
        <span>Cloudflare Anycast</span>
        <span>•</span>
        <span className="text-on-tertiary-container font-semibold">
          LOS-01 12ms / ABV-02 16ms
        </span>
        <span>•</span>
        <span>TLS 1.3 · DigiCert + LE · RFC 8659 CAA</span>
        <span>•</span>
        <span>Postgres RLS + HSM</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          ["Active tenants", tenants, "+18 this quarter"],
          ["Domains", domains, "100% TLS 1.3"],
          ["Anchored certs", anchors, "+34,210 / week"],
          ["NDPA health", `${ndpa}%`, "0 quarantines fleet-wide"],
        ].map(([label, value, note]) => (
          <div key={String(label)} className="p-4 rounded bg-surface-container-lowest shadow-sm">
            <p className="font-label-status text-label-status uppercase text-secondary">
              {label}
            </p>
            <p className="font-headline-xl text-headline-xl text-primary font-bold mt-1">
              {value}
            </p>
            <p className="font-audit-mono text-audit-mono text-on-surface-variant mt-2">
              {note}
            </p>
          </div>
        ))}
      </div>

      {(searchParams.get("view") === "compliance" ||
        searchParams.get("view") === "audit") && (
        <div className="rounded bg-secondary-container/30 border border-secondary-container px-4 py-3 font-body-sm text-body-sm text-on-surface">
          {searchParams.get("view") === "compliance"
            ? "NDPA & statutory compliance view — reviewing tenant health against consent and audit baselines."
            : "Global audit & IAM root view — governance stream below reflects IAM and access-policy events."}
        </div>
      )}

      <div className="flex flex-wrap gap-1">
        {(
          [
            ["ALL", "All"],
            ["ACADEMIA", "Universities"],
            ["GOV", "Gov"],
            ["EXAM", "Exam"],
            ["PARTNER", "Resellers"],
            ["ANOMALIES", "Anomalies"],
            ["WARNING", "Warnings"],
            ["QUARANTINED", "Quarantined"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => applyFilter(key)}
            className={`px-3 py-1.5 rounded font-title-sm text-title-sm ${
              filter === key
                ? "bg-primary-container text-on-primary"
                : "bg-surface-container text-on-surface-variant"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 rounded bg-surface-container-lowest shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="font-audit-mono text-audit-mono text-on-surface-variant uppercase text-[11px] bg-surface-container-low">
                <th className="py-3 px-4">Tenant</th>
                <th className="py-3 px-4">Domain / HSM</th>
                <th className="py-3 px-4">Anchors</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {rows.map((t) => (
                <tr
                  key={t.id}
                  className={`hover:bg-surface-container ${
                    selected?.id === t.id ? "bg-surface-container-high/40" : ""
                  }`}
                >
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => selectTenant(t.id)}
                      className="text-left"
                    >
                      <p className="font-title-sm text-title-sm text-primary">
                        {t.name}
                      </p>
                      <p className="font-audit-mono text-audit-mono text-on-surface-variant">
                        {t.did} · {t.sector}
                      </p>
                    </button>
                  </td>
                  <td className="py-3 px-4 font-audit-mono text-audit-mono text-on-surface-variant">
                    {t.domain}
                    <br />
                    {t.hsmNode}
                  </td>
                  <td className="py-3 px-4 font-title-sm text-title-sm">
                    {t.anchoredCerts.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <TenantChip status={t.status} />
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    {t.status === "WARNING" && (
                      <button
                        type="button"
                        onClick={() => {
                          reverifyDns(t.id);
                          setToast("DNS re-verified");
                        }}
                        className="text-[12px] font-semibold text-secondary"
                      >
                        Re-verify DNS
                      </button>
                    )}
                    {t.status !== "QUARANTINED" && (
                      <button
                        type="button"
                        onClick={() => {
                          setTenantStatus(t.id, "QUARANTINED");
                          setToast(`${t.name} quarantined`);
                        }}
                        className="text-[12px] font-semibold text-error"
                      >
                        Quarantine
                      </button>
                    )}
                    {t.status === "QUARANTINED" && (
                      <button
                        type="button"
                        onClick={() => {
                          setTenantStatus(t.id, "COMPLIANT");
                          setToast(`${t.name} restored`);
                        }}
                        className="text-[12px] font-semibold text-secondary"
                      >
                        Restore
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="xl:col-span-4 space-y-4">
          {selected && (
            <div className="rounded bg-surface-container-lowest shadow-sm p-4 space-y-2">
              <h2 className="font-title-md text-title-md text-primary">
                Tenant inspector
              </h2>
              <p className="font-title-sm text-title-sm">{selected.name}</p>
              <p className="font-audit-mono text-audit-mono text-on-surface-variant">
                {selected.did}
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Est. {selected.established} · {selected.partner}
              </p>
              <p className="font-audit-mono text-audit-mono text-on-surface-variant">
                Rate {selected.rateLimit} · {selected.algo}
              </p>
              <p className="font-audit-mono text-audit-mono text-on-surface-variant">
                Key root-key-p256-{selected.id}-2026-v2 · Partition #4 · quorum
                3 of 5
              </p>
              <TenantChip status={selected.status} />
            </div>
          )}

          <div className="rounded bg-surface-container-lowest shadow-sm p-4">
            <h2 className="font-title-md text-title-md text-primary mb-3">
              Governance stream
            </h2>
            <ul className="space-y-2">
              {state.events.slice(0, 6).map((ev) => (
                <li
                  key={ev.id}
                  className="border-b border-surface-container pb-2 font-body-sm text-body-sm"
                >
                  <span className="font-audit-mono text-secondary mr-2">
                    {ev.kind}
                  </span>
                  {ev.message}
                  <div className="font-audit-mono text-audit-mono text-on-surface-variant">
                    {formatWhen(ev.at)}
                  </div>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => {
                reset();
                setToast("Admin demo reset");
              }}
              className="mt-3 text-[11px] uppercase tracking-wide text-on-surface-variant hover:text-primary"
            >
              Reset demo
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[90] bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl bg-surface-container-lowest p-5 shadow-xl space-y-3">
            <h3 className="font-title-md text-title-md text-primary">
              Provision tenant
            </h3>
            <input
              placeholder="Institution name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded bg-surface-container-low px-3 py-2 focus:outline-none"
            />
            <input
              placeholder="verify.example.edu.ng"
              value={form.domain}
              onChange={(e) => setForm({ ...form, domain: e.target.value })}
              className="w-full rounded bg-surface-container-low px-3 py-2 focus:outline-none"
            />
            <select
              value={form.sector}
              onChange={(e) =>
                setForm({ ...form, sector: e.target.value as TenantSector })
              }
              className="w-full rounded bg-surface-container-low px-3 py-2 focus:outline-none"
            >
              {(["ACADEMIA", "GOV", "EXAM", "PARTNER"] as const).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-3 py-1.5 rounded bg-surface-container font-title-sm text-title-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!form.name.trim() || !form.domain.trim()) return;
                  provisionTenant({
                    name: form.name.trim(),
                    sector: form.sector,
                    domain: form.domain.trim(),
                  });
                  setOpen(false);
                  setForm({ name: "", sector: "ACADEMIA", domain: "" });
                  setToast("Tenant provisioned (staging)");
                }}
                className="px-3 py-1.5 rounded bg-primary-container text-on-primary font-title-sm text-title-sm"
              >
                Provision
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} onClose={() => setToast(null)} />
    </PageFrame>
  );
}
