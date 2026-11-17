import { PassportShell } from "@/components/shells/PassportShell";
import { PassportStoreProvider } from "@/lib/passport/store";

export default function PassportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PassportStoreProvider>
      <PassportShell>{children}</PassportShell>
    </PassportStoreProvider>
  );
}
