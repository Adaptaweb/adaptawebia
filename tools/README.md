# tools

## og-card.html

Plantilla de la imagen que se ve al compartir el sitio (`public/og.jpg`).
No se publica: vive aquí para poder volver a generarla.

Para regenerarla: copiarla a `public/` temporalmente, abrirla en el
navegador con el viewport en 1200x630, capturar la pantalla y guardar el
resultado como `public/og.jpg`. Después borrar la copia de `public/`.

Si cambian las medidas de la captura, hay que actualizar `og:image:width` y
`og:image:height` en `src/layouts/BaseLayout.astro`: declarar un tamaño que
no corresponde hace que algunos lectores recorten mal la tarjeta.
