// Dataset del mapa cenital. Los polígonos vienen del trazado real en
// designs/mapa-loteo-editable.svg, preservando la geometría real de cada
// lote (esquinas redondeadas y bordes diagonales incluidos, no solo su
// bounding box). El fondo es mapa-base.png (1920x1080), el export final del
// recorte (clip-path) definido en ese mismo SVG. Los lotes viven en el
// mismo sistema de coordenadas que ese recorte, así que solo hace falta
// restar el offset del clip (11.4, 63.1) — sin ninguna escala.
// Rubros, colores y numeración de lote confirmados por el cliente vía
// designs/loteo-numero-orden.jpeg + designs/loteo-detalle-completo.jpeg
// (ver docs/PLAN.md). m2/estado siguen siendo MOCK — reemplazar por datos
// reales (Google Sheet) cuando el cliente los confirme.

export type EstadoLote = "disponible" | "reservado" | "vendido";

type Point = [number, number]; // [x, y] en px, espacio de mapa-base.png (1920x1080)

export const MAPA_WIDTH = 1920;
export const MAPA_HEIGHT = 1080;

export interface Zona {
  id: string;
  label: string;
  confirmada: boolean;
  color: string;
}

export interface Lote {
  id: string;
  numero: number;
  m2: number;
  estado: EstadoLote;
  zonaId: string;
  zonaLabel: string;
  color: string;
  polygon: Point[];
  /** Centroide, para ubicar el marcador y la card. */
  centro: Point;
}

export const ZONAS: Zona[] = [
  { id: "instalaciones", label: "Instalaciones del Parque", confirmada: true, color: "#3b82f6" },
  { id: "logistica", label: "Logística y Tecnología", confirmada: true, color: "#38bdf8" },
  { id: "varias", label: "Industrias Varias", confirmada: true, color: "#f8fafc" },
  { id: "alimentarias", label: "Industrias Alimentarias", confirmada: true, color: "#ef4444" },
  { id: "metalurgicas", label: "Industrias Metalúrgicas", confirmada: true, color: "#a855f7" },
  { id: "agricolas", label: "Industrias Agrícolas", confirmada: true, color: "#22c55e" },
];

interface LotePolygon {
  numero: number;
  polygon: Point[];
}

