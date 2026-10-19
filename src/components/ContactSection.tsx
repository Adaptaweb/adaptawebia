"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Info } from "lucide-react";
import TurnstileWidget from "@/components/ui/turnstile-widget";

const smoothEase = [0.25, 0.1, 0.25, 1] as const;

// Misma dirección que usaba el formulario del hero.
const CONTACT_EMAIL = { label: "hola@adaptaweb.cl", href: "mailto:<anything>@narauprena.resend.app" };

type Errors = { name?: string; email?: string; message?: string };

const fieldClass =
  "w-full rounded-[14px] border border-white/12 bg-black/25 px-4 text-base text-text-primary outline-none transition-all duration-200 placeholder:text-text-dim focus:border-primary/60 focus:ring-4 focus:ring-primary/12";
const labelClass = "text-[13px] font-medium text-text-muted";

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [formData, setFormData] = useState({ name: "", company: "", email: "", message: "" });

  const validate = () => {
    const errs: Errors = {};
    if (!formData.name.trim()) errs.name = "El nombre es obligatorio";
    if (!formData.email.trim()) errs.email = "El email es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Email inválido";
    if (!formData.message.trim()) errs.message = "El mensaje es obligatorio";
    return errs;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    if (!turnstileToken) {
      setSubmitError("Por favor completa la verificación de seguridad");
      return;
    }
    setErrors({});
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, turnstileToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "Error al enviar el formulario");
        setIsSubmitting(false);
        return;
      }
      setSubmitted(true);
      setFormData({ name: "", company: "", email: "", message: "" });
      setTurnstileToken(null);
    } catch {
      setSubmitError("Error de conexión. Intenta de nuevo.");
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (!submitted) return;
    const timer = setTimeout(() => setSubmitted(false), 10000);
    return () => clearTimeout(timer);
  }, [submitted]);

  const update = (key: keyof typeof formData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (key in errors) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  return (
    <section id="contacto" className="relative px-6 py-28 text-center md:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-28 h-[500px] w-[900px] max-w-full -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(69,255,140,0.2),rgba(69,255,140,0)_70%)] blur-3xl"
      />
      <div className="relative mx-auto flex max-w-[760px] flex-col items-center gap-5">
        <h2
          data-reveal="zoom"
          className="text-[clamp(64px,10vw,148px)] font-bold leading-[0.95] tracking-[-0.06em]"
        >
          <span className="aw-shine">Hablemos.</span>
        </h2>
        <p data-reveal className="max-w-[520px] text-lg leading-relaxed text-text-muted md:text-xl">
          Cuéntanos tu proyecto o solicita soporte. Respondemos en menos de 24 horas.
        </p>

        <div data-reveal className="aw-glass mt-4 w-full rounded-[28px] p-6 text-left sm:p-8">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: smoothEase }}
                className="flex flex-col items-center justify-center gap-4 py-10 text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <svg className="h-7 w-7 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Mensaje enviado</h3>
                <p className="max-w-md text-sm text-text-muted">
                  Gracias por contactarnos. Nuestro equipo revisará la solicitud y te contactaremos a la brevedad dentro de
                  nuestro horario de atención.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                noValidate
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: smoothEase }}
                className="flex flex-col gap-4"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contacto-nombre" className={labelClass}>Nombre</label>
                    <input
                      id="contacto-nombre"
                      type="text"
                      autoComplete="name"
                      placeholder="Tu nombre"
                      value={formData.name}
                      onChange={(e) => update("name")(e.target.value)}
                      aria-invalid={!!errors.name}
                      className={`${fieldClass} min-h-[50px]`}
                    />
                    {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contacto-empresa" className={labelClass}>Empresa</label>
                    <input
                      id="contacto-empresa"
                      type="text"
                      autoComplete="organization"
                      placeholder="Opcional"
                      value={formData.company}
                      onChange={(e) => update("company")(e.target.value)}
                      className={`${fieldClass} min-h-[50px]`}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="contacto-email" className={labelClass}>Email</label>
                  <input
                    id="contacto-email"
                    type="email"
                    autoComplete="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => update("email")(e.target.value)}
                    aria-invalid={!!errors.email}
                    className={`${fieldClass} min-h-[50px]`}
                  />
                  {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="contacto-mensaje" className={`${labelClass} flex items-center gap-1.5`}>
                    Mensaje
                    <span className="group relative inline-flex">
                      <Info className="h-3.5 w-3.5 shrink-0 cursor-help text-text-muted transition-colors hover:text-primary" aria-hidden="true" />
                      <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-72 -translate-x-1/2 rounded-xl border border-white/10 bg-surface p-4 text-xs text-text-muted opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100">
                        Al usar el formulario de contacto, usted está dando su consentimiento a AdaptaWeb para que le contacte y
                        resuelva sus requerimientos.
                      </span>
                    </span>
                  </label>
                  <textarea
                    id="contacto-mensaje"
                    rows={4}
                    placeholder="Cuéntanos sobre tu proyecto…"
                    value={formData.message}
                    onChange={(e) => update("message")(e.target.value)}
                    aria-invalid={!!errors.message}
                    className={`${fieldClass} resize-none py-3.5`}
                  />
                  {errors.message && <p className="text-xs text-red-400">{errors.message}</p>}
                </div>

                <div className="flex flex-col items-center gap-3">
                  {submitError && <p className="max-w-xs text-center text-xs text-red-400">{submitError}</p>}
                  <TurnstileWidget
                    onVerify={(token) => {
                      setTurnstileToken(token);
                      if (submitError) setSubmitError(null);
                    }}
                    onError={() => setSubmitError("Error al cargar la verificación de seguridad")}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3.5">
                  <a href={CONTACT_EMAIL.href} className="text-[15px] text-primary">
                    {CONTACT_EMAIL.label}
                  </a>
                  <button
                    type="submit"
                    disabled={isSubmitting || !turnstileToken}
                    className="aw-btn group inline-flex min-h-13 items-center gap-2 rounded-full bg-primary px-8 text-base font-semibold text-[#0B0B0C] shadow-[0_10px_40px_-10px_rgba(69,255,140,0.6)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Enviar mensaje
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                      </>
                    )}
                  </button>
                </div>
                <p className="text-center text-[11px] text-text-dim">
                  Protegido por Cloudflare Turnstile.{" "}
                  <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="underline hover:text-text-muted">
                    Privacidad
                  </a>
                  {" · "}
                  <a href="https://www.cloudflare.com/website-terms/" target="_blank" rel="noopener noreferrer" className="underline hover:text-text-muted">
                    Términos
                  </a>
                  .
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
