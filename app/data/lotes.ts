// Dataset del mapa cenital. Los polígonos vienen del trazado real en
// designs/mapa-loteo-editable.svg. Ese archivo tiene una imagen de fondo
// oculta (mapa-loteo-editable-1.png) con transform="scale(1.2)" + un
// clip-path de 1920x1080 con offset (11.4, 63.1) — ese recorte, exportado
// tal cual, es designs/mapa-base-ok.png (público como
// public/images/mapa/mapa-base.png). Los lotes de Layer_2 viven en el MISMO
// sistema de coordenadas que ese recorte (no tienen el transform de la
// imagen), así que solo hace falta restar el offset del clip-path — sin
// aplicar el scale(1.2) (ese factor es interno a cómo se armó la imagen
// oculta, no aplica a la relación lotes↔recorte final).
// m2/estado siguen siendo MOCK — reemplazar por datos reales (Google Sheet)
// cuando el cliente los confirme. Ver docs/PLAN.md.

export type EstadoLote = "disponible" | "reservado" | "vendido";

type Point = [number, number]; // [x, y] en px, espacio de mapa-base.png (1920x1080)

export const MAPA_WIDTH = 1920;
export const MAPA_HEIGHT = 1080;

export interface Zona {
  id: string;
  /** Nombre de rubro. Placeholder "ZONA 0X" hasta confirmar con cliente (ver PLAN.md). */
  label: string;
  /** true = rubro confirmado por diseño/cliente, false = placeholder. */
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
  { id: "varias", label: "Industrias Varias", confirmada: true, color: "#38bdf8" },
  { id: "zona-02", label: "ZONA 02", confirmada: false, color: "#3b82f6" },
  { id: "zona-03", label: "ZONA 03", confirmada: false, color: "#a855f7" },
  { id: "zona-04", label: "ZONA 04", confirmada: false, color: "#22c55e" },
  { id: "alimentarias", label: "Industrias Alimentarias", confirmada: true, color: "#ef4444" },
  { id: "zona-06", label: "ZONA 06", confirmada: false, color: "#facc15" },
];

