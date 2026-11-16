"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ROLE_GUARDS } from "@/lib/path-map";

const PUBLIC_PREFIXES = [
  "/",
  "/architecture",
  "/developers",
  "/verify",
  "/wholesale",
  "/partners",
  "/onboarding",
  "/login",
  "/signup",
];

function isPublic(pathname: string) {
  if (pathname === "/") return true;
  return PUBLIC_PREFIXES.some(
    (p) => p !== "/" && (pathname === p || pathname.startsWith(`${p}/`)),
  );
}

function requiredRoles(pathname: string): string[] | null {
  for (const [prefix, roles] of Object.entries(ROLE_GUARDS)) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return roles;
    }
  }
  return null;
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading, homeForRole } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (isPublic(pathname)) return;

    const roles = requiredRoles(pathname);
    if (!roles) return;

    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!roles.includes(user.role)) {
      router.replace(homeForRole(user.role));
    }
  }, [user, loading, pathname, router, homeForRole]);

  return <>{children}</>;
}
