'use client';

import * as React from 'react';
import { useState, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ContainerTextFlip } from '@/components/modern-animated-multi-words';
import { Button } from '@/components/ui/button';
import { SeparatorPro } from '@/components/ui/seperatorpro';
import GlobeWireframe from '@/components/ui/globe-wireframe';
import { ArrowRight, Mail, Info } from 'lucide-react';

const smoothEase = [0.25, 0.1, 0.25, 1] as const;

const CONTACT_LINKS = [
  { icon: Mail, label: 'hola@adaptaweb.cl', href: 'mailto:<anything>@narauprena.resend.app' },
];

export default function HeroContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    message: '',
  });

  const validate = () => {
    const errs: { name?: string; email?: string; message?: string } = {};
    if (!formData.name.trim()) errs.name = 'El nombre es obligatorio';
    if (!formData.email.trim()) errs.email = 'El email es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = 'Email inválido';
    if (!formData.message.trim()) errs.message = 'El mensaje es obligatorio';
    return errs;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    console.log('Form submitted:', formData);
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', company: '', email: '', message: '' });
  };

  useEffect(() => {
    if (!submitted) return;
    const timer = setTimeout(() => setSubmitted(false), 10000);
    return () => clearTimeout(timer);
  }, [submitted]);

  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] items-center overflow-hidden pb-16 pt-24"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 2xl:max-w-[1600px] min-[2000px]:max-w-[2000px]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-20">
          {/* LEFT: Hero Text */}
          <div className="flex flex-col justify-center pt-8 lg:pt-16">
            <h1 className="max-w-[6em] text-5xl font-bold leading-none tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl" data-reveal>
              <span className="lustre-hero">Creamos Aplicaciones</span>
              <br />
              <ContainerTextFlip
                words={['Inteligentes', 'Rápidas', 'Modernas', 'Autónomas']}
                interval={5000}
                animationDuration={100}
                variant="glass"
                textClassName="text-primary text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tighter"
              />
            </h1>
            <p class="mt-8 text-base md:text-lg text-text-muted max-w-[65ch] leading-relaxed" data-reveal>
      En AdaptaWeb nacimos creando sitios que se adaptaban a las pantallas (Responsive).
      Hoy, el software ha evolucionado. Creamos aplicaciones móviles y plataformas web que,
      gracias a la Inteligencia Artificial y a patrones de diseño modernos, se adaptan en
      tiempo real al comportamiento de los usuarios y a los datos del negocio.
    </p>
          </div>

          {/* RIGHT: Contact Section */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left sub-col: Hablemos + Globe */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, delay: 0.2, ease: smoothEase }}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-secondary/10 p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-semibold text-white">Hablemos</h3>
                  <p className="max-w-xs text-sm leading-relaxed text-text-muted">
                    Escríbenos por cualquier canal. Respondemos en menos de 24
                    horas.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {CONTACT_LINKS.map(({ icon: Icon, label, href }, i) => (
                    <motion.a
                      key={label}
                      href={href}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.5,
                        delay: 0.3 + i * 0.1,
                        ease: smoothEase,
                      }}
                      className="group flex w-fit items-center gap-3 text-sm text-text-muted transition-colors duration-200 hover:text-white"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-secondary transition-all duration-200 group-hover:border-primary/40 group-hover:bg-primary/10">
                        <Icon className="h-3.5 w-3.5 text-text-muted transition-colors duration-200 group-hover:text-primary" />
                      </div>
                      {label}
                    </motion.a>
                  ))}
                </div>
              </div>

              <div className="relative h-52 overflow-hidden">
                <GlobeWireframe
                  className="absolute left-0 top-0 aspect-square w-full max-w-full"
                  variant="wireframesolid"
                  autoRotate
                  autoRotateSpeed={0.45}
                  strokeWidth={0.6}
                  graticuleOpacity={0.12}
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-surface to-transparent" />
              </div>
            </motion.div>

            {/* Right sub-col: Form */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, delay: 0.35, ease: smoothEase }}
              className="flex flex-col gap-5 rounded-2xl border border-white/5 bg-secondary/10 p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-xl sm:p-8"
            >
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, ease: smoothEase }}
                    className="flex flex-col items-center justify-center gap-4 py-8 text-center"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <svg
                        className="h-7 w-7 text-primary"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      Mensaje enviado
                    </h3>
                    <p className="text-sm text-text-muted">
                      Gracias por contactarnos. Te responderemos pronto.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: smoothEase }}
                  >
                    <div>
                      <h3 className="mb-0.5 text-lg font-semibold text-white">
                        Conversemos sobre tu proyecto
                      </h3>
                      <p className="text-sm text-text-muted">
                        Cuéntanos sobre tu proyecto o solicita soporte. Nuestro equipo te contactará a la brevedad.
                      </p>
                    </div>

                    <SeparatorPro variant="dots" />

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                            Nombre
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Tu nombre"
                            value={formData.name}
                            onChange={(e) => {
                              setFormData({ ...formData, name: e.target.value });
                              if (errors.name) setErrors({ ...errors, name: undefined });
                            }}
                            className="w-full rounded-xl border border-white/10 bg-transparent px-4 py-2.5 text-sm text-white outline-none placeholder:text-text-dim transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                          />
                          {errors.name && (
                            <p className="text-xs text-red-400">{errors.name}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                            Empresa{' '}
                            
                          </label>
                          <input
                            type="text"
                            placeholder="Opcional"
                            value={formData.company}
                            onChange={(e) =>
                              setFormData({ ...formData, company: e.target.value })
                            }
                            className="w-full rounded-xl border border-white/10 bg-transparent px-4 py-2.5 text-sm text-white outline-none placeholder:text-text-dim transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="tu@email.com"
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (errors.email) setErrors({ ...errors, email: undefined });
                          }}
                          className="w-full rounded-xl border border-white/10 bg-transparent px-4 py-2.5 text-sm text-white outline-none placeholder:text-text-dim transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                        {errors.email && (
                          <p className="text-xs text-red-400">{errors.email}</p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold  tracking-widest text-text-muted flex items-center gap-1.5">
                          <p className='uppercase'>Mensaje</p>
                          <span className="relative group inline-flex">
                            <Info className="w-3.5 h-3.5 text-text-muted hover:text-primary transition-colors cursor-help shrink-0" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 rounded-xl border border-white/10 bg-surface p-4 text-xs text-text-muted shadow-lg backdrop-blur-xl z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200">
                              <div className="flex items-center gap-1.5 mb-2">
                                <Info className="w-3.5 h-3.5 text-primary shrink-0" />
                                <span className="text-xs font-semibold text-white">Consentimiento</span>
                              </div>
                              <p>
                                Al usar el formulario de contacto, usted está dando su consentimiento a AdaptaWeb para que le contacte y resuelva sus requerimientos.
                              </p>
                            </div>
                          </span>
                        </label>
                        <textarea
                          required
                          placeholder="Cuéntanos sobre tu proyecto..."
                          rows={4}
                          value={formData.message}
                          onChange={(e) => {
                            setFormData({ ...formData, message: e.target.value });
                            if (errors.message) setErrors({ ...errors, message: undefined });
                          }}
                          className="w-full resize-none rounded-xl border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-text-dim transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                        {errors.message && (
                          <p className="text-xs text-red-400">{errors.message}</p>
                        )}
                      </div>

                      <div className="flex flex-col items-center gap-3">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="h-11 w-fit rounded-xl bg-primary px-8 text-sm font-semibold text-surface hover:bg-primary/90 disabled:opacity-50 group"
                        >
                          {isSubmitting ? (
                            <span className="flex items-center gap-2">
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-surface/30 border-t-surface" />
                              Enviando...
                            </span>
                          ) : (
                            <>
                              Enviar Mensaje
                              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                            </>
                          )}
                        </Button>
                        <p className="text-[10px] text-text-dim text-center max-w-xs">
                          Protegido por reCAPTCHA de Google.{' '}
                          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-text-muted">Privacidad</a>
                          {' · '}
                          <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-text-muted">Condiciones</a>.
                        </p>
                      </div>
                  </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
