import type { Metadata } from "next";
import { ChunkLoadRecovery } from "@/components/chunk-load-recovery";
import "./globals.css";

export const metadata: Metadata = {
  title: "AFTERBURN",
  description: "Exercise lifecycle intelligence for planning, execution, evaluation, and improvement"
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
