"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  STORAGE_KEY,
  createSeedState,
  normalizeState,
  randomToken,
} from "./demo-data";
import type { PassportDemoState, ShareLink } from "./types";

type CreateShareInput = {
  credentialId: string;
  revealedFields: string[];
  maxViews: number;
  expiresInDays: number | null;
};

type PassportStoreValue = {
  ready: boolean;
  state: PassportDemoState;
  reset: () => void;
  createShare: (input: CreateShareInput) => ShareLink;
  revokeShare: (id: string) => void;
  recordView: (shareId: string) => void;
};

const PassportStoreContext = createContext<PassportStoreValue | null>(null);

function loadState(): PassportDemoState {
  if (typeof window === "undefined") return createSeedState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createSeedState();
    return normalizeState(JSON.parse(raw) as Partial<PassportDemoState>);
  } catch {
    return createSeedState();
  }
}

function persist(state: PassportDemoState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function PassportStoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<PassportDemoState>(createSeedState);

  useEffect(() => {
    setState(loadState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    persist(state);
  }, [state, ready]);

  const reset = useCallback(() => {
    const seed = createSeedState();
    setState(seed);
    persist(seed);
  }, []);

  const createShare = useCallback((input: CreateShareInput) => {
    const now = new Date();
    const share: ShareLink = {
      id: `sh-${Date.now().toString(36)}`,
      credentialId: input.credentialId,
      token: randomToken(),
      revealedFields: input.revealedFields,
      expiresAt: input.expiresInDays
        ? new Date(
            now.getTime() + input.expiresInDays * 24 * 60 * 60 * 1000,
          ).toISOString()
        : null,
      maxViews: input.maxViews,
      viewCount: 0,
      revokedAt: null,
      createdAt: now.toISOString(),
    };
    setState((prev) => ({
      ...prev,
      shares: [share, ...prev.shares],
      activity: [
        {
          id: `pa-${Date.now()}`,
          at: now.toISOString(),
          kind: "SHARE" as const,
          label: "Share created",
          detail: `Token ${share.token} · ${share.maxViews} max views`,
          credentialId: input.credentialId,
        },
        ...prev.activity,
      ].slice(0, 50),
    }));
    return share;
  }, []);

  const revokeShare = useCallback((id: string) => {
    const now = new Date().toISOString();
    setState((prev) => {
      const share = prev.shares.find((s) => s.id === id);
      return {
        ...prev,
        shares: prev.shares.map((s) =>
          s.id === id ? { ...s, revokedAt: now } : s,
        ),
        activity: [
          {
            id: `pa-${Date.now()}`,
            at: now,
            kind: "REVOKE_SHARE" as const,
            label: "Share revoked",
            detail: share ? `Token ${share.token} disabled` : "Share disabled",
            credentialId: share?.credentialId,
          },
          ...prev.activity,
        ].slice(0, 50),
      };
    });
  }, []);

  const recordView = useCallback((shareId: string) => {
    const now = new Date().toISOString();
    setState((prev) => {
      const share = prev.shares.find((s) => s.id === shareId);
      if (!share || share.revokedAt) return prev;
      return {
        ...prev,
        shares: prev.shares.map((s) =>
          s.id === shareId ? { ...s, viewCount: s.viewCount + 1 } : s,
        ),
        activity: [
          {
            id: `pa-${Date.now()}`,
            at: now,
            kind: "VIEW" as const,
            label: "Share link opened",
            detail: "Demo view ping recorded",
            credentialId: share.credentialId,
          },
          ...prev.activity,
        ].slice(0, 50),
      };
    });
  }, []);

  const value = useMemo(
    () => ({ ready, state, reset, createShare, revokeShare, recordView }),
    [ready, state, reset, createShare, revokeShare, recordView],
  );

  return (
    <PassportStoreContext.Provider value={value}>
      {children}
    </PassportStoreContext.Provider>
  );
}

export function usePassportStore() {
  const ctx = useContext(PassportStoreContext);
  if (!ctx) {
    throw new Error("usePassportStore must be used within PassportStoreProvider");
  }
  return ctx;
}
