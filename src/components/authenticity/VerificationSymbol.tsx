"use client";

import { useEffect, useMemo, useState } from "react";
import {
  EDUCATION_LEVELS,
  GOVERNMENT_SEAL,
  type EducationLevel,
} from "@/lib/authenticity/symbols";

type Size = "sm" | "md" | "lg" | "xl";

const SIZE_PX: Record<Size, number> = {
  sm: 96,
  md: 148,
  lg: 200,
  xl: 280,
};

type EducationProps = {
  family: "EDUCATION";
  level: EducationLevel;
  /** Unique payload encoded into the QR (DID, share token, or verify URL). */
  value: string;
  size?: Size;
  className?: string;
  showLegend?: boolean;
};

type GovernmentProps = {
  family: "GOVERNMENT";
  value: string;
  size?: Size;
  className?: string;
  showLegend?: boolean;
};

export type VerificationSymbolProps = EducationProps | GovernmentProps;

/** Deterministic pseudo-QR matrix when the qrcode package is unavailable. */
function hashMatrix(seed: string, modules = 21): boolean[][] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const grid: boolean[][] = Array.from({ length: modules }, () =>
    Array.from({ length: modules }, () => false),
  );

  function setFinder(ox: number, oy: number) {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        const edge = x === 0 || y === 0 || x === 6 || y === 6;
        const core = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        grid[oy + y][ox + x] = edge || core;
      }
    }
  }

  setFinder(0, 0);
  setFinder(modules - 7, 0);
  setFinder(0, modules - 7);

  for (let y = 0; y < modules; y++) {
    for (let x = 0; x < modules; x++) {
      if (grid[y][x]) continue;
      if ((x < 8 && y < 8) || (x >= modules - 8 && y < 8) || (x < 8 && y >= modules - 8))
        continue;
      h = Math.imul(h ^ (x * 73856093) ^ (y * 19349663), 2246822519);
      grid[y][x] = (h >>> 0) % 3 !== 0;
    }
  }
  return grid;
}

function QrModules({
  value,
  color,
  modules = 25,
}: {
  value: string;
  color: string;
  modules?: number;
}) {
  const [realModules, setRealModules] = useState<boolean[][] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const QR = (await import("qrcode")).default;
        const raw = await QR.create(value, { errorCorrectionLevel: "H" });
        const size = raw.modules.size;
        const data = raw.modules.data;
        const grid: boolean[][] = [];
        for (let y = 0; y < size; y++) {
          const row: boolean[] = [];
          for (let x = 0; x < size; x++) {
            row.push(Boolean(data[y * size + x]));
          }
          grid.push(row);
        }
        if (!cancelled) setRealModules(grid);
      } catch {
        if (!cancelled) setRealModules(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [value]);

  const grid = realModules ?? hashMatrix(value, modules);
  const n = grid.length;
  const cell = 100 / n;

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <rect width="100" height="100" fill="#ffffff" />
      {grid.map((row, y) =>
        row.map((on, x) =>
          on ? (
            <rect
              key={`${x}-${y}`}
              x={x * cell}
              y={y * cell}
              width={cell}
              height={cell}
              fill={color}
            />
          ) : null,
        ),
      )}
    </svg>
  );
}

function EducationShieldSymbol({
  level,
  value,
  px,
  showLegend,
  className,
}: {
  level: EducationLevel;
  value: string;
  px: number;
  showLegend?: boolean;
  className?: string;
}) {
  const meta = EDUCATION_LEVELS[level];
  const navy = "#0b1c3a";

  return (
    <figure className={`inline-flex flex-col items-center gap-2 ${className ?? ""}`}>
      <div style={{ width: px, height: px * 1.15 }} className="relative">
        <svg viewBox="0 0 200 230" className="absolute inset-0 h-full w-full" aria-hidden>
          <path
            d="M100 8 C 168 8, 188 28, 188 28 L 188 118 C 188 178, 140 214, 100 222 C 60 214, 12 178, 12 118 L 12 28 C 12 28, 32 8, 100 8 Z"
            fill="#ffffff"
            stroke={navy}
            strokeWidth="14"
            strokeLinejoin="round"
          />
        </svg>
        <div
          className="absolute overflow-hidden bg-white"
          style={{
            left: "18%",
            right: "18%",
            top: "16%",
            bottom: "22%",
          }}
        >
          <QrModules value={value} color={navy} />
        </div>
        {/* Level verification mark — colour is the education segmentation */}
        <div
          className="absolute flex items-center justify-center rounded-full shadow-md"
          style={{
            width: px * 0.28,
            height: px * 0.28,
            right: "10%",
            bottom: "14%",
            backgroundColor: meta.markColor,
            border: `3px solid #ffffff`,
          }}
          aria-hidden
        >
          <svg viewBox="0 0 24 24" className="h-[55%] w-[55%]" fill="none">
            <path
              d="M5 12.5l4.2 4.2L19 7.5"
              stroke="#ffffff"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      {showLegend && (
        <figcaption className="text-center">
          <p className="text-[12px] font-bold tracking-wide text-gray-900">
            {meta.shortLabel} certificate
          </p>
          <p className="text-[11px] text-gray-500">
            Unique QR ·{" "}
            <span style={{ color: meta.markColor }} className="font-semibold">
              {meta.shortLabel.toLowerCase()} mark
            </span>
          </p>
        </figcaption>
      )}
    </figure>
  );
}

