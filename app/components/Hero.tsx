"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { chamferClipPath } from "./chamfer";

const SLIDE_DURATION = 6000;

const SLIDES = [
  { desktop: "/images/slide-1-desktop.webp", mobile: "/images/slide-1-mobile.webp" },
  { desktop: "/images/slide-2-desktop.webp", mobile: "/images/slide-2-mobile.webp" },
  { desktop: "/images/slide-3-desktop.webp", mobile: "/images/slide-3-mobile.webp" },
];

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
      <div className="relative z-10 flex h-full w-full flex-col justify-end px-6 py-6 md:px-14 md:py-8">
        {/* Título y coordenadas quedaron incluidos en las fotos del slider */}
        <h1 className="sr-only">Bienvenido al Corazón Logístico de Argentina</h1>

        {/* CTA */}
        <div className="mb-16 flex justify-center md:mb-24">
          <a
            id="download-brochure"
            href="/brochure-parta.pdf"
            download
            className="flex items-center gap-3 bg-[var(--parta-blue)] px-6 py-4 text-white transition-opacity hover:opacity-90"
            style={{ clipPath: chamferClipPath("cta", 10) }}
          >
            <span className="font-heading text-xs font-semibold uppercase tracking-widest sm:text-sm">
              Descargá el brochure
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 3v13m0 0-5-5m5 5 5-5M4 21h16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
