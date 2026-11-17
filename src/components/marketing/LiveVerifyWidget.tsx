"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function LiveVerifyWidget() {
  const router = useRouter();
  const [query, setQuery] = useState("180407044");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
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
      setMessage(data.message || `Result: ${data.result}`);
    } catch {
      setMessage("Service unavailable");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-white/10 bg-[#0b1c30]/55 backdrop-blur-xl p-5 sm:p-6 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.5)]"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#67d9cc]">
          Live verifier
        </p>
        <span className="flex items-center gap-1.5 text-[11px] text-white/50">
          <span className="h-1.5 w-1.5 rounded-full bg-[#01968b] animate-pulse" />
          Mainnet demo
        </span>
      </div>
      <label className="mt-4 block">
        <span className="sr-only">Credential ID</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-[14px] text-white placeholder:text-white/30 outline-none focus:border-[#67d9cc]/50"
          placeholder="DID, matric, or nonce"
        />
      </label>
      {message && (
        <p className="mt-2 text-[12px] text-[#ffb4ab]">{message}</p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="mt-4 w-full h-11 rounded-xl bg-[#01968b] hover:bg-[#00a899] text-white text-[13px] font-medium transition-colors disabled:opacity-60"
      >
        {busy ? "Resolving proof…" : "Verify now"}
      </button>
      <p className="mt-3 text-[11px] text-white/35">
        Try matric <button type="button" className="text-[#67d9cc] underline-offset-2 hover:underline" onClick={() => setQuery("180407044")}>180407044</button>
      </p>
    </form>
  );
}
