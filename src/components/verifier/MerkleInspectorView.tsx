"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/marketing/Icon";
import { useVerifierStore } from "@/lib/verifier/store";
import { CryptoChip, PageFrame, Toast } from "./ui";

export function MerkleInspectorView() {
  const { state, selectCase, runMerkleAudit, exportDossier } = useVerifierStore();
  const [toast, setToast] = useState<string | null>(null);

  const selected = useMemo(
    () => state.cases.find((c) => c.id === state.selectedCaseId) || state.cases[0],
    [state.cases, state.selectedCaseId],
  );

  const uni = state.universities.find((u) => u.code === selected?.universityCode);
  const blocked = selected?.cryptoStatus === "BLOCKED";

  return (
    <PageFrame>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 font-audit-mono text-audit-mono text-secondary mb-1">
            <span>Verifier</span>
            <span className="text-outline">/</span>
            <span className="text-on-surface font-medium">Merkle Proof Inspector</span>
          </nav>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
            Live Merkle Proof Inspector
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 max-w-2xl">
            Walk the Poseidon-2 path from university HSM root to candidate leaf and confirm
            senate multi-sig quorum.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              runMerkleAudit();
              setToast("Merkle audit re-run");
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded bg-surface-container hover:bg-surface-container-high font-title-sm text-title-sm"
          >
            <Icon name="account_tree" size={18} />
            Re-run audit
          </button>
          <button
            type="button"
            disabled={!selected || blocked}
            onClick={() => {
              if (!selected) return;
              const ref = exportDossier(selected.id);
              setToast(`Consular stamp ${ref} generated`);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded bg-primary-container hover:bg-primary text-on-primary font-title-sm text-title-sm disabled:opacity-40"
          >
            <Icon name="approval" size={18} />
            Generate Consular Stamp
          </button>
        </div>
      </div>

      <div className="rounded bg-surface-container-lowest shadow-sm p-4">
        <label className="font-label-status text-label-status uppercase text-secondary tracking-wider">
          Focus case
        </label>
        <select
          className="mt-2 w-full max-w-xl rounded bg-surface-container-low px-3 py-2 font-title-sm text-title-sm text-on-surface focus:outline-none"
          value={selected?.id || ""}
          onChange={(e) => selectCase(e.target.value)}
        >
          {state.cases.map((c) => (
            <option key={c.id} value={c.id}>
              {c.candidateName} · {c.universityCode} · {c.matricNumber}
            </option>
          ))}
        </select>
      </div>

      {selected && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[
            {
              title: "1 · HSM Node",
              body: uni?.hsmLabel || selected.universityCode,
              icon: "security",
            },
            {
              title: "2 · Poseidon Merkle Root",
              body: selected.merkleRoot,
              icon: "hub",
            },
            {
              title: "3 · Candidate Leaf",
              body: selected.did,
              icon: "fingerprint",
            },
          ].map((step) => (
            <div
              key={step.title}
              className="rounded bg-surface-container-lowest shadow-sm p-4 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2 text-secondary">
                <Icon name={step.icon} size={20} />
                <span className="font-label-status text-label-status uppercase tracking-wider">
                  {step.title}
                </span>
              </div>
              <p className="font-audit-mono text-audit-mono text-on-surface break-all">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded bg-surface-container-lowest shadow-sm p-4">
          <h2 className="font-title-md text-title-md text-primary mb-3">
            Senate 3-of-3 multi-sig
          </h2>
          <ul className="space-y-2">
            {["Vice-Chancellor key", "Registrar key", "Exams & Records key"].map((k) => (
              <li
                key={k}
                className="flex items-center gap-2 font-title-sm text-title-sm text-on-surface"
              >
                <Icon
                  name={blocked ? "cancel" : "check_circle"}
                  size={18}
                  className={blocked ? "text-error" : "text-on-tertiary-container"}
                  filled
                />
                {k}
              </li>
            ))}
          </ul>
          <p className="font-audit-mono text-audit-mono text-on-surface-variant mt-3">
            Block {selected?.blockRef} · NIMC ZK bridge{" "}
            {blocked ? "DISARMED" : "ARMED"}
          </p>
        </div>

        <div
          className={`rounded shadow-sm p-5 ${
            blocked
              ? "bg-red-50 border border-red-200"
              : "bg-emerald-50 border border-emerald-200"
          }`}
        >
          <p className="font-label-status text-label-status uppercase tracking-wider mb-2">
            Decision
          </p>
          <h3
            className={`font-headline-md text-headline-md font-bold ${
              blocked ? "text-red-800" : "text-emerald-900"
            }`}
          >
            {blocked ? "RECORD BLOCKED / REVOKED" : "RECORD OFFICIALLY VALIDATED"}
          </h3>
          <div className="mt-3">
            {selected && <CryptoChip status={selected.cryptoStatus} />}
          </div>
          <p className="font-body-sm text-body-sm mt-3 opacity-80">
            {selected?.degreeLine}
          </p>
        </div>
      </div>

      <Toast message={toast} onClose={() => setToast(null)} />
    </PageFrame>
  );
}
