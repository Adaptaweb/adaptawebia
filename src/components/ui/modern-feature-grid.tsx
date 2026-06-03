'use client';

import * as React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
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
            'flex flex-col items-start gap-4 rounded-2xl border border-white/5 bg-surface/30 p-6 shadow-lg backdrop-blur-xl transition-colors duration-300 ease-out hover:border-primary/20 hover:bg-surface/30',
            className,
          )}
          aria-labelledby={titleId}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="flex flex-col" style={{ transform: 'translateZ(20px)' }}>
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
