"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AutoVideo } from "@/components/ui/auto-video";
import { cn } from "@/lib/utils";

/** Cada demo existe como `${base}.mp4` con su póster `${base}.webp`. */
const media = (base: string) => ({ src: `${base}.mp4`, poster: `${base}.webp` });

type App = {
  name: string;
  kind: string;
  desc: string;
  link?: { href: string; label: string };
  /** Contenido de la tarjeta del carrusel; `active` es true solo para la tarjeta del frente. */
  render: (active: boolean) => ReactNode;
};

function BrowserFrame({ label, children, className, style }: { label: string; children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <span
      className={cn("block overflow-hidden rounded-xl border border-white/10 bg-[#0D0E10] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)]", className)}
      style={style}
    >
      <span className="flex items-center gap-1.5 border-b border-[#2A2D31] bg-[#18191C] px-3 py-2">
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#FF5F57]" />
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#FEBC2E]" />
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#28C840]" />
        <span className="ml-2 truncate font-mono text-[10px] text-text-muted">{label}</span>
      </span>
      {children}
    </span>
  );
}

function DeviceFrame({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <span
      className={cn(
        "block bg-gradient-to-br from-[#2B2E33] to-[#131416] shadow-[inset_0_0_0_1px_#3A3E44,0_30px_60px_-20px_rgba(0,0,0,0.95)]",
        className
      )}
      style={style}
    >
      {children}
    </span>
  );
}

const videoFill = "block h-full w-full object-cover";

function Phones({ first, second, active }: { first: { base: string; label: string }; second?: { base: string; label: string }; active: boolean }) {
  return (
    <span className="absolute inset-0 flex justify-center gap-[4.5%] pt-[6%]">
      <DeviceFrame className="aw-dev aw-dev-b w-[28%] rounded-[28px] p-[1%]">
        <AutoVideo {...media(first.base)} label={first.label} active={active} className={cn(videoFill, "aspect-[1080/2338] rounded-[22px] object-top")} />
      </DeviceFrame>
      {second && (
        <DeviceFrame className="aw-dev aw-dev-c mt-[7%] w-[28%] rounded-[28px] p-[1%]">
          <AutoVideo {...media(second.base)} label={second.label} active={active} className={cn(videoFill, "aspect-[1080/2338] rounded-[22px] object-top")} />
        </DeviceFrame>
      )}
    </span>
  );
}

