// Clips de demo en versión clara y oscura. Cada clip existe dos veces:
// `${base}-claro.mp4` y `${base}-oscuro.mp4`, con su póster `.webp`.
// Solo cambian de tema los clips: la página alrededor sigue oscura.

export type Mode = "auto" | "claro" | "oscuro";
export type Phase = "claro" | "oscuro";

export const clipUrl = (
  base: string,
  phase: Phase,
  ext: "mp4" | "webp" = "mp4"
) => `${base}-${phase}.${ext}`;

const reducedMotion = () =>
  matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Apunta un video a otro clip/tema sin barrido (al cambiar de clip). */
export function loadClip(video: HTMLVideoElement, base: string, phase: Phase) {
  video.dataset.base = base;
  video.dataset.phase = phase;
  video.poster = clipUrl(base, phase, "webp");
  video.src = clipUrl(base, phase);
}

/**
 * Congela el fotograma actual en un canvas puesto exactamente sobre el video, para que el
 * siguiente clip o tema cargue debajo y el canvas se anime después. Devuelve null si no hay
 * nada que congelar.
 */
function freezeFrame(video: HTMLVideoElement): HTMLCanvasElement | null {
  const frame = video.parentElement;
  frame?.querySelectorAll("canvas.theme-cover").forEach((c) => c.remove());
  if (!frame || video.readyState < 2 || !video.videoWidth || reducedMotion())
    return null;
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

/** Anima la salida del fotograma congelado y se asegura de que nunca quede encima. */
function dismiss(
  cover: HTMLCanvasElement,
  keyframes: Keyframe[],
  duration: number
) {
  cover.animate(keyframes, {
    duration,
    easing: "cubic-bezier(.65, 0, .35, 1)",
    fill: "forwards",
  }).onfinish = () => cover.remove();
  setTimeout(() => cover.remove(), duration + 450);
}

/** Pasa al siguiente clip de la secuencia con un crossfade desde el fotograma actual. */
export function changeClip(
  video: HTMLVideoElement,
  base: string,
  phase: Phase
) {
  const cover = freezeFrame(video);
  loadClip(video, base, phase);
  if (cover) {
    video.addEventListener(
      "loadeddata",
      () => dismiss(cover, [{ opacity: 1 }, { opacity: 0 }], 600),
      { once: true }
    );
    // Si el clip se pausa antes de cargar (el puntero salió de la tarjeta), no dejar el fotograma encima.
    setTimeout(() => cover.remove(), 2500);
  }
  video.play().catch(() => {});
}

/**
 * Cambia un clip en reproducción al otro tema: el fotograma actual se congela en un canvas
 * sobre el video y, cuando pinta la nueva versión, el canvas se borra con un barrido circular.
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
          750
        );
      }
    },
    { once: true }
  );
  // Con preload="none" no se descarga nada hasta play() o un load() explícito.
  if (resume) video.play().catch(() => {});
  else {
    video.preload = "auto";
    video.load();
  }
}

/** Cambia una captura al otro tema con el mismo barrido circular que los videos. */
export function sweepImage(
  img: HTMLImageElement,
  src: string,
  phase: Phase
) {
  const next = new Image();
  next.src = src;
  next
    .decode()
    .catch(() => {})
    .then(() => {
      if (reducedMotion() || !img.offsetWidth) {
        img.src = src;
        return;
      }
      const cover = img.cloneNode() as HTMLImageElement;
      cover.alt = "";
      Object.assign(cover.style, {
        position: "absolute",
        zIndex: "1",
        pointerEvents: "none",
        left: `${img.offsetLeft}px`,
        top: `${img.offsetTop}px`,
        width: `${img.offsetWidth}px`,
        height: `${img.offsetHeight}px`,
      });
      img.after(cover);
      img.src = src;
      const origin = phase === "oscuro" ? "100% 0%" : "0% 100%";
      cover.animate(
        [
          { clipPath: `circle(150% at ${origin})` },
          { clipPath: `circle(0% at ${origin})` },
        ],
        {
          duration: 750,
          easing: "cubic-bezier(.65, 0, .35, 1)",
          fill: "forwards",
        }
      ).onfinish = () => cover.remove();
      setTimeout(() => cover.remove(), 1200);
    });
}
