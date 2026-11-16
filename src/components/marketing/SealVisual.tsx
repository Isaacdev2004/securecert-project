/** Full-bleed abstract seal / ledger motif for the hero plane */
export function SealVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none marketing-fade" aria-hidden>
      <div className="absolute inset-0 marketing-haze" />
      <div className="absolute inset-0 marketing-ledger opacity-70" />

      {/* Soft depth orbs */}
      <div className="absolute -right-[10%] top-[8%] h-[70vmin] w-[70vmin] rounded-full bg-[#01968b]/10 blur-3xl" />
      <div className="absolute -left-[15%] bottom-[0%] h-[55vmin] w-[55vmin] rounded-full bg-[#40627c]/12 blur-3xl" />

      {/* Giant seal mark — dominant visual plane */}
      <svg
        className="absolute right-[-18%] sm:right-[-6%] lg:right-[0%] top-[22%] sm:top-[10%] w-[min(120vw,760px)] h-[min(120vw,760px)] text-[#101e35]"
        viewBox="0 0 400 400"
        fill="none"
      >
        <circle
          className="marketing-seal-path"
          cx="200"
          cy="200"
          r="168"
          stroke="currentColor"
          strokeWidth="1.1"
          opacity="0.55"
        />
        <circle
          cx="200"
          cy="200"
          r="132"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 5"
          opacity="0.4"
        />
        <circle
          className="marketing-seal-path"
          cx="200"
          cy="200"
          r="96"
          stroke="#01968b"
          strokeWidth="1.4"
          opacity="0.75"
        />
        <path
          d="M200 48 C 110 110, 110 290, 200 352 C 290 290, 290 110, 200 48 Z"
          stroke="currentColor"
          strokeWidth="1.1"
          opacity="0.35"
        />
        <path
          d="M48 200 C 110 110, 290 110, 352 200 C 290 290, 110 290, 48 200 Z"
          stroke="currentColor"
          strokeWidth="1.1"
          opacity="0.35"
        />
        <circle cx="200" cy="200" r="7" fill="#01968b" opacity="0.9" />
      </svg>
    </div>
  );
}
