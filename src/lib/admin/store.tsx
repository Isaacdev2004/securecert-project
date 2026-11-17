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
} from "./demo-data";
import type {
  AdminDemoState,
  EventKind,
  GovernanceEvent,
  TenantSector,
  TenantStatus,
} from "./types";

type AdminStoreValue = {
  ready: boolean;
  state: AdminDemoState;
  reset: () => void;
  pushEvent: (
    event: Omit<GovernanceEvent, "id" | "at"> & { at?: string },
  ) => void;
  selectTenant: (id: string) => void;
  provisionTenant: (input: {
    name: string;
    sector: TenantSector;
    domain: string;
  }) => void;
  setTenantStatus: (id: string, status: TenantStatus) => void;
  reverifyDns: (id: string) => void;
  bulkKeyRotation: () => void;
  queueMigration: (tenantName: string, source: string, target: string) => void;
  executeCutover: (id: string) => void;
  runFailoverDrill: () => void;
  rotateRootKey: (id: string) => void;
  emergencyAirGap: (enclaveId: string) => void;
  topUpQuota: (id: string, amount: number) => void;
  recalculateMargins: (grads: number, sisMarginPct: number) => void;
};

const AdminStoreContext = createContext<AdminStoreValue | null>(null);

function loadState(): AdminDemoState {
  if (typeof window === "undefined") return createSeedState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createSeedState();
    return normalizeState(JSON.parse(raw) as Partial<AdminDemoState>);
  } catch {
    return createSeedState();
  }
}

