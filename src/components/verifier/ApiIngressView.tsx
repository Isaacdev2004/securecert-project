"use client";

import { useState } from "react";
import { Icon } from "@/components/marketing/Icon";
import { useVerifierStore } from "@/lib/verifier/store";
import { PageFrame, Toast, formatWhen } from "./ui";

export function ApiIngressView() {
  const { state, createApiKey, revokeApiKey } = useVerifierStore();
  const [name, setName] = useState("");
  const [secretOnce, setSecretOnce] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function onCreate() {
    const label = name.trim() || "Ingress key";
    const { secret } = createApiKey(label);
    setSecretOnce(secret);
    setName("");
    setToast("API key created — copy the secret now");
  }

  return (
    <PageFrame>
      <div>
        <nav className="flex items-center gap-2 font-audit-mono text-audit-mono text-secondary mb-1">
          <span>Verifier</span>
          <span className="text-outline">/</span>
          <span className="text-on-surface font-medium">API Keys &amp; Ingress</span>
        </nav>
        <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
          API Keys &amp; Automated Ingress
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 max-w-3xl">
          Machine credentials for IRCC gateways, WES pipelines, and corporate HRIS hooks.
        </p>
      </div>

      <div className="rounded bg-surface-container-lowest shadow-sm p-4 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label className="font-label-status text-label-status uppercase text-secondary">
            Key name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Corporate HRIS prod"
            className="mt-1 w-full rounded bg-surface-container-low px-3 py-2 font-title-sm text-title-sm focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-primary-container text-on-primary font-title-sm text-title-sm"
        >
          <Icon name="add" size={18} />
          Create key
        </button>
      </div>

      {secretOnce && (
        <div className="rounded border border-amber-200 bg-amber-50 p-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-title-sm text-title-sm text-amber-900">
              Secret shown once
            </p>
            <code className="font-audit-mono text-audit-mono text-amber-950 break-all">
              {secretOnce}
            </code>
          </div>
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard.writeText(secretOnce);
              setToast("Secret copied");
            }}
            className="px-3 py-1.5 rounded bg-amber-900 text-white font-title-sm text-title-sm"
          >
            Copy
          </button>
        </div>
      )}

      <div className="rounded bg-surface-container-lowest shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="font-audit-mono text-audit-mono text-on-surface-variant uppercase text-[11px] bg-surface-container-low">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Prefix</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Created</th>
              <th className="py-3 px-4">Last used</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {state.apiKeys.map((k) => (
              <tr key={k.id}>
                <td className="py-3 px-4 font-title-sm text-title-sm">{k.name}</td>
                <td className="py-3 px-4 font-audit-mono text-audit-mono">{k.prefix}…</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                      k.status === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-800"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {k.status}
                  </span>
                </td>
                <td className="py-3 px-4 font-audit-mono text-audit-mono text-on-surface-variant">
                  {formatWhen(k.createdAt)}
                </td>
                <td className="py-3 px-4 font-audit-mono text-audit-mono text-on-surface-variant">
                  {formatWhen(k.lastUsedAt)}
                </td>
                <td className="py-3 px-4 text-right">
                  {k.status === "ACTIVE" && (
                    <button
                      type="button"
                      onClick={() => {
                        revokeApiKey(k.id);
                        setToast("API key revoked");
                      }}
                      className="text-[12px] font-semibold text-error hover:underline"
                    >
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Toast message={toast} onClose={() => setToast(null)} />
    </PageFrame>
  );
}
