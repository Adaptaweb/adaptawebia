"use client";

import React, { useState, useEffect, useRef } from 'react';

const AnimatedNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <a
      href={href}
      className="group relative inline-block overflow-hidden h-5 flex items-center text-sm"
    >
      <div className="flex flex-col transition-transform duration-300 ease-out transform group-hover:-translate-y-1/2">
        <span className="text-text-muted">{children}</span>
        <span className="text-text-primary">{children}</span>
      </div>
    </a>
  );
};

export function MiniNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState('rounded-full');
  const shapeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (shapeTimeoutRef.current) {
      clearTimeout(shapeTimeoutRef.current);
    }

    if (isOpen) {
      setHeaderShapeClass('rounded-xl');
    } else {
      shapeTimeoutRef.current = setTimeout(() => {
        setHeaderShapeClass('rounded-full');
      }, 300);
    }

    return () => {
      if (shapeTimeoutRef.current) {
        clearTimeout(shapeTimeoutRef.current);
      }
    };
  }, [isOpen]);

  const navLinksData = [
    { label: 'Servicios', href: '#servicios' },
    { label: 'Proyectos', href: '#proyectos' },
    { label: 'Tecnologías', href: '#skills' },
    
  ];

  return (
    <header
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50
                  flex flex-col items-center
                  px-6 py-3 backdrop-blur-sm
                  ${headerShapeClass}
                  border border-border bg-surface/60
                  w-[calc(100%-2rem)] sm:w-auto
                  transition-[border-radius] duration-0 ease-in-out`}
    >
      <div className="flex items-center justify-between w-full gap-x-6 sm:gap-x-8">
        <a href="/" className="flex items-center gap-2.5 group">
          <img
            src="/logo.webp"
            alt="AdaptaWeb"
            className="h-7 w-auto group-hover:opacity-80 transition-opacity"
          />
          <span className="font-semibold text-sm tracking-tight text-text-primary">
            ADAPTAWEB
          </span>
        </a>

        <nav className="hidden sm:flex items-center space-x-4 sm:space-x-6">
          {navLinksData.map((link) => (
            <AnimatedNavLink key={link.href} href={link.href}>
              {link.label}
            </AnimatedNavLink>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-3">
          <a
            href="#hero"
            className="relative group px-4 py-2 text-xs sm:text-sm font-semibold text-black bg-gradient-to-br from-primary to-primary/80 rounded-full hover:from-primary/90 hover:to-primary/70 transition-all duration-200"
          >
            Contacto
          </a>
        </div>

        <button
          className="sm:hidden flex items-center justify-center w-8 h-8 text-text-muted focus:outline-none"
          onClick={toggleMenu}
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {isOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      <div
        className={`sm:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden
                     ${isOpen ? 'max-h-[1000px] opacity-100 pt-4' : 'max-h-0 opacity-0 pt-0 pointer-events-none'}`}
      >
        <nav className="flex flex-col items-center space-y-4 w-full">
          {navLinksData.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-text-muted hover:text-text-primary transition-colors w-full text-center"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex flex-col items-center space-y-4 mt-4 w-full pb-2">
          <a
            href="#hero"
            className="px-4 py-2 text-sm font-semibold text-black bg-gradient-to-br from-primary to-primary/80 rounded-full hover:from-primary/90 hover:to-primary/70 transition-all duration-200 text-center w-full"
            onClick={() => setIsOpen(false)}
          >
            Contacto
          </a>
        </div>
      </div>
    </header>
  );
}
