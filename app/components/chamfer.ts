export type ChamferVariant = "nav" | "cta" | "form";

/**
 * Los botones/inputs de la marca PARTA tienen esquinas cortadas en vez de
 * rectas. Cada variante replica un patrón visto en el diseño:
 * - nav: lado izquierdo recto, lado derecho en punta (ej. botón CONTACTO)
 * - cta: esquina superior izquierda cortada + lado derecho en punta (ej. brochure)
 * - form: esquinas opuestas (sup-izq e inf-der) cortadas (inputs y ENVIAR)
 */
export function chamferClipPath(variant: ChamferVariant, cut: number): string {
  switch (variant) {
    case "nav":
      return `polygon(0 0, calc(100% - ${cut}px) 0, 100% 50%, calc(100% - ${cut}px) 100%, 0 100%)`;
    case "cta":
      return `polygon(${cut}px 0, calc(100% - ${cut}px) 0, 100% 50%, calc(100% - ${cut}px) 100%, 0 100%, 0 ${cut}px)`;
    case "form":
      return `polygon(${cut}px 0, 100% 0, 100% calc(100% - ${cut}px), calc(100% - ${cut}px) 100%, 0 100%, 0 ${cut}px)`;
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
      return [
        [x, y],
        [x + w - cut, y],
        [x + w, y + h / 2],
        [x + w - cut, y + h],
        [x, y + h],
      ];
    case "cta":
      return [
        [x + cut, y],
        [x + w - cut, y],
        [x + w, y + h / 2],
        [x + w - cut, y + h],
        [x, y + h],
        [x, y + cut],
      ];
    case "form":
      return [
        [x + cut, y],
        [x + w, y],
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
