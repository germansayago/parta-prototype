# Plan de implementación — Sitio PARTA

Documento vivo. Cada vez que analicemos un componente nuevo se agrega su sección acá, con notas suficientes para retomar sin tener que re-derivar contexto.

## Estado de ramas (referencia)

- `main` — sitio "anterior": `VideoZoom` (hero video scroll-driven) + `IsometricMap` + placeholder. Es lo que está deployado/estable hoy.
- `sitio-provisorio` — landing temporal para publicar mientras se construye el sitio completo: solo `Hero` (slider de imágenes) + `Footer`.
- `develop` — sitio completo en construcción. Orden actual de `app/page.tsx`: `Hero` → sección "Características del proyecto" (placeholder, sin diseño todavía) → `VideoZoom` → `IsometricMap` → `Footer`. Acá es donde se va a integrar cada componente nuevo del plan.

## Componentes

### 1. Mapa interactivo de loteo (plano cenital) — DESKTOP Y MOBILE IMPLEMENTADOS

Componente distinto de `IsometricMap.tsx` (ese es una vista pseudo-3D dibujada en SVG, agrupa por zona completa, ya existe y funciona). Este es un **plano cenital sobre imagen real del predio**, con interacción a nivel de **lote individual**, no de zona. Pensado para un paso más avanzado del funnel (el usuario ya eligió una zona/rubro y quiere ver o reservar un lote puntual).

#### Estado actual

- **Componentes**: `app/components/CenitalMap.tsx` es un wrapper que monta `CenitalMapDesktop.tsx` (`hidden md:block`) o `CenitalMapMobile.tsx` (`md:hidden`, breakpoint `md`=768px como el resto del sitio). Integrado en `develop` → `page.tsx` después de `IsometricMap` (posición tentativa, no confirmada con cliente todavía). La card de detalle de lote (`LOTE {n}`, m², pills, Reservar) vive en `LoteDetailCard.tsx`, compartida por ambas variantes. El cálculo de escala/offset de un `<svg viewBox>` (cover fit) para posicionar overlays HTML está en el hook `useMapScale.ts`, también compartido.
- **Dataset**: `app/data/lotes.ts` — 64 lotes trazados a mano por diseño en `designs/mapa-loteo-editable.svg` (ver abajo), agrupados en 6 zonas por **rubro** (no por posición — ver nota de zonas mobile más abajo). Reemplaza el modelo `Bloque`/subdivisión sintética que se había armado en un primer intento (ver "Pasos" más abajo).
- **Fondo real desktop**: `public/images/mapa/mapa-base.png` (1920×1080) — **no** es `designs/mapa-base.jpg` (1680×936, quedó obsoleto para este componente). Ver nota de coordenadas.
- **Geometría real preservada**: cada lote es un polígono SVG con su forma real (esquinas redondeadas y bordes diagonales incluidos), no un rectángulo aproximado — se sampleó cada curva bezier del SVG original en vez de reducir todo a bounding box.
- **Interacción**: click en un lote abre una card (mismo lenguaje chamfer del resto del sitio) con número, m², pill de rubro, pill de estado y "Reservar" → scrollea a `#contacto`. Polígonos con fondo/borde blanco transparente (se iluminan en hover), el color de zona vive solo en el marcador (punto) de cada lote — así calca el mockup, donde el color únicamente aparece en los puntitos. La card se posiciona con su "tallo" siempre apuntando al marcador real, pero se desplaza horizontalmente si hace falta para no cortarse contra el borde de pantalla (bug encontrado probando en mobile, donde el margen es mucho más chico que en desktop — ver `LoteDetailCard.tsx`).
- **⚠️ Nota clave sobre coordenadas desktop** (para no repetir el error): `designs/mapa-loteo-editable.svg` tiene una capa oculta con la imagen de referencia y `transform="scale(1.2)"` — **ese factor NO se aplica** a la posición final de los lotes. Lo que sí aplica es el `clipPath` (offset 11.4, 63.1 sobre un recorte de 1920×1080): ese recorte, exportado tal cual, es `designs/mapa-base-ok.png` (ahora `public/images/mapa/mapa-base.png`), y los lotes de `Layer_2` viven en el mismo sistema de coordenadas que ese recorte. Es decir: **restar el offset del clip, sin escalar nada**. Costó varias vueltas encontrar esto — si se vuelve a tocar el trazado, empezar por acá.
- **Pendiente**: posición final en `page.tsx`, setear `SHEET_JSON_URL` en el hosting al deployar. (Rubros, numeración por lote, m² y estado vía Google Sheet ya están confirmados/conectados, ver abajo.)

