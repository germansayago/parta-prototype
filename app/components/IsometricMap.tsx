"use client";

import { useEffect, useState } from "react";
import ZoneDetailCard from "./ZoneDetailCard";
import { useMapScale } from "./useMapScale";
import { ZONAS_ISOMETRICAS, ISO_NEUTRAL_IMG, ISO_WIDTH, ISO_HEIGHT } from "../data/isometrico";

// Mismo breakpoint "md" (768px) que el resto del sitio.
const DESKTOP_QUERY = "(min-width: 768px)";

export default function IsometricMap() {
  // Desktop: hover muestra la info directo (sin click). Mobile: sin hover
  // real, sigue siendo tap para abrir/cerrar. Se detecta en JS (no alcanza
  // con CSS) porque cambia qué evento dispara la card, no solo el layout.
  const [isDesktop, setIsDesktop] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { containerRef, toScreen, viewBox, containerWidth } = useMapScale(0, 0, ISO_WIDTH, ISO_HEIGHT);

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY);
    setIsDesktop(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const activeId = isDesktop ? hoveredId : selectedId;
  const active = activeId ? ZONAS_ISOMETRICAS.find((z) => z.id === activeId) ?? null : null;
  const cardAnchor = active ? toScreen(active.centro) : null;

  function handleEnter(id: string) {
    if (isDesktop) setHoveredId(id);
  }
  function handleLeave(id: string) {
    if (isDesktop) setHoveredId((h) => (h === id ? null : h));
  }
  function handleClick(id: string) {
    if (!isDesktop) setSelectedId((current) => (current === id ? null : id));
  }
  function close() {
    setSelectedId(null);
    setHoveredId(null);
  }

  // Algunos polígonos se superponen (p.ej. "varias" conecta dos clusters
  // reales pasando por encima de otras zonas) — se pintan las zonas más
  // grandes primero para que las más chicas/específicas queden arriba y
  // ganen el hover/click en el área de superposición.
  const zonasPorArea = [...ZONAS_ISOMETRICAS].sort((a, b) => b.area - a.area);

  return (
    <section className="relative w-full bg-black pt-32 pb-3 md:py-20">
      <div className="relative w-full" style={{ aspectRatio: `${ISO_WIDTH} / ${ISO_HEIGHT}` }}>
        {!active && (
          <div className="absolute top-6 left-1/2 z-20 -translate-x-1/2 pointer-events-none text-center">
            <p className="text-xs tracking-widest uppercase text-white/40">
              {isDesktop ? "Pasá el mouse sobre una zona para explorarla" : "Tocá una zona para explorarla"}
            </p>
          </div>
        )}

        <div ref={containerRef} className="absolute inset-0">
          <svg viewBox={viewBox} className="h-full w-full">
            <image href={ISO_NEUTRAL_IMG} x={0} y={0} width={ISO_WIDTH} height={ISO_HEIGHT} />

            {/* Cada imagen de zona es solo el bloque iluminado (fondo transparente,
                render de IA que no matchea pixel a pixel la foto neutral) — se
                superpone sobre la neutral en vez de reemplazarla, así no hay salto
                de fondo al cambiar de zona. Las 6 quedan montadas siempre y se
                cruzan con opacity para el fade. */}
            {ZONAS_ISOMETRICAS.map((zona) => (
              <image
                key={zona.id}
                href={zona.image}
                x={0}
                y={0}
                width={ISO_WIDTH}
                height={ISO_HEIGHT}
                className="pointer-events-none transition-opacity duration-200 ease-out"
                style={{ opacity: zona.id === activeId ? 1 : 0 }}
              />
            ))}

            {zonasPorArea.map((zona) => (
              <polygon
                key={zona.id}
                points={zona.polygon.map(([x, y]) => `${x},${y}`).join(" ")}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => handleEnter(zona.id)}
                onMouseLeave={() => handleLeave(zona.id)}
                onClick={() => handleClick(zona.id)}
              />
            ))}
          </svg>

          {active && cardAnchor && (
            <div
              onMouseEnter={() => handleEnter(active.id)}
              onMouseLeave={() => handleLeave(active.id)}
            >
              <ZoneDetailCard
                zona={active}
                anchor={cardAnchor}
                containerWidth={containerWidth}
                onClose={close}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
