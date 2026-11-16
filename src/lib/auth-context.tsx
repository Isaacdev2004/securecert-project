"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  DEMO_USERS,
  type AppRole,
  type SessionUser,
} from "@/lib/types";
import { ROLE_HOME } from "@/lib/path-map";

const DEMO_STORAGE_KEY = "securecert.demo.session";

type AuthContextValue = {
  user: SessionUser | null;
  loading: boolean;
  supabaseReady: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  switchRole: (role: AppRole) => void;
  homeForRole: (role?: AppRole) => string;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readDemoSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DEMO_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

function writeDemoSession(user: SessionUser | null) {
  if (typeof window === "undefined") return;
  if (!user) localStorage.removeItem(DEMO_STORAGE_KEY);
  else localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(user));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const supabaseReady = isSupabaseConfigured();

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      if (!supabaseReady) {
        if (!cancelled) {
          setUser(readDemoSession());
          setLoading(false);
        }
        return;
      }

      const supabase = createClient();
      if (!supabase) {
        setUser(readDemoSession());
        setLoading(false);
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (cancelled) return;

      if (data.session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, role, tenant_id, email")
          .eq("id", data.session.user.id)
          .maybeSingle();

        setUser({
          id: data.session.user.id,
          email: profile?.email ?? data.session.user.email ?? "",
          fullName:
            profile?.full_name ??
            data.session.user.user_metadata?.full_name ??
            "User",
          role: (profile?.role as AppRole) ?? "STUDENT",
          tenantId: profile?.tenant_id,
          mode: "supabase",
        });
      } else {
        setUser(readDemoSession());
      }
      setLoading(false);
    }

    void boot();
    return () => {
      cancelled = true;
    };
  }, [supabaseReady]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const normalized = email.trim().toLowerCase();

      // Prefer demo accounts for local demos even when Supabase is configured
      const demo = DEMO_USERS.find(
        (u) => u.email.toLowerCase() === normalized && u.password === password,
      );
      if (demo) {
        const session: SessionUser = {
          id: demo.id,
          email: demo.email,
          fullName: demo.fullName,
          role: demo.role,
          tenantId: demo.tenantId,
          mode: "demo",
        };
        writeDemoSession(session);
        setUser(session);
        return {};
      }

      if (!supabaseReady) {
        return {
          error:
            "Unknown demo account. Use registrar@unilag.edu.ng / demo1234 (see login page).",
        };
      }

      const supabase = createClient();
      if (!supabase) return { error: "Supabase is not configured." };

      const { error } = await supabase.auth.signInWithPassword({
        email: normalized,
        password,
      });
      if (error) return { error: error.message };

      const { data } = await supabase.auth.getUser();
      if (!data.user) return { error: "Sign-in succeeded but no user returned." };

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role, tenant_id, email")
        .eq("id", data.user.id)
        .maybeSingle();

      writeDemoSession(null);
      setUser({
        id: data.user.id,
        email: profile?.email ?? data.user.email ?? normalized,
        fullName: profile?.full_name ?? "User",
        role: (profile?.role as AppRole) ?? "STUDENT",
        tenantId: profile?.tenant_id,
        mode: "supabase",
      });
      return {};
    },
    [supabaseReady],
  );

  const signOut = useCallback(async () => {
    writeDemoSession(null);
    if (supabaseReady) {
      const supabase = createClient();
      await supabase?.auth.signOut();
    }
    setUser(null);
  }, [supabaseReady]);

  const switchRole = useCallback((role: AppRole) => {
    const demo = DEMO_USERS.find((u) => u.role === role);
    if (!demo) return;
    const session: SessionUser = {
      id: demo.id,
      email: demo.email,
      fullName: demo.fullName,
      role: demo.role,
      tenantId: demo.tenantId,
      mode: "demo",
    };
    writeDemoSession(session);
    setUser(session);
  }, []);

  const homeForRole = useCallback((role?: AppRole) => {
    const r = role ?? user?.role ?? "STUDENT";
    return ROLE_HOME[r] ?? "/";
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      loading,
      supabaseReady,
      signIn,
      signOut,
      switchRole,
      homeForRole,
    }),
    [user, loading, supabaseReady, signIn, signOut, switchRole, homeForRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
