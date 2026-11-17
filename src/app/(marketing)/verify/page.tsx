"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageIntro } from "@/components/marketing/PageIntro";

export default function VerifyPage() {
  const router = useRouter();
  const [query, setQuery] = useState("180407044");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.result === "VALID") {
        sessionStorage.setItem(
          "legitscan.lastVerify",
          JSON.stringify(data.credential),
        );
        router.push("/verify/result");
        return;
      }
      setError(data.message || `Result: ${data.result || "NOT_FOUND"}`);
    } catch {
      setError("Verification service unavailable.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageIntro
        eyebrow="Public verify · Unique QR symbols"
        title="Scan the certificate QR. Know if it is genuine."
        lede="Every education certificate carries a distinctive verification symbol — orange for primary, blue for secondary, green for university, violet for professional. Government documents use a separate official seal. Enter a DID or reference ID to resolve authenticity — no account required."
        actions={[
          { href: "/login", label: "Open verifier desk", variant: "secondary" },
          { href: "/onboarding", label: "Issue with LegitScan →", variant: "text" },
        ]}
      />

      <section className="bg-gray-50">
        <div className="mx-auto max-w-[560px] px-5 md:px-8 py-14 md:py-20">
          <form
            onSubmit={onSubmit}
            className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 sm:p-8"
          >
            <label className="block">
              <span className="text-[13px] font-bold text-gray-700">
                DID · ID · Serial · Nonce
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="mt-2 w-full h-12 rounded-xl border border-gray-200 px-4 text-[15px] outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20"
                placeholder="e.g. 180407044 · 4123456789 · did:legitscan:…"
                required
              />
            </label>
            {error && (
              <p className="mt-3 text-[14px] text-red-600">{error}</p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="marketing-btn-primary mt-6 w-full disabled:opacity-60"
            >
              {busy ? "Resolving…" : "Verify credential"}
            </button>
          </form>
          <p className="mt-6 text-center text-[14px] text-gray-500">
            Consular bulk checks?{" "}
            <Link href="/login" className="font-semibold text-[#0f766e]">
              Open the verifier desk
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
