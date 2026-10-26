// /api/keep-alive.js
// Tiene sveglio il database Supabase (il piano gratuito va in pausa dopo 7 giorni senza attività).
// Viene chiamato ogni giorno da Vercel Cron (vedi "crons" in vercel.json).
// Sostituisce il workflow GitHub .github/workflows/keep-alive.yml, che GitHub disattiva
// da solo dopo 60 giorni senza commit nel repo. Il cron di Vercel non si disattiva.
//
// Fa solo una lettura minima (1 riga della tabella tours): nessuna scrittura, nessun effetto sul sito.

const SUPABASE_URL = 'https://pmumkqnozzplstyayoyg.supabase.co';
// anon key: pubblica per design (è la stessa usata in src/App.jsx)
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtdW1rcW5venpwbHN0eWF5b3lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NzMxOTgsImV4cCI6MjA5MjM0OTE5OH0.kXbtEw056YEHQAIQNKyrUMKv32T52wfQ-8Np144pHWg';

export default async function handler(req, res) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/tours?select=id&limit=1`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    });
    res.setHeader('Cache-Control', 'no-store');
    res.status(response.ok ? 200 : 502).json({
      ok: response.ok,
      supabaseStatus: response.status,
      at: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}
