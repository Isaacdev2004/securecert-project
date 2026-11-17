"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/marketing/Icon";
import { useVerifierStore } from "@/lib/verifier/store";
import { CryptoChip, PageFrame, Toast, formatWhen } from "./ui";

export function RadarView() {
  const { state, resolveAlert, requestReconsent } = useVerifierStore();
  const [toast, setToast] = useState<string | null>(null);
  const blocked = state.cases.filter((c) => c.cryptoStatus === "BLOCKED");

  return (
    <PageFrame>
      <div>
        <nav className="flex items-center gap-2 font-audit-mono text-audit-mono text-secondary mb-1">
          <span>Verifier</span>
          <span className="text-outline">/</span>
          <span className="text-on-surface font-medium">Tamper &amp; Revocation</span>
        </nav>
        <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
          Tamper &amp; Revocation Radar
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 max-w-3xl">
          Monitor hash integrity anomalies and university revocation ledger hits before
          consular stamps are issued.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded bg-surface-container-lowest shadow-sm overflow-hidden">
          <div className="p-4 bg-surface-container-low flex items-center gap-2">
            <Icon name="radar" size={20} className="text-primary" />
            <h2 className="font-title-md text-title-md text-primary">Alert feed</h2>
          </div>
          <ul className="divide-y divide-surface-container">
            {state.alerts.map((a) => (
              <li key={a.id} className="p-4 flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                      a.severity === "CRITICAL"
                        ? "bg-red-50 text-red-700"
                        : a.severity === "WARN"
                          ? "bg-amber-50 text-amber-800"
                          : "bg-sky-50 text-sky-800"
                    }`}
                  >
                    {a.severity}
                  </span>
                  <span className="font-audit-mono text-audit-mono text-on-surface-variant">
                    {formatWhen(a.at)}
                  </span>
                </div>
                <p className="font-title-sm text-title-sm text-on-surface">{a.title}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{a.detail}</p>
                {!a.resolved && (
                  <button
                    type="button"
                    onClick={() => {
                      resolveAlert(a.id);
                      setToast("Alert marked resolved");
                    }}
                    className="self-start text-[12px] font-semibold text-secondary hover:text-primary"
                  >
                    Mark resolved
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded bg-surface-container-lowest shadow-sm overflow-hidden">
          <div className="p-4 bg-surface-container-low flex items-center gap-2">
            <Icon name="block" size={20} className="text-error" />
            <h2 className="font-title-md text-title-md text-primary">Exception queue</h2>
          </div>
          {blocked.length === 0 ? (
            <p className="p-4 text-on-surface-variant text-sm">No blocked credentials.</p>
          ) : (
            <ul className="divide-y divide-surface-container">
              {blocked.map((c) => (
                <li
                  key={c.id}
                  className="p-4 flex flex-wrap items-center justify-between gap-3"
                >
                  <div>
                    <p className="font-title-sm text-title-sm text-primary">
                      {c.candidateName}
                    </p>
                    <p className="font-audit-mono text-audit-mono text-on-surface-variant">
                      {c.universityCode} · {c.blockRef}
                    </p>
                    <div className="mt-1">
                      <CryptoChip status={c.cryptoStatus} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        requestReconsent(c.id);
                        setToast("Re-consent requested");
                      }}
                      className="px-3 py-1.5 rounded bg-surface-container font-title-sm text-title-sm"
                    >
                      Re-consent
                    </button>
                    <Link
                      href="/verifier"
                      className="px-3 py-1.5 rounded bg-primary-container text-on-primary font-title-sm text-title-sm"
                    >
                      Open desk
                    </Link>
                  </div>
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
