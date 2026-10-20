import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Punto de partida de cada variante de `data-reveal`: sube por defecto, entra por un lado, crece,
 * o se dibuja desde el centro (las líneas de los separadores de sección).
 */
const REVEAL_FROM: Record<string, gsap.TweenVars> = {
  left: { x: -80, opacity: 0 },
  right: { x: 80, opacity: 0 },
  zoom: { scale: 0.85, opacity: 0 },
  "draw-left": { scaleX: 0, transformOrigin: "right center" },
  "draw-right": { scaleX: 0, transformOrigin: "left center" },
};

export function initScrollReveal() {
  const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
  if (reducedMotion()) {
    els.forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    return;
  }

  els.forEach((el) => {
    const from = REVEAL_FROM[el.dataset.reveal ?? ""] ?? { y: 40, opacity: 0 };
    gsap.fromTo(el, from, {
      x: 0,
      y: 0,
      scale: 1,
      scaleX: 1,
      opacity: 1,
      duration: el.dataset.reveal?.startsWith("draw") ? 1.4 : 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        once: true,
      },
    });
  });
}

/** Desplaza en vertical los elementos con `data-parallax="<px>"` mientras su sección sale de pantalla. */
export function initParallax() {
  if (reducedMotion()) return;
  document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
    gsap.to(el, {
      y: parseFloat(el.dataset.parallax ?? "0"),
      ease: "none",
      scrollTrigger: {
        trigger: el.closest("section") ?? el,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  });
}
