import { PortalShell } from "@/components/shells/PortalShell";
import { VerifierStoreProvider } from "@/lib/verifier/store";

export default function VerifierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <VerifierStoreProvider>
      <PortalShell shell="verifier">{children}</PortalShell>
    </VerifierStoreProvider>
  );
}