#### Variante mobile — implementada

Primera versión (2026-07-27) tenía un bug: al llegar a la sección en mobile, el mapa desktop (1920×1080, muy horizontal) se mostraba con `preserveAspectRatio="xMidYMid slice"` dentro de un contenedor angosto y vertical, así que el "cover fit" recortaba los bordes izquierdo/derecho de la imagen — la Zona 1 (esquina superior izquierda) quedaba fuera de cuadro. El cliente generó **dos assets nuevos específicos para mobile** (mismo predio real, recorte/composición distinta, pensada para pantalla vertical):

| Archivo | Uso | Dimensiones |
|---|---|---|
| `designs/mapa-loteo-base-mobile.png` (copiado a `public/images/mapa/mapa-base-mobile.png`) | Fondo real para mobile — mismo predio, exportado como recorte vertical completo pensado para pantalla, con bastante cielo/campo vacío arriba y abajo del predio (el componente lo recorta en código, ver más abajo). | 2160×3840 |
| `designs/mapa-loteo-editable-mobile.svg` | Trazado de los 64 lotes sobre ese fondo (mismo patrón que el SVG desktop: capa oculta de referencia + `clipPath`). | viewBox 1257.8×2427, `clipPath` en `x=80.6 y=191 w=1080 h=1920` |

**⚠️ Nota de coordenadas mobile** (mismo patrón que desktop, pero con un factor de escala extra): el `clipPath` define el recorte final (1080×1920), y el PNG final (2160×3840) es exactamente ese recorte **exportado al doble de resolución** (2160/1080 = 3840/1920 = 2). La transformación de un punto del SVG a píxel real del PNG es: `((x − 80.6) × 2, (y − 191) × 2)` — sin rotación. Verificado dibujando los 64 polígonos transformados como overlay sobre el PNG real: coinciden pixel-perfect con los bloques de la foto.

**⚠️⚠️ El SVG mobile no numera los lotes, y el orden del documento NO es el número de lote** — este fue el hallazgo más importante y el que más se puede repetir si se vuelve a tocar: las 64 formas de `Layer_1` no tienen ningún atributo de número/id, y probar "shape N del documento = lote N" (lo que se asumió al principio) da un resultado **incorrecto** — el shape #37 del documento es en realidad el Lote 1. La correspondencia forma→número se resolvió por **matching geométrico**: se tomaron los centroides ya confirmados de los 64 lotes en `app/data/lotes.ts` (dataset desktop, coordenadas 1920×1080) y los centroides de las 64 formas mobile (coordenadas 2160×3840, ya transformadas), se ajustó una transformación de similitud (escala X/Y independiente + traslación, sin rotación) por bounding box, y se hizo un matching de vecino más cercano iterado 4 veces (recalculando la transformación con los pares ya emparejados en cada vuelta). Convergió con error promedio 18.8px y máximo 51px sobre lotes de ~60-90px — sin ambigüedad. Se verificó además que: (a) es una biyección exacta (los 64 números 1-64 aparecen una sola vez), y (b) visualmente los rubros forman clusters coherentes con el dataset desktop (todos los lotes de un mismo rubro quedan agrupados). Si se vuelve a pedir un asset SVG nuevo (otra zona, versión 2, etc.), **pedir que el cliente incluya el número de lote como atributo o label en cada shape** para no tener que repetir este proceso.

