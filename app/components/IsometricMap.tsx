"use client";

import { useState } from "react";
import ZoneDetailCard from "./ZoneDetailCard";
import { useMapScale } from "./useMapScale";
import { ZONAS_ISOMETRICAS, ISO_NEUTRAL_IMG, ISO_WIDTH, ISO_HEIGHT } from "../data/isometrico";

export default function IsometricMap() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { containerRef, toScreen, viewBox, containerWidth } = useMapScale(0, 0, ISO_WIDTH, ISO_HEIGHT);

  const selected = selectedId ? ZONAS_ISOMETRICAS.find((z) => z.id === selectedId) ?? null : null;
  const hovered = hoveredId ? ZONAS_ISOMETRICAS.find((z) => z.id === hoveredId) ?? null : null;
  const cardAnchor = selected ? toScreen(selected.centro) : null;

  // El hover muestra la misma imagen que se vería al hacer click (preview),
  // no un tinte vectorial encima del render fotorrealista.
  const displayedImage = hovered?.image ?? selected?.image ?? ISO_NEUTRAL_IMG;

  function toggle(id: string) {
    setSelectedId((current) => (current === id ? null : id));
  }

  // Algunos polígonos se superponen (p.ej. "varias" conecta dos clusters
  // reales pasando por encima de otras zonas) — se pintan las zonas más
  // grandes primero para que las más chicas/específicas queden arriba y
  // ganen el hover/click en el área de superposición.
  const zonasPorArea = [...ZONAS_ISOMETRICAS].sort((a, b) => b.area - a.area);

  return (
    <section className="relative w-full bg-black pt-32 pb-3 md:py-20">
      <div className="relative w-full" style={{ aspectRatio: `${ISO_WIDTH} / ${ISO_HEIGHT}` }}>
        {!selected && !hovered && (
          <div className="absolute top-6 left-1/2 z-20 -translate-x-1/2 pointer-events-none text-center">
            <p className="text-xs tracking-widest uppercase text-white/40">
              Hacé click en una zona para explorarla
            </p>
          </div>
        )}

        <div ref={containerRef} className="absolute inset-0">
          <svg viewBox={viewBox} className="h-full w-full">
            <image href={displayedImage} x={0} y={0} width={ISO_WIDTH} height={ISO_HEIGHT} />

            {zonasPorArea.map((zona) => (
              <polygon
                key={zona.id}
                points={zona.polygon.map(([x, y]) => `${x},${y}`).join(" ")}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredId(zona.id)}
                onMouseLeave={() => setHoveredId((h) => (h === zona.id ? null : h))}
                onClick={() => toggle(zona.id)}
              />
            ))}
          </svg>

          {selected && cardAnchor && (
            <ZoneDetailCard
              zona={selected}
              anchor={cardAnchor}
              containerWidth={containerWidth}
              onClose={() => setSelectedId(null)}
            />
          )}
        </div>
      </div>
    </section>
  );
}
