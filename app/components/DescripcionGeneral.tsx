import Image from "next/image";
import ChamferOutline from "./ChamferOutline";

// Sección 2 (entre Hero y VideoZoom). Copy y estructura vienen del mockup del
// cliente (designs/descripcion-general-muestra.png): foto aérea del predio
// arriba (con fade a negro ya incluido en el alpha del webp, ver
// designs/descripcion-general-fondo.webp), título + bajada, 3 highlights
// destacados con borde chamfer, y una grilla de 10 features con ícono chico.
// El nav que se ve en el mockup es el header fijo global (Navbar.tsx), no
// algo que dibuje esta sección.
//
// Íconos: SVG provistos por el cliente (designs/iconos/, copiados tal cual a
// public/icons/ porque se sirven en runtime), ya vienen fill blanco sólido —
// se usan con <img> en vez de inline porque cada uno trae su propio viewBox
// y path complejo, no vale la pena transcribirlos a mano como el resto de
// los íconos del sitio (esos sí son simples y se dibujaron a mano).

const HIGHLIGHTS: { icon: string; title: string; description: string }[] = [
  {
    icon: "ubicacion-estrategica",
    title: "Ubicación estratégica",
    description: "Una ubicación estratégica sobre A005 y conexión a RN8.",
  },
  {
    icon: "calzada-hormigon",
    title: "Calzada de hormigón",
    description: "Calles de 14 metros de ancho para un movimiento seguro.",
  },
  {
    icon: "cerramiento-perimetral",
    title: "Cerramiento perimetral",
    description: "Cerramiento premoldeado de hormigón en todo el perímetro.",
  },
];

type Corner = "tl" | "tr" | "br" | "bl";

// El bisel de estos 10 íconos chicos no sigue una regla fija: en el mockup
// cada uno corta una esquina distinta (relevado a mano viendo el archivo,
// zoom por ícono) sin ningún patrón por fila/columna — es decorativo, así
// que se deja fijo por ícono acá (no al azar en cada render: usar Math.random()
// en un Server Component rompería la hidratación, el server y el cliente
// dibujarían esquinas distintas).
const FEATURES: { icon: string; title: string; description: string; corner: Corner }[] = [
  {
    icon: "conectividad-logistica",
    title: "Conectividad y logística",
    description: "Acceso directo a rutas y corredores logísticos regionales.",
    corner: "bl",
  },
  {
    icon: "33-hectareas-planificadas",
    title: "33 hectáreas planificadas",
    description: "Áreas industriales, logísticas y de servicios planificadas.",
    corner: "br",
  },
  {
    icon: "infraestructura-moderna",
    title: "Infraestructura moderna",
    description: "Servicios e infraestructura eficiente y de primer nivel.",
    corner: "tr",
  },
  {
    icon: "operacion-gran-volumen",
    title: "Operaciones de gran volumen",
    description: "Espacios preparados para operaciones de gran escala.",
    corner: "tl",
  },
  {
    icon: "infraestructura-transito-pesado",
    title: "Infraestructura para tránsito pesado",
    description: "Espacios aptos para bitrenes y todo tipo de transporte industrial.",
    corner: "br",
  },
  {
    icon: "seguridad-alta-tecnologia",
    title: "Seguridad de alta tecnología",
    description: "Sistema de seguridad inteligente y monitoreo permanente.",
    corner: "bl",
  },
  {
    icon: "ingreso-pavimentado",
    title: "Ingreso pavimentado",
    description: "Acceso ágil y controlado a 100 metros de Ruta A005.",
    corner: "tl",
  },
  {
    icon: "distribucion-energia-electrica",
    title: "Distribución de energía eléctrica",
    description: "Disponibilidad de energía eléctrica en media y baja tensión.",
    corner: "tl",
  },
  {
    icon: "red-gas-natural",
    title: "Red de gas natural",
    description: "Un servicio esencial para la actividad industrial.",
    corner: "tl",
  },
  {
    icon: "bascula-publica",
    title: "Báscula pública",
    description: "Agilidad y precisión para el control de cargas.",
    corner: "tl",
  },
];

// El badge de ícono de los 3 highlights cuelga en la esquina superior derecha
// de la card, biselado en dos esquinas opuestas (arriba-derecha y abajo-
// izquierda, mismo lenguaje que el marcador de lote — ver markerPoints en
// LoteMarker.tsx), no en las 3 esquinas de las variantes de chamfer.ts. El
// corte de arriba-derecha usa el mismo `cut` que la card (16) para que
// coincida exacto con el bisel de esa esquina de la card — mismo azul, mismo
// trazo, sin costura visible entre los dos.
function cardBadgeClipPath(cut: number): string {
  return `polygon(0 0, calc(100% - ${cut}px) 0, 100% ${cut}px, 100% 100%, ${cut}px 100%, 0 calc(100% - ${cut}px))`;
}

