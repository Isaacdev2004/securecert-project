import { PortalShell } from "@/components/shells/PortalShell";

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PortalShell shell="partner">{children}</PortalShell>;
}
