"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Icon } from "@/components/marketing/Icon";
import { VerificationSymbol } from "@/components/authenticity/VerificationSymbol";
import { EDUCATION_LEVELS } from "@/lib/authenticity/symbols";
import { useInstitutionStore } from "@/lib/institution/store";
import { credentialWithRecipient } from "@/lib/institution/demo-data";
import { PageFrame, StatusChip, Toast, formatWhen } from "./ui";

export function CredentialDetailView() {
  const params = useParams();
  const id = String(params?.id || "");
  const { ready, state, revokeCredential } = useInstitutionStore();
  const [toast, setToast] = useState<string | null>(null);

  const record = useMemo(
    () => (ready ? credentialWithRecipient(state, id) : null),
    [ready, state, id],
  );

  if (!ready) {
    return (
      <PageFrame>
        <p className="py-20 text-center text-on-surface-variant">Loading…</p>
      </PageFrame>
    );
  }

  if (!record) {
    return (
      <PageFrame>
        <Link
          href="/institution/credentials"
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#0f766e]"
        >
          <Icon name="arrow_back" size={16} />
          Back to registry
        </Link>
        <div className="mt-8 rounded-xl border border-dashed border-outline-variant p-10 text-center">
          <p className="text-[16px] font-bold text-on-surface">
            Credential not found
          </p>
          <p className="mt-2 text-[14px] text-on-surface-variant">
            No demo record for <span className="font-audit-mono">{id}</span>
          </p>
        </div>
      </PageFrame>
    );
  }

  const { credential, recipient } = record;

  return (
    <PageFrame>
      <Link
        href="/institution/credentials"
        className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#0f766e]"
      >
        <Icon name="arrow_back" size={16} />
        Credentials
      </Link>

      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusChip status={credential.status} />
            <span className="font-audit-mono text-[11px] text-secondary">
              {credential.id}
            </span>
          </div>
          <h1 className="mt-2 text-[26px] font-bold tracking-tight text-on-surface max-w-3xl">
            {credential.title}
          </h1>
          <p className="mt-1 text-[14px] text-[#0f766e] font-semibold">
            {credential.classification || "—"}
          </p>
          {credential.rail === "EDUCATION" && credential.educationLevel && (
            <p
              className="mt-2 text-[13px] font-semibold"
              style={{ color: EDUCATION_LEVELS[credential.educationLevel].markColor }}
            >
              {EDUCATION_LEVELS[credential.educationLevel].label} certificate ·
              unique QR verification mark
            </p>
          )}
          {credential.rail === "GOVERNMENT" && (
            <p className="mt-2 text-[13px] font-semibold text-[#c9a227]">
              Government document · official seal QR
            </p>
          )}
        </div>
        <div className="shrink-0">
          {credential.rail === "GOVERNMENT" ? (
            <VerificationSymbol
              family="GOVERNMENT"
              value={credential.did}
              size="md"
              showLegend
            />
          ) : credential.rail === "EDUCATION" ? (
            <VerificationSymbol
              family="EDUCATION"
              level={credential.educationLevel ?? "UNIVERSITY"}
              value={credential.did}
              size="md"
              showLegend
            />
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(credential.did);
                setToast("DID copied");
              } catch {
                setToast(credential.did);
              }
            }}
            className="h-10 px-3 rounded-xl border border-outline-variant/50 bg-white text-[13px] font-semibold inline-flex items-center gap-1.5"
          >
            <Icon name="content_copy" size={16} />
            Copy DID
          </button>
          {credential.status !== "REVOKED" && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Revoke this credential?")) {
                  revokeCredential(credential.id);
                  setToast("Credential revoked");
                }
              }}
              className="h-10 px-3 rounded-xl bg-red-600 text-white text-[13px] font-semibold inline-flex items-center gap-1.5"
            >
              <Icon name="gavel" size={16} />
              Revoke
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <section className="rounded-xl bg-white border border-outline-variant/30 p-5 shadow-sm space-y-3">
          <h2 className="text-[15px] font-bold">Recipient</h2>
          <dl className="space-y-2 text-[14px]">
            <div className="flex justify-between gap-3">
              <dt className="text-on-surface-variant">Name</dt>
              <dd className="font-semibold">{recipient?.fullName ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-on-surface-variant">Matric</dt>
              <dd className="font-audit-mono text-[12px]">
                {recipient?.matricNumber ?? "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-on-surface-variant">Email</dt>
              <dd>{recipient?.email ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-on-surface-variant">Program</dt>
              <dd className="text-right max-w-[60%]">
                {recipient?.program ?? "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-on-surface-variant">Grad year</dt>
              <dd>{recipient?.graduationYear ?? "—"}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-xl bg-white border border-outline-variant/30 p-5 shadow-sm space-y-3">
          <h2 className="text-[15px] font-bold">Cryptographic binding</h2>
          <dl className="space-y-2 text-[14px]">
            <div className="flex justify-between gap-3">
              <dt className="text-on-surface-variant">DID</dt>
              <dd className="font-audit-mono text-[11px] text-right break-all max-w-[65%]">
                {credential.did}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-on-surface-variant">Merkle root</dt>
              <dd className="font-audit-mono text-[12px]">
                {credential.merkleRoot}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-on-surface-variant">Issued</dt>
              <dd>{formatWhen(credential.issuedAt)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-on-surface-variant">Revoked</dt>
              <dd>{formatWhen(credential.revokedAt)}</dd>
            </div>
            {credential.revokeReason && (
              <div className="flex justify-between gap-3">
                <dt className="text-on-surface-variant">Reason</dt>
                <dd className="text-right max-w-[65%]">
                  {credential.revokeReason}
                </dd>
              </div>
            )}
          </dl>
        </section>
      </div>

      <div className="rounded-xl bg-[#f0fdfa] border border-teal-100 p-5 flex flex-wrap gap-3">
        <Link
          href="/verify"
          className="h-10 px-4 rounded-xl bg-[#0f766e] text-white text-[13px] font-semibold inline-flex items-center"
        >
          Open public verify
        </Link>
        <Link
          href="/institution/dashboard"
          className="h-10 px-4 rounded-xl bg-white border border-outline-variant/50 text-[13px] font-semibold inline-flex items-center"
        >
          Back to dashboard
        </Link>
      </div>

      <Toast message={toast} onClose={() => setToast(null)} />
    </PageFrame>
  );
}
