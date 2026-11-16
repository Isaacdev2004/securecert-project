import { PortalShell } from "@/components/shells/PortalShell";

export default function VerifierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PortalShell shell="verifier">{children}</PortalShell>;
}
