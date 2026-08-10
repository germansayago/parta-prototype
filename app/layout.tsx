import type { Metadata } from "next";
import Script from "next/script";
import { inter, spaceGrotesk } from "./fonts";
import Navbar from "./components/Navbar";
import WhatsappButton from "./components/WhatsappButton";
import "./globals.css";

const GTM_ID = "GTM-5FRR4PVZ";
// Deshabilitado en `next dev` (NODE_ENV=development) para no ensuciar los datos
// de Google Analytics con navegación local — sigue activo en cualquier build de
// producción real (`next build && next start`, que es lo que corre el hosting).
const GTM_ENABLED = process.env.NODE_ENV === "production";

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
      <head>
        {GTM_ENABLED && (
          <Script id="gtm-script" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}
      </head>
      <body className="font-sans">
        {GTM_ENABLED && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        <Navbar priority />
        {children}
        <WhatsappButton />
      </body>
    </html>
  );
}
