"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/marketing/Icon";
import { useVerifierStore } from "@/lib/verifier/store";
import type { CasePurpose } from "@/lib/verifier/types";
import {
  AssuranceTape,
  ConsentChip,
  CryptoChip,
  PageFrame,
  Toast,
  formatWhen,
} from "./ui";

type Filter = "ALL" | CasePurpose;

function useCountUp(target: number, active: boolean, decimals = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 900);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active]);
  return decimals > 0
    ? value.toFixed(decimals)
    : Math.round(value).toLocaleString("en-US");
}

export function DeskView() {
  const {
    ready,
    state,
    reset,
    selectCase,
    verifyTarget,
    runMerkleAudit,
    requestReconsent,
    exportDossier,
  } = useVerifierStore();
  const [filter, setFilter] = useState<Filter>("ALL");
  const [query, setQuery] = useState("");
  const [uni, setUni] = useState("UNILAG");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const focused = state.cases.find((c) => c.id === state.selectedCaseId);
    if (focused) {
      setQuery(focused.did);
      setUni(focused.universityCode);
    }
  }, [state.selectedCaseId, state.cases]);

  const rows = useMemo(() => {
    return state.cases.filter((c) => {
      if (filter !== "ALL" && c.purpose !== filter) return false;
      return true;
    });
  }, [state.cases, filter]);

  const counts = useMemo(() => {
    const base = {
      ALL: state.cases.length,
      VISA: 0,
      WES: 0,
      CORPORATE: 0,
      PRODUCT: 0,
      GOVERNMENT: 0,
      EXCEPTION: 0,
    };
    for (const c of state.cases) base[c.purpose] += 1;
    return base;
  }, [state.cases]);

  const openFlags = state.alerts.filter((a) => !a.resolved).length;
  const inquiries = useCountUp(state.inquiries30d, ready);
  const consent = useCountUp(state.consentRate, ready, 1);
  const cleared = useCountUp(state.clearedUsd30d, ready);
  const selected = state.cases.find((c) => c.id === state.selectedCaseId);

  function onVerify() {
    const ok = verifyTarget(query, uni);
    setToast(ok ? "Cryptographic seal verified" : "Verification failed or blocked");
  }

  function onDossier(caseId: string) {
    const ref = exportDossier(caseId);
    setToast(`Diplomatic dossier ${ref} compiled`);
  }

  return (
    <PageFrame>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 font-audit-mono text-audit-mono text-secondary mb-1">
            <span>Verifier Portal</span>
            <span className="text-outline">/</span>
            <span>Authenticity desk</span>
            <span className="text-outline">/</span>
            <span className="text-on-surface font-medium">Batch &amp; Single Desk</span>
          </nav>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
            Diplomatic &amp; Institutional Verification Desk
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl mt-0.5">
            Instant cryptographic attestation, zero-knowledge attribute verification, and
            verify credentials, government records, and product authenticity marks
            against issuer HSM roots.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              runMerkleAudit();
              setToast("Merkle audit complete");
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded bg-surface-container hover:bg-surface-container-high text-on-surface text-title-sm font-title-sm"
          >
            <Icon name="verified" size={18} className="text-secondary" />
            Run Instant Merkle Audit
          </button>
          <button
            type="button"
            onClick={() => selected && onDossier(selected.id)}
            disabled={!selected}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded bg-surface-container hover:bg-surface-container-high text-on-surface text-title-sm font-title-sm disabled:opacity-40"
          >
            <Icon name="policy" size={18} className="text-on-tertiary-container" />
            Download Diplomatic PDF/A-3
          </button>
          <Link
            href="/verifier/ingestion"
            className="inline-flex items-center gap-2 px-4 py-2 rounded bg-primary-container hover:bg-primary text-on-primary text-title-sm font-title-sm"
          >
            <Icon name="add_task" size={18} />
            New Batch Ingress
          </Link>
        </div>
      </div>

      <AssuranceTape sessionId={state.sessionId} mtlsPeer={state.mtlsPeer} />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="p-4 rounded bg-surface-container-lowest shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-status text-label-status uppercase text-secondary tracking-wider">
              Verified Inquiries (30d)
            </span>
            <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-status text-label-status">
              INSTANT LEDGER
            </span>
          </div>
          <div className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">
            {inquiries}
          </div>
          <p className="font-audit-mono text-audit-mono text-on-surface-variant mt-2">
            +18.4% vs last mo · transcripts &amp; parchments
          </p>
        </div>
        <div className="p-4 rounded bg-surface-container-lowest shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-status text-label-status uppercase text-secondary tracking-wider">
              Consular Quorum &amp; Integrity
            </span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface font-label-status text-label-status">
              FIPS 140-3
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline-xl text-headline-xl text-primary font-bold">
              {openFlags}
            </span>
            <span className="font-title-md text-title-md text-on-surface">Tamper Flags</span>
          </div>
          <Link
            href="/verifier/radar"
            className="font-label-status text-label-status text-secondary hover:text-primary mt-2 inline-flex items-center gap-1"
          >
            Open radar <Icon name="arrow_forward" size={13} />
          </Link>
        </div>
        <div className="p-4 rounded bg-surface-container-lowest shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-status text-label-status uppercase text-secondary tracking-wider">
              Student Consent Grants
            </span>
            <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-status text-label-status">
              BLINDED PII
            </span>
          </div>
          <div className="font-headline-xl text-headline-xl text-primary font-bold">{consent}%</div>
          <p className="font-audit-mono text-audit-mono text-on-surface-variant mt-2">
            {state.activeGrants.toLocaleString()} active · {state.timedOutGrants} timed-out
          </p>
        </div>
        <div className="p-4 rounded bg-surface-container-lowest shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-status text-label-status uppercase text-secondary tracking-wider">
              USD / NAFEM Escrow
            </span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-primary font-label-status text-label-status">
              SETTLED
            </span>
          </div>
          <div className="font-headline-xl text-headline-xl text-primary font-bold">
            ${cleared}
          </div>
          <Link
            href="/verifier/billing"
            className="font-label-status text-label-status text-secondary hover:text-primary mt-2 inline-flex items-center gap-1"
          >
            View settlement manifest <Icon name="arrow_forward" size={13} />
          </Link>
        </div>
      </div>

      <div className="rounded bg-surface-container-lowest shadow-sm p-4">
        <div className="flex flex-col lg:flex-row items-stretch gap-3">
          <div className="flex-1 flex items-center bg-surface-container-low rounded px-3 py-1.5">
            <Icon name="fingerprint" size={20} className="text-secondary mr-2.5" />
            <div className="flex flex-col flex-1 min-w-0">
              <span className="font-label-status text-[10px] text-on-surface-variant uppercase tracking-wider">
                Verification target / nonce token
              </span>
              <input
                className="bg-transparent text-on-surface font-label-code text-label-code focus:outline-none w-full truncate"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="DID, matric, nonce, or hash…"
              />
            </div>
            <button
              type="button"
              aria-label="Copy identifier"
              className="p-1 text-outline hover:text-primary"
              onClick={() => {
                void navigator.clipboard.writeText(query);
                setToast("Copied to clipboard");
              }}
            >
              <Icon name="content_copy" size={16} />
            </button>
          </div>
          <div className="w-full lg:w-72 flex items-center bg-surface-container-low rounded px-3 py-1.5">
            <Icon name="account_balance" size={20} className="text-secondary mr-2" />
            <div className="flex flex-col flex-1 min-w-0">
              <span className="font-label-status text-[10px] text-on-surface-variant uppercase tracking-wider">
                Sovereign issuing HSM
              </span>
              <select
                className="bg-transparent text-on-surface font-title-sm text-title-sm focus:outline-none cursor-pointer"
                value={uni}
                onChange={(e) => setUni(e.target.value)}
              >
                {state.universities.map((u) => (
                  <option key={u.code} value={u.code}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onVerify}
              className="h-full px-5 py-2.5 rounded bg-primary-container hover:bg-primary text-on-primary font-title-sm text-title-sm inline-flex items-center gap-2"
            >
              <Icon name="verified_user" size={18} />
              Verify Cryptographic Seal
            </button>
            <button
              type="button"
              onClick={onVerify}
              className="h-full px-3.5 py-2.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-title-sm text-title-sm inline-flex items-center gap-1.5"
            >
              <Icon name="qr_code_scanner" size={18} />
              Scan / Ingest
            </button>
          </div>
        </div>

        {state.lastAttestation && (
          <div className="mt-3.5 p-3 rounded bg-surface-container flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                <Icon name="check_circle" size={18} className="text-on-secondary-container" filled />
              </div>
              <div>
                <div className="font-title-sm text-title-sm text-on-surface flex flex-wrap items-center gap-2">
                  <span>Instant Cryptographic Attestation Succeeded:</span>
                  <span className="font-bold text-primary">
                    {state.lastAttestation.candidateName}
                  </span>
                </div>
                <div className="font-audit-mono text-audit-mono text-on-surface-variant mt-0.5 flex flex-wrap gap-2">
                  <span>{state.lastAttestation.detail}</span>
                  <span>•</span>
                  <span>
                    Poseidon-2 Root:{" "}
                    <span className="font-semibold text-on-surface">
                      {state.lastAttestation.merkleRoot}
                    </span>
                  </span>
                  <span>•</span>
                  <span>Token: {state.lastAttestation.ingressToken}</span>
                </div>
              </div>
            </div>
            <Link
              href="/verifier/proofs"
              className="inline-flex items-center gap-1 font-label-status text-label-status px-2.5 py-1 rounded bg-secondary-container text-on-secondary-container"
            >
              Inspect proof <Icon name="open_in_new" size={16} />
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8 rounded bg-surface-container-lowest shadow-sm overflow-hidden">
          <div className="p-4 bg-surface-container-low flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Icon name="dynamic_feed" size={20} className="text-primary" />
                <h2 className="font-title-md text-title-md text-primary">
                  Consular Background Check &amp; Ingress Queue
                </h2>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Live attestation stream across education, government, and product rails.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                reset();
                setToast("Demo state reset");
              }}
              className="text-[11px] uppercase tracking-wide text-on-surface-variant hover:text-primary"
            >
              Reset demo
            </button>
          </div>
          <div className="flex items-center gap-1 px-4 py-2 bg-surface-container-low overflow-x-auto">
            {(
              [
                ["ALL", `All (${counts.ALL})`],
                ["VISA", `Visa (${counts.VISA})`],
                ["WES", `WES/ENIC (${counts.WES})`],
                ["CORPORATE", `Corporate (${counts.CORPORATE})`],
                ["PRODUCT", `Products (${counts.PRODUCT})`],
                ["GOVERNMENT", `Government (${counts.GOVERNMENT})`],
                ["EXCEPTION", `Exceptions (${counts.EXCEPTION})`],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`px-3 py-1.5 rounded font-title-sm text-title-sm whitespace-nowrap ${
                  filter === key
                    ? "bg-primary-container text-on-primary"
                    : "hover:bg-surface-container text-on-surface-variant"
                } ${key === "EXCEPTION" ? "text-error" : ""}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low font-audit-mono text-audit-mono text-on-surface-variant uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Candidate &amp; Matric</th>
                  <th className="py-3 px-4">Artifact</th>
                  <th className="py-3 px-4">Agency</th>
                  <th className="py-3 px-4">Consent</th>
                  <th className="py-3 px-4">Crypto</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {rows.map((c) => (
                  <tr
                    key={c.id}
                    className={`hover:bg-surface-container transition-colors ${
                      c.focused ? "bg-surface-container-high/40" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded bg-primary-container text-on-primary flex items-center justify-center font-bold text-title-sm shrink-0">
                          {c.initials}
                        </div>
                        <div>
                          <div className="font-title-sm text-title-sm text-primary flex items-center gap-1.5">
                            {c.candidateName}
                            {c.attested && (
                              <Icon name="verified" size={16} className="text-secondary" filled />
                            )}
                          </div>
                          <div className="font-audit-mono text-audit-mono text-on-surface-variant">
                            Matric: {c.matricNumber} · {c.universityCode}
                          </div>
                          <div className="font-body-sm text-body-sm text-secondary font-medium">
                            {c.degreeLine}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-title-sm text-title-sm text-on-surface">{c.artifact}</div>
                      <div className="font-audit-mono text-audit-mono text-on-surface-variant">
                        {c.artifactFormat}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-title-sm text-title-sm text-on-surface">{c.agency}</div>
                      <div className="font-audit-mono text-audit-mono text-on-surface-variant">
                        {c.purposeRef}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <ConsentChip status={c.consentStatus} />
                    </td>
                    <td className="py-3.5 px-4">
                      <CryptoChip status={c.cryptoStatus} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          title="Inspect"
                          onClick={() => selectCase(c.id)}
                          className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant"
                        >
                          <Icon name="visibility" size={18} />
                        </button>
                        <button
                          type="button"
                          title="Export dossier"
                          onClick={() => onDossier(c.id)}
                          className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant"
                        >
                          <Icon name="picture_as_pdf" size={18} />
                        </button>
                        {c.cryptoStatus === "BLOCKED" && (
                          <button
                            type="button"
                            title="Request re-consent"
                            onClick={() => {
                              requestReconsent(c.id);
                              setToast("Re-consent requested");
                            }}
                            className="p-1.5 rounded hover:bg-surface-container-high text-error"
                          >
                            <Icon name="key" size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 font-audit-mono text-audit-mono text-on-surface-variant border-t border-surface-container">
            Auto-polling HSM every 5s · last sync {formatWhen(state.lastAttestation?.at)}
          </div>
        </div>

        <div className="xl:col-span-4 flex flex-col gap-4">
          <div className="rounded bg-surface-container-lowest shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="account_tree" size={20} className="text-primary" />
              <h3 className="font-title-md text-title-md text-primary">Live Merkle Preview</h3>
            </div>
            {selected ? (
              <div className="space-y-2 font-audit-mono text-audit-mono text-on-surface-variant">
                <p>
                  HSM ·{" "}
                  <span className="text-on-surface">
                    {state.universities.find((u) => u.code === selected.universityCode)?.hsmLabel}
                  </span>
                </p>
                <p>
                  Root · <span className="text-on-surface">{selected.merkleRoot}</span>
                </p>
                <p>
                  Leaf · <span className="text-on-surface">{selected.did}</span>
                </p>
                <CryptoChip status={selected.cryptoStatus} />
                <Link
                  href="/verifier/proofs"
                  className="inline-flex items-center gap-1 mt-2 font-label-status text-label-status text-secondary hover:text-primary"
                >
                  Open full inspector <Icon name="arrow_forward" size={13} />
                </Link>
              </div>
            ) : (
              <p className="text-on-surface-variant text-sm">Select a case to inspect.</p>
            )}
          </div>
          <div className="rounded bg-surface-container-lowest shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="payments" size={20} className="text-primary" />
              <h3 className="font-title-md text-title-md text-primary">Escrow</h3>
            </div>
            <p className="font-headline-md text-headline-md text-primary font-bold">
              ${state.escrowBalanceUsd.toLocaleString("en-US")}
            </p>
            <p className="font-audit-mono text-audit-mono text-on-surface-variant mt-1">
              ${state.tariffUsd.toFixed(2)} / verify · {state.univSharePct}% to university
            </p>
            <Link
              href="/verifier/billing"
              className="inline-flex items-center gap-1 mt-2 font-label-status text-label-status text-secondary hover:text-primary"
            >
              Top up &amp; settle <Icon name="arrow_forward" size={13} />
            </Link>
          </div>
          <div className="rounded bg-surface-container-lowest shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="visibility_off" size={20} className="text-primary" />
              <h3 className="font-title-md text-title-md text-primary">Privacy Radar</h3>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              NDPA Sec 37 selective disclosure — blinded NIN and address by default.
            </p>
            <Link
              href="/verifier/consents"
              className="inline-flex items-center gap-1 mt-2 font-label-status text-label-status text-secondary hover:text-primary"
            >
              Manage grants <Icon name="arrow_forward" size={13} />
            </Link>
          </div>
        </div>
      </div>

      <Toast message={toast} onClose={() => setToast(null)} />
    </PageFrame>
  );
}
