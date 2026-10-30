// Clips de demo en su versión clara u oscura. Portado del portafolio.
// Cada clip existe dos veces: `${base}-claro.mp4` y `${base}-oscuro.mp4`,
// con su póster `.webp`. Lo que cambia de tema son las demos; la página que
// las rodea se queda oscura.

export type Mode = "auto" | "claro" | "oscuro";
export type Phase = "claro" | "oscuro";

export const clipUrl = (base: string, phase: Phase, ext: "mp4" | "webp" = "mp4") =>
  `${base}-${phase}.${ext}`;

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Apunta un video a otro clip o fase sin el barrido (al cambiar de clip). */
export function loadClip(video: HTMLVideoElement, base: string, phase: Phase) {
  video.dataset.base = base;
  video.dataset.phase = phase;
  video.poster = clipUrl(base, phase, "webp");
  video.src = clipUrl(base, phase);
}

/**
 * Congela el fotograma que el video está mostrando en un canvas puesto justo
 * encima, para que la otra versión cargue por debajo y después el canvas se
 * aparte con una animación. Devuelve null cuando no hay nada que congelar.
 */
function freezeFrame(video: HTMLVideoElement): HTMLCanvasElement | null {
  const frame = video.parentElement;
  frame?.querySelectorAll("canvas.theme-cover").forEach((c) => c.remove());
  if (!frame || video.readyState < 2 || !video.videoWidth || reducedMotion()) return null;
  const cover = document.createElement("canvas");
  cover.className = "theme-cover";
  cover.width = video.videoWidth;
  cover.height = video.videoHeight;
  try {
    cover.getContext("2d")!.drawImage(video, 0, 0, cover.width, cover.height);
  } catch {
    return null;
  }
  const r = video.getBoundingClientRect();
  const f = frame.getBoundingClientRect();
  Object.assign(cover.style, {
    position: "absolute",
    zIndex: "2",
    pointerEvents: "none",
    objectFit: "cover",
    objectPosition: getComputedStyle(video).objectPosition,
    left: `${r.left - f.left}px`,
    top: `${r.top - f.top}px`,
    width: `${r.width}px`,
    height: `${r.height}px`,
    borderRadius: getComputedStyle(video).borderRadius,
  });
  frame.append(cover);
  return cover;
}

/** Aparta el fotograma congelado y se asegura de que no quede encima
 *  (las animaciones se detienen en pestañas ocultas). */
function dismiss(cover: HTMLCanvasElement, keyframes: Keyframe[], duration: number) {
  cover.animate(keyframes, {
    duration,
    easing: "cubic-bezier(.65, 0, .35, 1)",
    fill: "forwards",
  }).onfinish = () => cover.remove();
  setTimeout(() => cover.remove(), duration + 450);
}

/** Pasa a otro clip con un fundido desde el fotograma actual. */
export function changeClip(video: HTMLVideoElement, base: string, phase: Phase) {
  const cover = freezeFrame(video);
  loadClip(video, base, phase);
  if (cover) {
    video.addEventListener(
      "loadeddata",
      () => dismiss(cover, [{ opacity: 1 }, { opacity: 0 }], 600),
      { once: true },
    );
    // Si el clip se pausa antes de cargar, que no quede el fotograma encima.
    setTimeout(() => cover.remove(), 2500);
  }
  video.play().catch(() => {});
}

/**
 * Cambia un clip en marcha a la otra fase: el fotograma actual se congela en
 * un canvas sobre el video y, cuando la nueva versión pinta, el canvas se
 * borra con un barrido circular desde una esquina.
 */
export function switchPhase(video: HTMLVideoElement, phase: Phase) {
  const base = video.dataset.base;
  if (!base || video.dataset.phase === phase) return;
  const time = video.currentTime;
  const resume = !video.paused;
  const cover = freezeFrame(video);

  loadClip(video, base, phase);
  if (!resume && !cover) return;

  video.addEventListener(
    "loadeddata",
    () => {
      try {
        video.currentTime = Math.min(time, (video.duration || time) - 0.1);
      } catch {}
      if (cover) {
        const origin = phase === "oscuro" ? "100% 0%" : "0% 100%";
        dismiss(
          cover,
          [
            { clipPath: `circle(150% at ${origin})` },
            { clipPath: `circle(0% at ${origin})` },
          ],
          750,
        );
      }
    },
    { once: true },
  );
  // Con preload="none" no se descarga nada hasta play() o un load() explícito.
  if (resume) video.play().catch(() => {});
  else {
    video.preload = "auto";
    video.load();
  }
}
