"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/marketing/Icon";
import { useVerifierStore } from "@/lib/verifier/store";
import type { DispatchKind } from "@/lib/verifier/types";
import { PageFrame, formatWhen } from "./ui";

const KINDS: Array<DispatchKind | "ALL"> = [
  "ALL",
  "VERIFY",
  "DOSSIER",
  "CONSENT",
  "TAMPER",
  "BILLING",
  "INGRESS",
];

export function AuditView() {
  const { state } = useVerifierStore();
  const [kind, setKind] = useState<(typeof KINDS)[number]>("ALL");

  const rows = useMemo(() => {
    if (kind === "ALL") return state.dispatches;
    return state.dispatches.filter((d) => d.kind === kind);
  }, [state.dispatches, kind]);

  return (
    <PageFrame>
      <div>
        <nav className="flex items-center gap-2 font-audit-mono text-audit-mono text-secondary mb-1">
          <span>Verifier</span>
          <span className="text-outline">/</span>
          <span className="text-on-surface font-medium">Audit &amp; Dispatches</span>
        </nav>
        <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
          Audit Logs &amp; Diplomatic Dispatches
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 max-w-3xl">
          Immutable desk activity — verifications, dossiers, consent events, and billing
          clears.
        </p>
      </div>

      <div className="flex flex-wrap gap-1">
        {KINDS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={`px-3 py-1.5 rounded font-title-sm text-title-sm ${
              kind === k
                ? "bg-primary-container text-on-primary"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      <div className="rounded bg-surface-container-lowest shadow-sm overflow-hidden">
        <ul className="divide-y divide-surface-container">
          {rows.map((d) => (
            <li key={d.id} className="px-4 py-3 flex items-start gap-3">
              <div className="w-9 h-9 rounded bg-surface-container flex items-center justify-center shrink-0 mt-0.5">
                <Icon
                  name={
                    d.kind === "VERIFY"
                      ? "verified_user"
                      : d.kind === "DOSSIER"
                        ? "policy"
                        : d.kind === "TAMPER"
                          ? "radar"
                          : d.kind === "BILLING"
                            ? "payments"
                            : d.kind === "CONSENT"
                              ? "key"
                              : "history_edu"
                  }
                  size={18}
                  className="text-primary"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-[10px] font-bold uppercase tracking-wide">
                    {d.kind}
                  </span>
                  <span className="font-audit-mono text-audit-mono text-on-surface-variant">
                    {formatWhen(d.at)}
                  </span>
                  {d.dossierRef && (
                    <span className="font-audit-mono text-audit-mono text-secondary">
                      {d.dossierRef}
                    </span>
                  )}
                </div>
                <p className="font-title-sm text-title-sm text-on-surface mt-0.5">
                  {d.message}
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {d.actor}
                  {d.caseId ? ` · case ${d.caseId}` : ""}
                </p>
              </div>
            </li>
          ))}
          {rows.length === 0 && (
            <li className="p-6 text-on-surface-variant text-sm">No events for this filter.</li>
          )}
        </ul>
      </div>
    </PageFrame>
  );
}
