import { Fragment } from "react";
import Image from "next/image";
import { chamferClipPath } from "./chamfer";

// Sección "Inversores" (designs/inversiones/), 3 bloques: 1 y 3 son fotos
// full-bleed (mismo patrón que Servicios.tsx: assets propios por breakpoint,
// no un solo bg con object-cover — el cliente pasó desktop/mobile por
// separado, capturas/composiciones distintas, no el mismo recorte). El
// bloque 2 no tiene foto: es contenido plano sobre negro (título + 2
// bajadas, subtítulo, grilla de 5 pasos, título de cierre), todo alineado a
// la izquierda (a diferencia de Servicios/DescripcionGeneral, que centran).
const HEADING_SCALE =
  "font-heading text-4xl leading-[0.9] font-bold tracking-tighter text-white uppercase md:text-9xl md:leading-[0.8]";

const CARDS: { numero: string; titulo: string[]; descripcion: string }[] = [
  {
    numero: "01",
    titulo: ["Adquisición", "del lote."],
    descripcion:
      "El inversor adquiere un lote dentro de PARTA, ubicado en un parque industrial y logístico estratégicamente desarrollado.",
  },
  {
    numero: "02",
    titulo: ["Desarrollo", "de la nave."],
    descripcion:
      "Se proyecta y construye una nave industrial Clase A, diseñada según estándares operativos y logísticos actuales.",
  },
  {
    numero: "03",
    titulo: ["Comercialización", "del activo."],
    descripcion:
      "PARTA acompaña la comercialización del activo y facilita el vínculo con empresas e industrias interesadas en radicarse dentro del parque.",
  },
  {
    numero: "04",
    titulo: ["Generación", "de renta."],
    descripcion:
      "Una vez ocupada, la nave puede generar ingresos mediante contratos de locación corporativa, habitualmente estructurados a largo plazo y en dólares.",
  },
  {
    numero: "05",
    titulo: ["Administración", "integral."],
    descripcion:
      "PARTA centraliza la gestión de la infraestructura común y brinda acompañamiento administrativo, simplificando la operatoria para el inversor.",
  },
];

function HeadingLines({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={line}>
          {i > 0 && <br />}
          {line}
        </Fragment>
      ))}
    </>
  );
}

