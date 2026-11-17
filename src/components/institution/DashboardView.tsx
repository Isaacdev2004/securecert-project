"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/marketing/Icon";
import { useInstitutionStore } from "@/lib/institution/store";
import { recipientFor } from "@/lib/institution/demo-data";
import type { AssetRail, CredentialStatus } from "@/lib/institution/types";
import { PageFrame, StatusChip, Toast, formatWhen } from "./ui";

const RANGES = ["Last 7 days", "Last 30 days", "This quarter"] as const;

const STREAM_TEMPLATES = [
  { kind: "VERIFY" as const, message: "Employer desk verified credential · VALID" },
  { kind: "VERIFY" as const, message: "Customs scan · product mark VALID" },
  { kind: "VERIFY" as const, message: "Agency desk · building approval VALID" },
  { kind: "WEBHOOK" as const, message: "POST /hooks/verify · 200 · latency 18ms" },
  { kind: "SYNC" as const, message: "Merkle tip heartbeat · shard-alpha healthy" },
];

const RAIL_LABEL: Record<AssetRail, string> = {
  EDUCATION: "Education",
  GOVERNMENT: "Government",
  PRODUCT: "Product",
};

function useCountUp(target: number, active: boolean, decimals = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const from = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 900);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(from + Math.max(0, target - from) * eased);
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