const ZONA_POLYGONS: Record<string, LotePolygon[]> = {
  instalaciones: [
    {
      numero: 1,
      polygon: [[321.4, 268.6], [323.6, 268.8], [325.8, 269.5], [327.8, 270.5], [329.5, 272.0], [331.0, 273.7], [332.0, 275.7], [332.7, 277.9], [332.9, 280.1], [332.9, 410.1], [332.7, 412.3], [332.0, 414.5], [331.0, 416.5], [329.5, 418.2], [327.8, 419.7], [325.8, 420.7], [323.6, 421.4], [321.4, 421.6], [115.6, 421.6], [113.4, 421.4], [111.2, 420.7], [109.2, 419.7], [107.5, 418.2], [106.0, 416.5], [105.0, 414.5], [104.3, 412.3], [104.1, 410.1], [104.1, 280.1], [104.3, 277.9], [105.0, 275.7], [106.0, 273.7], [107.5, 272.0], [109.2, 270.5], [111.2, 269.5], [113.4, 268.8], [115.6, 268.6]],
    },
    { numero: 13, polygon: [[1099.1, 268.6], [1265.2, 268.6], [1099.1, 420.9], [1099.1, 268.6]] },
    {
      numero: 37,
      polygon: [[115.6, 713.2], [112.6, 712.8], [109.8, 711.6], [107.5, 709.8], [105.7, 707.5], [104.5, 704.7], [104.1, 701.7], [104.1, 582.4], [332.9, 582.4], [332.9, 701.7], [332.5, 704.7], [331.3, 707.5], [329.5, 709.8], [327.2, 711.6], [324.4, 712.8], [321.4, 713.2], [115.6, 713.2]],
    },
    {
      numero: 38,
      polygon: [[104.1, 581.3], [104.1, 462.0], [104.5, 459.0], [105.7, 456.2], [107.5, 453.9], [109.8, 452.1], [112.6, 450.9], [115.6, 450.5], [321.4, 450.5], [324.4, 450.9], [327.2, 452.1], [329.5, 453.9], [331.3, 456.2], [332.5, 459.0], [332.9, 462.0], [332.9, 581.3], [104.1, 581.3]],
    },
  ],
  logistica: [
    {
      numero: 2,
      polygon: [[370.9, 421.6], [367.9, 421.2], [365.1, 420.0], [362.8, 418.2], [361.0, 415.9], [359.8, 413.1], [359.4, 410.1], [359.4, 280.1], [359.8, 277.1], [361.0, 274.3], [362.8, 272.0], [365.1, 270.2], [367.9, 269.0], [370.9, 268.6], [419.0, 268.6], [419.0, 421.6], [370.9, 421.6]],
    },
    { numero: 3, polygon: [[420.0, 268.6], [479.6, 268.6], [479.6, 421.6], [420.0, 421.6]] },
    { numero: 4, polygon: [[480.6, 268.6], [540.2, 268.6], [540.2, 421.6], [480.6, 421.6]] },
    { numero: 5, polygon: [[541.2, 268.6], [599.3, 268.6], [599.3, 421.6], [541.2, 421.6]] },
    { numero: 6, polygon: [[600.3, 268.6], [658.4, 268.6], [658.4, 421.6], [600.3, 421.6]] },
    { numero: 7, polygon: [[659.5, 268.6], [717.6, 268.6], [717.6, 421.6], [659.5, 421.6]] },
    { numero: 8, polygon: [[718.6, 268.6], [794.8, 268.6], [794.8, 421.6], [718.6, 421.6]] },
    { numero: 9, polygon: [[795.8, 268.6], [870.6, 268.6], [870.6, 421.6], [795.8, 421.6]] },
    { numero: 10, polygon: [[871.6, 268.6], [946.4, 268.6], [946.4, 421.6], [871.6, 421.6]] },
    { numero: 11, polygon: [[947.4, 268.6], [1022.2, 268.6], [1022.2, 421.6], [947.4, 421.6]] },
    { numero: 12, polygon: [[1023.3, 268.6], [1098.1, 268.6], [1098.1, 421.6], [1023.3, 421.6]] },
  ],
  varias: [
    {
      numero: 14,
      polygon: [[1128.8, 482.5], [1128.8, 453.7], [1128.9, 453.0], [1129.1, 451.2], [1129.6, 448.7], [1130.6, 445.7], [1132.1, 442.7], [1134.2, 440.0], [1145.6, 429.6], [1170.5, 406.9], [1202.4, 378.0], [1234.9, 348.6], [1261.4, 324.6], [1275.5, 311.8], [1275.5, 482.6], [1128.8, 482.6]],
    },
    { numero: 15, polygon: [[1128.8, 483.5], [1275.5, 483.5], [1275.5, 542.2], [1128.8, 542.2]] },
    { numero: 16, polygon: [[1128.8, 543.2], [1275.5, 543.2], [1275.5, 601.9], [1128.8, 601.9]] },
    { numero: 17, polygon: [[1128.8, 602.9], [1275.5, 602.9], [1275.5, 661.6], [1128.8, 661.6]] },
    { numero: 18, polygon: [[1128.8, 662.5], [1275.5, 662.5], [1275.5, 726.5], [1128.8, 726.5]] },
    { numero: 19, polygon: [[1128.8, 727.5], [1275.5, 727.5], [1275.5, 789.2], [1128.8, 789.2]] },
    { numero: 20, polygon: [[1128.8, 790.2], [1275.5, 790.2], [1275.5, 848.9], [1128.8, 848.9]] },
    { numero: 21, polygon: [[1128.8, 849.9], [1275.5, 849.9], [1275.5, 900.3], [1128.8, 900.3]] },
    {
      numero: 22,
      polygon: [[1000.7, 900.3], [1000.7, 744.4], [1086.6, 744.4], [1089.6, 744.8], [1092.4, 746.0], [1094.7, 747.8], [1096.5, 750.1], [1097.7, 752.9], [1098.1, 755.9], [1098.1, 888.8], [1097.7, 891.8], [1096.5, 894.6], [1094.7, 896.9], [1092.4, 898.7], [1089.6, 899.9], [1086.6, 900.3], [1000.7, 900.3]],
    },
    { numero: 23, polygon: [[924.9, 744.4], [999.7, 744.4], [999.7, 900.3], [924.9, 900.3]] },
    { numero: 24, polygon: [[849.1, 744.4], [923.9, 744.4], [923.9, 900.3], [849.1, 900.3]] },
    { numero: 25, polygon: [[773.2, 744.4], [848.0, 744.4], [848.0, 900.3], [773.2, 900.3]] },
    { numero: 26, polygon: [[702.6, 744.4], [772.3, 744.4], [772.3, 900.3], [702.6, 900.3]] },
  ],
  alimentarias: [
    { numero: 27, polygon: [[641.1, 744.4], [701.6, 744.4], [701.6, 900.3], [641.1, 900.3]] },
    { numero: 28, polygon: [[579.6, 744.4], [640.1, 744.4], [640.1, 900.3], [579.6, 900.3]] },
    { numero: 29, polygon: [[512.8, 744.4], [578.6, 744.4], [578.6, 900.3], [512.8, 900.3]] },
    { numero: 30, polygon: [[463.2, 744.4], [511.9, 744.4], [511.9, 900.3], [463.2, 900.3]] },
    { numero: 31, polygon: [[398.9, 744.4], [462.2, 744.4], [462.2, 900.3], [398.9, 900.3]] },
    { numero: 32, polygon: [[338.6, 744.4], [397.8, 744.4], [397.8, 900.3], [338.6, 900.3]] },
    { numero: 33, polygon: [[281.6, 744.4], [337.6, 744.4], [337.6, 857.7], [281.6, 857.7]] },
    { numero: 34, polygon: [[224.6, 744.4], [280.6, 744.4], [280.6, 857.7], [224.6, 857.7]] },
    { numero: 35, polygon: [[164.3, 744.4], [223.5, 744.4], [223.5, 857.7], [164.3, 857.7]] },
    {
      numero: 36,
      polygon: [[104.1, 857.7], [104.1, 755.9], [104.5, 752.9], [105.7, 750.1], [107.5, 747.8], [109.8, 746.0], [112.6, 744.8], [115.6, 744.4], [163.3, 744.4], [163.3, 857.7], [104.1, 857.7]],
    },
  ],
  metalurgicas: [
    {
      numero: 39,
      polygon: [[359.4, 515.4], [359.4, 462.0], [359.8, 459.0], [361.0, 456.2], [362.8, 453.9], [365.1, 452.1], [367.9, 450.9], [370.9, 450.5], [441.9, 450.5], [441.9, 515.4], [359.4, 515.4]],
    },
    { numero: 40, polygon: [[442.9, 450.5], [525.4, 450.5], [525.4, 581.3], [442.9, 581.3]] },
    { numero: 41, polygon: [[526.4, 450.5], [608.9, 450.5], [608.9, 581.3], [526.4, 581.3]] },
    {
      numero: 42,
      polygon: [[609.9, 515.4], [609.9, 450.5], [680.9, 450.5], [683.9, 450.9], [686.7, 452.1], [689.0, 453.9], [690.8, 456.2], [692.0, 459.0], [692.4, 462.0], [692.4, 515.4], [609.9, 515.4]],
    },
    { numero: 43, polygon: [[609.9, 516.4], [692.4, 516.4], [692.4, 581.3], [609.9, 581.3]] },
    { numero: 44, polygon: [[609.9, 582.4], [692.4, 582.4], [692.4, 647.3], [609.9, 647.3]] },
    {
      numero: 45,
      polygon: [[609.9, 713.2], [609.9, 648.3], [692.4, 648.3], [692.4, 701.7], [692.0, 704.7], [690.8, 707.5], [689.0, 709.8], [686.7, 711.6], [683.9, 712.8], [680.9, 713.2], [609.9, 713.2]],
    },
    { numero: 46, polygon: [[526.4, 582.4], [608.9, 582.4], [608.9, 713.2], [526.4, 713.2]] },
    { numero: 47, polygon: [[442.9, 582.4], [525.4, 582.4], [525.4, 713.2], [442.9, 713.2]] },
    {
      numero: 48,
      polygon: [[370.9, 713.2], [367.9, 712.8], [365.1, 711.6], [362.8, 709.8], [361.0, 707.5], [359.8, 704.7], [359.4, 701.7], [359.4, 648.3], [441.9, 648.3], [441.9, 713.2], [370.9, 713.2]],
    },
    { numero: 49, polygon: [[359.4, 582.4], [441.9, 582.4], [441.9, 647.3], [359.4, 647.3]] },
    { numero: 50, polygon: [[359.4, 516.4], [441.9, 516.4], [441.9, 581.3], [359.4, 581.3]] },
  ],
  agricolas: [
    {
      numero: 51,
      polygon: [[720.0, 515.4], [720.0, 462.0], [720.4, 459.0], [721.6, 456.2], [723.4, 453.9], [725.7, 452.1], [728.5, 450.9], [731.5, 450.5], [801.1, 450.5], [801.1, 515.4], [720.0, 515.4]],
    },
    { numero: 52, polygon: [[802.1, 450.5], [873.9, 450.5], [873.9, 581.3], [802.1, 581.3]] },
    { numero: 53, polygon: [[874.9, 450.5], [948.1, 450.5], [948.1, 581.3], [874.9, 581.3]] },
    { numero: 54, polygon: [[949.1, 450.5], [1022.3, 450.5], [1022.3, 581.3], [949.1, 581.3]] },
    {
      numero: 55,
      polygon: [[1023.3, 515.4], [1023.3, 450.5], [1086.6, 450.5], [1089.6, 450.9], [1092.4, 452.1], [1094.7, 453.9], [1096.5, 456.2], [1097.7, 459.0], [1098.1, 462.0], [1098.1, 515.4], [1023.3, 515.4]],
    },
    { numero: 56, polygon: [[1023.3, 516.4], [1098.1, 516.4], [1098.1, 581.3], [1023.3, 581.3]] },
    { numero: 57, polygon: [[1023.3, 582.4], [1098.1, 582.4], [1098.1, 647.3], [1023.3, 647.3]] },
    {
      numero: 58,
      polygon: [[1023.3, 713.2], [1023.3, 648.3], [1098.1, 648.3], [1098.1, 701.7], [1097.7, 704.7], [1096.5, 707.5], [1094.7, 709.8], [1092.4, 711.6], [1089.6, 712.8], [1086.6, 713.2], [1023.3, 713.2]],
    },
    { numero: 59, polygon: [[949.1, 582.4], [1022.3, 582.4], [1022.3, 713.2], [949.1, 713.2]] },
    { numero: 60, polygon: [[874.9, 582.4], [948.1, 582.4], [948.1, 713.2], [874.9, 713.2]] },
    { numero: 61, polygon: [[802.1, 582.4], [873.9, 582.4], [873.9, 713.2], [802.1, 713.2]] },
    {
      numero: 62,
      polygon: [[731.5, 713.2], [728.5, 712.8], [725.7, 711.6], [723.4, 709.8], [721.6, 707.5], [720.4, 704.7], [720.0, 701.7], [720.0, 648.3], [801.1, 648.3], [801.1, 713.2], [731.5, 713.2]],
    },
    { numero: 63, polygon: [[720.0, 582.4], [801.1, 582.4], [801.1, 647.3], [720.0, 647.3]] },
    { numero: 64, polygon: [[720.0, 516.4], [801.1, 516.4], [801.1, 581.3], [720.0, 581.3]] },
  ],
};

