import Hero from "./components/Hero";
import DescripcionGeneral from "./components/DescripcionGeneral";
import VideoZoom from "./components/VideoZoom";
import IsometricMap from "./components/IsometricMap";
import CenitalMap from "./components/CenitalMap";
import SmoothScroll from "./components/SmoothScroll";
import Footer from "./components/Footer";
import { mergeLoteOverrides } from "./data/lotes";
import { fetchLoteOverrides } from "./lib/sheet";

export default async function Home() {
  const loteOverrides = await fetchLoteOverrides();
  const lotes = mergeLoteOverrides(loteOverrides);

  return (
    <SmoothScroll>
    <main>
      {/* Sección 1: Hero con slider de fondos */}
      <Hero />

      {/* Sección 2: Descripción general del proyecto */}
      <DescripcionGeneral />

      {/* Sección 3: Video zoom-in al scroll */}
      <VideoZoom />

      {/* Sección 4: Mapa cenital de loteo */}
      <CenitalMap lotes={lotes} />

      {/* Sección 5: Mapa isométrico interactivo */}
      <IsometricMap />

      {/* Footer con formulario de contacto */}
      <Footer />
    </main>
    </SmoothScroll>
  );
}
