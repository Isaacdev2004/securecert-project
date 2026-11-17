"use client";

import { useState } from "react";
import { Icon } from "@/components/marketing/Icon";
import { useVerifierStore } from "@/lib/verifier/store";
import { ConsentChip, PageFrame, Toast, formatWhen } from "./ui";

export function ConsentsView() {
  const { state, requestReconsent } = useVerifierStore();
  const [toast, setToast] = useState<string | null>(null);

  return (
    <PageFrame>
      <div>
        <nav className="flex items-center gap-2 font-audit-mono text-audit-mono text-secondary mb-1">
          <span>Verifier</span>
          <span className="text-outline">/</span>
          <span className="text-on-surface font-medium">NDPA Consent Grants</span>
        </nav>
        <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
          NDPA Blinded Consent Grants
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 max-w-3xl">
          Manage selective disclosure scopes. NIN and address stay blinded unless the holder
          expands the grant.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          {state.consents.map((g) => (
            <div
              key={g.id}
              className="rounded bg-surface-container-lowest shadow-sm p-4 flex flex-col gap-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-title-sm text-title-sm text-primary">
                    {g.candidateName}
                  </p>
                  <p className="font-audit-mono text-audit-mono text-on-surface-variant">
                    Token {g.blindedToken} · expires {formatWhen(g.expiresAt)}
                  </p>
                </div>
                <ConsentChip status={g.status} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="font-label-status text-label-status uppercase text-secondary mb-1">
                    Revealed
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {g.revealed.length ? (
                      g.revealed.map((f) => (
                        <span
                          key={f}
                          className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container text-[11px] font-semibold"
                        >
                          {f}
                        </span>
                      ))
                    ) : (
                      <span className="text-on-surface-variant text-sm">None</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="font-label-status text-label-status uppercase text-secondary mb-1">
                    Blinded
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {g.blinded.map((f) => (
                      <span
                        key={f}
                        className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-semibold"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {(g.status === "REVOKED" || g.status === "TIMED_OUT") && (
                <button
                  type="button"
                  onClick={() => {
                    requestReconsent(g.caseId);
                    setToast("Re-consent request sent to holder");
                  }}
                  className="self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high font-title-sm text-title-sm"
                >
                  <Icon name="key" size={16} />
                  Request re-consent
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="rounded bg-surface-container-lowest shadow-sm p-4 h-fit">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="visibility_off" size={20} className="text-primary" />
            <h2 className="font-title-md text-title-md text-primary">Privacy radar</h2>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Under NDPA 2023 Sec 37, consular desks receive only attributes the holder
            explicitly grants. Blinded fields never leave the enclave — verifiers see a ZK
            attestation instead of raw PII.
          </p>
          <div className="mt-4 font-audit-mono text-audit-mono text-on-surface-variant space-y-1">
            <p>Consent rate: {state.consentRate}%</p>
            <p>Active grants: {state.activeGrants.toLocaleString()}</p>
            <p className="text-error">Timed-out: {state.timedOutGrants}</p>
          </div>
        </div>
      </div>

      <Toast message={toast} onClose={() => setToast(null)} />
    </PageFrame>
  );
}
