"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

/** Scrollea a un elemento usando la instancia global de Lenis en vez de la
 * navegación nativa de `href="#ancla"` — Lenis no intercepta anchors por
 * default (`anchors: false`, ver constructor abajo) pero sí sigue leyendo/
 * animando el scroll del documento en su rAF loop, así que un salto nativo
 * instantáneo puede terminar peleado con eso (offset de `scroll-mt-*`
 * ignorado — ver Navbar.tsx). Con offset negativo se puede dejar lugar para
 * el header fijo. Fallback a `scrollIntoView` nativo si Lenis todavía no
 * montó (no debería pasar en uso normal, el layout ya envuelve todo en
 * `<SmoothScroll>`).
 */
export function scrollToElement(target: HTMLElement, offset = 0) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { offset });
  } else {
    target.scrollIntoView({ behavior: "smooth" });
  }
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisInstance = lenis;

    // Conectar Lenis con GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      lenisInstance = null;
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  return <>{children}</>;
}
