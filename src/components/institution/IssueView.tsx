"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/marketing/Icon";
import { useInstitutionStore } from "@/lib/institution/store";
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
  });

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
      title: form.title || form.program,
      classification: form.classification,
    });
    setToast("Credential issued to demo ledger");
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
            Issue new credential
          </h1>
          <p className="text-[14px] text-on-surface-variant">
            Seal a W3C-aligned credential into the institutional demo ledger.
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
              <span className="text-[12px] font-bold">Matric number</span>
              <input
                required
                value={form.matricNumber}
                onChange={(e) => update("matricNumber", e.target.value)}
                className="mt-1.5 w-full h-11 rounded-xl border border-outline-variant/60 px-3 outline-none focus:border-[#0f766e]"
              />
            </label>
            <label className="block">
              <span className="text-[12px] font-bold">Graduation year</span>
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
            <label className="block">
              <span className="text-[12px] font-bold">Program</span>
              <input
                required
                value={form.program}
                onChange={(e) => update("program", e.target.value)}
                placeholder="B.Sc. Computer Science"
                className="mt-1.5 w-full h-11 rounded-xl border border-outline-variant/60 px-3 outline-none focus:border-[#0f766e]"
              />
            </label>
            <label className="block">
              <span className="text-[12px] font-bold">Credential title</span>
              <input
                required
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Defaults to program if left matching"
                className="mt-1.5 w-full h-11 rounded-xl border border-outline-variant/60 px-3 outline-none focus:border-[#0f766e]"
              />
            </label>
            <label className="block">
              <span className="text-[12px] font-bold">Classification</span>
              <select
                value={form.classification}
                onChange={(e) => update("classification", e.target.value)}
                className="mt-1.5 w-full h-11 rounded-xl border border-outline-variant/60 px-3 outline-none focus:border-[#0f766e]"
              >
                <option>First Class Honours</option>
                <option>Second Class Upper</option>
                <option>Second Class Lower</option>
                <option>Third Class</option>
                <option>Distinction</option>
                <option>Merit</option>
                <option>Pass</option>
              </select>
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
              <span className="text-on-surface-variant">Matric:</span>{" "}
              <strong className="font-audit-mono">{form.matricNumber}</strong>
            </p>
            <p>
              <span className="text-on-surface-variant">Title:</span>{" "}
              <strong>{form.title || form.program}</strong>
            </p>
            <p>
              <span className="text-on-surface-variant">Class:</span>{" "}
              <strong>{form.classification}</strong>
            </p>
            <p className="text-[12px] text-on-surface-variant pt-2">
              Issuing will append to the shared demo store (localStorage) and
              appear on Dashboard, Credentials, and Reports.
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
            {step === 2
              ? busy
                ? "Sealing…"
                : "Seal & issue"
              : "Continue"}
          </button>
        </div>
      </form>

      <Toast message={toast} onClose={() => setToast(null)} />
    </PageFrame>
  );
}
