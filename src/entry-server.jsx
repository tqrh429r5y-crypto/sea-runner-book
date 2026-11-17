// ============ PRERENDER (solo in fase di build) ============
// Usato da scripts/prerender.mjs: disegna una pagina del sito in HTML "già pieno",
// così Google, Bing e le anteprime di WhatsApp leggono testo, titolo e foto senza aspettare il JavaScript.
// Nel browser non viene mai usato: lì il sito parte da src/main.jsx come sempre.
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { AppRoutes } from './App.jsx';

export function render(url) {
  const helmetContext = {};
  const html = renderToString(
    <StaticRouter location={url}>
      <AppRoutes helmetContext={helmetContext} />
    </StaticRouter>
  );
  return { html, helmet: helmetContext.helmet };
}
