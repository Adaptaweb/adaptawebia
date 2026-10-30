# Plan — portafolio de AdaptaWeb

Estado: **plan aprobado, sin empezar a construir**.
Fuente: `C:\Users\Alejandro\Documents\Proyectos\portfolio-json`
(en producción: https://portfolio-alejandro-tamayo.vercel.app/)

---

## Lo que se reutiliza del portafolio

### 1. Los datos

`src/data/cv.json` tiene 9 proyectos con una estructura rica y ya redactada:

```
slug · name · shortName · type · entity · startDate
description · summary
highlights[] · uxDetails[{title, body}] · keywords[]
problem · context[] · decisions[{title, body}]
architecture { clients[], services[], data[] }
results[]
media[{ src, caption, title, device? }]
```

Se copia a `src/data/proyectos.json` en adaptaweb. **No se reescribe el
contenido**: está bien escrito y es verdadero.

### 2. El mecanismo de claro/oscuro

Esto es lo importante y conviene entenderlo bien, porque no es un selector
de tema del sitio.

En el portafolio **la página se queda oscura siempre**. Lo que cambia entre
claro y oscuro son **las capturas y los videos de las demos**. Cada clip
existe cuatro veces:

```
dashboard-claro.mp4   dashboard-claro.webp
dashboard-oscuro.mp4  dashboard-oscuro.webp
```

Sobre eso hay tres piezas:

- **`src/lib/theme-video.ts`** — congela el fotograma actual en un `<canvas>`
  encima del video, carga la otra versión por debajo y barre el canvas con
  un `clip-path: circle()` desde una esquina. El resultado es que el sistema
  parece cambiar de tema en vivo, sin corte.
- **`Showcase.astro`** — envuelve las demos, lleva `data-demo-mode` y
  `data-phase`, y ofrece tres botones: Auto, Claro, Oscuro. En Auto alterna
  cada 10 s y se detiene si la pestaña está oculta.
- **`Stage.astro` / `DemoVideo.astro`** — el marco del dispositivo y el
  video con su póster.

Se porta igual, adaptando los tokens de color a los de adaptaweb.

### 3. La estructura de la ficha de caso

`src/pages/casos/[slug].astro` ordena así:

1. Cabecera: nombre, tipo, entidad, fechas
2. Demos (`Showcase` con `Stage` para pantallas y dispositivos)
3. Detalles de experiencia
4. El problema
5. Contexto
6. Arquitectura (clientes / servicios / datos)
7. Decisiones
8. Resultado
9. Enlace al caso siguiente

Se conserva el orden. Cambia la piel: tipografía Space Grotesk, verde
`#45FF8C`, las ondas de corte y la navbar de adaptaweb.

---

## Los recursos

El portafolio tiene **70 MB** en `public/media`:

| Carpeta | Contenido | Peso |
|---|---|---|
| control-acceso | 14 mp4 + 14 webp | 27 MB |
| gastos | 8 mp4 + 8 webp | 35 MB |
| ideas | 8 mp4 + 8 webp | 4.8 MB |
| kecomo | 2 mp4 + 2 webp | 3.8 MB |
| adaptaweb | 1 mp4 | 2.6 MB |

AdaptaWeb ya tiene **15 MB** de ese conjunto: los `-oscuro.mp4` y algunos
`.webp` que quedaron del diseño anterior. Faltan sobre todo los `-claro.mp4`,
que son justamente los que hacen falta para que el cambio de tema funcione.

**Decisión a tomar:** copiar los 55 MB que faltan al repo, o servir los
videos desde otro lado. Por ahora el plan asume copiarlos — es lo simple y
Vercel los sirve desde su CDN sin problema.

---

## Qué proyectos entran

La landing muestra siete sistemas. El `cv.json` tiene nueve, pero no son
los mismos:

| Sistema | En cv.json | Media | Qué falta |
|---|---|---|---|
| Control de acceso y casino | sí, completo | 7 clips | nada |
| Kuentas Klaras | sí, completo | 4 clips | nada |
| Ideas Blueprint | sí, completo | 4 clips | nada |
| KeComo | sí, completo | 1 clip | nada |
| FamiDoc | **no** | 1 captura | redactar la ficha |
| Banco de Tareas | **no** | 1 captura | redactar la ficha |
| Riego automático | **no** | 1 captura | redactar la ficha |

Además `cv.json` trae tres que la landing no muestra: `lector-acceso` y
`kiosco-casino` (que son partes del de control de acceso), `bank-craft` y
`sistema-dgm`.

**Propuesta:** el índice muestra los siete de la landing. Los cuatro
primeros estrenan ficha completa de inmediato. Los tres últimos entran con
una ficha más corta, armada con lo que ya dice la landing (descripción,
tres highlights y el stack), y se amplía cuando haya material.

---

## Las páginas

```
/portafolio              índice de los siete sistemas
/portafolio/<slug>       ficha de cada uno
```

Se enlaza desde:
- "Ver portafolio completo" en Trabajo real, que hoy apunta a `#cotizar`
- "Ver en detalle" de cada tarjeta del carrusel, que hoy apunta a la app en
  vivo o no existe
- El pie

Ambas entran al sitemap automáticamente.

---

## Orden de trabajo

1. **Base**: copiar `cv.json` a `src/data/proyectos.json`, copiar los
   recursos que faltan, y un `src/lib/proyectos.ts` que tipe y filtre.
2. **Tema de las demos**: portar `theme-video.ts`, `Showcase`, `Stage` y
   `DemoVideo` con la piel de adaptaweb.
3. **`/portafolio`**: índice con nav, pie y ondas; una tarjeta por sistema
   con su póster, nombre, tipo y palabras clave.
4. **`/portafolio/[slug]`**: la ficha completa, con las nueve secciones.
5. **Enlaces**: arreglar "Ver portafolio completo" y los "Ver en detalle".
6. **Fichas cortas** de FamiDoc, Banco de Tareas y Riego.
7. Verificar en el navegador a 390, 768 y 1280, y revisar que el sitemap
   recoja las rutas nuevas.

Cada paso cierra con su commit.

---

## Lo que hay que decidir

- **Los 55 MB de video.** ¿Van al repo?
- **Las tres fichas cortas.** ¿Se publican con lo que dice la landing, o se
  espera a tener material y por ahora el índice muestra solo cuatro?
