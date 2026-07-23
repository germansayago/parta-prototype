import Hero from "./components/Hero";
import Footer from "./components/Footer";
import SmoothScroll from "./components/SmoothScroll";

export default function Home() {
  return (
    <SmoothScroll>
    <main>
      {/* Sección 1: Hero con slider de imágenes */}
      <Hero />

      {/* Footer con formulario de contacto */}
      <Footer />
    </main>
    </SmoothScroll>
  );
}
