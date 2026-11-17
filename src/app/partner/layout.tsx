import { PortalShell } from "@/components/shells/PortalShell";
import { PartnerStoreProvider } from "@/lib/partner/store";

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PartnerStoreProvider>
      <PortalShell shell="partner">{children}</PortalShell>
    </PartnerStoreProvider>
  );
}