export function DashboardView() {
  const router = useRouter();
  const { ready, state, revokeCredential, pushStream, reset } =
    useInstitutionStore();
  const [range, setRange] = useState<(typeof RANGES)[number]>("Last 30 days");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CredentialStatus | "ALL">(
    "ALL",
  );
  const [railFilter, setRailFilter] = useState<AssetRail | "ALL">("ALL");
  const [toast, setToast] = useState<string | null>(null);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    matric: "",
    title: "",
  });

  useEffect(() => {
    if (!ready) return;
    const id = window.setInterval(() => {
      const tpl =
        STREAM_TEMPLATES[Math.floor(Math.random() * STREAM_TEMPLATES.length)];
      pushStream(tpl);
    }, 9000);
    return () => window.clearInterval(id);
  }, [ready, pushStream]);

  const rows = useMemo(() => {
    return state.credentials
      .map((c) => ({
        credential: c,
        recipient: recipientFor(state, c.recipientId),
      }))
      .filter(({ credential, recipient }) => {
        if (statusFilter !== "ALL" && credential.status !== statusFilter) {
          return false;
        }
        if (railFilter !== "ALL" && credential.rail !== railFilter) {
          return false;
        }
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
          credential.title.toLowerCase().includes(q) ||
          credential.did.toLowerCase().includes(q) ||
          recipient?.fullName.toLowerCase().includes(q) ||
          recipient?.matricNumber.toLowerCase().includes(q)
        );
      });
  }, [state, query, statusFilter, railFilter]);

  const records = useCountUp(state.kpis.authenticatedRecords, ready);
  const queries = useCountUp(state.kpis.publicQueries, ready);
  const portals = useCountUp(state.kpis.connectedPortals, ready);
  const integrity = useCountUp(state.kpis.integrityRate, ready, 2);

  function exportDossier() {
    const payload = {
      exportedAt: new Date().toISOString(),
      tenant: state.tenantName,
      range,
      kpis: state.kpis,
      credentials: state.credentials,
      recipients: state.recipients,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `legitscan-audit-dossier-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToast("Audit dossier downloaded");
  }

  function onRevoke(id: string) {
    if (!window.confirm("Revoke this record in the demo ledger?")) return;
    revokeCredential(id, "Issuer demo revoke");
    setToast("Record marked revoked");
  }

  async function copyDid(did: string) {
    try {
      await navigator.clipboard.writeText(did);
      setToast("DID copied to clipboard");
    } catch {
      setToast(did);
    }
  }

  function submitRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegisterOpen(false);
    setToast(
      `Registered existing certificate ${registerForm.matric || "—"} (demo)`,
    );
    setRegisterForm({ matric: "", title: "" });
    pushStream({
      kind: "SYNC",
      message: `Legacy certificate registered · ${registerForm.matric || "n/a"}`,
    });
  }

  if (!ready) {
    return (
      <PageFrame>
        <p className="text-on-surface-variant py-20 text-center">
          Loading issuer ledger…
        </p>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold uppercase tracking-wide">
              Multi-rail issuer
            </span>
            <span className="font-audit-mono text-[11px] text-secondary">
              CHAIN_ID: {state.chainId}
            </span>
          </div>
          <h1 className="mt-2 text-[24px] sm:text-[28px] font-bold tracking-tight text-on-surface">
            Issuer overview
          </h1>
          <p className="mt-1 text-[14px] text-on-surface-variant">
            {state.tenantName} · issue credentials, government records, and
            product authenticity marks
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-low text-on-surface-variant text-[13px] font-semibold">
            <Icon name="calendar_today" size={16} />
            <select
              value={range}
              onChange={(e) =>
                setRange(e.target.value as (typeof RANGES)[number])
              }
              className="bg-transparent outline-none cursor-pointer"
            >
              {RANGES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={exportDossier}
            className="px-3 py-2 rounded-lg bg-surface-container-lowest text-on-surface text-[13px] font-semibold border border-outline-variant/40 hover:bg-surface-container-low inline-flex items-center gap-1.5"
          >
            <Icon name="download" size={16} />
            <span className="hidden sm:inline">Export dossier</span>
            <span className="sm:hidden">Export</span>
          </button>
          <button
            type="button"
            onClick={() => router.push("/institution/issue")}
            className="px-3 py-2 rounded-lg bg-[#0f766e] text-white text-[13px] font-semibold hover:bg-[#0d9488] inline-flex items-center gap-1.5"
          >
            <Icon name="add_moderator" size={16} />
            Issue record
          </button>
          <button
            type="button"
            onClick={() => setRegisterOpen(true)}
            className="px-3 py-2 rounded-lg bg-[#134e4a] text-white text-[13px] font-semibold hover:opacity-95 inline-flex items-center gap-1.5"
          >
            <Icon name="sync_saved_locally" size={16} />
            Register existing
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {(
          [
            ["ALL", "All rails"],
            ["EDUCATION", "Education"],
            ["GOVERNMENT", "Government"],
            ["PRODUCT", "Products"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setRailFilter(value)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-bold ${
              railFilter === value
                ? "bg-[#0f766e] text-white"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          {
            label: "Anchored authenticity records",
            value: records,
            icon: "verified",
            trend: "+2.4%",
          },
          {
            label: "Public & Employer Queries",
            value: queries,
            icon: "travel_explore",
            trend: "+8.1%",
          },
          {
            label: "Connected Portals",
            value: portals,
            icon: "hub",
            trend: "stable",
          },
          {
            label: "Integrity / Revocations",
            value: `${integrity}%`,
            icon: "shield",
            trend: "healthy",
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="p-5 rounded-xl bg-white shadow-sm border border-outline-variant/30 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                  {kpi.label}
                </p>
                <p className="mt-1 text-[32px] font-bold tracking-tight text-on-surface tabular-nums">
                  {kpi.value}
                </p>
              </div>
              <span className="p-2 rounded-lg bg-surface-container-low text-[#0f766e]">
                <Icon name={kpi.icon} size={22} />
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-700">
                <Icon name="trending_up" size={14} />
                {kpi.trend}
              </span>
              <span className="text-[11px] text-on-surface-variant">
                vs prior period · {range}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid xl:grid-cols-[1.6fr_0.9fr] gap-4 items-start">
        {/* Activity */}
        <section className="rounded-xl bg-white shadow-sm border border-outline-variant/30 overflow-hidden">
          <div className="px-5 py-4 border-b border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-[16px] font-bold text-on-surface">
                Recent authenticity activity
              </h2>
              <p className="text-[12px] text-on-surface-variant">
                Credentials, government records, and product marks in this demo
                ledger
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Icon
                  name="search"
                  size={16}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-outline"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Name, reference, DID…"
                  className="h-9 w-48 rounded-lg border border-outline-variant/50 bg-surface-container-low pl-8 pr-3 text-[13px] outline-none focus:border-[#0f766e]"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as CredentialStatus | "ALL")
                }
                className="h-9 rounded-lg border border-outline-variant/50 bg-surface-container-low px-2 text-[13px] outline-none"
              >
                <option value="ALL">All statuses</option>
                <option value="ISSUED">Verified</option>
                <option value="PENDING_SIGNATURE">Pending</option>
                <option value="REVOKED">Revoked</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-surface-container-low/80 text-[11px] uppercase tracking-wide text-secondary">
                <tr>
                  <th className="px-5 py-3 font-bold">Holder / subject</th>
                  <th className="px-3 py-3 font-bold">Record</th>
                  <th className="px-3 py-3 font-bold">Rail</th>
                  <th className="px-3 py-3 font-bold">Status</th>
                  <th className="px-3 py-3 font-bold">Issued</th>
                  <th className="px-5 py-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-10 text-center text-on-surface-variant"
                    >
                      No records match this filter.
                    </td>
                  </tr>
                ) : (
                  rows.map(({ credential, recipient }) => (
                    <tr
                      key={credential.id}
                      className="border-t border-outline-variant/20 hover:bg-surface-container-low/40"
                    >
                      <td className="px-5 py-3">
                        <p className="font-semibold text-on-surface">
                          {recipient?.fullName ?? "Unknown"}
                        </p>
                        <p className="font-audit-mono text-[11px] text-secondary">
                          {recipient?.matricNumber}
                        </p>
                      </td>
                      <td className="px-3 py-3">
                        <p className="font-medium text-on-surface max-w-[220px] truncate">
                          {credential.title}
                        </p>
                        <p className="font-audit-mono text-[10px] text-secondary truncate max-w-[220px]">
                          {credential.did}
                        </p>
                      </td>
                      <td className="px-3 py-3">
                        <span className="inline-flex rounded-full bg-surface-container-low px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-secondary">
                          {RAIL_LABEL[credential.rail]}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <StatusChip status={credential.status} />
                      </td>
                      <td className="px-3 py-3 text-on-surface-variant whitespace-nowrap">
                        {formatWhen(credential.issuedAt)}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/institution/credentials/${credential.id}`}
                            className="h-8 w-8 rounded-lg hover:bg-surface-container-low inline-flex items-center justify-center text-[#0f766e]"
                            title="Inspect"
                          >
                            <Icon name="visibility" size={18} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => copyDid(credential.did)}
                            className="h-8 w-8 rounded-lg hover:bg-surface-container-low inline-flex items-center justify-center text-secondary"
                            title="Copy DID"
                          >
                            <Icon name="content_copy" size={17} />
                          </button>
                          <button
                            type="button"
                            disabled={credential.status === "REVOKED"}
                            onClick={() => onRevoke(credential.id)}
                            className="h-8 w-8 rounded-lg hover:bg-red-50 inline-flex items-center justify-center text-red-600 disabled:opacity-30"
                            title="Revoke"
                          >
                            <Icon name="gavel" size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-outline-variant/30 flex items-center justify-between">
            <Link
              href="/institution/credentials"
              className="text-[13px] font-semibold text-[#0f766e] hover:underline"
            >
              View all credentials →
            </Link>
            <button
              type="button"
              onClick={() => {
                reset();
                setToast("Demo ledger reset to seed data");
              }}
              className="text-[12px] font-semibold text-on-surface-variant hover:text-on-surface"
            >
              Reset demo data
            </button>
          </div>
        </section>

        {/* Rail */}
        <aside className="flex flex-col gap-4">
          <div className="rounded-xl bg-[#0b1c30] text-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-bold">Live API &amp; Webhook Stream</h3>
              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#5eead4]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5eead4] animate-pulse" />
                Live
              </span>
            </div>
            <ul className="mt-4 space-y-3 max-h-[280px] overflow-y-auto pr-1">
              {state.stream.slice(0, 12).map((evt) => (
                <li key={evt.id} className="text-[12px] leading-snug">
                  <span className="font-audit-mono text-[10px] text-white/45 block">
                    {formatWhen(evt.at)} · {evt.kind}
                  </span>
                  <span className="text-white/85">{evt.message}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-white border border-outline-variant/30 p-5 shadow-sm">
            <h3 className="text-[14px] font-bold text-on-surface">
              Cryptographic trust pillars
            </h3>
            <ul className="mt-4 space-y-3">
              {[
                {
                  icon: "encrypted",
                  t: "HSM root custody",
                  d: "ED25519 seals in FIPS-oriented enclave",
                },
                {
                  icon: "account_tree",
                  t: "Merkle inclusion",
                  d: "Every record carries a proof path",
                },
                {
                  icon: "policy",
                  t: "Revocation registry",
                  d: "Instant invalidation across verify edges",
                },
              ].map((p) => (
                <li key={p.t} className="flex gap-3">
                  <span className="h-10 w-10 rounded-xl bg-[#f0fdfa] text-[#0f766e] inline-flex items-center justify-center shrink-0">
                    <Icon name={p.icon} size={20} />
                  </span>
                  <div>
                    <p className="text-[13px] font-bold text-on-surface">{p.t}</p>
                    <p className="text-[12px] text-on-surface-variant">{p.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {/* Register modal */}
      {registerOpen && (
        <div className="fixed inset-0 z-[70] bg-black/40 flex items-center justify-center p-4">
          <form
            onSubmit={submitRegister}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[18px] font-bold text-on-surface">
                  Register existing certificate
                </h3>
                <p className="text-[13px] text-on-surface-variant mt-1">
                  Demo intake for legacy paper or PDF credentials.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRegisterOpen(false)}
                className="text-outline hover:text-on-surface"
              >
                <Icon name="close" size={20} />
              </button>
            </div>
            <label className="block">
              <span className="text-[12px] font-bold text-on-surface">
                Matric / serial
              </span>
              <input
                required
                value={registerForm.matric}
                onChange={(e) =>
                  setRegisterForm((f) => ({ ...f, matric: e.target.value }))
                }
                className="mt-1.5 w-full h-11 rounded-xl border border-outline-variant/60 px-3 text-[14px] outline-none focus:border-[#0f766e]"
              />
            </label>
            <label className="block">
              <span className="text-[12px] font-bold text-on-surface">
                Credential title
              </span>
              <input
                required
                value={registerForm.title}
                onChange={(e) =>
                  setRegisterForm((f) => ({ ...f, title: e.target.value }))
                }
                className="mt-1.5 w-full h-11 rounded-xl border border-outline-variant/60 px-3 text-[14px] outline-none focus:border-[#0f766e]"
              />
            </label>
            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-[#0f766e] text-white text-[14px] font-semibold hover:bg-[#0d9488]"
            >
              Register in demo ledger
            </button>
          </form>
        </div>
      )}

      <Toast message={toast} onClose={() => setToast(null)} />
    </PageFrame>
  );
}
