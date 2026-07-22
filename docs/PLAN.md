# Plan de implementación — Sitio PARTA

Documento vivo. Cada vez que analicemos un componente nuevo se agrega su sección acá, con notas suficientes para retomar sin tener que re-derivar contexto.

## Estado de ramas (referencia)

- `main` — sitio "anterior": `VideoZoom` (hero video scroll-driven) + `IsometricMap` + placeholder. Es lo que está deployado/estable hoy.
- `sitio-provisorio` — landing temporal para publicar mientras se construye el sitio completo: solo `Hero` (slider de imágenes) + `Footer`.
- `develop` — sitio completo en construcción. Orden actual de `app/page.tsx`: `Hero` → sección "Características del proyecto" (placeholder, sin diseño todavía) → `VideoZoom` → `IsometricMap` → `Footer`. Acá es donde se va a integrar cada componente nuevo del plan.

## Componentes

### 1. Mapa interactivo de loteo (plano cenital) — DESKTOP IMPLEMENTADO (rubros/colores/numeración confirmados), FALTA MOBILE

Componente distinto de `IsometricMap.tsx` (ese es una vista pseudo-3D dibujada en SVG, agrupa por zona completa, ya existe y funciona). Este es un **plano cenital sobre imagen real del predio**, con interacción a nivel de **lote individual**, no de zona. Pensado para un paso más avanzado del funnel (el usuario ya eligió una zona/rubro y quiere ver o reservar un lote puntual).

#### Estado actual

- **Componente**: `app/components/CenitalMap.tsx`, integrado en `develop` → `page.tsx` después de `IsometricMap` (posición tentativa, no confirmada con cliente todavía).
- **Dataset**: `app/data/lotes.ts` — 64 lotes trazados a mano por diseño en `designs/mapa-loteo-editable.svg` (ver abajo), agrupados en 6 zonas por posición. Reemplaza el modelo `Bloque`/subdivisión sintética que se había armado en un primer intento (ver "Pasos" más abajo).
- **Fondo real**: `public/images/mapa/mapa-base.png` (1920×1080) — **no** es `designs/mapa-base.jpg` (1680×936, quedó obsoleto para este componente). Ver nota de coordenadas.
- **Geometría real preservada**: cada lote es un polígono SVG con su forma real (esquinas redondeadas y bordes diagonales incluidos), no un rectángulo aproximado — se sampleó cada curva bezier del SVG original en vez de reducir todo a bounding box.
- **Interacción**: click en un lote abre una card (mismo lenguaje chamfer del resto del sitio) con número, m², pill de rubro, pill de estado y "Reservar" → scrollea a `#contacto`. Polígonos con fondo/borde blanco transparente (se iluminan en hover), el color de zona vive solo en el marcador (punto) de cada lote — así calca el mockup, donde el color únicamente aparece en los puntitos.
- **⚠️ Nota clave sobre coordenadas** (para no repetir el error): `designs/mapa-loteo-editable.svg` tiene una capa oculta con la imagen de referencia y `transform="scale(1.2)"` — **ese factor NO se aplica** a la posición final de los lotes. Lo que sí aplica es el `clipPath` (offset 11.4, 63.1 sobre un recorte de 1920×1080): ese recorte, exportado tal cual, es `designs/mapa-base-ok.png` (ahora `public/images/mapa/mapa-base.png`), y los lotes de `Layer_2` viven en el mismo sistema de coordenadas que ese recorte. Es decir: **restar el offset del clip, sin escalar nada**. Costó varias vueltas encontrar esto — si se vuelve a tocar el trazado, empezar por acá.
- **Pendiente**: variante mobile (drill-down zona→lote), posición final en `page.tsx`, setear `SHEET_JSON_URL` en el hosting al deployar. (Rubros, numeración por lote, m² y estado vía Google Sheet ya están confirmados/conectados, ver abajo.)

#### Assets de referencia (`designs/`)

