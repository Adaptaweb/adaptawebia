"use client";

import { motion, type Variants } from "motion/react";
import { ArrowRight, Globe } from "lucide-react";
import { useState, type FormEvent } from "react";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

const NAV_LINKS = [
  { text: "Inicio", url: "#" },
  { text: "Servicios", url: "#servicios" },
  { text: "Skills", url: "#skills" },
  { text: "Contacto", url: "#hero" },
];

export default function FooterWithNewsletter() {
  const [email, setEmail] = useState("");

  const handleNewsletter = (e: FormEvent) => {
    e.preventDefault();
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  return (
    <footer className="relative z-1 w-full bg-secondary/10 backdrop-blur-xl border-t border-white/5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] py-20">
      <div className="mx-auto w-full max-w-[1400px] px-6 2xl:max-w-[1600px] min-[2000px]:max-w-[2000px]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-center">
            <motion.div variants={itemVariants}>
              <img src="/logo2.webp" alt="AdaptaWeb" className="h-10 md:h-9 w-auto grayscale hover:grayscale-0 transition-all duration-500" />
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="mt-8 border-t border-white/10"
          />

          <div className="mt-8 flex flex-col gap-10 md:flex-row md:gap-16 md:justify-between pb-8">
            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-3 md:max-w-xs w-full"
            >
              <p className="text-sm font-semibold text-white">
                Newsletter
              </p>
              <form onSubmit={handleNewsletter} className="flex items-center bg-black/20 backdrop-blur-xl rounded-xl overflow-hidden border border-white/5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="flex-1 px-4 py-3 text-sm text-white bg-transparent outline-none placeholder:text-text-dim"
                />
                <button
                  type="submit"
                  className="m-1.5 flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-surface hover:bg-primary/80 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              <p className="text-xs text-text-dim">
                Sin spam. Solo novedades y lanzamientos.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="grid grid-cols-2 gap-x-12 gap-y-2 md:gap-x-20 self-start"
            >
              <ul className="flex flex-col gap-2.5">
                {NAV_LINKS.map((link, i) => (
                  <motion.li key={i} variants={itemVariants}>
                    <a
                      href={link.url}
                      className="text-sm font-bold uppercase tracking-wide text-text-muted hover:text-primary transition-colors"
                    >
                      {link.text}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="border-t border-white/10"
          />

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-between py-5 gap-4"
          >
            <p className="text-xs text-text-dim text-center sm:text-left">
              &copy; {new Date().getFullYear()} AdaptaWeb
            </p>
            <div className="flex items-center justify-center gap-6">
              <a
                href="https://github.com/Adaptaweb"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                style={{ "--brand": "#ffffff" } as React.CSSProperties}
                className="group relative flex min-h-11 items-center justify-center gap-2 px-4 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-8 top-1/2 -z-10 h-10 -translate-y-1/2 rounded-full bg-[var(--brand)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30"
                />
                <svg className="size-5 sm:size-6 text-white transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:[filter:drop-shadow(0_0_12px_var(--brand))]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                <span className="relative text-xs sm:text-sm font-semibold tracking-wider text-white/95 transition-colors duration-300 after:absolute after:-bottom-1 after:left-1/2 after:h-px after:w-0 after:-translate-x-1/2 after:bg-[var(--brand)] after:transition-all after:duration-300 group-hover:text-white group-hover:after:w-full hidden md:inline">
                  /adaptaweb
                </span>
              </a>
              <a
                href="https://www.linkedin.com/in/alejandro-tamayo-e/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                style={{ "--brand": "#0a66c2" } as React.CSSProperties}
                className="group relative flex min-h-11 items-center justify-center gap-2 px-4 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-8 top-1/2 -z-10 h-10 -translate-y-1/2 rounded-full bg-[var(--brand)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30"
                />
                <svg className="size-5 sm:size-6 text-[#0a66c2] transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:[filter:drop-shadow(0_0_12px_var(--brand))]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                <span className="relative text-xs sm:text-sm font-semibold tracking-wider text-white/95 transition-colors duration-300 after:absolute after:-bottom-1 after:left-1/2 after:h-px after:w-0 after:-translate-x-1/2 after:bg-[var(--brand)] after:transition-all after:duration-300 group-hover:text-white group-hover:after:w-full hidden md:inline">
                  /Alejandro
                </span>
              </a>
              <a
                href="https://adaptaweb.cl"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="AdaptaWeb"
                style={{ "--brand": "#45FF8C" } as React.CSSProperties}
                className="group relative flex min-h-11 items-center justify-center gap-2 px-4 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-8 top-1/2 -z-10 h-10 -translate-y-1/2 rounded-full bg-[var(--brand)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30"
                />
                <Globe className="size-5 sm:size-6 text-primary transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:[filter:drop-shadow(0_0_12px_var(--brand))]" />
                <span className="relative text-xs sm:text-sm font-semibold tracking-wider text-white/95 transition-colors duration-300 after:absolute after:-bottom-1 after:left-1/2 after:h-px after:w-0 after:-translate-x-1/2 after:bg-[var(--brand)] after:transition-all after:duration-300 group-hover:text-white group-hover:after:w-full hidden md:inline">
                  /adaptaweb.cl
                </span>
              </a>
            </div>
            <p className="text-xs text-text-dim text-center sm:text-right">
              adaptaweb.cl
            </p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