const APPS: App[] = [
  {
    name: "Accesos y casino",
    kind: "Web + API + apps móviles",
    desc: "Panel web, app de acceso para portería y tablet de casino sobre un mismo motor de validación, incluso sin conexión.",
    render: (active) => (
      <>
        <BrowserFrame label="Panel web" className="aw-dev aw-dev-a absolute left-[4.7%] top-[6.5%] w-[71.7%]">
          <AutoVideo
            {...media("/media/control-acceso/ficha-oscuro")}
            label="Demo del panel web: consulta de ficha, estado de acceso y bloqueos"
            active={active}
            className={cn(videoFill, "aspect-video object-left-top")}
          />
        </BrowserFrame>
        <DeviceFrame className="aw-dev aw-dev-b absolute bottom-[6%] left-[11.7%] w-[45%] rounded-2xl p-[1.3%]">
          <AutoVideo
            {...media("/media/control-acceso/app-casino-oscuro")}
            label="Demo de la tablet del casino validando raciones"
            active={active}
            className={cn(videoFill, "aspect-[16/10] rounded-[10px]")}
          />
        </DeviceFrame>
        <DeviceFrame className="aw-dev aw-dev-c absolute right-[5%] top-[16%] w-[23.3%] rounded-[24px] p-[0.9%]">
          <AutoVideo
            {...media("/media/control-acceso/app-peatones-oscuro")}
            label="Demo de la app de acceso registrando peatones en portería"
            active={active}
            className={cn(videoFill, "aspect-[864/1872] rounded-[19px] object-top")}
          />
        </DeviceFrame>
      </>
    ),
  },
  {
    name: "Kuentas Klaras",
    kind: "App web instalable (PWA)",
    desc: "Gastos por categoría y tarjeta, cuotas, suscripciones y ahorro, con bancos chilenos y sugerencias con IA.",
    link: { href: "https://gastos.adaptaweb.cl/", label: "Abrir app" },
    render: (active) => (
      <Phones
        first={{ base: "/media/gastos/cuotas-oscuro", label: "Demo de Kuentas Klaras: cuotas pendientes" }}
        second={{ base: "/media/gastos/resumen-oscuro", label: "Demo de Kuentas Klaras: resumen del mes" }}
        active={active}
      />
    ),
  },
  {
    name: "Ideas Blueprint",
    kind: "Plataforma web",
    desc: "Kanban con prioridades, taller visual sobre capturas y modo presentación para tu comité.",
    link: { href: "https://ideas.adaptaweb.cl/", label: "Visitar sitio" },
    render: (active) => (
      <BrowserFrame label="ideas.adaptaweb.cl" className="aw-dev aw-dev-a absolute inset-x-[5.3%] top-[9%]">
        <AutoVideo
          {...media("/media/ideas/tablero-oscuro")}
          label="Demo de Ideas Blueprint: tablero de ideas"
          active={active}
          className={cn(videoFill, "aspect-[16/10] object-left-top")}
        />
      </BrowserFrame>
    ),
  },
  {
    name: "KeComo",
    kind: "App móvil",
    desc: "Registra lo que comes, detecta posibles alérgenos y lleva un reporte PDF a la consulta.",
    render: (active) => (
      <Phones first={{ base: "/media/kecomo/app-oscuro", label: "Demo de KeComo: registro de comidas del día" }} active={active} />
    ),
  },
  {
    name: "Bank Craft",
    kind: "App web + IoT",
    desc: "Tareas del hogar gamificadas al estilo Minecraft: se aprueban por Telegram y Home Assistant reacciona en casa.",
    render: () => (
      <BrowserFrame label="Bank Craft" className="aw-dev aw-dev-a absolute inset-x-[5.3%] top-[9%]">
        <img
          src="/media/thumbs/bank-craft.webp"
          alt="Bank Craft: misiones del día"
          loading="lazy"
          decoding="async"
          className="block aspect-[16/10] w-full object-cover"
        />
      </BrowserFrame>
    ),
  },
];

