// /api/calendar.js
// Proxy serverless di Sea Runner per leggere il Google Calendar pubblico (.ics).
// Sostituisce i proxy CORS gratuiti (corsproxy.io, allorigins, codetabs) che erano
// cronicamente instabili. Gira sui server Vercel, dove il blocco CORS del browser
// non si applica: scarica il file .ics da Google e lo restituisce al sito.
//
// URL pubblico una volta deployato: https://searunner.it/api/calendar

const GOOGLE_CALENDAR_ICS_URL =
  'https://calendar.google.com/calendar/ical/searunnerprenotazioni%40gmail.com/public/basic.ics';

export default async function handler(req, res) {
  // permettiamo al browser di leggere la risposta (header CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  // i browser a volte fanno una richiesta "preflight" OPTIONS prima della GET
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  try {
    const response = await fetch(GOOGLE_CALENDAR_ICS_URL);
    if (!response.ok) {
      res.status(502).json({ error: `Google returned ${response.status}` });
      return;
    }
    const icsText = await response.text();

    // verifichiamo che sia davvero un file calendario valido
    if (!icsText.includes('BEGIN:VCALENDAR')) {
      res.status(502).json({ error: 'Invalid calendar content received from Google' });
      return;
    }

    // cache 5 minuti lato CDN Vercel: meno chiamate a Google, risposte piu' veloci.
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.status(200).send(icsText);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Proxy failed to fetch calendar' });
  }
}
