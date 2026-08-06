// Agrupación de los 64 lotes en 2 zonas por posición física (no por rubro),
// usada solo para el drill-down mobile (parque completo -> zona -> lote). Es
// una decisión de UX, no de negocio: a diferencia de ZONAS en lotes.ts
// (rubros confirmados por el cliente), esta agrupación la definimos nosotros.
//
// Se probó primero con 6 zonas (una por "manzana" real), pero el tamaño
// físico de cada manzana varía demasiado (de 3 lotes muy grandes a 15 lotes
// en una tira angosta), así que el zoom quedaba con una escala muy distinta
// según la zona elegida. Se simplificó a 2 zonas partiendo el predio a la
// mitad: con el ancho de pantalla como limitante en mobile (no el alto, que
// sobra), dividir en más de 2 zonas no reduce más ese ancho — solo suma un
// nivel de navegación sin beneficio real. La agrupación exacta (qué lote va
// en cada mitad) viene de designs/mapa-cenital/mobile/loteo-zona-1.jpg y loteo-zona-2.jpg — ver
// docs/PLAN.md.
import { LOTE_GEOMETRY_MOBILE, MAPA_MOBILE_PARK_BBOX } from "./lotesMobileGeometry";

export interface ZonaMobile {
  id: string;
  label: string;
  numeros: number[];
}

export const ZONAS_MOBILES: ZonaMobile[] = [
  { id: "z1", label: "Zona 01", numeros: [1, 2, 3, 4, 5, 6, 7, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50] },
  { id: "z2", label: "Zona 02", numeros: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64] },
];

export interface BBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

function bboxRawDeZona(numeros: number[]): BBox {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const numero of numeros) {
    const geo = LOTE_GEOMETRY_MOBILE[numero];
    if (!geo) continue;
    for (const [x, y] of geo.polygon) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  return { minX, minY, maxX, maxY };
}

const PARK_BBOX_RAW = bboxRawDeZona(ZONAS_MOBILES.flatMap((z) => z.numeros));
const PARK_CENTER_X = (PARK_BBOX_RAW.minX + PARK_BBOX_RAW.maxX) / 2;

export interface ZonaZoomTransform {
  /** Punto (en coordenadas del viewBox base) que queda fijo en pantalla al escalar — el borde
   * izquierdo del predio para la zona izquierda, el derecho para la derecha. */
  originX: number;
  originY: number;
  scale: number;
}

// El "zoom" a una zona NO recorta un viewBox nuevo (eso fue lo que se probó primero y generó
// el bug reportado: la proporción del contenedor cambiaba entre nivel 1 y nivel 2, y el mapa
// se veía "recortado casi al límite" en vez de mantenerse encuadrado). En cambio, ambos
// niveles comparten el mismo viewBox (MAPA_MOBILE_PARK_BBOX) y el zoom es una transformación
// de escala (`translate(ox,oy) scale(s) translate(-ox,-oy)`) aplicada sobre ese mismo
// contenido — igual al comportamiento de designs/mapa-cenital/mobile/mapa-zona-1.jpg / mapa-zona-2.jpg
// (mismo encuadre vertical que mapa-general.png, el zoom es puramente horizontal). El origen
// se ancla al borde izquierdo o derecho del bbox base (según de qué lado está la zona) para
// que ese borde quede fijo en pantalla y el contenido "crezca" hacia el centro/lado opuesto.
// La escala se calcula para que el borde de la zona más cercano al centro del predio llegue
// justo al borde opuesto del encuadre original — la zona pasa a ocupar la pantalla completa.
//
// El anclaje vertical usa el centro del PREDIO REAL (PARK_BBOX_RAW), no el centro del bbox
// con padding (MAPA_MOBILE_PARK_BBOX): ese bbox tiene padding asimétrico (más abajo que
// arriba, para dejar aire a los botones del nivel 1 — ver PARK_PAD_TOP/PARK_PAD_BOTTOM en
// lotesMobileGeometry.ts), así que su centro queda más abajo que el centro real del predio.
// Si se ancla ahí, al escalar el predio se corre hacia arriba (el punto fijo del escalado
// queda por debajo del centro real) — bug reportado como "el mapa no queda centrado" al
// hacer zoom a una zona.
const ZOOM_ORIGIN_Y = (PARK_BBOX_RAW.minY + PARK_BBOX_RAW.maxY) / 2;
const ZOOM_BASE_WIDTH = MAPA_MOBILE_PARK_BBOX.maxX - MAPA_MOBILE_PARK_BBOX.minX;

// Sin este margen, la escala se calcula para que el borde de la zona más cercano al centro
// del predio (el lote pegado a esa mitad, no el borde exterior del predio) llegue EXACTO al
// borde opuesto de la pantalla — 0px de aire ahí (reportado como "el lote del lateral queda
// muy justo" probando en celular real). El borde exterior (anclado en originX) no tiene este
// problema: al escalar crece alejándose del anclaje, así que ya le sobra aire.
// Restar este margen de ZOOM_BASE_WIDTH antes de calcular la escala baja un poco el zoom (la
// zona no llega a ocupar el 100% del ancho) y deja ese mismo aire también del lado interior
// — mismo orden de magnitud que PARK_PAD_X (padding del predio completo en nivel 1) para que
// se sienta consistente, pero es una constante propia porque controla algo distinto (qué tan
// "pegado" queda el zoom, no el encuadre base). No afecta el recorte vertical: eso lo decide
// el aspect ratio del viewBox contra el contenedor en el <svg> de más arriba, independiente
// de este transform interno.
const ZOOM_INNER_MARGIN = 70;

export const ZONA_MOBILE_ZOOM: Record<string, ZonaZoomTransform> = Object.fromEntries(
  ZONAS_MOBILES.map((zona) => {
    const b = bboxRawDeZona(zona.numeros);
    const esIzquierda = (b.minX + b.maxX) / 2 < PARK_CENTER_X;
    const originX = esIzquierda ? MAPA_MOBILE_PARK_BBOX.minX : MAPA_MOBILE_PARK_BBOX.maxX;
    const targetWidth = ZOOM_BASE_WIDTH - ZOOM_INNER_MARGIN;
    const scale = esIzquierda ? targetWidth / (b.maxX - originX) : targetWidth / (originX - b.minX);
    return [zona.id, { originX, originY: ZOOM_ORIGIN_Y, scale }];
  })
);

/** Centro superior del bbox real de la zona (sin el padding del crop), para anclar el tag flotante sobre el bloque en el nivel 1. */
export const ZONA_MOBILE_TAG_ANCHOR: Record<string, [number, number]> = Object.fromEntries(
  ZONAS_MOBILES.map((zona) => {
    const b = bboxRawDeZona(zona.numeros);
    return [zona.id, [(b.minX + b.maxX) / 2, b.minY] as [number, number]];
  })
);

const LOTE_A_ZONA_MOBILE: Record<number, string> = Object.fromEntries(
  ZONAS_MOBILES.flatMap((zona) => zona.numeros.map((numero) => [numero, zona.id]))
);

export function zonaMobileDeLote(numero: number): ZonaMobile | undefined {
  const id = LOTE_A_ZONA_MOBILE[numero];
  return ZONAS_MOBILES.find((z) => z.id === id);
}
