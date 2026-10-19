"use client";

import type { ReactNode } from "react";
import { AutoVideo } from "@/components/ui/auto-video";
import { cn } from "@/lib/utils";

/** Cada demo existe como `${base}.mp4` con su póster `${base}.webp`. */
const media = (base: string) => ({ src: `${base}.mp4`, poster: `${base}.webp` });

function BrowserFrame({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "aw-shot overflow-hidden rounded-[22px] border border-white/8 bg-[#0D0E10] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)]",
        className
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-[#2A2D31] bg-[#18191C] px-3.5 py-2.5">
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        <span className="ml-2.5 truncate font-mono text-[11px] text-text-muted">{label}</span>
      </div>
      {children}
    </div>
  );
}

function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-[32px] bg-gradient-to-br from-[#2B2E33] to-[#131416] p-1.5 shadow-[inset_0_0_0_1px_#3A3E44,0_40px_80px_-20px_rgba(0,0,0,0.9)]",
        className
      )}
    >
      {children}
    </div>
  );
}

function AppText({
  kind,
  title,
  children,
  link,
}: {
  kind: string;
  title: string;
  children: ReactNode;
  link?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[15px] font-semibold text-primary">{kind}</p>
      <h3 className="text-[clamp(30px,3vw,44px)] font-bold leading-[1.08] tracking-[-0.035em] text-text-primary">{title}</h3>
      {children}
      {link && (
        <a href={link.href} target="_blank" rel="noopener" className="aw-more inline-flex min-h-11 w-fit items-center gap-1 text-[17px] text-primary">
          {link.label} <span className="aw-chev">›</span>
        </a>
      )}
    </div>
  );
}

