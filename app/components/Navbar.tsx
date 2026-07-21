"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ChamferOutline from "./ChamferOutline";

export default function Navbar({ priority = false }: { priority?: boolean }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex items-start justify-between px-6 py-6 transition-colors duration-300 md:px-14 md:py-8 ${
        scrolled ? "bg-[var(--parta-blue)]" : "bg-transparent"
      }`}
    >
      <a href="/" className="block">
        <Image src="/logo-white.svg" alt="PARTA" width={140} height={26} priority={priority} />
      </a>

      <a href="#contacto">
        <ChamferOutline variant="nav" cut={7} innerClassName="flex items-center px-5 py-2.5">
          <span className="font-heading text-xs font-semibold uppercase tracking-widest text-white">
            Contacto
          </span>
        </ChamferOutline>
      </a>
    </header>
  );
}
