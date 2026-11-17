"use client";

import { useState } from "react";
import { Icon } from "@/components/marketing/Icon";

/**
 * How to go live:
 * 1. Drop the file at public/videos/legitscan-intro.mp4
 * 2. Optional poster: public/videos/legitscan-intro-poster.jpg
 * 3. Set ready: true below
 *
 * Or paste a YouTube/Vimeo embed URL into embedUrl (ready can stay false).
 */
export const INTRO_VIDEO = {
  ready: true,
  src: "/videos/legitscan-intro.mp4",
  /** Optional cover image before play. */
  poster: "" as string,
  embedUrl: "" as string,
};

export function IntroVideo() {
  const [playing, setPlaying] = useState(false);
  const useEmbed = Boolean(INTRO_VIDEO.embedUrl);
  const canPlay = useEmbed || INTRO_VIDEO.ready;

  return (
    <section className="bg-white border-y border-gray-100">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[13px] font-bold tracking-[0.14em] uppercase text-[#0f766e]">
            Watch
          </p>
          <h2 className="marketing-display mt-3 text-[clamp(1.85rem,3.5vw,2.75rem)] text-gray-950">
            See LegitScan in two minutes
          </h2>
          <p className="mt-4 text-[16px] md:text-[17px] leading-relaxed text-gray-600">
            A short walkthrough of how organisations issue credentials, documents,
            and product marks — and how anyone authorised verifies authenticity.
          </p>
        </div>

        <div className="mt-10 md:mt-12 relative mx-auto max-w-4xl">
          <div className="relative aspect-video overflow-hidden rounded-2xl md:rounded-3xl bg-[#0b1c30] shadow-[0_24px_60px_-28px_rgba(15,118,110,0.55)] ring-1 ring-black/5">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(20,184,166,0.35),transparent_55%),radial-gradient(ellipse_at_80%_80%,rgba(15,118,110,0.25),transparent_50%)]" />

            {useEmbed ? (
              <iframe
                title="LegitScan introductory video"
                src={INTRO_VIDEO.embedUrl}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : INTRO_VIDEO.ready && playing ? (
              <video
                className="absolute inset-0 h-full w-full object-cover bg-black"
                src={INTRO_VIDEO.src}
                poster={INTRO_VIDEO.poster || undefined}
                controls
                autoPlay
                playsInline
              />
            ) : (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
                style={
                  INTRO_VIDEO.ready && INTRO_VIDEO.poster
                    ? {
                        backgroundImage: `linear-gradient(rgba(11,28,48,0.45), rgba(11,28,48,0.65)), url(${INTRO_VIDEO.poster})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : undefined
                }
              >
                {!INTRO_VIDEO.ready && (
                  <div className="absolute inset-0 opacity-40 pointer-events-none">
                    <div className="absolute left-1/2 top-1/2 h-[120%] w-[70%] -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] rounded-full bg-teal-400/20 blur-3xl" />
                  </div>
                )}
                <div className="relative">
                  <button
                    type="button"
                    disabled={!canPlay}
                    onClick={() => setPlaying(true)}
                    className="group mx-auto flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-white text-[#0f766e] shadow-lg transition-transform hover:scale-105 disabled:cursor-default"
                    aria-label={
                      canPlay
                        ? "Play LegitScan intro video"
                        : "Intro video coming soon"
                    }
                  >
                      <Icon name="play_arrow" size={40} filled weight={600} className="ml-0.5" />
                  </button>
                  <p className="mt-5 text-[15px] md:text-[16px] font-semibold text-white">
                    {canPlay
                      ? "Play introduction"
                      : "Introductory video coming soon"}
                  </p>
                  <p className="mt-1.5 text-[13px] text-white/65 max-w-sm mx-auto">
                    Issue → share → verify anywhere
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