- **Dataset**: `app/data/lotesMobileGeometry.ts` — exporta `MAPA_MOBILE_WIDTH`/`MAPA_MOBILE_HEIGHT` (2160×3840), `LOTE_GEOMETRY_MOBILE: Record<numero, {polygon, centro}>` (generado por el proceso de arriba) y `MAPA_MOBILE_PARK_BBOX` (bbox real de los 64 lotes, con margen — usado para el nivel 1). Los demás campos del lote (m², estado, rubro, color) siguen viniendo de `app/data/lotes.ts` / el Sheet — `CenitalMapMobile` combina ambos por `numero` en el momento de renderizar, no hay un dataset "Lote mobile" duplicado.
- **Zonas de navegación mobile**: `app/data/zonasMobile.ts` — **2 zonas posicionales** (mitad izquierda / mitad derecha del predio), no confirmadas por el cliente en tanto agrupación de UX, pero sí la división exacta lote-por-lote (`designs/loteo-zona-1.jpg` / `loteo-zona-2.jpg`, pasados por el cliente). Se probó primero con 6 zonas (una por manzana real), pero el tamaño físico de cada manzana variaba demasiado (de 3 lotes enormes a 15 lotes en una tira angosta) y el zoom quedaba con una escala muy distinta según la zona — con el ancho de pantalla como límite real en mobile (no el alto, que sobra), 2 zonas resuelve eso sin perder nada partiendo a la mitad.
- **Flujo**: nivel 1 (`ListaZonas`) — sección `h-screen` con el mapa como fondo a pantalla completa (cover-fit) y la lista de zonas superpuesta abajo (`absolute bottom-8`); tocar una zona resalta sus lotes y muestra un tag flotante sobre el bloque en el mapa, con botón "Ingresar". Nivel 2 (`ZonaZoom`) — mismo `<svg viewBox>` y mismo contenedor `h-screen` que el nivel 1 (nunca cambian), lotes clickeables con marcador de color, flecha atrás vuelve al nivel 1. Misma `LoteDetailCard` que desktop en ambos niveles.
- **⚠️ Historia del recorte en pantalla — 3 iteraciones hasta llegar a esto, para no repetirlas**:
  1. Mostrar el PNG completo (2160×3840) sin recortar: correcto en el sentido de "no perder nada", pero con tanto cielo/campo vacío alrededor del predio que quedaba un scroll enorme en negro antes de ver algo.
  2. Recortar el `viewBox` al bbox real de los lotes (con margen) **por nivel** — un bbox para la lista completa y OTRO bbox distinto (más angosto) por zona al hacer zoom, cada uno con el contenedor ajustado a `style={{ aspectRatio: w/h }}` para que el cover-fit no recortara de más. Esto resolvía el recorte pero generaba un bug distinto y más notorio: como el bbox de cada nivel tiene una proporción ancho:alto diferente (el bbox del parque completo es bien horizontal; el de una zona, con el padding vertical agregado, es más vertical), el **contenedor cambiaba de alto entre nivel 1 y nivel 2** — en mobile eso se veía como el mapa general aplastado en una tira horizontal corta arriba de la pantalla (con un bloque negro enorme debajo para los botones), y al hacer zoom "se agrandaba todo el fondo" en vez de sentirse como un acercamiento horizontal prolijo.
  3. **Solución actual**: un único `viewBox` base (`MAPA_MOBILE_PARK_BBOX`, con padding fuerte en Y y modesto en X para lograr una proporción retrato razonable — ver `PARK_PAD_X`/`PARK_PAD_TOP`/`PARK_PAD_BOTTOM` en `lotesMobileGeometry.ts`) usado por **los dos niveles por igual**, en un contenedor `h-screen` que nunca cambia de tamaño. El "zoom" a una zona no es un recorte de `viewBox` nuevo: es una transformación `transform="translate(ox,oy) scale(s) translate(-ox,-oy)"` aplicada a un `<g>` con la imagen + los lotes (ver `ZONA_MOBILE_ZOOM` en `zonasMobile.ts`), anclada al borde izquierdo o derecho del bbox base según de qué lado está la zona (ese punto queda fijo en pantalla, el resto "crece" hacia el lado opuesto) y al centro vertical del bbox base. Esto replica el comportamiento de los assets de referencia en `designs/mapa/` (`mapa-general.png` vs `mapa-zona-1.jpg`/`mapa-zona-2.jpg`: mismo encuadre vertical entre las tres, el zoom es puramente horizontal) y es el enfoque que ya estaba anotado como "plan original, todavía no implementado" más abajo en este documento — terminó siendo la solución correcta. Los overlays HTML (`LoteDetailCard`) aplican la misma transformación a mano sobre el punto antes de convertirlo a píxeles de pantalla (`applyZoom` en `CenitalMapMobile.tsx`), ya que no son hijos del `<svg>` y no heredan el `transform` del `<g>`.
  - Nota aparte, ortogonal a lo anterior: en los tres intentos hubo un bug de recorte de la **card de detalle y el tag flotante de zona** contra el borde superior de su contenedor — la causa era que ambos son overlays HTML posicionados con `-translate-y-full` (cuelgan hacia arriba de su ancla) dentro de un div con `overflow-hidden` puesto ahí solo para el cover-fit de la imagen (innecesario: el propio `<svg>` ya clippea su contenido por default). Sacar el `overflow-hidden` del div contenedor (dejando el `<svg>` con su propio clip) resuelve el recorte sin tocar el padding.
