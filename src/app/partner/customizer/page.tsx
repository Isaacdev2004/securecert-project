'use client';

import { StitchRenderer } from "@/components/StitchRenderer";
import { html, bodyClass } from "@/content/screens/partner-customizer";

export default function Page() {
  return <StitchRenderer html={html} bodyClass={bodyClass} shell="partner" />;
}
