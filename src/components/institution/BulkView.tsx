"use client";

import { FormEvent, useState } from "react";
import { Icon } from "@/components/marketing/Icon";
import { useInstitutionStore } from "@/lib/institution/store";
import { PageFrame, Toast, formatWhen } from "./ui";

export function BulkView() {
  const { ready, state, enqueueBulkJob, runBulkJob } = useInstitutionStore();
  const [toast, setToast] = useState<string | null>(null);
  const [name, setName] = useState("New graduating cohort");
  const [rows, setRows] = useState(120);

  function onQueue(e: FormEvent) {
    e.preventDefault();
    const id = enqueueBulkJob(name, rows);
    setToast("Bulk job queued");
    runBulkJob(id);
  }

  if (!ready) {
    return (
      <PageFrame>
        <p className="py-20 text-center text-on-surface-variant">Loading…</p>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      <div>
        <h1 className="text-[28px] font-bold tracking-tight">Bulk processing</h1>
        <p className="text-[14px] text-on-surface-variant mt-1">
          Queue cohort CSV-style issuance jobs against the demo ledger.
        </p>
      </div>

      <form
        onSubmit={onQueue}
        className="rounded-xl bg-white border border-outline-variant/30 p-5 shadow-sm grid sm:grid-cols-[1fr_140px_auto] gap-3 items-end max-w-3xl"
      >
        <label className="block">
          <span className="text-[12px] font-bold">Job name</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full h-11 rounded-xl border border-outline-variant/60 px-3 outline-none focus:border-[#0f766e]"
          />
        </label>
        <label className="block">
          <span className="text-[12px] font-bold">Rows</span>
          <input
            required
            type="number"
            min={1}
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            className="mt-1 w-full h-11 rounded-xl border border-outline-variant/60 px-3 outline-none focus:border-[#0f766e]"
          />
        </label>
        <button
          type="submit"
          className="h-11 px-4 rounded-xl bg-[#0f766e] text-white text-[14px] font-semibold inline-flex items-center gap-1.5"
        >
          <Icon name="play_arrow" size={18} filled />
          Queue &amp; run
        </button>
      </form>

      <div className="rounded-xl bg-white border border-outline-variant/30 shadow-sm overflow-hidden">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-surface-container-low/80 text-[11px] uppercase tracking-wide text-secondary">
            <tr>
              <th className="px-5 py-3 font-bold">Job</th>
              <th className="px-3 py-3 font-bold">Rows</th>
              <th className="px-3 py-3 font-bold">Result</th>
              <th className="px-3 py-3 font-bold">Status</th>
              <th className="px-5 py-3 font-bold">Created</th>
            </tr>
          </thead>
          <tbody>
            {state.bulkJobs.map((j) => (
              <tr
                key={j.id}
                className="border-t border-outline-variant/20 hover:bg-surface-container-low/40"
              >
                <td className="px-5 py-3 font-semibold">{j.name}</td>
                <td className="px-3 py-3 tabular-nums">{j.rowCount}</td>
                <td className="px-3 py-3 tabular-nums text-on-surface-variant">
                  {j.status === "COMPLETED"
                    ? `${j.successCount} ok · ${j.failCount} fail`
                    : "—"}
                </td>
                <td className="px-3 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold uppercase ${
                      j.status === "COMPLETED"
                        ? "bg-emerald-50 text-emerald-800"
                        : j.status === "RUNNING"
                          ? "bg-amber-50 text-amber-800"
                          : j.status === "FAILED"
                            ? "bg-red-50 text-red-700"
                            : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {j.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-on-surface-variant whitespace-nowrap">
                  {formatWhen(j.createdAt)}
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
