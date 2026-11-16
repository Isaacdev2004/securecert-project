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
      const raw = sessionStorage.getItem("securecert.lastVerify");
      if (raw) setCredential(JSON.parse(raw) as Credential);
    } catch {
      setCredential(null);
    }
  }, []);

  return (
    <>
      <PageIntro
        eyebrow="Verification result"
        title={credential ? "Authentic & valid." : "No result in session."}
        lede={
          credential
            ? "This credential matched an anchored ledger proof."
            : "Run a lookup from the verify portal first."
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
