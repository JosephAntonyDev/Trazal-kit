import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, CheckCheck, ChevronRight, Copy, Download, FolderOpen, Grid2X2, Layers, LayoutTemplate, Maximize2, Menu, Minus, Palette, Plus, Search, Shapes, SlidersHorizontal, Type, X } from 'lucide-react';
import directions from './brand-data.json';
import manifest from './asset-manifest.json';
import identity from './identity.json';

const selectedIndex = directions.findIndex(d => d.id === identity.selectedDirection);
const selectedDirection = directions[selectedIndex];

type Direction = typeof directions[number];
type Asset = typeof manifest[number];
type Section = 'overview' | 'essence' | 'logos' | 'colors' | 'typography' | 'icons' | 'applications' | 'compare' | 'library';
const navigation = [
  { id: 'overview', name: 'Explorar propuestas', icon: Grid2X2 },
  { id: 'essence', name: 'Esencia de marca', icon: Layers },
  { id: 'logos', name: 'Logotipos y símbolos', icon: Shapes },
  { id: 'colors', name: 'Paletas de color', icon: Palette },
  { id: 'typography', name: 'Tipografía', icon: Type },
  { id: 'icons', name: 'Iconografía', icon: SlidersHorizontal },
  { id: 'applications', name: 'Marca en uso', icon: LayoutTemplate },
  { id: 'compare', name: 'Comparar propuestas', icon: Layers },
  { id: 'library', name: 'Descargas', icon: FolderOpen },
] as const;
const labels: Record<Section, { title: string; intro: string }> = {
  overview: { title: 'Una buena obra empieza con un trazo.', intro: 'Elegimos Linde. Amarillo, claridad y precisión para darle forma a Trazal. Enlace y Estrato permanecen como parte de la exploración.' },
  essence: { title: 'Construir con claridad.', intro: 'Una misma idea sostiene las tres propuestas. La personalidad cambia; lo que creemos, permanece.' },
  logos: { title: 'Una firma con carácter.', intro: 'Símbolos simples, letras con intención y versiones para cada escala. Diseñados para acompañar el trabajo.' },
  colors: { title: 'El color, en su lugar.', intro: 'Luz, contraste y espacios para respirar. Cada color tiene una función; no todo necesita llamar la atención.' },
  typography: { title: 'Palabras que se leen bien.', intro: 'Una voz para la marca. Otra para trabajar con cifras, tablas y decisiones, durante todo el día.' },
  icons: { title: 'Un lenguaje de pequeños trazos.', intro: 'Doce iconos para el mundo de la obra. Geometría consistente, formas reconocibles y detalles que sí se ven.' },
  applications: { title: 'Del trazo a la vida real.', intro: 'La identidad en una tarjeta, un reporte y una pantalla de trabajo. Aplicaciones ilustrativas, con datos de ejemplo.' },
  compare: { title: 'Tres caminos. Una identidad elegida.', intro: 'Linde es la propuesta elegida por el equipo. Conservamos Enlace y Estrato para consultar el recorrido de diseño.' },
  library: { title: 'Listo para llevar.', intro: 'Vectores, imágenes, colores y fuentes. Recursos organizados por propuesta para empezar a diseñar y construir.' },
};
const assetKinds = ['wordmark', 'horizontal', 'stacked', 'symbol', 'app-icon'];
function vars(c: Direction): CSSProperties { return { '--brand': c.color, '--brand-ink': c.ink, '--brand-paper': c.paper, '--brand-soft': c.soft, '--brand-accent': c.accent, '--brand-on': c.onColor, '--display-font': c.font } as CSSProperties; }
function Logo({ c, kind = 'wordmark', variant = 'color', className = '' }: { c: Direction; kind?: string; variant?: string; className?: string }) { return <img className={`brand-logo ${className}`} src={`/assets/${c.id}/${kind}-${variant}.svg`} alt={`Trazal · ${c.name} · ${kind === 'symbol' ? 'símbolo' : 'logotipo'}`} />; }
function ratio(a: string, b: string) { const lum = (s: string) => { const rgb = [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4); return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722; }; const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); }
function getAsset(c: Direction, kind: string, variant = 'color') { return manifest.find(a => a.direction === c.id && a.kind === kind && a.variant === variant)!; }

