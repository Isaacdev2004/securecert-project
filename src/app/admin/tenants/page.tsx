"use client";

import { Suspense } from "react";
import { TenantsView } from "@/components/admin/TenantsView";

export default function Page() {
  return (
    <Suspense fallback={<div className="pt-24 px-6">Loading…</div>}>
      <TenantsView />
    </Suspense>
  );
}