// Se excluye del trazado original la rampa diagonal de acceso (bbox mucho más
// grande que el resto, no es un lote).
const ZONA_POLYGONS: Record<string, Point[][]> = {
  varias: [
    [[419.5, 268.1], [480.1, 268.1], [480.1, 422.1], [419.5, 422.1]],
    [[103.6, 268.1], [333.4, 268.1], [333.4, 422.1], [103.6, 422.1]],
    [[480.1, 268.1], [540.7, 268.1], [540.7, 422.1], [480.1, 422.1]],
    [[540.7, 268.1], [599.8, 268.1], [599.8, 422.1], [540.7, 422.1]],
    [[599.8, 268.1], [658.9, 268.1], [658.9, 422.1], [599.8, 422.1]],
    [[659.0, 268.1], [718.1, 268.1], [718.1, 422.1], [659.0, 422.1]],
    [[718.1, 268.1], [795.3, 268.1], [795.3, 422.1], [718.1, 422.1]],
    [[795.3, 268.1], [871.1, 268.1], [871.1, 422.1], [795.3, 422.1]],
    [[871.1, 268.1], [946.9, 268.1], [946.9, 422.1], [871.1, 422.1]],
    [[946.9, 268.1], [1022.7, 268.1], [1022.7, 422.1], [946.9, 422.1]],
    [[1022.8, 268.1], [1098.6, 268.1], [1098.6, 422.1], [1022.8, 422.1]],
    [[1098.6, 268.1], [1266.5, 268.1], [1266.5, 422.1], [1098.6, 422.1]],
    [[358.9, 268.1], [419.5, 268.1], [419.5, 422.1], [358.9, 422.1]],
  ],
  "zona-02": [
    [[103.6, 450.0], [333.4, 450.0], [333.4, 581.8], [103.6, 581.8]],
    [[103.6, 581.9], [333.4, 581.9], [333.4, 713.7], [103.6, 713.7]],
  ],
  "zona-03": [
    [[442.4, 450.0], [525.9, 450.0], [525.9, 581.8], [442.4, 581.8]],
    [[525.9, 450.0], [609.4, 450.0], [609.4, 581.8], [525.9, 581.8]],
    [[442.4, 581.9], [525.9, 581.9], [525.9, 713.7], [442.4, 713.7]],
    [[525.9, 581.9], [609.4, 581.9], [609.4, 713.7], [525.9, 713.7]],
    [[609.4, 515.9], [692.9, 515.9], [692.9, 581.8], [609.4, 581.8]],
    [[609.4, 581.9], [692.9, 581.9], [692.9, 647.8], [609.4, 647.8]],
    [[358.9, 515.9], [442.4, 515.9], [442.4, 581.8], [358.9, 581.8]],
    [[358.9, 581.9], [442.4, 581.9], [442.4, 647.8], [358.9, 647.8]],
    [[358.9, 450.0], [442.4, 450.0], [442.4, 515.9], [358.9, 515.9]],
    [[609.4, 450.0], [692.9, 450.0], [692.9, 515.9], [609.4, 515.9]],
    [[609.4, 647.8], [692.9, 647.8], [692.9, 713.7], [609.4, 713.7]],
    [[358.9, 647.8], [442.4, 647.8], [442.4, 713.7], [358.9, 713.7]],
  ],
  "zona-04": [
    [[801.6, 450.0], [874.4, 450.0], [874.4, 581.8], [801.6, 581.8]],
    [[874.4, 450.0], [948.6, 450.0], [948.6, 581.8], [874.4, 581.8]],
    [[801.6, 581.9], [874.4, 581.9], [874.4, 713.7], [801.6, 713.7]],
    [[874.4, 581.9], [948.6, 581.9], [948.6, 713.7], [874.4, 713.7]],
    [[948.6, 450.0], [1022.8, 450.0], [1022.8, 581.8], [948.6, 581.8]],
    [[948.6, 581.9], [1022.8, 581.9], [1022.8, 713.7], [948.6, 713.7]],
    [[1022.8, 515.9], [1098.6, 515.9], [1098.6, 581.8], [1022.8, 581.8]],
    [[1022.8, 581.9], [1098.6, 581.9], [1098.6, 647.8], [1022.8, 647.8]],
    [[719.5, 515.9], [801.6, 515.9], [801.6, 581.8], [719.5, 581.8]],
    [[719.5, 581.9], [801.6, 581.9], [801.6, 647.8], [719.5, 647.8]],
    [[719.5, 450.0], [801.6, 450.0], [801.6, 515.9], [719.5, 515.9]],
    [[1022.8, 450.0], [1098.6, 450.0], [1098.6, 515.9], [1022.8, 515.9]],
    [[1022.8, 647.8], [1098.6, 647.8], [1098.6, 713.7], [1022.8, 713.7]],
    [[719.5, 647.8], [801.6, 647.8], [801.6, 713.7], [719.5, 713.7]],
  ],
  alimentarias: [
    [[163.8, 743.9], [224.0, 743.9], [224.0, 858.2], [163.8, 858.2]],
    [[224.1, 743.9], [281.1, 743.9], [281.1, 858.2], [224.1, 858.2]],
    [[281.1, 743.9], [338.1, 743.9], [338.1, 858.2], [281.1, 858.2]],
    [[103.6, 743.9], [163.8, 743.9], [163.8, 858.2], [103.6, 858.2]],
  ],
  "zona-06": [
    [[1128.3, 483.0], [1276.0, 483.0], [1276.0, 542.7], [1128.3, 542.7]],
    [[1128.3, 542.7], [1276.0, 542.7], [1276.0, 602.4], [1128.3, 602.4]],
    [[1128.3, 602.4], [1276.0, 602.4], [1276.0, 662.1], [1128.3, 662.1]],
    [[1128.3, 662.0], [1276.0, 662.0], [1276.0, 727.0], [1128.3, 727.0]],
    [[1128.3, 727.0], [1276.0, 727.0], [1276.0, 789.7], [1128.3, 789.7]],
    [[1128.3, 789.7], [1276.0, 789.7], [1276.0, 849.4], [1128.3, 849.4]],
    [[1128.3, 849.4], [1276.0, 849.4], [1276.0, 900.8], [1128.3, 900.8]],
    [[640.6, 743.9], [702.1, 743.9], [702.1, 900.8], [640.6, 900.8]],
    [[579.1, 743.9], [640.6, 743.9], [640.6, 900.8], [579.1, 900.8]],
    [[512.3, 743.9], [579.1, 743.9], [579.1, 900.8], [512.3, 900.8]],
    [[462.7, 743.9], [512.4, 743.9], [512.4, 900.8], [462.7, 900.8]],
    [[398.4, 743.9], [462.7, 743.9], [462.7, 900.8], [398.4, 900.8]],
    [[338.1, 743.9], [398.3, 743.9], [398.3, 900.8], [338.1, 900.8]],
    [[702.1, 743.9], [772.8, 743.9], [772.8, 900.8], [702.1, 900.8]],
    [[772.7, 743.9], [848.5, 743.9], [848.5, 900.8], [772.7, 900.8]],
    [[848.6, 743.9], [924.4, 743.9], [924.4, 900.8], [848.6, 900.8]],
    [[924.4, 743.9], [1000.2, 743.9], [1000.2, 900.8], [924.4, 900.8]],
    [[1000.2, 743.9], [1098.6, 743.9], [1098.6, 900.8], [1000.2, 900.8]],
  ],
};

function centroide(polygon: Point[]): Point {
  const [x, y] = polygon.reduce(([sx, sy], [px, py]) => [sx + px, sy + py], [0, 0]);
  return [x / polygon.length, y / polygon.length];
}

// Superficie/estado deterministas (no Math.random, para que no cambien entre renders).
function m2Mock(numero: number): number {
  return 3200 + ((numero * 137) % 3400);
}
function estadoMock(numero: number): EstadoLote {
  const r = numero % 7;
  if (r === 0) return "vendido";
  if (r === 1 || r === 2) return "reservado";
  return "disponible";
}

export const LOTES: Lote[] = (() => {
  const result: Lote[] = [];
  let numero = 1;
  for (const zona of ZONAS) {
    for (const polygon of ZONA_POLYGONS[zona.id]) {
      result.push({
        id: `lote-${numero}`,
        numero,
        m2: m2Mock(numero),
        estado: estadoMock(numero),
        zonaId: zona.id,
        zonaLabel: zona.label,
        color: zona.color,
        polygon,
        centro: centroide(polygon),
      });
      numero++;
    }
  }
  return result;
})();

export const ESTADO_LABEL: Record<EstadoLote, string> = {
  disponible: "Disponible",
  reservado: "Reservado",
  vendido: "Vendido",
};

export const ESTADO_COLOR: Record<EstadoLote, string> = {
  disponible: "#22c55e",
  reservado: "#facc15",
  vendido: "#71717a",
};