/** Cuadrado con una sola esquina cortada — usado por el badge de cada una de las 10 features chicas. */
function singleCornerClipPath(corner: Corner, cut: number): string {
  switch (corner) {
    case "tl":
      return `polygon(${cut}px 0, 100% 0, 100% 100%, 0 100%, 0 ${cut}px)`;
    case "tr":
      return `polygon(0 0, calc(100% - ${cut}px) 0, 100% ${cut}px, 100% 100%, 0 100%)`;
    case "br":
      return `polygon(0 0, 100% 0, 100% calc(100% - ${cut}px), calc(100% - ${cut}px) 100%, 0 100%)`;
    case "bl":
      return `polygon(0 0, 100% 0, 100% 100%, ${cut}px 100%, 0 calc(100% - ${cut}px))`;
  }
}

function FeatureIcon({ icon, className }: { icon: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- SVG chico servido tal cual, no necesita optimización de next/image
  return <img src={`/icons/${icon}.svg`} alt="" className={className} />;
}

export default function DescripcionGeneral() {
  return (
    <section id="quienes-somos" className="relative w-full scroll-mt-20 bg-black md:scroll-mt-24">
      {/* Foto aérea, con fade a negro incluido en el alpha del propio webp */}
      <div className="relative w-full" style={{ aspectRatio: "3841 / 1759" }}>
        <Image
          src="/images/descripcion-general-fondo.webp"
          alt="Vista aérea del parque industrial PARTA"
          fill
          className="object-cover object-top"
          sizes="100vw"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-black" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 pt-8 pb-20 text-center md:px-14 md:pt-4 md:pb-28">
        <h2 className="font-heading text-3xl leading-[0.9] font-bold tracking-tighter uppercase md:text-9xl md:leading-[0.8]">
          Una plataforma industrial y logística preparada para grandes operaciones.
        </h2>

        <p className="mx-auto mt-10 max-w-5xl text-base leading-relaxed text-white md:text-lg">
          PARTA nace como una plataforma de desarrollo industrial y logístico diseñada para
          conectar empresas, producción y mercados. Ubicado estratégicamente en Río Cuarto, reúne
          infraestructura, servicios y planificación urbana para impulsar nuevas oportunidades de
          inversión, operación y crecimiento regional.
        </p>

        {/* 3 highlights: borde chamfer + badge de ícono en la esquina superior derecha */}
        <div className="mx-auto mt-14 max-w-5xl grid gap-6 md:grid-cols-3">
          {HIGHLIGHTS.map(({ icon, title, description }) => (
            <ChamferOutline
              key={title}
              variant="nav"
              cut={10}
              borderWidth={2}
              color="var(--parta-blue)"
              className="text-left"
              innerClassName="relative"
            >
              {/* Flush contra el borde real de la card (sin el padding del
                  texto), para que su propio corte quede exacto sobre la
                  esquina de la card y no aparezca un borde blanco entre
                  medio. */}
              <span
                className="absolute top-0 right-0 flex h-12 w-12 items-center justify-center bg-[var(--parta-blue)]"
                style={{ clipPath: cardBadgeClipPath(10) }}
              >
                <FeatureIcon icon={icon} className="h-5 w-auto" />
              </span>
              <div className="py-10 pr-16 pl-6">
                <h3 className="font-heading text-3xl leading-[1] font-bold tracking-tight uppercase">{title}</h3>
                <p className="mt-3 text-base leading-[1.18] text-white">{description}</p>
              </div>
            </ChamferOutline>
          ))}
        </div>

        {/* Grilla de features chicas: 2 filas de 5 en desktop */}
        <div className="mx-auto mt-16 max-w-5xl grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-5">
          {FEATURES.map(({ icon, title, description, corner }) => (
            <div key={title} className="flex flex-col items-center text-center">
              <span
                className="mb-4 flex h-11 w-11 items-center justify-center bg-[var(--parta-blue)]"
                style={{ clipPath: singleCornerClipPath(corner, 8) }}
              >
                <FeatureIcon icon={icon} className="h-5 w-auto" />
              </span>
              <h4 className="font-heading text-base leading-[1.1] font-bold tracking-tight uppercase">{title}</h4>
              <p className="mt-4 text-sm leading-[1.18] text-white">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
