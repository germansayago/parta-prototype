"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { scrollToElement } from "./SmoothScroll";

// Rediseño 2026-08-10 (designs/navbar/navbar-{desktop,mobile}.png): desktop
// pasa de logo+botón "Contacto" a logo + fila completa de links; mobile pasa
// a hamburguesa + logo centrado + Instagram/LinkedIn (mismos ícono/URL que
// el footer, ver Footer.tsx). "Ubicación" e "Inversores" no tienen sección
// propia todavía — quedan deshabilitados (decisión del cliente) hasta que
// exista algo a donde apuntar.
const NAV_LINKS: { label: string; href: string | null }[] = [
  { label: "Quiénes somos", href: "#quienes-somos" },
  { label: "Ubicación", href: null },
  { label: "Lotes", href: "#lotes" },
  { label: "Zonificación", href: "#zonificacion" },
  { label: "Infraestructura y Servicios", href: "#servicios" },
  { label: "Inversores", href: null },
  { label: "Contacto", href: "#contacto" },
];

function NavLink({
  label,
  href,
  onClick,
  className = "",
}: {
  label: string;
  href: string | null;
  onClick?: () => void;
  className?: string;
}) {
  if (!href) {
    return (
      <span
        aria-disabled="true"
        className={`font-heading cursor-not-allowed text-white/40 ${className}`}
      >
        {label}
      </span>
    );
  }

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    onClick?.();
    const target = document.querySelector<HTMLElement>(href!);
    if (!target) return;
    // Sin offset manual acá: Lenis ya lee el scroll-margin-top (scroll-mt-*) de la
    // sección destino solo, restándolo del target al igual que haría la navegación
    // nativa de <a href="#...">  (ver lenis.mjs, scrollTo()) — pasar además la altura
    // del header como offset lo duplicaba (los dos se sumaban, ~200px de más).
    scrollToElement(target);
  }

  return (
    <a href={href} onClick={handleClick} className={`font-heading text-white transition-opacity hover:opacity-70 ${className}`}>
      {label}
    </a>
  );
}

function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <mask id="navbar-linkedin-badge-mask">
        <rect x="0" y="0" width="24" height="24" rx="5" fill="white" />
        <path
          fill="black"
          transform="translate(4 3.5) scale(0.71)"
          d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.24 8.25h4.5V23H.24V8.25ZM8.5 8.25h4.31v2.01h.06c.6-1.13 2.06-2.33 4.24-2.33 4.53 0 5.37 2.98 5.37 6.86V23h-4.5v-6.44c0-1.54-.03-3.51-2.14-3.51-2.15 0-2.48 1.68-2.48 3.4V23H8.5V8.25Z"
        />
      </mask>
      <rect x="0" y="0" width="24" height="24" rx="5" fill="currentColor" mask="url(#navbar-linkedin-badge-mask)" />
    </svg>
  );
}

export default function Navbar({ priority = false }: { priority?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloquea el scroll del body detrás del menú mobile a pantalla completa.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  // Al tocar un link del menú mobile, el salto nativo a #anchor ocurre en el
  // mismo click, antes de que el cleanup del effect de arriba llegue a correr
  // (es async) — el navegador calculaba el scroll con el body todavía
  // `overflow: hidden`, así que el offset de `scroll-mt-*` de la sección no se
  // aplicaba y quedaba pegada arriba del todo. Se restaura acá, síncrono,
  // antes de que el navegador procese el salto.
  function closeMenuForNavigation() {
    document.body.style.overflow = "";
    setMenuOpen(false);
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 px-6 py-6 transition-colors duration-300 md:px-14 md:py-8 ${scrolled || menuOpen ? "bg-[var(--parta-blue)]" : "bg-transparent"
          }`}
      >
        {/* Desktop: logo + fila de links */}
        <div className="hidden items-center justify-between md:flex">
          <Link href="/" className="block">
            <Image src="/logo-white.svg" alt="PARTA" width={140} height={26} priority={priority} />
          </Link>
          <nav className="flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.label} {...link} className="text-sm font-semibold tracking-widest uppercase" />
            ))}
          </nav>
        </div>

        {/* Mobile: hamburguesa / logo centrado / Instagram + LinkedIn */}
        <div className="flex items-center justify-between md:hidden">
          <button
            type="button"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-6 w-6 flex-col items-center justify-center gap-1.5 text-white"
          >
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M6 18 18 6" strokeLinecap="round" />
              </svg>
            ) : (
              <>
                <span className="block h-0.5 w-6 bg-current" />
                <span className="block h-0.5 w-6 bg-current" />
                <span className="block h-0.5 w-6 bg-current" />
              </>
            )}
          </button>

          <Link href="/" className="block">
            <Image src="/logo-white.svg" alt="PARTA" width={110} height={20} priority={priority} />
          </Link>

          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/parta.arg"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-5 w-5 items-center justify-center text-white transition-opacity hover:opacity-70"
            >
              <InstagramIcon className="h-full w-full" />
            </a>
            <a
              href="https://linkedin.com/company/parta-arg/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-5 w-5 items-center justify-center text-white transition-opacity hover:opacity-70"
            >
              <LinkedInIcon className="h-full w-full" />
            </a>
          </div>
        </div>
      </header>

      {/* Menú mobile a pantalla completa. Sin mockup del estado abierto — armado
          siguiendo el mismo lenguaje visual del sitio (bg parta-blue, tipografía
          font-heading), a revisar con el cliente si no convence. */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-[var(--parta-blue)] px-6 md:hidden">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              {...link}
              onClick={closeMenuForNavigation}
              className="text-1xl font-bold tracking-widest uppercase"
            />
          ))}
          <div className="mt-4 flex items-center gap-6">
            <a
              href="https://www.instagram.com/parta.arg"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-7 w-7 items-center justify-center text-white transition-opacity hover:opacity-70"
            >
              <InstagramIcon className="h-full w-full" />
            </a>
            <a
              href="https://linkedin.com/company/parta-arg/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-7 w-7 items-center justify-center text-white transition-opacity hover:opacity-70"
            >
              <LinkedInIcon className="h-full w-full" />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