// Centroide de área real (no promedio de vértices, que se desvía en polígonos
// con curvas muestreadas: los tramos redondeados concentran más puntos y
// arrastran el promedio hacia esas esquinas).
function centroide(polygon: Point[]): Point {
  let area = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < polygon.length; i++) {
    const [x0, y0] = polygon[i];
    const [x1, y1] = polygon[(i + 1) % polygon.length];
    const cross = x0 * y1 - x1 * y0;
    area += cross;
    cx += (x0 + x1) * cross;
    cy += (y0 + y1) * cross;
  }
  area *= 0.5;
  if (Math.abs(area) < 1e-6) {
    // fallback para polígonos degenerados
    const [sx, sy] = polygon.reduce(([ax, ay], [px, py]) => [ax + px, ay + py], [0, 0]);
    return [sx / polygon.length, sy / polygon.length];
  }
  return [cx / (6 * area), cy / (6 * area)];
}

// m² real por lote, transcripto de designs/loteo-detalle-completo.jpeg (el
// mismo listado que el cliente va a pasar a Google Sheet). Es la fuente de
// verdad hasta que el Sheet esté conectado (ver app/lib/sheet.ts) — a partir
// de ahí el Sheet puede sobreescribir estos valores si el cliente los ajusta.
const M2_REAL: Record<number, number> = {
  1: 14005, 2: 3819, 3: 3819, 4: 3819, 5: 3819, 6: 3819, 7: 3819, 8: 4774,
  9: 4774, 10: 4774, 11: 4774, 12: 4774, 13: 5794, 14: 5873, 15: 3890,
  16: 3870, 17: 3850, 18: 3830, 19: 3810, 20: 3790, 21: 3354, 22: 7042,
  23: 5318, 24: 5331, 25: 5344, 26: 5357, 27: 4295, 28: 4303, 29: 5066,
  30: 3564, 31: 4327, 32: 4388, 33: 2837, 34: 2832, 35: 2827, 36: 2850,
  37: 12943, 38: 12798, 39: 2365, 40: 4730, 41: 4730, 42: 2365, 43: 2365,
  44: 2365, 45: 2365, 46: 4730, 47: 4730, 48: 2365, 49: 2365, 50: 2365,
  51: 4217, 52: 4217, 53: 4217, 54: 4217, 55: 2150, 56: 2150, 57: 2150,
  58: 2150, 59: 4217, 60: 4217, 61: 4217, 62: 4217, 63: 2365, 64: 2365,
};

