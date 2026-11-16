"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { DEMO_USERS, type AppRole } from "@/lib/types";
import { AuthShell } from "@/components/marketing/AuthShell";

const ROLE_META: Record<
  AppRole,
  { label: string; blurb: string; icon: string }
> = {
  INSTITUTION: {
    label: "Registrar",
    blurb: "Issue & registry console",
    icon: "account_balance",
  },
  PARTNER: {
    label: "Partner",
    blurb: "SIS / reseller hub",
    icon: "hub",
  },
  VERIFIER: {
    label: "Verifier",
    blurb: "Embassy / WES desk",
    icon: "fact_check",
  },
  STUDENT: {
    label: "Student",
    blurb: "Sovereign passport",
    icon: "badge",
  },
  SUPER_ADMIN: {
    label: "Admin",
    blurb: "Platform governance",
    icon: "admin_panel_settings",
  },
};

function LoginForm() {
  const { signIn, switchRole, homeForRole, supabaseReady } = useAuth();
  const router = useRouter();
  const search = useSearchParams();
  const [email, setEmail] = useState("registrar@unilag.edu.ng");
  const [password, setPassword] = useState("demo1234");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<"password" | "demo">("password");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const result = await signIn(email, password);
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    const next = search.get("next");
    const demo = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
    );
    router.push(next || homeForRole(demo?.role));
  }

  function quickEnter(role: AppRole) {
    switchRole(role);
    router.push(homeForRole(role));
  }

  return (
    <AuthShell
      panelTitle="Sign in to your portal"
      panelBody="Access the registrar suite, partner hub, verifier desk, student passport, or platform admin — with demo roles ready instantly."
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
        Welcome back
      </h1>
      <p className="mt-2 text-[15px] text-gray-600">
        Sign in with email, or jump straight into a demo portal.
      </p>

      <div className="mt-6 flex rounded-full bg-gray-100 p-1">
        <button
          type="button"
          onClick={() => setTab("password")}
          className={`flex-1 h-10 rounded-full text-[14px] font-semibold transition-colors ${
            tab === "password"
              ? "bg-white text-gray-950 shadow-sm"
              : "text-gray-500"
          }`}
        >
          Email sign in
        </button>
        <button
          type="button"
          onClick={() => setTab("demo")}
          className={`flex-1 h-10 rounded-full text-[14px] font-semibold transition-colors ${
            tab === "demo"
              ? "bg-white text-gray-950 shadow-sm"
              : "text-gray-500"
          }`}
        >
          Demo portals
        </button>
      </div>

      {tab === "password" ? (
        <form
          onSubmit={onSubmit}
          className="mt-6 rounded-2xl bg-white border border-gray-100 shadow-sm p-6 space-y-5"
        >
          <label className="block">
            <span className="text-[13px] font-bold text-gray-700">Work email</span>
            <input
              className="mt-2 w-full h-12 rounded-xl border border-gray-200 px-4 text-[15px] outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="username"
              required
            />
          </label>
          <label className="block">
            <span className="text-[13px] font-bold text-gray-700">Password</span>
            <div className="mt-2 relative">
              <input
                className="w-full h-12 rounded-xl border border-gray-200 px-4 pr-12 text-[15px] outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
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
            {busy ? "Signing in…" : "Sign in"}
          </button>

          <p className="text-[12px] text-gray-500 text-center">
            {supabaseReady
              ? "Live Supabase auth available · demo emails still work"
              : "Demo mode · try registrar@unilag.edu.ng / demo1234"}
          </p>
        </form>
      ) : (
        <div className="mt-6 space-y-2">
          {DEMO_USERS.map((u) => {
            const meta = ROLE_META[u.role];
            return (
              <button
                key={u.id}
                type="button"
                onClick={() => quickEnter(u.role)}
                className="w-full text-left rounded-2xl bg-white border border-gray-100 px-4 py-3.5 hover:border-[#0f766e] hover:shadow-sm transition-all flex items-center gap-3"
              >
                <span className="h-11 w-11 rounded-xl bg-[#f0fdfa] text-[#0f766e] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">{meta.icon}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-bold text-gray-950">
                    {meta.label} · {u.fullName}
                  </span>
                  <span className="block text-[12px] text-gray-500 truncate">
                    {meta.blurb} · {u.email}
                  </span>
                </span>
                <span className="material-symbols-outlined text-gray-300">
                  arrow_forward
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-dashed border-gray-200 bg-white/70 p-5 text-center">
        <p className="text-[14px] text-gray-600">New to SecureCert?</p>
        <div className="mt-3 flex flex-col sm:flex-row gap-2 justify-center">
          <Link href="/signup" className="marketing-btn-secondary !h-10">
            Create an account
          </Link>
          <Link href="/onboarding" className="marketing-btn-primary !h-10">
            Book a demo
          </Link>
        </div>
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-[#0f766e]"
        >
          <span className="material-symbols-outlined text-[16px]">home</span>
          Back to homepage
        </Link>
      </div>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center text-gray-500">
          Loading…
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
