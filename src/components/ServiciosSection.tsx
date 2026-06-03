'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { FeatureCard, FeatureGrid, type Feature } from '@/components/ui/modern-feature-grid';
import {
  Code2,
  Smartphone,
  Server,
  GitMerge,
  Rocket,
  Shield,
} from 'lucide-react';

const services: Feature[] = [
  
  {
    Icon: Code2,
    title: 'Desarrollo de Software',
    description:
      'Cuéntanos tus necesidades y desarrollaremos un software para ti, personalizado y eficiente.',
  },
  {
    Icon: Smartphone,
    title: 'Aplicaciones móviles',
    description:
      'Mejora la rentabilidad de tu negocio, o proyecto con la app que permita conectar a tus clientes con tu servicio.',
  },
  
  {
    Icon: Server,
    title: 'Hosting',
    description:
      'Almacenamos tu información, sitio web o el contenido que necesites, con los más altos estándares de seguridad y calidad.',
  },
  {
    Icon: GitMerge,
    title: 'APIs, integraciones y migraciones',
    description:
      'Integramos sistemas y datos vía APIs para reducir fricción y mejorar trazabilidad. También realizamos migraciones tecnológicas para modernizar sin perder estabilidad.',
  },
  {
    Icon: Rocket,
    title: 'Optimización y modernización de software',
    description:
      'Modernizamos soluciones existentes para mejorar rendimiento, seguridad y mantenibilidad, extendiendo su capacidad de responder a nuevas necesidades del negocio.',
  },
  {
    Icon: Shield,
    title: 'Soporte y continuidad operacional',
    description:
      'Aseguramos soporte y mantenimiento evolutivo para mantener disponibilidad, resolver incidentes y acompañar la evolución de sistemas que no pueden detenerse.',
  },
];

export default function ServiciosSection() {
  return (
    <section
      id="servicios"
      className="relative overflow-hidden px-6 py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="mb-16 text-center" data-reveal>
            
            <h2 className="mx-auto max-w-xl text-3xl font-bold tracking-tighter text-white md:text-4xl lg:text-5xl">
              Soluciones tecnológicas integrales
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-white/80 md:text-base">
          Todo lo que necesitas para llevar tu negocio al siguiente nivel. Muchas organizaciones operan con herramientas que no fueron diseñadas para su realidad.
            </p>
          </div>

          <FeatureGrid>
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.45,
                  delay: i * 0.05,
                  ease: 'easeOut',
                }}
              >
                <FeatureCard
                  Icon={service.Icon}
                  title={service.title}
                  description={service.description}
                />
              </motion.div>
            ))}
          </FeatureGrid>
        </motion.div>
      </div>
    </section>
  );
}
