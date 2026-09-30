import type { Metadata } from "next";
import { ChunkLoadRecovery } from "@/components/chunk-load-recovery";
import "./globals.css";

export const metadata: Metadata = {
  title: "AFTERBURN",
  description: "The operational memory of high-readiness organizations. Plan, execute, review, improve, and learn with an operational learning and readiness platform."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ChunkLoadRecovery />
        {children}
      </body>
    </html>
  );
}
