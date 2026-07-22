// Lee la disponibilidad de lotes desde el Google Apps Script (Web App)
// desplegado sobre el Sheet del cliente — no desde "Publicar en la web",
// que Google cachea del lado de ellos y puede tardar en reflejar cambios.
// El Apps Script ejecuta en vivo contra el Sheet en cada request y devuelve
// JSON directo. Solo server-side (usa process.env), llamado desde
// app/page.tsx antes de renderizar CenitalMap. Sin SHEET_JSON_URL
// configurada, o si el fetch falla, se sigue usando el dataset base de
// app/data/lotes.ts (m² real ya cargado a mano, estado mock). Ver docs/PLAN.md.

import type { EstadoLote, LoteOverride } from "../data/lotes";

const ESTADOS: EstadoLote[] = ["disponible", "reservado", "vendido"];

interface SheetRow {
  numero: number;
  m2?: number;
  estado?: string;
}

export async function fetchLoteOverrides(): Promise<Map<number, LoteOverride> | null> {
  const url = process.env.SHEET_JSON_URL;
  if (!url) return null;

  let rows: unknown;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    rows = await res.json();
  } catch {
    return null;
  }

  if (!Array.isArray(rows)) return null;

  const overrides = new Map<number, LoteOverride>();
  for (const row of rows as SheetRow[]) {
    const numero = Number(row.numero);
    if (!Number.isFinite(numero)) continue;

    const override: LoteOverride = {};

    if (Number.isFinite(row.m2) && (row.m2 as number) > 0) {
      override.m2 = row.m2;
    }

    const estado = row.estado?.toLowerCase().trim();
    if (ESTADOS.includes(estado as EstadoLote)) {
      override.estado = estado as EstadoLote;
    }

    overrides.set(numero, override);
  }

  return overrides;
}
