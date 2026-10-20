"use client";

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { id: 'hero', label: 'Inicio' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'aplicaciones', label: 'Aplicaciones' },
  { id: 'tecnologias', label: 'Tecnologías' },
];

/** Secciones de abajo hacia arriba: la primera cuyo borde superior pasó el 45 % de la pantalla es la activa. */
const SPY_ORDER = ['contacto', 'tecnologias', 'aplicaciones', 'servicios'];

export function MiniNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState('hero');
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      let current = 'hero';
      for (const id of SPY_ORDER) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.45) {
          current = id;
          break;
        }
      }
      setActive(current);
      setCompact(window.scrollY > 40);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div
        className={cn(
          // Mismo vidrio que el footer.
          'pointer-events-auto w-full border border-white/5 bg-secondary/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition-all duration-300 sm:w-auto',
          isOpen ? 'rounded-3xl' : 'rounded-full',
          compact
            ? 'py-1.5 pl-3 pr-1.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_18px_50px_-20px_rgba(0,0,0,0.9)]'
            : 'py-2 pl-4 pr-2'
        )}
      >
        <div className="flex items-center justify-between gap-2.5">
          <a href="#hero" className="mr-2 flex items-center gap-2.5 select-none">
            <img src="/logo.webp" alt="" className="h-7 w-7" />
            <span className="text-sm font-semibold tracking-wide text-text-primary">ADAPTAWEB</span>
          </a>

          <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive = active === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'inline-flex min-h-10 items-center gap-2 rounded-full px-3.5 text-sm transition-colors duration-200',
                    isActive
                      ? 'bg-primary/12 text-text-primary'
                      : 'text-text-muted hover:bg-white/6 hover:text-text-primary'
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'h-1.5 w-1.5 rounded-full bg-primary transition-all duration-200',
                      isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                    )}
                  />
                  {link.label}
                </a>
              );
            })}
          </nav>

          <a
            href="#contacto"
            className={cn(
              'aw-btn ml-1.5 hidden min-h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-[#0B0B0C] md:inline-flex',
              active === 'contacto' && 'ring-2 ring-primary/40'
            )}
          >
            Contacto
          </a>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center text-text-muted md:hidden"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <div
          className={cn(
            'grid overflow-hidden transition-all duration-300 md:hidden',
            isOpen ? 'max-h-[420px] pt-3 opacity-100' : 'pointer-events-none max-h-0 opacity-0'
          )}
        >
          <nav aria-label="Principal móvil" className="flex flex-col gap-1 pb-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'rounded-2xl px-4 py-3 text-center transition-colors',
                  active === link.id ? 'bg-primary/12 text-text-primary' : 'text-text-muted hover:text-text-primary'
                )}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contacto"
              onClick={() => setIsOpen(false)}
              className="mt-2 rounded-full bg-primary px-4 py-3 text-center text-sm font-semibold text-[#0B0B0C]"
            >
              Contacto
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
