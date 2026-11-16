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
  makeDid,
  normalizeState,
  randomMerkle,
} from "./demo-data";
import type {
  CertificateTemplate,
  CredentialStatus,
  InstitutionDemoState,
  IssueInput,
  RecipientInput,
  StreamEvent,
  TeamMember,
  TeamRole,
} from "./types";

type InstitutionStoreValue = {
  ready: boolean;
  state: InstitutionDemoState;
  reset: () => void;
  issueCredential: (input: IssueInput) => string;
  revokeCredential: (id: string, reason?: string) => void;
  pushStream: (event: Omit<StreamEvent, "id" | "at"> & { at?: string }) => void;
  setCredentialStatus: (id: string, status: CredentialStatus) => void;
  addRecipient: (input: RecipientInput) => string;
  removeRecipient: (id: string) => void;
  enqueueBulkJob: (name: string, rowCount: number) => string;
  runBulkJob: (id: string) => void;
  setActiveTemplate: (id: string) => void;
  updateTemplate: (id: string, patch: Partial<CertificateTemplate>) => void;
  inviteTeamMember: (fullName: string, email: string, role: TeamRole) => void;
  updateTeamRole: (id: string, role: TeamRole) => void;
  removeTeamMember: (id: string) => void;
  createApiKey: (name: string) => { id: string; secret: string };
  revokeApiKey: (id: string) => void;
  toggleWebhook: (id: string) => void;
  addWebhook: (url: string, events: string[]) => void;
  updateMapping: (id: string, sisField: string, securecertField: string) => void;
};

const InstitutionStoreContext = createContext<InstitutionStoreValue | null>(
  null,
);

function loadState(): InstitutionDemoState {
  if (typeof window === "undefined") return createSeedState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createSeedState();
    return normalizeState(JSON.parse(raw) as Partial<InstitutionDemoState>);
  } catch {
    return createSeedState();
  }
}

