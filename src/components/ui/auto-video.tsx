"use client";

import { useEffect, useRef } from "react";

interface AutoVideoProps {
  src: string;
  poster: string;
  label: string;
  className?: string;
  /** Si es false el video queda en pausa aunque esté en pantalla (p. ej. tarjetas de atrás de un carrusel). */
  active?: boolean;
}

/**
 * Demo grabada que se reproduce sola, en silencio y en bucle, solo mientras está en pantalla y activa.
 * Con preload="none" no descarga nada hasta que hace falta; con movimiento reducido queda el póster.
 */
export function AutoVideo({ src, poster, label, className, active = true }: AutoVideoProps) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const inView = useRef(false);
  const activeRef = useRef(active);

  const sync = () => {
    const video = ref.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (inView.current && activeRef.current) video.play().catch(() => {});
    else video.pause();
  };

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
        sync();
      },
      { threshold: 0.35 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    activeRef.current = active;
    sync();
  }, [active]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      aria-label={label}
      className={className}
      muted
      loop
      playsInline
      preload="none"
    />
  );
}
