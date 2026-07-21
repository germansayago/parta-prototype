export type ChamferVariant = "nav" | "cta" | "form";

/**
 * Los botones/inputs de la marca PARTA tienen esquinas cortadas en vez de
 * rectas: sup-izq, sup-der e inf-der biseladas, inf-izq recta. Es el mismo
 * patrón en todas las variantes; lo que cambia entre nav/cta/form es el
 * tamaño del corte (`cut`) según el elemento.
 */
export function chamferClipPath(variant: ChamferVariant, cut: number): string {
  switch (variant) {
    case "nav":
    case "cta":
    case "form":
      return `polygon(${cut}px 0, calc(100% - ${cut}px) 0, 100% ${cut}px, 100% calc(100% - ${cut}px), calc(100% - ${cut}px) 100%, 0 100%, 0 ${cut}px)`;
  }
}

/** Mismo shape que chamferClipPath pero como lista de puntos en px reales, para dibujar en SVG. */
export function chamferPoints(
  variant: ChamferVariant,
  x: number,
  y: number,
  w: number,
  h: number,
  cut: number
): [number, number][] {
  switch (variant) {
    case "nav":
    case "cta":
    case "form":
      return [
        [x + cut, y],
        [x + w - cut, y],
        [x + w, y + cut],
        [x + w, y + h - cut],
        [x + w - cut, y + h],
        [x, y + h],
        [x, y + cut],
      ];
  }
}

export function pointsToPath(points: [number, number][]): string {
  return "M " + points.map(([px, py]) => `${px} ${py}`).join(" L ") + " Z";
}
