"use client";

import { useEffect, useRef, useState } from "react";
import { chamferClipPath } from "./chamfer";
import {
  ESTADO_COLOR,
  ESTADO_LABEL,
  LOTES,
  MAPA_WIDTH,
  MAPA_HEIGHT,
  type Lote,
} from "../data/lotes";

export default function CenitalMap() {
  const [selected, setSelected] = useState<Lote | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setBox({ width, height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // La imagen + los lotes viven en el mismo <svg viewBox>, así que siempre
  // escalan juntos sin importar el tamaño de pantalla. Acá replicamos el
  // cálculo de preserveAspectRatio="xMidYMid slice" (cover) para poder
  // posicionar la card de detalle (HTML) alineada con el punto SVG exacto.
  const scale = box.width && box.height ? Math.max(box.width / MAPA_WIDTH, box.height / MAPA_HEIGHT) : 0;
  const offsetX = (box.width - MAPA_WIDTH * scale) / 2;
  const offsetY = (box.height - MAPA_HEIGHT * scale) / 2;

  function toScreen([x, y]: [number, number]): [number, number] {
    return [offsetX + x * scale, offsetY + y * scale];
  }

  const cardAnchor = selected ? toScreen(selected.centro) : null;
  const cardLeft = cardAnchor ? Math.min(Math.max(cardAnchor[0], 140), box.width - 140) : 0;
  const cardTop = cardAnchor ? Math.min(Math.max(cardAnchor[1] - 190, 16), box.height - 220) : 0;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <div ref={containerRef} className="absolute inset-0">
        <svg
          viewBox={`0 0 ${MAPA_WIDTH} ${MAPA_HEIGHT}`}
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full"
        >
          <image href="/images/mapa/mapa-base.png" x={0} y={0} width={MAPA_WIDTH} height={MAPA_HEIGHT} />

          {LOTES.map((lote) => {
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

          {LOTES.map((lote) => (
            <rect
              key={`marker-${lote.id}`}
              x={lote.centro[0] - 7}
              y={lote.centro[1] - 7}
              width={14}
              height={14}
              rx={3}
              fill={lote.color}
              stroke="white"
              strokeWidth={1.5}
              className="pointer-events-none"
            />
          ))}
        </svg>

        {selected && cardAnchor && (
          <div className="absolute z-20 w-64 -translate-x-1/2 sm:w-72" style={{ left: cardLeft, top: cardTop }}>
            <div className="bg-[var(--parta-blue)] p-4" style={{ clipPath: chamferClipPath("nav", 14) }}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-heading text-2xl font-bold text-white">LOTE {selected.numero}</span>
                  <p className="mt-1 text-xs uppercase tracking-widest text-white/70">
                    {selected.m2.toLocaleString("es-AR")} m²
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Cerrar"
                  onClick={() => setSelected(null)}
                  className="text-white/70 transition-colors hover:text-white"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 6l12 12M6 18 18 6" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="bg-white px-3 py-1 text-xs font-bold uppercase tracking-widest text-[var(--parta-blue)]">
                  {selected.zonaLabel}
                </span>
                <span
                  className="px-3 py-1 text-xs font-bold uppercase tracking-widest text-white"
                  style={{ background: ESTADO_COLOR[selected.estado] }}
                >
                  {ESTADO_LABEL[selected.estado]}
                </span>
              </div>

              <a
                href="#contacto"
                onClick={() => setSelected(null)}
                className="font-heading mt-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white hover:opacity-80"
              >
                Reservar
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14m0 0-6-6m6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
