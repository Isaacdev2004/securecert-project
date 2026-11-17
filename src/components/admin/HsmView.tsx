"use client";

import { useState } from "react";
import { Icon } from "@/components/marketing/Icon";
import { useAdminStore } from "@/lib/admin/store";
import { EnclaveChip, PageFrame, Toast } from "./ui";

export function HsmView() {
  const { state, rotateRootKey, emergencyAirGap, bulkKeyRotation } =
    useAdminStore();
  const [toast, setToast] = useState<string | null>(null);

  function exportAttestation() {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            enclaves: state.enclaves,
            rootKeys: state.rootKeys,
            custodians: state.custodians,
            exportedAt: new Date().toISOString(),
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
    a.download = "hsm-attestation.json";
    a.click();
    URL.revokeObjectURL(url);
    setToast("Attestation exported");
  }

  return (
    <PageFrame>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 font-audit-mono text-audit-mono text-secondary mb-1">
            <span>Super Admin</span>
            <span className="text-outline">/</span>
            <span className="text-on-surface font-medium">
              HSM Root Signers &amp; Keys
            </span>
          </nav>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
            Root Signers &amp; Cryptographic Enclaves
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            {state.kpis.sigsPerSec.toLocaleString()} sigs/sec · quorum 3 of 5 ·
            rotation in {state.kpis.rotationDaysLeft}d
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportAttestation}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-surface-container font-title-sm text-title-sm"
          >
            <Icon name="download" size={18} />
            Export attestation
          </button>
          <button
            type="button"
            onClick={() => {
              bulkKeyRotation();
              setToast("Key ceremony completed");
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-primary-container text-on-primary font-title-sm text-title-sm"
          >
            <Icon name="key" size={18} />
            Initiate key ceremony
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {state.enclaves.map((e) => (
          <div
            key={e.id}
            className="rounded bg-surface-container-lowest shadow-sm p-4 space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-title-sm text-title-sm text-primary">{e.name}</p>
              <EnclaveChip status={e.status} />
            </div>
            <p className="font-audit-mono text-audit-mono text-on-surface-variant">
              {e.role} · {e.fipsLevel}
            </p>
            <p className="font-body-sm text-body-sm">{e.hardware}</p>
            <p className="font-audit-mono text-audit-mono text-on-surface-variant">
              {e.tempC}°C · {e.sigs30d.toLocaleString()} seals / 30d
            </p>
            {e.status !== "ISOLATED" && (
              <button
                type="button"
                onClick={() => {
                  emergencyAirGap(e.id);
                  setToast(`${e.name} air-gapped`);
                }}
                className="text-[12px] font-semibold text-error"
              >
                Emergency air-gap
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 rounded bg-surface-container-lowest shadow-sm overflow-hidden">
          <div className="p-4 bg-surface-container-low">
            <h2 className="font-title-md text-title-md text-primary">
              Root key registry
            </h2>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="font-audit-mono text-audit-mono text-on-surface-variant uppercase text-[11px] bg-surface-container-low">
                <th className="py-3 px-4">KID</th>
                <th className="py-3 px-4">Suite</th>
                <th className="py-3 px-4">Slot</th>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {state.rootKeys.map((k) => (
                <tr key={k.id}>
                  <td className="py-3 px-4">
                    <p className="font-title-sm text-title-sm">{k.kid}</p>
                    <p className="font-audit-mono text-audit-mono text-on-surface-variant">
                      {k.publicHash} · {k.quorum}
                    </p>
                  </td>
                  <td className="py-3 px-4 font-body-sm text-body-sm">
                    {k.suite}
                  </td>
                  <td className="py-3 px-4 font-audit-mono text-audit-mono">
                    {k.slot}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                        k.state === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-800"
                          : k.state === "ROTATING"
                            ? "bg-amber-50 text-amber-800"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {k.state}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {k.state === "ACTIVE" && (
                      <button
                        type="button"
                        onClick={() => {
                          rotateRootKey(k.id);
                          setToast("Rotation initiated");
                        }}
                        className="text-[12px] font-semibold text-secondary"
                      >
                        Rotate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="xl:col-span-5 rounded bg-surface-container-lowest shadow-sm p-4">
          <h2 className="font-title-md text-title-md text-primary mb-3">
            Ceremony custodians
          </h2>
          <ul className="space-y-3">
            {state.custodians.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-2 border-b border-surface-container pb-2"
              >
                <div>
                  <p className="font-title-sm text-title-sm">{c.name}</p>
                  <p className="font-audit-mono text-audit-mono text-on-surface-variant">
                    {c.org} · {c.tokenId}
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    c.state === "ARMED"
                      ? "bg-emerald-50 text-emerald-800"
                      : c.state === "AIR_GAPPED"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-sky-50 text-sky-800"
                  }`}
                >
                  {c.state.replace("_", " ")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Toast message={toast} onClose={() => setToast(null)} />
    </PageFrame>
  );
}
