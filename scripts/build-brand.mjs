import fs from 'node:fs/promises';
import * as fontkit from 'fontkit';
import sharp from 'sharp';
import JSZip from 'jszip';

const directions = JSON.parse(await fs.readFile('src/brand-data.json', 'utf8'));
const svg = (w,h,body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
function text(font, value, x, y, size, color, tracking = -.035) {
  const {glyphs,positions} = font.layout(value); let cursor = 0; let paths = '';
  glyphs.forEach((g,i) => { const p = positions[i]; paths += `<path fill="${color}" transform="translate(${x+(cursor+p.xOffset)*size/font.unitsPerEm} ${y-p.yOffset*size/font.unitsPerEm}) scale(${size/font.unitsPerEm} ${-size/font.unitsPerEm})" d="${g.path.toSVG()}"/>`; cursor += p.xAdvance + tracking*font.unitsPerEm; });
  return { paths, width: cursor*size/font.unitsPerEm };
}
function mark(id, color) {
  if(id === 'linde') return `<path fill="${color}" d="M8 10h48v13H8zM25 27h14v29H25zM43 27h13v13H43z"/>`;
  if(id === 'enlace') return `<path fill="${color}" d="M9 17h46a7 7 0 0 1 0 14H9a7 7 0 0 1 0-14Zm15-7a7 7 0 0 1 14 0v3H24Zm0 25h14v7a8 8 0 0 0 8 8h8v12h-9c-12 0-21-8-21-20Z"/>`;
  return `<path fill="${color}" d="m5 10 42-4 12 12-42 4Zm12 17 30-3 12 12-30 3Zm12 17 18-2 12 12-18 2Z"/>`;
}
const icons = {
  obra:{name:'Obra',body:'<path d="M5 26h22M8 26V13l8-7 8 7v13M13 26v-8h6v8M6 11l10-9 10 9"/>'},
  presupuesto:{name:'Presupuesto',body:'<rect x="7" y="3" width="18" height="26" rx="2"/><path d="M11 9h10M11 14h3m4 0h3m-10 5h3m4 0h3m-10 5h3m4 0h3"/>'},
  programa:{name:'Programa',body:'<path d="M6 4v24h22M11 8h14M11 14h8M19 20h9"/><path d="M11 6v4m8 2v4m9 2v4"/>'},
  avance:{name:'Avance',body:'<path d="M4 26h24M5 22l7-7 6 3 9-13M21 5h6v6"/>'},
  costos:{name:'Costos',body:'<circle cx="16" cy="16" r="12"/><path d="M20 11h-6a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6h-6M16 8v3m0 12v3"/>'},
  corte:{name:'Corte',body:'<path d="M5 7h22v21H5zM10 3v8m12-8v8M5 14h22M11 21l3 3 7-6"/>'},
  documento:{name:'Documento',body:'<path d="M8 3h11l6 6v20H8zM19 3v7h6M12 16h9m-9 5h9"/>'},
  equipo:{name:'Equipo',body:'<circle cx="12" cy="10" r="4"/><path d="M3 27v-4a9 9 0 0 1 18 0v4M23 6a4 4 0 0 1 0 8m2 5a7 7 0 0 1 4 7"/>'},
  respaldo:{name:'Respaldo',body:'<path d="M5 11h22v17H5zM3 5h26v6H3zM12 17h8M16 17v7m-3-3 3 3 3-3"/>'},
  terreno:{name:'Terreno',body:'<path d="m3 11 13-7 13 7-13 7Zm0 6 13 7 13-7M3 23l13 7 13-7"/>'},
  medida:{name:'Medida',body:'<path d="m5 22 17-17 6 6-17 17ZM9 18l3 3m1-7 3 3m1-7 3 3"/>'},
  ubicacion:{name:'Ubicación',body:'<path d="M25 12c0 7-9 17-9 17S7 19 7 12a9 9 0 0 1 18 0Z"/><circle cx="16" cy="12" r="3"/>'}
};
await fs.mkdir('public/downloads',{recursive:true});
const manifest=[];
for(const c of directions){
  const dir=`public/assets/${c.id}`; await fs.mkdir(dir+'/icons',{recursive:true});
  const font=fontkit.openSync(`public/fonts/${c.fontFile}.ttf`).getVariation({wght:c.weight});
  const bodyFont=fontkit.openSync('public/fonts/dm-sans.ttf').getVariation({wght:500});
  const word=(color,size=160,x=0,y=160)=>text(font,'trazal',x,y,size,color,c.id==='estrato'?-.045:-.04);
  for(const variant of ['color','mono','inverse']) {
    const fg=variant==='inverse'?c.paper:variant==='mono'?c.ink:c.id==='estrato'?c.color:c.ink;
    const wm=word(fg); const width=Math.ceil(wm.width+32);
    const horizontalWord=word(fg,150,155,156);
    const stackedWord=word(fg,120);
    const label=text(bodyFont,'CONTROL DE OBRA',0,0,12,fg,.16);
    const entries=[
      ['wordmark','Logotipo',width,194,word(fg,160,16,158).paths],
      ['horizontal','Firma horizontal',Math.ceil(horizontalWord.width+177),194,`<g transform="translate(10 33) scale(1.9)">${mark(c.id,fg)}</g>${horizontalWord.paths}`],
      ['stacked','Firma vertical',360,300,`<g transform="translate(125 20) scale(1.7)">${mark(c.id,fg)}</g>${word(fg,120,(360-stackedWord.width)/2,244).paths}<g transform="translate(${(360-label.width)/2} 278)">${label.paths}</g>`],
      ['symbol','Símbolo',128,128,`<g transform="translate(8 8) scale(1.75)">${mark(c.id,fg)}</g>`],
      ['app-icon','Icono de aplicación',512,512,`<rect width="512" height="512" rx="${c.id==='enlace'?130:100}" fill="${variant==='color'?c.color:variant==='mono'?c.ink:c.paper}"/><g transform="translate(76 76) scale(5.625)">${mark(c.id,variant==='color'?c.onColor:variant==='mono'?c.paper:c.ink)}</g>`]
    ];
    for(const [kind,name,w,h,b] of entries){
      const value=svg(w,h,b); const file=`${dir}/${kind}-${variant}`;
      await fs.writeFile(file+'.svg',value);
      await sharp(Buffer.from(value)).resize({width:kind==='app-icon'?1024:1600}).png().toFile(file+'.png');
      manifest.push({direction:c.id,kind,name,variant,svg:`/assets/${c.id}/${kind}-${variant}.svg`,png:`/assets/${c.id}/${kind}-${variant}.png`});
    }
  }
  for(const [id,icon] of Object.entries(icons)){
    const value=svg(32,32,`<g fill="none" stroke="${c.ink}" stroke-width="${c.id==='linde'?1.7:c.id==='enlace'?2:1.5}" stroke-linecap="${c.id==='linde'?'square':'round'}" stroke-linejoin="${c.id==='linde'?'miter':'round'}">${icon.body}</g>`);
    await fs.writeFile(`${dir}/icons/${id}.svg`,value);
    await sharp(Buffer.from(value)).resize(256).png().toFile(`${dir}/icons/${id}.png`);
    manifest.push({direction:c.id,kind:'icon',name:icon.name,variant:'mono',svg:`/assets/${c.id}/icons/${id}.svg`,png:`/assets/${c.id}/icons/${id}.png`});
  }
  const tokens={name:`Trazal / ${c.name}`,status:'Propuesta de identidad · v0.1',colors:{primary:c.color,onPrimary:c.onColor,background:c.paper,text:c.ink,surface:c.soft,accent:c.accent},typography:{display:c.font,body:'DM Sans'},radius:{control:c.id==='linde'?6:c.id==='enlace'?14:4},spacing:{unit:4}};
  await fs.writeFile(`${dir}/tokens.json`,JSON.stringify(tokens,null,2));
  await fs.writeFile(`${dir}/tokens.css`,`:root {\n${Object.entries(tokens.colors).map(([key,v])=>`  --trazal-${key}: ${v};`).join('\n')}\n  --trazal-font-display: '${c.font}';\n  --trazal-font-body: 'DM Sans';\n  --trazal-radius: ${tokens.radius.control}px;\n}\n`);
  await fs.writeFile(`${dir}/trazal_colors.dart`,`// Trazal ${c.name} — propuesta v0.1. Colores sRGB.\nimport 'package:flutter/material.dart';\n\nabstract final class TrazalColors {\n${Object.entries(tokens.colors).map(([k,v])=>`  static const ${k} = Color(0xFF${v.slice(1)});`).join('\n')}\n}\n`);
  const backdrop=c.id==='estrato'?c.color:c.color;
  const headline=c.id==='linde'?['Cada trazo','cuenta.']:c.id==='enlace'?['Todo toma','forma.']:['Hecho sobre','una buena','base.'];
  const poster=svg(800,1000,`<rect width="800" height="1000" fill="${backdrop}"/>${text(bodyFont,'TRAZAL / '+c.name.toUpperCase(),56,64,14,c.onColor,.1).paths}${headline.map((line,i)=>text(font,line,52,270+i*110,c.id==='estrato'?85:100,c.onColor,-.04).paths).join('')}<g transform="translate(530 650) scale(3)">${mark(c.id,c.onColor)}</g>${text(bodyFont,'Control de obra. Con otra perspectiva.',56,897,23,c.onColor).paths}${text(bodyFont,'PROPUESTA DE IDENTIDAD / 2026',56,952,12,c.onColor,.08).paths}`);
  await fs.writeFile(`${dir}/poster.svg`,poster); await sharp(Buffer.from(poster)).resize(1200).png().toFile(`${dir}/poster.png`);
  manifest.push({direction:c.id,kind:'poster',name:'Cartel de marca',variant:'color',svg:`/assets/${c.id}/poster.svg`,png:`/assets/${c.id}/poster.png`});
  const notes=`# Trazal — ${c.name}\n\nPropuesta de identidad v0.1, pendiente de elección.\n\n${c.description}\n\n## Idea del símbolo\n${c.symbolStory}\n\n## Color\n${c.palette.map(p=>`- ${p.name}: ${p.hex}. ${p.role}. ${p.use}`).join('\n')}\n\n## Tipografía\nTitulares: ${c.font}. Interfaz y textos: DM Sans. Licencias SIL OFL incluidas en fonts/.\n\n## Uso\n- Mantener proporciones. Espacio de seguridad recomendado: un cuarto del alto del símbolo.\n- Mínimos propuestos: símbolo 24 px; firma horizontal 120 px. Revisar en el soporte final.\n- SVG con logotipos trazados; no necesitan fuentes instaladas.\n- PNG con transparencia, excepto icono de aplicación y cartel.\n- No mezclar paletas entre propuestas.\n- Paleta sRGB: convertir con un perfil de impresión antes de producción física.\n- Registrar una marca o disponer de un dominio no forma parte de esta exploración.\n\n## Flutter\ntrazal_colors.dart contiene constantes de color. Registrar las fuentes en pubspec.yaml y definir el ThemeData de la aplicación. Estos tokens no constituyen por sí solos un tema completo.\n`;
  await fs.writeFile(`${dir}/LEEME.md`,notes);
  const zip=new JSZip();
  async function addTree(path,prefix){for(const e of await fs.readdir(path,{withFileTypes:true})){if(e.isDirectory())await addTree(path+'/'+e.name,prefix+e.name+'/');else zip.file(prefix+e.name,await fs.readFile(path+'/'+e.name));}}
  await addTree(dir,'assets/');
  for(const f of new Set([c.fontFile,'dm-sans']))for(const ext of ['.ttf','.woff2','-OFL.txt'])zip.file('fonts/'+f+ext,await fs.readFile('public/fonts/'+f+ext));
  await fs.writeFile(`public/downloads/trazal-${c.id}.zip`,await zip.generateAsync({type:'nodebuffer',compression:'DEFLATE'}));
}
await fs.writeFile('src/asset-manifest.json',JSON.stringify(manifest,null,2));
const all=new JSZip();
for(const c of directions){const pack=await JSZip.loadAsync(await fs.readFile(`public/downloads/trazal-${c.id}.zip`));for(const [path,file]of Object.entries(pack.files))if(!file.dir)all.file(c.id+'/'+path,await file.async('nodebuffer'));}
all.file('LEEME.md','# Trazal — Estudio de marca\n\nTres propuestas originales: Linde, Enlace y Estrato. Cada carpeta incluye logos SVG y PNG, doce iconos, cartel, tokens CSS/JSON/Dart y fuentes con sus licencias.\n\nLas tres direcciones son exploratorias; no se ha aprobado una identidad final ni comprobado el registro de marca.\n');
await fs.writeFile('public/downloads/trazal-kit-completo.zip',await all.generateAsync({type:'nodebuffer',compression:'DEFLATE'}));
console.log(`Generados ${manifest.length} activos, 3 kits individuales y el kit completo.`);
