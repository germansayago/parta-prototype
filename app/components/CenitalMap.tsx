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

export default function CenitalMap({ lotes = LOTES }: { lotes?: Lote[] }) {
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

  // La card cuelga de su esquina inferior izquierda, unida al marcador del
  // lote por un "tallo" vertical (mismo azul de la card, ancho del punto,
  // separado 10px por encima del punto) — igual al mockup
  // (designs/estado-posicion-inicial.png), no centrada sobre el punto.
  const MARKER_SIZE = 14; // debe matchear el <rect> del marcador en el SVG
  const STEM_GAP = 10; // separación entre el tallo y el punto
  const STEM_HEIGHT = 56; // distancia entre el borde inferior de la card y el punto (2x el tallo)
  const cardAnchor = selected ? toScreen(selected.centro) : null;
  const markerHalfPx = (MARKER_SIZE / 2) * scale;
  const stemTop = cardAnchor ? Math.max(cardAnchor[1] - STEM_HEIGHT, 16) : 0;
  const stemBottom = cardAnchor ? cardAnchor[1] - markerHalfPx - STEM_GAP : 0;
  const cardLeft = cardAnchor ? Math.max(cardAnchor[0] - markerHalfPx, 16) : 0;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <div ref={containerRef} className="absolute inset-0">
        <svg
          viewBox={`0 0 ${MAPA_WIDTH} ${MAPA_HEIGHT}`}
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full"
        >
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
          <>
            <div
              className="absolute z-20 bg-[var(--parta-blue)]"
              style={{
                left: cardLeft,
                top: stemTop,
                width: markerHalfPx * 2,
                height: Math.max(stemBottom - stemTop, 0),
              }}
            />
            <div
              className="absolute z-20 w-max max-w-[92vw] -translate-y-full"
              style={{ left: cardLeft, top: stemTop }}
            >
              <div className="bg-[var(--parta-blue)] p-5" style={{ clipPath: chamferClipPath("nav", 14) }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-4xl font-bold tracking-tight text-white">LOTE {selected.numero}</span>
                    <div className="flex flex-col gap-0.5 leading-none text-white/70">
                      <svg width="20" height="13" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="1" width="22" height="14" rx="3" />
                        <path d="M6 1v4M10 1v7M14 1v4M18 1v7" strokeLinecap="round" />
                      </svg>
                      <span className="font-heading text-sm uppercase tracking-widest whitespace-nowrap">
                        {selected.m2.toLocaleString("es-AR")} m²
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label="Cerrar"
                    onClick={() => setSelected(null)}
                    className="text-white/70 transition-colors hover:text-white"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 6l12 12M6 18 18 6" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>

                <div className="mt-4 flex items-stretch">
                  <span className="font-heading flex items-center whitespace-nowrap bg-white px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-[var(--parta-blue)]">
                    {selected.zonaLabel}
                  </span>
                  <span
                    className="font-heading flex items-center whitespace-nowrap px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-white"
                    style={{ background: ESTADO_COLOR[selected.estado] }}
                  >
                    {ESTADO_LABEL[selected.estado]}
                  </span>
                </div>

                <div className="mt-4 flex justify-end">
                  {selected.estado === "disponible" ? (
                    <a
                      href="#contacto"
                      onClick={() => setSelected(null)}
                      className="font-heading flex items-center gap-3 text-base font-bold uppercase tracking-widest text-white hover:opacity-80"
                    >
                      Reservar
                      <span
                        className="flex h-9 w-9 items-center justify-center bg-white text-[var(--parta-blue)]"
                        style={{ clipPath: chamferClipPath("form", 6) }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 12h14m0 0-6-6m6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      aria-disabled="true"
                      className="font-heading flex cursor-not-allowed items-center gap-3 text-base font-bold uppercase tracking-widest text-white/50"
                    >
                      Reservar
                      <span
                        className="flex h-9 w-9 items-center justify-center bg-white/50 text-[var(--parta-blue)]/60"
                        style={{ clipPath: chamferClipPath("form", 6) }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 12h14m0 0-6-6m6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
