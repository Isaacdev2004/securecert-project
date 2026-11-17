"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/marketing/Icon";
import { VerificationSymbol } from "@/components/authenticity/VerificationSymbol";
import {
  EDUCATION_LEVEL_LIST,
  EDUCATION_LEVELS,
  type EducationLevel,
} from "@/lib/authenticity/symbols";
import { useInstitutionStore } from "@/lib/institution/store";
import type { AssetRail } from "@/lib/institution/types";
import { PageFrame, Toast } from "./ui";

const STEPS = ["Recipient", "Credential", "Review"] as const;

export function IssueView() {
  const router = useRouter();
  const { issueCredential, ready } = useInstitutionStore();
  const [step, setStep] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    matricNumber: "",
    program: "",
    graduationYear: 2026,
    title: "",
    classification: "First Class Honours",
    rail: "EDUCATION" as AssetRail,
    educationLevel: "UNIVERSITY" as EducationLevel,
  });

  const levelMeta = EDUCATION_LEVELS[form.educationLevel];

  const previewValue = useMemo(
    () =>
      form.matricNumber
        ? `did:legitscan:preview:${form.matricNumber}`
        : `did:legitscan:preview:${form.educationLevel.toLowerCase()}`,
    [form.matricNumber, form.educationLevel],
  );

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function next(e?: FormEvent) {
    e?.preventDefault();
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  }

  function back() {
    setStep((s) => Math.max(0, s - 1));
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const id = issueCredential({
      fullName: form.fullName,
      email: form.email,
      matricNumber: form.matricNumber,
      program: form.program || form.title,
      graduationYear: Number(form.graduationYear) || new Date().getFullYear(),
      title: form.title || form.program || levelMeta.exampleTitle,
      classification: form.classification,
      rail: form.rail,
      educationLevel: form.rail === "EDUCATION" ? form.educationLevel : null,
    });
    setToast(
      form.rail === "GOVERNMENT"
        ? "Government document sealed with official QR seal"
        : `${levelMeta.shortLabel} certificate sealed with unique QR mark`,
    );
    setTimeout(() => {
      router.push(`/institution/credentials/${id}`);
    }, 600);
  }

  if (!ready) {
    return (
      <PageFrame>
        <p className="py-20 text-center text-on-surface-variant">Loading…</p>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <Link
            href="/institution/dashboard"
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#0f766e]"
          >
            <Icon name="arrow_back" size={16} />
            Dashboard
          </Link>
          <h1 className="mt-2 text-[28px] font-bold tracking-tight text-on-surface">
            Issue authenticated certificate
          </h1>
          <p className="text-[14px] text-on-surface-variant max-w-xl">
            Every record gets a unique QR verification symbol. Education levels
            use a coloured mark (orange / blue / green / violet). Government
            documents use a separate official seal.
          </p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {STEPS.map((label, i) => (
          <div
            key={label}
            className={`px-3 py-1.5 rounded-full text-[12px] font-bold ${
              i === step
                ? "bg-[#0f766e] text-white"
                : i < step
                  ? "bg-[#ccfbf1] text-[#0f766e]"
                  : "bg-surface-container-low text-on-surface-variant"
            }`}
          >
            {i + 1}. {label}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_240px] gap-6 items-start">
        <form
          onSubmit={step === 2 ? submit : next}
          className="rounded-xl bg-white border border-outline-variant/30 shadow-sm p-6 max-w-2xl space-y-4"
        >
          {step === 0 && (
            <>
              <label className="block">
                <span className="text-[12px] font-bold">Full name</span>
                <input
                  required
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  className="mt-1.5 w-full h-11 rounded-xl border border-outline-variant/60 px-3 outline-none focus:border-[#0f766e]"
                />
              </label>
              <label className="block">
                <span className="text-[12px] font-bold">Email</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="mt-1.5 w-full h-11 rounded-xl border border-outline-variant/60 px-3 outline-none focus:border-[#0f766e]"
                />
              </label>
              <label className="block">
                <span className="text-[12px] font-bold">
                  Reference ID (matric / candidate / file no.)
                </span>
                <input
                  required
                  value={form.matricNumber}
                  onChange={(e) => update("matricNumber", e.target.value)}
                  className="mt-1.5 w-full h-11 rounded-xl border border-outline-variant/60 px-3 outline-none focus:border-[#0f766e]"
                />
              </label>
              <label className="block">
                <span className="text-[12px] font-bold">Year</span>
                <input
                  required
                  type="number"
                  value={form.graduationYear}
                  onChange={(e) =>
                    update("graduationYear", Number(e.target.value))
                  }
                  className="mt-1.5 w-full h-11 rounded-xl border border-outline-variant/60 px-3 outline-none focus:border-[#0f766e]"
                />
              </label>
            </>
          )}

          {step === 1 && (
            <>
              <div>
                <p className="text-[12px] font-bold mb-2">Document family</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {(
                    [
                      ["EDUCATION", "Education certificate"],
                      ["GOVERNMENT", "Government document"],
                    ] as const
                  ).map(([rail, label]) => (
                    <button
                      key={rail}
                      type="button"
                      onClick={() => update("rail", rail)}
                      className={`rounded-xl border px-3 py-3 text-left text-[13px] font-semibold transition-colors ${
                        form.rail === rail
                          ? "border-[#0f766e] bg-[#f0fdfa] text-[#0f766e]"
                          : "border-outline-variant/50 hover:bg-gray-50"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {form.rail === "EDUCATION" && (
                <div>
                  <p className="text-[12px] font-bold mb-2">
                    Education level · QR mark colour
                  </p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {EDUCATION_LEVEL_LIST.map((lvl) => (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => {
                          update("educationLevel", lvl.id);
                          if (!form.title) update("title", lvl.exampleTitle);
                        }}
                        className={`rounded-xl border px-3 py-3 text-left transition-colors ${
                          form.educationLevel === lvl.id
                            ? "border-current bg-white shadow-sm"
                            : "border-outline-variant/50 hover:bg-gray-50"
                        }`}
                        style={
                          form.educationLevel === lvl.id
                            ? { borderColor: lvl.markColor, color: lvl.markColorDark }
                            : undefined
                        }
                      >
                        <span className="flex items-center gap-2 text-[13px] font-bold">
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: lvl.markColor }}
                          />
                          {lvl.label}
                        </span>
                        <span className="mt-1 block text-[11px] font-medium text-gray-500">
                          {lvl.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <label className="block">
                <span className="text-[12px] font-bold">
                  {form.rail === "GOVERNMENT" ? "Document / program" : "Program / award"}
                </span>
                <input
                  required
                  value={form.program}
                  onChange={(e) => update("program", e.target.value)}
                  placeholder={
                    form.rail === "GOVERNMENT"
                      ? "Building Plan Approval"
                      : levelMeta.exampleTitle
                  }
                  className="mt-1.5 w-full h-11 rounded-xl border border-outline-variant/60 px-3 outline-none focus:border-[#0f766e]"
                />
              </label>
              <label className="block">
                <span className="text-[12px] font-bold">Certificate title</span>
                <input
                  required
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  className="mt-1.5 w-full h-11 rounded-xl border border-outline-variant/60 px-3 outline-none focus:border-[#0f766e]"
                />
              </label>
              <label className="block">
                <span className="text-[12px] font-bold">Classification / status</span>
                <input
                  value={form.classification}
                  onChange={(e) => update("classification", e.target.value)}
                  className="mt-1.5 w-full h-11 rounded-xl border border-outline-variant/60 px-3 outline-none focus:border-[#0f766e]"
                />
              </label>
            </>
          )}

          {step === 2 && (
            <div className="rounded-xl bg-surface-container-low p-4 space-y-2 text-[14px]">
              <p>
                <span className="text-on-surface-variant">Recipient:</span>{" "}
                <strong>{form.fullName}</strong>
              </p>
              <p>
                <span className="text-on-surface-variant">Reference:</span>{" "}
                <strong className="font-audit-mono">{form.matricNumber}</strong>
              </p>
              <p>
                <span className="text-on-surface-variant">Title:</span>{" "}
                <strong>{form.title || form.program}</strong>
              </p>
              <p>
                <span className="text-on-surface-variant">Symbol:</span>{" "}
                <strong>
                  {form.rail === "GOVERNMENT"
                    ? "Government official seal"
                    : `${levelMeta.label} · ${levelMeta.shortLabel.toLowerCase()} mark`}
                </strong>
              </p>
              <p className="text-[12px] text-on-surface-variant pt-2">
                Sealing assigns a unique QR verification symbol to this certificate
                so anyone can confirm authenticity without calling the issuer.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={back}
              disabled={step === 0 || busy}
              className="h-11 px-4 rounded-xl border border-outline-variant/50 text-[14px] font-semibold disabled:opacity-40"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={busy}
              className="h-11 px-5 rounded-xl bg-[#0f766e] text-white text-[14px] font-semibold hover:bg-[#0d9488] disabled:opacity-60"
            >
              {step === 2 ? (busy ? "Sealing…" : "Seal & issue") : "Continue"}
            </button>
          </div>
        </form>

        <aside className="rounded-2xl border border-outline-variant/30 bg-white p-4 shadow-sm flex flex-col items-center text-center sticky top-24">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">
            Unique verification symbol
          </p>
          {form.rail === "GOVERNMENT" ? (
            <VerificationSymbol
              family="GOVERNMENT"
              value={previewValue}
              size="md"
              showLegend
            />
          ) : (
            <VerificationSymbol
              family="EDUCATION"
              level={form.educationLevel}
              value={previewValue}
              size="md"
              showLegend
            />
          )}
        </aside>
      </div>

      <Toast message={toast} onClose={() => setToast(null)} />
    </PageFrame>
  );
}
