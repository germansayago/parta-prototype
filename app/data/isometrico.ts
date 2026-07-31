// Dataset del mapa isométrico. Los polígonos vienen del trazado real en
// designs/isometrico/plano.svg (mismo viewBox 1920x1080 que las imágenes,
// sin offset ni escala — a diferencia del cenital, acá no hace falta restar
// ningún clip). El SVG no identifica qué polígono es cada zona: se resolvió
// por matching de centroides contra la región que cambia de color en cada
// imagen -zona.webp respecto de neutral.webp (diff de píxeles), sin
// ambigüedad (todas las zonas matchearon con error < 0.02 en coordenadas
// normalizadas, salvo "varias" que es un polígono único que abarca sus dos
// clusters — ver abajo).
//
// Cada zona tiene su propia imagen 1920x1080 con esa zona resaltada a color
// y el resto en gris (mismo encuadre que neutral.webp, que es el estado sin
// selección). Al hacer click se cambia el <image href> por la variante de esa
// zona, igual al approach charlado con el cliente.
//
// Colores de pill: mismo rubro/taxonomía ya confirmada para el cenital (ver
// app/data/lotes.ts, ZONAS) — son el mismo color por rubro en todo el sitio.
// "Industrias Varias" usa blanco (#f8fafc) como color de marca del rubro,
// pero como texto sobre pill blanco sería ilegible, se usa un gris oscuro
// para el texto del pill en vez del color de marca literal.

export type Point = [number, number];

export const ISO_WIDTH = 1920;
export const ISO_HEIGHT = 1080;

export const ISO_NEUTRAL_IMG = "/images/isometrico/neutral.webp";

export interface ZonaIsometrica {
  id: string;
  image: string;
  /** Nombre corto para el tab de navegación inferior — el título es una oración completa, no entra ahí. */
  tabLabel: string;
  pillLabel: string | null;
  pillColor: string | null;
  title: string;
  description: string | null;
  polygon: Point[];
  centro: Point;
  /** Área del polígono (shoelace, valor absoluto) — usada para decidir qué zona gana el hover/click
   * donde dos polígonos se superponen (ver nota abajo), no para nada visual. */
  area: number;
}

function shoelace(polygon: Point[]): { area: number; signedArea: number } {
  let signedArea = 0;
  for (let i = 0; i < polygon.length; i++) {
    const [x0, y0] = polygon[i];
    const [x1, y1] = polygon[(i + 1) % polygon.length];
    signedArea += x0 * y1 - x1 * y0;
  }
  signedArea *= 0.5;
  return { area: Math.abs(signedArea), signedArea };
}

function centroide(polygon: Point[], signedArea: number): Point {
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < polygon.length; i++) {
    const [x0, y0] = polygon[i];
    const [x1, y1] = polygon[(i + 1) % polygon.length];
    const cross = x0 * y1 - x1 * y0;
    cx += (x0 + x1) * cross;
    cy += (y0 + y1) * cross;
  }
  if (Math.abs(signedArea) < 1e-6) {
    const n = polygon.length;
    const sum = polygon.reduce(([sx, sy], [x, y]) => [sx + x, sy + y], [0, 0]);
    return [sum[0] / n, sum[1] / n];
  }
  return [cx / (6 * signedArea), cy / (6 * signedArea)];
}

function zona(data: Omit<ZonaIsometrica, "centro" | "area">): ZonaIsometrica {
  const { area, signedArea } = shoelace(data.polygon);
  return { ...data, centro: centroide(data.polygon, signedArea), area };
}

export const ZONAS_ISOMETRICAS: ZonaIsometrica[] = [
  zona({
    id: "agricolas",
    tabLabel: "Industrias Agrícolas",
    image: "/images/isometrico/industrias-agricolas.webp",
    pillLabel: "Industrias Agrícolas",
    pillColor: "#22c55e",
    title: "Un entorno estratégico para el sector agroindustrial",
    description:
      "Ubicado en una región clave para la producción agrícola, Parta ofrece infraestructura diseñada para almacenamiento, procesamiento y distribución de productos agroindustriales.",
    polygon: [
      [1440.4, 629.2],
      [1227.4, 807.3],
      [764, 625.9],
      [988.5, 450.5],
    ],
  }),
  zona({
    id: "alimentarias",
    tabLabel: "Industrias Alimentarias",
    image: "/images/isometrico/industrias-alimentarias.webp",
    pillLabel: "Industrias Alimentarias",
    pillColor: "#ef4444",
    title: "Infraestructura diseñada para la industria alimentaria",
    description:
      "Pensado para empresas que requieren espacios aptos para la producción, almacenamiento y distribución de alimentos. Contamos con infraestructura adaptada a normativas sanitarias, accesos controlados y cercanía a las principales rutas de distribución.",
    polygon: [
      [0.5, 360.1],
      [33.9, 335.9],
      [148, 380.5],
      [148, 406.4],
      [657.7, 605.1],
      [529, 710.8],
      [169.5, 574.3],
      [218.5, 535.5],
      [0.5, 450.5],
    ],
  }),
  zona({
    id: "metalurgicas",
    tabLabel: "Industrias Metalúrgicas",
    image: "/images/isometrico/industrias-metalurgicas.webp",
    pillLabel: "Industrias Metalúrgicas",
    pillColor: "#a855f7",
    title: "Un espacio ideal para la industria metalúrgica",
    description:
      "Parta ofrece áreas diseñadas para empresas metalúrgicas, con infraestructura preparada para la fabricación, ensamblaje y almacenamiento de productos industriales.",
    polygon: [
      [346.5, 462.9],
      [560.7, 289.1],
      [964, 441.7],
      [745.4, 617.5],
    ],
  }),
  zona({
    id: "varias",
    tabLabel: "Industrias Varias",
    image: "/images/isometrico/industrias-varias.webp",
    pillLabel: "Industrias Varias",
    pillColor: "#64748b",
    title: "Áreas pensadas para todo tipo de necesidades operativas",
    description:
      "Un sector flexible pensado para empresas con distintas necesidades productivas, operativas y de servicios. Con infraestructura, conectividad y servicios adaptados a cada operación.",
    polygon: [
      [1722.5, 641.2],
      [1279.9, 1004],
      [529, 710.8],
      [657.7, 605.1],
      [1233, 829],
      [1464.7, 642.4],
    ],
  }),
  zona({
    id: "logistica",
    tabLabel: "Logística y Tecnología",
    image: "/images/isometrico/logistica-y-tecnologia.webp",
    pillLabel: "Logística y Tecnología",
    pillColor: "#38bdf8",
    title: "Innovación y eficiencia en un solo lugar",
    description:
      "El sector de tecnología y logística está diseñado para empresas que buscan optimizar sus operaciones con infraestructura moderna y conectividad estratégica.",
    polygon: [
      [582.8, 272.1],
      [712.4, 163.3],
      [1576.6, 505],
      [1452.1, 609.3],
    ],
  }),
  zona({
    id: "ingreso",
    tabLabel: "Ingreso",
    image: "/images/isometrico/ingreso.webp",
    pillLabel: null,
    pillColor: null,
    title: "Ingreso al parque y administración PARTA®",
    description: null,
    polygon: [
      [1761.1, 582.7],
      [1754.1, 601.8],
      [1452.1, 609.3],
      [1576.6, 505],
    ],
  }),
];
