"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/marketing/Icon";
import { useInstitutionStore } from "@/lib/institution/store";
import { recipientFor } from "@/lib/institution/demo-data";
import type { CredentialStatus } from "@/lib/institution/types";
import { PageFrame, StatusChip, Toast, formatWhen } from "./ui";

export function CredentialsView() {
  const { ready, state, revokeCredential } = useInstitutionStore();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CredentialStatus | "ALL">(
    "ALL",
  );
  const [toast, setToast] = useState<string | null>(null);

  const rows = useMemo(() => {
    return state.credentials
      .map((c) => ({
        credential: c,
        recipient: recipientFor(state, c.recipientId),
      }))
      .filter(({ credential, recipient }) => {
        if (statusFilter !== "ALL" && credential.status !== statusFilter) {
          return false;
        }
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
          credential.title.toLowerCase().includes(q) ||
          credential.did.toLowerCase().includes(q) ||
          credential.id.toLowerCase().includes(q) ||
          recipient?.fullName.toLowerCase().includes(q) ||
          recipient?.matricNumber.toLowerCase().includes(q)
        );
      });
  }, [state, query, statusFilter]);

  if (!ready) {
    return (
      <PageFrame>
        <p className="py-20 text-center text-on-surface-variant">Loading…</p>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-on-surface">
            Credentials registry
          </h1>
          <p className="text-[14px] text-on-surface-variant mt-1">
            {state.credentials.length} records in the {state.tenantName} demo
            ledger
          </p>
        </div>
        <Link
          href="/institution/issue"
          className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-[#0f766e] px-4 text-[14px] font-semibold text-white hover:bg-[#0d9488]"
        >
          <Icon name="add" size={18} />
          Issue credential
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative">
          <Icon
            name="search"
            size={16}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-outline"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search registry…"
            className="h-10 w-64 rounded-xl border border-outline-variant/50 bg-white pl-8 pr-3 text-[13px] outline-none focus:border-[#0f766e]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as CredentialStatus | "ALL")
          }
          className="h-10 rounded-xl border border-outline-variant/50 bg-white px-3 text-[13px]"
        >
          <option value="ALL">All statuses</option>
          <option value="ISSUED">Verified</option>
          <option value="PENDING_SIGNATURE">Pending</option>
          <option value="REVOKED">Revoked</option>
          <option value="DRAFT">Draft</option>
        </select>
      </div>

      <div className="rounded-xl bg-white border border-outline-variant/30 shadow-sm overflow-hidden">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-surface-container-low/80 text-[11px] uppercase tracking-wide text-secondary">
            <tr>
              <th className="px-5 py-3 font-bold">ID</th>
              <th className="px-3 py-3 font-bold">Recipient</th>
              <th className="px-3 py-3 font-bold">Title</th>
              <th className="px-3 py-3 font-bold">Status</th>
              <th className="px-3 py-3 font-bold">Issued</th>
              <th className="px-5 py-3 font-bold text-right">Open</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ credential, recipient }) => (
              <tr
                key={credential.id}
                className="border-t border-outline-variant/20 hover:bg-surface-container-low/40"
              >
                <td className="px-5 py-3 font-audit-mono text-[11px] text-secondary">
                  {credential.id}
                </td>
                <td className="px-3 py-3 font-semibold">
                  {recipient?.fullName ?? "—"}
                </td>
                <td className="px-3 py-3 max-w-[240px] truncate">
                  {credential.title}
                </td>
                <td className="px-3 py-3">
                  <StatusChip status={credential.status} />
                </td>
                <td className="px-3 py-3 text-on-surface-variant whitespace-nowrap">
                  {formatWhen(credential.issuedAt)}
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="inline-flex gap-1">
                    <Link
                      href={`/institution/credentials/${credential.id}`}
                      className="h-8 px-3 rounded-lg bg-[#f0fdfa] text-[#0f766e] text-[12px] font-bold inline-flex items-center"
                    >
                      Inspect
                    </Link>
                    {credential.status !== "REVOKED" && (
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            window.confirm("Revoke this credential in demo?")
                          ) {
                            revokeCredential(credential.id);
                            setToast("Credential revoked");
                          }
                        }}
                        className="h-8 px-2 rounded-lg text-red-600 hover:bg-red-50"
                      >
                        <Icon name="gavel" size={16} />
                      </button>
                    )}
                  </div>
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
