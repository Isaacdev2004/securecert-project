"use client";

import { useState } from "react";
import { Icon } from "@/components/marketing/Icon";
import { usePartnerStore } from "@/lib/partner/store";
import type { BrandMode } from "@/lib/partner/types";
import { PageFrame, Toast, formatWhen } from "./ui";

const MODES: { id: BrandMode; label: string }[] = [
  { id: "DUAL", label: "Subtle Dual-Brand" },
  { id: "SOVEREIGN", label: "Full Sovereign" },
  { id: "GOVERNMENT", label: "Government Anchor" },
];

export function CustomizerView() {
  const {
    state,
    updateWhiteLabel,
    saveWhiteLabelDraft,
    deployWhiteLabel,
  } = usePartnerStore();
  const [toast, setToast] = useState<string | null>(null);
  const wl = state.whiteLabel;
  const school = state.schools.find((s) => s.id === wl.schoolId);

  return (
    <PageFrame>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 font-audit-mono text-audit-mono text-secondary mb-1">
            <span>Partner</span>
            <span className="text-outline">/</span>
            <span className="text-on-surface font-medium">White-label Verification</span>
          </nav>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
            White-label Custom Verification
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Client node {school?.name || "—"} · {school?.did} · BUILD 4.8.2-{state.env}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              saveWhiteLabelDraft();
              setToast("Draft saved");
            }}
            className="px-3.5 py-2 rounded bg-surface-container font-title-sm text-title-sm"
          >
            Save draft
          </button>
          <button
            type="button"
            onClick={() => {
              deployWhiteLabel();
              setToast("Deployed live");
            }}
            className="px-4 py-2 rounded bg-primary-container text-on-primary font-title-sm text-title-sm"
          >
            Deploy live
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded bg-surface-container-lowest shadow-sm p-4 space-y-3">
          <h2 className="font-title-md text-title-md text-primary flex items-center gap-2">
            <Icon name="dns" size={20} /> Domain / DNS
          </h2>
          <label className="block font-label-status text-label-status uppercase text-secondary">
            Client school
          </label>
          <select
            value={wl.schoolId}
            onChange={(e) => updateWhiteLabel({ schoolId: e.target.value })}
            className="w-full rounded bg-surface-container-low px-3 py-2 focus:outline-none"
          >
            {state.schools.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <label className="block font-label-status text-label-status uppercase text-secondary">
            Verification FQDN
          </label>
          <input
            value={wl.fqdn}
            onChange={(e) => updateWhiteLabel({ fqdn: e.target.value })}
            className="w-full rounded bg-surface-container-low px-3 py-2 focus:outline-none"
          />
          <p className="font-audit-mono text-audit-mono text-on-surface-variant">
            CNAME → edge.legitscan.io · TXT sc-token=9fa118be-… · CAA DigiCert/LE
          </p>
        </div>

        <div className="rounded bg-surface-container-lowest shadow-sm p-4 space-y-3">
          <h2 className="font-title-md text-title-md text-primary flex items-center gap-2">
            <Icon name="palette" size={20} /> Brand / themes
          </h2>
          <div className="flex flex-col gap-2">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => updateWhiteLabel({ brandMode: m.id })}
                className={`text-left px-3 py-2 rounded font-title-sm text-title-sm ${
                  wl.brandMode === m.id
                    ? "bg-primary-container text-on-primary"
                    : "bg-surface-container text-on-surface-variant"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded bg-surface-container-lowest shadow-sm p-4 space-y-3">
          <h2 className="font-title-md text-title-md text-primary flex items-center gap-2">
            <Icon name="privacy_tip" size={20} /> Privacy / NDPA
          </h2>
          <label className="flex items-center justify-between gap-3 font-title-sm text-title-sm">
            Obfuscate matriculation numbers
            <input
              type="checkbox"
              checked={wl.obfuscateMatric}
              onChange={(e) =>
                updateWhiteLabel({ obfuscateMatric: e.target.checked })
              }
            />
          </label>
          <label className="flex items-center justify-between gap-3 font-title-sm text-title-sm">
            Lock GPA behind consent
            <input
              type="checkbox"
              checked={wl.lockGpa}
              onChange={(e) => updateWhiteLabel({ lockGpa: e.target.checked })}
            />
          </label>
        </div>

        <div className="rounded bg-surface-container-lowest shadow-sm p-4">
          <h2 className="font-title-md text-title-md text-primary mb-2">Deploy status</h2>
          <p className="font-headline-md text-headline-md font-bold text-primary">
            {wl.deployStatus}
          </p>
          <p className="font-audit-mono text-audit-mono text-on-surface-variant mt-2">
            Updated {formatWhen(wl.updatedAt)}
          </p>
        </div>
      </div>

      <Toast message={toast} onClose={() => setToast(null)} />
    </PageFrame>
  );
}
