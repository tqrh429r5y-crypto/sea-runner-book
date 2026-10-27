// ============ LINGUE DEL SITO ============
// Il sito esiste in più lingue con indirizzi separati:
//   inglese  → searunner.it/...      (lingua principale, nessun prefisso)
//   italiano → searunner.it/it/...
//   francese → searunner.it/fr/...   (in futuro: basta togliere il commento qui sotto e creare fr.js)
//
// I testi stanno in un file per lingua (en.js, it.js, ...) con le STESSE chiavi.
// Se in una lingua manca un testo, si usa quello inglese (così il sito non si rompe mai).
//
// IMPORTANTE: le email delle richieste a Sea Runner restano SEMPRE in inglese,
// qualunque sia la lingua del sito (nel codice si usano i dati originali dei tour, non quelli tradotti).
import { useLocation } from 'react-router-dom';
import en from './en.js';
import it from './it.js';

export const LANGS = {
  en: { prefix: '', label: 'EN', name: 'English', htmlLang: 'en', locale: 'en-GB', ogLocale: 'en_US', formLang: 'EN' },
  it: { prefix: '/it', label: 'IT', name: 'Italiano', htmlLang: 'it', locale: 'it-IT', ogLocale: 'it_IT', formLang: 'IT' },
  // fr: { prefix: '/fr', label: 'FR', name: 'Français', htmlLang: 'fr', locale: 'fr-FR', ogLocale: 'fr_FR', formLang: 'FR' },
};

const DICTS = { en, it };

export const DEFAULT_LANG = 'en';
export const LANG_CODES = Object.keys(LANGS);

// lingua dell'indirizzo: /it/... → 'it', tutto il resto → inglese
export function getLangFromPath(pathname = '/') {
  for (const code of LANG_CODES) {
    const pre = LANGS[code].prefix;
    if (pre && (pathname === pre || pathname.startsWith(pre + '/'))) return code;
  }
  return DEFAULT_LANG;
}

// toglie il prefisso della lingua: /it/booking/sunset → /booking/sunset
export function stripLang(pathname = '/') {
  const pre = LANGS[getLangFromPath(pathname)].prefix;
  if (!pre) return pathname;
  return pathname.slice(pre.length) || '/';
}

// aggiunge il prefisso della lingua: ('/booking', 'it') → '/it/booking' · ('/#faq', 'it') → '/it#faq'
export function localizePath(path, code) {
  const pre = LANGS[code]?.prefix || '';
  if (!pre) return path;
  const m = path.match(/^([^?#]*)(.*)$/);
  const base = m[1] || '/';
  return (base === '/' ? pre : pre + base) + m[2];
}

// lo stesso indirizzo in un'altra lingua (per il selettore EN / IT)
export function switchLangPath(pathname, search, hash, code) {
  return localizePath(stripLang(pathname) + (search || '') + (hash || ''), code);
}

export function translate(code, key, ...args) {
  let v = DICTS[code]?.[key];
  if (v === undefined) v = DICTS[DEFAULT_LANG][key];
  if (v === undefined) return key;
  return typeof v === 'function' ? v(...args) : v;
}

// testi del tour nella lingua scelta (solo per MOSTRARLI: prezzi, slot e logica restano quelli originali)
export function localizeTour(tour, code) {
  if (!tour) return tour;
  const tr = DICTS[code]?.tours?.[tour.id];
  if (!tr) return tour;
  const { itineraryOptions: optTr, timeOfDay: todTr, ...rest } = tr;
  return {
    ...tour,
    ...rest,
    itineraryOptions: tour.itineraryOptions?.map(o => ({ ...o, ...(optTr?.[o.id] || {}) })),
    timeOfDay: tour.timeOfDay?.map(td => ({ ...td, ...(todTr?.[td.id] || {}) })),
  };
}

export function useLang() {
  const { pathname } = useLocation();
  const lang = getLangFromPath(pathname);
  return {
    lang,
    ...LANGS[lang],
    t: (key, ...args) => translate(lang, key, ...args),
    p: (path) => localizePath(path, lang),
    tr: (tour) => localizeTour(tour, lang),
  };
}
