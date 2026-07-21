"use client";

import { useEffect, useRef, useState } from "react";
import { ChamferVariant, chamferPoints, pointsToPath } from "./chamfer";

/**
 * Botón/input con borde de esquinas cortadas y fondo transparente (deja ver
 * lo que hay detrás, sea foto o color sólido). El borde se dibuja como un
 * único SVG en forma de anillo (fill-rule evenodd entre el contorno exterior
 * e interior), midiendo el tamaño real del elemento con ResizeObserver para
 * soportar anchos fluidos.
 */
export default function ChamferOutline({
  variant,
  cut,
  borderWidth = 1.5,
  className = "",
  innerClassName = "",
  children,
}: {
  variant: ChamferVariant;
  cut: number;
  borderWidth?: number;
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { width, height } = size;
  const ringPath =
    width > 0 && height > 0
      ? `${pointsToPath(chamferPoints(variant, 0, 0, width, height, cut))} ${pointsToPath(
          chamferPoints(
            variant,
            borderWidth,
            borderWidth,
            width - borderWidth * 2,
            height - borderWidth * 2,
            Math.max(cut - borderWidth, 0)
          )
        )}`
      : "";

  return (
    <div ref={ref} className={`relative ${className}`}>
      {ringPath && (
        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
          <path d={ringPath} fill="white" fillRule="evenodd" />
        </svg>
      )}
      <div className={innerClassName}>{children}</div>
    </div>
  );
}
