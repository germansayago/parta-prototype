import Hero from "./components/Hero";
import Footer from "./components/Footer";
import SmoothScroll from "./components/SmoothScroll";

export default function Home() {
  return (
    <SmoothScroll>
    <main>
      {/* Sección 1: Hero con video zoom-in al scroll */}
      <VideoZoom />

      {/* Footer con formulario de contacto */}
      <Footer />
    </main>
    </SmoothScroll>
  );
}
