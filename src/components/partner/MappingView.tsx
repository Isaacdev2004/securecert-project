"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/marketing/Icon";
import { usePartnerStore } from "@/lib/partner/store";
import { PageFrame, Toast } from "./ui";

export function MappingView() {
  const { state, updateMapping } = usePartnerStore();
  const [candidateId, setCandidateId] = useState(state.mappingCandidates[0]?.id);
  const [toast, setToast] = useState<string | null>(null);

  const candidate = useMemo(
    () => state.mappingCandidates.find((c) => c.id === candidateId),
    [state.mappingCandidates, candidateId],
  );

  const preview = useMemo(() => {
    if (!candidate) return null;
    return {
      "@context": ["https://www.w3.org/ns/credentials/v2"],
      type: ["VerifiableCredential", "HigherEducationCredential"],
      credentialSubject: {
        id: `did:sc:ng-unilag:std:${candidate.matric}`,
        matricNo: candidate.matric,
        degree: candidate.program,
        claims: { cgpa: candidate.cgpa, fullName: candidate.name },
      },
    };
  }, [candidate]);

  return (
    <PageFrame>
      <div>
        <nav className="flex items-center gap-2 font-audit-mono text-audit-mono text-secondary mb-1">
          <span>Partner</span>
          <span className="text-outline">/</span>
          <span className="text-on-surface font-medium">Field Mapping Schemas</span>
        </nav>
        <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
          SIS → W3C VC Field Mapping
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
          EduNova SIS v4.8 → W3C VC 2.0 Higher Ed Profile · Senate Faculty Engine
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded bg-surface-container-lowest shadow-sm overflow-hidden">
          <div className="p-4 bg-surface-container-low flex items-center gap-2">
            <Icon name="schema" size={20} className="text-primary" />
            <h2 className="font-title-md text-title-md text-primary">Mapping grid</h2>
          </div>
          <ul className="divide-y divide-surface-container">
            {state.mappings.map((m) => (
              <li key={m.id} className="p-4 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    value={m.sisField}
                    onChange={(e) =>
                      updateMapping(m.id, { sisField: e.target.value })
                    }
                    className="rounded bg-surface-container-low px-2 py-1.5 font-audit-mono text-sm focus:outline-none"
                  />
                  <input
                    value={m.transform}
                    onChange={(e) =>
                      updateMapping(m.id, { transform: e.target.value })
                    }
                    className="rounded bg-surface-container-low px-2 py-1.5 font-audit-mono text-sm focus:outline-none sm:col-span-1"
                  />
                  <input
                    value={m.targetClaim}
                    onChange={(e) =>
                      updateMapping(m.id, { targetClaim: e.target.value })
                    }
                    className="rounded bg-surface-container-low px-2 py-1.5 font-audit-mono text-sm focus:outline-none"
                  />
                </div>
              </li>
            ))}
          </ul>
          <div className="p-4 border-t border-surface-container">
            <button
              type="button"
              onClick={() => setToast("Mapping schema saved")}
              className="px-4 py-2 rounded bg-primary-container text-on-primary font-title-sm text-title-sm"
            >
              Save schema
            </button>
          </div>
        </div>

        <div className="rounded bg-surface-container-lowest shadow-sm p-4 space-y-3">
          <h2 className="font-title-md text-title-md text-primary">Live transform preview</h2>
          <select
            value={candidateId}
            onChange={(e) => setCandidateId(e.target.value)}
            className="w-full rounded bg-surface-container-low px-3 py-2 focus:outline-none"
          >
            {state.mappingCandidates.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} · {c.matric}
              </option>
            ))}
          </select>
          <p className="font-audit-mono text-audit-mono text-on-surface-variant">
            Transform latency ~2.8 ms
          </p>
          <pre className="text-xs font-audit-mono bg-surface-container-low rounded p-3 overflow-auto max-h-[420px]">
            {JSON.stringify(preview, null, 2)}
          </pre>
        </div>
      </div>

      <Toast message={toast} onClose={() => setToast(null)} />
    </PageFrame>
  );
}
