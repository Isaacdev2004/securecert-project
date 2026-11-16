"use client";

import { FormEvent, useState } from "react";
import { Icon } from "@/components/marketing/Icon";
import { useInstitutionStore } from "@/lib/institution/store";
import type { TeamRole } from "@/lib/institution/types";
import { PageFrame, Toast } from "./ui";

const ROLES: TeamRole[] = ["OWNER", "REGISTRAR", "OPERATOR", "AUDITOR"];

export function TeamView() {
  const {
    ready,
    state,
    inviteTeamMember,
    updateTeamRole,
    removeTeamMember,
  } = useInstitutionStore();
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    role: "OPERATOR" as TeamRole,
  });

  function onInvite(e: FormEvent) {
    e.preventDefault();
    inviteTeamMember(form.fullName, form.email, form.role);
    setToast(`Invite sent to ${form.email} (demo)`);
    setForm({ fullName: "", email: "", role: "OPERATOR" });
  }

  if (!ready) {
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
          Team &amp; role permissions
        </h1>
        <p className="text-[14px] text-on-surface-variant mt-1">
          Control who can issue, revoke, and audit inside {state.tenantName}.
        </p>
      </div>

      <form
        onSubmit={onInvite}
        className="rounded-xl bg-white border border-outline-variant/30 p-5 shadow-sm grid md:grid-cols-4 gap-3 items-end"
      >
        <label className="block md:col-span-1">
          <span className="text-[12px] font-bold">Full name</span>
          <input
            required
            value={form.fullName}
            onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
            className="mt-1 w-full h-11 rounded-xl border border-outline-variant/60 px-3 outline-none focus:border-[#0f766e]"
          />
        </label>
        <label className="block md:col-span-1">
          <span className="text-[12px] font-bold">Email</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="mt-1 w-full h-11 rounded-xl border border-outline-variant/60 px-3 outline-none focus:border-[#0f766e]"
          />
        </label>
        <label className="block">
          <span className="text-[12px] font-bold">Role</span>
          <select
            value={form.role}
            onChange={(e) =>
              setForm((f) => ({ ...f, role: e.target.value as TeamRole }))
            }
            className="mt-1 w-full h-11 rounded-xl border border-outline-variant/60 px-3 outline-none"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="h-11 rounded-xl bg-[#0f766e] text-white text-[14px] font-semibold inline-flex items-center justify-center gap-1.5"
        >
          <Icon name="mail" size={18} />
          Invite
        </button>
      </form>

      <div className="rounded-xl bg-white border border-outline-variant/30 shadow-sm overflow-hidden">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-surface-container-low/80 text-[11px] uppercase tracking-wide text-secondary">
            <tr>
              <th className="px-5 py-3 font-bold">Member</th>
              <th className="px-3 py-3 font-bold">Role</th>
              <th className="px-3 py-3 font-bold">Status</th>
              <th className="px-5 py-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.team.map((m) => (
              <tr
                key={m.id}
                className="border-t border-outline-variant/20 hover:bg-surface-container-low/40"
              >
                <td className="px-5 py-3">
                  <p className="font-semibold">{m.fullName}</p>
                  <p className="text-[12px] text-on-surface-variant">{m.email}</p>
                </td>
                <td className="px-3 py-3">
                  <select
                    value={m.role}
                    disabled={m.role === "OWNER"}
                    onChange={(e) =>
                      updateTeamRole(m.id, e.target.value as TeamRole)
                    }
                    className="h-9 rounded-lg border border-outline-variant/50 px-2 text-[12px] font-semibold disabled:opacity-60"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold uppercase ${
                      m.status === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-800"
                        : "bg-amber-50 text-amber-800"
                    }`}
                  >
                    {m.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  {m.role !== "OWNER" && (
                    <button
                      type="button"
                      onClick={() => {
                        removeTeamMember(m.id);
                        setToast("Member removed");
                      }}
                      className="h-8 w-8 rounded-lg text-red-600 hover:bg-red-50 inline-flex items-center justify-center"
                    >
                      <Icon name="person_remove" size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { role: "OWNER", d: "Full custody + billing" },
          { role: "REGISTRAR", d: "Issue, revoke, export" },
          { role: "OPERATOR", d: "Bulk + recipients only" },
          { role: "AUDITOR", d: "Read-only reports" },
        ].map((p) => (
          <div
            key={p.role}
            className="rounded-xl border border-outline-variant/30 bg-white p-4"
          >
            <p className="text-[12px] font-bold text-[#0f766e]">{p.role}</p>
            <p className="mt-1 text-[13px] text-on-surface-variant">{p.d}</p>
          </div>
        ))}
      </div>

      <Toast message={toast} onClose={() => setToast(null)} />
    </PageFrame>
  );
}
