"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  resolveStitchPath,
  type PortalShell as PortalShellName,
} from "@/lib/path-map";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import * as institutionChrome from "@/content/chrome/institution";
import * as partnerChrome from "@/content/chrome/partner";
import * as adminChrome from "@/content/chrome/admin";
import * as verifierChrome from "@/content/chrome/verifier";

const CHROME: Record<
  string,
  { asideHtml: string; headerHtml: string }
> = {
  institution: institutionChrome,
  partner: partnerChrome,
  admin: adminChrome,
  verifier: verifierChrome,
};

type Props = {
  shell: Exclude<PortalShellName, "public" | "blank" | "passport">;
  children: React.ReactNode;
};

export function PortalShell({ shell, children }: Props) {
  const asideRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const chrome = CHROME[shell];

  useEffect(() => {
    if (!chrome) return;

    const roots = [asideRef.current, headerRef.current].filter(
      Boolean,
    ) as HTMLDivElement[];

    const wire = (root: HTMLDivElement) => {
      root.querySelectorAll("a").forEach((anchor) => {
        const dataPath = anchor.getAttribute("data-path");
        const resolved = resolveStitchPath(shell, dataPath);
        if (resolved) {
          anchor.setAttribute("href", resolved);
          anchor.setAttribute("data-securecert-resolved", resolved);
        }

      });
    };

    roots.forEach(wire);

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      const inChrome = roots.some((r) => r.contains(anchor));
      if (!inChrome) return;

      const next =
        anchor.getAttribute("data-securecert-resolved") ||
        resolveStitchPath(shell, anchor.getAttribute("data-path"));
      if (!next || next.startsWith("http")) return;
      event.preventDefault();
      router.push(next);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [chrome, shell, pathname, router]);

  // Active class sync from Stitch data-active-classes on parent nav
  useEffect(() => {
    const aside = asideRef.current;
    if (!aside) return;
    const nav = aside.querySelector("nav");
    const activeClasses =
      nav?.getAttribute("data-active-classes")?.split(/\s+/).filter(Boolean) ||
      [];

    const isExactOnly = (href: string) =>
      href.endsWith("/dashboard") ||
      href === "/partner" ||
      href === "/verifier" ||
      href === "/admin/tenants";

    const isActiveHref = (href: string) => {
      if (!href) return false;
      if (isExactOnly(href)) return pathname === href;
      return pathname === href || pathname.startsWith(`${href}/`);
    };

    aside.querySelectorAll("a[data-path]").forEach((anchor) => {
      const href = anchor.getAttribute("data-securecert-resolved") || "";
      const active = isActiveHref(href);

      if (active) anchor.setAttribute("aria-current", "page");
      else anchor.removeAttribute("aria-current");

      for (const cls of activeClasses) anchor.classList.remove(cls);
      // Also clear hover-neutral leftovers that stitch uses as "inactive"
      if (active && activeClasses.length) {
        anchor.classList.add(...activeClasses);
      }
    });
  }, [pathname, shell]);

  if (!chrome) return <>{children}</>;

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface min-h-screen">
      <div
        ref={asideRef}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: chrome.asideHtml }}
      />
      <div className="pl-72 min-h-screen">
        <div
          ref={headerRef}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: chrome.headerHtml }}
        />
        <div className="relative w-full min-h-screen bg-surface">{children}</div>
      </div>
      <RoleSwitcher />
    </div>
  );
}
