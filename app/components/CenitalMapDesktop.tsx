"use client";

import { useState } from "react";
import LoteDetailCard from "./LoteDetailCard";
import LoteMarker from "./LoteMarker";
import { useMapScale } from "./useMapScale";
import { LOTES, MAPA_WIDTH, MAPA_HEIGHT, type Lote } from "../data/lotes";

export default function CenitalMapDesktop({ lotes = LOTES }: { lotes?: Lote[] }) {
  const [selected, setSelected] = useState<Lote | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const { containerRef, scale, toScreen, viewBox, containerWidth } = useMapScale(0, 0, MAPA_WIDTH, MAPA_HEIGHT);

  const cardAnchor = selected ? toScreen(selected.centro) : null;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">

      <div ref={containerRef} className="absolute inset-0">
        <svg viewBox={viewBox} preserveAspectRatio="xMidYMid slice" className="h-full w-full">
          <image href="/images/mapa/mapa-base.png" x={0} y={0} width={MAPA_WIDTH} height={MAPA_HEIGHT} />

          {lotes.map((lote) => {
            const active = hovered === lote.id || selected?.id === lote.id;
            return (
              <polygon
                key={lote.id}
                points={lote.polygon.map(([x, y]) => `${x},${y}`).join(" ")}
                fill="white"
                fillOpacity={active ? 0.22 : 0.06}
                stroke="white"
                strokeOpacity={active ? 0.85 : 0.35}
                strokeWidth={1.5}
                className="cursor-pointer transition-[fill-opacity,stroke-opacity] duration-200"
                onMouseEnter={() => setHovered(lote.id)}
                onMouseLeave={() => setHovered((h) => (h === lote.id ? null : h))}
                onClick={() => setSelected(lote)}
              />
            );
          })}

          {lotes.map((lote) => (
            <LoteMarker
              key={`marker-${lote.id}`}
              numero={lote.numero}
              color={lote.color}
              estado={lote.estado}
              x={lote.centro[0]}
              y={lote.centro[1]}
            />
          ))}
        </svg>

        {selected && cardAnchor && (
          <LoteDetailCard
            lote={selected}
            anchor={cardAnchor}
            scale={scale}
            containerWidth={containerWidth}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </section>
  );
}
