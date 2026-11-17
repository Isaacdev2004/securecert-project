"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageIntro } from "@/components/marketing/PageIntro";

type Credential = {
  did?: string;
  holder?: string;
  title?: string;
  issuer?: string;
  issuedAt?: string;
  matric?: string;
};

export default function VerifyResultPage() {
  const [credential, setCredential] = useState<Credential | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("legitscan.lastVerify");
      if (raw) setCredential(JSON.parse(raw) as Credential);
    } catch {
      setCredential(null);
    }
  }, []);

  return (
    <>
      <PageIntro
        eyebrow="Verification result · Evidence pack"
        title={credential ? "Authentic and ledger-valid." : "No verification in this session."}
        lede={
          credential
            ? "This record matched an anchored inclusion proof. Share the evidence pack with employers, agencies, or customers — or revoke access from the holder vault when needed."
            : "Run a public lookup first. You can verify credentials, official documents, or product marks from the verify portal."
        }
        actions={
          credential
            ? [
                { href: "/verify", label: "Verify another", variant: "secondary" },
                { href: "/onboarding", label: "Issue with LegitScan →", variant: "text" },
              ]
            : [{ href: "/verify", label: "Go to public verify" }]
        }
      />

      <section className="bg-gray-50">
        <div className="mx-auto max-w-[560px] px-5 md:px-8 py-14">
          {credential && (
            <dl className="rounded-2xl bg-white border border-gray-100 shadow-sm divide-y divide-gray-100">
              {[
                ["Holder", credential.holder],
                ["Credential", credential.title],
                ["Issuer", credential.issuer],
                ["Matric", credential.matric],
                ["DID", credential.did],
                ["Issued", credential.issuedAt],
              ].map(([label, value]) => (
                <div key={String(label)} className="px-6 py-4 flex flex-col sm:flex-row sm:gap-8">
                  <dt className="text-[12px] font-bold uppercase tracking-wider text-gray-400 sm:w-28">
                    {label}
                  </dt>
                  <dd className="mt-1 sm:mt-0 text-[15px] font-semibold text-gray-900">
                    {value || "—"}
                  </dd>
                </div>
              ))}
            </dl>
          )}
          <Link href="/verify" className="marketing-btn-secondary mt-8">
            Verify another
          </Link>
        </div>
      </section>
    </>
  );
}
