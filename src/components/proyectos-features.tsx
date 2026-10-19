"use client";

import * as React from "react";
import { motion, type Variants } from "motion/react";
import { ArrowUpRight, Check, Moon, Sun } from "lucide-react";
import { apps, type AppItem } from "@/data/aplicaciones";
import {
  changeClip,
  clipUrl,
  loadClip,
  sweepImage,
  switchPhase,
  type Mode,
  type Phase,
} from "@/lib/theme-video";
import { cn } from "@/lib/utils";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

/** Las demos arrancan en claro; el tema solo cambia después, ya en el navegador. */
const INITIAL_PHASE: Phase = "claro";
const AUTO_INTERVAL = 10_000;

const posterOf = (app: AppItem, phase: Phase = INITIAL_PHASE) =>
  app.thumb.base ? clipUrl(app.thumb.base, phase, "webp") : app.thumb.src!;

function AppCard({ app, phase }: { app: AppItem; phase: Phase }) {
  const cardRef = React.useRef<HTMLLIElement | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const capRef = React.useRef<HTMLImageElement | null>(null);
  const blurRef = React.useRef<HTMLImageElement | null>(null);
  const [playing, setPlaying] = React.useState(false);

  const clips = app.clips ?? [];
  const hasDemo = Boolean(app.thumb.base);
  const single = clips.length < 2;

  // El video se apunta al primer clip desde el cliente: con preload="none" no descarga nada
  // hasta que la tarjeta se activa.
  React.useEffect(() => {
    const video = videoRef.current;
    if (video && app.thumb.base) loadClip(video, app.thumb.base, INITIAL_PHASE);
  }, [app.thumb.base]);

  // Al cambiar el tema: el clip en reproducción hace el barrido, los pausados solo se reapuntan
  // y su captura cambia con el mismo barrido circular.
  React.useEffect(() => {
    const cap = capRef.current;
    if (!cap || !app.thumb.base) return;
    const video = videoRef.current;
    const base = video?.dataset.base ?? app.thumb.base;
    const src = clipUrl(base, phase, "webp");
    if (blurRef.current) blurRef.current.src = src;
    if (video && !video.paused) {
      switchPhase(video, phase);
      cap.src = src;
      return;
    }
    if (video && video.dataset.phase !== phase) loadClip(video, base, phase);
    if (cap.src.endsWith(src)) return;
    sweepImage(cap, src, phase);
  }, [phase, app.thumb.base]);

  const start = React.useCallback(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  const stop = React.useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    setPlaying(false);
    // Vuelve al primer clip para que la captura de abajo coincida la próxima vez.
    if (!single && video.dataset.base !== clips[0])
      loadClip(video, clips[0], (video.dataset.phase as Phase) ?? phase);
    else video.currentTime = 0;
  }, [clips, single, phase]);

  // En pantallas sin cursor la demo se reproduce mientras la tarjeta cruza el centro.
  React.useEffect(() => {
    const card = cardRef.current;
    if (!card || !hasDemo || !matchMedia("(hover: none)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { rootMargin: "-45% 0px -45% 0px" }
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, [hasDemo, start, stop]);

  const onEnded = () => {
    const video = videoRef.current;
    if (!video || single) return;
    const next = clips[(clips.indexOf(video.dataset.base!) + 1) % clips.length];
    changeClip(video, next, (video.dataset.phase as Phase) ?? phase);
  };

  const media = (
    <div
      className={cn(
        "relative grid place-items-center overflow-hidden border-b border-white/5 bg-[#0c0d0f]",
        app.wide
          ? "h-auto min-h-[340px] md:order-2 md:border-b-0 md:border-l md:border-white/5"
          : "h-[300px]"
      )}
    >
      <img
        ref={blurRef}
        className="absolute -inset-10 h-[calc(100%+80px)] w-[calc(100%+80px)] max-w-none scale-110 object-cover blur-[34px]"
        src={posterOf(app)}
        alt=""
        loading="lazy"
        decoding="async"
      />
      {app.thumb.frame === "phone" ? (
        <div className="relative mt-[34px] h-[330px] w-[170px] self-start overflow-hidden rounded-[30px] bg-gradient-to-br from-[#2b2e33] to-[#131416] p-[7px] shadow-[inset_0_0_0_1px_#3a3e44,0_30px_60px_-20px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:-translate-y-2">
          <img
            ref={capRef}
            className="h-full w-full rounded-3xl object-cover object-top"
            src={posterOf(app)}
            alt={app.thumb.alt}
            loading="lazy"
            decoding="async"
          />
          {hasDemo && (
            <video
              ref={videoRef}
              className={cn(
                "absolute inset-[7px] h-[calc(100%-14px)] w-[calc(100%-14px)] rounded-3xl object-cover object-top transition-opacity duration-300",
                playing ? "opacity-100" : "opacity-0"
              )}
              onPlaying={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEmptied={() => setPlaying(false)}
              onEnded={onEnded}
              muted
              loop={single}
              playsInline
              preload="none"
              aria-hidden="true"
            />
          )}
        </div>
      ) : (
        <div className="relative w-[min(100%-48px,360px)] overflow-hidden rounded-xl bg-[#0d0e10] shadow-[0_0_0_1px_#3a3e44,0_30px_60px_-20px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:-translate-y-2">
          <div
            className="flex items-center gap-1.5 border-b border-[#2a2d31] bg-[#18191c] px-3 py-2 font-mono text-[11px] text-text-muted"
            aria-hidden="true"
          >
            <i className="h-[9px] w-[9px] rounded-full bg-[#ff5f57]" />
            <i className="h-[9px] w-[9px] rounded-full bg-[#febc2e]" />
            <i className="h-[9px] w-[9px] rounded-full bg-[#28c840]" />
            <span className="ml-2 truncate">{app.thumb.domain}</span>
          </div>
          <div className="relative aspect-[16/10]">
            <img
              ref={capRef}
              className="h-full w-full object-cover object-left-top"
              src={posterOf(app)}
              alt={app.thumb.alt}
              loading="lazy"
              decoding="async"
            />
            {hasDemo && (
              <video
                ref={videoRef}
                className={cn(
                  "absolute inset-0 h-full w-full object-cover object-left-top transition-opacity duration-300",
                  playing ? "opacity-100" : "opacity-0"
                )}
                onPlaying={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEmptied={() => setPlaying(false)}
                onEnded={onEnded}
                muted
                loop={single}
                playsInline
                preload="none"
                aria-hidden="true"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <motion.li
      ref={cardRef}
      variants={itemVariants}
      onPointerEnter={(e) => e.pointerType === "mouse" && start()}
      onPointerLeave={(e) => e.pointerType === "mouse" && stop()}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-secondary/10 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] transition-colors duration-300 hover:border-primary/20",
        app.wide && "md:col-span-2 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]"
      )}
    >
      {media}
      <div
        className={cn(
          "flex flex-1 flex-col gap-2.5 px-6 pb-6 pt-5",
          app.wide && "justify-center md:px-8 md:py-10"
        )}
      >
        <p className="font-mono text-xs text-text-dim">
          {app.type} · {app.entity}
        </p>
        <h3 className="text-xl font-bold tracking-tight text-text-primary md:text-[22px]">
          {app.name}
        </h3>
        <p className="text-sm leading-relaxed text-text-muted">
          {app.description}
        </p>
        {app.highlights && (
          <ul className="mt-1 grid gap-1.5 text-sm text-text-muted">
            {app.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2">
                <Check
                  size={16}
                  className="mt-0.5 flex-none text-primary"
                  aria-hidden="true"
                />
                {h}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-auto pt-2 font-mono text-xs text-text-dim">
          {app.keywords.join(" · ")}
        </p>
        {app.url && (
          <a
            href={app.url}
            target="_blank"
            rel="noopener"
            className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary-300"
          >
            {app.urlLabel ?? "Abrir app"}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        )}
      </div>
    </motion.li>
  );
}

function ThemeSwitch({
  mode,
  onChange,
}: {
  mode: Mode;
  onChange: (mode: Mode) => void;
}) {
  const options: { mode: Mode; label: string; icon?: React.ElementType }[] = [
    { mode: "auto", label: "Auto" },
    { mode: "claro", label: "Claro", icon: Sun },
    { mode: "oscuro", label: "Oscuro", icon: Moon },
  ];
  return (
    <div
      role="radiogroup"
      aria-label="Tema de las demostraciones"
      className="inline-flex items-center gap-1 rounded-full border border-white/5 bg-secondary/10 p-1 backdrop-blur-xl"
    >
      {options.map(({ mode: value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={mode === value}
          aria-label={label}
          onClick={() => onChange(value)}
          className={cn(
            "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors",
            mode === value
              ? "bg-primary/10 text-primary"
              : "text-text-muted hover:text-text-primary"
          )}
        >
          {Icon ? <Icon size={16} aria-hidden="true" /> : label}
        </button>
      ))}
    </div>
  );
}

export default function ProyectosFeatures({
  className,
}: {
  className?: string;
}) {
  const [mode, setMode] = React.useState<Mode>("auto");
  const [phase, setPhase] = React.useState<Phase>(INITIAL_PHASE);

  // En Auto el tema de las demos alterna solo; una elección manual la fija.
  React.useEffect(() => {
    if (mode !== "auto") {
      setPhase(mode);
      return;
    }
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setPhase((p) => (p === "claro" ? "oscuro" : "claro"));
    }, AUTO_INTERVAL);
    return () => window.clearInterval(timer);
  }, [mode]);

  return (
    <section
      id="proyectos"
      className={cn("relative overflow-hidden py-24 md:py-32", className)}
    >
      <div className="mx-auto w-full max-w-[1400px] px-6 2xl:max-w-[1600px] min-[2000px]:max-w-[2000px]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            variants={itemVariants}
            className="mb-10 text-center md:mb-16"
            data-reveal
          >
            <h2 className="mx-auto max-w-xl text-3xl font-bold tracking-tighter text-white md:text-4xl lg:text-5xl">
              Nuestras Aplicaciones
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-text-muted md:text-base">
              Soluciones que ya están en producción, diseñadas para resolver
              problemas reales.
            </p>
            <div className="mt-6 flex justify-center">
              <ThemeSwitch mode={mode} onChange={setMode} />
            </div>
          </motion.div>

          <motion.ul
            variants={itemVariants}
            className="grid list-none grid-cols-1 gap-5 md:grid-cols-2"
          >
            {apps.map((app) => (
              <AppCard key={app.slug} app={app} phase={phase} />
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}
