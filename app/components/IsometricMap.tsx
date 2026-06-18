"use client";

import { useState } from "react";

const ZONES = [
  {
    id: "agricola",
    label: "Industrias Agrícolas",
    title: "Un entorno estratégico para el sector agroindustrial.",
    description: "Ubicado en una región clave para la producción agrícola, Parta ofrece infraestructura diseñada para almacenamiento, procesamiento y distribución de productos agroindustriales.",
    blocks: [5, 6, 7],
  },
  {
    id: "metalurgica",
    label: "Industrias Metalúrgicas",
    title: "Un espacio ideal para la industria metalúrgica.",
    description: "Parta ofrece áreas diseñadas para empresas metalúrgicas, con infraestructura preparada para la fabricación, ensamblaje y almacenamiento de productos industriales.",
    blocks: [0, 1, 10, 11],
  },
  {
    id: "alimentaria",
    label: "Industrias Alimentarias",
    title: "Infraestructura diseñada para la industria alimentaria.",
    description: "Pensado para empresas que requieren espacios aptos para la producción, almacenamiento y distribución de alimentos, con infraestructura adaptada a normativas sanitarias.",
    blocks: [15, 16, 20, 21],
  },
  {
    id: "logistica",
    label: "Industrias Tecnología y Logística",
    title: "Innovación y eficiencia en un solo lugar.",
    description: "El sector de tecnología y logística está diseñado para empresas que buscan optimizar sus operaciones con infraestructura moderna y conectividad estratégica.",
    blocks: [2, 3, 4, 12, 13, 14],
  },
  {
    id: "administracion",
    label: "Ingreso al Parque y Administración",
    title: "Ingreso al Parque y Administración PARTA",
    description: "El edificio de administración y el ingreso principal del parque, diseñados para recibir empresas, inversores y visitantes con la mejor infraestructura.",
    blocks: [9, 19, 24],
  },
];

// Mapa inverso: bloque → zona
const BLOCK_TO_ZONE: Record<number, number> = {};
ZONES.forEach((zone, zi) => zone.blocks.forEach((b) => (BLOCK_TO_ZONE[b] = zi)));

function isoX(col: number, row: number) { return 500 + (col - row) * 90; }
function isoY(col: number, row: number) { return 100 + (col + row) * 52; }

function IsoBlock({
  col, row, state, onClick, onHover, onLeave,
}: {
  col: number; row: number;
  state: "idle" | "active" | "hover";
  onClick: () => void;
  onHover: () => void;
  onLeave: () => void;
}) {
  const w = 80; const h = 46; const bh = 36;
  const cx = isoX(col, row);
  const cy = isoY(col, row);

  const top   = `${cx},${cy - h} ${cx + w},${cy} ${cx},${cy + h} ${cx - w},${cy}`;
  const left  = `${cx - w},${cy} ${cx},${cy + h} ${cx},${cy + h + bh} ${cx - w},${cy + bh}`;
  const right = `${cx},${cy + h} ${cx + w},${cy} ${cx + w},${cy + bh} ${cx},${cy + h + bh}`;

  const colors = {
    idle:   { top: "#1a1a1a", left: "#111",    right: "#141414", stroke: "#222" },
    hover:  { top: "#1a3a5a", left: "#0f2840", right: "#162f4a", stroke: "#1e4a7a" },
    active: { top: "#1e4a7a", left: "#0d2a4a", right: "#163a62", stroke: "#2563eb" },
  };
  const c = colors[state];
  const zoneIndex = BLOCK_TO_ZONE[col + row * 5];
  const isClickable = zoneIndex !== undefined;

  return (
    <g
      onClick={isClickable ? onClick : undefined}
      onMouseEnter={isClickable ? onHover : undefined}
      onMouseLeave={isClickable ? onLeave : undefined}
      style={{ cursor: isClickable ? "pointer" : "default", transition: "all 0.25s ease" }}
    >
      <polygon points={left}  fill={c.left}  stroke={c.stroke} strokeWidth="0.5" />
      <polygon points={right} fill={c.right} stroke={c.stroke} strokeWidth="0.5" />
      <polygon points={top}   fill={c.top}   stroke={c.stroke} strokeWidth="0.5" />
    </g>
  );
}

function ZoneCard({ zone, onClose }: { zone: typeof ZONES[0]; onClose: () => void }) {
  return (
    <div
      className="absolute top-6 right-6 z-20"
      style={{
        maxWidth: "min(340px, calc(100vw - 48px))",
        animation: "cardIn 0.3s ease forwards",
      }}
    >
      <div
        className="p-6 relative"
        style={{
          background: "#2563eb",
          clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/50 hover:text-white text-xl leading-none"
        >
          ×
        </button>
        <span className="text-xs font-bold tracking-widest uppercase bg-white/20 px-3 py-1 inline-block mb-4">
          {zone.label}
        </span>
        <h2 className="text-xl font-bold uppercase leading-tight mb-3">
          {zone.title}
        </h2>
        <p className="text-sm text-white/80 leading-relaxed">
          {zone.description}
        </p>
      </div>
    </div>
  );
}

export default function IsometricMap() {
  const [activeZone, setActiveZone] = useState<number | null>(null);
  const [hoveredZone, setHoveredZone] = useState<number | null>(null);

  const blocks: { col: number; row: number; i: number }[] = [];
  for (let row = 0; row < 5; row++)
    for (let col = 0; col < 5; col++)
      blocks.push({ col, row, i: row * 5 + col });

  blocks.sort((a, b) => (a.col + a.row) - (b.col + b.row));

  const getState = (i: number): "idle" | "active" | "hover" => {
    const zone = BLOCK_TO_ZONE[i];
    if (zone === undefined) return "idle";
    if (zone === activeZone) return "active";
    if (zone === hoveredZone) return "hover";
    return "idle";
  };

  return (
    <section className="relative h-screen w-full overflow-hidden" style={{ background: "#060606" }}>
      {/* Hint */}
      {activeZone === null && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
          <p className="text-xs tracking-widest uppercase text-white/30">
            Hacé click en una zona para explorarla
          </p>
        </div>
      )}

      <svg viewBox="0 0 1000 700" className="w-full h-full" style={{ display: "block" }}>
        <rect width="1000" height="700" fill="#060606" />
        {blocks.map(({ col, row, i }) => (
          <IsoBlock
            key={i}
            col={col}
            row={row}
            state={getState(i)}
            onClick={() => setActiveZone(BLOCK_TO_ZONE[i] ?? null)}
            onHover={() => setHoveredZone(BLOCK_TO_ZONE[i] ?? null)}
            onLeave={() => setHoveredZone(null)}
          />
        ))}
      </svg>

      {/* Card de zona activa */}
      {activeZone !== null && (
        <ZoneCard
          key={activeZone}
          zone={ZONES[activeZone]}
          onClose={() => setActiveZone(null)}
        />
      )}

      {/* Tabs de navegación por zona */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20 flex-wrap justify-center px-4">
        {ZONES.map((zone, i) => (
          <button
            key={zone.id}
            onClick={() => setActiveZone(i === activeZone ? null : i)}
            className="text-xs uppercase tracking-wider px-3 py-2 transition-all duration-200"
            style={{
              background: activeZone === i ? "#2563eb" : "rgba(255,255,255,0.06)",
              color: activeZone === i ? "#fff" : "rgba(255,255,255,0.4)",
              border: "1px solid",
              borderColor: activeZone === i ? "#2563eb" : "rgba(255,255,255,0.1)",
            }}
          >
            {zone.label}
          </button>
        ))}
      </div>

      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
