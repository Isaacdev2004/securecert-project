import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, JetBrains_Mono, Montserrat } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { AuthGate } from "@/components/AuthGate";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "SecureCert — Sovereign Credential Platform",
  description:
    "Tamper-proof academic & professional credential issuance, verification, and passport infrastructure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable} ${montserrat.variable} h-full`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full antialiased bg-surface text-on-surface font-body-md">
        <AuthProvider>
          <Suspense fallback={null}>
            <AuthGate>{children}</AuthGate>
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
