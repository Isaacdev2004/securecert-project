"use client";

import { Suspense } from "react";
import { BillingView } from "@/components/partner/BillingView";

export default function Page() {
  return (
    <Suspense fallback={<div className="pt-24 px-6">Loading…</div>}>
      <BillingView />
    </Suspense>
  );
}
