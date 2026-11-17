"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/components/marketing/Icon";
import { usePartnerStore } from "@/lib/partner/store";
import { KeyChip, PageFrame, Toast, formatWhen } from "./ui";

export function ApiKeysView() {
  const { state, createApiKey, rollSecret, revokeApiKey } = usePartnerStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") === "apps" ? "apps" : "keys";
  const [label, setLabel] = useState("");
  const [secretOnce, setSecretOnce] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const title = useMemo(
    () =>
      tab === "apps"
        ? "Registered Applications"
        : "API Keys & OAuth Credentials",
    [tab],
  );

  return (
    <PageFrame>
      <div>
        <nav className="flex items-center gap-2 font-audit-mono text-audit-mono text-secondary mb-1">
          <span>Partner</span>
          <span className="text-outline">/</span>
          <span className="text-on-surface font-medium">{title}</span>
        </nav>
        <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
          {title}
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
          Machine clients for SIS sync, batch ingress, and webhook listeners.
        </p>
        <div className="flex gap-1 mt-3">
          {(
            [
              ["apps", "Applications"],
              ["keys", "API Keys"],
            ] as const
          ).map(([id, labelText]) => (
            <button
              key={id}
              type="button"
              onClick={() => router.replace(`/partner/apikeys?tab=${id}`)}
              className={`px-3 py-1.5 rounded font-title-sm text-title-sm ${
                tab === id
                  ? "bg-primary-container text-on-primary"
                  : "bg-surface-container text-on-surface-variant"
              }`}
            >
              {labelText}
            </button>
          ))}
        </div>
      </div>

      {tab === "apps" && (
        <div className="rounded bg-surface-container-lowest shadow-sm overflow-hidden">
          <ul className="divide-y divide-surface-container">
            {state.applications.map((app) => (
              <li
                key={app.id}
                className="px-4 py-3 flex flex-wrap items-center justify-between gap-2"
              >
                <div>
                  <p className="font-title-sm text-title-sm text-primary">
                    {app.name}
                  </p>
                  <p className="font-audit-mono text-audit-mono text-on-surface-variant">
                    {app.clientId} · {app.env} · {app.schoolsAttached} schools
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase bg-surface-container">
                  {app.health}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "keys" && (
        <>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded bg-surface-container-lowest shadow-sm">
          <p className="font-label-status text-label-status uppercase text-secondary">
            Live clients
          </p>
          <p className="font-headline-md text-headline-md text-primary font-bold mt-1">
            {state.apiKeys.filter((k) => k.status !== "REVOKED").length}
          </p>
        </div>
        <div className="p-4 rounded bg-surface-container-lowest shadow-sm">
          <p className="font-label-status text-label-status uppercase text-secondary">
            24h burn
          </p>
          <p className="font-headline-md text-headline-md text-primary font-bold mt-1">
            148,290
          </p>
        </div>
        <div className="p-4 rounded bg-surface-container-lowest shadow-sm">
          <p className="font-label-status text-label-status uppercase text-secondary">
            Mean latency
          </p>
          <p className="font-headline-md text-headline-md text-primary font-bold mt-1">
            24.2ms
          </p>
        </div>
      </div>


      <div className="rounded bg-surface-container-lowest shadow-sm p-4 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label className="font-label-status text-label-status uppercase text-secondary">
            New key label
          </label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. HRIS production"
            className="mt-1 w-full rounded bg-surface-container-low px-3 py-2 focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            const { secret } = createApiKey(label.trim() || "Partner key");
            setSecretOnce(secret);
            setLabel("");
            setToast("API key created — copy the secret now");
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-primary-container text-on-primary font-title-sm text-title-sm"
        >
          <Icon name="add" size={18} />
          Create key
        </button>
      </div>

      {secretOnce && (
        <div className="rounded border border-amber-200 bg-amber-50 p-4 flex flex-wrap items-center justify-between gap-3">
          <code className="font-audit-mono text-audit-mono text-amber-950 break-all">
            {secretOnce}
          </code>
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
              <th className="py-3 px-4">Label</th>
              <th className="py-3 px-4">Prefix</th>
              <th className="py-3 px-4">Kind</th>
              <th className="py-3 px-4">Rate / IPs</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Last used</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {state.apiKeys.map((k) => (
              <tr key={k.id}>
                <td className="py-3 px-4 font-title-sm text-title-sm">{k.label}</td>
                <td className="py-3 px-4 font-audit-mono text-audit-mono">
                  {k.prefix}…
                </td>
                <td className="py-3 px-4 font-body-sm text-body-sm">{k.kind}</td>
                <td className="py-3 px-4 font-audit-mono text-audit-mono text-on-surface-variant">
                  {k.rateLimit}
                  <br />
                  {k.ips.join(", ")}
                </td>
                <td className="py-3 px-4">
                  <KeyChip status={k.status} />
                </td>
                <td className="py-3 px-4 font-audit-mono text-audit-mono text-on-surface-variant">
                  {formatWhen(k.lastUsedAt)}
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  {k.status !== "REVOKED" && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          const secret = rollSecret(k.id);
                          setSecretOnce(secret);
                          setToast("Secret rolled");
                        }}
                        className="text-[12px] font-semibold text-secondary hover:text-primary"
                      >
                        Roll
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          revokeApiKey(k.id);
                          setToast("Key revoked");
                        }}
                        className="text-[12px] font-semibold text-error hover:underline"
                      >
                        Revoke
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        </>
      )}

      <Toast message={toast} onClose={() => setToast(null)} />
    </PageFrame>
  );
}
