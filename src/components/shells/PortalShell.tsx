"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  resolveStitchPath,
  type PortalShell as PortalShellName,
} from "@/lib/path-map";
import { PortalTopBar } from "@/components/shells/PortalTopBar";
import * as institutionChrome from "@/content/chrome/institution";
import * as partnerChrome from "@/content/chrome/partner";
import * as adminChrome from "@/content/chrome/admin";
import * as verifierChrome from "@/content/chrome/verifier";

const CHROME: Record<string, { asideHtml: string }> = {
  institution: institutionChrome,
  partner: partnerChrome,
  admin: adminChrome,
  verifier: verifierChrome,
};

const TAB_QUERY_KEYS = new Set(["sector", "tab", "panel", "view"]);

type Props = {
  shell: Exclude<PortalShellName, "public" | "blank" | "passport">;
  children: React.ReactNode;
};

function hrefKey(href: string) {
  try {
    const u = new URL(href, "http://local");
    return `${u.pathname}?${u.searchParams.toString()}`;
  } catch {
    return href;
  }
}

function PortalShellInner({ shell, children }: Props) {
  const asideRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const chrome = CHROME[shell];
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    setNavOpen(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!chrome) return;
    const root = asideRef.current;
    if (!root) return;

    const seen = new Set<string>();
    root.querySelectorAll("a").forEach((anchor) => {
      const dataPath = anchor.getAttribute("data-path");
      const resolved = resolveStitchPath(shell, dataPath);
      if (!resolved) return;
      anchor.setAttribute("href", resolved);
      anchor.setAttribute("data-legitscan-resolved", resolved);

      const key = hrefKey(resolved);
      if (seen.has(key)) {
        anchor.setAttribute("data-nav-duplicate", "true");
        (anchor as HTMLElement).style.display = "none";
        return;
      }
      seen.add(key);
      anchor.removeAttribute("data-nav-duplicate");
      (anchor as HTMLElement).style.display = "";
    });

    const asideEl = root.querySelector("aside");
    if (asideEl) {
      asideEl.classList.remove("fixed");
      asideEl.style.position = "absolute";
      asideEl.style.left = "0";
      asideEl.style.top = "0";
      asideEl.style.width = "100%";
      asideEl.style.height = "100%";
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.("a") as HTMLAnchorElement | null;
      if (!anchor || !root.contains(anchor)) return;

      const next =
        anchor.getAttribute("data-legitscan-resolved") ||
        resolveStitchPath(shell, anchor.getAttribute("data-path"));
      if (!next || next.startsWith("http")) return;
      event.preventDefault();
      setNavOpen(false);
      router.push(next);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [chrome, shell, pathname, router, searchParams]);

  useEffect(() => {
    const aside = asideRef.current;
    if (!aside) return;
    const nav = aside.querySelector("nav");
    const activeClasses =
      nav?.getAttribute("data-active-classes")?.split(/\s+/).filter(Boolean) ||
      [];

    const hasTabQuery = [...searchParams.keys()].some((k) =>
      TAB_QUERY_KEYS.has(k),
    );

    const isExactOnly = (path: string) =>
      path.endsWith("/dashboard") ||
      path === "/partner" ||
      path === "/verifier" ||
      path === "/admin/tenants" ||
      path === "/institution/dashboard";

    const isActiveHref = (href: string) => {
      if (!href) return false;
      let url: URL;
      try {
        url = new URL(href, "http://local");
      } catch {
        return false;
      }

      const pathMatch = isExactOnly(url.pathname)
        ? pathname === url.pathname
        : pathname === url.pathname || pathname.startsWith(`${url.pathname}/`);
      if (!pathMatch) return false;

      const hrefHasTab = [...url.searchParams.keys()].some((k) =>
        TAB_QUERY_KEYS.has(k),
      );

      if (hrefHasTab) {
        for (const [key, value] of url.searchParams.entries()) {
          if (!TAB_QUERY_KEYS.has(key)) continue;
          let current = searchParams.get(key);
          if (current === null && key === "tab") {
            if (url.pathname.startsWith("/partner/apikeys")) current = "keys";
            if (url.pathname.startsWith("/partner/billing")) current = "usage";
          }
          if (current !== value) return false;
        }
        return true;
      }

      if (hasTabQuery) return false;
      return true;
    };

    aside.querySelectorAll("a[data-path]").forEach((anchor) => {
      if (anchor.getAttribute("data-nav-duplicate") === "true") return;
      const href = anchor.getAttribute("data-legitscan-resolved") || "";
      const active = isActiveHref(href);

      if (active) anchor.setAttribute("aria-current", "page");
      else anchor.removeAttribute("aria-current");

      for (const cls of activeClasses) anchor.classList.remove(cls);
      if (active && activeClasses.length) {
        anchor.classList.add(...activeClasses);
      }
    });
  }, [pathname, searchParams, shell]);

  useEffect(() => {
    if (!navOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [navOpen]);

  if (!chrome) return <>{children}</>;

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface min-h-screen">
      <button
        type="button"
        aria-label="Close navigation"
        className={`fixed inset-0 z-[55] bg-black/40 transition-opacity lg:hidden ${
          navOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setNavOpen(false)}
      />

      <div
        className={`fixed inset-y-0 left-0 z-[60] w-72 max-w-[85vw] transform transition-transform duration-200 ease-out lg:translate-x-0 ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          ref={asideRef}
          className="relative h-full w-full"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: chrome.asideHtml }}
        />
      </div>

      <div className="relative min-h-screen flex flex-col lg:pl-72">
        <PortalTopBar
          shell={shell}
          navOpen={navOpen}
          onToggleNav={() => setNavOpen((o) => !o)}
        />
        <div className="relative w-full flex-1 bg-surface">{children}</div>
      </div>
    </div>
  );
}

export function PortalShell(props: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface" />}>
      <PortalShellInner {...props} />
    </Suspense>
  );
}
