# Trazal — Enlace

Propuesta de exploración. Linde (amarillo) es la identidad elegida para Trazal; Enlace y Estrato se conservan para consulta.

Naranja de terracota fresca, curvas suaves y una letra abierta. Enlace acerca el trabajo técnico a las personas: una marca práctica y amable, que conecta lo que pasa en campo con lo que se decide en oficina.

## Idea del símbolo
Dos trazos se encuentran y forman una t abierta. Los extremos redondeados suavizan el encuentro, como dos recorridos que llegan al mismo punto. Una pequeña separación mantiene legible cada parte.

## Color
- Mandarina: #FF824F. Acento principal. Acciones, iconos de aplicación y momentos de marca. Texto cacao encima.
- Blanco cálido: #FFFCF8. Fondo. Lectura, formularios y espacios de trabajo.
- Cacao: #3B2923. Texto. Cifras, títulos y logotipos sobre fondos claros.
- Durazno: #FBE8DD. Superficie. Estados de selección y paneles secundarios.
- Teja: #B84220. Acento secundario. Enlaces y botones con texto blanco. No usar mandarina para texto pequeño.

## Tipografía
Titulares: Outfit. Interfaz y textos: DM Sans. Licencias SIL OFL incluidas en fonts/.

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
