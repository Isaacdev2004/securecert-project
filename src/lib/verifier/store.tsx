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
  caseById,
  createSeedState,
  normalizeState,
  randomMerkle,
  randomToken,
} from "./demo-data";
import type {
  AuditDispatch,
  BatchStatus,
  VerificationBatch,
  VerifierDemoState,
} from "./types";

type VerifierStoreValue = {
  ready: boolean;
  state: VerifierDemoState;
  reset: () => void;
  selectCase: (id: string) => void;
  verifyTarget: (query: string, universityCode: string) => boolean;
  runMerkleAudit: () => void;
  enqueueBatch: (format: string, count: number) => string;
  completeBatch: (id: string) => void;
  requestReconsent: (caseId: string) => void;
  resolveAlert: (id: string) => void;
  topUpEscrow: (amountUsd: number) => void;
  createApiKey: (name: string) => { id: string; secret: string };
  revokeApiKey: (id: string) => void;
  pushDispatch: (
    event: Omit<AuditDispatch, "id" | "at"> & { at?: string },
  ) => void;
  exportDossier: (caseId: string) => string;
};

const VerifierStoreContext = createContext<VerifierStoreValue | null>(null);

function loadState(): VerifierDemoState {
  if (typeof window === "undefined") return createSeedState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createSeedState();
    return normalizeState(JSON.parse(raw) as Partial<VerifierDemoState>);
  } catch {
    return createSeedState();
  }
}

