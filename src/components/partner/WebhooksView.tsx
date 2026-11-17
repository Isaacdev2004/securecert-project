"use client";

import { useState } from "react";
import { Icon } from "@/components/marketing/Icon";
import { usePartnerStore } from "@/lib/partner/store";
import { PageFrame, Toast, WebhookChip, formatWhen } from "./ui";

const EVENT_OPTIONS = [
  "credential.anchored",
  "credential.revoked",
  "batch.completed",
  "billing.invoice_settled",
];

export function WebhooksView() {
  const {
    state,
    addWebhook,
    toggleWebhook,
    sendTestPing,
    retryDegradedWebhooks,
    clearDlq,
  } = usePartnerStore();
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    url: "",
    events: ["credential.anchored"],
  });

  return (
    <PageFrame>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 font-audit-mono text-audit-mono text-secondary mb-1">
            <span>Partner</span>
            <span className="text-outline">/</span>
            <span className="text-on-surface font-medium">Webhook Subscriptions</span>
          </nav>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
            Webhooks &amp; Event Streams
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              retryDegradedWebhooks();
              setToast("Degraded endpoints retried · DLQ cleared");
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-surface-container font-title-sm text-title-sm"
          >
            <Icon name="replay" size={18} />
            Retry all
          </button>
          <button
            type="button"
            onClick={() => {
              clearDlq();
              setToast("DLQ drained");
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-surface-container font-title-sm text-title-sm"
          >
            Inspect DLQ ({state.dlqCount})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          ["Events / 24h", "384,192"],
          ["Success", "99.82%"],
          ["Retries", "691"],
          ["DLQ", String(state.dlqCount)],
        ].map(([label, value]) => (
          <div key={label} className="p-4 rounded bg-surface-container-lowest shadow-sm">
            <p className="font-label-status text-label-status uppercase text-secondary">
              {label}
            </p>
            <p className="font-headline-md text-headline-md text-primary font-bold mt-1">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded bg-surface-container-lowest shadow-sm p-4 space-y-3">
        <h2 className="font-title-md text-title-md text-primary">Create subscription</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded bg-surface-container-low px-3 py-2 focus:outline-none"
          />
          <input
            placeholder="https://…"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            className="rounded bg-surface-container-low px-3 py-2 focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {EVENT_OPTIONS.map((ev) => {
            const on = form.events.includes(ev);
            return (
              <button
                key={ev}
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    events: on
                      ? form.events.filter((e) => e !== ev)
                      : [...form.events, ev],
                  })
                }
                className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                  on
                    ? "bg-primary-container text-on-primary"
                    : "bg-surface-container text-on-surface-variant"
                }`}
              >
                {ev}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => {
            if (!form.name.trim() || !form.url.trim()) return;
            addWebhook(form.name.trim(), form.url.trim(), form.events);
            setForm({ name: "", url: "", events: ["credential.anchored"] });
            setToast("Webhook subscription created");
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-primary-container text-on-primary font-title-sm text-title-sm"
        >
          <Icon name="add" size={18} />
          Add webhook
        </button>
      </div>

      <div className="rounded bg-surface-container-lowest shadow-sm overflow-hidden">
        <ul className="divide-y divide-surface-container">
          {state.webhooks.map((w) => (
            <li
              key={w.id}
              className="p-4 flex flex-wrap items-start justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-title-sm text-title-sm text-primary">{w.name}</p>
                  <WebhookChip status={w.status} />
                </div>
                <p className="font-audit-mono text-audit-mono text-on-surface-variant break-all">
                  {w.url}
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  {w.events.join(" · ")} · {w.secretMasked} · {w.latencyMs}ms
                  {w.lastSuccessAt ? ` · last ${formatWhen(w.lastSuccessAt)}` : ""}
                </p>
                {w.failReason && (
                  <p className="text-error text-sm mt-1">{w.failReason}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const ok = sendTestPing(w.id);
                    setToast(ok ? "Test ping delivered" : "Test ping failed");
                  }}
                  className="px-3 py-1.5 rounded bg-surface-container font-title-sm text-title-sm"
                >
                  Test ping
                </button>
                <button
                  type="button"
                  onClick={() => toggleWebhook(w.id)}
                  className="px-3 py-1.5 rounded bg-surface-container font-title-sm text-title-sm"
                >
                  {w.status === "DISABLED" ? "Enable" : "Disable"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Toast message={toast} onClose={() => setToast(null)} />
    </PageFrame>
  );
}