- **✅ Resuelto — Bug del lote 13 en mobile** (reportado 2026-07-28, diagnosticado y arreglado 2026-07-29): en Zona 02, el lote 13 no se resaltaba igual que el resto al seleccionar la zona y no abría `LoteDetailCard` al clickearlo ampliado (funcionaba bien en desktop). Causa raíz: el polígono de `LOTE_GEOMETRY_MOBILE[13]` (el lote con el corte diagonal, el más irregular del set) estaba **mal formado** — en vez de un triángulo sólido, el trazado extraído del SVG recorría el contorno "de ida y de vuelta" muy cerca de sí mismo (artefacto de la curva bezier con esquinas redondeadas + borde diagonal), dejando el relleno real reducido a un marco delgado en dos bordes — confirmado con `SVGGeometryElement.isPointInFill()` en vivo, no alcanzaba con un point-in-polygon a mano. Su propio centroide (`centro: [1338.5, 1523]`, calculado igual que el resto por promedio/estimación) caía **fuera** de ese relleno real: el marcador y la card apuntaban a un punto fuera del lote, y un tap ahí cliqueaba la imagen de fondo en vez del polígono. Desktop no tenía el bug porque usa un dataset distinto para ese lote (un triángulo simple con centroide calculado dinámicamente por `centroide()` en `app/data/lotes.ts`). Fix: se reconstruyó el polígono como la envolvente convexa de los mismos puntos originales (son válidos individualmente, solo el orden/trazado estaba roto), con centroide recalculado y verificado adentro — ver el comentario en `lotesMobileGeometry.ts` línea ~27. Vale la pena tenerlo presente si se vuelve a re-trazar el SVG mobile: **verificar con `isPointInFill` (no solo point-in-polygon) que el centroide de cada lote cae dentro de su propio relleno**, en especial en las formas no rectangulares.
- **Pendiente** (retomar acá):
  1. **Reubicar el bloque "volver + nombre de zona"** (nivel 2, `ZonaZoom`) — hoy está arriba a la izquierda superpuesto al mapa; pasarlo abajo.
  2. **Revisar el diseño del botón** de volver/nombre de zona en general (pendiente de definición, sin spec todavía — retomar con el cliente/diseño).
