"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Replica el cálculo de preserveAspectRatio="xMidYMid slice" (cover) de un
 * <svg viewBox={`${viewX} ${viewY} ${viewWidth} ${viewHeight}`}> para poder
 * posicionar overlays HTML (cards, tags) alineados con un punto exacto del
 * SVG, sea cual sea el tamaño real del contenedor en pantalla. Compartido
 * entre el mapa desktop y los dos niveles del mapa mobile (lista completa y
 * zoom a zona), que difieren solo en qué región del mismo mapa-base.png
 * (viewX/viewY/viewWidth/viewHeight) están mostrando.
 */
export function useMapScale(viewX: number, viewY: number, viewWidth: number, viewHeight: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setBox({ width, height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scale = box.width && box.height ? Math.max(box.width / viewWidth, box.height / viewHeight) : 0;
  const offsetX = (box.width - viewWidth * scale) / 2;
  const offsetY = (box.height - viewHeight * scale) / 2;

  function toScreen([x, y]: [number, number]): [number, number] {
    return [offsetX + (x - viewX) * scale, offsetY + (y - viewY) * scale];
  }

  return {
    containerRef,
    scale,
    toScreen,
    viewBox: `${viewX} ${viewY} ${viewWidth} ${viewHeight}`,
    containerWidth: box.width,
  };
}
