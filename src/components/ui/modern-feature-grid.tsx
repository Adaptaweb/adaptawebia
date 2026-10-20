'use client';

import * as React from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'motion/react';
import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';

export interface Feature {
  Icon: LucideIcon;
  title: string;
  description: string;
}

interface FeatureCardProps {
  Icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ Icon, title, description, className }, ref) => {
    const titleId = React.useId();

    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);

    const rotateX = useSpring(
      useTransform(mouseY, [0, 1], [5, -5]),
      { stiffness: 300, damping: 30 },
    );
    const rotateY = useSpring(
      useTransform(mouseX, [0, 1], [-5, 5]),
      { stiffness: 300, damping: 30 },
    );

    // Foco verde que sigue al cursor dentro de la tarjeta.
    const spotX = useTransform(mouseX, (v) => `${v * 100}%`);
    const spotY = useTransform(mouseY, (v) => `${v * 100}%`);
    const spotlight = useMotionTemplate`radial-gradient(420px circle at ${spotX} ${spotY}, rgba(69,255,140,0.14), rgba(69,255,140,0) 60%)`;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    };

    const handleMouseLeave = () => {
      mouseX.set(0.5);
      mouseY.set(0.5);
    };

    return (
      <div ref={ref} style={{ perspective: '600px' }}>
        <motion.div
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          whileHover={{ scale: 1.025 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn(
            'group relative flex flex-col items-start gap-4 overflow-hidden rounded-2xl border border-white/5 bg-surface/30 p-6 shadow-lg backdrop-blur-xl transition-[border-color,box-shadow] duration-300 ease-out hover:border-primary/25 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_40px_80px_-30px_rgba(0,0,0,0.9)]',
            className,
          )}
          aria-labelledby={titleId}
        >
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100"
            style={{ background: spotlight }}
          />
          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-all duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:-translate-y-[3px] group-hover:scale-[1.06] group-hover:bg-primary/18 group-hover:shadow-[0_0_28px_-6px_rgba(69,255,140,0.6)]">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="relative flex flex-col" style={{ transform: 'translateZ(20px)' }}>
            <h3 id={titleId} className="text-lg font-bold leading-none tracking-tight text-white">
              {title}
            </h3>
            <p className="mt-3 text-sm text-white/70">
              {description}
            </p>
          </div>
        </motion.div>
      </div>
    );
  },
);
FeatureCard.displayName = 'FeatureCard';

const FeatureGrid = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
FeatureGrid.displayName = 'FeatureGrid';

export { FeatureCard, FeatureGrid };
