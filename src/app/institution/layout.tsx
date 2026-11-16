import { PortalShell } from "@/components/shells/PortalShell";

export default function InstitutionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PortalShell shell="institution">{children}</PortalShell>;
}
