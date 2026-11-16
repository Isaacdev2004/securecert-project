"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import type { AppRole } from "@/lib/types";
import { useRouter } from "next/navigation";

const ROLES: { role: AppRole; label: string }[] = [
  { role: "INSTITUTION", label: "Registrar" },
  { role: "PARTNER", label: "Partner" },
  { role: "VERIFIER", label: "Verifier" },
  { role: "STUDENT", label: "Student" },
  { role: "SUPER_ADMIN", label: "Admin" },
];

export function RoleSwitcher() {
  const { user, loading, switchRole, homeForRole, signOut } = useAuth();
  const router = useRouter();
  // Defer until after hydration — demo session lives in localStorage
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading || !user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 rounded-xl bg-primary-container p-3 text-on-primary shadow-xl border border-outline-variant/30 max-w-[280px]">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="font-label-status text-[10px] uppercase text-tertiary-fixed tracking-wider">
            Demo session
          </div>
          <div className="font-title-sm text-sm truncate text-on-primary">
            {user.fullName}
          </div>
          <div className="font-audit-mono text-[10px] text-on-primary-container truncate">
            {user.role} · {user.mode}
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            void signOut().then(() => router.push("/login"));
          }}
          className="text-[11px] px-2 py-1 rounded-lg bg-surface-container-highest/15 hover:bg-surface-container-highest/25"
        >
          Sign out
        </button>
      </div>
      <div className="flex flex-wrap gap-1">
        {ROLES.map(({ role, label }) => (
          <button
            key={role}
            type="button"
            onClick={() => {
              switchRole(role);
              router.push(homeForRole(role));
            }}
            className={`px-2 py-1 rounded-lg text-[11px] font-title-sm transition-colors ${
              user.role === role
                ? "bg-on-tertiary-container text-on-primary"
                : "bg-surface-container-highest/10 hover:bg-surface-container-highest/20 text-on-primary-container"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
