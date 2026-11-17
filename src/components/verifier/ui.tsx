"use client";

import type { ConsentStatus, CryptoStatus } from "@/lib/verifier/types";
import { Icon } from "@/components/marketing/Icon";

export function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 sm:px-6 py-5 sm:py-6 flex flex-col gap-5 sm:gap-6 max-w-[1600px] w-full mx-auto">
      {children}
    </div>
  );
}

export function Toast({
  message,
  onClose,
}: {
  message: string | null;
  onClose: () => void;
}) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[80] max-w-sm rounded-xl bg-[#0b1c30] text-white px-4 py-3 shadow-xl flex items-start gap-3">
      <Icon name="check_circle" size={20} className="text-[#5eead4] mt-0.5" filled />
      <p className="text-[13px] leading-snug flex-1">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="text-white/60 hover:text-white"
        aria-label="Dismiss"
      >
        <Icon name="close" size={18} />
      </button>
    </div>
  );
}

export function CryptoChip({ status }: { status: CryptoStatus }) {
  const map: Record<CryptoStatus, { label: string; className: string }> = {
    MATCH: {
      label: "100% MATCH",
      className: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    MERKLE_VALID: {
      label: "MERKLE VALID",
      className: "bg-teal-50 text-teal-800 border-teal-200",
    },
    ZK_OK: {
      label: "ZK PROOF OK",
      className: "bg-sky-50 text-sky-800 border-sky-200",
    },
    MINISTRY_SEALED: {
      label: "MINISTRY SEALED",
      className: "bg-indigo-50 text-indigo-800 border-indigo-200",
    },
    BLOCKED: {
      label: "ACCESS BLOCKED",
      className: "bg-red-50 text-red-700 border-red-200",
    },
  };
  const m = map[status];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${m.className}`}
    >
      {m.label}
    </span>
  );
}

export function ConsentChip({ status }: { status: ConsentStatus }) {
  const map: Record<ConsentStatus, { label: string; className: string }> = {
    ACTIVE: {
      label: "Active grant",
      className: "bg-emerald-50 text-emerald-800",
    },
    BLINDED: {
      label: "Blinded PII",
      className: "bg-teal-50 text-teal-800",
    },
    TIMED_OUT: {
      label: "Timed out",
      className: "bg-amber-50 text-amber-800",
    },
    REVOKED: {
      label: "Revoked",
      className: "bg-red-50 text-red-700",
    },
    PENDING: {
      label: "Pending",
      className: "bg-amber-50 text-amber-800",
    },
  };
  const m = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${m.className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {m.label}
    </span>
  );
}

export function formatWhen(iso: string | null | undefined) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function AssuranceTape({
  sessionId,
  mtlsPeer,
}: {
  sessionId: string;
  mtlsPeer: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded bg-surface-container-low shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-status text-label-status">
          <span className="w-1.5 h-1.5 rounded-full bg-on-secondary-container animate-pulse" />
          ACTIVE SESSION: {sessionId}
        </span>
        <span className="font-audit-mono text-audit-mono text-on-surface-variant">
          mTLS Validated Peer:{" "}
          <span className="text-on-surface font-semibold">{mtlsPeer}</span>
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-4 font-audit-mono text-audit-mono text-on-surface-variant">
        <span>Lisbon Convention Article VII</span>
        <span className="text-outline">•</span>
        <span>W3C VC Data Model 2.0</span>
        <span className="text-outline">•</span>
        <span className="text-on-tertiary-container font-semibold">
          Zero-Knowledge NIMC Bridge: ARMED
        </span>
      </div>
    </div>
  );
}
