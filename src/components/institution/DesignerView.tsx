"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/marketing/Icon";
import { useInstitutionStore } from "@/lib/institution/store";
import { PageFrame, Toast } from "./ui";

export function DesignerView() {
  const { ready, state, setActiveTemplate, updateTemplate } =
    useInstitutionStore();
  const [toast, setToast] = useState<string | null>(null);

  const active = useMemo(
    () =>
      state.templates.find((t) => t.id === state.activeTemplateId) ||
      state.templates[0],
    [state.templates, state.activeTemplateId],
  );

  if (!ready || !active) {
    return (
      <PageFrame>
        <p className="py-20 text-center text-on-surface-variant">Loading…</p>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      <div>
        <h1 className="text-[28px] font-bold tracking-tight">
          Certificate designer
        </h1>
        <p className="text-[14px] text-on-surface-variant mt-1">
          Brand parchment templates used at issuance time.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {state.templates.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTemplate(t.id)}
            className={`h-10 px-4 rounded-full text-[13px] font-semibold border ${
              t.id === active.id
                ? "bg-[#0f766e] text-white border-[#0f766e]"
                : "bg-white text-on-surface border-outline-variant/50"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 items-start">
        <section className="rounded-xl bg-white border border-outline-variant/30 p-5 shadow-sm space-y-4">
          <label className="block">
            <span className="text-[12px] font-bold">Template name</span>
            <input
              value={active.name}
              onChange={(e) =>
                updateTemplate(active.id, { name: e.target.value })
              }
              className="mt-1 w-full h-11 rounded-xl border border-outline-variant/60 px-3 outline-none focus:border-[#0f766e]"
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-bold">Accent color</span>
            <div className="mt-1 flex gap-2">
              <input
                type="color"
                value={active.accent}
                onChange={(e) =>
                  updateTemplate(active.id, { accent: e.target.value })
                }
                className="h-11 w-14 rounded-lg border border-outline-variant/50"
              />
              <input
                value={active.accent}
                onChange={(e) =>
                  updateTemplate(active.id, { accent: e.target.value })
                }
                className="flex-1 h-11 rounded-xl border border-outline-variant/60 px-3 font-audit-mono text-[13px] outline-none"
              />
            </div>
          </label>
          <label className="block">
            <span className="text-[12px] font-bold">Seal label</span>
            <input
              value={active.sealLabel}
              onChange={(e) =>
                updateTemplate(active.id, { sealLabel: e.target.value })
              }
              className="mt-1 w-full h-11 rounded-xl border border-outline-variant/60 px-3 outline-none focus:border-[#0f766e]"
            />
          </label>

          <div>
            <p className="text-[12px] font-bold mb-2">Mapped fields</p>
            <ul className="space-y-2">
              {active.fields.map((f) => (
                <li
                  key={f.id}
                  className="flex items-center justify-between gap-2 rounded-lg bg-surface-container-low px-3 py-2 text-[13px]"
                >
                  <span className="font-semibold">{f.label}</span>
                  <span className="font-audit-mono text-[11px] text-secondary">
                    {f.source}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => setToast("Template saved to demo ledger")}
            className="h-11 px-4 rounded-xl bg-[#0f766e] text-white text-[14px] font-semibold inline-flex items-center gap-1.5"
          >
            <Icon name="save" size={18} />
            Save template
          </button>
        </section>

        <section
          className="rounded-xl border shadow-sm p-6 min-h-[360px] relative overflow-hidden"
          style={{
            background: `linear-gradient(160deg, ${active.accent}14, #fff 45%)`,
            borderColor: `${active.accent}33`,
          }}
        >
          <div
            className="h-1.5 w-full rounded-full mb-6"
            style={{ background: active.accent }}
          />
          <p
            className="text-[11px] font-bold uppercase tracking-[0.14em]"
            style={{ color: active.accent }}
          >
            {state.tenantName}
          </p>
          <h2 className="mt-3 text-[22px] font-extrabold text-on-surface">
            Preview parchment
          </h2>
          <p className="mt-6 text-[14px] text-on-surface-variant">
            This certifies that
          </p>
          <p className="mt-1 text-[20px] font-bold">Babatunde A. Emmanuel</p>
          <p className="mt-4 text-[14px] text-on-surface-variant">
            has been awarded
          </p>
          <p className="mt-1 text-[18px] font-semibold" style={{ color: active.accent }}>
            B.Eng. Electrical &amp; Electronics Engineering
          </p>
          <div className="mt-10 flex items-center gap-3">
            <span
              className="h-12 w-12 rounded-full text-white inline-flex items-center justify-center"
              style={{ background: active.accent }}
            >
              <Icon name="verified" size={22} filled />
            </span>
            <div>
              <p className="text-[13px] font-bold">{active.sealLabel}</p>
              <p className="text-[11px] text-on-surface-variant font-audit-mono">
                {state.chainId}
              </p>
            </div>
          </div>
        </section>
      </div>

      <Toast message={toast} onClose={() => setToast(null)} />
    </PageFrame>
  );
}
