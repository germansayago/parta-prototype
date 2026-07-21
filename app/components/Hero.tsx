"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ChamferOutline from "./ChamferOutline";
import { chamferClipPath } from "./chamfer";

const SLIDE_DURATION = 6000;

const SLIDES = [
  { desktop: "/images/slide-1-desktop.webp", mobile: "/images/slide-1-mobile.webp" },
  { desktop: "/images/slide-2-desktop.webp", mobile: "/images/slide-2-mobile.webp" },
  { desktop: "/images/slide-3-desktop.webp", mobile: "/images/slide-3-mobile.webp" },
];

const WHATSAPP_NUMBER = "5493582406648";

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((i) => (i + 1) % SLIDES.length);
    }, SLIDE_DURATION);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Slides */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.desktop}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
          aria-hidden={i !== current}
        >
          <Image
            src={slide.desktop}
            alt=""
            fill
            priority={i === 0}
            className="hidden object-cover md:block"
            sizes="(min-width: 768px) 100vw, 0px"
          />
          <Image
            src={slide.mobile}
            alt=""
            fill
            priority={i === 0}
            className="object-cover md:hidden"
            sizes="(max-width: 767px) 100vw, 0px"
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="relative z-10 flex h-full w-full flex-col justify-between px-6 py-6 md:px-14 md:py-8">
        {/* Nav */}
        <div className="flex items-start justify-between">
          <a href="/" className="block">
            <Image src="/logo-white.webp" alt="PARTA" width={140} height={26} priority />
          </a>

          <a href="#contacto">
            <ChamferOutline variant="nav" cut={14} innerClassName="flex items-center px-5 py-2.5">
              <span className="text-xs font-semibold uppercase tracking-widest text-white">
                Contacto
              </span>
            </ChamferOutline>
          </a>
        </div>

        {/* Título y coordenadas quedaron incluidos en las fotos del slider */}
        <h1 className="sr-only">Bienvenido al Corazón Logístico de Argentina</h1>

        {/* CTA */}
        <div className="flex items-end justify-between">
          <a
            href="/brochure-parta.pdf"
            download
            className="flex items-center gap-3 bg-[var(--parta-blue)] px-6 py-4 text-white transition-opacity hover:opacity-90"
            style={{ clipPath: chamferClipPath("cta", 16) }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest sm:text-sm">
              Descargá el brochure
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 3v13m0 0-5-5m5 5 5-5M4 21h16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Escribinos por WhatsApp"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25D366] transition-opacity hover:opacity-90"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.13h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 5.83 2.42 8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.21-8.25 8.21Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.24-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42-.14-.01-.31-.01-.48-.01-.17 0-.43.06-.66.31-.23.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.17 1.73 2.64 4.2 3.7.59.25 1.05.4 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.1-.22-.16-.47-.28Z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
