# Trazal — Estrato

Propuesta de identidad v0.1, pendiente de elección.

Arcilla, mantequilla y papel. Una dirección editorial que toma su carácter de los materiales y del oficio. El símbolo se apila en capas; la tipografía aporta una voz humana y una presencia que dura.

## Idea del símbolo
Tres planos se apoyan unos sobre otros. La silueta alude a una T, a una sección de terreno y a una cimentación. Es una marca compacta, diseñada para vivir en documentos y piezas físicas.

## Color
- Arcilla: #BC5538. Acento principal. Logotipo, superficies de marca y titulares grandes.
- Papel natural: #FFFCF7. Fondo. Documentos e interfaz; el espacio blanco forma parte de la identidad.
- Umbral: #362D27. Texto. Información principal, controles y versiones monocromas.
- Arena: #EEE5D8. Superficie. Fondos tranquilos y composiciones impresas.
- Mantequilla: #F0D58F. Acento secundario. Etiquetas y pequeños detalles cálidos sobre fondos oscuros.

## Tipografía
Titulares: Fraunces. Interfaz y textos: DM Sans. Licencias SIL OFL incluidas en fonts/.

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
