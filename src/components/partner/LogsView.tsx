"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/marketing/Icon";
import { usePartnerStore } from "@/lib/partner/store";
import { PageFrame, formatWhen } from "./ui";

export function LogsView() {
  const { state } = usePartnerStore();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(
    state.logEvents[0]?.id ?? null,
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return state.logEvents;
    return state.logEvents.filter(
      (l) =>
        l.school.toLowerCase().includes(q) ||
        l.path.toLowerCase().includes(q) ||
        l.connector.toLowerCase().includes(q) ||
        l.detail.toLowerCase().includes(q) ||
        String(l.status).includes(q),
    );
  }, [state.logEvents, query]);

  const selected = state.logEvents.find((l) => l.id === selectedId) || rows[0];

  return (
    <PageFrame>
      <div>
        <nav className="flex items-center gap-2 font-audit-mono text-audit-mono text-secondary mb-1">
          <span>Partner</span>
          <span className="text-outline">/</span>
          <span className="text-on-surface font-medium">Logs &amp; Telemetry</span>
        </nav>
        <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
          Request Logs &amp; Telemetry
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          ["Invocations / 24h", "2,418,920"],
          ["Mean latency", "18.4ms"],
          ["Uptime", "99.994%"],
          ["Workers", "32/32"],
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

      <div className="rounded bg-surface-container-low px-4 py-2.5 font-audit-mono text-audit-mono text-on-surface-variant flex flex-wrap gap-4">
        <span>2xx 98.4%</span>
        <span>4xx 1.4%</span>
        <span>5xx 0.2%</span>
        <span>REST 62% · gRPC 28% · Banner/Moodle connectors</span>
      </div>

      <div className="relative">
        <Icon
          name="search"
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter school, path, status…"
          className="w-full h-10 pl-9 pr-3 rounded bg-surface-container-lowest shadow-sm focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-7 rounded bg-surface-container-lowest shadow-sm overflow-hidden">
          <ul className="divide-y divide-surface-container max-h-[560px] overflow-y-auto">
            {rows.map((l) => (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(l.id)}
                  className={`w-full text-left px-4 py-3 hover:bg-surface-container ${
                    selected?.id === l.id ? "bg-surface-container-high/50" : ""
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        l.status < 300
                          ? "bg-emerald-50 text-emerald-800"
                          : l.status < 500
                            ? "bg-amber-50 text-amber-800"
                            : "bg-red-50 text-red-700"
                      }`}
                    >
                      {l.status}
                    </span>
                    <span className="font-title-sm text-title-sm">
                      {l.method} {l.path}
                    </span>
                    <span className="font-audit-mono text-audit-mono text-on-surface-variant">
                      {l.latencyMs}ms
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    {l.school} · {l.connector} · {formatWhen(l.at)}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="xl:col-span-5 rounded bg-surface-container-lowest shadow-sm p-4">
          <h2 className="font-title-md text-title-md text-primary mb-3">
            Trace inspector
          </h2>
          {selected ? (
            <div className="space-y-2 font-audit-mono text-audit-mono text-on-surface-variant">
              <p>
                <span className="text-secondary">When</span> {formatWhen(selected.at)}
              </p>
              <p>
                <span className="text-secondary">School</span> {selected.school}
              </p>
              <p>
                <span className="text-secondary">Connector</span> {selected.connector}
              </p>
              <p>
                <span className="text-secondary">Request</span> {selected.method}{" "}
                {selected.path}
              </p>
              <p>
                <span className="text-secondary">Status</span> {selected.status} ·{" "}
                {selected.latencyMs}ms
              </p>
              <p className="text-on-surface break-words">{selected.detail}</p>
            </div>
          ) : (
            <p className="text-sm text-on-surface-variant">Select a log row.</p>
          )}
        </div>
      </div>
    </PageFrame>
  );
}
