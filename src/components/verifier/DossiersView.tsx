"use client";

import { useState } from "react";
import { Icon } from "@/components/marketing/Icon";
import { useVerifierStore } from "@/lib/verifier/store";
import { CryptoChip, PageFrame, Toast, formatWhen } from "./ui";

export function DossiersView() {
  const { state, exportDossier } = useVerifierStore();
  const [toast, setToast] = useState<string | null>(null);
  const dossiers = state.dispatches.filter((d) => d.kind === "DOSSIER");

  return (
    <PageFrame>
      <div>
        <nav className="flex items-center gap-2 font-audit-mono text-audit-mono text-secondary mb-1">
          <span>Verifier</span>
          <span className="text-outline">/</span>
          <span className="text-on-surface font-medium">Diplomatic Dossiers</span>
        </nav>
        <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
          Diplomatic Dossiers &amp; W3C Transcripts
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 max-w-3xl">
          Compile PDF/A-3 consular packs and W3C VC transcript bundles for missions and
          evaluators.
        </p>
      </div>

      <div className="rounded bg-surface-container-lowest shadow-sm overflow-hidden">
        <div className="p-4 bg-surface-container-low flex items-center gap-2">
          <Icon name="policy" size={20} className="text-primary" />
          <h2 className="font-title-md text-title-md text-primary">Eligible cases</h2>
        </div>
        <ul className="divide-y divide-surface-container">
          {state.cases.map((c) => (
            <li
              key={c.id}
              className="px-4 py-3 flex flex-wrap items-center justify-between gap-3"
            >
              <div>
                <p className="font-title-sm text-title-sm text-primary">{c.candidateName}</p>
                <p className="font-audit-mono text-audit-mono text-on-surface-variant">
                  {c.agency} · {c.purposeRef}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CryptoChip status={c.cryptoStatus} />
                <button
                  type="button"
                  disabled={c.cryptoStatus === "BLOCKED"}
                  onClick={() => {
                    const ref = exportDossier(c.id);
                    setToast(`Compiled ${ref}`);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary-container text-on-primary font-title-sm text-title-sm disabled:opacity-40"
                >
                  <Icon name="picture_as_pdf" size={16} />
                  Compile PDF/A-3
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded bg-surface-container-lowest shadow-sm p-4">
        <h2 className="font-title-md text-title-md text-primary mb-3">Recent dispatches</h2>
        {dossiers.length === 0 ? (
          <p className="text-on-surface-variant text-sm">No dossiers compiled yet.</p>
        ) : (
          <ul className="space-y-2">
            {dossiers.map((d) => (
              <li
                key={d.id}
                className="flex flex-wrap items-center justify-between gap-2 font-body-sm text-body-sm border-b border-surface-container pb-2"
              >
                <span>
                  <span className="font-audit-mono text-secondary">{d.dossierRef}</span> —{" "}
                  {d.message}
                </span>
                <span className="font-audit-mono text-audit-mono text-on-surface-variant">
                  {formatWhen(d.at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Toast message={toast} onClose={() => setToast(null)} />
    </PageFrame>
  );
}
