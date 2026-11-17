"use client";

import { useState } from "react";
import { Icon } from "@/components/marketing/Icon";
import { usePartnerStore } from "@/lib/partner/store";
import { PageFrame, Toast, formatWhen } from "./ui";

export function SandboxView() {
  const {
    state,
    setSandboxScenario,
    setSandboxBatchSize,
    executeSandbox,
    resetSandbox,
  } = usePartnerStore();
  const [toast, setToast] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    await new Promise((r) => setTimeout(r, 700));
    executeSandbox();
    setBusy(false);
    setToast("Sandbox simulation completed");
  }

  function downloadFixtures() {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            scenarioId: state.selectedScenarioId,
            batchSize: state.sandboxBatchSize,
            runs: state.sandboxRuns,
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sandbox-fixtures.json";
    a.click();
    URL.revokeObjectURL(url);
    setToast("Fixtures downloaded");
  }

  return (
    <PageFrame>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 font-audit-mono text-audit-mono text-secondary mb-1">
            <span>Partner</span>
            <span className="text-outline">/</span>
            <span className="text-on-surface font-medium">Sandbox &amp; Simulation</span>
          </nav>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
            Sandbox Simulation Runner
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            SANDBOX TESTNET v2.4-ephem · node-sandbox.legitscan.io · quota 842k/1M
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              resetSandbox();
              setToast("Sandbox reset");
            }}
            className="px-3.5 py-2 rounded bg-surface-container font-title-sm text-title-sm"
          >
            Reset state
          </button>
          <button
            type="button"
            onClick={downloadFixtures}
            className="px-3.5 py-2 rounded bg-surface-container font-title-sm text-title-sm"
          >
            Download fixtures
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded bg-surface-container-lowest shadow-sm p-4 space-y-3">
          <h2 className="font-title-md text-title-md text-primary">Scenarios</h2>
          {state.sandboxScenarios.map((sc) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => setSandboxScenario(sc.id)}
              className={`w-full text-left rounded p-3 ${
                state.selectedScenarioId === sc.id
                  ? "bg-primary-container text-on-primary"
                  : "bg-surface-container hover:bg-surface-container-high"
              }`}
            >
              <p className="font-title-sm text-title-sm">{sc.title}</p>
              <p
                className={`font-body-sm text-body-sm mt-0.5 ${
                  state.selectedScenarioId === sc.id
                    ? "text-on-primary/80"
                    : "text-on-surface-variant"
                }`}
              >
                {sc.detail}
              </p>
            </button>
          ))}
          <label className="font-audit-mono text-audit-mono text-on-surface-variant flex items-center gap-2">
            Batch size
            <input
              type="number"
              min={50}
              max={5000}
              value={state.sandboxBatchSize}
              onChange={(e) => setSandboxBatchSize(Number(e.target.value) || 50)}
              className="w-24 rounded bg-surface-container-low px-2 py-1 text-on-surface"
            />
          </label>
          <button
            type="button"
            disabled={busy}
            onClick={() => void run()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded bg-primary-container text-on-primary font-title-sm text-title-sm disabled:opacity-50"
          >
            <Icon name="play_arrow" size={18} />
            {busy ? "Running…" : "Execute batch simulation"}
          </button>
        </div>

        <div className="rounded bg-surface-container-lowest shadow-sm overflow-hidden">
          <div className="p-4 bg-surface-container-low">
            <h2 className="font-title-md text-title-md text-primary">Run history</h2>
          </div>
          {state.sandboxRuns.length === 0 ? (
            <p className="p-4 text-on-surface-variant text-sm">No runs yet.</p>
          ) : (
            <ul className="divide-y divide-surface-container">
              {state.sandboxRuns.map((r) => (
                <li key={r.id} className="p-4">
                  <p className="font-title-sm text-title-sm text-primary">{r.note}</p>
                  <p className="font-audit-mono text-audit-mono text-on-surface-variant">
                    {r.success}/{r.batchSize} ok · {r.failed} failed ·{" "}
                    {formatWhen(r.at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Toast message={toast} onClose={() => setToast(null)} />
    </PageFrame>
  );
}
