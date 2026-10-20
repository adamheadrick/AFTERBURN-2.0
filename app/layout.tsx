import type { Metadata } from "next";
import { ChunkLoadRecovery } from "@/components/chunk-load-recovery";
import "./globals.css";

export const metadata: Metadata = {
  title: "AFTERBURN",
  description: "Plan, execute, review, and improve response exercises. A workspace for military and civilian exercise planners."
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
