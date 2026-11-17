"use client";

import type {
  EnclaveStatus,
  MigrationState,
  TenantStatus,
} from "@/lib/admin/types";
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

export function TenantChip({ status }: { status: TenantStatus }) {
  const map: Record<TenantStatus, string> = {
    COMPLIANT: "bg-emerald-50 text-emerald-800 border-emerald-200",
    WARNING: "bg-amber-50 text-amber-800 border-amber-200",
    QUARANTINED: "bg-red-50 text-red-700 border-red-200",
    STAGING: "bg-sky-50 text-sky-800 border-sky-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${map[status]}`}
    >
      {status}
    </span>
  );
}

export function EnclaveChip({ status }: { status: EnclaveStatus }) {
  const map: Record<EnclaveStatus, string> = {
    ONLINE: "bg-emerald-50 text-emerald-800",
    STANDBY: "bg-sky-50 text-sky-800",
    ISOLATED: "bg-gray-100 text-gray-700",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold uppercase ${map[status]}`}
    >
      {status}
    </span>
  );
}

export function MigrationChip({ state }: { state: MigrationState }) {
  const map: Record<MigrationState, string> = {
    WAL_REPLAY: "bg-sky-50 text-sky-800",
    READY_CUTOVER: "bg-emerald-50 text-emerald-800",
    PENDING_LOCK: "bg-amber-50 text-amber-800",
    QUEUED: "bg-gray-100 text-gray-700",
    DONE: "bg-emerald-50 text-emerald-800",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold uppercase ${map[state]}`}
    >
      {state.replace("_", " ")}
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

export function formatNgn(n: number) {
  return `₦${n.toLocaleString("en-NG")}`;
}
