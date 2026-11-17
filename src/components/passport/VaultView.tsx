"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/marketing/Icon";
import { usePassportStore } from "@/lib/passport/store";
import { PageFrame, StatusPill, formatWhen } from "./ui";

export function VaultView() {
  const { ready, state } = usePassportStore();
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return state.credentials;
    return state.credentials.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.issuer.toLowerCase().includes(q) ||
        c.did.toLowerCase().includes(q),
    );
  }, [state.credentials, query]);

  if (!ready) {
    return (
      <PageFrame>
        <p className="py-16 text-center text-on-surface-variant">Loading…</p>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      <div>
        <h1 className="text-[24px] font-extrabold tracking-tight">
          Authenticity vault
        </h1>
        <p className="text-[13px] text-on-surface-variant mt-1">
          {state.credentials.length} credentials, documents &amp; product marks
        </p>
      </div>

      <div className="relative">
        <Icon
          name="search"
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title, issuer, DID…"
          className="h-11 w-full rounded-xl border border-outline-variant/50 bg-white pl-9 pr-3 text-[14px] outline-none focus:border-[#0f766e]"
        />
      </div>

      <ul className="space-y-3">
        {rows.map((c) => (
          <li key={c.id}>
            <Link
              href={`/passport/credential?id=${c.id}`}
              className="block rounded-2xl bg-white border border-outline-variant/40 p-4 shadow-sm hover:border-[#0f766e]/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusPill status={c.status} />
                    <span className="rounded-full bg-surface-container-low px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-secondary">
                      {c.rail}
                    </span>
                  </div>
                  <p className="mt-2 text-[15px] font-bold leading-snug">{c.title}</p>
                  <p className="mt-1 text-[12px] text-on-surface-variant">
                    {c.issuer}
                  </p>
                  <p className="mt-1 text-[11px] font-audit-mono text-secondary truncate">
                    {c.did}
                  </p>
                </div>
                <Icon name="chevron_right" size={20} className="text-outline mt-1" />
              </div>
              <p className="mt-3 text-[11px] text-on-surface-variant">
                Issued {formatWhen(c.issuedAt)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </PageFrame>
  );
}
