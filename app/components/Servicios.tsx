import { Fragment } from "react";
import Image from "next/image";

// 3 bloques full-bleed apilados (designs/servicios/servicios-{1,2,3}-muestra*.png),
// cada uno con su propia foto de fondo (servicios-N-bg.png → public/images/servicios-N-bg.webp,
// ya vienen con el degradé oscuro incluido en el propio píxel de la foto, no en el alpha
// como descripcion-general-fondo.webp — no hace falta un gradient overlay en código). No hay
// un bg-mobile aparte: mobile reusa la misma foto, solo cambia el aspect-ratio del contenedor
// (retrato, 1080/1921, medido de servicios-N-muestra-mobile.png) para no repetir el bug de la
// primera versión, que fijaba el ratio horizontal de desktop también en mobile y hacía que el
// bloque de texto (pensado para una caja mucho más alta en mobile) se saliera por arriba y por
// abajo del contenedor.
// Tipografía del título/bajada igual a DescripcionGeneral.tsx (mismo tamaño: text-9xl en desktop).
const BLOQUES = [
  {
    src: "/images/servicios-1-bg-alt.webp",
    aspect: "aspect-[1080/1921] md:aspect-[1921/1780]",
    heading: ["Alquiler y ventas de", "naves industriales."],
    // El mockup mobile dice "VENTA" (singular) en vez de "VENTAS" — inconsistencia entre los dos
    // mockups del cliente, no un typo introducido acá. Se replica tal cual cada asset por ahora;
    // avisar/confirmar cuál es la correcta antes de unificarlo.
    headingMobile: ["Alquiler y venta de", "naves industriales."],
    headingClassName: "text-center md:text-center",
    body: "Además de la venta de lotes, PARTA ofrece naves industriales listas para operar, reduciendo tiempos de instalación y facilitando la radicación de empresas. Las empresas que se radiquen dentro del parque podrán acceder a los beneficios de la promoción industrial a nivel provincial y municipal, fortaleciendo las condiciones para invertir, producir y crecer. Integramos seguridad, infraestructura moderna y soluciones adaptadas a las necesidades operativas de cada empresa.",
    cta: "Consultá con un asesor",
    justify: "justify-end pb-12 md:pb-20",
  },
  {
    src: "/images/servicios-2-bg.webp",
    aspect: "aspect-[1080/1921] md:aspect-[1921/1780]",
    heading: ["Infraestructura,", "conectividad y", "seguridad para", "empresas."],
    body: "Ofrecemos un entorno seguro y preparado para el desarrollo de distintas industrias, con cámaras perimetrales y térmicas, control de accesos, guardia física y rondas de patrullaje. El parque cuenta además con servicios comunes para empresas, como suministro eléctrico a medida, gas natural, conectividad por fibra óptica, calles pavimentadas con cordón cuneta, sala de reuniones y báscula pública. Como parte de su proyección estratégica, se prevee también la instalación de un centro de transferencia de cargas y un depósito fiscal dentro del predio, incorporando un diferencial logístico clave para la región.",
    justify: "justify-start pt-16 md:pt-28",
  },
  {
    src: "/images/servicios-3-bg.webp",
    aspect: "aspect-[1081/1921] md:aspect-[1921/1117]",
    heading: ["64 lotes de", "hasta 14.000 m²"],
    justify: "justify-start pt-20 md:pt-24",
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

export default function Servicios() {
  return (
    <section className="relative w-full bg-black">
      {BLOQUES.map((bloque) => (
        <div key={bloque.src} className={`relative w-full ${bloque.aspect}`}>
          <Image src={bloque.src} alt="" fill className="object-cover" sizes="100vw" />

          <div className={`absolute inset-0 z-10 flex flex-col px-6 md:px-14 ${bloque.justify}`}>
            <div className="mx-auto w-full max-w-[1600px] text-center">
              <h2
                className={`font-heading text-3xl leading-[0.9] font-bold tracking-tighter text-white uppercase md:text-9xl md:leading-[0.8] ${bloque.headingClassName ?? ""}`}
              >
                {bloque.headingMobile ? (
                  <>
                    <span className="block md:hidden">
                      <HeadingLines lines={bloque.headingMobile} />
                    </span>
                    <span className="hidden md:block">
                      <HeadingLines lines={bloque.heading} />
                    </span>
                  </>
                ) : (
                  <HeadingLines lines={bloque.heading} />
                )}
              </h2>

              {bloque.body && (
                <p className="mx-auto mt-8 max-w-4xl text-sm leading-[1.3] text-white md:text-lg">
                  {bloque.body}
                </p>
              )}

              {bloque.cta && (
                <div className="mt-8 flex justify-center">
                  <a
                    href="#contacto"
                    className="rounded-full bg-[#3555fa] px-6 py-3 text-xs font-semibold tracking-widest text-white uppercase transition-opacity hover:opacity-90 sm:text-sm"
                  >
                    {bloque.cta}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
