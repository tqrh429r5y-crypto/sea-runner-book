// ============ PRERENDER DELLE PAGINE ============
// Gira dopo "vite build" (vedi package.json → "build").
// Per ogni pagina della sitemap salva un file HTML già pieno: dist/<pagina>/index.html.
// Il visitatore vede subito il contenuto; poi il sito "normale" (src/main.jsx) prende il controllo
// e ridisegna la stessa pagina, identica. Google, Bing e WhatsApp leggono il file già pieno.
//
// Se il prerender di una pagina fallisce, quella pagina resta come prima (index.html vuoto):
// il sito funziona comunque, e la build si ferma con un messaggio chiaro.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const ssrDir = resolve(root, 'dist-ssr');

// pagine da preparare: le stesse 27 della sitemap (9 per lingua)
const SLUGS = ['cinque-terre', 'golfo-dei-poeti', 'portofino', 'half-day', 'sunset', 'tailored'];
const BASE = ['/', '/boat', '/booking', ...SLUGS.map(s => `/booking/${s}`)];
const PREFIXES = ['', '/it', '/fr'];
const ROUTES = PREFIXES.flatMap(pre => BASE.map(p => (pre ? (p === '/' ? pre : pre + p) : p)));

const template = readFileSync(resolve(dist, 'index.html'), 'utf8');
const { render } = await import(pathToFileURL(resolve(ssrDir, 'entry-server.js')).href);

// toglie dal modello i meta "di riserva" (quelli con data-rh="true") e il titolo:
// ogni pagina mette i suoi, presi da react-helmet
const baseHead = template
  .replace(/<title>[\s\S]*?<\/title>/, '')
  .replace(/^\s*<meta[^>]*data-rh="true"[^>]*\/>\s*$/gm, '');

let count = 0;
for (const url of ROUTES) {
  const { html, helmet } = render(url);
  if (!html || !helmet) throw new Error(`Prerender vuoto per ${url}`);
  const head = [
    helmet.title.toString(),
    helmet.meta.toString(),
    helmet.link.toString(),
    helmet.script.toString(),
  ].join('\n    ');
  const lang = (url.startsWith('/it') ? 'it' : url.startsWith('/fr') ? 'fr' : 'en');
  const page = baseHead
    .replace('<html lang="en">', `<html lang="${lang}">`)
    .replace('</head>', `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
  const out = url === '/' ? resolve(dist, 'index.html') : resolve(dist, `.${url}`, 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, page);
  count++;
}

// pagine non preparate (privacy, conferma, tour inesistenti) e pagina 404:
// usano il modello "vuoto" di prima, così non mostrano per un attimo il testo della home
writeFileSync(resolve(dist, 'shell.html'), template);
writeFileSync(resolve(dist, '404.html'), template);
rmSync(ssrDir, { recursive: true, force: true });
console.log(`Prerender: ${count} pagine pronte.`);
