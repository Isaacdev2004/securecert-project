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
  randomPrefix,
} from "./demo-data";
import type {
  BrandMode,
  PartnerDemoState,
  PartnerEnv,
  SchoolStatus,
  StreamEvent,
  StreamKind,
} from "./types";

type PartnerStoreValue = {
  ready: boolean;
  state: PartnerDemoState;
  reset: () => void;
  setEnv: (env: PartnerEnv) => void;
  pushStream: (
    event: Omit<StreamEvent, "id" | "at"> & { at?: string },
  ) => void;
  inviteSchool: (name: string, region: string, sisProduct: string) => void;
  setSchoolStatus: (id: string, status: SchoolStatus) => void;
  bulkReauthorize: () => void;
  createApiKey: (label: string) => { id: string; secret: string };
  rollSecret: (id: string) => string;
  revokeApiKey: (id: string) => void;
  registerApplication: (name: string) => void;
  addWebhook: (name: string, url: string, events: string[]) => void;
  toggleWebhook: (id: string) => void;
  sendTestPing: (id: string) => boolean;
  retryDegradedWebhooks: () => void;
  clearDlq: () => void;
  updateMapping: (id: string, patch: { sisField?: string; transform?: string; targetClaim?: string }) => void;
  updateWhiteLabel: (patch: Partial<{
    schoolId: string;
    fqdn: string;
    brandMode: BrandMode;
    obfuscateMatric: boolean;
    lockGpa: boolean;
  }>) => void;
  saveWhiteLabelDraft: () => void;
  deployWhiteLabel: () => void;
  setSandboxScenario: (id: string) => void;
  setSandboxBatchSize: (n: number) => void;
  executeSandbox: () => void;
  resetSandbox: () => void;
};

const PartnerStoreContext = createContext<PartnerStoreValue | null>(null);

function loadState(): PartnerDemoState {
  if (typeof window === "undefined") return createSeedState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createSeedState();
    return normalizeState(JSON.parse(raw) as Partial<PartnerDemoState>);
  } catch {
    return createSeedState();
  }
}

