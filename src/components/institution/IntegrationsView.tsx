"use client";

import { FormEvent, useState } from "react";
import { Icon } from "@/components/marketing/Icon";
import { useInstitutionStore } from "@/lib/institution/store";
import { PageFrame, Toast, formatWhen } from "./ui";

type Tab = "keys" | "webhooks" | "logs" | "mapping";

export function IntegrationsView() {
  const {
    ready,
    state,
    createApiKey,
    revokeApiKey,
    toggleWebhook,
    addWebhook,
    updateMapping,
  } = useInstitutionStore();
  const [tab, setTab] = useState<Tab>("keys");
  const [toast, setToast] = useState<string | null>(null);
  const [keyName, setKeyName] = useState("New SIS connector");
  const [whUrl, setWhUrl] = useState("https://");
  const [revealed, setRevealed] = useState<string | null>(null);

  function onCreateKey(e: FormEvent) {
    e.preventDefault();
    const { secret } = createApiKey(keyName);
    setRevealed(secret);
    setToast("API key created — copy it now");
  }

  function onAddWebhook(e: FormEvent) {
    e.preventDefault();
    addWebhook(whUrl, ["credential.issued", "credential.revoked"]);
    setToast("Webhook endpoint added");
    setWhUrl("https://");
  }

  if (!ready) {
    return (
      <PageFrame>
        <p className="py-20 text-center text-on-surface-variant">Loading…</p>
      </PageFrame>
    );
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "keys", label: "API keys", icon: "key" },
    { id: "webhooks", label: "Webhooks", icon: "sensors" },
    { id: "logs", label: "Telemetry", icon: "terminal" },
    { id: "mapping", label: "Field mapping", icon: "account_tree" },
  ];

  return (
    <PageFrame>
      <div>
        <h1 className="text-[28px] font-bold tracking-tight">
          Integrations &amp; connectors
        </h1>
        <p className="text-[14px] text-on-surface-variant mt-1">
          Keys, webhooks, logs, and SIS field maps for {state.tenantName}.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`h-10 px-3 rounded-full text-[13px] font-semibold inline-flex items-center gap-1.5 border ${
              tab === t.id
                ? "bg-[#0f766e] text-white border-[#0f766e]"
                : "bg-white border-outline-variant/50"
            }`}
          >
            <Icon name={t.icon} size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "keys" && (
        <div className="space-y-4">
          <form
            onSubmit={onCreateKey}
            className="rounded-xl bg-white border border-outline-variant/30 p-4 shadow-sm flex flex-wrap gap-2 items-end"
          >
            <label className="block flex-1 min-w-[200px]">
              <span className="text-[12px] font-bold">Key name</span>
              <input
                required
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                className="mt-1 w-full h-11 rounded-xl border border-outline-variant/60 px-3 outline-none focus:border-[#0f766e]"
              />
            </label>
            <button
              type="submit"
              className="h-11 px-4 rounded-xl bg-[#0f766e] text-white text-[14px] font-semibold"
            >
              Generate key
            </button>
          </form>
          {revealed && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-[13px]">
              <p className="font-bold text-amber-900">Copy secret once</p>
              <p className="mt-1 font-audit-mono break-all">{revealed}</p>
            </div>
          )}
          <div className="rounded-xl bg-white border border-outline-variant/30 overflow-hidden shadow-sm">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-surface-container-low/80 text-[11px] uppercase text-secondary">
                <tr>
                  <th className="px-5 py-3 font-bold">Name</th>
                  <th className="px-3 py-3 font-bold">Prefix</th>
                  <th className="px-3 py-3 font-bold">Last used</th>
                  <th className="px-5 py-3 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {state.apiKeys.map((k) => (
                  <tr key={k.id} className="border-t border-outline-variant/20">
                    <td className="px-5 py-3 font-semibold">{k.name}</td>
                    <td className="px-3 py-3 font-audit-mono text-[12px]">
                      {k.prefix}…
                    </td>
                    <td className="px-3 py-3 text-on-surface-variant">
                      {formatWhen(k.lastUsedAt)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      {k.status === "ACTIVE" ? (
                        <button
                          type="button"
                          onClick={() => {
                            revokeApiKey(k.id);
                            setToast("API key revoked");
                          }}
                          className="text-[12px] font-bold text-red-600"
                        >
                          Revoke
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-on-surface-variant">
                          REVOKED
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "webhooks" && (
        <div className="space-y-4">
          <form
            onSubmit={onAddWebhook}
            className="rounded-xl bg-white border border-outline-variant/30 p-4 shadow-sm flex flex-wrap gap-2 items-end"
          >
            <label className="block flex-1 min-w-[240px]">
              <span className="text-[12px] font-bold">Endpoint URL</span>
              <input
                required
                type="url"
                value={whUrl}
                onChange={(e) => setWhUrl(e.target.value)}
                className="mt-1 w-full h-11 rounded-xl border border-outline-variant/60 px-3 outline-none focus:border-[#0f766e]"
              />
            </label>
            <button
              type="submit"
              className="h-11 px-4 rounded-xl bg-[#0f766e] text-white text-[14px] font-semibold"
            >
              Add webhook
            </button>
          </form>
          <ul className="space-y-3">
            {state.webhooks.map((w) => (
              <li
                key={w.id}
                className="rounded-xl bg-white border border-outline-variant/30 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-[14px] truncate">{w.url}</p>
                  <p className="text-[12px] text-on-surface-variant">
                    {w.events.join(", ")} · last{" "}
                    {formatWhen(w.lastDelivery)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleWebhook(w.id)}
                  className={`h-9 px-3 rounded-lg text-[12px] font-bold ${
                    w.status === "ACTIVE"
                      ? "bg-emerald-50 text-emerald-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {w.status === "ACTIVE" ? "Pause" : "Resume"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "logs" && (
        <section className="rounded-xl bg-[#0b1c30] text-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-bold">Request telemetry</h2>
            <span className="text-[10px] uppercase tracking-wider text-[#5eead4]">
              Live demo feed
            </span>
          </div>
          <ul className="mt-4 space-y-3 max-h-[420px] overflow-y-auto font-audit-mono text-[12px]">
            {state.stream.map((e) => (
              <li key={e.id}>
                <span className="text-white/40">
                  {formatWhen(e.at)} [{e.kind}]
                </span>{" "}
                <span className="text-white/90">{e.message}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tab === "mapping" && (
        <div className="rounded-xl bg-white border border-outline-variant/30 shadow-sm overflow-hidden">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-surface-container-low/80 text-[11px] uppercase text-secondary">
              <tr>
                <th className="px-5 py-3 font-bold">SIS field</th>
                <th className="px-3 py-3 font-bold">LegitScan field</th>
              </tr>
            </thead>
            <tbody>
              {state.fieldMappings.map((m) => (
                <tr key={m.id} className="border-t border-outline-variant/20">
                  <td className="px-5 py-3">
                    <input
                      value={m.sisField}
                      onChange={(e) =>
                        updateMapping(m.id, e.target.value, m.legitscanField)
                      }
                      className="h-9 w-full rounded-lg border border-outline-variant/50 px-2 font-audit-mono text-[12px]"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      value={m.legitscanField}
                      onChange={(e) =>
                        updateMapping(m.id, m.sisField, e.target.value)
                      }
                      className="h-9 w-full rounded-lg border border-outline-variant/50 px-2 font-audit-mono text-[12px]"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-outline-variant/30">
            <button
              type="button"
              onClick={() => setToast("Field mapping saved (demo)")}
              className="h-10 px-4 rounded-xl bg-[#0f766e] text-white text-[13px] font-semibold"
            >
              Save mapping
            </button>
          </div>
        </div>
      )}

      <Toast message={toast} onClose={() => setToast(null)} />
    </PageFrame>
  );
}
