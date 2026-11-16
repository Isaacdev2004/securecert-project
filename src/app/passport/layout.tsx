import { PassportShell } from "@/components/shells/PassportShell";

export default function PassportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PassportShell>{children}</PassportShell>;
}
