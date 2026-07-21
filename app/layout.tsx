import type { Metadata } from "next";
import { inter, spaceGrotesk } from "./fonts";
import Navbar from "./components/Navbar";
import WhatsappButton from "./components/WhatsappButton";
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
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans">
        <Navbar priority />
        {children}
        <WhatsappButton />
      </body>
    </html>
  );
}
