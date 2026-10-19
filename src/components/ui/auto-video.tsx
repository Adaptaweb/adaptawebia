"use client";

import { useEffect, useRef } from "react";

interface AutoVideoProps {
  src: string;
  poster: string;
  label: string;
  className?: string;
}

/**
 * Demo grabada que se reproduce sola, en silencio y en bucle, solo mientras está en pantalla.
 * Con preload="none" no descarga nada hasta que aparece; con movimiento reducido queda el póster.
 */
export function AutoVideo({ src, poster, label, className }: AutoVideoProps) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.35 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

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