- Aparte de lo anterior: nada más bloqueante — próximo ajuste fino sería decidir si conviene animar la transición de zoom entre nivel 1 y 2 (hoy es un cambio de `transform` sin transición CSS) si se nota muy abrupto en dispositivo real.

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
| `loteo-detalle-completo.jpeg` | Listado por rubro (nombre + color + lotes incluidos + m² real de cada uno) tal como se pasaría a Google Sheet — **fuente de los 6 rubros confirmados y sus m² reales** (todavía no cargados, ver Fuente de datos abajo). |
| `mapa-loteo-base-mobile.png` | Fondo real para el mapa mobile (recorte vertical completo del mismo predio, copiado a `public/images/mapa/mapa-base-mobile.png`). | 2160×3840 |
| `mapa-loteo-editable-mobile.svg` | Trazado de los 64 lotes sobre el fondo mobile — sin numeración, ver nota de coordenadas/matching en la sección de variante mobile. | viewBox 1257.8×2427 |
| `loteo-zona-1.jpg` / `loteo-zona-2.jpg` | División real (pasada por el cliente) de los 64 lotes en las 2 zonas mobile — **fuente de qué número de lote va en cada mitad**, ver `app/data/zonasMobile.ts`. | — |
| `mapa/mapa-general.png` | Referencia del encuadre mobile nivel 1 (lista de zonas): recorte vertical del predio con margen generoso arriba/abajo. **Las tres imágenes de `designs/mapa/` comparten exactamente la misma proporción 9:16** (`mapa-general.png` es 1638×2912, las de zona 1080×1920 — mismo factor de escala en ambos ejes), confirmado por eso que el "zoom" entre niveles no cambia el encuadre vertical, solo el horizontal — ver nota de recorte en pantalla arriba. | 1638×2912 |
| `mapa/mapa-zona-1.jpg` / `mapa/mapa-zona-2.jpg` | Referencia del encuadre mobile nivel 2 (zoom a zona): mismo encuadre vertical que `mapa-general.png`, recortado/ampliado horizontalmente con el borde real del predio (izquierdo en zona 1, derecho en zona 2) flush contra el borde de la imagen. | 1080×1920 |
| `mapa/screenshots/error-1.png` | Screenshot del bug reportado 2026-07-28 (mapa pegado arriba, tag de zona cortado, espacio negro grande debajo de los botones) — ya resuelto, ver iteración 3 de la nota de recorte arriba. Se deja como referencia histórica del bug, no del resultado esperado. | — |

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

Para el **zoom a nivel zona en mobile**: implementado — ver la "Solución actual" (iteración 3) en la nota de recorte en pantalla de la sección de variante mobile más arriba.

#### Botón "Reservar" — implementado

Hace scroll a `#contacto` (el formulario de `Footer.tsx`). Todavía no pre-carga el número de lote como contexto en el formulario — pendiente si se quiere ese nivel de detalle.

#### Dónde va en `page.tsx` (develop) — resuelto (tentativo)

Quedó después de `IsometricMap`, tal como se había anticipado acá. Sigue siendo tentativo — no confirmado con cliente.

#### Pasos sugeridos de implementación

1. ~~Conseguir dataset real de lotes~~ — hecho: geometría real, 6/6 rubros confirmados (nombre, color y numeración real por lote), m² real cargado. Solo `estado` sigue mock, pendiente de que el cliente cargue el Sheet.
2. ~~Conseguir el SVG/AI fuente del plano~~ — hecho, el cliente pasó `mapa-loteo-editable.svg` con el trazado real.
3. ~~Armar el componente en desktop~~ — hecho (`CenitalMap.tsx`).
4. ~~Armar la variante mobile: lista de zonas + tag flotante + transición de zoom a zona + misma card de detalle.~~ — hecho, con fondo/geometría propios para mobile (ver sección arriba).
5. ~~Conectar "Reservar" al formulario~~ — hecho (scroll a `#contacto`; falta pre-cargar el lote como contexto si se quiere).
6. ~~Integrar Google Sheet como fuente de estado de disponibilidad~~ — hecho y probado en vivo con el Sheet real del cliente (vía Apps Script/JSON, ver arriba). Falta setear `SHEET_JSON_URL` en el hosting cuando se deployea (hoy solo está en `.env.local`, local) y decidir el `revalidate` final antes de producción.
7. Definir posición final en `page.tsx`.

---

## Próximos componentes a analizar

(se agregan acá a medida que los revisemos — todavía no iniciado ninguno)
