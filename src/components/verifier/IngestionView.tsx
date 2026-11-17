"use client";

import { useState } from "react";
import { Icon } from "@/components/marketing/Icon";
import { useVerifierStore } from "@/lib/verifier/store";
import { PageFrame, Toast, formatWhen } from "./ui";

const FORMATS = ["CSV", "JSON-LD", "SEVIS XML", "W3C VC", "EMREX"] as const;

export function IngestionView() {
  const { state, enqueueBatch, completeBatch } = useVerifierStore();
  const [format, setFormat] = useState<(typeof FORMATS)[number]>("CSV");
  const [count, setCount] = useState(40);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  async function runIngress(fmt = format, n = count) {
    setBusy(true);
    const id = enqueueBatch(fmt, n);
    setToast(`Queued batch · ${n} candidates`);
    await new Promise((r) => setTimeout(r, 900));
    completeBatch(id);
    setBusy(false);
    setToast("Cohort verification completed");
  }

  function downloadAudit() {
    const batch = state.batches[0];
    if (!batch) return;
    const blob = new Blob([JSON.stringify(batch, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${batch.label.replace("#", "")}-audit.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToast("Audit JSON downloaded");
  }

  return (
    <PageFrame>
      <div>
        <nav className="flex items-center gap-2 font-audit-mono text-audit-mono text-secondary mb-1">
          <span>Verifier</span>
          <span className="text-outline">/</span>
          <span className="text-on-surface font-medium">Cohort &amp; Ingestion</span>
        </nav>
        <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
          Batch Verification &amp; Multi-Candidate Ingestion
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 max-w-3xl">
          Drop CSV, JSON-LD, or SEVIS XML cohorts for parallel HSM attestation and escrow clearing.
        </p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void runIngress();
        }}
        className={`rounded border-2 border-dashed p-10 text-center transition-colors ${
          dragging
            ? "border-primary bg-primary-container/10"
            : "border-outline-variant bg-surface-container-lowest"
        }`}
      >
        <Icon name="upload_file" size={36} className="text-secondary mx-auto mb-3" />
        <p className="font-title-md text-title-md text-on-surface">
          Drag cohort file here, or choose a format below
        </p>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
          Simulated ingress — no file leaves the browser in this demo.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {FORMATS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFormat(f)}
              className={`px-3 py-1.5 rounded font-title-sm text-title-sm ${
                format === f
                  ? "bg-primary-container text-on-primary"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
          <label className="font-audit-mono text-audit-mono text-on-surface-variant flex items-center gap-2">
            Candidates
            <input
              type="number"
              min={5}
              max={500}
              value={count}
              onChange={(e) => setCount(Number(e.target.value) || 5)}
              className="w-20 rounded bg-surface-container-low px-2 py-1 text-on-surface"
            />
          </label>
          <button
            type="button"
            disabled={busy}
            onClick={() => void runIngress()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded bg-primary-container hover:bg-primary text-on-primary font-title-sm text-title-sm disabled:opacity-50"
          >
            <Icon name="play_arrow" size={18} />
            {busy ? "Running…" : "Run cohort ingress"}
          </button>
          <button
            type="button"
            onClick={downloadAudit}
            className="inline-flex items-center gap-2 px-4 py-2 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-title-sm text-title-sm"
          >
            <Icon name="download" size={18} />
            Download audit JSON
          </button>
        </div>
      </div>

      <div className="rounded bg-surface-container-lowest shadow-sm overflow-hidden">
        <div className="p-4 bg-surface-container-low">
          <h2 className="font-title-md text-title-md text-primary">Cohort ledger</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="font-audit-mono text-audit-mono text-on-surface-variant uppercase text-[11px] bg-surface-container-low">
                <th className="py-3 px-4">Batch</th>
                <th className="py-3 px-4">Format</th>
                <th className="py-3 px-4">Result</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Cleared</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {state.batches.map((b) => (
                <tr key={b.id} className="hover:bg-surface-container">
                  <td className="py-3 px-4 font-title-sm text-title-sm text-primary">
                    {b.label}
                  </td>
                  <td className="py-3 px-4 font-audit-mono text-audit-mono text-on-surface-variant">
                    {b.format}
                  </td>
                  <td className="py-3 px-4 font-audit-mono text-audit-mono">
                    {b.verified}/{b.candidateCount}
                    {b.invalid > 0 ? (
                      <span className="text-error"> · {b.invalid} invalid</span>
                    ) : null}
                  </td>
                  <td className="py-3 px-4 font-audit-mono text-audit-mono">
                    {b.durationMs ? `${(b.durationMs / 1000).toFixed(1)}s` : "—"}
                  </td>
                  <td className="py-3 px-4 font-title-sm text-title-sm">
                    ${b.usdCleared.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                        b.status === "COMPLETED"
                          ? "bg-emerald-50 text-emerald-800"
                          : b.status === "QUEUED"
                            ? "bg-amber-50 text-amber-800"
                            : "bg-sky-50 text-sky-800"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-audit-mono text-audit-mono text-on-surface-variant">
                    {formatWhen(b.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Toast message={toast} onClose={() => setToast(null)} />
    </PageFrame>
  );
}
