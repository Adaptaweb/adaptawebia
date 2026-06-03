"use client";

import * as React from "react";
import { motion, type Variants } from "motion/react";
import { Wallet, Lightbulb, Sparkles } from "lucide-react";
import { Features } from "@/components/ui/features";
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

const projectItems = [
  {
    id: 1,
    icon: Wallet,
    title: "Gestión Financiera",
    description:
      "Registra y clasifica tus gastos de forma inteligente. Visualiza categorías, trends y obtén insights financieros en tiempo real para tomar mejores decisiones.",
    image: "https://picsum.photos/seed/gestion-financiera/800/500",
  },
  {
    id: 2,
    icon: Lightbulb,
    title: "Ideas Blueprint",
    description:
      "Tablero Kanban interactivo con diseñador visual integrado. Prototipa, organiza y presenta ideas de mejora de manera ágil y colaborativa.",
    image: "https://picsum.photos/seed/ideas-blueprint/800/500",
  },
  {
    id: 3,
    icon: Sparkles,
    title: "Próximamente",
    description:
      "Un nuevo proyecto está en desarrollo. Pronto compartiremos más detalles sobre esta próxima solución.",
    image: "https://picsum.photos/seed/proximamente-adaptaweb/800/500",
  },
];

export default function ProyectosFeatures({
  className,
}: {
  className?: string;
}) {
  return (
    <section
      id="proyectos"
      className={cn(
        "relative py-24 md:py-32 overflow-hidden px-6",
        className
      )}
    >
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            variants={itemVariants}
            className="mb-16 text-center"
            data-reveal
          >
            <p className="font-mono text-xs tracking-[0.25em] text-primary mb-4 uppercase">
              Proyectos
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-white max-w-xl mx-auto">
              Nuestros productos en vivo
            </h2>
            <p className="mt-4 text-sm text-text-muted md:text-base max-w-xl mx-auto">
              Soluciones que ya están en producción, diseñadas para resolver
              problemas reales.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Features features={projectItems} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
