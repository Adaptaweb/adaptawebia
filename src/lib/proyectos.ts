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
  highlights?: string[];
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

/** El póster que representa al proyecto en el índice. */
export function portada(p: Proyecto) {
  const m = p.media?.[0];
  if (!m) return null;
  if (m.still) return { src: m.still, esClip: false, device: m.device };
  return { src: `${m.src}-claro.webp`, esClip: true, device: m.device };
}
