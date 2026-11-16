"use client";

import { useEffect, useRef, useState } from "react";

type Stat = {
  end: number;
  suffix: string;
  prefix?: string;
  decimals?: number;
  label: string;
};

const STATS: Stat[] = [
  {
    end: 1.4,
    decimals: 1,
    suffix: "M+",
    label: "Digital credentials issued and verified",
  },
  {
    end: 142,
    suffix: "+",
    label: "Institutional enclaves on the ledger",
  },
  {
    end: 0,
    decimals: 2,
    suffix: "%",
    label: "Tamper breach rate across daily audits",
  },
  {
    end: 24.8,
    decimals: 1,
    prefix: "<",
    suffix: "ms",
    label: "Average global edge resolve latency",
  },
];

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function useCountUp(end: number, active: boolean, decimals = 0, duration = 1600) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const next = end * easeOutCubic(t);
      setValue(next);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, end, duration]);

  return decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
}

function StatItem({ stat, active }: { stat: Stat; active: boolean }) {
  const display = useCountUp(stat.end, active, stat.decimals ?? 0);

  return (
    <div className="text-center">
      <p className="marketing-display text-5xl md:text-6xl text-white tabular-nums">
        {stat.prefix}
        {display}
        {stat.suffix}
      </p>
      <p className="mt-3 text-[15px] text-teal-100/85 max-w-[240px] mx-auto">
        {stat.label}
      </p>
    </div>
  );
}

export function StatsCounters() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-[#134e4a] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,#5eead4,transparent_40%),radial-gradient(circle_at_80%_80%,#0f766e,transparent_40%)]" />
      <div className="relative mx-auto max-w-[1200px] px-5 md:px-8 py-16 md:py-24">
        <p className="text-center text-[15px] font-medium text-teal-100/90">
          SecureCert is powering national credential trust
        </p>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {STATS.map((stat) => (
            <StatItem key={stat.label} stat={stat} active={active} />
          ))}
        </div>
      </div>
    </section>
  );
}
