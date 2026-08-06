"use client";

import { useEffect, useRef, useState } from "react";
import { chamferClipPath } from "./chamfer";
import { LOTE_MARKER_HEIGHT } from "./LoteMarker";
import { ESTADO_COLOR, ESTADO_LABEL, type Lote } from "../data/lotes";

// Card de detalle de lote (mismo lenguaje chamfer del resto del sitio),
// reusada por el mapa desktop y por el nivel de zoom mobile: en ambos casos
// cuelga de su esquina inferior izquierda, unida al marcador del lote por un
// "tallo" vertical, igual al mockup (designs/mapa-cenital/desktop/mapa-interactivo.webp /
// designs/mapa-cenital/mobile/mapa-mobile-3-seleccionado.webp).
const STEM_GAP = 10; // separación entre el tallo y el punto
const STEM_HEIGHT = 56; // distancia entre el borde inferior de la card y el punto (2x el tallo)
const STEM_WIDTH = 3; // mismo grosor que el tallo de ZoneDetailCard (mapa isométrico)
const EDGE_MARGIN = 16; // separación mínima respecto al borde de pantalla

export default function LoteDetailCard({
  lote,
  anchor,
  scale,
  containerWidth,
  markerSizeMultiplier = 1,
  onClose,
}: {
  lote: Lote;
  /** Posición del marcador del lote en coordenadas de pantalla (px), relativas al mismo contenedor que containerWidth. */
  anchor: [number, number];
  /** Escala actual del mapa (map px -> screen px), para dimensionar el tallo relativo al marcador. */
  scale: number;
  /** Ancho real del contenedor del mapa (no window.innerWidth: la card es un overlay absoluto DENTRO de ese
   * contenedor, así que el borde contra el que hay que evitar cortarse es el de él, no el de la ventana —
   * si el contenedor no coincide 1:1 con el viewport (overflow horizontal en otra sección de la página,
   * por ejemplo) clampear contra window.innerWidth corta la card igual. Viene de useMapScale. */
  containerWidth: number;
  /** Mismo multiplicador que recibe LoteMarker en este mapa (mobile lo agranda para compensar
   * su escala final más baja) — hace falta acá para que el tallo arranque justo arriba del
   * marcador real y no lo tape. */
  markerSizeMultiplier?: number;
  onClose: () => void;
}) {
  // El tallo siempre cuelga del marcador real; la card se mide (ancho variable
  // según el contenido) y se desplaza hacia la izquierda si hace falta para
  // no cortarse contra el borde derecho del contenedor — el tallo no se mueve.
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setCardWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const markerHalfHeightPx = ((LOTE_MARKER_HEIGHT * markerSizeMultiplier) / 2) * scale;
  const stemTop = Math.max(anchor[1] - STEM_HEIGHT, EDGE_MARGIN);
  const stemBottom = anchor[1] - markerHalfHeightPx - STEM_GAP;
  const stemLeft = Math.max(anchor[0], EDGE_MARGIN);
  const cardLeft =
    cardWidth && containerWidth ? Math.min(stemLeft, containerWidth - cardWidth - EDGE_MARGIN) : stemLeft;

  return (
    <>
      <div
        className="absolute z-20 bg-[var(--parta-blue)]"
        style={{
          left: stemLeft,
          top: stemTop,
          width: STEM_WIDTH,
          height: Math.max(stemBottom - stemTop, 0),
        }}
      />
      <div
        ref={cardRef}
        className="absolute z-20 w-max max-w-[92vw] -translate-y-full"
        style={{ left: cardLeft, top: stemTop }}
      >
        <div className="bg-[var(--parta-blue)] p-5" style={{ clipPath: chamferClipPath("nav", 14) }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-heading text-4xl font-bold tracking-tight text-white">LOTE {lote.numero}</span>
              <div className="flex flex-col gap-0.5 leading-none text-white/70">
                <svg width="20" height="13" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="1" width="22" height="14" rx="3" />
                  <path d="M6 1v4M10 1v7M14 1v4M18 1v7" strokeLinecap="round" />
                </svg>
                <span className="font-heading text-sm uppercase tracking-widest whitespace-nowrap">
                  {lote.m2.toLocaleString("es-AR")} m²
                </span>
              </div>
            </div>
            <button
              type="button"
              aria-label="Cerrar"
              onClick={onClose}
              className="text-white/70 transition-colors hover:text-white"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M6 18 18 6" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="mt-4 flex items-stretch">
            <span className="font-heading flex shrink-0 items-center whitespace-nowrap bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[var(--parta-blue)]">
              {lote.zonaLabel}
            </span>
            <span
              className="font-heading flex shrink-0 items-center whitespace-nowrap px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white"
              style={{ background: ESTADO_COLOR[lote.estado] }}
            >
              {ESTADO_LABEL[lote.estado]}
            </span>
          </div>

          <div className="mt-4 flex justify-end">
            {lote.estado === "disponible" ? (
              <a
                href="#contacto"
                onClick={onClose}
                className="font-heading flex items-center gap-3 text-base font-bold uppercase tracking-widest text-white hover:opacity-80"
              >
                Consultar
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
                Consultar
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
  );
}
