import { PortalShell } from "@/components/shells/PortalShell";
import { InstitutionStoreProvider } from "@/lib/institution/store";

export default function InstitutionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <InstitutionStoreProvider>
      <PortalShell shell="institution">{children}</PortalShell>
    </InstitutionStoreProvider>
  );
}
