"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/marketing/Icon";
import { useInstitutionStore } from "@/lib/institution/store";
import { recipientFor } from "@/lib/institution/demo-data";
import { PageFrame, StatusChip, Toast, formatWhen } from "./ui";

export function RevocationsView() {
  const { ready, state, revokeCredential } = useInstitutionStore();
  const [toast, setToast] = useState<string | null>(null);

  const revoked = useMemo(
    () =>
      state.credentials
        .filter((c) => c.status === "REVOKED")
        .map((c) => ({
          credential: c,
          recipient: recipientFor(state, c.recipientId),
        })),
    [state],
  );

  const active = useMemo(
    () =>
      state.credentials.filter(
        (c) => c.status === "ISSUED" || c.status === "PENDING_SIGNATURE",
      ),
    [state.credentials],
  );

  const audit = useMemo(
    () => state.stream.filter((e) => e.kind === "REVOKE" || e.kind === "ISSUE"),
    [state.stream],
  );

  if (!ready) {
    return (
      <PageFrame>
        <p className="py-20 text-center text-on-surface-variant">Loading…</p>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      <div>
        <h1 className="text-[28px] font-bold tracking-tight">
          Revocations &amp; audit
        </h1>
        <p className="text-[14px] text-on-surface-variant mt-1">
          {revoked.length} revoked · {active.length} still active in demo ledger
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <section className="rounded-xl bg-white border border-outline-variant/30 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-outline-variant/30">
            <h2 className="text-[15px] font-bold">Revocation registry</h2>
          </div>
          {revoked.length === 0 ? (
            <p className="p-5 text-[13px] text-on-surface-variant">
              No revocations yet. Revoke from Credentials or Dashboard.
            </p>
          ) : (
            <ul className="divide-y divide-outline-variant/20">
              {revoked.map(({ credential, recipient }) => (
                <li key={credential.id} className="px-5 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[14px]">
                        {recipient?.fullName ?? "Unknown"}
                      </p>
                      <p className="text-[12px] text-on-surface-variant">
                        {credential.title}
                      </p>
                      <p className="mt-1 text-[11px] font-audit-mono text-secondary">
                        {credential.did}
                      </p>
                      <p className="mt-1 text-[12px] text-red-700">
                        {credential.revokeReason} ·{" "}
                        {formatWhen(credential.revokedAt)}
                      </p>
                    </div>
                    <StatusChip status="REVOKED" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl bg-white border border-outline-variant/30 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-outline-variant/30 flex items-center justify-between">
            <h2 className="text-[15px] font-bold">Quick revoke</h2>
            <Icon name="gavel" size={18} className="text-red-600" />
          </div>
          <ul className="divide-y divide-outline-variant/20 max-h-[420px] overflow-y-auto">
            {active.map((c) => {
              const r = recipientFor(state, c.recipientId);
              return (
                <li
                  key={c.id}
                  className="px-5 py-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-[13px] truncate">
                      {r?.fullName}
                    </p>
                    <p className="text-[12px] text-on-surface-variant truncate">
                      {c.title}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Link
                      href={`/institution/credentials/${c.id}`}
                      className="h-8 px-2 rounded-lg text-[12px] font-bold text-[#0f766e]"
                    >
                      Open
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm("Revoke this credential?")) {
                          revokeCredential(c.id);
                          setToast("Credential revoked");
                        }
                      }}
                      className="h-8 px-2 rounded-lg bg-red-50 text-red-700 text-[12px] font-bold"
                    >
                      Revoke
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <section className="rounded-xl bg-[#0b1c30] text-white p-5">
        <h2 className="text-[15px] font-bold">Issuance / revoke stream</h2>
        <ul className="mt-3 space-y-2 max-h-48 overflow-y-auto">
          {audit.slice(0, 15).map((e) => (
            <li key={e.id} className="text-[12px]">
              <span className="text-white/45 font-audit-mono text-[10px]">
                {formatWhen(e.at)} · {e.kind}
              </span>
              <span className="block text-white/85">{e.message}</span>
            </li>
          ))}
        </ul>
      </section>

      <Toast message={toast} onClose={() => setToast(null)} />
    </PageFrame>
  );
}
