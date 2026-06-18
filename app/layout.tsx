import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PARTA — Parque Industrial y Logístico",
  description: "El corazón logístico de Argentina",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
