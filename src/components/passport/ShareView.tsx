"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/marketing/Icon";
import { usePassportStore } from "@/lib/passport/store";
import { credentialById } from "@/lib/passport/demo-data";
import { PageFrame, Toast, formatWhen } from "./ui";

const FIELD_OPTIONS = [
  { id: "title", label: "Credential title" },
  { id: "classification", label: "Classification" },
  { id: "issuer", label: "Issuer" },
  { id: "did", label: "DID" },
  { id: "matricNumber", label: "Matric / ID" },
  { id: "issuedAt", label: "Issue date" },
];

function ShareInner() {
  const params = useSearchParams();
  const presetId = params.get("id") || "";
  const { ready, state, createShare, revokeShare, recordView } =
    usePassportStore();
  const [toast, setToast] = useState<string | null>(null);
  const [credentialId, setCredentialId] = useState(presetId);
  const [fields, setFields] = useState<string[]>([
    "title",
    "classification",
    "issuer",
    "did",
  ]);
  const [maxViews, setMaxViews] = useState(3);
  const [expiresInDays, setExpiresInDays] = useState(30);
  const [lastToken, setLastToken] = useState<string | null>(null);

  const activeCreds = useMemo(
    () => state.credentials.filter((c) => c.status === "ACTIVE"),
    [state.credentials],
  );

  const selectedId = credentialId || activeCreds[0]?.id || "";

  function toggleField(id: string) {
    setFields((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  }

  function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!selectedId || fields.length === 0) return;
    const share = createShare({
      credentialId: selectedId,
      revealedFields: fields,
      maxViews,
      expiresInDays,
    });
    setLastToken(share.token);
    setToast("Share link created");
  }

  if (!ready) {
    return (
      <PageFrame>
        <p className="py-16 text-center text-on-surface-variant">Loading…</p>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      <div>
        <h1 className="text-[24px] font-extrabold tracking-tight">
          Share &amp; disclose
        </h1>
        <p className="text-[13px] text-on-surface-variant mt-1">
          Create a time-boxed link that reveals only what you choose.
        </p>
      </div>

      <form
        onSubmit={onCreate}
        className="rounded-2xl bg-white border border-outline-variant/40 p-4 shadow-sm space-y-4"
      >
        <label className="block">
          <span className="text-[12px] font-bold">Credential</span>
          <select
            value={selectedId}
            onChange={(e) => setCredentialId(e.target.value)}
            className="mt-1 w-full h-11 rounded-xl border border-outline-variant/60 px-3 text-[14px] outline-none"
          >
            {activeCreds.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </label>

        <div>
          <p className="text-[12px] font-bold mb-2">Reveal fields</p>
          <div className="flex flex-wrap gap-2">
            {FIELD_OPTIONS.map((f) => {
              const on = fields.includes(f.id);
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => toggleField(f.id)}
                  className={`h-9 px-3 rounded-full text-[12px] font-semibold border ${
                    on
                      ? "bg-[#0f766e] text-white border-[#0f766e]"
                      : "bg-white border-outline-variant/50"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-[12px] font-bold">Max views</span>
            <input
              type="number"
              min={1}
              value={maxViews}
              onChange={(e) => setMaxViews(Number(e.target.value))}
              className="mt-1 w-full h-11 rounded-xl border border-outline-variant/60 px-3 outline-none"
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-bold">Expires (days)</span>
            <input
              type="number"
              min={1}
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(Number(e.target.value))}
              className="mt-1 w-full h-11 rounded-xl border border-outline-variant/60 px-3 outline-none"
            />
          </label>
        </div>

        <button
          type="submit"
          className="w-full h-11 rounded-xl bg-[#0f766e] text-white text-[14px] font-semibold"
        >
          Create share link
        </button>
      </form>

      {lastToken && (
        <div className="rounded-2xl bg-[#f0fdfa] border border-teal-100 p-4">
          <p className="text-[12px] font-bold text-[#0f766e]">Demo share token</p>
          <p className="mt-1 font-audit-mono text-[13px] break-all">{lastToken}</p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={async () => {
                const url = `${window.location.origin}/verify?token=${lastToken}`;
                try {
                  await navigator.clipboard.writeText(url);
                  setToast("Share URL copied");
                } catch {
                  setToast(url);
                }
              }}
              className="h-9 px-3 rounded-lg bg-[#0f766e] text-white text-[12px] font-bold"
            >
              Copy URL
            </button>
          </div>
          <div className="mt-4 flex justify-center">
            <div className="h-36 w-36 rounded-xl bg-white border border-dashed border-[#0f766e]/40 flex flex-col items-center justify-center text-[#0f766e]">
              <Icon name="qr_code_2" size={64} />
              <p className="text-[10px] font-bold mt-1">QR preview</p>
            </div>
          </div>
        </div>
      )}

      <section>
        <h2 className="text-[15px] font-bold mb-2">Your share links</h2>
        <ul className="space-y-2">
          {state.shares.map((s) => {
            const cred = credentialById(state, s.credentialId);
            const live = !s.revokedAt;
            return (
              <li
                key={s.id}
                className="rounded-xl bg-white border border-outline-variant/40 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold truncate">
                      {cred?.title ?? s.credentialId}
                    </p>
                    <p className="text-[11px] font-audit-mono text-secondary truncate">
                      {s.token}
                    </p>
                    <p className="mt-1 text-[11px] text-on-surface-variant">
                      {s.viewCount}/{s.maxViews} views ·{" "}
                      {s.expiresAt ? `exp ${formatWhen(s.expiresAt)}` : "no expiry"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    {live ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            recordView(s.id);
                            setToast("Demo view recorded");
                          }}
                          className="h-8 px-2 rounded-lg text-[11px] font-bold text-[#0f766e] bg-[#f0fdfa]"
                        >
                          Simulate view
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            revokeShare(s.id);
                            setToast("Share revoked");
                          }}
                          className="h-8 px-2 rounded-lg text-[11px] font-bold text-red-600 bg-red-50"
                        >
                          Revoke
                        </button>
                      </>
                    ) : (
                      <span className="text-[10px] font-bold text-red-600 uppercase">
                        Revoked
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <Toast message={toast} onClose={() => setToast(null)} />
    </PageFrame>
  );
}

export function ShareView() {
  return (
    <Suspense
      fallback={
        <PageFrame>
          <p className="py-16 text-center text-on-surface-variant">Loading…</p>
        </PageFrame>
      }
    >
      <ShareInner />
    </Suspense>
  );
}
