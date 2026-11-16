"use client";

import { Suspense } from "react";
import { CredentialDetailView } from "@/components/institution/CredentialDetailView";

export default function CredentialDetailPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center text-on-surface-variant">
          Loading credential…
        </main>
      }
    >
      <CredentialDetailView />
    </Suspense>
  );
}
