"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/marketing/Icon";
import { usePartnerStore } from "@/lib/partner/store";
import type { SchoolStatus } from "@/lib/partner/types";
import { PageFrame, SchoolChip, Toast, formatWhen } from "./ui";

type Filter = "ALL" | SchoolStatus;

export function SchoolsView() {
  const { state, inviteSchool, setSchoolStatus, bulkReauthorize } =
    usePartnerStore();
  const [filter, setFilter] = useState<Filter>("ALL");
  const [toast, setToast] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    region: "Lagos",
    sis: "EduNova Cloud",
  });

  const rows = useMemo(() => {
    if (filter === "ALL") return state.schools;
    return state.schools.filter((s) => s.status === filter);
  }, [state.schools, filter]);

  const counts = useMemo(() => {
    const c = { ALL: state.schools.length, ACTIVE: 0, PENDING: 0, SANDBOX: 0 };
    for (const s of state.schools) c[s.status] += 1;
    return c;
  }, [state.schools]);

  const synced = state.schools.reduce((n, s) => n + s.syncedRecords, 0);

  function exportDirectory() {
    const blob = new Blob([JSON.stringify(state.schools, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "partner-schools.json";
    a.click();
    URL.revokeObjectURL(url);
    setToast("Directory exported");
  }

  return (
    <PageFrame>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 font-audit-mono text-audit-mono text-secondary mb-1">
            <span>Partner</span>
            <span className="text-outline">/</span>
            <span className="text-on-surface font-medium">Connected issuers</span>
          </nav>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
            Connected issuers — education, agencies &amp; brands
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            {synced.toLocaleString()} synced authenticity records across{" "}
            {state.schools.length} issuer tenancies
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportDirectory}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-surface-container font-title-sm text-title-sm"
          >
            <Icon name="download" size={18} />
            Export directory
          </button>
          <button
            type="button"
            onClick={() => {
              bulkReauthorize();
              setToast("Bulk re-authorize complete");
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-surface-container font-title-sm text-title-sm"
          >
            <Icon name="sync" size={18} />
            Bulk re-authorize
          </button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-primary-container text-on-primary font-title-sm text-title-sm"
          >
            <Icon name="add" size={18} />
            Invite client school
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {(
          [
            ["ALL", `All (${counts.ALL})`],
            ["ACTIVE", `Active (${counts.ACTIVE})`],
            ["PENDING", `Pending (${counts.PENDING})`],
            ["SANDBOX", `Sandbox (${counts.SANDBOX})`],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
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

      <div className="rounded bg-surface-container-lowest shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="font-audit-mono text-audit-mono text-on-surface-variant uppercase text-[11px] bg-surface-container-low">
              <th className="py-3 px-4">School</th>
              <th className="py-3 px-4">Region</th>
              <th className="py-3 px-4">SIS</th>
              <th className="py-3 px-4">Synced</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Heartbeat</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {rows.map((s) => (
              <tr key={s.id} className="hover:bg-surface-container">
                <td className="py-3 px-4">
                  <p className="font-title-sm text-title-sm text-primary">{s.name}</p>
                  <p className="font-audit-mono text-audit-mono text-on-surface-variant">
                    {s.did}
                  </p>
                </td>
                <td className="py-3 px-4 font-body-sm text-body-sm">{s.region}</td>
                <td className="py-3 px-4 font-body-sm text-body-sm">{s.sisProduct}</td>
                <td className="py-3 px-4 font-audit-mono text-audit-mono">
                  {s.syncedRecords.toLocaleString()}
                </td>
                <td className="py-3 px-4">
                  <SchoolChip status={s.status} />
                </td>
                <td className="py-3 px-4 font-audit-mono text-audit-mono text-on-surface-variant">
                  {formatWhen(s.lastHeartbeat)}
                </td>
                <td className="py-3 px-4 text-right">
                  {s.status === "PENDING" && (
                    <button
                      type="button"
                      onClick={() => {
                        setSchoolStatus(s.id, "ACTIVE");
                        setToast(`${s.name} activated`);
                      }}
                      className="text-[12px] font-semibold text-secondary hover:text-primary"
                    >
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-[90] bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl bg-surface-container-lowest p-5 shadow-xl">
            <h3 className="font-title-md text-title-md text-primary mb-3">
              Invite client school
            </h3>
            <div className="space-y-3">
              <input
                className="w-full rounded bg-surface-container-low px-3 py-2 focus:outline-none"
                placeholder="Institution name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <select
                className="w-full rounded bg-surface-container-low px-3 py-2 focus:outline-none"
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
              >
                {["Lagos", "Oyo", "Edo", "Abuja", "Rivers"].map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
              <select
                className="w-full rounded bg-surface-container-low px-3 py-2 focus:outline-none"
                value={form.sis}
                onChange={(e) => setForm({ ...form, sis: e.target.value })}
              >
                {[
                  "EduNova Enterprise",
                  "EduNova Cloud",
                  "Banner Ethos",
                  "PowerSchool SIS",
                ].map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
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
                  if (!form.name.trim()) return;
                  inviteSchool(form.name.trim(), form.region, form.sis);
                  setOpen(false);
                  setForm({ name: "", region: "Lagos", sis: "EduNova Cloud" });
                  setToast("Invite sent — pending consent");
                }}
                className="px-3 py-1.5 rounded bg-primary-container text-on-primary font-title-sm text-title-sm"
              >
                Send invite
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} onClose={() => setToast(null)} />
    </PageFrame>
  );
}