| Archivo | Uso | Dimensiones |
|---|---|---|
| `mapa-base.jpg` | Fondo, sin overlay. Render aéreo nocturno estilizado (no es captura cruda de Google Maps), exportado desde Adobe Illustrator. | 1680×936 |
| `mapa-interactivo.webp` | Mockup de referencia del overlay interactivo en desktop, con un popup de ejemplo abierto (Lote 14). No es un asset a usar tal cual, es guía visual. | 3841×2161 |
| `mapa-mobile-1.webp` | Mobile, estado inicial: mapa completo + lista vertical de zonas (ZONA 01–06) sin selección. | — |
| `mapa-mobile-2.webp` | Mobile, con "ZONA 01" seleccionada en la lista: la entrada pasa a fondo blanco + botón "INGRESAR", y aparece un tag flotante sobre el bloque correspondiente en el mapa. | — |
| `mapa-mobile-3.webp` | Mismo patrón con "ZONA 04" seleccionada — confirma que el tag flotante se reposiciona según la zona. | — |
| `mapa-mobile-3-seleccionado.webp` | Mobile, segundo nivel: tras tocar "Ingresar", el mapa hace zoom/crop a esa manzana puntual mostrando lotes individuales como cuadrados de color. Flecha "atrás" (←) arriba-izquierda para volver. Al tocar un lote se abre la card de detalle (Lote 29, 5.066 m², Industrias Alimentarias, Disponible, Reservar). | — |
| `mapa-loteo-editable.svg` | **Fuente real de los polígonos** (trazado sobre `mapa-base-ok.png`, capa oculta de referencia + `Layer_2` con los 64 lotes). Ver nota de coordenadas arriba. | viewBox 2088.9×1163.8 |
| `mapa-base-ok.png` | Export final ya recortado (clip-path) — es el que se usa como fondo real del componente (copiado a `public/images/mapa/mapa-base.png`). | 1920×1080 |
| `muestra-mapa-loteo.png` | Referencia B/N de la forma exacta de cada lote (esquinas redondeadas, 2 lotes con borde diagonal) — usado para corregir la geometría extraída del SVG. | — |
| `loteo-numero-orden.jpeg` | Mapa cenital con los 64 lotes numerados y coloreados por rubro — **fuente de la numeración real** (qué número de lote cae en qué posición física). | — |
| `loteo-detalle-completo.jpeg` | Listado por rubro (nombre + color + lotes incluidos + m² real de cada uno) tal como se pasaría a Google Sheet — **fuente de los 6 rubros confirmados y sus m² reales** (todavía no cargados, ver Fuente de datos abajo). | — |

#### Flujo de interacción — Desktop

Según `mapa-interactivo.webp`: todos los lotes del predio son visibles y clickeables directamente sobre el plano completo (sin paso intermedio de "elegir zona" como en mobile). Al hacer click en un lote:

- Aparece una card flotante conectada al marcador por una línea ("pin callout"), con esquinas cortadas (chamfer) — mismo lenguaje visual que `ChamferOutline.tsx` / `chamfer.ts`, **reusable directo**.
- Contenido de la card: `LOTE {n}` + ícono, superficie en m², pill de rubro (texto/color según rubro), pill de estado ("DISPONIBLE" en verde — implica que existen más estados: reservado/vendido, con sus propios colores), botón "RESERVAR →", botón cerrar (×).

#### Flujo de interacción — Mobile (2 niveles de drill-down)

1. **Vista completa**: lista vertical de zonas debajo del mapa (ZONA 01 a 06). Tocar una zona → la entrada de la lista se resalta (fondo blanco + botón "Ingresar") y aparece un tag flotante con el nombre de la zona sobre el bloque correspondiente en el mapa (con colita apuntando al bloque), que se resalta mientras el resto se oscurece.
2. **Vista de zona**: al tocar "Ingresar", el mapa hace zoom/crop a esa manzana, mostrando los lotes individuales como marcadores de color. Flecha atrás para volver al nivel 1. Tocar un lote abre la misma card de detalle que en desktop.

**Por qué mobile tiene un paso extra que desktop no**: en pantalla chica no entran todos los lotes clickeables a la vez con buen tamaño de touch-target: se resuelve el zoom en dos pasos (parque → zona → lote) en vez de mostrar todo de una.

#### Insight de datos: color = rubro

Confirmado con `mapa-mobile-3-seleccionado.webp`: los lotes rojos son "Industrias Alimentarias" y el pill de rubro en la card usa ese mismo rojo. El color del marcador **codifica el rubro/industria**, no el estado de disponibilidad (el estado tiene su propio pill, ej. verde = disponible). Esto valida reusar la misma taxonomía de rubros que ya existe en `ZONES` dentro de `app/components/IsometricMap.tsx`.