export default function Inversiones() {
  return (
    <section id="inversores" className="relative w-full scroll-mt-20 bg-black md:scroll-mt-24">
      {/* Bloque 1: "Invertí en un activo real." */}
      <div className="relative aspect-[1080/2400] w-full md:aspect-[1920/1080]">
        <Image
          src="/images/inversiones-1-bg-mobile.webp"
          alt=""
          fill
          className="object-cover md:hidden"
          sizes="(max-width: 767px) 100vw, 0px"
        />
        <Image
          src="/images/inversiones-1-bg-desktop.webp"
          alt=""
          fill
          className="hidden object-cover md:block"
          sizes="(min-width: 768px) 100vw, 0px"
        />
        <div className="absolute inset-0 z-10 flex flex-col justify-end px-6 pb-12 md:px-14 md:pb-20">
          <div className="mx-auto w-full max-w-[1600px] text-center">
            <h2 className={HEADING_SCALE}>
              <HeadingLines lines={["Invertí en", "un activo real."]} />
            </h2>
            <p className="mx-auto mt-8 max-w-6xl text-base leading-[1.2] text-white md:text-base md:leading-[1.4]">
              PARTA desarrolla una propuesta de inversión orientada a quienes buscan participar en
              activos industriales y logísticos dentro de una ubicación estratégica y con potencial
              de desarrollo. El modelo permite formar parte de la creación de infraestructura Clase A
              en un parque industrial concebido para acompañar el crecimiento de empresas, contando
              además con acompañamiento administrativo y operativo que simplifica la gestión del
              proyecto.
            </p>
            <p className="mx-auto mt-4 max-w-6xl text-base leading-[1.2] text-white md:text-base md:leading-[1.4]">
              A través de la adquisición de un lote dentro del parque, se proyecta y desarrolla una
              nave industrial Clase A con potencial de ser destinada a actividades corporativas,
              industriales o logísticas. PARTA acompaña el proceso de desarrollo, facilita la
              vinculación con potenciales usuarios y brinda soporte en aspectos administrativos y de
              gestión vinculados al activo.
            </p>
            <div className="mt-10 flex justify-center">
              <a
                href="#contacto"
                className="bg-[#3555fa] px-6 py-3 text-xs font-semibold tracking-widest text-white uppercase transition-opacity hover:opacity-90 sm:text-sm"
                style={{ clipPath: chamferClipPath("nav", 8) }}
              >
                Más información
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bloque 2: mercado + "¿Cómo funciona?" + pasos — sin foto, todo alineado a la izquierda */}
      <div className="mx-auto w-full max-w-[1600px]  px-6 py-20 md:px-14 md:py-32">
        <h2 className={HEADING_SCALE}>
          <span className="block md:hidden">
            <HeadingLines lines={["Un mercado con", "fuerte proyección."]} />
          </span>
          <span className="hidden md:block">
            <HeadingLines lines={["Un mercado", "con fuerte", "proyección."]} />
          </span>
        </h2>

        <div className="mt-8 max-w-6xl space-y-6 mb-24">
          <p className="mt-8 text-base leading-[1.2] text-white md:text-base md:leading-[1.4]">
            El sector de naves industriales y logísticas se posiciona como uno de los segmentos con
            mayor potencial dentro del mercado inmobiliario argentino. La expansión del e-commerce,
            la transformación de las cadenas de suministro y la creciente necesidad de infraestructura
            moderna impulsan una demanda sostenida de espacios industriales y logísticos fuera del
            AMBA.
          </p>
          <p className="mt-8 text-base leading-[1.2] text-white md:text-base md:leading-[1.4]">
            En este contexto, las naves industriales Clase A representan una alternativa de inversión
            vinculada a la economía real, con potencial de generar ingresos mediante contratos
            corporativos de largo plazo y exposición a un mercado en constante crecimiento.
          </p>
        </div>

        <h3 className='font-heading text-3xl leading-[0.9] font-bold tracking-tighter text-white uppercase md:text-7xl md:leading-[0.8]'>
          ¿Cómo funciona?
        </h3>

        {/* flex + justify-center en vez de grid-cols-3: con 5 tarjetas el último renglón
            (04 y 05) queda de 2 — en un grid normal esas 2 arrancan pegadas a la izquierda
            (columna 3 vacía); con flex-wrap cada renglón se centra por separado, así el
            renglón de 2 queda centrado a la página en vez de a la izquierda. El ancho de
            cada tarjeta replica a mano lo que daría grid-cols-3 gap-6 (3 columnas, 2 gaps
            de 1.5rem = 3rem entre ellas). */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 md:mt-16">
          {CARDS.map((card) => (
            <div
              key={card.numero}
              className="w-full bg-[var(--parta-blue)] p-6 md:w-[calc((100%-3rem)/3)] md:p-8"
              style={{ clipPath: chamferClipPath("nav", 16) }}
            >
              <div className="flex items-end justify-between gap-4">
                <span className="font-heading text-6xl leading-none font-normal text-white md:text-7xl">
                  {card.numero}
                </span>
                <span className="font-heading pt-1 text-right text-base leading-tight font-bold text-white">
                  <HeadingLines lines={card.titulo} />
                </span>
              </div>
              <div className="mt-6 border-t border-white/40" />
              <p className="mt-6 text-sm leading-relaxed text-white/90 text-left">{card.descripcion}</p>
            </div>
          ))}
        </div>

        <h2 className={`${HEADING_SCALE} mt-20 text-center md:mt-32`}>
          <span className="block md:hidden">
            <HeadingLines lines={["Invertí en", "infraestructura y", "desarrollo."]} />
          </span>
          <span className="hidden md:block">
            <HeadingLines lines={["Invertí en", "infraestructura", "y desarrollo."]} />
          </span>
        </h2>
      </div>

      {/* Bloque 3: "Sé parte del futuro de la industria y la logística" — cierre, solo título */}
      <div className="relative aspect-[1080/1921] w-full md:aspect-[1921/1780]">
        <Image
          src="/images/inversiones-3-bg-mobile.webp"
          alt=""
          fill
          className="object-cover md:hidden"
          sizes="(max-width: 767px) 100vw, 0px"
        />
        <Image
          src="/images/inversiones-3-bg-desktop.webp"
          alt=""
          fill
          className="hidden object-cover md:block"
          sizes="(min-width: 768px) 100vw, 0px"
        />
        <div className="absolute inset-0 z-10 flex flex-col justify-end px-6 pb-16 text-center md:px-14 md:pb-24 md:text-left">
          <div className="mx-auto w-full max-w-[1600px]">
            <h2 className={`${HEADING_SCALE} mt-20 text-center md:mt-32`}>
              <HeadingLines lines={["Sé parte del futuro", "de la industria y", "la logística."]} />
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
