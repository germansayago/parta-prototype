"use client";

import { useState } from "react";
import LoteDetailCard from "./LoteDetailCard";
import { chamferClipPath } from "./chamfer";
import { useMapScale } from "./useMapScale";
import { LOTES, type Lote } from "../data/lotes";
import {
  ZONAS_MOBILES,
  ZONA_MOBILE_ZOOM,
  ZONA_MOBILE_TAG_ANCHOR,
  type ZonaMobile,
  type ZonaZoomTransform,
} from "../data/zonasMobile";
import {
  LOTE_GEOMETRY_MOBILE,
  MAPA_MOBILE_WIDTH,
  MAPA_MOBILE_HEIGHT,
  MAPA_MOBILE_PARK_BBOX,
} from "../data/lotesMobileGeometry";

const MAPA_MOBILE_SRC = "/images/mapa/mapa-base-mobile.png";
const BBOX = MAPA_MOBILE_PARK_BBOX;
const BBOX_WIDTH = BBOX.maxX - BBOX.minX;
const BBOX_HEIGHT = BBOX.maxY - BBOX.minY;

/** translate(ox,oy) scale(s) translate(-ox,-oy), como atributo `transform` de SVG. */
function scaleAroundAttr({ originX, originY, scale }: ZonaZoomTransform): string {
  return `translate(${originX} ${originY}) scale(${scale}) translate(${-originX} ${-originY})`;
}

/** Aplica la misma transformación de zoom a un punto, para posicionar overlays HTML (la card de detalle) alineados con el SVG. */
function applyZoom([x, y]: [number, number], { originX, originY, scale }: ZonaZoomTransform): [number, number] {
  return [originX + (x - originX) * scale, originY + (y - originY) * scale];
}

// Drill-down de 2 niveles: lista de zonas sobre el mapa completo -> zoom a
// la zona elegida con los lotes individuales clickeables. Mismo dataset y
// misma card de detalle (LoteDetailCard) que el mapa desktop; lo que cambia
// es la agrupación posicional de ZONAS_MOBILES (ver app/data/zonasMobile.ts)
// y la transformación de zoom del SVG. Ver docs/PLAN.md.
//
// Los dos niveles comparten el mismo <svg viewBox={BBOX}> (así el contenedor
// nunca cambia de tamaño/proporción entre niveles — ver nota en
// zonasMobile.ts); lo único que cambia al entrar a una zona es un
// transform="translate scale translate" sobre el contenido, anclado al borde
// izquierdo o derecho del predio, replicando el encuadre de
// designs/mapa/mapa-general.png vs mapa-zona-1.jpg/mapa-zona-2.jpg.
export default function CenitalMapMobile({ lotes = LOTES }: { lotes?: Lote[] }) {
  const [activeZonaId, setActiveZonaId] = useState<string | null>(null);
  const [viewLevel, setViewLevel] = useState<"lista" | "zona">("lista");
  const [selectedLote, setSelectedLote] = useState<Lote | null>(null);

  const activeZona = ZONAS_MOBILES.find((z) => z.id === activeZonaId) ?? null;

  if (viewLevel === "zona" && activeZona) {
    return (
      <ZonaZoom
        zona={activeZona}
        lotes={lotes}
        selectedLote={selectedLote}
        onSelectLote={setSelectedLote}
        onVolver={() => {
          setViewLevel("lista");
          setSelectedLote(null);
        }}
      />
    );
  }

  return (
    <ListaZonas
      lotes={lotes}
      activeZonaId={activeZonaId}
      onSelectZona={setActiveZonaId}
      onIngresar={() => setViewLevel("zona")}
    />
  );
}

