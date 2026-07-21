"use client";

import { useState } from "react";
import Image from "next/image";
import { chamferClipPath } from "./chamfer";
import { ESTADO_COLOR, ESTADO_LABEL, LOTES, type Lote } from "../data/lotes";

export default function CenitalMap() {
  const [selected, setSelected] = useState<Lote | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const cardLeft = selected ? Math.min(Math.max(selected.centro[0], 18), 82) : 0;
  const cardTop = selected ? Math.max(selected.centro[1] - 6, 4) : 0;

  return (
    <section className="relative w-full bg-black py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-14">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
          Mapa interactivo
        </p>
        <h2 className="mt-3 text-2xl font-bold uppercase leading-tight text-white sm:text-3xl md:text-4xl">
          Elegí tu lote dentro del parque.
        </h2>

        <div className="relative mt-10 aspect-[1680/936] w-full overflow-hidden">
          <Image
            src="/images/mapa/mapa-base.jpg"
            alt="Plano aéreo del parque industrial PARTA"
            fill
            className="object-cover"
            sizes="(min-width: 1280px) 1152px, 100vw"
          />

          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            {LOTES.map((lote) => {
              const active = hovered === lote.id || selected?.id === lote.id;
              return (
                <polygon
                  key={lote.id}
                  points={lote.polygon.map(([x, y]) => `${x},${y}`).join(" ")}
                  fill={lote.color}
                  fillOpacity={active ? 0.55 : 0.2}
                  stroke={lote.color}
                  strokeWidth={0.15}
                  className="cursor-pointer transition-[fill-opacity] duration-150"
                  onMouseEnter={() => setHovered(lote.id)}
                  onMouseLeave={() => setHovered((h) => (h === lote.id ? null : h))}
                  onClick={() => setSelected(lote)}
                />
              );
            })}
          </svg>

          {LOTES.map((lote) => (
            <div
              key={lote.id}
              className="pointer-events-none absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-sm border border-white/80"
              style={{ left: `${lote.centro[0]}%`, top: `${lote.centro[1]}%`, background: lote.color }}
            />
          ))}

          {selected && (
            <div
              className="absolute z-20 w-64 -translate-x-1/2 sm:w-72"
              style={{ left: `${cardLeft}%`, top: `${cardTop}%` }}
            >
              <div
                className="bg-[var(--parta-blue)] p-4"
                style={{ clipPath: chamferClipPath("nav", 14) }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-heading text-2xl font-bold text-white">
                      LOTE {selected.numero}
                    </span>
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
      </div>
    </section>
  );
}
