"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  resolveLabelPath,
  resolveStitchPath,
  shellFromPathname,
  type PortalShell,
} from "@/lib/path-map";
import { stripDashboardChrome, stripPassportChrome } from "@/lib/strip-chrome";
import { RoleSwitcher } from "@/components/RoleSwitcher";

type Props = {
  html: string;
  bodyClass?: string;
  shell?: string;
  /** When true, chrome comes from PortalShell / PassportShell */
  embedded?: boolean;
};

const EMBEDDED_SHELLS = new Set([
  "institution",
  "partner",
  "admin",
  "verifier",
  "passport",
]);

function resolveHref(
  anchor: HTMLAnchorElement,
  shell: PortalShell,
): string | null {
  const dataPath = anchor.getAttribute("data-path");
  const fromPath = resolveStitchPath(shell, dataPath);
  if (fromPath) return fromPath;

  const href = anchor.getAttribute("href") || "";
  if (href.startsWith("http")) return href;
  if (href.startsWith("/") && !href.startsWith("//")) return href;

  if (!href || href === "#" || href.startsWith("javascript:") || href.startsWith("#")) {
    return resolveLabelPath(shell, anchor.textContent || "");
  }

  return null;
}

export function StitchRenderer({
  html,
  bodyClass,
  shell,
  embedded,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const activeShell = (shell as PortalShell) || shellFromPathname(pathname);
  const isEmbedded = embedded ?? EMBEDDED_SHELLS.has(activeShell);

  const contentHtml = useMemo(() => {
    if (!isEmbedded) return html;
    if (activeShell === "passport") return stripPassportChrome(html);
    return stripDashboardChrome(html);
  }, [html, isEmbedded, activeShell]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    host.querySelectorAll("a").forEach((node) => {
      const anchor = node as HTMLAnchorElement;
      const next = resolveHref(anchor, activeShell);
      if (next && next.startsWith("/")) {
        anchor.setAttribute("href", next);
        anchor.setAttribute("data-legitscan-resolved", next);
      }
    });

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.("a") as HTMLAnchorElement | null;
      if (!anchor || !host.contains(anchor)) return;

      const resolved =
        anchor.getAttribute("data-legitscan-resolved") ||
        resolveHref(anchor, activeShell);
      if (!resolved || resolved.startsWith("http")) return;

      event.preventDefault();
      event.stopPropagation();
      router.push(resolved);
    };

    host.addEventListener("click", onClick, true);

    const onSubmit = async (event: Event) => {
      const form = event.target as HTMLFormElement | null;
      if (!form || !host.contains(form)) return;
      event.preventDefault();

      const fd = new FormData(form);
      const values = Object.fromEntries(fd.entries());
      const textInputs = Array.from(
        form.querySelectorAll("input[type='text'], input:not([type]), textarea"),
      ) as HTMLInputElement[];
      const firstValue =
        String(values.query || values.did || values.nonce || values.email || "") ||
        textInputs[0]?.value ||
        "";

      if (activeShell === "public") {
        const isOnboarding = pathname.includes("onboarding");
        if (isOnboarding) {
          const res = await fetch("/api/onboarding", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              organization_name: firstValue || "Enterprise Inquiry",
              contact_email:
                textInputs.find((i) => i.type === "email")?.value ||
                "briefing@example.com",
              contact_name: textInputs[1]?.value || "",
              notes:
                (form.querySelector("textarea") as HTMLTextAreaElement)?.value ||
                "",
            }),
          });
          const data = await res.json();
          window.alert(
            data.ok
              ? `Onboarding request received (${data.id}).`
              : data.error || "Request failed",
          );
          return;
        }

        if (pathname.startsWith("/verify")) {
          const res = await fetch("/api/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: firstValue || "180407044" }),
          });
          const data = await res.json();
          if (data.result === "VALID") {
            sessionStorage.setItem(
              "legitscan.lastVerify",
              JSON.stringify(data.credential),
            );
            router.push("/verify/result");
          } else {
            window.alert(
              data.message ||
                `Verification result: ${data.result || "NOT_FOUND"}`,
            );
          }
        }
      }
    };
    host.addEventListener("submit", onSubmit);

    return () => {
      host.removeEventListener("click", onClick, true);
      host.removeEventListener("submit", onSubmit);
    };
  }, [contentHtml, router, activeShell, pathname]);

  return (
    <>
      <div
        ref={hostRef}
        className={isEmbedded ? undefined : bodyClass}
        data-shell={activeShell}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
      {!isEmbedded && (
        <div className="fixed top-3 right-4 z-[100]">
          <RoleSwitcher />
        </div>
      )}
    </>
  );
}
