"use client";

import { useState } from "react";

type Org = {
  name: string;
  short: string;
  /** Local image under /public/logos */
  src: string;
};

const ORGS: Org[] = [
  { name: "UNILAG", short: "UL", src: "/logos/unilag.png" },
  { name: "UI", short: "UI", src: "/logos/ui.png" },
  { name: "OAU", short: "OA", src: "/logos/oau.png" },
  { name: "WAEC", short: "WA", src: "/logos/waec.png" },
  { name: "NUC", short: "NU", src: "/logos/nuc.png" },
  { name: "WES", short: "WE", src: "/logos/wes.png" },
  { name: "EduSoft", short: "ES", src: "/logos/edusoft.svg" },
];

function LogoItem({ org }: { org: Org }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="flex items-center gap-3 shrink-0 px-8 md:px-12">
      <span className="relative h-11 w-11 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden">
        {!failed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={org.src}
            alt={`${org.name} logo`}
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
            loading="lazy"
            onError={() => setFailed(true)}
          />
        ) : (
          <span className="text-[12px] font-extrabold text-gray-500" aria-hidden>
            {org.short}
          </span>
        )}
      </span>
      <span className="text-[15px] font-extrabold tracking-tight text-gray-600 whitespace-nowrap">
        {org.name}
      </span>
    </div>
  );
}

export function LogoMarquee() {
  const track = [...ORGS, ...ORGS, ...ORGS];

  return (
    <section className="border-y border-gray-100 bg-gray-50 overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8 pt-10 pb-4">
        <p className="text-center text-[15px] font-medium text-gray-600">
          Trusted by leading universities, exam bodies, and evaluation partners
        </p>
      </div>

      <div className="relative py-8">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-28 z-10 bg-gradient-to-r from-gray-50 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-28 z-10 bg-gradient-to-l from-gray-50 to-transparent" />

        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {track.map((org, i) => (
            <LogoItem key={`${org.name}-${i}`} org={org} />
          ))}
        </div>
      </div>
    </section>
  );
}