function persist(state: InstitutionDemoState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function InstitutionStoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<InstitutionDemoState>(createSeedState);

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
            id: `evt-${Date.now()}`,
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

  const issueCredential = useCallback((input: IssueInput) => {
    const now = new Date().toISOString();
    const credentialId = `cred-${Date.now().toString(36)}`;
    const recipientId = `rec-${Date.now().toString(36)}`;
    setState((prev) => ({
      ...prev,
      recipients: [
        {
          id: recipientId,
          fullName: input.fullName,
          email: input.email,
          matricNumber: input.matricNumber,
          program: input.program,
          graduationYear: input.graduationYear,
        },
        ...prev.recipients,
      ],
      credentials: [
        {
          id: credentialId,
          recipientId,
          did: makeDid(input.matricNumber),
          status: "ISSUED" as const,
          credentialType: "UniversityDegreeCredential",
          title: input.title,
          classification: input.classification,
          issuedAt: now,
          revokedAt: null,
          revokeReason: null,
          merkleRoot: randomMerkle(),
          createdAt: now,
        },
        ...prev.credentials,
      ],
      kpis: {
        ...prev.kpis,
        authenticatedRecords: prev.kpis.authenticatedRecords + 1,
      },
      stream: [
        {
          id: `evt-${Date.now()}`,
          at: now,
          kind: "ISSUE" as const,
          message: `Credential sealed · ${credentialId} · ${input.fullName}`,
        },
        ...prev.stream,
      ].slice(0, 40),
    }));
    return credentialId;
  }, []);

  const revokeCredential = useCallback((id: string, reason?: string) => {
    const now = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      credentials: prev.credentials.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "REVOKED" as const,
              revokedAt: now,
              revokeReason: reason || "Revoked by registrar",
            }
          : c,
      ),
      stream: [
        {
          id: `evt-${Date.now()}`,
          at: now,
          kind: "REVOKE" as const,
          message: `Credential revoked · ${id}`,
        },
        ...prev.stream,
      ].slice(0, 40),
    }));
  }, []);

  const setCredentialStatus = useCallback(
    (id: string, status: CredentialStatus) => {
      setState((prev) => ({
        ...prev,
        credentials: prev.credentials.map((c) =>
          c.id === id ? { ...c, status } : c,
        ),
      }));
    },
    [],
  );

  const addRecipient = useCallback((input: RecipientInput) => {
    const id = `rec-${Date.now().toString(36)}`;
    setState((prev) => ({
      ...prev,
      recipients: [{ id, ...input }, ...prev.recipients],
    }));
    return id;
  }, []);

  const removeRecipient = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      recipients: prev.recipients.filter((r) => r.id !== id),
    }));
  }, []);

  const enqueueBulkJob = useCallback((name: string, rowCount: number) => {
    const id = `bulk-${Date.now().toString(36)}`;
    setState((prev) => ({
      ...prev,
      bulkJobs: [
        {
          id,
          name,
          rowCount,
          successCount: 0,
          failCount: 0,
          status: "QUEUED" as const,
          createdAt: new Date().toISOString(),
          completedAt: null,
        },
        ...prev.bulkJobs,
      ],
      stream: [
        {
          id: `evt-${Date.now()}`,
          at: new Date().toISOString(),
          kind: "SYNC" as const,
          message: `Bulk job queued · ${name} · ${rowCount} rows`,
        },
        ...prev.stream,
      ].slice(0, 40),
    }));
    return id;
  }, []);

  const runBulkJob = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      bulkJobs: prev.bulkJobs.map((j) =>
        j.id === id ? { ...j, status: "RUNNING" as const } : j,
      ),
    }));
    window.setTimeout(() => {
      setState((prev) => {
        const job = prev.bulkJobs.find((j) => j.id === id);
        if (!job) return prev;
        const failCount = Math.min(2, Math.floor(job.rowCount * 0.01));
        const successCount = job.rowCount - failCount;
        return {
          ...prev,
          bulkJobs: prev.bulkJobs.map((j) =>
            j.id === id
              ? {
                  ...j,
                  status: "COMPLETED" as const,
                  successCount,
                  failCount,
                  completedAt: new Date().toISOString(),
                }
              : j,
          ),
          kpis: {
            ...prev.kpis,
            authenticatedRecords:
              prev.kpis.authenticatedRecords + successCount,
          },
          stream: [
            {
              id: `evt-${Date.now()}`,
              at: new Date().toISOString(),
              kind: "ISSUE" as const,
              message: `Bulk complete · ${job.name} · ${successCount} sealed`,
            },
            ...prev.stream,
          ].slice(0, 40),
        };
      });
    }, 1600);
  }, []);

  const setActiveTemplate = useCallback((id: string) => {
    setState((prev) => ({ ...prev, activeTemplateId: id }));
  }, []);

  const updateTemplate = useCallback(
    (id: string, patch: Partial<CertificateTemplate>) => {
      setState((prev) => ({
        ...prev,
        templates: prev.templates.map((t) =>
          t.id === id
            ? { ...t, ...patch, updatedAt: new Date().toISOString() }
            : t,
        ),
      }));
    },
    [],
  );

  const inviteTeamMember = useCallback(
    (fullName: string, email: string, role: TeamRole) => {
      const member: TeamMember = {
        id: `tm-${Date.now().toString(36)}`,
        fullName,
        email,
        role,
        status: "INVITED" as const,
      };
      setState((prev) => ({ ...prev, team: [...prev.team, member] }));
    },
    [],
  );

  const updateTeamRole = useCallback((id: string, role: TeamRole) => {
    setState((prev) => ({
      ...prev,
      team: prev.team.map((m) => (m.id === id ? { ...m, role } : m)),
    }));
  }, []);

  const removeTeamMember = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      team: prev.team.filter((m) => m.id !== id),
    }));
  }, []);

  const createApiKey = useCallback((name: string) => {
    const id = `key-${Date.now().toString(36)}`;
    const secret = `sc_live_${Math.random().toString(36).slice(2, 10)}`;
    setState((prev) => ({
      ...prev,
      apiKeys: [
        {
          id,
          name,
          prefix: secret.slice(0, 12),
          createdAt: new Date().toISOString(),
          lastUsedAt: null,
          status: "ACTIVE" as const,
        },
        ...prev.apiKeys,
      ],
    }));
    return { id, secret };
  }, []);

  const revokeApiKey = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      apiKeys: prev.apiKeys.map((k) =>
        k.id === id ? { ...k, status: "REVOKED" as const } : k,
      ),
    }));
  }, []);

  const toggleWebhook = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      webhooks: prev.webhooks.map((w) => {
        if (w.id !== id) return w;
        const status = w.status === "ACTIVE" ? ("PAUSED" as const) : ("ACTIVE" as const);
        return { ...w, status };
      }),
    }));
  }, []);

  const addWebhook = useCallback((url: string, events: string[]) => {
    setState((prev) => ({
      ...prev,
      webhooks: [
        {
          id: `wh-${Date.now().toString(36)}`,
          url,
          events,
          status: "ACTIVE" as const,
          lastDelivery: null,
        },
        ...prev.webhooks,
      ],
    }));
  }, []);

  const updateMapping = useCallback(
    (id: string, sisField: string, securecertField: string) => {
      setState((prev) => ({
        ...prev,
        fieldMappings: prev.fieldMappings.map((m) =>
          m.id === id ? { ...m, sisField, securecertField } : m,
        ),
      }));
    },
    [],
  );

  const value = useMemo(
    () => ({
      ready,
      state,
      reset,
      issueCredential,
      revokeCredential,
      pushStream,
      setCredentialStatus,
      addRecipient,
      removeRecipient,
      enqueueBulkJob,
      runBulkJob,
      setActiveTemplate,
      updateTemplate,
      inviteTeamMember,
      updateTeamRole,
      removeTeamMember,
      createApiKey,
      revokeApiKey,
      toggleWebhook,
      addWebhook,
      updateMapping,
    }),
    [
      ready,
      state,
      reset,
      issueCredential,
      revokeCredential,
      pushStream,
      setCredentialStatus,
      addRecipient,
      removeRecipient,
      enqueueBulkJob,
      runBulkJob,
      setActiveTemplate,
      updateTemplate,
      inviteTeamMember,
      updateTeamRole,
      removeTeamMember,
      createApiKey,
      revokeApiKey,
      toggleWebhook,
      addWebhook,
      updateMapping,
    ],
  );

  return (
    <InstitutionStoreContext.Provider value={value}>
      {children}
    </InstitutionStoreContext.Provider>
  );
}

export function useInstitutionStore() {
  const ctx = useContext(InstitutionStoreContext);
  if (!ctx) {
    throw new Error(
      "useInstitutionStore must be used within InstitutionStoreProvider",
    );
  }
  return ctx;
}
