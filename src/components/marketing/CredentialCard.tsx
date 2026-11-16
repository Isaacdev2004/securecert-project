import { Icon } from "@/components/marketing/Icon";

/** Light product credential — Accredible-style certificate mock */
export function CredentialCard() {
  return (
    <div className="relative w-full max-w-[400px] mx-auto">
      <div className="absolute -inset-6 bg-[#99f6e4]/50 blur-3xl rounded-full" />

      <article className="marketing-card-float relative overflow-hidden rounded-2xl bg-white shadow-[0_25px_60px_-15px_rgba(15,23,42,0.25)] border border-gray-100">
        <div className="h-2 bg-gradient-to-r from-[#0f766e] via-[#14b8a6] to-[#5eead4]" />

        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#0f766e]">
                Verified credential
              </p>
              <p className="mt-1 text-[12px] text-gray-500">University of Lagos</p>
            </div>
            <span className="h-10 w-10 rounded-full bg-[#ccfbf1] text-[#0f766e] flex items-center justify-center">
              <Icon name="verified" size={22} filled weight={600} />
            </span>
          </div>

          <div className="mt-6 flex gap-4">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-[#134e4a] to-[#0f766e] flex items-center justify-center text-white shrink-0 shadow-md">
              <Icon name="school" size={32} weight={500} />
            </div>
            <div className="min-w-0">
              <h3 className="text-[1.15rem] font-extrabold text-gray-950 leading-snug">
                B.Eng. Electrical &amp; Electronics Engineering
              </h3>
              <p className="mt-1 text-[13px] font-semibold text-[#0f766e]">
                First Class Honours
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-gray-50 border border-gray-100 p-4 space-y-2.5">
            <div className="flex justify-between text-[13px]">
              <span className="text-gray-500">Recipient</span>
              <span className="font-semibold text-gray-900">Babatunde A. Emmanuel</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-gray-500">Matric</span>
              <span className="font-mono text-[12px] font-semibold text-gray-900">
                180407044
              </span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-gray-500">Issued</span>
              <span className="font-semibold text-gray-900">Nov 2024</span>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              className="flex-1 h-10 rounded-full bg-[#0f766e] text-white text-[13px] font-semibold"
            >
              Share credential
            </button>
            <button
              type="button"
              className="h-10 px-4 rounded-full border border-gray-200 text-[13px] font-semibold text-gray-800"
            >
              Verify
            </button>
          </div>
        </div>
      </article>

      {/* Floating badge */}
      <div className="absolute -left-3 sm:-left-6 top-24 rounded-xl bg-white shadow-lg border border-gray-100 px-3 py-2 flex items-center gap-2">
        <span className="h-8 w-8 rounded-full bg-[#dcfce7] text-[#15803d] flex items-center justify-center">
          <Icon name="done_all" size={18} filled weight={600} />
        </span>
        <div>
          <p className="text-[11px] font-bold text-gray-900">Authentic</p>
          <p className="text-[10px] text-gray-500">Merkle proof valid</p>
        </div>
      </div>
    </div>
  );
}
