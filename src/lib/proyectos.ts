import datos from "../data/proyectos.json";

/**
 * Un medio es una demo o una captura fija.
 *
 * - `src` es la base de un par de clips: existen `${src}-claro.mp4` y
 *   `${src}-oscuro.mp4`, cada uno con su póster `.webp`. El selector de las
 *   demos alterna entre los dos.
 * - `still` es una imagen única, para los proyectos de los que todavía no
 *   grabamos la demo.
 */
export interface Medio {
  src?: string;
  still?: string;
  caption: string;
  title: string;
  device?: "phone" | "tablet";
}

export interface Nodo {
  name: string;
  detail: string;
  primary?: boolean;
}

export interface Detalle {
  title: string;
  body: string;
}

export interface Proyecto {
  slug: string;
  name: string;
  shortName?: string;
  type: string;
  entity: string;
  startDate: string;
  endDate?: string;
  description: string;
  summary?: string;
  highlights?: (string | { title: string; text: string })[];
  uxDetails?: Detalle[];
  keywords: string[];
  problem?: string;
  context?: string[];
  decisions?: Detalle[];
  architecture?: { clients: Nodo[]; services: Nodo[]; data: Nodo[] };
  results?: string[];
  url?: string;
  urlLabel?: string;
  media?: Medio[];
}

export const proyectos = datos as Proyecto[];

/**
 * Solo los que tienen material para sostener una ficha propia. Los demás se
 * quedan como tarjeta en el índice, con su demo y su enlace a la app.
 */
export const tieneFicha = (p: Proyecto) => Boolean(p.problem);

export const fichas = proyectos.filter(tieneFicha);

export const porSlug = (slug: string) => proyectos.find((p) => p.slug === slug);

/** Separa los highlights en frases sueltas y fichas con título. */
export function partirHighlights(lista: Proyecto["highlights"]) {
  const frases: string[] = [];
  const fichas: Detalle[] = [];
  for (const h of lista ?? []) {
    if (typeof h === "string") frases.push(h);
    else fichas.push({ title: h.title, body: h.text });
  }
  return { frases, fichas };
}

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/** "2026-03" -> "marzo de 2026". Devuelve el rango cuando hay fecha de término. */
export function fecha(inicio: string, fin?: string) {
  const uno = (v: string) => {
    const [anio, mes] = v.split("-");
    return mes ? `${MESES[Number(mes) - 1]} de ${anio}` : anio;
  };
  if (!fin) return `desde ${uno(inicio)}`;
  return `${uno(inicio)} — ${uno(fin)}`;
}

/**
 * Lo que muestra la tarjeta del índice: la captura, el clip que se reproduce
 * al pasar el cursor y, cuando hay varios, la lista para encadenarlos.
 */
export function portada(p: Proyecto) {
  const m = p.media?.[0];
  if (!m) return null;
  const device = m.device ?? "web";
  const hermanos = (p.media ?? []).filter((x) => (x.device ?? "web") === device && x.src);
  return {
    img: m.still ?? `${m.src}-claro.webp`,
    video: m.src ? `${m.src}-claro.mp4` : null,
    base: m.src ?? null,
    clips: hermanos.length > 1 ? hermanos.map((x) => x.src!) : null,
    device,
  };
}

/** El rótulo de la barra del navegador: el dominio si está publicado. */
export const dominio = (p: Proyecto) =>
  p.url?.startsWith("http") ? new URL(p.url).host : (p.shortName ?? p.name).toLowerCase();