function AppPreview({ c }: { c: Direction }) {
  const [tab, setTab] = useState('Resumen');
  return <div className={`product-preview product-${c.id}`} style={vars(c)}>
    <div className="product-chrome"><span className="window-dots"><i /><i /><i /></span><span>Camino del Norte.trazal</span><span className="demo-label">DEMO</span></div>
    <div className="product-layout"><aside><Logo c={c} /><div className="product-nav">{['Resumen', 'Presupuesto', 'Avance'].map(t => <button key={t} onClick={() => setTab(t)} className={tab === t ? 'active' : ''}>{t}</button>)}</div><span className="product-offline"><i /> Guardado en tu equipo</span></aside><div className="product-main">
      <div className="product-sub">OBRAS / CAMINO DEL NORTE</div><h3>{tab === 'Resumen' ? 'Vamos por buen camino.' : tab === 'Presupuesto' ? 'Cada concepto, en orden.' : 'Así avanza la obra.'}</h3><div className="product-date">Corte del 2 de octubre · Datos de ejemplo</div>
      {tab === 'Resumen' ? <><div className="product-stats"><div><span>Avance físico</span><strong>68.4<small>%</small></strong></div><div><span>Costo registrado</span><strong>$4.28<small>M</small></strong></div><div><span>Por revisar</span><strong>03<small>capturas</small></strong></div></div><div className="product-chart"><div className="product-chart-label"><strong>Avance por frente</strong><span>Ejecutado / planeado</span></div>{[['Terracerías', 92, 95], ['Drenaje', 76, 82], ['Pavimentación', 48, 60]].map(([name, v, target]) => <div className="progress-row" key={name}><span>{name}</span><div className="progress-track"><i style={{ width: `${target}%` }} /><b style={{ width: `${v}%` }} /></div><strong>{v}%</strong></div>)}</div></> : tab === 'Presupuesto' ? <table className="demo-table"><thead><tr><th>Partida</th><th>Costo base</th></tr></thead><tbody>{[['Terracerías', '$1,250,000'], ['Drenaje', '$950,000'], ['Pavimentación', '$3,800,000'], ['Señalamiento', '$250,000']].map(r => <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td></tr>)}</tbody></table> : <div className="capture-list">{[['Carpeta asfáltica', '24.50 m³', 'Pendiente de revisión'], ['Excavación', '120.00 m³', 'Aprobado'], ['Drenaje', '36.00 m', 'Aprobado']].map(r => <div key={r[0]}><span><strong>{r[0]}</strong><small>{r[2]}</small></span><b>{r[1]}</b></div>)}</div>}
    </div></div>
  </div>;
}

