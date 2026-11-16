"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthShell } from "@/components/marketing/AuthShell";
import { useAuth } from "@/lib/auth-context";
import type { AppRole } from "@/lib/types";

const INTENTS: { role: AppRole; label: string; hint: string }[] = [
  {
    role: "INSTITUTION",
    label: "University / Registrar",
    hint: "Issue & manage credentials",
  },
  {
    role: "PARTNER",
    label: "SIS / Software partner",
    hint: "Integrate & resell",
  },
  {
    role: "VERIFIER",
    label: "Embassy / Evaluator",
    hint: "Batch & single verify",
  },
  {
    role: "STUDENT",
    label: "Student / Alumni",
    hint: "Sovereign passport wallet",
  },
];

export default function SignupPage() {
  const { switchRole, homeForRole, supabaseReady } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [org, setOrg] = useState("");
  const [role, setRole] = useState<AppRole>("INSTITUTION");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    try {
      // Persist demo signup interest + enter matching portal
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organization_name: org || `${fullName}'s org`,
          contact_name: fullName,
          contact_email: email,
          persona: role,
          notes: `Signup request · password set locally for demo · ${supabaseReady ? "supabase-ready" : "demo-mode"}`,
        }),
      });

      // Demo: enter the selected portal immediately
      switchRole(role);
      setDone(true);
      setTimeout(() => router.push(homeForRole(role)), 900);
    } catch {
      setError("Could not complete signup right now. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      panelTitle="Create your SecureCert account"
      panelBody="Start in the portal that matches your role. Enterprise provisioning still runs through a short briefing for production tenancies."
      panelBullets={[
        "Pick your persona and enter a demo workspace",
        "Book a live briefing for production HSM keys",
        "Same login for registrar, partner, verifier & student",
      ]}
    >
      <div className="lg:hidden mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-gray-600"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to home
        </Link>
      </div>

      <h1 className="text-[1.85rem] font-extrabold tracking-tight text-gray-950">
        Sign up
      </h1>
      <p className="mt-2 text-[15px] text-gray-600">
        Create an account to explore SecureCert. Already onboarded?{" "}
        <Link href="/login" className="font-semibold text-[#0f766e] hover:underline">
          Sign in
        </Link>
      </p>

      {done ? (
        <div className="mt-8 rounded-2xl bg-white border border-gray-100 p-8 shadow-sm text-center">
          <span className="material-symbols-outlined text-[#0f766e] text-[40px]">
            check_circle
          </span>
          <p className="mt-3 text-[1.25rem] font-extrabold text-gray-950">
            You&apos;re in
          </p>
          <p className="mt-2 text-[14px] text-gray-600">
            Opening your {role.toLowerCase().replace("_", " ")} portal…
          </p>
          <Link href="/" className="mt-6 inline-flex font-semibold text-[#0f766e]">
            Or go back home
          </Link>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="mt-6 rounded-2xl bg-white border border-gray-100 shadow-sm p-6 space-y-5"
        >
          <div>
            <p className="text-[13px] font-bold text-gray-700 mb-2">I am a…</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {INTENTS.map((intent) => (
                <button
                  key={intent.role}
                  type="button"
                  onClick={() => setRole(intent.role)}
                  className={`text-left rounded-xl border px-3 py-3 transition-colors ${
                    role === intent.role
                      ? "border-[#0f766e] bg-[#f0fdfa]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="block text-[13px] font-bold text-gray-950">
                    {intent.label}
                  </span>
                  <span className="block text-[11px] text-gray-500 mt-0.5">
                    {intent.hint}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="text-[13px] font-bold text-gray-700">Full name</span>
            <input
              className="mt-2 w-full h-12 rounded-xl border border-gray-200 px-4 text-[15px] outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className="text-[13px] font-bold text-gray-700">
              Organization
            </span>
            <input
              className="mt-2 w-full h-12 rounded-xl border border-gray-200 px-4 text-[15px] outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              placeholder="University or company"
            />
          </label>

          <label className="block">
            <span className="text-[13px] font-bold text-gray-700">Work email</span>
            <input
              className="mt-2 w-full h-12 rounded-xl border border-gray-200 px-4 text-[15px] outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </label>

          <label className="block">
            <span className="text-[13px] font-bold text-gray-700">Password</span>
            <input
              className="mt-2 w-full h-12 rounded-xl border border-gray-200 px-4 text-[15px] outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              minLength={6}
              required
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
            {busy ? "Creating account…" : "Create account & enter portal"}
          </button>

          <p className="text-[12px] text-gray-500 text-center leading-relaxed">
            For production HSM tenancies, also{" "}
            <Link href="/onboarding" className="font-semibold text-[#0f766e]">
              book a demo briefing
            </Link>
            .
          </p>
        </form>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-[14px]">
        <Link href="/login" className="font-semibold text-gray-700 hover:text-[#0f766e]">
          Already have an account? Sign in
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1 font-semibold text-[#0f766e]"
        >
          <span className="material-symbols-outlined text-[16px]">home</span>
          Home
        </Link>
      </div>
    </AuthShell>
  );
}
