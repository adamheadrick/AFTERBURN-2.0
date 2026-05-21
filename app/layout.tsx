import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "./components/navigation";
import { Footer } from "./components/footer";

export const metadata: Metadata = {
  title: "AFTERBURN 2.0",
  description: "Exercise lifecycle intelligence platform."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main className="container">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