function persist(state: VerifierDemoState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function VerifierStoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<VerifierDemoState>(createSeedState);

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

  const pushDispatch = useCallback(
    (event: Omit<AuditDispatch, "id" | "at"> & { at?: string }) => {
      setState((prev) => ({
        ...prev,
        dispatches: [
          {
            id: `ad-${Date.now()}`,
            at: event.at || new Date().toISOString(),
            kind: event.kind,
            actor: event.actor,
            message: event.message,
            caseId: event.caseId,
            dossierRef: event.dossierRef,
          },
          ...prev.dispatches,
        ].slice(0, 60),
      }));
    },
    [],
  );

  const selectCase = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      selectedCaseId: id,
      cases: prev.cases.map((c) => ({ ...c, focused: c.id === id })),
    }));
  }, []);

  const verifyTarget = useCallback((query: string, universityCode: string) => {
    const q = query.trim().toLowerCase();
    let ok = false;
    setState((prev) => {
      let matched = prev.cases.find(
        (c) =>
          c.did.toLowerCase() === q ||
          c.matricNumber.toLowerCase() === q ||
          c.candidateName.toLowerCase().includes(q) ||
          c.merkleRoot.toLowerCase().includes(q),
      );
      if (!matched) {
        matched = prev.cases.find((c) => c.universityCode === universityCode);
      }
      if (!matched || matched.cryptoStatus === "BLOCKED") {
        ok = false;
        return {
          ...prev,
          lastAttestation: null,
          dispatches: [
            {
              id: `ad-${Date.now()}`,
              at: new Date().toISOString(),
              kind: "VERIFY" as const,
              actor: prev.officer,
              message: matched
                ? `Verification blocked · ${matched.candidateName}`
                : `No match for “${query.trim() || "empty query"}”`,
              caseId: matched?.id,
            },
            ...prev.dispatches,
          ].slice(0, 60),
        };
      }
      ok = true;
      const now = new Date().toISOString();
      const token = `CAN-IRCC-V4-${Math.floor(1000 + Math.random() * 9000)}`;
      return {
        ...prev,
        selectedCaseId: matched.id,
        cases: prev.cases.map((c) => ({
          ...c,
          focused: c.id === matched!.id,
          attested: c.id === matched!.id ? true : c.attested,
        })),
        lastAttestation: {
          candidateName: matched.candidateName,
          detail: `${matched.degreeLine} · ${matched.universityCode} (${matched.blockRef})`,
          merkleRoot: matched.merkleRoot,
          ingressToken: token,
          universityCode: matched.universityCode,
          at: now,
        },
        inquiries30d: prev.inquiries30d + 1,
        escrowBalanceUsd: Math.max(0, prev.escrowBalanceUsd - prev.tariffUsd),
        dispatches: [
          {
            id: `ad-${Date.now()}`,
            at: now,
            kind: "VERIFY" as const,
            actor: prev.officer,
            message: `Instant seal verified · ${matched.candidateName} · ${matched.cryptoStatus}`,
            caseId: matched.id,
          },
          ...prev.dispatches,
        ].slice(0, 60),
      };
    });
    return ok;
  }, []);

  const runMerkleAudit = useCallback(() => {
    setState((prev) => {
      const selected =
        caseById(prev, prev.selectedCaseId) || prev.cases[0];
      if (!selected) return prev;
      const now = new Date().toISOString();
      return {
        ...prev,
        lastAttestation: {
          candidateName: selected.candidateName,
          detail: `Merkle audit OK · ${selected.blockRef}`,
          merkleRoot: selected.merkleRoot || randomMerkle(),
          ingressToken: `AUDIT-${Date.now().toString(36).toUpperCase()}`,
          universityCode: selected.universityCode,
          at: now,
        },
        dispatches: [
          {
            id: `ad-${Date.now()}`,
            at: now,
            kind: "VERIFY" as const,
            actor: prev.officer,
            message: `Instant Merkle audit · ${selected.candidateName}`,
            caseId: selected.id,
          },
          ...prev.dispatches,
        ].slice(0, 60),
      };
    });
  }, []);

  const enqueueBatch = useCallback((format: string, count: number) => {
    const id = `vb-${Date.now().toString(36)}`;
    const batch: VerificationBatch = {
      id,
      label: `#CAN-VISA-${new Date().getFullYear()}-B${String(state.batches.length + 1).padStart(2, "0")}`,
      format,
      candidateCount: count,
      verified: 0,
      invalid: 0,
      durationMs: 0,
      usdCleared: 0,
      status: "QUEUED" as BatchStatus,
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      batches: [batch, ...prev.batches],
      dispatches: [
        {
          id: `ad-${Date.now()}`,
          at: batch.createdAt,
          kind: "INGRESS" as const,
          actor: "Batch Runner",
          message: `Queued ${batch.label} · ${count} candidates · ${format}`,
        },
        ...prev.dispatches,
      ].slice(0, 60),
    }));
    return id;
  }, [state.batches.length]);

  const completeBatch = useCallback((id: string) => {
    setState((prev) => {
      const batch = prev.batches.find((b) => b.id === id);
      if (!batch) return prev;
      const invalid = Math.min(2, Math.floor(batch.candidateCount * 0.02));
      const verified = batch.candidateCount - invalid;
      const durationMs = 600 + Math.floor(Math.random() * 900);
      const usdCleared = Number((verified * prev.tariffUsd).toFixed(2));
      const univShare = Number(
        ((usdCleared * prev.univSharePct) / 100).toFixed(2),
      );
      const now = new Date().toISOString();
      return {
        ...prev,
        batches: prev.batches.map((b) =>
          b.id === id
            ? {
                ...b,
                status: "COMPLETED" as BatchStatus,
                verified,
                invalid,
                durationMs,
                usdCleared,
              }
            : b,
        ),
        escrowBalanceUsd: Math.max(0, prev.escrowBalanceUsd - usdCleared),
        clearedUsd30d: prev.clearedUsd30d + usdCleared,
        inquiries30d: prev.inquiries30d + verified,
        settlements: [
          {
            id: `st-${Date.now()}`,
            at: now,
            label: `Batch ${batch.label} clearing`,
            amountUsd: usdCleared,
            univShareUsd: univShare,
            batchId: id,
          },
          ...prev.settlements,
        ],
        dispatches: [
          {
            id: `ad-${Date.now()}`,
            at: now,
            kind: "INGRESS" as const,
            actor: "Batch Runner",
            message: `Cohort ${batch.label} completed · ${verified}/${batch.candidateCount}`,
          },
          ...prev.dispatches,
        ].slice(0, 60),
      };
    });
  }, []);

  const requestReconsent = useCallback((caseId: string) => {
    const now = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      consents: prev.consents.map((c) =>
        c.caseId === caseId
          ? { ...c, status: "PENDING" as const, expiresAt: now }
          : c,
      ),
      cases: prev.cases.map((c) =>
        c.id === caseId
          ? { ...c, consentStatus: "PENDING" as const }
          : c,
      ),
      dispatches: [
        {
          id: `ad-${Date.now()}`,
          at: now,
          kind: "CONSENT" as const,
          actor: prev.officer,
          message: `Re-consent requested · case ${caseId}`,
          caseId,
        },
        ...prev.dispatches,
      ].slice(0, 60),
    }));
  }, []);

  const resolveAlert = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      alerts: prev.alerts.map((a) =>
        a.id === id ? { ...a, resolved: true } : a,
      ),
    }));
  }, []);

  const topUpEscrow = useCallback((amountUsd: number) => {
    const now = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      escrowBalanceUsd: prev.escrowBalanceUsd + amountUsd,
      settlements: [
        {
          id: `st-${Date.now()}`,
          at: now,
          label: `Escrow top-up +$${amountUsd.toLocaleString("en-US")}`,
          amountUsd,
          univShareUsd: 0,
        },
        ...prev.settlements,
      ],
      dispatches: [
        {
          id: `ad-${Date.now()}`,
          at: now,
          kind: "BILLING" as const,
          actor: prev.officer,
          message: `Escrow topped up by $${amountUsd}`,
        },
        ...prev.dispatches,
      ].slice(0, 60),
    }));
  }, []);

  const createApiKey = useCallback((name: string) => {
    const id = `vak-${Date.now().toString(36)}`;
    const secret = randomToken("vfy_live_");
    const now = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      apiKeys: [
        {
          id,
          name,
          prefix: secret.slice(0, 14),
          status: "ACTIVE" as const,
          createdAt: now,
          lastUsedAt: null,
        },
        ...prev.apiKeys,
      ],
      dispatches: [
        {
          id: `ad-${Date.now()}`,
          at: now,
          kind: "INGRESS" as const,
          actor: prev.officer,
          message: `API key created · ${name}`,
        },
        ...prev.dispatches,
      ].slice(0, 60),
    }));
    return { id, secret: secret + Math.random().toString(36).slice(2, 18) };
  }, []);

  const revokeApiKey = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      apiKeys: prev.apiKeys.map((k) =>
        k.id === id ? { ...k, status: "REVOKED" as const } : k,
      ),
    }));
  }, []);

  const exportDossier = useCallback((caseId: string) => {
    const ref = `DOS-CAN-${Date.now().toString(36).toUpperCase()}`;
    const now = new Date().toISOString();
    setState((prev) => {
      const c = caseById(prev, caseId);
      return {
        ...prev,
        dispatches: [
          {
            id: `ad-${Date.now()}`,
            at: now,
            kind: "DOSSIER" as const,
            actor: prev.officer,
            message: `Diplomatic PDF/A-3 compiled · ${c?.candidateName || caseId}`,
            caseId,
            dossierRef: ref,
          },
          ...prev.dispatches,
        ].slice(0, 60),
      };
    });
    return ref;
  }, []);

  const value = useMemo(
    () => ({
      ready,
      state,
      reset,
      selectCase,
      verifyTarget,
      runMerkleAudit,
      enqueueBatch,
      completeBatch,
      requestReconsent,
      resolveAlert,
      topUpEscrow,
      createApiKey,
      revokeApiKey,
      pushDispatch,
      exportDossier,
    }),
    [
      ready,
      state,
      reset,
      selectCase,
      verifyTarget,
      runMerkleAudit,
      enqueueBatch,
      completeBatch,
      requestReconsent,
      resolveAlert,
      topUpEscrow,
      createApiKey,
      revokeApiKey,
      pushDispatch,
      exportDossier,
    ],
  );

  return (
    <VerifierStoreContext.Provider value={value}>
      {children}
    </VerifierStoreContext.Provider>
  );
}

export function useVerifierStore() {
  const ctx = useContext(VerifierStoreContext);
  if (!ctx) {
    throw new Error("useVerifierStore must be used within VerifierStoreProvider");
  }
  return ctx;
}
