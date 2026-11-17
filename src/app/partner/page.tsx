"use client";

import { Suspense } from "react";
import { OverviewView } from "@/components/partner/OverviewView";

export default function Page() {
  return (
    <Suspense fallback={<div className="pt-24 px-6">Loading…</div>}>
      <OverviewView />
    </Suspense>
  );
}
