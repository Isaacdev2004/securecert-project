"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageIntro } from "@/components/marketing/PageIntro";
import { VerificationSymbol } from "@/components/authenticity/VerificationSymbol";
import {
  EDUCATION_LEVELS,
  educationLevelFromUnknown,
  type EducationLevel,
} from "@/lib/authenticity/symbols";

type Credential = {
  did?: string;
  holder?: string;
  title?: string;
  issuer?: string;
  issuedAt?: string;
  matric?: string;
  family?: "EDUCATION" | "GOVERNMENT";
  educationLevel?: EducationLevel | string | null;
  result?: string;
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

  const level =
    educationLevelFromUnknown(
      typeof credential?.educationLevel === "string"
        ? credential.educationLevel
        : null,
    ) ?? "UNIVERSITY";
  const family =
    credential?.family === "GOVERNMENT"
      ? "GOVERNMENT"
      : ("EDUCATION" as const);

  return (
    <>
      <PageIntro
        eyebrow="Verification result · Unique QR symbol"
        title={
          credential
            ? "Authentic — verification symbol matched."
            : "No verification in this session."
        }
        lede={
          credential
            ? "This certificate’s unique QR resolved against the ledger. Education levels show a coloured mark (orange / blue / green / violet). Government documents use a separate official seal."
            : "Scan or enter a certificate DID / reference first. Primary, secondary, university, professional, and government documents each carry a distinctive verification symbol."
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
        <div className="mx-auto max-w-[640px] px-5 md:px-8 py-14">
          {credential && (
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 space-y-6">
              <div className="flex justify-center">
                {family === "GOVERNMENT" ? (
                  <VerificationSymbol
                    family="GOVERNMENT"
                    value={credential.did || credential.matric || "gov"}
                    size="lg"
                    showLegend
                  />
                ) : (
                  <VerificationSymbol
                    family="EDUCATION"
                    level={level}
                    value={credential.did || credential.matric || "edu"}
                    size="lg"
                    showLegend
                  />
                )}
              </div>

              {family === "EDUCATION" && (
                <p
                  className="text-center text-[13px] font-semibold"
                  style={{ color: EDUCATION_LEVELS[level].markColor }}
                >
                  {EDUCATION_LEVELS[level].label} certificate · mark colour confirms
                  the segment
                </p>
              )}

              <dl className="divide-y divide-gray-100 border-t border-gray-100">
                {[
                  ["Holder", credential.holder],
                  ["Credential", credential.title],
                  ["Issuer", credential.issuer],
                  ["Reference", credential.matric],
                  ["DID", credential.did],
                  ["Issued", credential.issuedAt],
                  [
                    "Symbol",
                    family === "GOVERNMENT"
                      ? "Government official seal"
                      : `${EDUCATION_LEVELS[level].label} · unique QR`,
                  ],
                ].map(([label, value]) => (
                  <div
                    key={String(label)}
                    className="px-1 py-4 flex flex-col sm:flex-row sm:gap-8"
                  >
                    <dt className="text-[12px] font-bold uppercase tracking-wider text-gray-400 sm:w-28">
                      {label}
                    </dt>
                    <dd className="mt-1 sm:mt-0 text-[15px] font-semibold text-gray-900 break-all">
                      {value || "—"}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          <Link href="/verify" className="marketing-btn-secondary mt-8">
            Verify another
          </Link>
        </div>
      </section>
    </>
  );
}