// Estado (disponible/reservado/vendido) sigue sin dato real — depende del
// Google Sheet. Mock determinista (no Math.random) mientras tanto.
function estadoMock(numero: number): EstadoLote {
  const r = numero % 7;
  if (r === 0) return "vendido";
  if (r === 1 || r === 2) return "reservado";
  return "disponible";
}

export const LOTES: Lote[] = (() => {
  const result: Lote[] = [];
  for (const zona of ZONAS) {
    for (const { numero, polygon } of ZONA_POLYGONS[zona.id]) {
      result.push({
        id: `lote-${numero}`,
        numero,
        m2: M2_REAL[numero],
        estado: estadoMock(numero),
        zonaId: zona.id,
        zonaLabel: zona.label,
        color: zona.color,
        polygon,
        centro: centroide(polygon),
      });
    }
  }
  return result.sort((a, b) => a.numero - b.numero);
})();

export const ESTADO_LABEL: Record<EstadoLote, string> = {
  disponible: "Disponible",
  reservado: "Reservado",
  vendido: "Vendido",
};

/** Lo que puede venir del Google Sheet para un lote puntual (ver app/lib/sheet.ts). */
export interface LoteOverride {
  m2?: number;
  estado?: EstadoLote;
}

/** Mezcla los datos del Sheet sobre el dataset base. `null` = sin Sheet configurado, se usa LOTES tal cual. */
export function mergeLoteOverrides(overrides: Map<number, LoteOverride> | null): Lote[] {
  if (!overrides) return LOTES;
  return LOTES.map((lote) => {
    const override = overrides.get(lote.numero);
    if (!override) return lote;
    return {
      ...lote,
      m2: override.m2 ?? lote.m2,
      estado: override.estado ?? lote.estado,
    };
  });
}

export const ESTADO_COLOR: Record<EstadoLote, string> = {
  disponible: "#22c55e",
  reservado: "#facc15",
  vendido: "#71717a",
};
