"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import type { AppRole } from "@/lib/types";
import { Icon } from "@/components/marketing/Icon";

const ROLES: { role: AppRole; label: string; icon: string }[] = [
  { role: "INSTITUTION", label: "Registrar", icon: "account_balance" },
  { role: "PARTNER", label: "Partner", icon: "hub" },
  { role: "VERIFIER", label: "Verifier", icon: "fact_check" },
  { role: "STUDENT", label: "Student", icon: "badge" },
  { role: "SUPER_ADMIN", label: "Admin", icon: "admin_panel_settings" },
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

type Props = {
  /** Extra classes on the outer wrapper */
  className?: string;
};

export function RoleSwitcher({ className = "" }: Props) {
  const { user, loading, switchRole, homeForRole, signOut } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!mounted || loading || !user) return null;

  const roleLabel =
    ROLES.find((r) => r.role === user.role)?.label ?? user.role;

  return (
    <div ref={rootRef} className={`relative ${className}`.trim()}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex items-center gap-2 rounded-full border border-outline-variant/40 bg-surface-container-lowest pl-1 pr-2 py-1 shadow-sm hover:border-[#0f766e]/40 hover:shadow transition-all max-w-[200px]"
      >
        <span className="h-7 w-7 rounded-full bg-[#0f766e] text-white text-[11px] font-bold inline-flex items-center justify-center shrink-0">
          {initials(user.fullName) || "SC"}
        </span>
        <span className="min-w-0 text-left hidden md:block">
          <span className="block text-[12px] font-bold text-on-surface truncate leading-tight">
            {user.fullName}
          </span>
          <span className="block text-[10px] font-semibold text-[#0f766e] uppercase tracking-wide truncate leading-tight">
            {roleLabel}
          </span>
        </span>
        <Icon
          name={open ? "expand_less" : "expand_more"}
          size={18}
          className="text-outline shrink-0"
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-[120] w-[280px] rounded-2xl border border-outline-variant/30 bg-white shadow-xl overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-outline-variant/20 bg-surface-container-low/50">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#0f766e]">
              {user.mode === "demo" ? "Demo session" : "Signed in"}
            </p>
            <p className="mt-1 text-[14px] font-bold text-on-surface truncate">
              {user.fullName}
            </p>
            <p className="text-[11px] text-on-surface-variant truncate">
              {user.email}
            </p>
          </div>

          <div className="p-2">
            <p className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-secondary">
              Switch role
            </p>
            <div className="flex flex-col gap-0.5">
              {ROLES.map(({ role, label, icon }) => {
                const active = user.role === role;
                return (
                  <button
                    key={role}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setOpen(false);
                      switchRole(role);
                      router.push(homeForRole(role));
                    }}
                    className={`w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors ${
                      active
                        ? "bg-[#f0fdfa] text-[#0f766e]"
                        : "hover:bg-surface-container-low text-on-surface"
                    }`}
                  >
                    <span
                      className={`h-8 w-8 rounded-lg inline-flex items-center justify-center shrink-0 ${
                        active
                          ? "bg-[#0f766e] text-white"
                          : "bg-surface-container-low text-on-surface-variant"
                      }`}
                    >
                      <Icon name={icon} size={18} filled={active} />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-[13px] font-bold">{label}</span>
                      <span className="block text-[10px] text-on-surface-variant uppercase tracking-wide">
                        {role.replace("_", " ")}
                      </span>
                    </span>
                    {active && (
                      <Icon name="check" size={16} className="text-[#0f766e]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-2 border-t border-outline-variant/20">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                void signOut().then(() => router.push("/login"));
              }}
              className="w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left text-red-600 hover:bg-red-50 transition-colors"
            >
              <span className="h-8 w-8 rounded-lg bg-red-50 inline-flex items-center justify-center">
                <Icon name="logout" size={18} />
              </span>
              <span className="text-[13px] font-bold">Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
