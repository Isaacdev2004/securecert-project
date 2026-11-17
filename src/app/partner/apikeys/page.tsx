"use client";

import { Suspense } from "react";
import { ApiKeysView } from "@/components/partner/ApiKeysView";

export default function Page() {
  return (
    <Suspense fallback={<div className="pt-24 px-6">Loading…</div>}>
      <ApiKeysView />
    </Suspense>
  );
}
