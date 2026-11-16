import { PortalShell } from "@/components/shells/PortalShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PortalShell shell="admin">{children}</PortalShell>;
}
