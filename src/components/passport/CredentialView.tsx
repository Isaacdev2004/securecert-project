"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/marketing/Icon";
import { VerificationSymbol } from "@/components/authenticity/VerificationSymbol";
import { EDUCATION_LEVELS } from "@/lib/authenticity/symbols";
import { usePassportStore } from "@/lib/passport/store";
import { credentialById } from "@/lib/passport/demo-data";
import { PageFrame, StatusPill, Toast, formatWhen } from "./ui";

function CredentialInner() {
  const params = useSearchParams();
  const id = params.get("id") || "";
  const { ready, state } = usePassportStore();
  const [toast, setToast] = useState<string | null>(null);

  const credential = useMemo(
    () => (ready ? credentialById(state, id) : undefined),
    [ready, state, id],
  );

  if (!ready) {
    return (
      <PageFrame>
        <p className="py-16 text-center text-on-surface-variant">Loading…</p>
      </PageFrame>
    );
  }

  if (!credential) {
    return (
      <PageFrame>
        <Link
          href="/passport/vault"
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#0f766e]"
        >
          <Icon name="arrow_back" size={16} />
          Vault
        </Link>
        <p className="mt-8 text-center text-on-surface-variant">
          Credential not found in passport.
        </p>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      <Link
        href="/passport/vault"
        className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#0f766e]"
      >
        <Icon name="arrow_back" size={16} />
        Vault
      </Link>

      <div className="rounded-2xl bg-white border border-outline-variant/40 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          <div className="shrink-0 mx-auto sm:mx-0">
            {credential.rail === "GOVERNMENT" ? (
              <VerificationSymbol
                family="GOVERNMENT"
                value={credential.did}
                size="md"
                showLegend
              />
            ) : (
              <VerificationSymbol
                family="EDUCATION"
                level={credential.educationLevel ?? "UNIVERSITY"}
                value={credential.did}
                size="md"
                showLegend
              />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <StatusPill status={credential.status} />
            <h1 className="mt-3 text-[22px] font-extrabold leading-tight">
              {credential.title}
            </h1>
            <p className="mt-1 text-[14px] font-semibold text-[#0f766e]">
              {credential.classification}
            </p>
            {credential.rail === "EDUCATION" && credential.educationLevel && (
              <p className="mt-2 text-[12px] font-semibold" style={{ color: EDUCATION_LEVELS[credential.educationLevel].markColor }}>
                {EDUCATION_LEVELS[credential.educationLevel].label} · unique QR mark
              </p>
            )}
            <dl className="mt-5 space-y-2.5 text-[13px]">
              {[
                ["Issuer", credential.issuer],
                ["Matric / ID", credential.matricNumber],
                ["Issued", formatWhen(credential.issuedAt)],
                ["Merkle", credential.merkleRoot],
                ["DID", credential.did],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-on-surface-variant">{k}</dt>
                  <dd className="font-semibold text-right break-all max-w-[65%]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
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
          className="h-11 rounded-xl border border-outline-variant/50 bg-white text-[13px] font-semibold inline-flex items-center justify-center gap-1.5"
        >
          <Icon name="content_copy" size={16} />
          Copy DID
        </button>
        <Link
          href={`/passport/share?id=${credential.id}`}
          className="h-11 rounded-xl bg-[#0f766e] text-white text-[13px] font-semibold inline-flex items-center justify-center gap-1.5"
        >
          <Icon name="qr_code_scanner" size={16} />
          Share
        </Link>
      </div>

      <Link
        href="/verify"
        className="text-center text-[13px] font-semibold text-[#0f766e]"
      >
        Open public verify →
      </Link>

      <Toast message={toast} onClose={() => setToast(null)} />
    </PageFrame>
  );
}

export function CredentialView() {
  return (
    <Suspense
      fallback={
        <PageFrame>
          <p className="py-16 text-center text-on-surface-variant">Loading…</p>
        </PageFrame>
      }
    >
      <CredentialInner />
    </Suspense>
  );
}
