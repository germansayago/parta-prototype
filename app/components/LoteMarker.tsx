import { pointsToPath } from "./chamfer";
import { type EstadoLote } from "../data/lotes";

// Marcador de lote: cuadrado biselado con el número de lote adentro. Antes
// era un cuadradito de 14x14 sin número — el cliente reportó que había que
// recorrer lote por lote para encontrar uno puntual, así que se agrandó y se
// le sumó el número. El bisel acá es distinto del resto del sitio (variantes
// "nav"/"cta"/"form" de chamfer.ts, que cortan 3 esquinas): el diseño que
// pasó el cliente para este marcador puntual corta solo dos esquinas
// opuestas (arriba-derecha y abajo-izquierda), así que se arma acá mismo en
// vez de sumar una variante nueva a chamfer.ts que no se usa en ningún otro
// lado. Compartido por CenitalMapDesktop y CenitalMapMobile; LoteDetailCard
// importa el tamaño para alinear el "tallo" de la card contra el marcador real.
export const LOTE_MARKER_WIDTH = 25;
export const LOTE_MARKER_HEIGHT = 25;
const MARKER_CUT = 6;

/** Hexágono con esquinas arriba-derecha y abajo-izquierda cortadas; arriba-izquierda y abajo-derecha rectas. */
function markerPoints(x: number, y: number, w: number, h: number, cut: number): [number, number][] {
  return [
    [x, y],
    [x + w - cut, y],
    [x + w, y + cut],
    [x + w, y + h],
    [x + cut, y + h],
    [x, y + h - cut],
  ];
}

// La mayoría de los colores de rubro (azul, celeste, rojo, violeta, verde)
// funcionan con número blanco; "Industrias Varias" es blanco (#f8fafc) y
// necesita texto oscuro. Se decide por luminancia relativa en vez de
// hardcodear ese hex puntual, por si algún color de rubro cambia.
function relativeLuminance(hex: string): number {
  const c = hex.replace("#", "");
  const channel = (i: number) => parseInt(c.substring(i, i + 2), 16) / 255;
  const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * lin(channel(0)) + 0.7152 * lin(channel(2)) + 0.0722 * lin(channel(4));
}

// Lotes reservados o vendidos (ninguno de los dos es accionable: no se puede
// reservar algo que ya está reservado o vendido) se pintan en gris con
// opacidad reducida en vez del color de rubro, para que se lean de un
// vistazo como "no disponible" sin tener que abrir la card. Gris propio del
// marcador, no el mismo que ESTADO_COLOR (ese distingue reservado/vendido
// para el pill de la card; acá alcanza con un solo tono para "no disponible").
const NO_DISPONIBLE_COLOR = "#71717a";
const NO_DISPONIBLE_OPACITY = 0.55;

export default function LoteMarker({
  numero,
  color,
  estado,
  x,
  y,
  sizeMultiplier = 1,
}: {
  numero: number;
  color: string;
  estado: EstadoLote;
  /** Centro del marcador, en el mismo sistema de coordenadas del <svg> (map px, no screen px). */
  x: number;
  y: number;
  /** El mapa mobile (nivel zoom de zona) renderiza a una escala final más baja que desktop
   * (viewBox más chico multiplicado por el zoom de zona), así que el mismo tamaño en unidades
   * de viewBox queda más chico en pantalla ahí — CenitalMapMobile pasa un multiplicador >1
   * para compensar sin tocar el tamaño ya ajustado en desktop. El lote mobile más chico mide
   * ~52 unidades de lado, así que hay margen de sobra hasta 1.5x sin salirse de la caja. */
  sizeMultiplier?: number;
}) {
  const noDisponible = estado !== "disponible";
  const fillColor = noDisponible ? NO_DISPONIBLE_COLOR : color;
  const width = LOTE_MARKER_WIDTH * sizeMultiplier;
  const height = LOTE_MARKER_HEIGHT * sizeMultiplier;
  const cut = MARKER_CUT * sizeMultiplier;
  const textColor = relativeLuminance(fillColor) > 0.65 ? "#0f172a" : "#ffffff";
  const path = pointsToPath(markerPoints(x - width / 2, y - height / 2, width, height, cut));

  return (
    <g className="pointer-events-none" opacity={noDisponible ? NO_DISPONIBLE_OPACITY : 1}>
      <path d={path} fill={fillColor} stroke="white" strokeWidth={1.5} />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={13 * sizeMultiplier}
        fontWeight={700}
        fill={textColor}
        className="font-heading select-none"
      >
        {numero}
      </text>
    </g>
  );
}
