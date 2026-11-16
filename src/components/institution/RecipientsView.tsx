"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/marketing/Icon";
import { useInstitutionStore } from "@/lib/institution/store";
import { PageFrame, Toast } from "./ui";

export function RecipientsView() {
  const { ready, state, addRecipient, removeRecipient } = useInstitutionStore();
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    matricNumber: "",
    program: "",
    graduationYear: 2026,
  });

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return state.recipients;
    return state.recipients.filter(
      (r) =>
        r.fullName.toLowerCase().includes(q) ||
        r.matricNumber.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.program.toLowerCase().includes(q),
    );
  }, [state.recipients, query]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    addRecipient(form);
    setToast("Recipient added to demo ledger");
    setOpen(false);
    setForm({
      fullName: "",
      email: "",
      matricNumber: "",
      program: "",
      graduationYear: 2026,
    });
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight">
            Recipients &amp; candidates
          </h1>
          <p className="text-[14px] text-on-surface-variant mt-1">
            {state.recipients.length} people in the {state.tenantName} roster
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="h-11 px-4 rounded-xl bg-[#0f766e] text-white text-[14px] font-semibold inline-flex items-center gap-1.5"
        >
          <Icon name="person_add" size={18} />
          Add recipient
        </button>
      </div>

      <div className="relative max-w-sm">
        <Icon
          name="search"
          size={16}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-outline"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, matric, program…"
          className="h-10 w-full rounded-xl border border-outline-variant/50 bg-white pl-8 pr-3 text-[13px] outline-none focus:border-[#0f766e]"
        />
      </div>

      <div className="rounded-xl bg-white border border-outline-variant/30 shadow-sm overflow-hidden">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-surface-container-low/80 text-[11px] uppercase tracking-wide text-secondary">
            <tr>
              <th className="px-5 py-3 font-bold">Name</th>
              <th className="px-3 py-3 font-bold">Matric</th>
              <th className="px-3 py-3 font-bold">Program</th>
              <th className="px-3 py-3 font-bold">Year</th>
              <th className="px-5 py-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const creds = state.credentials.filter(
                (c) => c.recipientId === r.id,
              );
              return (
                <tr
                  key={r.id}
                  className="border-t border-outline-variant/20 hover:bg-surface-container-low/40"
                >
                  <td className="px-5 py-3">
                    <p className="font-semibold">{r.fullName}</p>
                    <p className="text-[12px] text-on-surface-variant">
                      {r.email}
                    </p>
                  </td>
                  <td className="px-3 py-3 font-audit-mono text-[12px]">
                    {r.matricNumber}
                  </td>
                  <td className="px-3 py-3 max-w-[220px] truncate">{r.program}</td>
                  <td className="px-3 py-3">{r.graduationYear}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex gap-1 items-center">
                      {creds[0] ? (
                        <Link
                          href={`/institution/credentials/${creds[0].id}`}
                          className="h-8 px-2 rounded-lg text-[#0f766e] text-[12px] font-bold"
                        >
                          View cred
                        </Link>
                      ) : (
                        <Link
                          href="/institution/issue"
                          className="h-8 px-2 rounded-lg text-[#0f766e] text-[12px] font-bold"
                        >
                          Issue
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          removeRecipient(r.id);
                          setToast("Recipient removed");
                        }}
                        className="h-8 w-8 rounded-lg text-red-600 hover:bg-red-50 inline-flex items-center justify-center"
                      >
                        <Icon name="delete" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-[70] bg-black/40 flex items-center justify-center p-4">
          <form
            onSubmit={onSubmit}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-3"
          >
            <h3 className="text-[18px] font-bold">Add recipient</h3>
            {(
              [
                ["fullName", "Full name"],
                ["email", "Email"],
                ["matricNumber", "Matric"],
                ["program", "Program"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block">
                <span className="text-[12px] font-bold">{label}</span>
                <input
                  required
                  type={key === "email" ? "email" : "text"}
                  value={form[key]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                  className="mt-1 w-full h-11 rounded-xl border border-outline-variant/60 px-3 outline-none focus:border-[#0f766e]"
                />
              </label>
            ))}
            <label className="block">
              <span className="text-[12px] font-bold">Graduation year</span>
              <input
                required
                type="number"
                value={form.graduationYear}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    graduationYear: Number(e.target.value),
                  }))
                }
                className="mt-1 w-full h-11 rounded-xl border border-outline-variant/60 px-3 outline-none focus:border-[#0f766e]"
              />
            </label>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 h-11 rounded-xl border font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-11 rounded-xl bg-[#0f766e] text-white font-semibold"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      <Toast message={toast} onClose={() => setToast(null)} />
    </PageFrame>
  );
}