function GovernmentSealSymbol({
  value,
  px,
  showLegend,
  className,
}: {
  value: string;
  px: number;
  showLegend?: boolean;
  className?: string;
}) {
  const { navy, gold, ringTop, ringBottom, certified, confirmed } = GOVERNMENT_SEAL;

  const topArc = useMemo(() => {
    const chars = ringTop.split("");
    return chars.map((ch, i) => {
      const t = (i / (chars.length - 1 || 1)) * Math.PI - Math.PI;
      const x = 100 + Math.cos(t + Math.PI) * 78;
      const y = 100 + Math.sin(t + Math.PI) * 78;
      const rot = ((t + Math.PI) * 180) / Math.PI + 90;
      return { ch, x, y, rot };
    });
  }, [ringTop]);

  return (
    <figure className={`inline-flex flex-col items-center gap-2 ${className ?? ""}`}>
      <div style={{ width: px, height: px }} className="relative">
        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full drop-shadow-md">
          <defs>
            <radialGradient id="govGold" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#f0d878" />
              <stop offset="45%" stopColor={gold} />
              <stop offset="100%" stopColor="#8a6b12" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="98" fill="url(#govGold)" />
          <circle cx="100" cy="100" r="92" fill="none" stroke={navy} strokeWidth="1.5" opacity="0.35" />
          <circle cx="100" cy="100" r="86" fill={navy} />
          <circle cx="100" cy="100" r="68" fill="url(#govGold)" />
          {/* Laurel-ish arcs */}
          <path
            d="M42 118 C 48 88, 62 68, 78 58"
            fill="none"
            stroke={navy}
            strokeWidth="2"
            opacity="0.55"
          />
          <path
            d="M158 118 C 152 88, 138 68, 122 58"
            fill="none"
            stroke={navy}
            strokeWidth="2"
            opacity="0.55"
          />
          {topArc.map(({ ch, x, y, rot }) => (
            <text
              key={`${ch}-${x}`}
              x={x}
              y={y}
              fill={gold}
              fontSize="7.5"
              fontWeight="700"
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${rot} ${x} ${y})`}
            >
              {ch}
            </text>
          ))}
          <text
            x="100"
            y="178"
            fill={gold}
            fontSize="6.5"
            fontWeight="700"
            textAnchor="middle"
            letterSpacing="0.5"
          >
            {ringBottom}
          </text>
          <text
            x="100"
            y="48"
            fill={navy}
            fontSize="5.5"
            fontWeight="700"
            textAnchor="middle"
            letterSpacing="1"
          >
            {certified}
          </text>
          <text
            x="100"
            y="156"
            fill={navy}
            fontSize="5"
            fontWeight="700"
            textAnchor="middle"
            letterSpacing="0.6"
          >
            {confirmed}
          </text>
          <rect x="58" y="58" width="84" height="84" rx="4" fill="#ffffff" />
          {/* Centre shield mark on QR */}
          <g transform="translate(100 100)">
            <path
              d="M0 -14 L12 -8 L12 6 C 12 12, 6 16, 0 18 C -6 16, -12 12, -12 6 Z"
              fill={gold}
              stroke={navy}
              strokeWidth="1.2"
            />
            <path
              d="M-5 1 L-1 5 L6 -4"
              fill="none"
              stroke={navy}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
        <div
          className="absolute overflow-hidden rounded-sm"
          style={{
            left: "31%",
            right: "31%",
            top: "31%",
            bottom: "31%",
          }}
        >
          <QrModules value={value} color={navy} modules={21} />
        </div>
        {/* Overlay shield sits above QR centre */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: px * 0.22, height: px * 0.26 }}
          aria-hidden
        >
          <svg viewBox="0 0 40 48" className="h-full w-full drop-shadow">
            <path
              d="M20 2 L36 10 L36 28 C 36 38, 28 44, 20 46 C 12 44, 4 38, 4 28 L 4 10 Z"
              fill={gold}
              stroke={navy}
              strokeWidth="2"
            />
            <path
              d="M12 24 L18 30 L28 16"
              fill="none"
              stroke={navy}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      {showLegend && (
        <figcaption className="text-center">
          <p className="text-[12px] font-bold tracking-wide text-gray-900">
            Government document seal
          </p>
          <p className="text-[11px] text-gray-500">Unique QR · official seal design</p>
        </figcaption>
      )}
    </figure>
  );
}

/** Unique verification symbol: education shield (level-coloured mark) or government seal. */
export function VerificationSymbol(props: VerificationSymbolProps) {
  const px = SIZE_PX[props.size ?? "md"];
  if (props.family === "GOVERNMENT") {
    return (
      <GovernmentSealSymbol
        value={props.value}
        px={px}
        showLegend={props.showLegend}
        className={props.className}
      />
    );
  }
  return (
    <EducationShieldSymbol
      level={props.level}
      value={props.value}
      px={px}
      showLegend={props.showLegend}
      className={props.className}
    />
  );
}

/** Compact strip showing all education level marks for marketing / designer. */
export function EducationLevelLegend({ className = "" }: { className?: string }) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 ${className}`}>
      {(Object.keys(EDUCATION_LEVELS) as EducationLevel[]).map((level) => {
        const meta = EDUCATION_LEVELS[level];
        return (
          <div
            key={level}
            className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm"
          >
            <VerificationSymbol
              family="EDUCATION"
              level={level}
              value={`legitscan:demo:${level.toLowerCase()}`}
              size="sm"
            />
            <p className="mt-3 text-[13px] font-bold text-gray-900">{meta.label}</p>
            <p className="mt-1 text-[11px] text-gray-500">
              Mark colour:{" "}
              <span className="font-semibold" style={{ color: meta.markColor }}>
                {meta.shortLabel.toLowerCase()}
              </span>
            </p>
          </div>
        );
      })}
    </div>
  );
}
