// Aplicaciones propias en producción. Misma información que la sección de proyectos
// del portafolio: tipo, descripción, stack y, cuando existe, la demo grabada.
// Los clips viven en /public/media con una versión clara y otra oscura por base.

export type Frame = "browser" | "phone";

export interface AppThumb {
  /** Base de los clips: `${base}-claro.mp4` / `-oscuro.mp4` y sus pósters `.webp`. */
  base?: string;
  /** Captura fija, para las apps sin demo grabada. */
  src?: string;
  frame: Frame;
  /** Etiqueta de la barra del navegador. */
  domain?: string;
  alt: string;
}

export interface AppItem {
  slug: string;
  name: string;
  type: string;
  entity: string;
  description: string;
  keywords: string[];
  url?: string;
  urlLabel?: string;
  thumb: AppThumb;
  /** Bases que se reproducen en secuencia al pasar el cursor por la tarjeta. */
  clips?: string[];
  highlights?: string[];
  /** Ocupa el ancho completo de la grilla. */
  wide?: boolean;
}

export const apps: AppItem[] = [
  {
    slug: "control-acceso-casino",
    name: "Plataforma de Gestión Operacional, Accesos y Casino",
    type: "Plataforma web + API + apps móviles",
    entity: "Producto propio · principal",
    description:
      "Solución completa de control en tiempo real de accesos (personas, vehículos y pasajeros) y consumos de casino, con un motor de validación central que da servicio al dashboard web y a las apps Flutter con modo offline. Incluye migración de MongoDB a PostgreSQL y pruebas de carga con k6.",
    keywords: [
      "React 19",
      "TypeScript",
      "FastAPI",
      "PostgreSQL",
      "Flutter",
      "Docker",
      "k6",
    ],
    highlights: [
      "Control operacional 360°: ingresos, salidas y raciones de casino en tiempo real",
      "Un solo motor de validación para la web y las apps móviles",
      "Sigue validando sin conexión con catálogo sincronizado localmente",
      "Reportes filtrables, exportación a Excel y feed OData para Power BI",
    ],
    thumb: {
      base: "/media/control-acceso/dashboard",
      frame: "browser",
      domain: "panel de control",
      alt: "Dashboard en vivo con personas y vehículos del día",
    },
    clips: [
      "/media/control-acceso/dashboard",
      "/media/control-acceso/ficha",
      "/media/control-acceso/reportes",
      "/media/control-acceso/casino30",
    ],
    wide: true,
  },
  {
    slug: "gestion-presupuesto",
    name: "Kuentas Klaras",
    type: "App web (PWA)",
    entity: "Producto propio · en producción",
    description:
      "Gestión de finanzas personales: gastos por categoría y tarjeta, cuotas, suscripciones y cuentas de ahorro, con bancos chilenos y sugerencias con IA. Instalable desde el navegador.",
    keywords: ["React", "Node.js", "PWA", "IA"],
    url: "https://gastos.adaptaweb.cl/",
    urlLabel: "Abrir app",
    thumb: {
      base: "/media/gastos/transacciones",
      frame: "phone",
      alt: "Kuentas Klaras: transacciones del mes",
    },
    clips: [
      "/media/gastos/transacciones",
      "/media/gastos/cuotas",
      "/media/gastos/ahorros",
      "/media/gastos/resumen",
    ],
  },
  {
    slug: "ideas-blueprint",
    name: "Ideas Blueprint",
    type: "Plataforma web",
    entity: "Producto propio · en producción",
    description:
      "Plataforma para gestionar ideas de mejora de principio a fin: tablero kanban con prioridades, taller visual para maquetar cada idea sobre capturas con pines de problema y mejora, y modo presentación. Suma homologación de planillas Excel y gestión de contactos por centro de trabajo con auditoría de cambios.",
    keywords: [
      "Astro",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "PostgreSQL",
      "Konva",
    ],
    url: "https://ideas.adaptaweb.cl/",
    urlLabel: "Visitar sitio",
    thumb: {
      base: "/media/ideas/tablero",
      frame: "browser",
      domain: "ideas.adaptaweb.cl",
      alt: "Ideas Blueprint: tablero de ideas",
    },
    clips: [
      "/media/ideas/tablero",
      "/media/ideas/taller",
      "/media/ideas/homologacion",
      "/media/ideas/clientes",
    ],
  },
  {
    slug: "kecomo",
    name: "KeComo",
    type: "App móvil",
    entity: "Producto propio",
    description:
      "App para registrar los alimentos que consumes y detectar posibles alérgenos, con reportes en PDF para llevar a la consulta.",
    keywords: ["Flutter", "Riverpod", "SQLite", "PDF"],
    thumb: {
      base: "/media/kecomo/app",
      frame: "phone",
      alt: "KeComo: pantalla Hoy con el registro de comidas",
    },
  },
  {
    slug: "bank-craft",
    name: "Bank Craft",
    type: "App web + IoT",
    entity: "Producto propio",
    description:
      "Tareas del hogar gamificadas al estilo Minecraft: los padres aprueban por Telegram y Home Assistant reacciona en casa.",
    keywords: ["Python", "Flask", "Telegram", "Home Assistant", "Raspberry Pi"],
    thumb: {
      src: "/media/thumbs/bank-craft.webp",
      frame: "browser",
      domain: "tareas.adaptaweb.cl",
      alt: "Bank Craft: misiones del día",
    },
  },
];