**✅ Resuelto** (antes pendiente confirmar 4/6 rubros): el cliente pasó `loteo-numero-orden.jpeg` (numeración real por posición) + `loteo-detalle-completo.jpeg` (rubro/color/m² por lote). Los 6 rubros y su color están confirmados en `app/data/lotes.ts` (`confirmada: true` en las 6 entradas de `ZONAS`):

| Rubro | Color | Lotes |
|---|---|---|
| Instalaciones del Parque | Azul `#3b82f6` | 1, 13, 37, 38 |
| Logística y Tecnología | Celeste `#38bdf8` | 2–12 |
| Industrias Varias | Blanco `#f8fafc` | 14–26 |
| Industrias Alimentarias | Rojo `#ef4444` | 27–36 |
| Industrias Metalúrgicas | Violeta `#a855f7` | 39–50 |
| Industrias Agrícolas | Verde `#22c55e` | 51–64 |

Nota: el verde de "Industrias Agrícolas" coincide con `ESTADO_COLOR.disponible` (también verde) — no es un bug, pero puede generar ambigüedad visual entre "lote del rubro agrícola" y "lote disponible" en la card de detalle; vale la pena revisarlo con diseño si se nota confuso en producción.

`IsometricMap.tsx` sigue con su propia taxonomía de 5 zonas (agrícola, metalúrgica, alimentaria, tecnología/logística, administración), sin actualizar todavía contra esta lista de 6 — pendiente si se decide unificar.

#### Modelo de datos por lote (implementado, ver `app/data/lotes.ts`)

```ts
interface Lote {
  id: string;           // "lote-29"
  numero: number;        // 29
  m2: number;             // real (M2_REAL), sobreescribible por Google Sheet
  estado: "disponible" | "reservado" | "vendido"; // mock, sobreescribible por Google Sheet
  zonaId: string;
  zonaLabel: string;      // nombre de rubro — confirmado en las 6 zonas (ver arriba)
  color: string;
  polygon: [number, number][]; // px reales sobre mapa-base.png (1920x1080)
  centro: [number, number];    // centroide de área real, no promedio de vértices
}
```

**Fuente de datos — ✅ Google Sheet real conectado y probado en vivo (2026-07-22)**:

- `m2`: ya no es mock. Se transcribió a mano el m² real de cada uno de los 64 lotes desde `loteo-detalle-completo.jpeg` a `M2_REAL` en `app/data/lotes.ts`. El Sheet puede sobreescribirlo si el cliente lo edita (ver abajo).
- `estado` (disponible/reservado/vendido): viene del Sheet real. Sin dato del Sheet, cae a `estadoMock` (determinístico, no random).
- **Pipeline** (`app/lib/sheet.ts` + `mergeLoteOverrides` en `app/data/lotes.ts`): `app/page.tsx` es un Server Component async que llama `fetchLoteOverrides()`, la cual lee `process.env.SHEET_JSON_URL`, hace `fetch(url, { cache: "no-store" })` y espera un array JSON `[{ numero, m2, estado }, ...]`; `mergeLoteOverrides` combina eso sobre el dataset base y el resultado se pasa a `<CenitalMap lotes={...} />` por prop. Sin `SHEET_JSON_URL` configurada, o si el fetch falla, sigue funcionando con el dataset base (m² real + estado mock) — no rompe nada.
- **⚠️ Por qué JSON vía Apps Script y no "Publicar en la web" (CSV/TSV)**: se probó primero con el Sheet publicado como CSV/TSV (`Archivo > Compartir > Publicar en la web`), pero **Google cachea esa copia publicada de su lado** — los cambios en el Sheet tardaban en reflejarse sin que hubiera forma de controlarlo desde nuestro código (ni `cache: "no-store"` lo evita, porque el retraso ocurre antes, en la copia que Google sirve). Se reemplazó por un **Google Apps Script desplegado como Web App** que ejecuta en vivo contra el Sheet en cada request (`SpreadsheetApp.getActiveSpreadsheet()...`) y devuelve JSON — sin esa capa de caché. Script fuente:

  ```js
  function doGet() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    const rows = sheet.getDataRange().getValues();
    const header = rows.shift().map((h) => String(h).toLowerCase().trim());

    const numeroIdx = header.indexOf("numero");
    const rubroIdx = header.indexOf("rubro");
    const m2Idx = header.indexOf("m2");
    const estadoIdx = header.indexOf("estado");

    const data = rows
      .filter((r) => r[numeroIdx] !== "" && r[numeroIdx] !== null)
      .map((r) => ({
        numero: Number(r[numeroIdx]),
        rubro: String(r[rubroIdx]),
        m2: Number(r[m2Idx]),
        estado: String(r[estadoIdx]).toLowerCase().trim(),
      }));

    return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
      ContentService.MimeType.JSON
    );
  }
  ```

  Deploy: Extensiones > Apps Script > pegar este código > Implementar > Nueva implementación > tipo "Aplicación web" > Ejecutar como "Yo" > Acceso "**Cualquier usuario**" (no "Cualquier usuario dentro de \[dominio]" — con el Sheet en un Workspace de Google, esa opción sigue pidiendo login aunque diga "cualquiera"; terminó resuelto armando el Apps Script en una cuenta personal en vez del Workspace de aggility.io).
