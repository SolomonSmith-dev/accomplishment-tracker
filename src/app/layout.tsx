import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Work Tracker",
  description: "Log and track daily work accomplishments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main style={{ maxWidth: 960, margin: "0 auto", padding: "16px 20px" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