export default function App() {
  const [section, setSection] = useState<Section>('overview');
  const [active, setActive] = useState(selectedIndex);
  const [menu, setMenu] = useState(false);
  const [toast, setToast] = useState('');
  const [modal, setModal] = useState<Asset | null>(null);
  const [variant, setVariant] = useState('color');
  const [format, setFormat] = useState('svg');
  const [background, setBackground] = useState('grid');
  const [zoom, setZoom] = useState(1);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sample, setSample] = useState('Cada trazo cuenta.');
  const [fontSize, setFontSize] = useState(64);
  const dialog = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const drawer = useRef<HTMLElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const c = directions[active];

  useEffect(() => { if (toast) { const timer = setTimeout(() => setToast(''), 3200); return () => clearTimeout(timer); } }, [toast]);
  useEffect(() => {
    if (modal) { dialog.current?.showModal(); document.body.style.overflow = 'hidden'; }
    else { dialog.current?.close(); document.body.style.overflow = ''; opener.current?.focus(); }
    return () => { document.body.style.overflow = ''; };
  }, [modal]);
  useEffect(() => {
    if (!menu) return;
    document.body.style.overflow = 'hidden'; drawer.current?.querySelector<HTMLButtonElement>('.drawer-close')?.focus();
    const close = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMenu(false); menuButton.current?.focus(); }
      if (e.key === 'Tab') { const nodes = drawer.current?.querySelectorAll<HTMLElement>('button,a'); if (!nodes?.length) return; const first = nodes[0], last = nodes[nodes.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } }
    };
    window.addEventListener('keydown', close);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', close); };
  }, [menu]);
  useEffect(() => { const m = window.matchMedia('(min-width: 901px)'); const change = () => { if (m.matches) setMenu(false); }; m.addEventListener('change', change); return () => m.removeEventListener('change', change); }, []);

  function go(s: Section) { setSection(s); setMenu(false); setQuery(''); if (menu) requestAnimationFrame(() => menuButton.current?.focus()); window.scrollTo({ top: 0, behavior: 'instant' }); }
  function select(i: number) { setActive(i); }
  async function copy(value: string) { try { await navigator.clipboard.writeText(value); setToast(`${value} copiado`); } catch { setToast(`No se pudo copiar. El valor es ${value}`); } }
  function open(a: Asset) { opener.current = document.activeElement as HTMLElement; setModal(a); setVariant(a.variant); setFormat('svg'); setBackground(a.variant === 'inverse' ? 'dark' : 'grid'); setZoom(1); }
  function card(a: Asset) { const d = directions.find(x => x.id === a.direction)!; return <button key={`${a.direction}-${a.kind}-${a.name}-${a.variant}`} className={`asset-card asset-${a.kind}`} onClick={() => open(a)}><div className={`asset-stage ${a.variant === 'inverse' ? 'stage-dark' : ''}`} style={{ '--asset-paper': d.soft } as CSSProperties}><img src={a.svg} alt={`${a.name} · ${d.name}`} loading="lazy" /><span className="expand-icon"><Maximize2 size={17} /></span></div><div className="asset-caption"><span>{a.name}<small>{d.name} · {a.variant === 'color' ? 'Color' : a.variant === 'mono' ? 'Monocromo' : 'Negativo'}</small></span><span>SVG + PNG</span></div></button>; }
  function identityStatus(d = c) { return <span className={`identity-status ${d.id === identity.selectedDirection ? 'chosen' : ''}`}>{d.id === identity.selectedDirection && <Check size={15} />}<span>{d.id === identity.selectedDirection ? 'Identidad elegida' : 'Propuesta de exploración'}</span></span>; }
  function directionTabs() { return <div className="direction-tabs" aria-label="Seleccionar propuesta">{directions.map((d, i) => <button key={d.id} onClick={() => select(i)} aria-pressed={i === active}><span className="tab-index">{d.number}</span><span>{d.name}</span><i style={{ background: d.color }} />{d.id === identity.selectedDirection && <Check size={13} aria-label="Identidad elegida" />}</button>)}</div>; }
  function heading() { return <div className="page-heading"><div><div className="eyebrow">TRAZAL / {section === 'overview' ? 'NUESTRA IDENTIDAD' : 'MANUAL DE IDENTIDAD'}</div><h1>{labels[section].title}</h1></div><p>{labels[section].intro}</p></div>; }

  const filtered = manifest.filter(a => a.variant === 'color' || a.kind === 'icon').filter(a => (filter === 'all' || a.direction === filter) && `${a.name} ${a.direction}`.toLocaleLowerCase('es').includes(query.toLocaleLowerCase('es')));
  const modalDirection = modal ? directions.find(x => x.id === modal.direction)! : c;
  const currentAsset = modal ? manifest.find(a => a.direction === modal.direction && a.kind === modal.kind && a.name === modal.name && a.variant === variant) ?? modal : null;

  return <div className="studio" style={vars(c)}>
    <a href="#main-content" className="skip-link">Saltar al contenido</a>
    {menu && <button className="drawer-scrim" aria-label="Cerrar navegación" onClick={() => { setMenu(false); menuButton.current?.focus(); }} />}
    <aside className={`sidebar ${menu ? 'drawer-open' : ''}`} ref={drawer} aria-label="Navegación del kit">
      <div className="sidebar-brand"><button className="brand-home" onClick={() => { select(selectedIndex); go('overview'); }} aria-label="Trazal, inicio del kit"><img src="/assets/linde/symbol-mono.svg" alt="" /><span>trazal<small>ESTUDIO DE MARCA</small></span></button><button className="icon-button drawer-close" onClick={() => { setMenu(false); menuButton.current?.focus(); }} aria-label="Cerrar menú"><X size={20} /></button></div>
      <div className="sidebar-section-label">EL KIT <span>2026</span></div>
      <nav>{navigation.map(n => <button key={n.id} onClick={() => go(n.id)} className={`${section === n.id ? 'selected' : ''} ${n.id === 'library' ? 'nav-divider' : ''}`} aria-current={section === n.id ? 'page' : undefined}><n.icon size={18} strokeWidth={1.6} /><span>{n.name}</span>{section === n.id && <i />}</button>)}</nav>
      <div className="sidebar-bottom"><div className="small-symbol"><Logo c={selectedDirection} kind="symbol" variant="mono" /></div><p>Linde · Amarillo<br /><strong>Identidad elegida.</strong></p><span>TRAZAL / NUESTRA MARCA</span></div>
    </aside>
    <div className="main-shell" inert={menu || undefined}>
      <header className="topbar"><div className="breadcrumb"><button ref={menuButton} className="icon-button mobile-menu" aria-label="Abrir menú" aria-expanded={menu} onClick={() => setMenu(true)}><Menu size={20} /></button><span>Brand kit</span><ChevronRight size={13} /><strong>{navigation.find(n => n.id === section)?.name}</strong></div><a className="button small" href={`/downloads/trazal-${identity.selectedDirection}.zip`} download><Download size={15} /><span>Descargar Linde</span></a></header>
      <main id="main-content">
        {heading()}
        <div className="chosen-banner"><span className="chosen-check"><Check size={19} /></span><div><strong>Linde es la identidad elegida.</strong><p>El amarillo será el color de Trazal. Enlace y Estrato siguen disponibles para consulta.</p></div>{c.id !== identity.selectedDirection && <button className="text-button" onClick={() => { select(selectedIndex); go('overview'); }}>Ver Linde <ArrowUpRight size={16} /></button>}</div>
        {!['essence', 'compare', 'library'].includes(section) && <div className="concept-toolbar">{directionTabs()}<span className="toolbar-note">{section === 'overview' ? 'Linde elegida · Tres propuestas disponibles.' : `DIRECCIÓN ${c.number} / ${c.name.toUpperCase()}`}</span></div>}

        {section === 'overview' && <>
          <div className={`identity-board identity-${c.id}`}>
            <button className="hero-wordmark" onClick={() => open(getAsset(c, 'wordmark', c.id === 'estrato' ? 'inverse' : 'mono'))} aria-label={`Ampliar logotipo ${c.name}`}><div className="board-top"><span>{c.number} — {c.name.toUpperCase()}</span><span>{c.id === identity.selectedDirection ? 'IDENTIDAD ELEGIDA' : 'EXPLORACIÓN VISUAL'}</span></div><Logo c={c} variant={c.id === 'estrato' ? 'inverse' : 'mono'} /><div className="board-bottom"><span>{c.tagline}</span><span className="round-arrow"><ArrowUpRight size={22} /></span></div><div className="registration r-one" /><div className="registration r-two" /></button>
            <button className="hero-symbol" onClick={() => open(getAsset(c, 'app-icon'))} aria-label={`Ampliar icono de app ${c.name}`}><div className="symbol-label"><span>UN SÍMBOLO.<br />MUCHAS POSIBILIDADES.</span><ArrowUpRight size={17} /></div><div className="symbol-construction"><div className="construction-axis horizontal" /><div className="construction-axis vertical" /><div className="construction-circle" /><Logo c={c} kind="symbol" variant="mono" /></div><span className="symbol-foot">DEL PLANO A TU PANTALLA</span></button>
            <div className="board-color-strip">{c.palette.map(p => <button key={p.hex} onClick={() => copy(p.hex)} style={{ background: p.hex, color: p.text }} aria-label={`Copiar color ${p.name} ${p.hex}`}><span>{p.name}</span><span>{p.hex}<Copy size={12} /></span></button>)}</div>
          </div>
          <div className="concept-story"><div><span className="eyebrow">LA IDEA DETRÁS</span><h2 style={{ fontFamily: c.font }}>{c.headline}</h2></div><p>{c.description}</p>{identityStatus()}</div>
          <div className="section-title"><div><span className="eyebrow">OTRAS FORMAS DE VERLO</span><h2>Así llegamos a Linde.</h2></div><button className="text-button" onClick={() => go('compare')}>Comparar las tres <ArrowUpRight size={16} /></button></div>
          <div className="direction-cards">{directions.map((d, i) => <button key={d.id} className={`direction-card ${active === i ? 'current' : ''}`} onClick={() => { select(i); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={vars(d)}><div className="direction-art"><span>{d.number}</span><Logo c={d} variant={d.id === 'estrato' ? 'inverse' : 'mono'} /><Logo c={d} kind="symbol" variant={d.id === 'estrato' ? 'inverse' : 'mono'} className="direction-mini-symbol" /></div><div className="direction-card-content"><h3>{d.name}<ArrowUpRight size={18} /></h3>{d.id === identity.selectedDirection && <span className="chosen-card-label">Identidad elegida</span>}<p>{d.short}</p><div className="palette-inline">{d.palette.map(p => <i key={p.hex} style={{ background: p.hex }} />)}<span>{d.font}</span></div></div></button>)}</div>
          <div className="editorial-strip"><div><span className="eyebrow">DE LA IDENTIDAD AL PRODUCTO</span><h2>Que también se sienta bien al usarla.</h2><p>La misma obra, vista desde cada propuesta.</p><button className="text-button" onClick={() => go('applications')}>Ver la marca en uso <ArrowRight size={17} /></button></div><div className="app-icon-trio">{directions.map(d => <button key={d.id} onClick={() => { select(directions.indexOf(d)); go('applications'); }} aria-label={`Ver aplicación de ${d.name}`}><Logo c={d} kind="app-icon" /></button>)}</div></div>
        </>}

        {section === 'essence' && <>
          <div className="foundation-hero"><span className="eyebrow">NUESTRA RAZÓN DE SER</span><h2>Menos tiempo<br />ordenando datos.<br /><em>Más perspectiva<br />sobre la obra.</em></h2><div className="foundation-coordinate">TRAZAL<br />CONTROL DE OBRA<br /><span>CAMPO ↔ OFICINA</span></div></div>
          <div className="foundation-copy"><h2>Para quienes construyen.</h2><p>Ingenieros, residentes y responsables de costos que necesitan entender qué está pasando y preparar su siguiente corte. Trazal propone una experiencia clara, cuidadosa con las cifras y respetuosa del tiempo de las personas.</p></div>
          <div className="principle-list">{[['01', 'Claridad que ayuda.', 'Información organizada y palabras que se entienden. Cada cifra debe poder explicar de dónde viene.'], ['02', 'El trabajo es suyo.', 'Archivos locales y salidas útiles. Una marca que acompaña el trabajo sin apropiarse de él.'], ['03', 'Precisión con humanidad.', 'Ser rigurosos con los datos y amables con las personas. Orientar al corregir, dar contexto al advertir.']].map(([n, title, detail]) => <div key={n}><span>{n}</span><h3>{title}</h3><p>{detail}</p></div>)}</div>
          <div className="section-title"><h2>Así habla Trazal.</h2><span>Útil, directa, sin exageraciones.</span></div><div className="voice-grid"><div><span className="eyebrow">AL GUARDAR</span><h3>Tu corte está guardado.</h3><p>La información sigue disponible en este equipo.</p></div><div><span className="eyebrow">AL REVISAR</span><h3>Hay 2 conceptos por completar.</h3><p>Agrega su unidad de medida para continuar.</p></div><div><span className="eyebrow">AL ACOMPAÑAR</span><h3>Vamos por partes.</h3><p>Primero, elige el presupuesto de tu obra.</p></div></div>
        </>}

        {section === 'logos' && <>
          <div className="logo-explainer"><div className="logo-blueprint"><div className="blueprint-grid" /><Logo c={c} kind="symbol" variant="mono" /><span>RETÍCULA BASE / 64 × 64</span></div><div><span className="eyebrow">EL SÍMBOLO DE {c.name.toUpperCase()}</span><h2 style={{ fontFamily: c.font }}>{c.id === 'linde' ? 'Tres piezas. Una referencia.' : c.id === 'enlace' ? 'El punto donde conectamos.' : 'Una capa sobre otra.'}</h2><p>{c.symbolStory}</p><div className="personality-tags">{c.personality.map(p => <span key={p}>{p}</span>)}</div></div></div>
          <div className="section-title"><h2>Una firma para cada formato.</h2><span>Selecciona un activo para ampliarlo y descargarlo.</span></div><div className="asset-grid logo-assets">{assetKinds.map(k => card(getAsset(c, k)))}</div>
          <div className="section-title"><h2>También en una sola tinta.</h2></div><div className="mono-pair">{card(getAsset(c, 'horizontal', 'mono'))}{card(getAsset(c, 'horizontal', 'inverse'))}</div>
          <div className="usage-rules"><div><span>01 / AIRE</span><h3>Deja espacio.</h3><p>Reserva al menos ¼ del alto del símbolo alrededor de la firma.</p></div><div><span>02 / ESCALA</span><h3>Que se siga leyendo.</h3><p>Símbolo desde 24 px y firma horizontal desde 120 px. Revisa siempre el soporte final.</p></div><div><span>03 / INTEGRIDAD</span><h3>Conserva su forma.</h3><p>Sin estirar, añadir sombras ni mezclar las paletas de las tres propuestas.</p></div></div>
        </>}

        {section === 'colors' && <>
          <div className="color-balance"><span>UN POCO DE COLOR.<br />MUCHO ESPACIO PARA PENSAR.</span><div><i style={{ background: c.paper, flex: 7 }} /><i style={{ background: c.ink, flex: 2 }} /><i style={{ background: c.color, flex: 1 }} /></div><p>Referencia de composición: 70% fondo · 20% tinta y estructura · 10% acentos.</p></div>
          <div className="color-list">{c.palette.map(p => { const contrast = ratio(p.hex, p.text); return <div className="color-row" key={p.name}><button className="color-swatch" style={{ background: p.hex, color: p.text }} onClick={() => copy(p.hex)} aria-label={`Copiar ${p.name} ${p.hex}`}><span>Aa</span><span>{p.hex}<Copy size={16} /></span></button><div><span className="eyebrow">{p.role}</span><h3>{p.name}</h3><p>{p.use}</p><div className="contrast-note"><CheckCheck size={15} /><span>Contraste con {p.text}: {contrast.toFixed(2)}:1 · {contrast >= 4.5 ? 'AA texto normal' : contrast >= 3 ? 'AA texto grande' : 'Solo decorativo'}</span></div></div></div>; })}</div>
          <div className="download-strip"><div><h3>El sistema, listo para código.</h3><p>Los mismos colores para web, diseño y Flutter.</p></div><div className="download-links"><a className="button secondary" href={`/assets/${c.id}/tokens.css`} download>CSS <Download size={15} /></a><a className="button secondary" href={`/assets/${c.id}/tokens.json`} download>JSON <Download size={15} /></a><a className="button" href={`/assets/${c.id}/trazal_colors.dart`} download>Flutter <Download size={15} /></a></div></div>
        </>}

        {section === 'typography' && <>
          <div className="type-playground"><div className="type-meta"><span>{c.font} / DISPLAY</span><span>01 — 09 / Aa — Zz</span></div><div className="type-live" style={{ fontFamily: c.font, fontSize: `clamp(28px, 7vw, ${fontSize}px)` }}>{sample || 'Escribe algo aquí.'}</div><div className="type-controls"><label>Prueba una frase<input value={sample} maxLength={100} onChange={e => setSample(e.target.value)} /></label><label>Tamaño <span>{fontSize} px</span><input type="range" min="28" max="96" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} /></label></div></div>
          <div className="type-pair"><div><span className="eyebrow">PERSONALIDAD / {c.font.toUpperCase()}</span><div className="type-big" style={{ fontFamily: c.font }}>Aa</div><p style={{ fontFamily: c.font }}>Un buen comienzo.<br />Una mejor perspectiva.</p><small>Titulares, frases de marca y piezas editoriales.</small></div><div><span className="eyebrow">TRABAJO DIARIO / DM SANS</span><div className="type-numbers">0123456789<br />$1,284,560.00</div><p>Presupuesto · Avance · Costos<br />El próximo corte, con todo en orden.</p><small>Interfaz, tablas, textos largos y números tabulares.</small></div></div>
          <div className="type-scale">{[['Titular', '48 / 52', 'Cada trazo cuenta.'], ['Sección', '28 / 34', 'Una mirada a tu obra.'], ['Cuerpo', '16 / 25', 'Todo lo que necesitas para preparar el siguiente corte.'], ['Etiqueta', '12 / 18', 'ÚLTIMA ACTUALIZACIÓN · HOY']].map(([role, size, text], i) => <div key={role}><span>{role}<small>{size} px</small></span><p style={{ fontSize: [42, 28, 16, 12][i], fontFamily: i < 2 ? c.font : 'DM Sans' }}>{text}</p></div>)}</div>
          <div className="note-block">Las fuentes tienen licencia SIL Open Font License y están incluidas en el ZIP de cada propuesta. Los logotipos SVG ya están convertidos a trazados.</div>
        </>}

        {section === 'icons' && <>
          <div className="icon-system-heading"><div><span className="eyebrow">SISTEMA / 12 ICONOS</span><h2>{c.id === 'linde' ? 'Precisión en cada esquina.' : c.id === 'enlace' ? 'Un gesto más cercano.' : 'Líneas que dejan respirar.'}</h2><p>{c.id === 'linde' ? 'Terminales rectas y uniones definidas. Una familia que recuerda el dibujo técnico.' : c.id === 'enlace' ? 'Terminales redondas y un trazo ligeramente más presente. La misma claridad, con un gesto suave.' : 'Un trazo fino, terminales suaves y menos peso visual. Diseñada para convivir con una voz editorial.'}</p></div><div className="icon-size-demo">{[24, 32, 48, 64].map(s => <div key={s}><img src={`/assets/${c.id}/icons/obra.svg`} style={{ width: s, height: s }} alt={`Obra a ${s} píxeles`} /><span>{s}px</span></div>)}</div></div>
          <div className="icon-grid">{manifest.filter(a => a.direction === c.id && a.kind === 'icon').map(a => <button key={a.name} onClick={() => open(a)}><img src={a.svg} alt="" /><span>{a.name}</span><ArrowUpRight size={13} /></button>)}</div>
          <div className="note-block">Dibujados para este kit sobre retícula de 32 × 32. SVG editables y PNG transparentes de 256 px. En botones pequeños, acompaña el icono con una etiqueta accesible.</div>
          <div className="section-title"><h2>El icono que se queda en el escritorio.</h2><span>Color · Monocromo · Negativo</span></div><div className="app-icon-variants">{['color', 'mono', 'inverse'].map(v => card(getAsset(c, 'app-icon', v)))}</div>
        </>}

        {section === 'applications' && <>
          <div className="section-title first"><div><span className="eyebrow">01 / PRODUCTO DIGITAL</span><h2>Una herramienta para estar a gusto.</h2></div><span>Prueba las pestañas del ejemplo.</span></div><AppPreview c={c} />
          <div className="section-title"><div><span className="eyebrow">02 / FUERA DE LA PANTALLA</span><h2>Del escritorio a la obra.</h2></div></div>
          <div className="application-grid"><div className="business-stationery"><div className="business-back"><Logo c={c} kind="symbol" variant={c.id === 'estrato' ? 'inverse' : 'mono'} /></div><div className="business-front"><Logo c={c} /><div><strong>Andrea Méndez</strong><span>Ingeniería y control de obra</span></div><small>Nombre y contacto de ejemplo<br />hola@trazal.example</small></div><span className="application-caption">Tarjeta de presentación / composición ilustrativa</span></div><button className="poster-preview" onClick={() => open(getAsset(c, 'poster'))}><img src={`/assets/${c.id}/poster.svg`} alt={`Cartel de marca ${c.name}`} /><span className="expand-icon"><Maximize2 size={18} /></span></button><div className="report-scene"><div className="report-paper"><Logo c={c} /><span className="report-type">REPORTE DE OBRA / 012</span><h3>Un corte.<br />Toda la<br /><em>perspectiva.</em></h3><div className="report-line" /><p>Camino del Norte<br />02 de octubre de 2026</p><footer>DOCUMENTO DE EJEMPLO<span>01</span></footer></div><span className="application-caption">Portada de reporte / documento ilustrativo</span></div></div>
        </>}

        {section === 'compare' && <>
          <div className="compare-grid">{directions.map((d, i) => <article key={d.id} className={`compare-column ${d.id === identity.selectedDirection ? 'chosen-column' : ''}`} style={vars(d)}><div className="compare-header"><span>{d.number} / {d.id === identity.selectedDirection ? 'IDENTIDAD ELEGIDA' : 'EXPLORACIÓN'}</span><h2>{d.name}</h2><p>{d.short}</p></div><div className="compare-logo"><Logo c={d} variant={d.id === 'estrato' ? 'inverse' : 'mono'} /></div><div className="compare-symbol"><Logo c={d} kind="app-icon" /><span style={{ fontFamily: d.font }}>Aa<br /><small>{d.font}</small></span></div><div className="compare-swatches">{d.palette.map(p => <button key={p.hex} style={{ background: p.hex }} onClick={() => copy(p.hex)} aria-label={`Copiar ${d.name} ${p.name} ${p.hex}`} />)}</div><div className="compare-description"><span className="eyebrow">SU MANERA DE SER</span><p>{d.description}</p><span className="eyebrow">SU VOZ</span><p>{d.voice}</p></div><div className="compare-actions">{identityStatus(d)}<button className="text-button" onClick={() => { select(i); go('overview'); }}>Explorar {d.name} <ArrowUpRight size={16} /></button><a href={`/downloads/trazal-${d.id}.zip`} download className="text-button">Descargar propuesta <Download size={15} /></a></div></article>)}</div>
          <div className="note-block">La elección del equipo es Linde. Enlace y Estrato se conservan como propuestas de exploración. El nombre Trazal sigue pendiente de validación de marca y dominio.</div>
        </>}

        {section === 'library' && <>
          <div className="library-hero"><div><span className="eyebrow">EL KIT COMPLETO</span><h2>Todas las piezas.<br />Un mismo lugar.</h2><p>Linde elegida + 2 propuestas de exploración · Logos SVG y PNG · 12 iconos por propuesta<br />Paletas CSS, JSON y Dart · Fuentes y licencias</p><a className="button" href="/downloads/trazal-kit-completo.zip" download><Download size={17} /> Descargar todo</a></div><div className="library-folder"><div className="folder-tab" /><span>trazal / brand assets</span><div className="folder-logos">{directions.map(d => <Logo key={d.id} c={d} kind="app-icon" />)}</div><small>SVG · PNG · CSS · JSON · DART · TTF</small></div></div>
          <div className="individual-downloads">{directions.map(d => <a key={d.id} href={`/downloads/trazal-${d.id}.zip`} download><i style={{ background: d.color }} /><span>{d.name}<small>{d.id === identity.selectedDirection ? 'Identidad elegida · ZIP' : 'Exploración · ZIP'}</small></span><Download size={17} /></a>)}</div>
          <div className="library-toolbar"><label className="search-field"><Search size={17} /><input type="search" placeholder="Buscar logos, iconos, propuestas…" value={query} onChange={e => setQuery(e.target.value)} aria-label="Buscar activos" /></label><select value={filter} onChange={e => setFilter(e.target.value)} aria-label="Filtrar por propuesta"><option value="all">Todas las propuestas</option>{directions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select><span>{filtered.length} activos</span></div>
          {filtered.length ? <div className="asset-grid library-grid">{filtered.map(card)}</div> : <div className="empty-state"><Search size={30} /><h3>No encontramos ese activo.</h3><p>Prueba con “símbolo”, “obra” o el nombre de una propuesta.</p><button className="button secondary" onClick={() => { setQuery(''); setFilter('all'); }}>Limpiar búsqueda</button></div>}
        </>}

        <footer className="page-footer"><span>trazal<span className="footer-dot">.</span> <small>ESTUDIO DE MARCA</small></span><span>Hecho con intención. / Linde, identidad elegida</span><button className="text-button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Volver arriba <ArrowDown className="arrow-up" size={14} /></button></footer>
      </main>
    </div>
    {toast && <div className="toast" role="status"><Check size={17} />{toast}</div>}
    <dialog ref={dialog} className="asset-dialog" onCancel={() => setModal(null)} onClick={e => { if (e.target === dialog.current) { const r = dialog.current.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) setModal(null); } }} aria-labelledby="asset-title">
      {modal && currentAsset && <><header><div><span className="eyebrow">{modalDirection.name} / ACTIVO DE MARCA</span><h2 id="asset-title">{modal.name}</h2></div><button className="icon-button" onClick={() => setModal(null)} aria-label="Cerrar vista del activo"><X size={22} /></button></header><div className={`modal-preview bg-${background}`}><img src={currentAsset.svg} alt={`${modal.name} de ${modalDirection.name}`} style={{ transform: `scale(${zoom})` }} /></div><div className="preview-tools"><div><button className="icon-button" onClick={() => setZoom(Math.max(.5, zoom - .25))} disabled={zoom <= .5} aria-label="Reducir"><Minus size={17} /></button><span>{Math.round(zoom * 100)}%</span><button className="icon-button" onClick={() => setZoom(Math.min(2, zoom + .25))} disabled={zoom >= 2} aria-label="Ampliar"><Plus size={17} /></button></div><div aria-label="Fondo de vista previa">{[['grid', 'Transparente'], ['light', 'Claro'], ['dark', 'Oscuro']].map(([id, title]) => <button key={id} className={`background-choice choice-${id}`} onClick={() => setBackground(id)} aria-label={`Fondo ${title}`} aria-pressed={background === id} />)}</div></div><div className="modal-controls">{!['icon', 'poster'].includes(modal.kind) && <label>Versión<select value={variant} onChange={e => { setVariant(e.target.value); if (e.target.value === 'inverse') setBackground('dark'); }}><option value="color">Color</option><option value="mono">Monocromo</option><option value="inverse">Negativo</option></select></label>}<label>Formato<select value={format} onChange={e => setFormat(e.target.value)}><option value="svg">SVG · Vector editable</option><option value="png">PNG · Alta resolución</option></select></label><a className="button" href={format === 'svg' ? currentAsset.svg : currentAsset.png} download={`trazal-${modal.direction}-${modal.kind}-${modal.kind === 'icon' ? modal.name.toLowerCase() : variant}.${format}`}><Download size={17} /> Descargar</a></div><p className="modal-note">{format === 'svg' ? 'Vectores editables. Logotipos con letras trazadas, sin dependencia de fuentes.' : 'PNG con transparencia. El icono de aplicación y el cartel incluyen su fondo.'}</p></>}
    </dialog>
  </div>;
}
