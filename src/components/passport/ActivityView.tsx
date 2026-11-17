"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/marketing/Icon";
import { usePassportStore } from "@/lib/passport/store";
import type { ActivityKind } from "@/lib/passport/types";
import { PageFrame, formatWhen } from "./ui";

const FILTERS: Array<ActivityKind | "ALL"> = [
  "ALL",
  "VERIFY",
  "SHARE",
  "VIEW",
  "REVOKE_SHARE",
  "ISSUE",
];

const KIND_ICON: Record<ActivityKind, string> = {
  VERIFY: "fact_check",
  SHARE: "ios_share",
  VIEW: "visibility",
  REVOKE_SHARE: "link_off",
  ISSUE: "verified",
};

export function ActivityView() {
  const { ready, state, reset } = usePassportStore();
  const [filter, setFilter] = useState<ActivityKind | "ALL">("ALL");

  const rows = useMemo(() => {
    if (filter === "ALL") return state.activity;
    return state.activity.filter((a) => a.kind === filter);
  }, [state.activity, filter]);

  if (!ready) {
    return (
      <PageFrame>
        <p className="py-16 text-center text-on-surface-variant">Loading…</p>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-extrabold tracking-tight">Activity</h1>
          <p className="text-[13px] text-on-surface-variant mt-1">
            Every verify, share, and view ping on your passport
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="text-[11px] font-semibold text-on-surface-variant"
        >
          Reset demo
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`h-8 px-2.5 rounded-full text-[11px] font-bold border ${
              filter === f
                ? "bg-[#0f766e] text-white border-[#0f766e]"
                : "bg-white border-outline-variant/50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="space-y-2">
        {rows.length === 0 ? (
          <li className="rounded-xl border border-dashed border-outline-variant p-6 text-center text-[13px] text-on-surface-variant">
            No events for this filter.
          </li>
        ) : (
          rows.map((e) => (
            <li
              key={e.id}
              className="rounded-xl bg-white border border-outline-variant/40 p-3 flex gap-3"
            >
              <span className="h-10 w-10 rounded-xl bg-[#f0fdfa] text-[#0f766e] inline-flex items-center justify-center shrink-0">
                <Icon name={KIND_ICON[e.kind]} size={20} />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-bold">{e.label}</p>
                <p className="text-[12px] text-on-surface-variant">{e.detail}</p>
                <p className="mt-1 text-[10px] font-audit-mono text-secondary">
                  {formatWhen(e.at)} · {e.kind}
                </p>
              </div>
            </li>
          ))
        )}
      </ul>
    </PageFrame>
  );
}
