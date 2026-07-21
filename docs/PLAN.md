# Plan de implementación — Sitio PARTA

Documento vivo. Cada vez que analicemos un componente nuevo se agrega su sección acá, con notas suficientes para retomar sin tener que re-derivar contexto.

## Estado de ramas (referencia)

- `main` — sitio "anterior": `VideoZoom` (hero video scroll-driven) + `IsometricMap` + placeholder. Es lo que está deployado/estable hoy.
- `sitio-provisorio` — landing temporal para publicar mientras se construye el sitio completo: solo `Hero` (slider de imágenes) + `Footer`.
- `develop` — sitio completo en construcción. Orden actual de `app/page.tsx`: `Hero` → sección "Características del proyecto" (placeholder, sin diseño todavía) → `VideoZoom` → `IsometricMap` → `Footer`. Acá es donde se va a integrar cada componente nuevo del plan.

## Componentes

### 1. Mapa interactivo de loteo (plano cenital) — EN ANÁLISIS, NO INICIADO

Componente distinto de `IsometricMap.tsx` (ese es una vista pseudo-3D dibujada en SVG, agrupa por zona completa, ya existe y funciona). Este es un **plano cenital sobre imagen real del predio**, con interacción a nivel de **lote individual**, no de zona. Pensado para un paso más avanzado del funnel (el usuario ya eligió una zona/rubro y quiere ver o reservar un lote puntual).

#### Assets de referencia (`designs/`)

| Archivo | Uso | Dimensiones |
|---|---|---|
| `mapa-base.jpg` | Fondo, sin overlay. Render aéreo nocturno estilizado (no es captura cruda de Google Maps), exportado desde Adobe Illustrator. | 1680×936 |
| `mapa-interactivo.webp` | Mockup de referencia del overlay interactivo en desktop, con un popup de ejemplo abierto (Lote 14). No es un asset a usar tal cual, es guía visual. | 3841×2161 |
| `mapa-mobile-1.webp` | Mobile, estado inicial: mapa completo + lista vertical de zonas (ZONA 01–06) sin selección. | — |
| `mapa-mobile-2.webp` | Mobile, con "ZONA 01" seleccionada en la lista: la entrada pasa a fondo blanco + botón "INGRESAR", y aparece un tag flotante sobre el bloque correspondiente en el mapa. | — |
| `mapa-mobile-3.webp` | Mismo patrón con "ZONA 04" seleccionada — confirma que el tag flotante se reposiciona según la zona. | — |
| `mapa-mobile-3-seleccionado.webp` | Mobile, segundo nivel: tras tocar "Ingresar", el mapa hace zoom/crop a esa manzana puntual mostrando lotes individuales como cuadrados de color. Flecha "atrás" (←) arriba-izquierda para volver. Al tocar un lote se abre la card de detalle (Lote 29, 5.066 m², Industrias Alimentarias, Disponible, Reservar). | — |

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

**⚠️ Pendiente a resolver**: `IsometricMap.tsx` tiene **5 zonas** (agrícola, metalúrgica, alimentaria, tecnología/logística, administración). Los mockups de este mapa muestran **6 zonas** (ZONA 01–06, sin nombre de rubro visible en la lista mobile). Hay que confirmar con el cliente/diseño si son las mismas 5 + una nueva, o una recategorización completa, antes de escribir el dataset definitivo.

#### Modelo de datos por lote (propuesto, falta definir con el cliente)

```
{
  id: string           // "lote-29"
  numero: number        // 29
  m2: number             // 5066
  zonaId: string          // referencia a la zona/rubro (ver ⚠️ arriba)
  estado: "disponible" | "reservado" | "vendido"  // confirmar nomenclatura exacta con cliente
  // posición: ver sección de estrategia responsive
}
```

**Fuente de datos**: el cliente va a gestionar el estado de venta desde un **Google Sheet** (para no depender de deploys para actualizar disponibilidad). Implementación futura: server-side fetch a la Sheet (API pública de Google Sheets o un endpoint propio con caché — evaluar rate limits) que alimenta el componente. No implementar como fetch client-side directo a Google (expone la sheet y pega performance).

#### Estrategia responsive (criterio propio, a validar en implementación)

- El JPG exportado de Illustrator sirve de fondo, pero **no** hardcodear posiciones de marcadores en píxeles. Preferir:
  - Coordenadas en **% relativas al contenedor**, o mejor:
  - Si los lotes son polígonos regulares en la vista cenital (no distorsionados como en la isométrica), **trazar cada lote como `<path>`/`<polygon>` SVG superpuesto** en vez de un punto — da área de click real (no solo un cuadradito) y escala perfecto con `viewBox`, sin recalcular nada por breakpoint.
- Para el **zoom a nivel zona en mobile**: no exportar una imagen recortada por zona a mano. Usar **un único mapa base de alta resolución** + transformación CSS (`scale` + `translate`, calculado desde el bounding box de la zona en el mismo sistema de coordenadas) — así todo el dato de "dónde está cada zona" vive en un solo lugar.
- Falta: coordenadas reales de cada lote/zona. O las pasa el cliente desde Illustrator (idealmente exportando el SVG original con los paths), o hay que estimarlas a mano contra `mapa-base.jpg`. **Preferir pedir el SVG/AI fuente antes de trazar a mano** — ahorra tiempo y es más preciso.

#### Botón "Reservar"

Lleva al formulario de contacto — evaluar reusar el mismo form de `Footer.tsx` (o un modal con los mismos campos) pre-cargando el número de lote como contexto.

#### Dónde va en `page.tsx` (develop)

**⚠️ Pendiente a resolver**: no está definido en qué posición del flujo entra este componente respecto a `Hero` → Características → `VideoZoom` → `IsometricMap` → `Footer`. Hipótesis razonable: después de `IsometricMap` (el usuario primero explora zonas en la vista isométrica, después entra al detalle de lote acá) — a confirmar.

#### Pasos sugeridos de implementación (cuando se retome)

1. Conseguir dataset real de lotes (o mock estructurado igual que `ZONES`) y resolver el desfasaje 5 vs 6 zonas.
2. Conseguir el SVG/AI fuente del plano (o decidir trazar a mano contra el JPG).
3. Armar el componente en desktop: fondo + overlay SVG de lotes + card de detalle (reusando `chamfer.ts`/`ChamferOutline.tsx`).
4. Armar la variante mobile: lista de zonas + tag flotante + transición de zoom a zona + misma card de detalle.
5. Conectar "Reservar" al formulario (reusar lógica de `Footer.tsx`).
6. Integrar Google Sheet como fuente de estado de disponibilidad (fase posterior, puede ir con datos mock hasta ese momento).
7. Definir posición final en `page.tsx`.

---

## Próximos componentes a analizar

(se agregan acá a medida que los revisemos — todavía no iniciado ninguno)