export default function AplicacionesSection() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = APPS.length;
  const go = (k: number) => setIndex(((k % n) + n) % n);
  const selectorRef = useRef<HTMLDivElement | null>(null);

  // En pantallas angostas el selector se desplaza para dejar visible la pastilla activa.
  useEffect(() => {
    const scroller = selectorRef.current;
    const tab = scroller?.querySelector<HTMLElement>(`#app-tab-${index}`);
    if (!scroller || !tab || scroller.scrollWidth <= scroller.clientWidth) return;
    const offset = tab.getBoundingClientRect().left - scroller.getBoundingClientRect().left;
    scroller.scrollTo({ left: scroller.scrollLeft + offset - (scroller.clientWidth - tab.offsetWidth) / 2, behavior: "smooth" });
  }, [index]);

  return (
    <section
      id="aplicaciones"
      className={cn("relative py-20 md:py-28", paused && "aw-apps-paused")}
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center gap-7 px-6 2xl:max-w-[1600px]">
        <div data-reveal className="flex flex-col items-center gap-3 text-center">
          <p className="text-[17px] font-semibold text-primary">Nuestras aplicaciones</p>
          <h2 className="text-[clamp(38px,4.2vw,56px)] font-bold leading-[1.04] tracking-[-0.04em] text-white">Ya está funcionando.</h2>
        </div>

        {/* Selector: la pastilla activa se llena y pasa sola a la siguiente; el cursor sobre la sección la pausa */}
        <div ref={selectorRef} data-reveal className="max-w-full overflow-x-auto [scrollbar-width:none]">
          <div role="tablist" aria-label="Aplicaciones" className="flex w-max gap-1 rounded-full border border-white/8 bg-secondary/15 p-1.5">
            {APPS.map((app, k) => {
              const on = k === index;
              return (
                <button
                  key={app.name}
                  type="button"
                  role="tab"
                  id={`app-tab-${k}`}
                  aria-selected={on}
                  aria-controls="app-stage"
                  onClick={() => go(k)}
                  className={cn("aw-seg relative min-h-10 overflow-hidden rounded-full px-4 text-sm font-semibold text-text-muted md:px-5", on && "is-on")}
                >
                  <span className="relative z-[1]">{app.name}</span>
                  <span
                    aria-hidden="true"
                    className="aw-seg-fill absolute inset-x-0 bottom-0 h-[3px] bg-black/35"
                    onAnimationEnd={() => {
                      if (on) go(k + 1);
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Escena 3D simétrica: una tarjeta al frente y una a cada lado */}
        <div
          id="app-stage"
          data-reveal="zoom"
          role="tabpanel"
          aria-labelledby={`app-tab-${index}`}
          className="relative aspect-[600/470] w-full [perspective:1800px] md:aspect-auto md:h-[470px]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-full w-[min(900px,100%)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(69,255,140,0.16),rgba(69,255,140,0)_70%)]"
          />
          {APPS.map((app, k) => {
            const d = ((k - index + n + 2) % n) - 2;
            const ad = Math.abs(d);
            const front = d === 0;
            return (
              <button
                key={app.name}
                type="button"
                onClick={() => go(k)}
                aria-label={front ? app.name : `Ver ${app.name}`}
                tabIndex={front || ad === 1 ? undefined : -1}
                aria-hidden={ad === 2 || undefined}
                className={cn(
                  "aw-card absolute left-1/2 top-1/2 aspect-[600/430] w-[min(600px,88%)] cursor-pointer overflow-hidden rounded-[28px] border border-white/10 text-left shadow-[0_50px_100px_-30px_rgba(0,0,0,0.95)]",
                  "bg-[#0D0E10] bg-[image:radial-gradient(ellipse_at_50%_80%,rgba(69,255,140,0.14),rgba(13,14,16,0)_60%)]",
                  front ? "is-front" : "is-side",
                  ad === 2 && "pointer-events-none"
                )}
                style={{
                  transform: `translate(-50%, -50%) translateX(${d * 62}%) rotateY(${-d * 38}deg) scale(${1 - ad * 0.12})`,
                  zIndex: 10 - ad,
                  opacity: ad === 2 ? 0 : 1,
                  filter: `brightness(${front ? 1 : 0.45})`,
                }}
              >
                {app.render(front)}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Aplicación anterior"
            className="aw-arrow absolute left-0 top-1/2 z-20 hidden h-13 w-13 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-surface/80 text-text-primary backdrop-blur-md sm:inline-flex lg:left-[6%]"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Aplicación siguiente"
            className="aw-arrow absolute right-0 top-1/2 z-20 hidden h-13 w-13 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-surface/80 text-text-primary backdrop-blur-md sm:inline-flex lg:right-[6%]"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Ficha alineada en tres columnas bajo la tarjeta del frente */}
        <div data-reveal aria-live="polite" className="aw-glass grid w-full max-w-[1000px] rounded-[22px] px-6 py-5 md:px-8">
          {APPS.map((app, k) => {
            const on = k === index;
            return (
              <div
                key={app.name}
                aria-hidden={!on}
                className={cn("aw-info grid items-center gap-x-8 gap-y-3 md:grid-cols-[200px_minmax(0,1fr)_auto]", on && "is-on")}
              >
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[13px] text-[#6E6E73]">0{k + 1} / 0{n}</span>
                  <span className="text-[13px] font-semibold text-primary">{app.kind}</span>
                </div>
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="text-[22px] font-bold tracking-[-0.02em] text-text-primary">{app.name}</span>
                  <span className="text-[15px] leading-snug text-text-muted">{app.desc}</span>
                </div>
                <div className="flex md:justify-end">
                  {app.link && (
                    <a
                      href={app.link.href}
                      target="_blank"
                      rel="noopener"
                      tabIndex={on ? undefined : -1}
                      className="aw-more inline-flex min-h-11 items-center gap-1.5 rounded-full border border-primary/30 px-5 text-sm font-semibold text-primary transition-colors hover:border-primary/50 hover:bg-primary/12"
                    >
                      {app.link.label} <span className="aw-chev">›</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
