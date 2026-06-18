"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC = "/video-zoom-seekable.mp4";

export default function VideoZoom() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const setup = () => {
      const duration = video.duration || 11;

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=200%",
        pin: true,
        scrub: 0.1,
        onUpdate: (self) => {
          video.currentTime = self.progress * duration;
        },
      });
    };

    if (video.readyState >= 1) {
      setup();
    } else {
      video.addEventListener("loadedmetadata", setup, { once: true });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen bg-black"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={VIDEO_SRC}
        muted
        playsInline
        preload="auto"
      />

      {/* Overlay de texto */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-8">
        <p className="text-sm tracking-widest text-gray-400 uppercase mb-4">
          Río Cuarto · Córdoba · Argentina
        </p>
        <h1 className="text-5xl md:text-7xl font-bold uppercase leading-tight mb-6">
          Bienvenido al<br />
          <span style={{ color: "#2563eb" }}>Corazón Logístico</span><br />
          de Argentina
        </h1>
        <div className="flex gap-4 mt-4">
          <button className="border border-white text-white text-sm uppercase tracking-widest px-6 py-3 hover:bg-white hover:text-black transition-colors">
            Descargá el Brochure
          </button>
          <button className="bg-blue-600 text-white text-sm uppercase tracking-widest px-6 py-3 hover:bg-blue-700 transition-colors">
            Solicitar Información
          </button>
        </div>
      </div>
    </section>
  );
}