- `SHEET_JSON_URL` está en `.env.local` (no versionado) apuntando al `/exec` de ese deploy — hay que setearlo también en el hosting/Vercel al deployar. `.env.example` documenta la variable.
- **Nota de caché/cuota**: hoy el fetch usa `cache: "no-store"` (se puso así para probar en vivo con el cliente) — cada carga de página ejecuta el Apps Script. Antes de producción, evaluar si conviene un `revalidate` corto (30–60s) para no pegarle a la cuota diaria de ejecuciones de Apps Script en cada visita.

#### Estrategia responsive / coordenadas — resuelto para desktop

Terminó siendo más simple que lo que se había anticipado acá: el cliente pasó el trazado real (`designs/mapa-loteo-editable.svg`, dibujado sobre la imagen de referencia), así que no hizo falta estimar nada a mano. Los polígonos son coordenadas **px absolutas** sobre `mapa-base.png` (1920×1080, no %), y el `<svg viewBox>` del componente + `preserveAspectRatio="xMidYMid slice"` se encarga de escalar todo junto (imagen de fondo y polígonos viven en el mismo `<svg>`, no como capas HTML separadas — así nunca se desalinean entre sí sea cual sea el tamaño de pantalla). Ver la nota de coordenadas más arriba para el detalle de cómo se derivó el offset.

Para el **zoom a nivel zona en mobile** la idea de la sección original (transformación CSS `scale`+`translate` sobre el mismo mapa base, en vez de recortes a mano) sigue siendo el plan — todavía no implementado.

#### Botón "Reservar" — implementado

Hace scroll a `#contacto` (el formulario de `Footer.tsx`). Todavía no pre-carga el número de lote como contexto en el formulario — pendiente si se quiere ese nivel de detalle.

#### Dónde va en `page.tsx` (develop) — resuelto (tentativo)

Quedó después de `IsometricMap`, tal como se había anticipado acá. Sigue siendo tentativo — no confirmado con cliente.

#### Pasos sugeridos de implementación

1. ~~Conseguir dataset real de lotes~~ — hecho: geometría real, 6/6 rubros confirmados (nombre, color y numeración real por lote), m² real cargado. Solo `estado` sigue mock, pendiente de que el cliente cargue el Sheet.
2. ~~Conseguir el SVG/AI fuente del plano~~ — hecho, el cliente pasó `mapa-loteo-editable.svg` con el trazado real.
3. ~~Armar el componente en desktop~~ — hecho (`CenitalMap.tsx`).
4. Armar la variante mobile: lista de zonas + tag flotante + transición de zoom a zona + misma card de detalle. **Siguiente paso.**
5. ~~Conectar "Reservar" al formulario~~ — hecho (scroll a `#contacto`; falta pre-cargar el lote como contexto si se quiere).
6. ~~Integrar Google Sheet como fuente de estado de disponibilidad~~ — hecho y probado en vivo con el Sheet real del cliente (vía Apps Script/JSON, ver arriba). Falta setear `SHEET_JSON_URL` en el hosting cuando se deployea (hoy solo está en `.env.local`, local) y decidir el `revalidate` final antes de producción.
7. Definir posición final en `page.tsx`.

---

## Próximos componentes a analizar

(se agregan acá a medida que los revisemos — todavía no iniciado ninguno)