export default function AplicacionesSection() {
  return (
    <section id="aplicaciones" className="relative py-24 md:py-32">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-24 px-6 md:gap-32">
        <div className="flex flex-col items-center gap-4 text-center">
          <p data-reveal className="text-[17px] font-semibold text-primary">Nuestras aplicaciones</p>
          <h2 data-reveal className="text-[clamp(38px,4.6vw,64px)] font-bold leading-[1.06] tracking-[-0.04em] text-white">
            Ya está funcionando.
          </h2>
          <p data-reveal className="max-w-[560px] text-lg leading-relaxed text-text-muted">
            Cinco productos propios en producción, resolviendo problemas reales todos los días.
          </p>
          <span data-reveal aria-hidden="true" className="mt-2 h-0.5 w-28 rounded-full bg-primary" />
        </div>

        {/* 1 · Accesos y casino */}
        <div className="aw-row grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <div data-reveal="left">
            <AppText kind="Web + API + apps móviles" title="Accesos y casino, en tiempo real.">
              <p className="text-lg leading-relaxed text-text-muted">
                Personas, vehículos, pasajeros y raciones validados desde la web y desde terreno, incluso sin conexión.
              </p>
              <ul className="mt-1 flex flex-col gap-2.5 text-base text-[#D2D2D7]">
                <li className="flex items-start gap-2.5">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-primary" />
                  Un solo motor de validación para web y móvil
                </li>
                <li className="flex items-start gap-2.5">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-primary" />
                  Reportes filtrables, Excel y feed para Power BI
                </li>
              </ul>
            </AppText>
          </div>
          <div data-reveal="right" className="relative pb-10 lg:pl-6">
            <BrowserFrame label="Plataforma de accesos y casino" className="aw-lift">
              <AutoVideo
                {...media("/media/control-acceso/ficha-oscuro")}
                label="Demo: consulta de ficha, estado de acceso y bloqueos"
                className="block aspect-video w-full object-cover object-left-top"
              />
            </BrowserFrame>
            <BrowserFrame label="Reportes" className="aw-float absolute -left-2 bottom-0 w-[46%] rounded-[14px] sm:-left-6">
              <AutoVideo
                {...media("/media/control-acceso/reportes-oscuro")}
                label="Demo: reportes con exportación a Excel"
                className="block aspect-video w-full object-cover object-left-top"
              />
            </BrowserFrame>
          </div>
        </div>

        {/* 2 · Kuentas Klaras */}
        <div className="aw-row grid items-center gap-14 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div
            data-reveal="left"
            className="order-2 flex justify-center gap-5 rounded-[22px] bg-[radial-gradient(ellipse_at_50%_60%,rgba(69,255,140,0.14),rgba(31,31,31,0)_65%)] py-10 sm:gap-7 lg:order-1"
          >
            <div className="aw-lift w-[42%] max-w-[200px]">
              <PhoneFrame className="aw-float">
                <AutoVideo
                  {...media("/media/gastos/cuotas-oscuro")}
                  label="Demo de Kuentas Klaras: cuotas pendientes"
                  className="block aspect-[1080/2338] w-full rounded-[26px] object-cover"
                />
              </PhoneFrame>
            </div>
            <div className="aw-lift mt-14 w-[42%] max-w-[200px]">
              <PhoneFrame className="aw-float-2">
                <AutoVideo
                  {...media("/media/gastos/resumen-oscuro")}
                  label="Demo de Kuentas Klaras: resumen del mes"
                  className="block aspect-[1080/2338] w-full rounded-[26px] object-cover"
                />
              </PhoneFrame>
            </div>
          </div>
          <div data-reveal="right" className="order-1 lg:order-2">
            <AppText
              kind="App web instalable (PWA)"
              title="Kuentas Klaras. Tus finanzas, claras."
              link={{ href: "https://gastos.adaptaweb.cl/", label: "Abrir app" }}
            >
              <p className="text-lg leading-relaxed text-text-muted">
                Gastos por categoría y tarjeta, cuotas, suscripciones y ahorro, con bancos chilenos y sugerencias con IA.
              </p>
            </AppText>
          </div>
        </div>

        {/* 3 · Ideas Blueprint */}
        <div className="aw-row grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <div data-reveal="left">
            <AppText
              kind="Plataforma web"
              title="Ideas Blueprint. De la idea a la mejora."
              link={{ href: "https://ideas.adaptaweb.cl/", label: "Visitar sitio" }}
            >
              <p className="text-lg leading-relaxed text-text-muted">
                Kanban con prioridades, taller visual sobre capturas y modo presentación para tu comité.
              </p>
            </AppText>
          </div>
          <div data-reveal="right" className="relative pb-12 lg:pr-6">
            <BrowserFrame label="ideas.adaptaweb.cl" className="aw-lift">
              <AutoVideo
                {...media("/media/ideas/tablero-oscuro")}
                label="Demo de Ideas Blueprint: tablero de ideas"
                className="block aspect-[16/10] w-full object-cover object-left-top"
              />
            </BrowserFrame>
            <BrowserFrame label="Taller visual" className="aw-float-2 absolute -right-2 bottom-0 w-[44%] rounded-[14px] sm:-right-6">
              <AutoVideo
                {...media("/media/ideas/taller-oscuro")}
                label="Demo de Ideas Blueprint: taller visual"
                className="block aspect-[16/10] w-full object-cover object-left-top"
              />
            </BrowserFrame>
          </div>
        </div>

        {/* 4 y 5 · KeComo y Bank Craft */}
        <div className="grid gap-5 md:grid-cols-2">
          <article data-reveal className="aw-tile aw-glass flex overflow-hidden rounded-[28px]">
            <div className="flex flex-1 flex-col justify-center gap-2.5 p-8">
              <p className="text-[13px] font-semibold text-primary">App móvil</p>
              <h3 className="text-[26px] font-bold tracking-[-0.025em] text-text-primary">KeComo</h3>
              <p className="text-[15px] leading-relaxed text-text-muted">
                Registra lo que comes, detecta posibles alérgenos y lleva un reporte PDF a la consulta.
              </p>
            </div>
            <div className="flex w-[42%] max-w-[190px] flex-none justify-center bg-[#0C0D0F] px-4 pt-7">
              <div className="w-full overflow-hidden rounded-t-[22px] border-[5px] border-b-0 border-[#2B2E33]">
                <AutoVideo
                  {...media("/media/kecomo/app-oscuro")}
                  label="Demo de KeComo: registro de comidas del día"
                  className="block aspect-[1080/1700] w-full object-cover object-top"
                />
              </div>
            </div>
          </article>
          <article data-reveal className="aw-tile aw-glass group flex flex-col overflow-hidden rounded-[28px] sm:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-2.5 p-8">
              <p className="text-[13px] font-semibold text-primary">App web + IoT</p>
              <h3 className="text-[26px] font-bold tracking-[-0.025em] text-text-primary">Bank Craft</h3>
              <p className="text-[15px] leading-relaxed text-text-muted">
                Tareas del hogar gamificadas al estilo Minecraft: se aprueban por Telegram y Home Assistant reacciona en casa.
              </p>
            </div>
            <div className="min-h-[220px] flex-1 overflow-hidden bg-[#0C0D0F]">
              <img
                src="/media/thumbs/bank-craft.webp"
                alt="Bank Craft: misiones del día"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
