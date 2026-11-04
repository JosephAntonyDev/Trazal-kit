# Trazal — Linde

Propuesta de identidad v0.1, pendiente de elección.

El amarillo de una marca de replanteo. La precisión de una escuadra. Una identidad luminosa que pone orden sin sentirse rígida: mucho papel, trazos limpios y el color justo para señalar lo importante.

## Idea del símbolo
Una T construida con tres piezas y una junta visible. El travesaño marca una referencia; el eje vertical, un punto de partida. Su geometría nace del replanteo y funciona incluso a escala de un icono.

## Color
- Replanteo: #F5D547. Acento principal. Acciones principales, selección y firmas de marca. Siempre con texto oscuro.
- Papel: #FCFBF6. Fondo. La mayor parte de la interfaz. Un blanco cálido que deja respirar a los datos.
- Grafito: #282820. Texto. Titulares, cifras y versiones monocromáticas.
- Caliza: #EEEDDF. Superficie. Áreas secundarias, documentos y fondos de apoyo.
- Olivo: #70734D. Acento secundario. Detalles editoriales. No sustituye los estados funcionales de la interfaz.

## Tipografía
Titulares: Manrope. Interfaz y textos: DM Sans. Licencias SIL OFL incluidas en fonts/.

## Uso
- Mantener proporciones. Espacio de seguridad recomendado: un cuarto del alto del símbolo.
- Mínimos propuestos: símbolo 24 px; firma horizontal 120 px. Revisar en el soporte final.
- SVG con logotipos trazados; no necesitan fuentes instaladas.
- PNG con transparencia, excepto icono de aplicación y cartel.
- No mezclar paletas entre propuestas.
- Paleta sRGB: convertir con un perfil de impresión antes de producción física.
- Registrar una marca o disponer de un dominio no forma parte de esta exploración.

## Flutter
trazal_colors.dart contiene constantes de color. Registrar las fuentes en pubspec.yaml y definir el ThemeData de la aplicación. Estos tokens no constituyen por sí solos un tema completo.
