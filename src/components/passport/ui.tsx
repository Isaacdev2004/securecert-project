"use client";

import type { PassportCredentialStatus } from "@/lib/passport/types";
import { Icon } from "@/components/marketing/Icon";

export function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-gutter py-space-lg flex flex-col gap-space-lg max-w-lg mx-auto w-full">
      {children}
    </div>
  );
}

export function StatusPill({ status }: { status: PassportCredentialStatus }) {
  const map = {
    ACTIVE: "bg-emerald-50 text-emerald-800 border-emerald-200",
    REVOKED: "bg-red-50 text-red-700 border-red-200",
    EXPIRED: "bg-amber-50 text-amber-800 border-amber-200",
  };
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${map[status]}`}
    >
      {status}
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
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[80] max-w-sm w-[calc(100%-2rem)] rounded-xl bg-[#0b1c30] text-white px-4 py-3 shadow-xl flex items-start gap-3">
      <Icon name="check_circle" size={18} className="text-[#5eead4] mt-0.5" filled />
      <p className="text-[13px] flex-1 leading-snug">{message}</p>
      <button type="button" onClick={onClose} aria-label="Dismiss">
        <Icon name="close" size={16} className="text-white/60" />
      </button>
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