function persist(state: PartnerDemoState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function PartnerStoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<PartnerDemoState>(createSeedState);

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

  const pushStream = useCallback(
    (event: Omit<StreamEvent, "id" | "at"> & { at?: string }) => {
      setState((prev) => ({
        ...prev,
        stream: [
          {
            id: `st-${Date.now()}`,
            at: event.at || new Date().toISOString(),
            kind: event.kind,
            message: event.message,
          },
          ...prev.stream,
        ].slice(0, 40),
      }));
    },
    [],
  );

  const setEnv = useCallback((env: PartnerEnv) => {
    setState((prev) => ({ ...prev, env }));
  }, []);

  const inviteSchool = useCallback(
    (name: string, region: string, sisProduct: string) => {
      const now = new Date().toISOString();
      const id = `ps-${Date.now().toString(36)}`;
      setState((prev) => ({
        ...prev,
        schools: [
          {
            id,
            name,
            did: `did:sc:ng-${id}`,
            region,
            status: "PENDING",
            sisProduct,
            syncedRecords: 0,
            lastHeartbeat: now,
          },
          ...prev.schools,
        ],
        kpis: { ...prev.kpis, tenancies: prev.kpis.tenancies + 1 },
        stream: [
          {
            id: `st-${Date.now()}`,
            at: now,
            kind: "AUTH" as StreamKind,
            message: `Invite sent · ${name} · pending consent`,
          },
          ...prev.stream,
        ].slice(0, 40),
      }));
    },
    [],
  );

  const setSchoolStatus = useCallback((id: string, status: SchoolStatus) => {
    setState((prev) => ({
      ...prev,
      schools: prev.schools.map((s) => (s.id === id ? { ...s, status } : s)),
    }));
  }, []);

  const bulkReauthorize = useCallback(() => {
    const now = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      schools: prev.schools.map((s) =>
        s.status === "PENDING"
          ? { ...s, status: "ACTIVE" as const, lastHeartbeat: now }
          : { ...s, lastHeartbeat: now },
      ),
      stream: [
        {
          id: `st-${Date.now()}`,
          at: now,
          kind: "AUTH" as StreamKind,
          message: "Bulk re-authorize completed for connected tenancies",
        },
        ...prev.stream,
      ].slice(0, 40),
    }));
  }, []);

  const createApiKey = useCallback((label: string) => {
    const id = `key-${Date.now().toString(36)}`;
    const prefix = randomPrefix("live");
    const secret = `${prefix}${Math.random().toString(36).slice(2, 18)}`;
    const now = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      apiKeys: [
        {
          id,
          label,
          prefix,
          kind: "API_KEY",
          status: "ACTIVE",
          rateLimit: "500 req/min",
          ips: ["*"],
          scopes: ["credential:register"],
          createdAt: now,
          lastUsedAt: null,
        },
        ...prev.apiKeys,
      ],
      stream: [
        {
          id: `st-${Date.now()}`,
          at: now,
          kind: "AUTH" as StreamKind,
          message: `API key created · ${label}`,
        },
        ...prev.stream,
      ].slice(0, 40),
    }));
    return { id, secret };
  }, []);

  const rollSecret = useCallback((id: string) => {
    const prefix = randomPrefix("live");
    const secret = `${prefix}${Math.random().toString(36).slice(2, 18)}`;
    setState((prev) => ({
      ...prev,
      apiKeys: prev.apiKeys.map((k) =>
        k.id === id
          ? { ...k, prefix, status: "ACTIVE" as const }
          : k,
      ),
    }));
    return secret;
  }, []);

  const revokeApiKey = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      apiKeys: prev.apiKeys.map((k) =>
        k.id === id ? { ...k, status: "REVOKED" as const } : k,
      ),
    }));
  }, []);

  const registerApplication = useCallback((name: string) => {
    const now = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      applications: [
        {
          id: `app-${Date.now().toString(36)}`,
          name,
          clientId: `app_${name.toLowerCase().replace(/\s+/g, "_").slice(0, 12)}_${Math.random().toString(16).slice(2, 8)}`,
          env: prev.env,
          schoolsAttached: 0,
          scopes: ["credential:register"],
          health: prev.env === "SANDBOX" ? "SANDBOX" : "HEALTHY",
          peakRps: 0,
        },
        ...prev.applications,
      ],
      stream: [
        {
          id: `st-${Date.now()}`,
          at: now,
          kind: "AUTH" as StreamKind,
          message: `Application registered · ${name}`,
        },
        ...prev.stream,
      ].slice(0, 40),
    }));
  }, []);

  const addWebhook = useCallback(
    (name: string, url: string, events: string[]) => {
      setState((prev) => ({
        ...prev,
        webhooks: [
          {
            id: `wh-${Date.now().toString(36)}`,
            name,
            url,
            events,
            secretMasked: `whsec_••••${Math.random().toString(16).slice(2, 6)}`,
            status: "ACTIVE",
            latencyMs: 0,
            lastSuccessAt: null,
          },
          ...prev.webhooks,
        ],
      }));
    },
    [],
  );

  const toggleWebhook = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      webhooks: prev.webhooks.map((w) =>
        w.id === id
          ? {
              ...w,
              status:
                w.status === "DISABLED"
                  ? ("ACTIVE" as const)
                  : ("DISABLED" as const),
            }
          : w,
      ),
    }));
  }, []);

  const sendTestPing = useCallback((id: string) => {
    let ok = true;
    const now = new Date().toISOString();
    setState((prev) => {
      const wh = prev.webhooks.find((w) => w.id === id);
      if (!wh || wh.status === "DISABLED") {
        ok = false;
        return prev;
      }
      const degraded = wh.status === "DEGRADED";
      ok = !degraded;
      return {
        ...prev,
        webhooks: prev.webhooks.map((w) =>
          w.id === id
            ? {
                ...w,
                lastSuccessAt: degraded ? w.lastSuccessAt : now,
                latencyMs: degraded ? w.latencyMs : 35 + Math.floor(Math.random() * 40),
                failReason: degraded ? w.failReason || "HTTP 502" : undefined,
              }
            : w,
        ),
        stream: [
          {
            id: `st-${Date.now()}`,
            at: now,
            kind: "WEBHOOK" as StreamKind,
            message: degraded
              ? `Test ping failed · ${wh.name}`
              : `Test ping OK · ${wh.name}`,
          },
          ...prev.stream,
        ].slice(0, 40),
      };
    });
    return ok;
  }, []);

  const retryDegradedWebhooks = useCallback(() => {
    const now = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      webhooks: prev.webhooks.map((w) =>
        w.status === "DEGRADED"
          ? {
              ...w,
              status: "ACTIVE" as const,
              failReason: undefined,
              lastSuccessAt: now,
              latencyMs: 48,
            }
          : w,
      ),
      dlqCount: 0,
      stream: [
        {
          id: `st-${Date.now()}`,
          at: now,
          kind: "WEBHOOK" as StreamKind,
          message: "Retried degraded webhooks · DLQ drained",
        },
        ...prev.stream,
      ].slice(0, 40),
    }));
  }, []);

  const clearDlq = useCallback(() => {
    setState((prev) => ({ ...prev, dlqCount: 0 }));
  }, []);

  const updateMapping = useCallback(
    (
      id: string,
      patch: { sisField?: string; transform?: string; targetClaim?: string },
    ) => {
      setState((prev) => ({
        ...prev,
        mappings: prev.mappings.map((m) =>
          m.id === id ? { ...m, ...patch } : m,
        ),
      }));
    },
    [],
  );

  const updateWhiteLabel = useCallback(
    (
      patch: Partial<{
        schoolId: string;
        fqdn: string;
        brandMode: BrandMode;
        obfuscateMatric: boolean;
        lockGpa: boolean;
      }>,
    ) => {
      setState((prev) => ({
        ...prev,
        whiteLabel: {
          ...prev.whiteLabel,
          ...patch,
          deployStatus: "DRAFT",
          updatedAt: new Date().toISOString(),
        },
      }));
    },
    [],
  );

  const saveWhiteLabelDraft = useCallback(() => {
    setState((prev) => ({
      ...prev,
      whiteLabel: {
        ...prev.whiteLabel,
        deployStatus: "DRAFT",
        updatedAt: new Date().toISOString(),
      },
    }));
  }, []);

  const deployWhiteLabel = useCallback(() => {
    setState((prev) => ({
      ...prev,
      whiteLabel: {
        ...prev.whiteLabel,
        deployStatus: "LIVE",
        updatedAt: new Date().toISOString(),
      },
      stream: [
        {
          id: `st-${Date.now()}`,
          at: new Date().toISOString(),
          kind: "AUTH" as StreamKind,
          message: `White-label deployed · ${prev.whiteLabel.fqdn}`,
        },
        ...prev.stream,
      ].slice(0, 40),
    }));
  }, []);

  const setSandboxScenario = useCallback((id: string) => {
    setState((prev) => ({ ...prev, selectedScenarioId: id }));
  }, []);

  const setSandboxBatchSize = useCallback((n: number) => {
    setState((prev) => ({
      ...prev,
      sandboxBatchSize: Math.min(5000, Math.max(50, n)),
    }));
  }, []);

  const executeSandbox = useCallback(() => {
    const now = new Date().toISOString();
    setState((prev) => {
      const scenario = prev.sandboxScenarios.find(
        (s) => s.id === prev.selectedScenarioId,
      );
      const failRate =
        prev.selectedScenarioId === "sc-banner"
          ? 0
          : prev.selectedScenarioId === "sc-quorum"
            ? 1
            : 0.08;
      const failed = Math.round(prev.sandboxBatchSize * failRate);
      const success = prev.sandboxBatchSize - failed;
      return {
        ...prev,
        sandboxRuns: [
          {
            id: `sr-${Date.now().toString(36)}`,
            scenarioId: prev.selectedScenarioId,
            at: now,
            batchSize: prev.sandboxBatchSize,
            success,
            failed,
            note: scenario?.title || "Simulation",
          },
          ...prev.sandboxRuns,
        ].slice(0, 20),
        stream: [
          {
            id: `st-${Date.now()}`,
            at: now,
            kind: "SANDBOX" as StreamKind,
            message: `Sandbox run · ${scenario?.title || "scenario"} · ${success}/${prev.sandboxBatchSize}`,
          },
          ...prev.stream,
        ].slice(0, 40),
        logEvents: [
          {
            id: `lg-${Date.now()}`,
            at: now,
            school: "Sandbox Tenancy",
            connector: "Simulation Runner",
            method: "POST",
            path: "/v1/sandbox/execute",
            status: failed === prev.sandboxBatchSize ? 500 : 200,
            latencyMs: 40 + Math.floor(Math.random() * 80),
            detail: `${success} ok · ${failed} failed`,
          },
          ...prev.logEvents,
        ].slice(0, 50),
      };
    });
  }, []);

  const resetSandbox = useCallback(() => {
    setState((prev) => ({
      ...prev,
      sandboxRuns: [],
      selectedScenarioId: "sc-banner",
      sandboxBatchSize: 1250,
    }));
  }, []);

  const value = useMemo(
    () => ({
      ready,
      state,
      reset,
      setEnv,
      pushStream,
      inviteSchool,
      setSchoolStatus,
      bulkReauthorize,
      createApiKey,
      rollSecret,
      revokeApiKey,
      registerApplication,
      addWebhook,
      toggleWebhook,
      sendTestPing,
      retryDegradedWebhooks,
      clearDlq,
      updateMapping,
      updateWhiteLabel,
      saveWhiteLabelDraft,
      deployWhiteLabel,
      setSandboxScenario,
      setSandboxBatchSize,
      executeSandbox,
      resetSandbox,
    }),
    [
      ready,
      state,
      reset,
      setEnv,
      pushStream,
      inviteSchool,
      setSchoolStatus,
      bulkReauthorize,
      createApiKey,
      rollSecret,
      revokeApiKey,
      registerApplication,
      addWebhook,
      toggleWebhook,
      sendTestPing,
      retryDegradedWebhooks,
      clearDlq,
      updateMapping,
      updateWhiteLabel,
      saveWhiteLabelDraft,
      deployWhiteLabel,
      setSandboxScenario,
      setSandboxBatchSize,
      executeSandbox,
      resetSandbox,
    ],
  );

  return (
    <PartnerStoreContext.Provider value={value}>
      {children}
    </PartnerStoreContext.Provider>
  );
}

export function usePartnerStore() {
  const ctx = useContext(PartnerStoreContext);
  if (!ctx) {
    throw new Error("usePartnerStore must be used within PartnerStoreProvider");
  }
  return ctx;
}