function ListaZonas({
  lotes,
  activeZonaId,
  onSelectZona,
  onIngresar,
}: {
  lotes: Lote[];
  activeZonaId: string | null;
  onSelectZona: (id: string) => void;
  onIngresar: () => void;
}) {
  const { containerRef, toScreen } = useMapScale(BBOX.minX, BBOX.minY, BBOX_WIDTH, BBOX_HEIGHT);
  const activeZona = ZONAS_MOBILES.find((z) => z.id === activeZonaId) ?? null;
  const activeNumeros = activeZona ? new Set(activeZona.numeros) : null;
  const tagAnchor = activeZonaId ? toScreen(ZONA_MOBILE_TAG_ANCHOR[activeZonaId]) : null;

  return (
    <section className="relative h-screen min-h-[640px] w-full bg-black">
      <div className="absolute inset-0 pt-24">
        <div ref={containerRef} className="relative h-full w-full">
          <svg
            viewBox={`${BBOX.minX} ${BBOX.minY} ${BBOX_WIDTH} ${BBOX_HEIGHT}`}
            preserveAspectRatio="xMidYMid slice"
            className="h-full w-full overflow-hidden"
          >
            <image href={MAPA_MOBILE_SRC} x={0} y={0} width={MAPA_MOBILE_WIDTH} height={MAPA_MOBILE_HEIGHT} />
            {lotes.map((lote) => {
              const active = activeNumeros?.has(lote.numero) ?? false;
              return (
                <polygon
                  key={lote.id}
                  points={LOTE_GEOMETRY_MOBILE[lote.numero].polygon.map(([x, y]) => `${x},${y}`).join(" ")}
                  fill="white"
                  fillOpacity={active ? 0.28 : 0.06}
                  stroke="white"
                  strokeOpacity={active ? 0.9 : 0.3}
                  strokeWidth={1.5}
                  className="transition-[fill-opacity,stroke-opacity] duration-300"
                />
              );
            })}
          </svg>

          {tagAnchor && activeZona && (
            <div
              className="pointer-events-none absolute z-10 flex -translate-x-1/2 -translate-y-full flex-col items-center"
              style={{ left: tagAnchor[0], top: tagAnchor[1] - 8 }}
            >
              <div className="bg-[var(--parta-blue)] px-4 py-2" style={{ clipPath: chamferClipPath("nav", 8) }}>
                <span className="font-heading whitespace-nowrap text-sm font-bold uppercase tracking-widest text-white">
                  {activeZona.label}
                </span>
              </div>
              <div className="h-2 w-1 bg-[var(--parta-blue)]" />
            </div>
          )}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-24 z-10 flex flex-col gap-3 px-6">
        {ZONAS_MOBILES.map((zona) => {
          const active = zona.id === activeZonaId;
          return (
            <div
              key={zona.id}
              className={active ? "flex items-center justify-between bg-white" : "bg-[var(--parta-blue)]"}
              style={{ clipPath: chamferClipPath("nav", 10) }}
            >
              <button
                type="button"
                onClick={() => onSelectZona(zona.id)}
                className="flex-1 px-5 py-3 text-left"
              >
                <span
                  className={`font-heading text-base font-bold uppercase tracking-widest ${active ? "text-[var(--parta-blue)]" : "text-white"
                    }`}
                >
                  {zona.label}
                </span>
              </button>
              {active && (
                <button
                  type="button"
                  onClick={onIngresar}
                  className="font-heading mr-2 bg-[var(--parta-blue)] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white"
                  style={{ clipPath: chamferClipPath("form", 6) }}
                >
                  Ampliar
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ZonaZoom({
  zona,
  lotes,
  selectedLote,
  onSelectLote,
  onVolver,
}: {
  zona: ZonaMobile;
  lotes: Lote[];
  selectedLote: Lote | null;
  onSelectLote: (lote: Lote | null) => void;
  onVolver: () => void;
}) {
  const zoom = ZONA_MOBILE_ZOOM[zona.id];
  const { containerRef, scale, toScreen, containerWidth } = useMapScale(BBOX.minX, BBOX.minY, BBOX_WIDTH, BBOX_HEIGHT);
  const zonaLotes = lotes.filter((l) => zona.numeros.includes(l.numero));
  const cardAnchor = selectedLote
    ? toScreen(applyZoom(LOTE_GEOMETRY_MOBILE[selectedLote.numero].centro, zoom))
    : null;

  return (
    <section className="relative h-screen min-h-[640px] w-full bg-black">
      <div className="absolute inset-0 pt-24">
        <div ref={containerRef} className="relative h-full w-full">
          <svg
            viewBox={`${BBOX.minX} ${BBOX.minY} ${BBOX_WIDTH} ${BBOX_HEIGHT}`}
            preserveAspectRatio="xMidYMid slice"
            className="h-full w-full overflow-hidden"
          >
            <g transform={scaleAroundAttr(zoom)}>
              <image href={MAPA_MOBILE_SRC} x={0} y={0} width={MAPA_MOBILE_WIDTH} height={MAPA_MOBILE_HEIGHT} />

              {zonaLotes.map((lote) => {
                const active = selectedLote?.id === lote.id;
                return (
                  <polygon
                    key={lote.id}
                    points={LOTE_GEOMETRY_MOBILE[lote.numero].polygon.map(([x, y]) => `${x},${y}`).join(" ")}
                    fill="white"
                    fillOpacity={active ? 0.24 : 0.08}
                    stroke="white"
                    strokeOpacity={active ? 0.9 : 0.4}
                    strokeWidth={1.5}
                    className="cursor-pointer"
                    onClick={() => onSelectLote(lote)}
                  />
                );
              })}

              {zonaLotes.map((lote) => {
                const [cx, cy] = LOTE_GEOMETRY_MOBILE[lote.numero].centro;
                return (
                  <rect
                    key={`marker-${lote.id}`}
                    x={cx - 7}
                    y={cy - 7}
                    width={14}
                    height={14}
                    rx={3}
                    fill={lote.color}
                    stroke="white"
                    strokeWidth={1.5}
                    className="pointer-events-none"
                  />
                );
              })}
            </g>
          </svg>

          <div className="absolute bottom-24 left-6 z-20 flex items-center gap-3">
            <button
              type="button"
              onClick={onVolver}
              aria-label="Volver a la lista de zonas"
              className="flex h-11 w-11 shrink-0 items-center justify-center bg-[var(--parta-blue)] text-white"
              style={{ clipPath: chamferClipPath("form", 8) }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5m0 0 7-7m-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="bg-[var(--parta-blue)] px-4 py-2.5" style={{ clipPath: chamferClipPath("nav", 8) }}>
              <span className="font-heading whitespace-nowrap text-sm font-bold uppercase tracking-widest text-white">
                {zona.label}
              </span>
            </div>
          </div>

          {selectedLote && cardAnchor && (
            <LoteDetailCard
              lote={selectedLote}
              anchor={cardAnchor}
              scale={scale * zoom.scale}
              containerWidth={containerWidth}
              onClose={() => onSelectLote(null)}
            />
          )}
        </div>
      </div>
    </section>
  );
}
