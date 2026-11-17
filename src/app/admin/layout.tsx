import { PortalShell } from "@/components/shells/PortalShell";
import { AdminStoreProvider } from "@/lib/admin/store";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminStoreProvider>
      <PortalShell shell="admin">{children}</PortalShell>
    </AdminStoreProvider>
  );
}
