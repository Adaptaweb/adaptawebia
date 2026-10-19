"use client";

import type { CSSProperties, ElementType } from "react";
import { Check, CreditCard, FileText, Landmark, Sparkles, Truck } from "lucide-react";
import { NetworkGlobe } from "@/components/ui/network-globe";

const delay = (seconds: number): CSSProperties => ({ animationDelay: `${seconds}s` });

/** Integraciones que el visitante reconoce: rotan dentro de la tarjeta, una a la vez. */
const INTEGRATIONS: { icon: ElementType; name: string; status: string }[] = [
  { icon: CreditCard, name: "Webpay", status: "Pago aprobado" },
  { icon: FileText, name: "SII", status: "Boleta electrónica emitida" },
  { icon: Truck, name: "Chilexpress", status: "Envío en camino" },
  { icon: Landmark, name: "Tu banco", status: "Transferencia recibida" },
];

export default function HeroSection() {
  // La primera integración se repite al final para que la rotación vuelva al inicio sin salto.
  const integrations = [...INTEGRATIONS, INTEGRATIONS[0]];

  return (
    <section id="hero" className="relative flex min-h-[100dvh] items-center overflow-hidden pb-16 pt-28">
      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-12 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-6 2xl:max-w-[1600px]">
        {/* Texto */}
        <div data-parallax="-60" className="flex flex-col items-start gap-6">
          <span
            className="aw-rise inline-flex items-center gap-2.5 rounded-full border border-white/8 bg-secondary/15 px-4 py-2 text-sm text-[#D2D2D7]"
            style={delay(0.1)}
          >
            <span aria-hidden="true" className="aw-dot h-2 w-2 rounded-full bg-primary" />
            Desarrollo inteligente con IA
          </span>

          <h1
            className="aw-rise m-0 text-5xl font-bold leading-[1.04] tracking-[-0.045em] sm:text-6xl lg:text-[clamp(52px,5vw,76px)]"
            style={delay(0.22)}
          >
            <span className="aw-shine block">Creamos aplicaciones</span>
            <span className="aw-flip text-primary">
              <span>
                <span>inteligentes.</span>
                <span>rápidas.</span>
                <span>modernas.</span>
                <span>autónomas.</span>
                <span aria-hidden="true">inteligentes.</span>
              </span>
            </span>
          </h1>

          <p className="aw-rise m-0 max-w-[32rem] text-lg leading-relaxed text-text-muted md:text-xl" style={delay(0.34)}>
            Apps móviles y plataformas web que se adaptan en tiempo real al comportamiento de tus usuarios y a los
            datos de tu negocio.
          </p>

          <div className="aw-rise flex flex-wrap items-center gap-x-7 gap-y-3" style={delay(0.46)}>
            <a
              href="#contacto"
              className="aw-btn inline-flex min-h-13 items-center rounded-full bg-primary px-7 text-[17px] font-semibold text-[#0B0B0C] shadow-[0_10px_40px_-10px_rgba(69,255,140,0.6)]"
            >
              Conversemos tu proyecto
            </a>
            <a href="#aplicaciones" className="aw-more inline-flex min-h-11 items-center gap-1 text-[17px] text-primary">
              Ver aplicaciones <span className="aw-chev">›</span>
            </a>
          </div>
        </div>

        {/* Globo con las piezas en órbita */}
        <div data-parallax="40" className="relative mx-auto aspect-square w-full max-w-[680px]">
          <div aria-hidden="true" className="aw-halo absolute inset-[4%] rounded-full bg-[radial-gradient(closest-side,rgba(69,255,140,0.18),rgba(69,255,140,0)_72%)]" />
          <div aria-hidden="true" className="aw-ring absolute inset-[8%] rounded-full border border-dashed border-primary/20" />
          <div aria-hidden="true" className="aw-ring-reverse absolute inset-[1%] rounded-full border border-white/5" />
          <div className="aw-globe-in absolute inset-[13%]">
            <NetworkGlobe className="h-full w-full" />
          </div>

          {/* Integraciones con servicios chilenos */}
          <div className="aw-pop absolute left-0 top-[4%] w-[min(290px,56%)]" style={delay(0.9)}>
            <div className="aw-float aw-widget px-5 py-4">
              <p className="mb-3 text-[13px] text-text-muted">Conectado con tus servicios</p>
              <div className="h-12 overflow-hidden" aria-live="off">
                <div className="aw-roll">
                  {integrations.map(({ icon: Icon, name, status }, i) => (
                    <div key={i} className="flex h-12 items-center gap-3" aria-hidden={i === integrations.length - 1 || undefined}>
                      <span className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-[10px] bg-primary/12 text-primary">
                        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                      </span>
                      <span className="flex min-w-0 flex-col">
                        <span className="text-[15px] font-semibold">{name}</span>
                        <span className="truncate text-xs text-primary">{status}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Asistente con IA */}
          <div className="aw-pop absolute right-0 top-[2%] hidden w-[min(270px,46%)] sm:block" style={delay(1.1)}>
            <div className="aw-float-2 aw-widget flex min-h-[190px] flex-col gap-2.5 p-[18px]">
              <p className="flex items-center gap-2 text-[13px] text-text-muted">
                <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                Asistente con IA
              </p>
              <span className="aw-msg1 max-w-[85%] self-end rounded-[16px_16px_4px_16px] bg-primary px-3 py-2 text-sm text-[#0B0B0C]">
                ¿Qué puedo automatizar?
              </span>
              <span aria-hidden="true" className="aw-typing inline-flex gap-1.5 self-start rounded-[16px_16px_16px_4px] bg-white/8 px-3.5 py-3">
                <i />
                <i style={delay(0.15)} />
                <i style={delay(0.3)} />
              </span>
              <span className="aw-msg2 -mt-10 max-w-[90%] self-start rounded-[16px_16px_16px_4px] bg-white/8 px-3 py-2 text-sm leading-snug">
                Detecté 3 procesos repetitivos que una app puede resolver.
              </span>
            </div>
          </div>

          {/* Aviso al cliente */}
          <div className="aw-pop absolute -left-[2%] top-[47%]" style={delay(1.3)}>
            <div className="aw-toast">
              <div className="aw-float-3 aw-widget flex items-center gap-3 bg-[rgba(40,40,42,0.92)]! px-4 py-3">
                <span className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-[10px] bg-primary text-[#0B0B0C]">
                  <Check className="h-4 w-4" strokeWidth={2.6} aria-hidden="true" />
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-semibold">Pedido confirmado</span>
                  <span className="text-xs text-text-muted">Tu cliente recibió el aviso</span>
                </span>
              </div>
            </div>
          </div>

          {/* Datos en tiempo real */}
          <div className="aw-pop absolute bottom-[14%] right-[1%] hidden w-[min(230px,40%)] sm:block" style={delay(1.5)}>
            <div className="aw-float aw-widget px-5 py-[18px]">
              <p className="mb-1 text-[13px] text-text-muted">Dashboard</p>
              <p className="mb-3.5 text-base font-semibold">Datos en tiempo real</p>
              <div aria-hidden="true" className="flex h-[90px] items-end gap-2">
                <span className="aw-bar h-[60%] flex-1 rounded bg-primary/35" />
                <span className="aw-bar h-[85%] flex-1 rounded bg-primary/50" style={delay(0.3)} />
                <span className="aw-bar h-full flex-1 rounded bg-primary" style={delay(0.6)} />
                <span className="aw-bar h-[70%] flex-1 rounded bg-primary/50" style={delay(0.9)} />
                <span className="aw-bar h-[90%] flex-1 rounded bg-primary/35" style={delay(1.2)} />
              </div>
            </div>
          </div>

          {/* Funciona sin conexión */}
          <div className="aw-pop absolute bottom-[3%] left-[6%] hidden w-[min(260px,46%)] sm:block" style={delay(1.7)}>
            <div className="aw-float-2 aw-widget flex flex-col gap-3 px-5 py-[18px]">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold">Modo sin conexión</span>
                <span aria-hidden="true" className="aw-track relative inline-block h-[26px] w-12 rounded-full bg-white/14">
                  <span className="aw-knob absolute left-[3px] top-[3px] h-5 w-5 rounded-full bg-text-primary shadow-[0_2px_6px_rgba(0,0,0,0.4)]" />
                </span>
              </div>
              <div className="relative h-5 text-[13px]">
                <span className="aw-fade-a absolute left-0 top-0 text-text-muted">En línea · sincronizado</span>
                <span className="aw-fade-b absolute left-0 top-0 text-primary">Guardando en el equipo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
