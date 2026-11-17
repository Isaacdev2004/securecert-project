"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/marketing/Icon";
import { usePartnerStore } from "@/lib/partner/store";
import { PageFrame, Toast, formatNgn, formatWhen } from "./ui";

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 900);
      setValue(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active]);
  return Math.round(value).toLocaleString("en-US");
}

export function OverviewView() {
  const { ready, state, setEnv, reset, pushStream, registerApplication } =
    usePartnerStore();
  const searchParams = useSearchParams();
  const showSupport = searchParams.get("panel") === "support";
  const [toast, setToast] = useState<string | null>(null);
  const [appName, setAppName] = useState("");

  useEffect(() => {
    if (!ready) return;
    const id = window.setInterval(() => {
      pushStream({
        kind: "INGEST",
        message: `Heartbeat · shard-alpha healthy · ${18 + Math.floor(Math.random() * 12)}ms`,
      });
    }, 10000);
    return () => window.clearInterval(id);
  }, [ready, pushStream]);

  const tenancies = useCountUp(state.kpis.tenancies, ready);
  const ingest = useCountUp(state.kpis.monthlyIngest, ready);
  const margin = useCountUp(state.kpis.marginAccruedNgn, ready);
  const quotaPct = Math.round(
    (state.kpis.monthlyIngest / state.kpis.ingestQuota) * 1000,
  ) / 10;

  return (
    <PageFrame>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 font-audit-mono text-audit-mono text-secondary mb-1">
            <span>Channel partner</span>
            <span className="text-outline">/</span>
            <span className="text-on-surface font-medium">Overview / Health</span>
          </nav>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
            {state.partnerName}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            {state.tier} · wholesale for brands, agencies &amp; SIS · ID{" "}
            {state.partnerId} · {state.officer}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded bg-surface-container p-0.5">
            {(["PROD", "SANDBOX"] as const).map((env) => (
              <button
                key={env}
                type="button"
                onClick={() => {
                  setEnv(env);
                  setToast(`Switched to ${env}`);
                }}
                className={`px-3 py-1.5 rounded font-title-sm text-title-sm ${
                  state.env === env
                    ? "bg-primary-container text-on-primary"
                    : "text-on-surface-variant"
                }`}
              >
                {env}
              </button>
            ))}
          </div>
          <Link
            href="/partner/apikeys"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-surface-container hover:bg-surface-container-high font-title-sm text-title-sm"
          >
            <Icon name="vpn_key" size={18} />
            Generate API credentials
          </Link>
          <Link
            href="/partner/sandbox"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-primary-container hover:bg-primary text-on-primary font-title-sm text-title-sm"
          >
            <Icon name="science" size={18} />
            Test sandbox
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 px-4 py-2.5 rounded bg-surface-container-low font-audit-mono text-audit-mono text-on-surface-variant">
        <span className="text-on-tertiary-container font-semibold">HSM ATTESTED</span>
        <span>•</span>
        <span>mTLS ECDHE-RSA-AES256-GCM-SHA384</span>
        <span>•</span>
        <span>Gateway 99.99% · p99 {state.kpis.latencyMs + 17}ms</span>
        <span>•</span>
        <span>Signing nonce #99201.884</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="p-4 rounded bg-surface-container-lowest shadow-sm">
          <p className="font-label-status text-label-status uppercase text-secondary">
            Connected issuer tenancies
          </p>
          <p className="font-headline-xl text-headline-xl text-primary font-bold mt-1">
            {tenancies}
          </p>
          <p className="font-audit-mono text-audit-mono text-on-surface-variant mt-2">
            {state.schools.filter((s) => s.status === "PENDING").length} pending
            invites · schools, agencies, brands
          </p>
        </div>
        <div className="p-4 rounded bg-surface-container-lowest shadow-sm">
          <p className="font-label-status text-label-status uppercase text-secondary">
            Monthly ingest
          </p>
          <p className="font-headline-xl text-headline-xl text-primary font-bold mt-1">
            {ingest}
          </p>
          <div className="mt-2 h-1.5 rounded-full bg-surface-container overflow-hidden">
            <div
              className="h-full bg-primary-container rounded-full"
              style={{ width: `${Math.min(100, quotaPct)}%` }}
            />
          </div>
          <p className="font-audit-mono text-audit-mono text-on-surface-variant mt-1">
            {quotaPct}% of {state.kpis.ingestQuota.toLocaleString()} quota
          </p>
        </div>
        <div className="p-4 rounded bg-surface-container-lowest shadow-sm">
          <p className="font-label-status text-label-status uppercase text-secondary">
            App health
          </p>
          <p className="font-headline-xl text-headline-xl text-primary font-bold mt-1">
            99.98%
          </p>
          <p className="font-audit-mono text-audit-mono text-on-surface-variant mt-2">
            Mean latency {state.kpis.latencyMs}ms
          </p>
        </div>
        <div className="p-4 rounded bg-surface-container-lowest shadow-sm">
          <p className="font-label-status text-label-status uppercase text-secondary">
            Accrued margin
          </p>
          <p className="font-headline-xl text-headline-xl text-primary font-bold mt-1">
            ₦{margin}
          </p>
          <Link
            href="/partner/billing"
            className="font-label-status text-label-status text-secondary hover:text-primary mt-2 inline-flex items-center gap-1"
          >
            Open billing <Icon name="arrow_forward" size={13} />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 space-y-4">
          <div className="rounded bg-surface-container-lowest shadow-sm p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <h2 className="font-title-md text-title-md text-primary">
                Registered applications
              </h2>
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!appName.trim()) return;
                  registerApplication(appName.trim());
                  setAppName("");
                  setToast("Application registered");
                }}
              >
                <input
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="New app name"
                  className="rounded bg-surface-container-low px-3 py-1.5 text-sm focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-primary-container text-on-primary font-title-sm text-title-sm"
                >
                  Register
                </button>
              </form>
            </div>
            <ul className="divide-y divide-surface-container">
              {state.applications.map((app) => (
                <li
                  key={app.id}
                  className="py-3 flex flex-wrap items-center justify-between gap-2"
                >
                  <div>
                    <p className="font-title-sm text-title-sm text-primary">{app.name}</p>
                    <p className="font-audit-mono text-audit-mono text-on-surface-variant">
                      {app.clientId} · {app.schoolsAttached} schools · peak {app.peakRps} rps
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                      app.health === "HEALTHY"
                        ? "bg-emerald-50 text-emerald-800"
                        : app.health === "DEGRADED"
                          ? "bg-amber-50 text-amber-800"
                          : "bg-sky-50 text-sky-800"
                    }`}
                  >
                    {app.health}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded bg-surface-container-lowest shadow-sm p-4">
            <h2 className="font-title-md text-title-md text-primary mb-3">Live ingest stream</h2>
            <ul className="space-y-2">
              {state.stream.slice(0, 8).map((ev) => (
                <li
                  key={ev.id}
                  className="flex flex-wrap items-center justify-between gap-2 font-body-sm text-body-sm border-b border-surface-container pb-2"
                >
                  <span>
                    <span className="font-audit-mono text-secondary mr-2">{ev.kind}</span>
                    {ev.message}
                  </span>
                  <span className="font-audit-mono text-audit-mono text-on-surface-variant">
                    {formatWhen(ev.at)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="xl:col-span-5 space-y-4">
          <div className="rounded bg-surface-container-lowest shadow-sm p-4">
            <h2 className="font-title-md text-title-md text-primary mb-2">Wholesale strip</h2>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="font-audit-mono text-audit-mono text-on-surface-variant">COGS</p>
                <p className="font-title-md text-title-md">₦120</p>
              </div>
              <div>
                <p className="font-audit-mono text-audit-mono text-on-surface-variant">Retail</p>
                <p className="font-title-md text-title-md">₦250</p>
              </div>
              <div>
                <p className="font-audit-mono text-audit-mono text-on-surface-variant">Margin</p>
                <p className="font-title-md text-title-md text-on-tertiary-container">
                  {formatNgn(state.kpis.unitMarginNgn)} ({state.kpis.commissionPct}%)
                </p>
              </div>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-3">
              YTD revenue {formatNgn(state.kpis.ytdRevenueNgn)}
            </p>
          </div>

          {showSupport && (
            <div className="rounded bg-surface-container-lowest shadow-sm p-4 border border-primary-container">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="support_agent" size={20} className="text-primary" />
                <h2 className="font-title-md text-title-md text-primary">
                  Partner Support &amp; SLA
                </h2>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Tier-1 response SLA 4 business hours · dedicated TAM Engr. D.
                Adeleke · escalation desk partners@legitscan.ng
              </p>
            </div>
          )}

          <div className="rounded bg-secondary-container/40 border border-secondary-container p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="verified_user" size={20} className="text-primary" />
              <h2 className="font-title-md text-title-md text-primary">ZUA-v2 consent</h2>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Partner tenancies inherit NDPA consent ledgers from each school node. Verify
              before enabling batch sync on new clients.
            </p>
            <Link
              href="/partner/schools"
              className="inline-flex items-center gap-1 mt-3 font-label-status text-label-status text-secondary hover:text-primary"
            >
              Verify consent ledger <Icon name="arrow_forward" size={13} />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => {
              reset();
              setToast("Partner demo reset");
            }}
            className="text-[11px] uppercase tracking-wide text-on-surface-variant hover:text-primary"
          >
            Reset demo state
          </button>
        </div>
      </div>

      <Toast message={toast} onClose={() => setToast(null)} />
    </PageFrame>
  );
}
