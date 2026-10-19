"use client";

import { useEffect, useRef } from "react";

const RAD = Math.PI / 180;
const TILT = -0.38;

type Node = { lat: number; lon: number; phase: number };
type Arc = { a: Node; b: Node; t: number };

/**
 * Globo ortográfico de alambre que gira: meridianos y paralelos, puntos que laten en la cara
 * visible y arcos que se trazan entre ellos. Se ajusta al tamaño de su contenedor y solo anima
 * mientras está en pantalla.
 */
export function NetworkGlobe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes: Node[] = Array.from({ length: 70 }, () => ({
      lat: (Math.random() * 130 - 65) * RAD,
      lon: Math.random() * Math.PI * 2,
      phase: Math.random() * Math.PI * 2,
    }));
    const pick = () => nodes[Math.floor(Math.random() * nodes.length)];
    const newArc = (t = 0): Arc => ({ a: pick(), b: pick(), t });
    const arcs: Arc[] = Array.from({ length: 9 }, () => newArc(-Math.random() * 1.2));

    let size = 0;
    let rot = 0;
    let time = 0;
    let raf = 0;
    let visible = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = canvas.clientWidth;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const project = (lat: number, lon: number): [number, number, number] => {
      const l = lon + rot;
      const x = Math.cos(lat) * Math.sin(l);
      const y = Math.sin(lat);
      const z = Math.cos(lat) * Math.cos(l);
      return [x, y * Math.cos(TILT) - z * Math.sin(TILT), y * Math.sin(TILT) + z * Math.cos(TILT)];
    };

    const draw = () => {
      const C = size / 2;
      const R = size * 0.41;
      ctx.clearRect(0, 0, size, size);
      ctx.lineWidth = 1;

      // Contorno con brillo
      ctx.strokeStyle = "rgba(69,255,140,0.45)";
      ctx.shadowColor = "rgba(69,255,140,0.5)";
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(C, C, R, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Meridianos y paralelos: la cara visible en verde, la de atrás apenas insinuada
      const line = (points: [number, number, number][]) => {
        for (let i = 1; i < points.length; i++) {
          const p = points[i - 1];
          const q = points[i];
          ctx.strokeStyle = (p[2] + q[2]) / 2 > 0 ? "rgba(69,255,140,0.28)" : "rgba(245,245,247,0.05)";
          ctx.beginPath();
          ctx.moveTo(C + p[0] * R, C - p[1] * R);
          ctx.lineTo(C + q[0] * R, C - q[1] * R);
          ctx.stroke();
        }
      };
      for (let lon = 0; lon < 360; lon += 20) {
        const points: [number, number, number][] = [];
        for (let lat = -90; lat <= 90; lat += 4) points.push(project(lat * RAD, lon * RAD));
        line(points);
      }
      for (let lat = -60; lat <= 60; lat += 20) {
        const points: [number, number, number][] = [];
        for (let lon = 0; lon <= 360; lon += 4) points.push(project(lat * RAD, lon * RAD));
        line(points);
      }

      for (const n of nodes) {
        const p = project(n.lat, n.lon);
        if (p[2] <= 0) continue;
        const pulse = 0.5 + 0.5 * Math.sin(time * 2 + n.phase);
        ctx.fillStyle = `rgba(69,255,140,${0.35 + 0.55 * p[2]})`;
        ctx.beginPath();
        ctx.arc(C + p[0] * R, C - p[1] * R, 1.6 + pulse * 1.6 * p[2], 0, Math.PI * 2);
        ctx.fill();
      }

      // Arcos que se trazan por encima de la superficie y se desvanecen
      for (let i = 0; i < arcs.length; i++) {
        const arc = arcs[i];
        if (!still) arc.t += 0.008;
        if (arc.t > 1.6) {
          arcs[i] = newArc();
          continue;
        }
        if (arc.t <= 0) continue;
        const p = project(arc.a.lat, arc.a.lon);
        const q = project(arc.b.lat, arc.b.lon);
        if (p[2] < 0 || q[2] < 0) continue;
        const mx = (p[0] + q[0]) / 2;
        const my = (p[1] + q[1]) / 2;
        const mz = (p[2] + q[2]) / 2;
        const len = Math.hypot(mx, my, mz) || 1;
        const lift = 1 + Math.hypot(p[0] - q[0], p[1] - q[1]) * 0.45;
        const cx = C + (mx / len) * lift * R;
        const cy = C - (my / len) * lift * R;
        const end = Math.min(arc.t, 1);
        const alpha = arc.t > 1 ? 1 - (arc.t - 1) / 0.6 : 1;
        const x0 = C + p[0] * R;
        const y0 = C - p[1] * R;
        const x2 = C + q[0] * R;
        const y2 = C - q[1] * R;
        ctx.strokeStyle = `rgba(69,255,140,${0.85 * alpha})`;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        for (let s = 1; s <= 24; s++) {
          const u = (s / 24) * end;
          const k = 1 - u;
          ctx.lineTo(k * k * x0 + 2 * k * u * cx + u * u * x2, k * k * y0 + 2 * k * u * cy + u * u * y2);
        }
        ctx.stroke();
        ctx.lineWidth = 1;
      }
    };

    const frame = () => {
      rot += 0.0025;
      time += 0.016;
      draw();
      if (visible) raf = requestAnimationFrame(frame);
    };

    resize();
    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (still) draw();
    });
    resizeObserver.observe(canvas);

    if (still) {
      arcs.forEach((arc) => (arc.t = 0.8));
      draw();
      return () => resizeObserver.disconnect();
    }

    const visibility = new IntersectionObserver(([entry]) => {
      const wasVisible = visible;
      visible = entry.isIntersecting;
      if (visible && !wasVisible) raf = requestAnimationFrame(frame);
      if (!visible) cancelAnimationFrame(raf);
    });
    visibility.observe(canvas);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visibility.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Globo terráqueo de alambre con conexiones entre puntos"
      className={className}
    />
  );
}
