"use client";

import { Suspense } from "react";
import { StitchRenderer } from "@/components/StitchRenderer";
import { html, bodyClass } from "@/content/screens/institution-credential-detail";

function CredentialDetailInner() {
  return (
    <StitchRenderer html={html} bodyClass={bodyClass} shell="institution" />
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center text-on-surface-variant">
          Loading credential…
        </main>
      }
    >
      <CredentialDetailInner />
    </Suspense>
  );
}
