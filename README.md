# Trazal — Estudio de marca

Kit de marca interactivo hecho con **React, TypeScript y Vite**. **Linde (amarillo) es la identidad elegida y predeterminada.** Se conservan **Enlace** y **Estrato** como propuestas de exploración. Solo local; sin servicios externos ni publicación.

## Ejecutar

Requiere Node.js 22.13+ (o una versión LTS más reciente compatible con Vite).

```sh
npm ci
npm run dev
```

Para usar el mismo puerto de la primera entrega:

```sh
npm run dev -- --port 5174 --strictPort
```

## Compilar

```sh
npm run build
npm run preview
```

`dist/` contiene el sitio estático. Los recursos son locales y no cargan fuentes de terceros. La primera visita y la navegación necesitan el servidor local; no se ha implementado un service worker para instalación offline.

## El kit incluye

- Tres direcciones con personalidad, paleta, tipografía, símbolos e iconos propios.
- Logotipo, firma horizontal, firma vertical, símbolo e icono de app; cada uno en color, monocromo y negativo.
- Doce iconos funcionales por dirección y un cartel por dirección.
- 84 entradas de activos, cada una con archivo SVG y PNG.
- SVG de los logotipos convertidos a trazados, independientes de las fuentes instaladas.
- Fuentes Manrope, Outfit, Fraunces y DM Sans con sus licencias SIL OFL.
- Biblioteca con búsqueda y filtros; visor con escala, fondos y descarga.
- Copia de colores, cálculo de contraste WCAG, probador tipográfico y comparación.
- Identidad elegida definida en `src/identity.json`: Linde. La web siempre inicia con ella y permite consultar las otras dos; sin cuentas ni telemetría.
- Ejemplos visuales de interfaz, tarjeta, cartel y portada de reporte. Todos los datos de aplicación son ficticios.
- ZIP completo y ZIP por propuesta.
- Tokens CSS, JSON y constantes de color para Flutter/Dart. El archivo Dart no sustituye un ThemeData completo.

## Editar una identidad

1. Modificar `src/brand-data.json` para paletas, tipografías y textos.
2. Modificar `scripts/build-brand.mjs` para geometría de símbolos, iconos o exportaciones.
3. Ejecutar `npm run brand:build` para regenerar SVG, PNG, tokens, ZIP y manifiesto.
4. Ejecutar `npm run build` y revisar las vistas afectadas.

La interfaz se encuentra en `src/App.tsx` y el estilo en `src/styles.css`. Los activos exportados viven en `public/assets/`; los paquetes están en `public/downloads/`.

## Alcance

El equipo eligió Linde (amarillo). Enlace y Estrato permanecen disponibles como referencia del proceso de diseño. No se ha verificado disponibilidad del nombre ante registros de marca ni dominios. Los colores se entregan en sRGB; convertir con el perfil de salida antes de impresión física. El kit muestra una dirección de diseño; no implementa el software de control de obra, licencias o motor financiero.

Se tomó como referencia la organización del kit de Lextli. No se modificó ese proyecto ni se reutilizaron sus logotipos o personajes. Se reutilizaron las distribuciones de fuentes abiertas, conservando sus licencias.
