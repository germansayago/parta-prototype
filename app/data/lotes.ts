// Dataset del mapa cenital. Los polígonos vienen del trazado real en
// designs/mapa-loteo.svg (viewBox 1173.37 x 633.72, dibujado sobre
// designs/mapa-base.jpg), convertidos a % relativo a esa imagen.
// m2/estado siguen siendo MOCK — reemplazar por datos reales (Google Sheet)
// cuando el cliente los confirme. Ver docs/PLAN.md.

export type EstadoLote = "disponible" | "reservado" | "vendido";

type Point = [number, number]; // [xPct, yPct] relativo a la imagen base, 0-100

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
  /** Centroide aproximado, para ubicar el marcador y la card. */
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
// grande que el resto, no es un lote) — ver conversación de análisis del SVG.
const ZONA_POLYGONS: Record<string, Point[][]> = {
  varias: [
    [[0.04, 0.08], [19.63, 0.08], [19.63, 24.38], [0.04, 24.38]],
    [[21.8, 0.08], [26.97, 0.08], [26.97, 24.38], [21.8, 24.38]],
    [[26.97, 0.08], [32.13, 0.08], [32.13, 24.38], [26.97, 24.38]],
    [[32.13, 0.08], [37.29, 0.08], [37.29, 24.38], [32.13, 24.38]],
    [[37.29, 0.08], [42.33, 0.08], [42.33, 24.38], [37.29, 24.38]],
    [[42.33, 0.08], [47.37, 0.08], [47.37, 24.38], [42.33, 24.38]],
    [[47.37, 0.08], [52.41, 0.08], [52.41, 24.38], [47.37, 24.38]],
    [[52.41, 0.08], [58.99, 0.08], [58.99, 24.38], [52.41, 24.38]],
    [[58.99, 0.08], [65.45, 0.08], [65.45, 24.38], [58.99, 24.38]],
    [[65.45, 0.08], [71.92, 0.08], [71.92, 24.38], [65.45, 24.38]],
    [[71.92, 0.08], [78.38, 0.08], [78.38, 24.38], [71.92, 24.38]],
    [[78.38, 0.08], [84.84, 0.08], [84.84, 24.38], [78.38, 24.38]],
    [[84.84, 0.08], [99.15, 0.08], [99.15, 24.38], [84.84, 24.38]],
  ],
  "zona-02": [
    [[0.04, 28.79], [19.63, 28.79], [19.63, 49.59], [0.04, 49.59]],
    [[0.04, 49.59], [19.63, 49.59], [19.63, 70.4], [0.04, 70.4]],
  ],
  "zona-03": [
    [[21.8, 28.79], [28.92, 28.79], [28.92, 39.19], [21.8, 39.19]],
    [[28.92, 28.79], [36.03, 28.79], [36.03, 49.59], [28.92, 49.59]],
    [[36.03, 28.79], [43.15, 28.79], [43.15, 49.59], [36.03, 49.59]],
    [[43.15, 28.79], [50.26, 28.79], [50.26, 39.19], [43.15, 39.19]],
    [[21.8, 39.19], [28.92, 39.19], [28.92, 49.59], [21.8, 49.59]],
    [[43.15, 39.19], [50.26, 39.19], [50.26, 49.59], [43.15, 49.59]],
    [[21.8, 49.59], [28.92, 49.59], [28.92, 59.99], [21.8, 59.99]],
    [[28.92, 49.59], [36.03, 49.59], [36.03, 70.4], [28.92, 70.4]],
    [[36.03, 49.59], [43.15, 49.59], [43.15, 70.4], [36.03, 70.4]],
    [[43.15, 49.59], [50.26, 49.59], [50.26, 59.99], [43.15, 59.99]],
    [[21.8, 60.0], [28.92, 60.0], [28.92, 70.4], [21.8, 70.4]],
    [[43.15, 60.0], [50.26, 60.0], [50.26, 70.4], [43.15, 70.4]],
  ],
  "zona-04": [
    [[52.54, 28.79], [59.53, 28.79], [59.53, 39.19], [52.54, 39.19]],
    [[59.53, 28.79], [65.74, 28.79], [65.74, 49.59], [59.53, 49.59]],
    [[65.74, 28.79], [72.06, 28.79], [72.06, 49.59], [65.74, 49.59]],
    [[72.06, 28.79], [78.38, 28.79], [78.38, 49.59], [72.06, 49.59]],
    [[78.38, 28.79], [84.84, 28.79], [84.84, 39.19], [78.38, 39.19]],
    [[52.54, 39.19], [59.53, 39.19], [59.53, 49.59], [52.54, 49.59]],
    [[78.38, 39.19], [84.84, 39.19], [84.84, 49.59], [78.38, 49.59]],
    [[52.54, 49.59], [59.53, 49.59], [59.53, 59.99], [52.54, 59.99]],
    [[59.53, 49.59], [65.74, 49.59], [65.74, 70.4], [59.53, 70.4]],
    [[65.74, 49.59], [72.06, 49.59], [72.06, 70.4], [65.74, 70.4]],
    [[72.06, 49.59], [78.38, 49.59], [78.38, 70.4], [72.06, 70.4]],
    [[78.38, 49.59], [84.84, 49.59], [84.84, 59.99], [78.38, 59.99]],
    [[52.54, 60.0], [59.53, 60.0], [59.53, 70.4], [52.54, 70.4]],
    [[78.38, 60.0], [84.84, 60.0], [84.84, 70.4], [78.38, 70.4]],
  ],
  alimentarias: [
    [[0.04, 75.16], [5.18, 75.16], [5.18, 93.21], [0.04, 93.21]],
    [[5.18, 75.16], [10.31, 75.16], [10.31, 93.21], [5.18, 93.21]],
    [[10.31, 75.16], [15.17, 75.16], [15.17, 93.21], [10.31, 93.21]],
    [[15.17, 75.16], [20.03, 75.16], [20.03, 93.21], [15.17, 93.21]],
  ],
  "zona-06": [
    [[87.37, 33.99], [99.96, 33.99], [99.96, 43.41], [87.37, 43.41]],
    [[87.37, 43.41], [99.96, 43.41], [99.96, 52.83], [87.37, 52.83]],
    [[87.37, 52.83], [99.96, 52.83], [99.96, 62.25], [87.37, 62.25]],
    [[87.37, 62.25], [99.96, 62.25], [99.96, 72.5], [87.37, 72.5]],
    [[87.37, 72.5], [99.96, 72.5], [99.96, 82.39], [87.37, 82.39]],
    [[20.03, 75.16], [25.17, 75.16], [25.17, 99.92], [20.03, 99.92]],
    [[25.17, 75.16], [30.65, 75.16], [30.65, 99.92], [25.17, 99.92]],
    [[30.65, 75.16], [34.88, 75.16], [34.88, 99.92], [30.65, 99.92]],
    [[34.88, 75.16], [40.57, 75.16], [40.57, 99.92], [34.88, 99.92]],
    [[40.57, 75.16], [45.81, 75.16], [45.81, 99.92], [40.57, 99.92]],
    [[45.81, 75.16], [51.05, 75.16], [51.05, 99.92], [45.81, 99.92]],
    [[51.05, 75.16], [57.07, 75.16], [57.07, 99.92], [51.05, 99.92]],
    [[57.07, 75.16], [63.53, 75.16], [63.53, 99.92], [57.07, 99.92]],
    [[63.53, 75.16], [70.0, 75.16], [70.0, 99.92], [63.53, 99.92]],
    [[70.0, 75.16], [76.46, 75.16], [76.46, 99.92], [70.0, 99.92]],
    [[76.46, 75.16], [84.84, 75.16], [84.84, 99.92], [76.46, 99.92]],
    [[87.37, 82.39], [99.96, 82.39], [99.96, 91.81], [87.37, 91.81]],
    [[87.37, 91.81], [99.96, 91.81], [99.96, 99.92], [87.37, 99.92]],
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