function persist(state: AdminDemoState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function AdminStoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<AdminDemoState>(createSeedState);

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

  const pushEvent = useCallback(
    (event: Omit<GovernanceEvent, "id" | "at"> & { at?: string }) => {
      setState((prev) => ({
        ...prev,
        events: [
          {
            id: `ev-${Date.now()}`,
            at: event.at || new Date().toISOString(),
            kind: event.kind,
            message: event.message,
          },
          ...prev.events,
        ].slice(0, 50),
      }));
    },
    [],
  );

  const selectTenant = useCallback((id: string) => {
    setState((prev) => ({ ...prev, selectedTenantId: id }));
  }, []);

  const provisionTenant = useCallback(
    (input: { name: string; sector: TenantSector; domain: string }) => {
      const now = new Date().toISOString();
      const id = `tn-${Date.now().toString(36)}`;
      const slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 16);
      setState((prev) => ({
        ...prev,
        tenants: [
          {
            id,
            name: input.name,
            did: `did:sc:ng-${slug}-01`,
            sector: input.sector,
            domain: input.domain,
            hsmNode: "HSM-NG-LAGOS-01",
            algo: "Ed25519",
            anchoredCerts: 0,
            partner: "Pending",
            status: "STAGING",
            rateLimit: "200 req/min",
            established: String(new Date().getFullYear()),
          },
          ...prev.tenants,
        ],
        selectedTenantId: id,
        kpis: {
          ...prev.kpis,
          activeTenants: prev.kpis.activeTenants + 1,
          domains: prev.kpis.domains + 1,
        },
        events: [
          {
            id: `ev-${Date.now()}`,
            at: now,
            kind: "AUDIT" as EventKind,
            message: `Tenant provisioned · ${input.name} · ${input.domain}`,
          },
          ...prev.events,
        ].slice(0, 50),
      }));
    },
    [],
  );

  const setTenantStatus = useCallback((id: string, status: TenantStatus) => {
    setState((prev) => {
      const t = prev.tenants.find((x) => x.id === id);
      return {
        ...prev,
        tenants: prev.tenants.map((x) => (x.id === id ? { ...x, status } : x)),
        events: [
          {
            id: `ev-${Date.now()}`,
            at: new Date().toISOString(),
            kind: (status === "QUARANTINED" || status === "WARNING"
              ? "WARNING"
              : "AUDIT") as EventKind,
            message: `${t?.name || id} status → ${status}`,
          },
          ...prev.events,
        ].slice(0, 50),
      };
    });
  }, []);

  const reverifyDns = useCallback((id: string) => {
    setState((prev) => {
      const t = prev.tenants.find((x) => x.id === id);
      return {
        ...prev,
        tenants: prev.tenants.map((x) =>
          x.id === id && x.status === "WARNING"
            ? { ...x, status: "COMPLIANT" as const }
            : x,
        ),
        events: [
          {
            id: `ev-${Date.now()}`,
            at: new Date().toISOString(),
            kind: "NOTICE" as EventKind,
            message: `Apex DNS handshake OK · ${t?.domain || id}`,
          },
          ...prev.events,
        ].slice(0, 50),
      };
    });
  }, []);

  const bulkKeyRotation = useCallback(() => {
    setState((prev) => ({
      ...prev,
      kpis: { ...prev.kpis, rotationDaysLeft: 365 },
      rootKeys: prev.rootKeys.map((k) =>
        k.state === "ROTATING" ? { ...k, state: "ACTIVE" as const } : k,
      ),
      events: [
        {
          id: `ev-${Date.now()}`,
          at: new Date().toISOString(),
          kind: "HSM" as EventKind,
          message: "Bulk key rotation ceremony completed · quorum 3-of-5",
        },
        ...prev.events,
      ].slice(0, 50),
    }));
  }, []);

  const queueMigration = useCallback(
    (tenantName: string, source: string, target: string) => {
      setState((prev) => ({
        ...prev,
        migrations: [
          {
            id: `mg-${Date.now().toString(36)}`,
            tenantName,
            source,
            target,
            payloadGb: 40 + Math.random() * 80,
            leaves: 100000 + Math.floor(Math.random() * 500000),
            progressPct: 0,
            state: "QUEUED",
          },
          ...prev.migrations,
        ],
        events: [
          {
            id: `ev-${Date.now()}`,
            at: new Date().toISOString(),
            kind: "NOTICE" as EventKind,
            message: `Migration queued · ${tenantName} · ${source} → ${target}`,
          },
          ...prev.events,
        ].slice(0, 50),
      }));
    },
    [],
  );

  const executeCutover = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      migrations: prev.migrations.map((m) =>
        m.id === id
          ? { ...m, progressPct: 100, state: "DONE" as const }
          : m,
      ),
      events: [
        {
          id: `ev-${Date.now()}`,
          at: new Date().toISOString(),
          kind: "AUDIT" as EventKind,
          message: `Shard cutover executed · ${id}`,
        },
        ...prev.events,
      ].slice(0, 50),
    }));
  }, []);

  const runFailoverDrill = useCallback(() => {
    setState((prev) => ({
      ...prev,
      events: [
        {
          id: `ev-${Date.now()}`,
          at: new Date().toISOString(),
          kind: "WARNING" as EventKind,
          message:
            "Failover drill · Shard-01 severed · RTO <2s · quorum restored",
        },
        ...prev.events,
      ].slice(0, 50),
    }));
  }, []);

  const rotateRootKey = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      rootKeys: prev.rootKeys.map((k) =>
        k.id === id ? { ...k, state: "ROTATING" as const } : k,
      ),
      events: [
        {
          id: `ev-${Date.now()}`,
          at: new Date().toISOString(),
          kind: "HSM" as EventKind,
          message: `Root key rotation initiated · ${id}`,
        },
        ...prev.events,
      ].slice(0, 50),
    }));
  }, []);

  const emergencyAirGap = useCallback((enclaveId: string) => {
    setState((prev) => ({
      ...prev,
      enclaves: prev.enclaves.map((e) =>
        e.id === enclaveId
          ? { ...e, status: "ISOLATED" as const, role: "COLD" as const }
          : e,
      ),
      events: [
        {
          id: `ev-${Date.now()}`,
          at: new Date().toISOString(),
          kind: "HSM" as EventKind,
          message: `Emergency air-gap isolation · ${enclaveId}`,
        },
        ...prev.events,
      ].slice(0, 50),
    }));
  }, []);

  const topUpQuota = useCallback((id: string, amount: number) => {
    setState((prev) => ({
      ...prev,
      quotas: prev.quotas.map((q) =>
        q.id === id
          ? {
              ...q,
              monthlyQuota: q.monthlyQuota + amount,
              nearCeiling: false,
            }
          : q,
      ),
      events: [
        {
          id: `ev-${Date.now()}`,
          at: new Date().toISOString(),
          kind: "BILLING" as EventKind,
          message: `Quota top-up +${amount.toLocaleString()} · ${id}`,
        },
        ...prev.events,
      ].slice(0, 50),
    }));
  }, []);

  const recalculateMargins = useCallback(
    (grads: number, sisMarginPct: number) => {
      const mint = 85;
      const wholesale = 114.5;
      const dividendPerGrad = Number(
        (
          wholesale -
          mint -
          (wholesale * sisMarginPct) / 100
        ).toFixed(2),
      );
      const annualSurplus = Number((dividendPerGrad * grads).toFixed(2));
      setState((prev) => ({
        ...prev,
        economics: {
          grads,
          sisMarginPct,
          dividendPerGrad: Math.max(0, dividendPerGrad),
          annualSurplus: Math.max(0, annualSurplus),
        },
      }));
    },
    [],
  );

  const value = useMemo(
    () => ({
      ready,
      state,
      reset,
      pushEvent,
      selectTenant,
      provisionTenant,
      setTenantStatus,
      reverifyDns,
      bulkKeyRotation,
      queueMigration,
      executeCutover,
      runFailoverDrill,
      rotateRootKey,
      emergencyAirGap,
      topUpQuota,
      recalculateMargins,
    }),
    [
      ready,
      state,
      reset,
      pushEvent,
      selectTenant,
      provisionTenant,
      setTenantStatus,
      reverifyDns,
      bulkKeyRotation,
      queueMigration,
      executeCutover,
      runFailoverDrill,
      rotateRootKey,
      emergencyAirGap,
      topUpQuota,
      recalculateMargins,
    ],
  );

  return (
    <AdminStoreContext.Provider value={value}>
      {children}
    </AdminStoreContext.Provider>
  );
}

export function useAdminStore() {
  const ctx = useContext(AdminStoreContext);
  if (!ctx) {
    throw new Error("useAdminStore must be used within AdminStoreProvider");
  }
  return ctx;
}
