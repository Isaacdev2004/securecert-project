"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { PageIntro } from "@/components/marketing/PageIntro";

export default function OnboardingPage() {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organization_name: fd.get("organization_name"),
          contact_name: fd.get("contact_name"),
          contact_email: fd.get("contact_email"),
          persona: fd.get("persona"),
          notes: fd.get("notes"),
          preferred_tier: fd.get("preferred_tier"),
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || "Request failed");
        return;
      }
      setDone(data.id);
      e.currentTarget.reset();
    } catch {
      setError("Could not submit right now.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageIntro
        eyebrow="Get a demo"
        title="Book an enterprise demo."
        lede="Tell us who you are. We schedule a registrar briefing and provision a sandbox tenancy after a short walkthrough."
      />

      <section className="bg-gray-50 border-b border-gray-100">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-gray-700 hover:text-[#0f766e]"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to home
          </Link>
          <div className="flex flex-wrap gap-3 text-[14px]">
            <Link href="/login" className="font-semibold text-gray-700 hover:text-[#0f766e]">
              Already have access? Sign in
            </Link>
            <Link href="/signup" className="font-semibold text-[#0f766e]">
              Create an account →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-12 md:py-16 grid lg:grid-cols-[0.95fr_1.05fr] gap-10 items-start">
          <aside className="rounded-3xl bg-white border border-gray-100 p-7 shadow-sm">
            <p className="text-[13px] font-bold tracking-[0.14em] uppercase text-[#0f766e]">
              What you get
            </p>
            <ul className="mt-5 space-y-4">
              {[
                "Live walkthrough of issuance → verify → passport",
                "Sandbox tenancy for your institution or partner org",
                "Wholesale tier modelling for consular volume",
                "Technical Q&A on HSM custody and SIS mapping",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-[14px] text-gray-700">
                  <span className="material-symbols-outlined text-[#0f766e] text-[20px] shrink-0">
                    check_circle
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-2xl bg-[#f0fdfa] border border-teal-100 p-4">
              <p className="text-[13px] font-bold text-gray-950">Want the portals now?</p>
              <p className="mt-1 text-[13px] text-gray-600">
                Create an account and enter a demo workspace instantly.
              </p>
              <Link href="/signup" className="marketing-btn-primary !h-10 mt-4 !text-[13px]">
                Sign up for demo access
              </Link>
            </div>
          </aside>

          <div>
            {done ? (
              <div className="rounded-2xl bg-white border border-gray-100 p-8 shadow-sm">
                <span className="material-symbols-outlined text-[#0f766e] text-[40px]">
                  mark_email_read
                </span>
                <p className="mt-3 text-[1.5rem] font-extrabold text-gray-950">
                  Demo request received
                </p>
                <p className="mt-3 text-[15px] text-gray-600">
                  Reference{" "}
                  <span className="font-mono font-semibold text-[#0f766e]">
                    {done}
                  </span>
                  . Our desk will follow up by email.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/" className="marketing-btn-secondary">
                    Back to home
                  </Link>
                  <Link href="/login" className="marketing-btn-primary">
                    Sign in to portals
                  </Link>
                  <Link href="/signup" className="text-[14px] font-semibold text-[#0f766e] self-center">
                    Or create an account →
                  </Link>
                </div>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 sm:p-8 space-y-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-[1.25rem] font-extrabold text-gray-950">
                    Request a briefing
                  </h2>
                  <Link href="/" className="text-[13px] font-semibold text-gray-500 hover:text-[#0f766e] lg:hidden">
                    Home
                  </Link>
                </div>

                {[
                  { name: "organization_name", label: "Institution or company", type: "text" },
                  { name: "contact_name", label: "Your name", type: "text" },
                  { name: "contact_email", label: "Work email", type: "email" },
                ].map((field) => (
                  <label key={field.name} className="block">
                    <span className="text-[13px] font-bold text-gray-700">
                      {field.label}
                    </span>
                    <input
                      name={field.name}
                      type={field.type}
                      required
                      className="mt-2 w-full h-12 rounded-xl border border-gray-200 px-4 text-[15px] outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20"
                    />
                  </label>
                ))}

                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-[13px] font-bold text-gray-700">Persona</span>
                    <select
                      name="persona"
                      className="mt-2 w-full h-12 rounded-xl border border-gray-200 px-4 text-[15px] outline-none focus:border-[#0f766e]"
                      defaultValue="INSTITUTION"
                    >
                      <option value="INSTITUTION">University registrar</option>
                      <option value="PARTNER">SIS / software partner</option>
                      <option value="VERIFIER">Embassy / evaluator</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-[13px] font-bold text-gray-700">
                      Preferred tier
                    </span>
                    <select
                      name="preferred_tier"
                      className="mt-2 w-full h-12 rounded-xl border border-gray-200 px-4 text-[15px] outline-none focus:border-[#0f766e]"
                      defaultValue="Consortium"
                    >
                      <option>Campus</option>
                      <option>Consortium</option>
                      <option>Partner</option>
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className="text-[13px] font-bold text-gray-700">Notes</span>
                  <textarea
                    name="notes"
                    rows={3}
                    placeholder="SIS stack, graduating class size, consular volume…"
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-[15px] outline-none focus:border-[#0f766e] resize-none"
                  />
                </label>

                {error && (
                  <p className="text-[14px] text-red-600 bg-red-50 rounded-xl px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="marketing-btn-primary w-full disabled:opacity-60"
                >
                  {busy ? "Submitting…" : "Submit demo request"}
                </button>

                <p className="text-center text-[13px] text-gray-500">
                  Prefer self-serve?{" "}
                  <Link href="/signup" className="font-semibold text-[#0f766e]">
                    Sign up
                  </Link>{" "}
                  or{" "}
                  <Link href="/login" className="font-semibold text-[#0f766e]">
                    sign in
                  </Link>
                  .
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
