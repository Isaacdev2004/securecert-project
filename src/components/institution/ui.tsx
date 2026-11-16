"use client";

import type { CredentialStatus } from "@/lib/institution/types";
import { Icon } from "@/components/marketing/Icon";

export function StatusChip({ status }: { status: CredentialStatus }) {
  const map: Record<
    CredentialStatus,
    { label: string; className: string }
  > = {
    ISSUED: {
      label: "Verified",
      className: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    PENDING_SIGNATURE: {
      label: "Pending sync",
      className: "bg-amber-50 text-amber-800 border-amber-200",
    },
    REVOKED: {
      label: "Revoked",
      className: "bg-red-50 text-red-700 border-red-200",
    },
    DRAFT: {
      label: "Draft",
      className: "bg-gray-50 text-gray-700 border-gray-200",
    },
    SUSPENDED: {
      label: "Suspended",
      className: "bg-orange-50 text-orange-800 border-orange-200",
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

export function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-gutter-lg py-space-lg flex flex-col gap-space-lg max-w-[1600px] w-full mx-auto">
      {children}
    </div>
  );
}

export function formatWhen(iso: string | null) {
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
