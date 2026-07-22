import Hero from "./components/Hero";
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

      {/* Sección 2: Características del proyecto (placeholder, falta diseño) */}
      <section className="h-screen flex items-center justify-center bg-black border-t border-white/10">
        <div className="text-center">
          <p className="text-gray-500 text-sm uppercase tracking-widest mb-4">Próxima sección</p>
          <h2 className="text-4xl font-bold text-white/20 uppercase">Características del proyecto</h2>
        </div>
      </section>

      {/* Sección 3: Video zoom-in al scroll */}
      <VideoZoom />

      {/* Sección 4: Mapa isométrico interactivo */}
      <IsometricMap />

      {/* Sección 5: Mapa cenital de loteo (posición tentativa, ver docs/PLAN.md) */}
      <CenitalMap lotes={lotes} />

      {/* Footer con formulario de contacto */}
      <Footer />
    </main>
    </SmoothScroll>
  );
}
