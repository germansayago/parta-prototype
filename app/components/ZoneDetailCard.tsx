"use client";

import { useEffect, useRef, useState } from "react";
import { chamferClipPath } from "./chamfer";
import type { ZonaIsometrica } from "../data/isometrico";

// Card de detalle de zona del mapa isométrico, mismo lenguaje chamfer +
// "tallo" que LoteDetailCard (cenital): cuelga de su esquina inferior
// izquierda, unida por una línea vertical al centroide de la zona resaltada.
// A diferencia del lote, acá no hay un marcador/punto dibujado en el mapa
// (la zona entera se resalta a color), así que el tallo arranca directo
// desde el centroide sin offset de marcador.
const STEM_HEIGHT = 56;
const STEM_WIDTH = 3;
const EDGE_MARGIN = 16;

export default function ZoneDetailCard({
  zona,
  anchor,
  containerWidth,
  onClose,
}: {
  zona: ZonaIsometrica;
  /** Centroide de la zona en coordenadas de pantalla (px), relativas al mismo contenedor que containerWidth. */
  anchor: [number, number];
  containerWidth: number;
  onClose: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setCardWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const stemTop = Math.max(anchor[1] - STEM_HEIGHT, EDGE_MARGIN);
  const stemBottom = anchor[1];
  const stemLeft = Math.max(anchor[0], EDGE_MARGIN);
  const cardLeft =
    cardWidth && containerWidth ? Math.min(stemLeft, containerWidth - cardWidth - EDGE_MARGIN) : stemLeft;

  return (
    <>
      <div
        className="absolute z-20 bg-[var(--parta-blue)]"
        style={{ left: stemLeft, top: stemTop, width: STEM_WIDTH, height: Math.max(stemBottom - stemTop, 0) }}
      />
      <div
        ref={cardRef}
        className="absolute z-20 w-max max-w-[92vw] sm:max-w-[380px] -translate-y-full"
        style={{ left: cardLeft, top: stemTop }}
      >
        <div className="bg-[var(--parta-blue)] p-6" style={{ clipPath: chamferClipPath("nav", 14) }}>
          <div className="flex items-start justify-between gap-3">
            {zona.pillLabel ? (
              <span
                className="font-heading inline-block bg-white px-3 py-1 text-xs font-bold uppercase tracking-widest"
                style={{ color: zona.pillColor ?? undefined }}
              >
                {zona.pillLabel}
              </span>
            ) : (
              <span />
            )}
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

          <h2 className="font-heading mt-4 text-xl font-bold uppercase leading-tight text-white">{zona.title}</h2>

          {zona.description && (
            <p className="mt-3 text-sm leading-relaxed text-white/80">{zona.description}</p>
          )}
        </div>
      </div>
    </>
  );
}
