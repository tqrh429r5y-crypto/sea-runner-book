import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Clock, Users, MapPin, Check, Wine, Utensils, Lock, LogOut, X, CheckCircle, XCircle, Globe, Sparkles, Info, Edit2, Save, Euro, Sunset, Sun, AlertCircle, Accessibility, RefreshCw, Menu, Anchor, Phone, Mail, Star, Droplets, Umbrella, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

// ============ GOOGLE CALENDAR SYNC ============
// l'app legge il google calendar "Prenotazioni" di sea runner tramite proxy CORS.
// il calendario è pubblico in modalità "solo disponibilità": gli orari sono preservati,
// i titoli sono tutti "Busy" — usiamo gli orari per classificare il tipo di slot occupato.
const GOOGLE_CALENDAR_ICS_URL = 'https://calendar.google.com/calendar/ical/searunnerprenotazioni%40gmail.com/public/basic.ics';
// proxy cors pubblici — proviamo in ordine: se il primo fallisce passiamo al secondo.
// quando un proxy va giù (capita coi servizi gratis) l'altro solitamente funziona.
const CORS_PROXIES = [
  (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
];

// converte una stringa UTC del formato "20260616T070000Z" in un oggetto Date
function parseIcsDate(str) {
  const m = str.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z?$/);
  if (!m) return null;
  return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]));
}

// dato un evento (DTSTART, DTEND in UTC), determina il tipo di slot in ora italiana.
// regole concordate:
//   durata >= 9h                       → full-day-extended (Portofino 10h)
//   durata 6-9h                        → full-day (Cinque Terre / Golfo 7h)
//   durata 3-5h, inizio prima delle 12 → half-day-morning
//   durata 3-5h, inizio 12-16          → half-day-afternoon
//   durata 3-5h, inizio dopo le 16     → sunset / evening
//   altri casi                         → full-day (fallback prudente: blocca mattina+pom)
function classifyCalendarEvent(startUtc, endUtc) {
  const durationHours = (endUtc - startUtc) / (1000 * 60 * 60);
  // converto l'inizio in ora Europa/Roma per leggere l'ora locale
  const startLocal = new Date(startUtc.toLocaleString('en-US', { timeZone: 'Europe/Rome' }));
  const startHour = startLocal.getHours();

  if (durationHours >= 9) return 'full-day-extended';
  if (durationHours >= 6) return 'full-day';
  if (durationHours >= 3) {
    if (startHour < 12) return 'half-day-morning';
    if (startHour < 16) return 'half-day-afternoon';
    return 'sunset';
  }
  // evento breve anomalo — lo trattiamo come full-day per prudenza
  return 'full-day';
}

// fa il fetch del .ics e restituisce un array di eventi normalizzati.
// prova in cascata i proxy CORS configurati: se uno fallisce passa al successivo.
async function fetchGoogleCalendarEvents() {
  let icsText = null;
  let lastError = null;

  for (const proxyFn of CORS_PROXIES) {
    try {
      const proxyUrl = proxyFn(GOOGLE_CALENDAR_ICS_URL);
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        lastError = `proxy returned ${response.status}`;
        continue;
      }
      const text = await response.text();
      // verifichiamo che sia davvero un .ics valido (non una pagina di errore HTML)
      if (!text.includes('BEGIN:VCALENDAR')) {
        lastError = 'proxy returned invalid content (not an ICS file)';
        continue;
      }
      icsText = text;
      console.log('[sea-runner] calendar synced via', proxyUrl.split('?')[0]);
      break;
    } catch (err) {
      lastError = err.message || String(err);
      continue;
    }
  }

  if (!icsText) {
    console.warn('[sea-runner] all CORS proxies failed, using internal bookings only. last error:', lastError);
    return null;
  }

  try {
    const events = [];
    const blocks = icsText.split('BEGIN:VEVENT').slice(1);
    for (const block of blocks) {
      const startMatch = block.match(/DTSTART[^:]*:([0-9TZ]+)/);
      const endMatch = block.match(/DTEND[^:]*:([0-9TZ]+)/);
      if (!startMatch || !endMatch) continue;

      const startUtc = parseIcsDate(startMatch[1]);
      const endUtc = parseIcsDate(endMatch[1]);
      if (!startUtc || !endUtc) continue;

      const slotType = classifyCalendarEvent(startUtc, endUtc);
      let part = null;
      if (slotType === 'half-day-morning') part = 'morning';
      else if (slotType === 'half-day-afternoon') part = 'afternoon';
      else if (slotType === 'sunset') part = 'evening';

      let normalizedSlot = slotType;
      if (slotType === 'half-day-morning' || slotType === 'half-day-afternoon') {
        normalizedSlot = 'half-day-choice';
      }

      events.push({
        date: new Date(startUtc),
        slotType: normalizedSlot,
        part,
        source: 'gcal'
      });
    }
    return events;
  } catch (error) {
    console.warn('[sea-runner] ICS parsing failed:', error);
    return null;
  }
}

// ============ LOGO ============
function SeaRunnerLogoCompact({ size = 'sm' }) {
  const sizes = { sm: 50, md: 80 };
  const s = sizes[size];
  return (
    <svg width={s*2} height={s} viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 20,40 Q 60,15 100,35 Q 140,20 180,35" stroke="#60a5fa" strokeWidth="10" fill="none" strokeLinecap="round"/>
      <path d="M 25,55 Q 65,30 105,50 Q 145,35 180,50" stroke="#3b82f6" strokeWidth="9" fill="none" strokeLinecap="round"/>
      <path d="M 110,48 Q 140,40 170,48" stroke="#fbbf24" strokeWidth="7" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

// icona whatsapp (lucide-react non la include, la inlineo)
function WhatsAppIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

// numero whatsapp sea runner (formato internazionale senza + e senza spazi)
const WHATSAPP_NUMBER = '393488289438';

// costruisce un link whatsapp con messaggio precompilato
function whatsappLink(prefilledMessage = '') {
  const encoded = encodeURIComponent(prefilledMessage);
  return `https://wa.me/${WHATSAPP_NUMBER}${encoded ? `?text=${encoded}` : ''}`;
}

// bottone floating whatsapp visibile in tutte le pagine cliente
function WhatsAppFloatingButton({ message = 'Hi! I would like to know more about your tours.' }) {
  return (
    <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-lg hover:shadow-xl transition-all p-4 flex items-center justify-center group"
      style={{ boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)' }}
      title="Chat with us on WhatsApp">
      <WhatsAppIcon className="w-6 h-6" />
      <span className="absolute right-full mr-3 px-3 py-2 bg-slate-900 text-white text-xs tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Chat with us
      </span>
    </a>
  );
}

// ============ ITINERARY TIMELINE ============
// replica lo stile della brochure ufficiale: timeline verticale tratteggiata
// con pallini colorati, nome tappa in serif, sottotitolo piccolo in grigio
function ItineraryTimeline({ itinerary, accentColor = '#d4a355', footnote = '' }) {
  if (!itinerary || itinerary.length === 0) return null;
  return (
    <div className="py-2">
      <div className="border-t mb-6" style={{ borderColor: accentColor, opacity: 0.5 }}></div>
      <p className="text-center tracking-[0.4em] text-xs mb-8" style={{ color: accentColor }}>ITINERARY</p>
      <div className="relative pl-14 pr-4 max-w-md mx-auto">
        {itinerary.map((stop, i) => {
          const isLast = i === itinerary.length - 1;
          return (
            <div key={i} className="relative pb-6 last:pb-0">
              {!isLast && (
                <div className="absolute top-5 bottom-0 border-l-2 border-dashed" style={{ left: '-30px', borderColor: accentColor, opacity: 0.5 }}></div>
              )}
              <div className="absolute w-4 h-4 rounded-full" style={{ left: '-38px', top: '4px', backgroundColor: accentColor }}></div>
              <div>
                <h4 className="text-white text-base leading-tight" style={{ fontFamily: 'Georgia, serif', fontWeight: 600 }}>{stop.place}</h4>
                {stop.note && <p className="text-slate-400 text-xs mt-1">{stop.note}</p>}
              </div>
            </div>
          );
        })}
      </div>
      {footnote && (
        <p className="text-center text-xs italic mt-6 px-4" style={{ color: accentColor, opacity: 0.7 }}>{footnote}</p>
      )}
    </div>
  );
}

// ============ TOUR CARD IMAGE ============
function TourCardImage({ tour }) {
  // se il tour ha un'immagine reale, la mostriamo in formato 3:2
  if (tour.cardImage) {
    return (
      <div className="relative overflow-hidden w-full" style={{ 
        backgroundColor: tour.brandColor, 
        aspectRatio: '3/2'
      }}>
        <img 
          src={tour.cardImage} 
          alt={tour.name}
          className="w-full h-full"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          loading="lazy"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </div>
    );
  }
  
  // fallback SVG per tour senza immagine (es. Tailored)
  return (
    <div className="relative overflow-hidden flex flex-col items-center justify-center w-full" style={{ 
      backgroundColor: tour.brandColor, 
      aspectRatio: '3/2'
    }}>
      <div className="text-center px-4">
        <p className="text-white/80 text-xs italic mb-1" style={{ fontFamily: 'Georgia, serif' }}>{tour.subtitle}</p>
        <h3 className="text-white text-4xl leading-tight mb-3" style={{ 
          fontFamily: '"Brush Script MT", "Lucida Handwriting", cursive',
          fontWeight: 'normal',
          letterSpacing: '0.02em'
        }}>{tour.name}</h3>
        <svg width="80" height="80" viewBox="0 0 60 60" className="mx-auto">
          <circle cx="30" cy="30" r="22" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
          <circle cx="30" cy="30" r="3" fill="#fbbf24"/>
          <polygon points="30,12 33,30 30,34 27,30" fill="#fbbf24"/>
          <polygon points="30,48 33,30 30,26 27,30" fill="#fbbf24" opacity="0.5"/>
        </svg>
      </div>
    </div>
  );
}

// ============ DATA ============
const initialTours = [
  {
    id: 'cinque-terre', name: 'Cinque Terre', subtitle: 'Full day Tour',
    duration: '7 hours', fixedTime: '10:00 – 17:00', slotType: 'full-day',
    basePrice: 1500, maxPeople: 8, brandColor: '#0b3d7e', accent: '#fbbf24',
    cardImage: '/cinque-terre-v2.png',
    itineraryAccent: '#d4a355',
    shortDesc: 'All five villages by sea. Swim, snorkel, Italian lunch on board.',
    longDesc: 'Cruise the entire UNESCO coastline past Riomaggiore, Manarola, Corniglia, Vernazza and Monterosso. Swim in hidden coves, snorkel the marine reserve, and enjoy a light Italian lunch on board as the colourful villages drift by.',
    itinerary: [
      { place: 'La Spezia', note: 'Porto Mirabello • Departure' },
      { place: 'Portovenere', note: 'Scenic cruise past the village' },
      { place: 'Monasteroli — Campiglia', note: 'Hidden coastline & swim stop' },
      { place: 'Riomaggiore', note: 'First of the Five Lands' },
      { place: 'Manarola', note: 'Snorkeling in crystal waters' },
      { place: 'Corniglia', note: 'The clifftop village from the sea' },
      { place: 'Vernazza', note: 'Lunch stop • Time ashore' },
      { place: 'Monterosso', note: 'Time ashore • Final stop' }
    ],
    itineraryFootnote: 'Approx. 7 hours • Flexible schedule',
    includes: ['Light Italian lunch', 'Open bar', 'Multilingual hostess', 'Fuel & skipper', 'Private parking', 'Towels & equipment']
  },
  {
    id: 'golfo-poeti', name: 'Golfo dei poeti', subtitle: 'Full day Tour',
    duration: '7 hours', fixedTime: '10:00 – 17:00', slotType: 'full-day',
    basePrice: 1400, maxPeople: 8, brandColor: '#0e5d63', accent: '#fbbf24',
    cardImage: '/golfo-poeti-v2.png',
    itineraryAccent: '#d4a355',
    shortDesc: "Byron's gulf. Portovenere, Palmaria island, Lerici and hidden Tellaro.",
    longDesc: 'Explore the gulf that enchanted Byron and Shelley. Medieval Portovenere, the wild islands of Palmaria and Tino, elegant Lerici and the hidden gem of Tellaro, with swim stops and a light lunch on board.',
    itinerary: [
      { place: 'La Spezia', note: 'Porto Mirabello • Departure' },
      { place: 'Portovenere', note: 'UNESCO village • Time ashore' },
      { place: 'Palmaria', note: 'Blue Grotto • Snorkeling' },
      { place: 'Tino', note: 'Ancient monastery island' },
      { place: 'Tinetto', note: 'Scenic cruise around the islet' },
      { place: 'San Terenzo', note: 'Charming seaside village' },
      { place: 'Lerici', note: 'Lunch stop • Castle views' },
      { place: 'Tellaro', note: 'Hidden gem of the Gulf' }
    ],
    itineraryFootnote: 'Approx. 7 hours • Flexible schedule',
    includes: ['Light Italian lunch', 'Open bar', 'Multilingual hostess', 'Fuel & skipper', 'Private parking', 'Towels & equipment']
  },
  {
    id: 'portofino', name: 'Portofino', subtitle: 'San Fruttuoso & Cinque Terre',
    duration: '10 hours', fixedTime: '9:00 – 19:00', slotType: 'full-day-extended',
    basePrice: 2350, maxPeople: 8, brandColor: '#065f46', accent: '#fbbf24',
    cardImage: '/portofino-v2.png',
    itineraryAccent: '#2dd4bf',
    shortDesc: 'The full Riviera. Portofino, San Fruttuoso abbey, Cinque Terre on return.',
    longDesc: "A long day along the Riviera di Levante to Italy's most iconic harbour. Stop at the medieval abbey of San Fruttuoso, dock in Portofino for free time ashore, snorkel the Marine Protected Area, then cruise past the Cinque Terre on the way back.",
    itinerary: [
      { place: 'La Spezia', note: 'Porto Mirabello • Departure' },
      { place: 'Ligurian Coast', note: 'Scenic cruise along the riviera' },
      { place: 'San Fruttuoso', note: 'Stop • Explore the abbey & swim' },
      { place: 'Portofino', note: 'Stop • Free time & lunch at restaurant' },
      { place: 'Marine Reserve', note: 'Snorkeling in crystal clear waters' },
      { place: 'Cinque Terre', note: 'Sunset cruise along the coast' }
    ],
    itineraryFootnote: 'Approx. 10 hours • Restaurant lunch not included',
    includes: ['Light lunch on board', 'Open bar', 'Multilingual hostess', 'Fuel & skipper', 'Private parking', 'Towels & equipment']
  },
  {
    id: 'half-day-choice', name: 'Half day', subtitle: 'Cinque Terre or Gulf of Poets',
    duration: '4 hours', slotType: 'half-day-choice',
    basePrice: 1000, maxPeople: 8, brandColor: '#1e40af', accent: '#fbbf24',
    cardImage: '/half-day-v2.png',
    itineraryAccent: '#d4a355',
    shortDesc: 'Pick your coastline, pick your moment. Morning, afternoon or evening.',
    longDesc: 'A shorter escape with the same magic. Choose between the Cinque Terre route or the Gulf of Poets, then pick the light you prefer: fresh morning, sunny afternoon, or evening golden hour.',
    itineraryOptions: [
      { id: 'cinque', name: 'Cinque Terre', desc: 'Portovenere → Riomaggiore → Manarola → Vernazza',
        itinerary: [
          { place: 'La Spezia', note: 'Porto Mirabello • Departure' },
          { place: 'Portovenere', note: 'Scenic cruise past the village' },
          { place: 'Riomaggiore', note: 'First of the Five Lands' },
          { place: 'Manarola', note: 'Snorkeling in crystal waters' },
          { place: 'Vernazza', note: 'Time ashore • Final stop' }
        ]
      },
      { id: 'golfo', name: 'Gulf of Poets', desc: 'Portovenere → Palmaria → Lerici → Tellaro',
        itinerary: [
          { place: 'La Spezia', note: 'Porto Mirabello • Departure' },
          { place: 'Portovenere', note: 'UNESCO village • Time ashore' },
          { place: 'Palmaria', note: 'Blue Grotto • Snorkeling' },
          { place: 'Lerici', note: 'Castle views • Time ashore' },
          { place: 'Tellaro', note: 'Hidden gem • Final stop' }
        ]
      }
    ],
    itineraryFootnote: 'Approx. 4 hours • Flexible schedule',
    timeOfDay: [
      { id: 'morning', label: 'Morning', time: '9:30 – 13:30', icon: 'sun' },
      { id: 'afternoon', label: 'Afternoon', time: '14:00 – 18:00', icon: 'sun' },
      { id: 'evening', label: 'Evening', time: '17:00 – 21:00', icon: 'sunset' }
    ],
    includes: ['Italian aperitivo', 'Open bar', 'Multilingual hostess', 'Fuel & skipper', 'Private parking', 'Towels']
  },
  {
    id: 'sunset', name: 'Sunset Tour', subtitle: 'Golden hour aperitivo',
    duration: '3.5 hours', fixedTime: '17:30 – 21:00', slotType: 'sunset',
    basePrice: 800, maxPeople: 8, brandColor: '#e8893b', accent: '#fdba74',
    cardImage: '/sunset-v2.png',
    itineraryAccent: '#fdba74',
    shortDesc: 'Aperitivo at sea while the coast turns amber and rose.',
    longDesc: 'The most romantic way to end the day. Sail the Gulf of Poets as the sun melts behind Palmaria, sip a Ligurian aperitivo with local wines, and let the colours do the rest.',
    // sunset ora ha 2 varianti come l'half-day
    itineraryOptions: [
      { id: 'cinque', name: 'Cinque Terre at sunset', desc: 'Portovenere → Riomaggiore → Manarola',
        itinerary: [
          { place: 'La Spezia', note: 'Porto Mirabello • Departure' },
          { place: 'Portovenere', note: 'First glimpse of golden hour' },
          { place: 'Riomaggiore', note: 'Sunset over the cliffs' },
          { place: 'Manarola', note: 'Aperitivo • Final stop' }
        ]
      },
      { id: 'golfo', name: 'Gulf of Poets at sunset', desc: 'Portovenere → Palmaria → Lerici',
        itinerary: [
          { place: 'La Spezia', note: 'Porto Mirabello • Departure' },
          { place: 'Portovenere', note: 'Medieval waterfront at dusk' },
          { place: 'Palmaria', note: 'Sun melting behind the island' },
          { place: 'Lerici', note: 'Aperitivo with castle views' }
        ]
      }
    ],
    itineraryFootnote: 'Approx. 3.5 hours • Flexible schedule',
    includes: ['Italian aperitivo', 'Open bar with local wines', 'Multilingual hostess', 'Fuel & skipper', 'Private parking', 'Towels']
  },
  {
    id: 'custom', name: 'Tailored', subtitle: 'Your day, your way',
    duration: 'Flexible', slotType: 'custom',
    basePrice: 0, maxPeople: 8, brandColor: '#1e293b', accent: '#fbbf24',
    shortDesc: 'Your own itinerary. Marco and Paola craft the perfect day at sea.',
    longDesc: 'Choose destinations, duration and activities. Captain Marco and Paola will craft the perfect day based on your preferences.',
    includes: ['Everything tailored to you'], isCustom: true
  }
];

const addOns = [
  { id: 'restaurant', name: 'Seaside Restaurant', desc: 'Waterfront restaurants in Portofino, Vernazza, Monterosso or Portovenere', icon: Utensils },
  { id: 'wine', name: 'Wine Tasting Experience', desc: 'Exclusive Cinque Terre DOC tasting with local winemaker', icon: Wine },
  { id: 'cooking', name: 'Ligurian Cooking Class', desc: 'Traditional Italian cuisine with local chef', icon: Sparkles }
];

const defaultPickupPoints = ['Porto Mirabello (La Spezia)', 'Portovenere', 'Le Grazie', 'Lerici'];

const initialBookings = [
  { id: 1, tourId: 'cinque-terre', tourName: 'Cinque Terre', customerName: 'Marco Rossi', email: 'marco@email.com', phone: '+39 333 1234567', date: new Date(Date.now() + 3*86400000), timeSlot: '10:00 – 17:00', slotType: 'full-day', people: 4, notes: 'Wedding anniversary', addOns: ['wine'], status: 'pending', basePrice: 1500, finalPrice: null, language: 'IT' },
  { id: 2, tourId: 'sunset', tourName: 'Sunset Tour', customerName: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '+44 7700 900123', date: new Date(Date.now() + 5*86400000), timeSlot: '17:30 – 21:00', slotType: 'sunset', people: 2, notes: 'Vegetarian aperitivo', addOns: [], status: 'pending', basePrice: 800, finalPrice: null, language: 'EN' },
  { id: 3, tourId: 'golfo-poeti', tourName: 'Golfo dei poeti', customerName: 'Heinrich Mueller', email: 'h.mueller@email.de', phone: '+49 151 23456789', date: new Date(Date.now() + 7*86400000), timeSlot: '10:00 – 17:00', slotType: 'full-day', people: 6, notes: '', addOns: ['restaurant'], status: 'confirmed', basePrice: 1400, finalPrice: 1600, language: 'DE' }
];

// ============ BOOKING APP (route /booking) ============
// l'intero flusso a 3 step + dashboard skipper + schermata conferma
function BookingApp() {
  const [tours, setTours] = useState(initialTours);
  const [mode, setMode] = useState('customer');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTour, setSelectedTour] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [halfDayChoiceItinerary, setHalfDayChoiceItinerary] = useState(null);
  const [halfDayChoiceTime, setHalfDayChoiceTime] = useState(null);
  const [numPeople, setNumPeople] = useState(2);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [meetingPoint, setMeetingPoint] = useState('Porto Mirabello (La Spezia)');
  const [customMeetingPoint, setCustomMeetingPoint] = useState('');
  const [customerData, setCustomerData] = useState({ 
    name: '', email: '', phone: '', notes: '', language: 'EN',
    hasAllergies: false, allergiesDetails: '',
    reducedMobility: false, mobilityDetails: ''
  });
  const [submitted, setSubmitted] = useState(false);
  // diagnostica invio email — visibile on-page se qualcosa va storto
  const [submitError, setSubmitError] = useState(null);
  const [showSkipperLogin, setShowSkipperLogin] = useState(false);
  const [skipperAuth, setSkipperAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [bookings, setBookings] = useState(initialBookings);
  const [skipperTab, setSkipperTab] = useState('calendar');
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [tempPrice, setTempPrice] = useState('');
  const [editingTourPrice, setEditingTourPrice] = useState(null);
  const [tempTourPrice, setTempTourPrice] = useState('');

  // google calendar sync state
  const [gcalEvents, setGcalEvents] = useState([]);
  const [gcalStatus, setGcalStatus] = useState('idle'); // 'idle' | 'syncing' | 'synced' | 'error'
  const [gcalLastSync, setGcalLastSync] = useState(null);

  // mese visualizzato nel calendario cliente (step 2)
  const [customerCalendarMonth, setCustomerCalendarMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  // calendario skipper — date bloccate e moltiplicatori prezzo
  const [skipperCalendarMonth, setSkipperCalendarMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [selectedSkipperDate, setSelectedSkipperDate] = useState(null);
  const [dateOverrides, setDateOverrides] = useState({}); // { 'YYYY-MM-DD': { closed, tourPrices: {tourId: price}, note } }
  const [tempTourPrices, setTempTourPrices] = useState({}); // { tourId: price }
  const [tempDateNote, setTempDateNote] = useState('');

  const changeCustomerMonth = (delta) => {
    const d = new Date(customerCalendarMonth);
    d.setMonth(d.getMonth() + delta);
    setCustomerCalendarMonth(d);
  };

  // helpers calendario skipper
  const dateToKey = (date) => date.toISOString().split('T')[0];

  const getDateInfo = (date) => {
    const key = dateToKey(date);
    const override = dateOverrides[key] || {};
    const internalBookings = bookings.filter(b => b.date.toDateString() === date.toDateString());
    const gcalOnDate = gcalEvents.filter(e => e.date.toDateString() === date.toDateString());
    return {
      closed: override.closed || false,
      tourPrices: override.tourPrices || {}, // { tourId: customPrice }
      note: override.note || '',
      pendingBookings: internalBookings.filter(b => b.status === 'pending'),
      confirmedBookings: internalBookings.filter(b => b.status === 'confirmed'),
      gcalEvents: gcalOnDate,
      hasAny: internalBookings.length > 0 || gcalOnDate.length > 0,
      hasCustomPrices: override.tourPrices && Object.keys(override.tourPrices).length > 0
    };
  };

  const generateSkipperMonthGrid = (baseDate) => {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startWeekDay = (firstDay.getDay() + 6) % 7;
    const grid = [];
    for (let i = 0; i < startWeekDay; i++) grid.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      grid.push(new Date(year, month, d));
    }
    return grid;
  };

  const toggleDateClosed = (date) => {
    const key = dateToKey(date);
    const current = dateOverrides[key] || {};
    setDateOverrides({ ...dateOverrides, [key]: { ...current, closed: !current.closed } });
  };

  const setDateTourPrices = (date, tourPrices, note = '') => {
    const key = dateToKey(date);
    const current = dateOverrides[key] || {};
    setDateOverrides({ ...dateOverrides, [key]: { ...current, tourPrices, note } });
  };

  const clearDateOverride = (date) => {
    const key = dateToKey(date);
    const newOverrides = { ...dateOverrides };
    delete newOverrides[key];
    setDateOverrides(newOverrides);
  };

  const changeSkipperMonth = (delta) => {
    const d = new Date(skipperCalendarMonth);
    d.setMonth(d.getMonth() + delta);
    setSkipperCalendarMonth(d);
  };

  // scarica gli eventi di google calendar al mount e ogni volta che si arriva allo step 2 (scelta data)
  const syncGoogleCalendar = async () => {
    setGcalStatus('syncing');
    const events = await fetchGoogleCalendarEvents();
    if (events === null) {
      setGcalStatus('error');
    } else {
      setGcalEvents(events);
      setGcalStatus('synced');
      setGcalLastSync(new Date());
    }
  };

  useEffect(() => { syncGoogleCalendar(); }, []);
  useEffect(() => { if (currentStep === 2) syncGoogleCalendar(); }, [currentStep]);
  // scroll in cima ogni volta che cambia lo step (l'animazione smooth parte dopo il render)
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [currentStep]);

  const SKIPPER_PASSWORD = 'Searunner646703';

  const handleSkipperLogin = () => {
    if (password === SKIPPER_PASSWORD) {
      setSkipperAuth(true); setShowSkipperLogin(false); setMode('skipper');
      setLoginError(''); setPassword('');
    } else setLoginError('Incorrect password');
  };
  const handleSkipperLogout = () => { setSkipperAuth(false); setMode('customer'); setCurrentStep(1); };
  const handleBookingAction = (id, action, finalPrice = null) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: action, finalPrice: finalPrice || b.basePrice } : b));
    setEditingPriceId(null);
  };
  const handleSavePrice = (id) => {
    const price = parseFloat(tempPrice);
    if (!isNaN(price)) setBookings(bookings.map(b => b.id === id ? { ...b, finalPrice: price } : b));
    setEditingPriceId(null); setTempPrice('');
  };
  const handleSaveTourPrice = (tourId) => {
    const price = parseFloat(tempTourPrice);
    if (!isNaN(price) && price > 0) setTours(tours.map(t => t.id === tourId ? { ...t, basePrice: price } : t));
    setEditingTourPrice(null); setTempTourPrice('');
  };

  const handleTourSelect = (tour) => { 
    setSelectedTour(tour); setHalfDayChoiceItinerary(null); setHalfDayChoiceTime(null);
    setCurrentStep(2); window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const toggleAddOn = (id) => setSelectedAddOns(selectedAddOns.includes(id) ? selectedAddOns.filter(a => a !== id) : [...selectedAddOns, id]);

  // ============ LOGICA SLOT ============
  // unisce due sorgenti: bookings interni (dal form sea runner) + eventi google calendar (dal .ics).
  // entrambi hanno la stessa struttura { slotType, part }, così la logica a valle non cambia.
  const getBookedSlotsOnDate = (date) => {
    const internalSlots = bookings
      .filter(b => b.date.toDateString() === date.toDateString() && (b.status === 'confirmed' || b.status === 'pending'))
      .map(b => ({
        slotType: b.slotType,
        part: b.timeSlot && b.timeSlot.toLowerCase().includes('morning') ? 'morning' : 
              b.timeSlot && b.timeSlot.toLowerCase().includes('afternoon') ? 'afternoon' :
              b.timeSlot && b.timeSlot.toLowerCase().includes('evening') ? 'evening' : null
      }));

    const gcalSlots = gcalEvents
      .filter(e => e.date.toDateString() === date.toDateString())
      .map(e => ({ slotType: e.slotType, part: e.part }));

    return [...internalSlots, ...gcalSlots];
  };

  const isTourAvailableOnDate = (tour, date) => {
    // prima cosa: controllo se lo skipper ha chiuso questa data dalla dashboard
    const key = dateToKey(date);
    if (dateOverrides[key]?.closed) return { available: false };

    const booked = getBookedSlotsOnDate(date);
    if (booked.length === 0) return { available: true };
    const hasExtended = booked.some(b => b.slotType === 'full-day-extended');
    const hasFullDay = booked.some(b => b.slotType === 'full-day');
    const hasSunset = booked.some(b => b.slotType === 'sunset');
    const hasHalfMorning = booked.some(b => (b.slotType === 'half-day' || b.slotType === 'half-day-choice') && b.part === 'morning');
    const hasHalfAfternoon = booked.some(b => (b.slotType === 'half-day' || b.slotType === 'half-day-choice') && b.part === 'afternoon');
    const hasHalfEvening = booked.some(b => b.slotType === 'half-day-choice' && b.part === 'evening');

    if (tour.slotType === 'full-day-extended') {
      if (hasExtended || hasFullDay || hasHalfMorning || hasHalfAfternoon) return { available: false };
      if (hasSunset) return { available: true, needsConfirmation: true, reason: 'Sunset already booked — skipper will confirm' };
      return { available: true };
    }
    if (tour.slotType === 'full-day') {
      if (hasExtended || hasFullDay || hasHalfMorning || hasHalfAfternoon) return { available: false };
      return { available: true };
    }
    if (tour.slotType === 'sunset') {
      if (hasSunset || hasHalfEvening) return { available: false };
      if (hasExtended) return { available: true, needsConfirmation: true, reason: 'Portofino tour booked — skipper will confirm' };
      if (hasHalfAfternoon) return { available: true, needsConfirmation: true, reason: 'Afternoon half day booked — skipper will confirm' };
      return { available: true };
    }
    if (tour.slotType === 'half-day-choice') {
      if (hasExtended || hasFullDay) return { available: false };
      return { available: true, bookedParts: { morning: hasHalfMorning, afternoon: hasHalfAfternoon, evening: hasHalfEvening || hasSunset } };
    }
    return { available: true };
  };

  const WEB3FORMS_KEY = '970b85ef-e255-4ada-8ecf-52673d5cecc5';

  const getFinalTimeSlot = () => {
    if (!selectedTour) return '';
    if (selectedTour.slotType === 'half-day-choice' && halfDayChoiceTime) {
      const t = selectedTour.timeOfDay.find(td => td.id === halfDayChoiceTime);
      return `${t.label} (${t.time})`;
    }
    if (selectedTour.fixedTime) return selectedTour.fixedTime;
    if (selectedTour.isCustom) return 'To be agreed';
    return '';
  };
  const getFinalMeetingPoint = () => meetingPoint === 'Other' ? `Other: ${customMeetingPoint}` : meetingPoint;

  const handleSubmit = async () => {
    setSubmitError(null); // reset diagnostica precedente
    const addOnsText = selectedAddOns.length > 0 ? selectedAddOns.map(id => addOns.find(a => a.id === id)?.name).join(', ') : 'None';
    const allergiesText = customerData.hasAllergies ? (customerData.allergiesDetails || 'Yes (details to discuss)') : 'None';
    const mobilityText = customerData.reducedMobility ? (customerData.mobilityDetails || 'Yes (details to discuss)') : 'None';
    const itineraryText = selectedTour.itineraryOptions && halfDayChoiceItinerary
      ? selectedTour.itineraryOptions.find(o => o.id === halfDayChoiceItinerary)?.name : '';
    const dateFormatted = selectedDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    // email pulita, solo plain text. ordine: quando → chi → cosa → quanto → salute → note.
    const emailBody = `NEW BOOKING REQUEST - ${selectedTour.name}

${dateFormatted}
${getFinalTimeSlot()} (${selectedTour.duration})
${numPeople} ${numPeople === 1 ? 'guest' : 'guests'}

CUSTOMER
${customerData.name}
Phone: ${customerData.phone}
Email: ${customerData.email}
Language: ${customerData.language}

TOUR
${selectedTour.name} - ${selectedTour.subtitle}${itineraryText ? `\nItinerary: ${itineraryText}` : ''}
Meeting point: ${getFinalMeetingPoint()}

PRICE
€${selectedTour.basePrice.toLocaleString()}
Estimate - final quote to confirm

HEALTH & ACCESSIBILITY
Allergies: ${allergiesText}
Mobility: ${mobilityText}

NOTES
${customerData.notes || 'No special requests'}
`.trim();

    let emailDelivered = false;
    let emailErrorDetail = null;
    let rawResponse = null;

    if (WEB3FORMS_KEY && WEB3FORMS_KEY !== 'YOUR_ACCESS_KEY_HERE') {
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: `New Booking: ${selectedTour.name} - ${customerData.name}`,
            from_name: `Sea Runner - ${customerData.name}`,
            email: customerData.email,
            message: emailBody
          })
        });
        rawResponse = { status: response.status, ok: response.ok };
        const result = await response.json().catch(() => ({ parseError: true }));
        rawResponse.body = result;
        console.log('[sea-runner] web3forms response:', rawResponse);
        if (response.ok && result.success) {
          emailDelivered = true;
        } else {
          emailErrorDetail = result?.message || `HTTP ${response.status}`;
          console.error('[sea-runner] web3forms rejected:', emailErrorDetail, result);
        }
      } catch (error) {
        emailErrorDetail = `Network error: ${error.message || String(error)}`;
        console.error('[sea-runner] web3forms network error:', error);
      }
    } else {
      console.warn('[sea-runner] WEB3FORMS_KEY missing');
      emailErrorDetail = 'Configuration missing: WEB3FORMS_KEY not set';
    }

    if (!emailDelivered) {
      // salva diagnostica on-page invece di alert bloccante
      setSubmitError({
        message: emailErrorDetail,
        rawResponse,
        timestamp: new Date().toLocaleString('it-IT')
      });
      // non prosegue con setSubmitted(true) — la pagina mostra l'errore invece della conferma
      return;
    }

    const newBooking = {
      id: bookings.length + 1, tourId: selectedTour.id, tourName: selectedTour.name,
      customerName: customerData.name, email: customerData.email, phone: customerData.phone,
      date: selectedDate, timeSlot: getFinalTimeSlot(), slotType: selectedTour.slotType,
      people: numPeople, notes: customerData.notes, addOns: selectedAddOns,
      meetingPoint: getFinalMeetingPoint(), status: 'pending', basePrice: selectedTour.basePrice,
      finalPrice: null, language: customerData.language, allergies: allergiesText, mobility: mobilityText
    };
    setBookings([newBooking, ...bookings]);
    setSubmitted(true);
  };

  const resetBooking = () => {
    setSubmitted(false); setCurrentStep(1); setSelectedTour(null); setSelectedDate(null);
    setHalfDayChoiceItinerary(null); setHalfDayChoiceTime(null);
    setSelectedAddOns([]); setNumPeople(2); setMeetingPoint('Porto Mirabello (La Spezia)'); setCustomMeetingPoint('');
    setCustomerData({ name: '', email: '', phone: '', notes: '', language: 'EN', hasAllergies: false, allergiesDetails: '', reducedMobility: false, mobilityDetails: '' });
  };

  // ============ CALENDARIO CLIENTE — griglia mensile navigabile ============
  // il calendario cliente mostra un mese alla volta, con frecce prev/next per scorrere.
  // stato del mese attualmente visualizzato nello step 2
  // (inizializzato al mese corrente)

  const generateCalendarMonth = (baseMonth) => {
    const dates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const year = baseMonth.getFullYear();
    const month = baseMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    // giorno della settimana del primo giorno (lunedì = 0)
    const startWeekDay = (firstDay.getDay() + 6) % 7;

    // celle vuote per allineare il primo giorno del mese al giorno corretto
    for (let i = 0; i < startWeekDay; i++) {
      dates.push({ empty: true });
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      const isPast = date < today;
      const availInfo = selectedTour && !isPast ? isTourAvailableOnDate(selectedTour, date) : { available: !isPast };
      dates.push({
        date,
        isPast,
        available: !isPast && availInfo.available,
        needsConfirmation: availInfo.needsConfirmation,
        reason: availInfo.reason,
        bookedParts: availInfo.bookedParts,
        dayNum: d
      });
    }
    return dates;
  };

  const calendarDates = generateCalendarMonth(customerCalendarMonth);

  // ============ SKIPPER LOGIN ============
  if (showSkipperLogin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4" style={{ fontFamily: 'Georgia, serif' }}>
        <div className="bg-slate-900 border border-amber-400/30 rounded-lg shadow-2xl p-8 max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <SeaRunnerLogoCompact size="sm" />
              <div><h2 className="text-xl text-white tracking-[0.2em]">SEA RUNNER</h2>
                <p className="text-[10px] text-amber-400 tracking-[0.3em]">SKIPPER ACCESS</p></div>
            </div>
            <button onClick={() => { setShowSkipperLogin(false); setPassword(''); setLoginError(''); }} className="text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
          </div>
          <p className="text-slate-400 text-sm mb-6">Enter your password to access the management dashboard</p>
          <div className="space-y-4">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSkipperLogin()}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-white focus:border-amber-400 focus:outline-none" placeholder="password" autoFocus />
            {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
            <button onClick={handleSkipperLogin} className="w-full py-3 bg-amber-400 text-slate-950 rounded font-semibold hover:bg-amber-300 transition tracking-wider">ACCESS DASHBOARD</button>
          </div>
        </div>
      </div>
    );
  }

  // ============ SKIPPER DASHBOARD ============
  if (mode === 'skipper' && skipperAuth) {
    return (
      <div className="min-h-screen bg-slate-100" style={{ fontFamily: 'Georgia, serif' }}>
        <div className="bg-slate-950 text-white border-b-2 border-amber-400">
          <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SeaRunnerLogoCompact size="sm" />
              <div><h1 className="text-xl tracking-[0.2em]">SEA RUNNER</h1>
                <p className="text-[10px] text-amber-400 tracking-[0.3em]">SKIPPER DASHBOARD</p></div>
            </div>
            <button onClick={handleSkipperLogout} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm"><LogOut className="w-4 h-4" /> Logout</button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-2">
            <p className="text-amber-600 text-xs tracking-[0.3em] mb-1">WELCOME CAPTAIN MARCO</p>
            <h2 className="text-3xl text-slate-900">Management Dashboard</h2>
          </div>

          <div className="flex gap-1 border-b border-slate-300 mt-6 mb-6 overflow-x-auto">
            {[
              { id: 'calendar', label: 'Calendar', icon: Calendar },
              { id: 'pricing', label: 'Pricing', icon: Euro }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setSkipperTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm tracking-wider transition whitespace-nowrap ${skipperTab === tab.id ? 'bg-slate-950 text-amber-400' : 'text-slate-600 hover:bg-slate-200'}`}>
                  <Icon className="w-4 h-4" /> {tab.label.toUpperCase()}
                </button>
              );
            })}
          </div>


          {skipperTab === 'calendar' && (
            <div>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-900 font-semibold mb-1">Calendar Management</p>
                    <p className="text-xs text-blue-800 leading-relaxed">Click any date to open/close availability or set custom prices for specific tours on that date. Different tours can have different custom prices.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-6 text-xs">
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-emerald-100 border-2 border-emerald-500"></div><span className="text-slate-700">Available</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-100 border-2 border-red-500"></div><span className="text-slate-700">Closed</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-amber-100 border-2 border-amber-500"></div><span className="text-slate-700">Pending booking</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-100 border-2 border-blue-500"></div><span className="text-slate-700">Confirmed / gcal event</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-purple-100 border-2 border-purple-500"></div><span className="text-slate-700">Custom prices</span></div>
              </div>

              <div className="bg-white shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <button onClick={() => changeSkipperMonth(-1)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 tracking-wider text-sm">← PREV</button>
                  <h3 className="text-2xl text-slate-900">
                    {skipperCalendarMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                  </h3>
                  <button onClick={() => changeSkipperMonth(1)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 tracking-wider text-sm">NEXT →</button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-1">
                  {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => (
                    <div key={d} className="text-center text-[10px] tracking-widest text-slate-500 py-2">{d}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {generateSkipperMonthGrid(skipperCalendarMonth).map((date, idx) => {
                    if (!date) return <div key={idx} className="aspect-square"></div>;

                    const info = getDateInfo(date);
                    const todayStart = new Date(); todayStart.setHours(0,0,0,0);
                    const isPast = date < todayStart;
                    const isToday = date.toDateString() === new Date().toDateString();

                    let bgColor = 'bg-emerald-50 border-emerald-300 hover:bg-emerald-100';
                    let textColor = 'text-emerald-900';
                    if (isPast) {
                      bgColor = 'bg-slate-50 border-slate-200';
                      textColor = 'text-slate-400';
                    } else if (info.closed) {
                      bgColor = 'bg-red-50 border-red-400 hover:bg-red-100';
                      textColor = 'text-red-900';
                    } else if (info.confirmedBookings.length > 0 || info.gcalEvents.length > 0) {
                      bgColor = 'bg-blue-50 border-blue-400 hover:bg-blue-100';
                      textColor = 'text-blue-900';
                    } else if (info.pendingBookings.length > 0) {
                      bgColor = 'bg-amber-50 border-amber-400 hover:bg-amber-100';
                      textColor = 'text-amber-900';
                    } else if (info.hasCustomPrices) {
                      bgColor = 'bg-purple-50 border-purple-400 hover:bg-purple-100';
                      textColor = 'text-purple-900';
                    }

                    return (
                      <button key={idx} disabled={isPast}
                        onClick={() => {
                          setSelectedSkipperDate(date);
                          setTempTourPrices({ ...info.tourPrices });
                          setTempDateNote(info.note);
                        }}
                        className={`aspect-square p-1 border-2 transition relative ${bgColor} ${isToday ? 'ring-2 ring-amber-500' : ''} ${isPast ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                        <div className={`text-sm font-semibold ${textColor}`}>{date.getDate()}</div>
                        {!isPast && (
                          <div className="absolute bottom-1 left-1 right-1 flex flex-col gap-0.5">
                            {info.hasCustomPrices && (
                              <div className="text-[9px] text-purple-700 font-semibold">custom €</div>
                            )}
                            {info.pendingBookings.length > 0 && (
                              <div className="text-[9px] text-amber-700">{info.pendingBookings.length} pending</div>
                            )}
                            {(info.confirmedBookings.length + info.gcalEvents.length) > 0 && (
                              <div className="text-[9px] text-blue-700">✓ {info.confirmedBookings.length + info.gcalEvents.length}</div>
                            )}
                            {info.closed && (
                              <div className="text-[9px] text-red-700 font-semibold">CLOSED</div>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* MODAL per gestire la data selezionata */}
              {selectedSkipperDate && (() => {
                const info = getDateInfo(selectedSkipperDate);
                return (
                  <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={() => setSelectedSkipperDate(null)}>
                    <div className="bg-white shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                      <div className="bg-slate-950 text-white p-5 flex items-center justify-between border-b-2 border-amber-400">
                        <div>
                          <p className="text-[10px] text-amber-400 tracking-widest">MANAGE DATE</p>
                          <h3 className="text-xl">{selectedSkipperDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h3>
                        </div>
                        <button onClick={() => setSelectedSkipperDate(null)} className="text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
                      </div>

                      <div className="p-5 space-y-5">
                        <div className={`p-3 text-center text-sm tracking-wider ${info.closed ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {info.closed ? '🔒 DATE CLOSED — NOT BOOKABLE' : '✓ DATE OPEN — BOOKABLE'}
                        </div>

                        <div>
                          <p className="text-[10px] text-slate-500 tracking-widest mb-2">AVAILABILITY</p>
                          <button onClick={() => toggleDateClosed(selectedSkipperDate)}
                            className={`w-full py-3 text-sm tracking-wider transition ${info.closed ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-red-600 text-white hover:bg-red-700'}`}>
                            {info.closed ? '🔓 OPEN THIS DATE' : '🔒 CLOSE THIS DATE'}
                          </button>
                        </div>

                        {!info.closed && (
                          <div>
                            <p className="text-[10px] text-slate-500 tracking-widest mb-2">CUSTOM PRICES FOR THIS DATE</p>
                            <p className="text-[11px] text-slate-500 italic mb-3">Leave empty to use the default price. Enter a custom price only for the tours you want to override on this specific date.</p>
                            <div className="space-y-2 mb-3">
                              {tours.filter(t => !t.isCustom).map(t => {
                                const customValue = tempTourPrices[t.id];
                                const displayedPrice = customValue !== undefined && customValue !== '' ? customValue : '';
                                return (
                                  <div key={t.id} className="flex items-center gap-2 p-2 bg-slate-50">
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm text-slate-900 truncate">{t.name}</p>
                                      <p className="text-[10px] text-slate-500 tracking-wider">DEFAULT €{t.basePrice.toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="text-slate-500 text-sm">€</span>
                                      <input type="number" value={displayedPrice}
                                        onChange={(e) => {
                                          const newPrices = { ...tempTourPrices };
                                          if (e.target.value === '') delete newPrices[t.id];
                                          else newPrices[t.id] = parseFloat(e.target.value);
                                          setTempTourPrices(newPrices);
                                        }}
                                        placeholder={String(t.basePrice)}
                                        className="w-24 px-2 py-1 border border-slate-300 text-right text-sm" />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <input type="text" value={tempDateNote} onChange={(e) => setTempDateNote(e.target.value)}
                              placeholder="Note (e.g. 'High season', 'Holiday')"
                              className="w-full px-3 py-2 border border-slate-300 text-sm mb-3" />
                            <button onClick={() => {
                                // pulisco prezzi vuoti o non validi
                                const cleaned = {};
                                for (const [k, v] of Object.entries(tempTourPrices)) {
                                  if (typeof v === 'number' && !isNaN(v) && v > 0) cleaned[k] = v;
                                }
                                setDateTourPrices(selectedSkipperDate, cleaned, tempDateNote);
                                setSelectedSkipperDate(null);
                              }}
                              className="w-full py-3 bg-amber-400 text-slate-950 text-sm tracking-wider hover:bg-amber-300 transition">
                              SAVE CUSTOM PRICES
                            </button>
                          </div>
                        )}

                        {info.hasAny && (
                          <div className="border-t pt-4">
                            <p className="text-[10px] text-slate-500 tracking-widest mb-3">EVENTS ON THIS DATE</p>
                            <div className="space-y-2">
                              {[...info.pendingBookings, ...info.confirmedBookings].map(b => (
                                <div key={b.id} className="flex items-center justify-between p-3 bg-slate-50 text-sm">
                                  <div>
                                    <p className="text-slate-900">{b.customerName}</p>
                                    <p className="text-xs text-slate-500">{b.tourName} • {b.people} guests • {b.timeSlot}</p>
                                  </div>
                                  <span className={`text-xs px-2 py-1 tracking-wider ${b.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>{b.status.toUpperCase()}</span>
                                </div>
                              ))}
                              {info.gcalEvents.map((e, i) => (
                                <div key={`gcal-${i}`} className="flex items-center justify-between p-3 bg-blue-50 text-sm">
                                  <div>
                                    <p className="text-slate-900">Google Calendar event</p>
                                    <p className="text-xs text-slate-500">{e.slotType}{e.part ? ` — ${e.part}` : ''}</p>
                                  </div>
                                  <span className="text-xs px-2 py-1 tracking-wider bg-blue-100 text-blue-800">GCAL</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {(info.closed || info.hasCustomPrices) && (
                          <button onClick={() => { clearDateOverride(selectedSkipperDate); setSelectedSkipperDate(null); }}
                            className="w-full py-2 text-xs text-red-600 hover:bg-red-50 tracking-wider">
                            RESET DATE TO DEFAULT
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {skipperTab === 'pricing' && (
            <div>
              <div className="grid md:grid-cols-2 gap-4">
                {tours.filter(t => !t.isCustom).map(tour => (
                  <div key={tour.id} className="bg-white shadow-sm overflow-hidden">
                    <div className="h-3" style={{ backgroundColor: tour.brandColor }}></div>
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-xs tracking-widest uppercase" style={{ color: tour.brandColor }}>{tour.subtitle}</p>
                          <h3 className="text-2xl text-slate-900">{tour.name}</h3>
                        </div>
                      </div>
                      <div className="border-t border-slate-100 pt-4">
                        <p className="text-xs text-slate-400 tracking-widest mb-2">STARTING PRICE</p>
                        {editingTourPrice === tour.id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500 text-lg">€</span>
                            <input type="number" value={tempTourPrice} onChange={(e) => setTempTourPrice(e.target.value)}
                              className="flex-1 px-3 py-2 border-2 border-amber-400 text-2xl" autoFocus
                              onKeyDown={(e) => e.key === 'Enter' && handleSaveTourPrice(tour.id)} />
                            <button onClick={() => handleSaveTourPrice(tour.id)} className="p-2 bg-emerald-500 text-white hover:bg-emerald-600"><Save className="w-5 h-5" /></button>
                            <button onClick={() => { setEditingTourPrice(null); setTempTourPrice(''); }} className="p-2 bg-slate-200 hover:bg-slate-300"><X className="w-5 h-5" /></button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <p className="text-4xl text-slate-900">€{tour.basePrice.toLocaleString()}</p>
                            <button onClick={() => { setEditingTourPrice(tour.id); setTempTourPrice(tour.basePrice); }}
                              className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-amber-100 text-slate-700 text-sm">
                              <Edit2 className="w-4 h-4" /> Edit
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============ CONFIRMATION ============
  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 py-8" style={{ fontFamily: 'Georgia, serif' }}>
        <div className="max-w-md w-full text-center text-white">
          <div className="mb-6 flex justify-center"><SeaRunnerLogoCompact size="md" /></div>
          <p className="text-white text-sm tracking-[0.3em] mb-8">SEA RUNNER</p>
          <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-amber-400 rounded-full mb-6">
            <Check className="w-8 h-8 text-amber-400" />
          </div>
          <p className="text-amber-400 text-xs tracking-[0.4em] mb-3">REQUEST RECEIVED</p>
          <h2 className="text-4xl mb-6">Thank you,<br/>{customerData.name.split(' ')[0]}</h2>
          <div className="w-16 h-px bg-amber-400 mx-auto mb-6"></div>
          <p className="text-slate-300 mb-6 leading-relaxed">
            Captain Marco and Paola will review your request and contact you as soon as possible at <span className="text-amber-400">{customerData.email}</span>.
          </p>
          <p className="text-slate-400 text-xs tracking-widest mb-3">NEED TO REACH US DIRECTLY?</p>
          {/* contatti sea runner: email generica + telefono attività */}
          <div className="flex items-center justify-center gap-3 mb-8 text-sm">
            <a href="mailto:searunnerprenotazioni@gmail.com" className="text-amber-400 hover:text-amber-300 transition">searunnerprenotazioni@gmail.com</a>
            <span className="text-slate-500 uppercase text-xs tracking-widest">or</span>
            <a href="tel:+393488289438" className="text-amber-400 hover:text-amber-300 transition">+39 348 828 9438</a>
          </div>
          <div className="bg-slate-900 border border-slate-800 overflow-hidden mb-6">
            {/* immagine del tour prenotato */}
            {selectedTour && (
              <div className="relative w-full" style={{ backgroundColor: selectedTour.brandColor, aspectRatio: '3/2' }}>
                {selectedTour.cardImage ? (
                  <img src={selectedTour.cardImage} alt={selectedTour.name}
                    className="w-full h-full"
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                    onError={(e) => { e.target.style.display = 'none'; }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <h3 className="text-white text-3xl" style={{ fontFamily: '"Brush Script MT", cursive' }}>{selectedTour.name}</h3>
                  </div>
                )}
              </div>
            )}
            <div className="p-6 text-left">
              <p className="text-xs text-amber-400 tracking-widest mb-3">YOUR REQUEST</p>
              <p className="text-white mb-1">{selectedTour?.name}</p>
              <p className="text-sm text-slate-400 mb-3">{selectedTour?.subtitle}</p>
              <div className="space-y-1 text-sm text-slate-300">
                <p>Date: {selectedDate?.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p>Time: {getFinalTimeSlot()}</p>
                <p>Guests: {numPeople}</p>
                <p>Meeting: {getFinalMeetingPoint()}</p>
              </div>
            </div>
          </div>
          <button onClick={resetBooking} className="border border-amber-400 text-amber-400 px-8 py-3 tracking-widest hover:bg-amber-400 hover:text-slate-950 transition">NEW BOOKING</button>

          {/* call-to-action whatsapp per domande post-prenotazione */}
          <div className="mt-8 pt-8 border-t border-slate-800">
            <p className="text-slate-400 text-sm mb-4">Have any other questions? Don't hesitate to message us.</p>
            <a href={whatsappLink(`Hi! I just submitted a booking request for ${selectedTour?.name} on ${selectedDate?.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}. I have a question...`)}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-3 tracking-wider transition">
              <WhatsAppIcon className="w-5 h-5" />
              <span>MESSAGE US ON WHATSAPP</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ============ CUSTOMER FLOW ============
  return (
    <div className="min-h-screen bg-slate-950" style={{ fontFamily: 'Georgia, serif' }}>
      {/* navbar condivisa con home/boat/booking */}
      <SharedNav />

      {/* barra step specifica del booking */}
      <div className="border-b border-slate-800 bg-slate-950/70 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4 overflow-x-auto">
            {['TOUR', 'DATE', 'DETAILS'].map((label, idx) => (
              <div key={label} className="flex items-center gap-2 flex-shrink-0">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${currentStep >= idx+1 ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>{idx + 1}</div>
                <span className={`text-[10px] tracking-widest ${currentStep >= idx+1 ? 'text-amber-400' : 'text-slate-500'}`}>{label}</span>
                {idx < 2 && <div className="w-4 md:w-6 h-px bg-slate-700 ml-1 md:ml-2"></div>}
              </div>
            ))}
          </div>
          <button onClick={() => setShowSkipperLogin(true)} className="flex items-center gap-2 text-[10px] text-slate-500 hover:text-amber-400 transition tracking-widest flex-shrink-0">
            <Lock className="w-3 h-3" /> SKIPPER
          </button>
        </div>
      </div>

      {/* STEP 1 */}
      {currentStep === 1 && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <p className="text-amber-400 text-xs tracking-[0.4em] mb-3">EXCLUSIVE EXPERIENCES</p>
            <h2 className="text-5xl text-white mb-4">Choose Your Tour</h2>
            <div className="w-24 h-px bg-amber-400 mx-auto mb-6"></div>
            <p className="text-slate-400 max-w-2xl mx-auto">Private boat tours along the Italian Riviera</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour) => (
              <div key={tour.id} onClick={() => handleTourSelect(tour)}
                className="group cursor-pointer bg-slate-900 hover:shadow-2xl hover:shadow-amber-400/10 transition overflow-hidden border border-slate-800 hover:border-amber-400">
                <TourCardImage tour={tour} />
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 pb-4 border-b border-slate-800">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {tour.duration}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 1-{tour.maxPeople}</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">{tour.shortDesc}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      {!tour.isCustom ? (
                        <>
                          <p className="text-[10px] text-slate-500 tracking-widest">FROM</p>
                          <p className="text-3xl text-white">€{tour.basePrice.toLocaleString()}</p>
                        </>
                      ) : (
                        <>
                          <p className="text-[10px] text-slate-500 tracking-widest">PRICE</p>
                          <p className="text-lg text-amber-400">On request</p>
                        </>
                      )}
                    </div>
                    {/* BOOK uniformato a color amber-400 per tutti */}
                    <div className="border border-amber-400 text-amber-400 px-4 py-2 text-xs tracking-widest group-hover:bg-amber-400 group-hover:text-slate-950 transition">
                      BOOK →
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {currentStep === 2 && selectedTour && (
        <div className="max-w-5xl mx-auto px-4 py-12">
          <button onClick={() => { setCurrentStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-amber-400 hover:text-amber-300 text-xs tracking-widest mb-6">← CHANGE TOUR</button>

          <div className="mb-8">
            <TourCardImage tour={selectedTour} />
            <div className="bg-slate-900 border border-slate-800 border-t-0 p-8">
              <p className="text-slate-300 leading-relaxed max-w-3xl mb-6">{selectedTour.longDesc}</p>
              <div className="flex flex-wrap gap-4 text-sm text-slate-300 pt-4 border-t border-slate-800">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-amber-400" /> {selectedTour.duration}{selectedTour.fixedTime && ` (~${selectedTour.fixedTime}, flexible)`}</span>
                <span className="flex items-center gap-1"><Users className="w-4 h-4 text-amber-400" /> 1-{selectedTour.maxPeople} guests</span>
                {!selectedTour.isCustom && (
                  <span className="flex items-center gap-1 text-amber-400">from €{selectedTour.basePrice.toLocaleString()}</span>
                )}
              </div>

              {/* TIMELINE ITINERARIO */}
              {(() => {
                // se il tour ha varianti (half-day-choice, sunset), mostro quella selezionata se presente
                let activeItinerary = selectedTour.itinerary;
                if (selectedTour.itineraryOptions && halfDayChoiceItinerary) {
                  const opt = selectedTour.itineraryOptions.find(o => o.id === halfDayChoiceItinerary);
                  if (opt?.itinerary) activeItinerary = opt.itinerary;
                }
                if (!activeItinerary) return null;
                return (
                  <>
                    <div className="mt-8">
                      <ItineraryTimeline
                        itinerary={activeItinerary}
                        accentColor={selectedTour.itineraryAccent || '#d4a355'}
                        footnote={selectedTour.itineraryFootnote}
                      />
                    </div>
                    <div className="mt-4 p-3 bg-slate-800/50 border border-slate-700 text-xs text-slate-400 italic leading-relaxed flex items-start gap-2">
                      <Info className="w-3 h-3 mt-0.5 flex-shrink-0 text-amber-400/70" />
                      <span>This is the standard itinerary. It may vary depending on guest preferences or weather conditions.</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* WHAT'S INCLUDED */}
          {selectedTour.includes && selectedTour.includes.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 p-6 mb-6">
              <p className="text-amber-400 text-[10px] tracking-[0.3em] mb-4 flex items-center gap-2"><Check className="w-3 h-3" /> WHAT'S INCLUDED</p>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
                {selectedTour.includes.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              {selectedTour.notIncluded && (
                <div className="mt-4 pt-4 border-t border-slate-800 flex items-start gap-2 text-xs text-slate-400">
                  <Info className="w-3 h-3 mt-0.5 flex-shrink-0 text-slate-500" />
                  <span><span className="tracking-wider text-slate-500">NOT INCLUDED:</span> {selectedTour.notIncluded}</span>
                </div>
              )}
            </div>
          )}

          {/* ITINERARY CHOICE — half-day-choice e sunset hanno entrambi itineraryOptions */}
          {selectedTour.itineraryOptions && selectedTour.itineraryOptions.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 p-6 mb-6">
              <p className="text-amber-400 text-[10px] tracking-[0.3em] mb-4 flex items-center gap-2"><MapPin className="w-3 h-3" /> CHOOSE YOUR ITINERARY</p>
              <div className="grid md:grid-cols-2 gap-3">
                {selectedTour.itineraryOptions.map(opt => (
                  <button key={opt.id} onClick={() => setHalfDayChoiceItinerary(opt.id)}
                    className={`text-left p-4 border transition ${halfDayChoiceItinerary === opt.id ? 'border-amber-400 bg-amber-400/5' : 'border-slate-700 hover:border-slate-600'}`}>
                    <p className={`text-base mb-1 ${halfDayChoiceItinerary === opt.id ? 'text-white' : 'text-slate-300'}`}>{opt.name}</p>
                    <p className="text-xs text-slate-500">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* DATE + TIME + GUESTS */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-slate-900 border border-slate-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-amber-400 text-[10px] tracking-[0.3em] flex items-center gap-2"><Calendar className="w-3 h-3" /> SELECT DATE</p>
                <div className="flex items-center gap-1">
                  <button onClick={() => changeCustomerMonth(-1)} className="w-7 h-7 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-sm">‹</button>
                  <button onClick={() => changeCustomerMonth(1)} className="w-7 h-7 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-sm">›</button>
                </div>
              </div>
              <p className="text-center text-white text-base mb-3">
                {customerCalendarMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
              </p>
              <div className="grid grid-cols-7 gap-1 mb-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                  <div key={i} className="text-center text-[9px] tracking-widest text-slate-500 py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDates.map((day, idx) => {
                  if (day.empty) return <div key={idx} className="aspect-square"></div>;
                  const isSelected = selectedDate?.toDateString() === day.date.toDateString();
                  return (
                    <button key={idx} onClick={() => day.available && setSelectedDate(day.date)} disabled={!day.available}
                      className={`aspect-square flex items-center justify-center text-sm transition ${
                        isSelected ? 'bg-amber-400 text-slate-950'
                        : day.available && day.needsConfirmation ? 'bg-slate-800 text-amber-400 hover:bg-slate-700 border border-amber-400/30'
                        : day.available ? 'bg-slate-800 text-white hover:bg-slate-700'
                        : day.isPast ? 'bg-slate-900/50 text-slate-700 cursor-not-allowed'
                        : 'bg-slate-900 text-slate-700 cursor-not-allowed line-through'
                      }`}
                      title={day.needsConfirmation ? day.reason : ''}>
                      {day.dayNum}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 space-y-1">
                <p className="text-[10px] text-slate-500 tracking-wider">CROSSED OUT = UNAVAILABLE</p>
                <p className="text-[10px] text-amber-400/70 tracking-wider">AMBER BORDER = SKIPPER WILL CONFIRM</p>
                {/* indicatore sincronizzazione google calendar */}
                <div className="flex items-center gap-2 pt-2 mt-2 border-t border-slate-800">
                  {gcalStatus === 'syncing' && (
                    <>
                      <RefreshCw className="w-3 h-3 text-slate-500 animate-spin" />
                      <p className="text-[10px] text-slate-500 tracking-wider">UPDATING AVAILABILITY...</p>
                    </>
                  )}
                  {gcalStatus === 'synced' && (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <p className="text-[10px] text-emerald-500/80 tracking-wider">AVAILABILITY UP TO DATE</p>
                    </>
                  )}
                  {gcalStatus === 'error' && (
                    <>
                      <AlertCircle className="w-3 h-3 text-amber-500" />
                      <p className="text-[10px] text-amber-500/80 tracking-wider">USING LOCAL BOOKINGS ONLY</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {selectedTour.slotType === 'full-day' || selectedTour.slotType === 'full-day-extended' || selectedTour.slotType === 'sunset' ? (
                <div className="bg-slate-900 border border-slate-800 p-6">
                  <p className="text-amber-400 text-[10px] tracking-[0.3em] mb-4 flex items-center gap-2"><Clock className="w-3 h-3" /> SCHEDULE</p>
                  <div className="bg-slate-800 border border-amber-400/30 px-4 py-4 text-center">
                    <p className="text-[10px] text-slate-500 tracking-wider mb-1">APPROX.</p>
                    <p className="text-2xl text-amber-400">{selectedTour.fixedTime}</p>
                    <p className="text-[10px] text-slate-500 tracking-wider mt-2 italic">flexible — customizable on request</p>
                  </div>
                </div>
              ) : selectedTour.slotType === 'half-day-choice' ? (
                <div className="bg-slate-900 border border-slate-800 p-6">
                  <p className="text-amber-400 text-[10px] tracking-[0.3em] mb-4 flex items-center gap-2"><Clock className="w-3 h-3" /> TIME OF DAY</p>
                  <div className="space-y-2">
                    {selectedTour.timeOfDay.map(td => {
                      // calcolo robusto: guardo direttamente cosa è prenotato nella selectedDate,
                      // senza dipendere dall'oggetto calendarDates (che può essere di un mese diverso)
                      let partBooked = false;
                      if (selectedDate) {
                        const bookedOnThatDate = getBookedSlotsOnDate(selectedDate);
                        if (td.id === 'morning') {
                          partBooked = bookedOnThatDate.some(b => 
                            (b.slotType === 'half-day' || b.slotType === 'half-day-choice') && b.part === 'morning'
                          );
                        } else if (td.id === 'afternoon') {
                          partBooked = bookedOnThatDate.some(b => 
                            (b.slotType === 'half-day' || b.slotType === 'half-day-choice') && b.part === 'afternoon'
                          );
                        } else if (td.id === 'evening') {
                          partBooked = bookedOnThatDate.some(b => 
                            b.slotType === 'sunset' || (b.slotType === 'half-day-choice' && b.part === 'evening')
                          );
                        }
                      }
                      const Icon = td.icon === 'sunset' ? Sunset : Sun;
                      return (
                        <button key={td.id} onClick={() => !partBooked && setHalfDayChoiceTime(td.id)} disabled={partBooked}
                          className={`w-full text-left px-4 py-3 text-sm transition flex items-center justify-between ${
                            halfDayChoiceTime === td.id ? 'bg-amber-400 text-slate-950'
                            : partBooked ? 'bg-slate-900 text-slate-600 cursor-not-allowed line-through' 
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}>
                          <span className="flex items-center gap-2"><Icon className="w-4 h-4" /> {td.label}</span>
                          <span className="text-xs opacity-80">{td.time}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 p-6">
                  <p className="text-amber-400 text-[10px] tracking-[0.3em] mb-4 flex items-center gap-2"><Clock className="w-3 h-3" /> SCHEDULE</p>
                  <p className="text-slate-300 text-sm italic">Time to be agreed with skipper</p>
                </div>
              )}

              <div className="bg-slate-900 border border-slate-800 p-6">
                <p className="text-amber-400 text-[10px] tracking-[0.3em] mb-4 flex items-center gap-2"><Users className="w-3 h-3" /> GUESTS</p>
                <div className="flex items-center gap-4">
                  <button onClick={() => setNumPeople(Math.max(1, numPeople - 1))} className="w-12 h-12 border border-slate-700 text-white text-xl hover:border-amber-400 hover:text-amber-400 transition">−</button>
                  <div className="flex-1 text-center">
                    <div className="text-4xl text-white">{numPeople}</div>
                    <div className="text-[10px] text-slate-500 tracking-wider">MAX {selectedTour.maxPeople}</div>
                  </div>
                  <button onClick={() => setNumPeople(Math.min(selectedTour.maxPeople, numPeople + 1))} className="w-12 h-12 border border-slate-700 text-white text-xl hover:border-amber-400 hover:text-amber-400 transition">+</button>
                </div>
              </div>
            </div>
          </div>

          {/* MEETING POINT con "Other" */}
          <div className="bg-slate-900 border border-slate-800 p-6 mb-6">
            <p className="text-amber-400 text-[10px] tracking-[0.3em] mb-4 flex items-center gap-2"><MapPin className="w-3 h-3" /> MEETING POINT</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {[...defaultPickupPoints, 'Other'].map(point => {
                // Porto Mirabello va spezzato su 2 righe con "(La Spezia)" intero sotto
                const isMirabello = point === 'Porto Mirabello (La Spezia)';
                return (
                  <button key={point} onClick={() => setMeetingPoint(point)}
                    className={`px-3 py-2 text-sm transition leading-tight ${meetingPoint === point ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                    {isMirabello ? (
                      <>Porto Mirabello<br/><span className="text-xs opacity-80">(La Spezia)</span></>
                    ) : point}
                  </button>
                );
              })}
            </div>
            {meetingPoint === 'Other' && (
              <div className="mt-3">
                <input type="text" value={customMeetingPoint} onChange={(e) => setCustomMeetingPoint(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white focus:border-amber-400 focus:outline-none text-sm"
                  placeholder="Please specify your preferred meeting point..." />
                <p className="text-[10px] text-slate-500 tracking-wider mt-2">SKIPPER WILL CONFIRM FEASIBILITY</p>
              </div>
            )}
          </div>

          <button onClick={() => {
              if (!selectedDate) return;
              if (selectedTour.slotType === 'half-day-choice' && (!halfDayChoiceItinerary || !halfDayChoiceTime)) return;
              // sunset: richiede la scelta dell'itinerario (no orario, è fisso)
              if (selectedTour.slotType === 'sunset' && selectedTour.itineraryOptions && !halfDayChoiceItinerary) return;
              if (meetingPoint === 'Other' && !customMeetingPoint.trim()) return;
              setCurrentStep(3); window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            disabled={
              !selectedDate ||
              (selectedTour.slotType === 'half-day-choice' && (!halfDayChoiceItinerary || !halfDayChoiceTime)) ||
              (selectedTour.slotType === 'sunset' && selectedTour.itineraryOptions && !halfDayChoiceItinerary) ||
              (meetingPoint === 'Other' && !customMeetingPoint.trim())
            }
            className={`w-full py-4 tracking-[0.3em] text-sm transition ${
              selectedDate &&
              !(selectedTour.slotType === 'half-day-choice' && (!halfDayChoiceItinerary || !halfDayChoiceTime)) &&
              !(selectedTour.slotType === 'sunset' && selectedTour.itineraryOptions && !halfDayChoiceItinerary) &&
              !(meetingPoint === 'Other' && !customMeetingPoint.trim())
                ? 'bg-amber-400 text-slate-950 hover:bg-amber-300' 
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}>
            CONTINUE TO DETAILS →
          </button>
        </div>
      )}

      {/* STEP 3 */}
      {currentStep === 3 && (
        <div className="max-w-2xl mx-auto px-4 py-12">
          <button onClick={() => { setCurrentStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-amber-400 hover:text-amber-300 text-xs tracking-widest mb-6">← BACK</button>

          <div className="text-center mb-8">
            <p className="text-amber-400 text-xs tracking-[0.4em] mb-3">FINAL STEP</p>
            <h2 className="text-4xl text-white">Your Details</h2>
            <div className="w-16 h-px bg-amber-400 mx-auto mt-4"></div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 space-y-5">
            <div>
              <label className="block text-[10px] text-amber-400 tracking-widest mb-2">FULL NAME *</label>
              <input type="text" value={customerData.name} onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white focus:border-amber-400 focus:outline-none" placeholder="Mario Rossi" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-amber-400 tracking-widest mb-2">EMAIL *</label>
                <input type="email" value={customerData.email} onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white focus:border-amber-400 focus:outline-none" placeholder="you@email.com" />
              </div>
              <div>
                <label className="block text-[10px] text-amber-400 tracking-widest mb-2">PHONE *</label>
                <input type="tel" value={customerData.phone} onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white focus:border-amber-400 focus:outline-none" placeholder="+39 333 123 4567" />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-amber-400 tracking-widest mb-2 flex items-center gap-2"><Globe className="w-3 h-3" /> PREFERRED LANGUAGE</label>
              <div className="grid grid-cols-4 gap-2">
                {[{code:'EN',label:'English'},{code:'IT',label:'Italiano'},{code:'FR',label:'Français'},{code:'DE',label:'Deutsch'}].map(lang => (
                  <button key={lang.code} onClick={() => setCustomerData({ ...customerData, language: lang.code })}
                    className={`py-2 text-xs transition ${customerData.language === lang.code ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>{lang.label}</button>
                ))}
              </div>
            </div>

            {/* ALLERGIES & DIETARY */}
            <div className="border-t border-slate-800 pt-5">
              <p className="text-[10px] text-amber-400 tracking-widest mb-3 flex items-center gap-2"><AlertCircle className="w-3 h-3" /> DIETARY REQUIREMENTS</p>
              <label className="flex items-start gap-3 cursor-pointer p-3 bg-slate-800/50 hover:bg-slate-800 transition">
                <input type="checkbox" checked={customerData.hasAllergies}
                  onChange={(e) => setCustomerData({ ...customerData, hasAllergies: e.target.checked, allergiesDetails: e.target.checked ? customerData.allergiesDetails : '' })}
                  className="mt-1 w-4 h-4 accent-amber-400" />
                <span className="text-sm text-slate-300">One or more guests have allergies or food intolerances</span>
              </label>
              {customerData.hasAllergies && (
                <div className="mt-3">
                  <label className="block text-[10px] text-slate-500 tracking-widest mb-2">PLEASE SPECIFY ALLERGIES OR INTOLERANCES *</label>
                  <textarea value={customerData.allergiesDetails} onChange={(e) => setCustomerData({ ...customerData, allergiesDetails: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white focus:border-amber-400 focus:outline-none resize-none text-sm" rows="2"
                    placeholder="e.g. gluten-free, nut allergy, vegetarian, lactose intolerant..." />
                </div>
              )}
            </div>

            {/* MOBILITY */}
            <div className="border-t border-slate-800 pt-5">
              <p className="text-[10px] text-amber-400 tracking-widest mb-3 flex items-center gap-2"><Accessibility className="w-3 h-3" /> MOBILITY</p>
              <label className="flex items-start gap-3 cursor-pointer p-3 bg-slate-800/50 hover:bg-slate-800 transition">
                <input type="checkbox" checked={customerData.reducedMobility}
                  onChange={(e) => setCustomerData({ ...customerData, reducedMobility: e.target.checked, mobilityDetails: e.target.checked ? customerData.mobilityDetails : '' })}
                  className="mt-1 w-4 h-4 accent-amber-400" />
                <span className="text-sm text-slate-300">One or more guests have reduced mobility</span>
              </label>
              {customerData.reducedMobility && (
                <div className="mt-3">
                  <label className="block text-[10px] text-slate-500 tracking-widest mb-2">PLEASE SPECIFY *</label>
                  <textarea value={customerData.mobilityDetails} onChange={(e) => setCustomerData({ ...customerData, mobilityDetails: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white focus:border-amber-400 focus:outline-none resize-none text-sm" rows="2"
                    placeholder="e.g. wheelchair user, limited walking, needs assistance boarding..." />
                </div>
              )}
            </div>

            <div className="border-t border-slate-800 pt-5">
              <label className="block text-[10px] text-amber-400 tracking-widest mb-2">SPECIAL REQUESTS {selectedTour?.isCustom && '*'}</label>
              <textarea value={customerData.notes} onChange={(e) => setCustomerData({ ...customerData, notes: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white focus:border-amber-400 focus:outline-none resize-none" rows="3"
                placeholder={selectedTour?.isCustom ? "Describe your dream itinerary..." : "Occasions, preferences, anything else..."} />
            </div>
          </div>

          {/* RECAP con stima chiara e add-ons */}
          <div className="bg-slate-900 border border-amber-400/30 p-6 my-6">
            <p className="text-amber-400 text-[10px] tracking-[0.3em] mb-4">BOOKING SUMMARY</p>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex justify-between"><span>Tour</span><span className="text-white">{selectedTour?.name}</span></div>
              {selectedTour?.itineraryOptions && halfDayChoiceItinerary && (
                <div className="flex justify-between"><span>Itinerary</span><span className="text-white">{selectedTour.itineraryOptions.find(o => o.id === halfDayChoiceItinerary)?.name}</span></div>
              )}
              <div className="flex justify-between"><span>Date</span><span className="text-white">{selectedDate?.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
              <div className="flex justify-between"><span>Time</span><span className="text-white">{getFinalTimeSlot()}</span></div>
              <div className="flex justify-between"><span>Guests</span><span className="text-white">{numPeople}</span></div>
              <div className="flex justify-between"><span>Meeting point</span><span className="text-white text-right">{getFinalMeetingPoint()}</span></div>

              {!selectedTour?.isCustom && (
                <div className="pt-4 mt-4 border-t border-slate-700 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tour base</span>
                    <span className="text-white">€{selectedTour?.basePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-700/50">
                    <span className="text-slate-300">Estimated total</span>
                    <span className="text-white text-lg">€{selectedTour?.basePrice.toLocaleString()}</span>
                  </div>
                  <div className="mt-3 p-3 bg-amber-400/10 border border-amber-400/20">
                    <p className="text-[11px] text-amber-400 leading-relaxed flex items-start gap-2">
                      <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>This is an estimate. The final price will be confirmed by the skipper based on date, group size and requests — you will be contacted as soon as possible.</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* diagnostica visuale se l'invio al backend è fallito */}
          {submitError && (
            <div className="bg-red-950/30 border border-red-500/50 p-5 my-6">
              <div className="flex items-start gap-3 mb-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-300 font-semibold text-sm mb-2">Unable to submit your request</p>
                  {/* messaggio specifico se la causa è il filtro antispam */}
                  {submitError.message && submitError.message.toLowerCase().includes('spam') ? (
                    <p className="text-slate-300 text-sm leading-relaxed mb-3">
                      Our system could not validate your request. Please double-check your <span className="text-amber-400">name</span>, <span className="text-amber-400">email</span>, and <span className="text-amber-400">phone number</span> are complete and correct, then try again. If the problem persists, contact us directly:
                    </p>
                  ) : (
                    <p className="text-slate-300 text-sm leading-relaxed mb-3">
                      Please contact us directly — we'd love to hear from you:
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row gap-2 mb-4">
                    <a href={whatsappLink(`Hi! I tried to submit a booking request for ${selectedTour?.name} on ${selectedDate?.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })} but something went wrong. Can you help?`)}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2 text-xs tracking-wider transition">
                      <WhatsAppIcon className="w-4 h-4" /> WHATSAPP
                    </a>
                    <a href="tel:+393488289438" className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-amber-400 px-4 py-2 text-xs tracking-wider transition">
                      +39 348 828 9438
                    </a>
                    <a href="mailto:searunnerprenotazioni@gmail.com" className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-amber-400 px-4 py-2 text-xs tracking-wider transition">
                      EMAIL
                    </a>
                  </div>
                  {/* dettaglio tecnico per diagnosi — utile quando marco/luca aprono il sito per capire cosa non va */}
                  <details className="mt-3">
                    <summary className="text-[10px] text-slate-500 tracking-widest cursor-pointer hover:text-slate-400">TECHNICAL DETAILS (for support)</summary>
                    <pre className="mt-2 p-3 bg-slate-950 text-[10px] text-slate-400 overflow-x-auto whitespace-pre-wrap break-words">
{`Time: ${submitError.timestamp}
Error: ${submitError.message}
${submitError.rawResponse ? `Response: ${JSON.stringify(submitError.rawResponse, null, 2)}` : 'No response received (network error)'}`}
                    </pre>
                  </details>
                </div>
              </div>
            </div>
          )}

          <button onClick={handleSubmit} disabled={
              !customerData.name || customerData.name.trim().length < 2 ||
              !customerData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email) ||
              !customerData.phone || customerData.phone.replace(/\D/g, '').length < 8 ||
              (customerData.hasAllergies && !customerData.allergiesDetails.trim()) ||
              (customerData.reducedMobility && !customerData.mobilityDetails.trim()) ||
              (selectedTour?.isCustom && !customerData.notes)
            }
            className={`w-full py-4 tracking-[0.3em] text-sm transition ${
              customerData.name && customerData.name.trim().length >= 2 &&
              customerData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email) &&
              customerData.phone && customerData.phone.replace(/\D/g, '').length >= 8 &&
              (!customerData.hasAllergies || customerData.allergiesDetails.trim()) &&
              (!customerData.reducedMobility || customerData.mobilityDetails.trim()) &&
              (!selectedTour?.isCustom || customerData.notes)
                ? 'bg-amber-400 text-slate-950 hover:bg-amber-300' : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}>
            REQUEST QUOTE
          </button>
          <p className="text-center text-[10px] text-slate-500 tracking-widest mt-4">CAPTAIN MARCO WILL CONTACT YOU AS SOON AS POSSIBLE</p>
        </div>
      )}

      <footer className="border-t border-slate-800 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-4"><SeaRunnerLogoCompact size="md" /></div>
          <p className="text-slate-300 text-sm tracking-[0.2em] mb-2">SEA RUNNER</p>
          <p className="text-amber-400/70 text-[10px] tracking-[0.3em] mb-4">PRIVATE BOAT TOURS</p>
          <p className="text-slate-500 text-xs tracking-[0.3em]">+39 348 828 9438 • @SEARUNNER_LASPEZIA</p>
          <p className="text-slate-700 text-[10px] tracking-[0.3em] mt-2">PORTO MIRABELLO • LA SPEZIA • ITALIAN RIVIERA</p>
        </div>
      </footer>

      {/* bottone whatsapp floating visibile in tutte le pagine cliente */}
      <WhatsAppFloatingButton message={
        currentStep === 1
          ? 'Hi! I would like to know more about Sea Runner tours.'
          : selectedTour
            ? `Hi! I have a question about the ${selectedTour.name} tour.`
            : 'Hi! I would like to know more about Sea Runner tours.'
      } />
    </div>
  );
}


// ============ NAVBAR CONDIVISA ============
// mostrata in tutte le pagine tranne booking step 2/3 e dashboard skipper
// (il booking ha già il suo header con gli step 1/2/3)
function SharedNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/boat', label: 'The boat' },
    { to: '/booking', label: 'Book a tour' }
  ];

  const go = (to) => {
    setMenuOpen(false);
    navigate(to);
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950 sticky top-0 z-40" style={{ fontFamily: 'Georgia, serif' }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex-shrink-0"><SeaRunnerLogoCompact size="sm" /></div>
          <div className="min-w-0">
            <h1 className="text-white text-sm sm:text-lg tracking-[0.15em] sm:tracking-[0.2em] truncate">SEA RUNNER</h1>
            <p className="text-amber-400 text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] truncate">PRIVATE BOAT TOURS</p>
          </div>
        </Link>

        {/* nav desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`text-xs tracking-[0.2em] uppercase transition ${
                location.pathname === l.to ? 'text-amber-400' : 'text-slate-400 hover:text-amber-400'
              }`}>
              {l.label}
            </Link>
          ))}
        </nav>

        {/* menu hamburger mobile */}
        <button onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-slate-400 hover:text-amber-400 transition"
          aria-label="Toggle menu">
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* dropdown mobile */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950">
          <nav className="flex flex-col">
            {links.map(l => (
              <button key={l.to} onClick={() => go(l.to)}
                className={`px-6 py-4 text-left border-b border-slate-800 last:border-b-0 text-sm tracking-[0.2em] uppercase transition ${
                  location.pathname === l.to ? 'text-amber-400 bg-slate-900' : 'text-slate-400 hover:bg-slate-900 hover:text-amber-400'
                }`}>
                {l.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}


// ============ HOMEPAGE (route /) ============
function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white" style={{ fontFamily: 'Georgia, serif' }}>
      <SharedNav />

      {/* HERO — più bassa su mobile per lasciare intravedere la sezione sotto */}
      <section className="relative overflow-hidden" style={{ minHeight: '65vh' }}>
        {/* background: foto sfocata della barca + gradiente blu per leggibilità */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: 'url(/boat-2.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px) brightness(0.6)',
            transform: 'scale(1.1)'
          }}></div>
        {/* overlay blu per far risaltare il testo e dare il mood "italian riviera" */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(10,37,64,0.75) 0%, rgba(30,95,168,0.55) 50%, rgba(11,61,126,0.85) 100%)'
        }}></div>

        <div className="relative max-w-5xl mx-auto px-4 py-20 sm:py-24 md:py-32 text-center">
          <p className="text-amber-400 text-[10px] sm:text-xs tracking-[0.4em] sm:tracking-[0.5em] mb-4 sm:mb-6">LA SPEZIA · ITALIAN RIVIERA</p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl mb-5 sm:mb-6 leading-tight">
            Private boat tours along the<br/>
            <span style={{ fontFamily: '"Brush Script MT", "Lucida Handwriting", cursive', color: '#fbbf24', fontSize: '1.2em' }}>italian riviera</span>
          </h1>
          <div className="w-20 sm:w-24 h-px bg-amber-400 mx-auto mb-5 sm:mb-6"></div>
          <p className="text-slate-200 text-base sm:text-lg max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
            Cinque Terre, Gulf of Poets, Portofino. Exclusive day trips with Captain Marco and Paola.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/booking" className="bg-amber-400 text-slate-950 px-6 sm:px-8 py-3 sm:py-4 tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm hover:bg-amber-300 transition">
              BOOK YOUR TOUR
            </Link>
            <Link to="/boat" className="border border-amber-400 text-amber-400 px-6 sm:px-8 py-3 sm:py-4 tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm hover:bg-amber-400 hover:text-slate-950 transition">
              DISCOVER THE BOAT
            </Link>
          </div>
        </div>

        {/* indicatore scroll — una freccia discreta che "respira" per segnalare che c'è altro sotto */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-amber-400/70"
          style={{ animation: 'scrollBounce 2s ease-in-out infinite' }}>
          <span className="text-[9px] tracking-[0.3em]">SCROLL</span>
          <ChevronDown className="w-4 h-4" />
        </div>
        {/* keyframes inline per il bounce — così non serve toccare il css globale */}
        <style>{`
          @keyframes scrollBounce {
            0%, 100% { transform: translate(-50%, 0); opacity: 0.7; }
            50% { transform: translate(-50%, 6px); opacity: 1; }
          }
        `}</style>
      </section>

      {/* INTRO */}
      <section className="max-w-4xl mx-auto px-4 py-14 sm:py-20 text-center">
        <p className="text-amber-400 text-[10px] sm:text-xs tracking-[0.4em] mb-3 sm:mb-4">OUR STORY</p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl mb-5 sm:mb-6">A different way to see Liguria</h2>
        <div className="w-16 h-px bg-amber-400 mx-auto mb-6 sm:mb-8"></div>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-5 sm:mb-6">
          Captain Marco and Paola welcome you aboard for a fully private experience. No crowds, no fixed schedules. Just you and those you love, with the coastline unfolding at your own pace.
        </p>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Swim in hidden coves the big boats never reach. Snorkel the marine reserve with a guide. Enjoy a light Italian lunch on board with local wine while the colourful villages drift by. Every day at sea is crafted around you.
        </p>
      </section>

      {/* REVIEWS & RATINGS */}
      <section className="border-t border-slate-800 py-14 sm:py-20 bg-slate-900/30">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-1 mb-4">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
            </div>
            <p className="text-amber-400 text-xs tracking-[0.4em] mb-3">LOVED BY OUR GUESTS</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl mb-4">Highly rated across the web</h2>
            <div className="w-16 h-px bg-amber-400 mx-auto mb-6"></div>
            <p className="text-slate-400 max-w-xl mx-auto">
              Don't take our word for it — read what guests from all over the world have to say about their day at sea with us.
            </p>
          </div>

          {/* platform rating cards con link veri */}
          <div className="grid sm:grid-cols-2 gap-4 mb-10 max-w-3xl mx-auto">
            {[
              { name: 'Google', url: 'https://share.google/6jVbuTak13P75aq2Y', cta: 'Read on Google' },
              { name: 'TripAdvisor', url: 'https://www.tripadvisor.it/AttractionProductReview-g187824-d25176464-Cinque_Terre_and_Portovenere_Private_Boat_Tour_from_La_Spezia-La_Spezia_Province_o.html', cta: 'Read on TripAdvisor' }
            ].map(p => (
              <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
                className="bg-slate-900 border border-slate-800 p-6 text-center hover:border-amber-400 transition block group">
                <p className="text-xs text-slate-500 tracking-[0.3em] mb-4">{p.name.toUpperCase()}</p>
                <div className="flex items-center justify-center gap-1 mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-amber-400 tracking-wider group-hover:underline">{p.cta} →</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* TOURS PREVIEW */}
      <section className="border-t border-slate-800 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-amber-400 text-xs tracking-[0.4em] mb-3">EXCLUSIVE EXPERIENCES</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl mb-4">Choose your tour</h2>
            <div className="w-16 h-px bg-amber-400 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {initialTours.slice(0, 3).map(tour => (
              <Link key={tour.id} to="/booking"
                className="group block bg-slate-900 hover:shadow-2xl hover:shadow-amber-400/10 transition overflow-hidden border border-slate-800 hover:border-amber-400">
                <TourCardImage tour={tour} />
                <div className="p-5 sm:p-6">
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">{tour.shortDesc}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-500 tracking-widest">FROM</p>
                      <p className="text-3xl text-white">€{tour.basePrice.toLocaleString()}</p>
                    </div>
                    <div className="border border-amber-400 text-amber-400 px-4 py-2 text-xs tracking-widest group-hover:bg-amber-400 group-hover:text-slate-950 transition">
                      BOOK →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/booking" className="text-amber-400 hover:text-amber-300 text-sm tracking-[0.3em] transition">
              VIEW ALL TOURS →
            </Link>
          </div>
        </div>
      </section>

      {/* BOAT TEASER */}
      <section className="border-t border-slate-800 py-14 sm:py-20 bg-slate-900/30">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/3] bg-slate-800 overflow-hidden relative" style={{ backgroundColor: '#0b3d7e' }}>
            <img src="/boat-1.jpg" alt="Sea Runner at the Tino lighthouse"
              className="w-full h-full"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              loading="lazy" />
          </div>
          <div>
            <p className="text-amber-400 text-xs tracking-[0.4em] mb-4">THE BOAT</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl mb-4">Cap Camarat 9.0 WA</h2>
            <p className="text-slate-400 italic text-sm mb-6">Best Boat of the Year · multiple awards</p>
            <div className="w-16 h-px bg-amber-400 mb-6"></div>
            <p className="text-slate-300 leading-relaxed mb-6">
              Solar-powered silence at anchor. Smooth cruising thanks to an intelligent flap system. Extendable shade, bathroom on board, and everything you need for a full day of pleasure.
            </p>
            <Link to="/boat" className="inline-block border border-amber-400 text-amber-400 px-6 py-3 text-xs tracking-[0.3em] hover:bg-amber-400 hover:text-slate-950 transition">
              DISCOVER THE BOAT →
            </Link>
          </div>
        </div>
      </section>

      {/* CONTACT STRIP */}
      <section className="border-t border-slate-800 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-amber-400 text-[10px] sm:text-xs tracking-[0.4em] mb-3 sm:mb-4">GET IN TOUCH</p>
          <h2 className="text-2xl sm:text-3xl mb-4 sm:mb-6">Questions before booking?</h2>
          <p className="text-slate-400 text-sm sm:text-base mb-6 sm:mb-8">Marco and Paola reply personally, usually within a few hours.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center max-w-sm sm:max-w-none mx-auto">
            <a href={whatsappLink('Hi! I would like to know more about Sea Runner tours.')} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 sm:px-6 py-3 text-xs tracking-[0.2em] sm:tracking-[0.3em] transition">
              <WhatsAppIcon className="w-4 h-4" /> WHATSAPP
            </a>
            <a href="tel:+393488289438" className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-amber-400 px-5 sm:px-6 py-3 text-xs tracking-[0.2em] sm:tracking-[0.3em] transition">
              <Phone className="w-4 h-4" /> +39 348 828 9438
            </a>
            <a href="mailto:searunnerprenotazioni@gmail.com" className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-amber-400 px-5 sm:px-6 py-3 text-xs tracking-[0.2em] sm:tracking-[0.3em] transition">
              <Mail className="w-4 h-4" /> EMAIL
            </a>
          </div>
        </div>
      </section>

      <SharedFooter />
    </div>
  );
}


// ============ BOAT PHOTO GALLERY ============
// gallery scorribile della barca. quando avremo le foto reali basta sostituire
// l'array BOAT_PHOTOS con i path delle immagini su github (es. '/boat-1.jpg')
// ordine pensato: apro con le 2 esterne più spettacolari (faro + vista dall'alto),
// poi dettagli interni, poi chiudo con la foto "esperienza" del tavolo al tramonto
const BOAT_PHOTOS = [
  { src: '/boat-1.jpg', caption: 'Anchored at the Tino lighthouse' },
  { src: '/boat-2.jpg', caption: 'Cruising the Ligurian coast' },
  { src: '/boat-3.jpg', caption: 'Twin Yamaha 225 HP — smooth and powerful' },
  { src: '/bathroom.jpg', caption: 'Bathroom on board' },
  { src: '/fridge.jpg', caption: 'Fresh drinks, always cold' },
  { src: '/sunset-table.jpg', caption: 'Sunset aperitivo on board' },
];

function BoatPhotoGallery() {
  const [index, setIndex] = useState(0);
  const photos = BOAT_PHOTOS;
  const hasPhotos = photos.length > 0;
  const total = photos.length;

  const prev = () => setIndex((index - 1 + total) % total);
  const next = () => setIndex((index + 1) % total);

  // se non ci sono foto, mostriamo placeholder con aspect 16:9
  if (!hasPhotos) {
    return (
      <div className="mb-12 aspect-[16/9] bg-slate-900 border border-slate-800 flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#0b3d7e' }}>
        <Anchor className="w-32 h-32 text-amber-400/20" />
        <div className="absolute bottom-4 left-4 right-4 text-center">
          <p className="text-white/50 text-xs tracking-widest italic">BOAT PHOTOS COMING SOON</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      {/* container senza aspect ratio fisso: si adatta alla foto.
          max-height scala in base al device per evitare che foto verticali diventino giganti su mobile */}
      <div className="bg-slate-900 border border-slate-800 relative overflow-hidden flex items-center justify-center"
        style={{ maxHeight: 'min(60vh, 550px)', minHeight: '240px' }}>
        <img src={photos[index].src} alt={photos[index].caption || `Boat photo ${index + 1}`}
          className="block w-auto h-auto max-w-full"
          style={{ maxHeight: 'min(60vh, 550px)' }}
          loading="lazy"
          onError={(e) => { e.target.style.display = 'none'; }} />

        {photos[index].caption && (
          <div className="absolute bottom-4 left-4 bg-slate-950/70 px-3 py-2 z-10">
            <p className="text-white text-xs tracking-wider">{photos[index].caption}</p>
          </div>
        )}

        {/* frecce di navigazione — visibili solo se ci sono 2+ foto */}
        {total > 1 && (
          <>
            <button onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-950/60 hover:bg-slate-950/90 text-white flex items-center justify-center transition z-10"
              aria-label="Previous photo">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-950/60 hover:bg-slate-950/90 text-white flex items-center justify-center transition z-10"
              aria-label="Next photo">
              <ChevronRight className="w-5 h-5" />
            </button>
            {/* dots indicatore */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {photos.map((_, i) => (
                <button key={i} onClick={() => setIndex(i)}
                  className={`w-2 h-2 rounded-full transition ${i === index ? 'bg-amber-400 w-6' : 'bg-white/40 hover:bg-white/70'}`}
                  aria-label={`Go to photo ${i + 1}`} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* counter sotto la gallery se ci sono più foto */}
      {total > 1 && (
        <p className="text-center text-[10px] text-slate-500 tracking-widest mt-3">{index + 1} / {total}</p>
      )}
    </div>
  );
}


// ============ PLANIMETRIA SECTION ============
// componente separato perché gestisce lo stato di errore in caricamento immagine
// (quando /plani.jpg manca, mostriamo un placeholder pulito senza crash)
function BoatLayoutSection() {
  const [imgError, setImgError] = useState(false);
  return (
    <section className="max-w-4xl mx-auto px-4 mb-16">
      <div className="text-center mb-8">
        <p className="text-amber-400 text-xs tracking-[0.3em] mb-3">BOAT LAYOUT</p>
        <h3 className="text-2xl mb-2">How the boat is organized</h3>
        <div className="w-16 h-px bg-amber-400/50 mx-auto"></div>
      </div>
      <div className="bg-white p-6 md:p-10">
        {imgError ? (
          <div style={{ aspectRatio: '16/9' }} className="flex items-center justify-center bg-slate-100 text-slate-500 text-xs tracking-widest">
            BOAT LAYOUT COMING SOON
          </div>
        ) : (
          <img src="/plani.jpg" alt="Cap Camarat 9.0 WA layout"
            className="w-full h-auto"
            onError={() => setImgError(true)} />
        )}
      </div>
      <p className="text-center text-[10px] text-slate-500 italic mt-3 tracking-wider">Official layout from Jeanneau</p>
    </section>
  );
}


// ============ BOATPAGE (route /boat) ============
function BoatPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white" style={{ fontFamily: 'Georgia, serif' }}>
      <SharedNav />

      {/* HERO con titolo e nome modello */}
      <section className="max-w-5xl mx-auto px-4 pt-10 sm:pt-16 pb-8 sm:pb-10">
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-amber-400 text-[10px] sm:text-xs tracking-[0.4em] mb-3 sm:mb-4">THE BOAT</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl mb-3">Cap Camarat 9.0 WA</h1>
          <p className="text-slate-400 italic text-xs sm:text-sm mb-4 sm:mb-5">Best Boat of the Year · multiple awards</p>
          <div className="w-20 sm:w-24 h-px bg-amber-400 mx-auto mb-5 sm:mb-6"></div>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed px-2">
            An award-winning vessel, chosen for one reason only: it lets you feel the sea at its best.
          </p>
        </div>

        {/* foto gallery scorribile */}
        <BoatPhotoGallery />
      </section>

      {/* 3 SPEC CARD — sempre su 3 colonne anche mobile, in formato compatto */}
      <section className="max-w-5xl mx-auto px-4 mb-12 sm:mb-16">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="bg-slate-900 border border-slate-800 p-3 sm:p-6 text-center">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 mx-auto mb-2 sm:mb-3" />
            <p className="text-lg sm:text-2xl mb-1 leading-tight">up to 8</p>
            <p className="text-[9px] sm:text-xs text-slate-500 tracking-widest">GUESTS</p>
            <p className="text-[8px] sm:text-[10px] text-slate-600 tracking-wider mt-1 sm:mt-2">+ crew</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-3 sm:p-6 text-center">
            <Droplets className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 mx-auto mb-2 sm:mb-3" />
            <p className="text-lg sm:text-2xl mb-1 leading-tight">Bathroom</p>
            <p className="text-[9px] sm:text-xs text-slate-500 tracking-widest">ON BOARD</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-3 sm:p-6 text-center">
            <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 mx-auto mb-2 sm:mb-3" />
            <p className="text-lg sm:text-2xl mb-1 leading-tight">Extendable</p>
            <p className="text-[9px] sm:text-xs text-slate-500 tracking-widest">BIMINI</p>
          </div>
        </div>
      </section>

      {/* BLOCCHI ESPERIENZIALI: ogni feature è un beneficio sentito a bordo */}
      <section className="max-w-4xl mx-auto px-4 mb-12 sm:mb-16">
        <div className="space-y-7 sm:space-y-10">
          {/* silenzio */}
          <div>
            <p className="text-amber-400 text-xs tracking-[0.3em] mb-3">SILENCE AT ANCHOR</p>
            <h3 className="text-xl sm:text-2xl mb-3">Only the sound of the sea</h3>
            <p className="text-slate-300 leading-relaxed">
              Solar panels keep our two fridges running all day long — even at anchor, with no generator noise and zero emissions. When the engines are off, the only soundtrack is the water.
            </p>
          </div>

          {/* comfort navigazione */}
          <div className="pt-7 sm:pt-10 border-t border-slate-800">
            <p className="text-amber-400 text-xs tracking-[0.3em] mb-3">SMOOTH CRUISING</p>
            <h3 className="text-xl sm:text-2xl mb-3">Steady on every wave</h3>
            <p className="text-slate-300 leading-relaxed">
              An intelligent flap system adjusts the trim in real time, softening every movement. Twin Yamaha 225 HP engines deliver power when you need it, without ever feeling rushed.
            </p>
          </div>

          {/* ombra */}
          <div className="pt-7 sm:pt-10 border-t border-slate-800">
            <p className="text-amber-400 text-xs tracking-[0.3em] mb-3">SHADE WHEN YOU WANT IT</p>
            <h3 className="text-xl sm:text-2xl mb-3">Sun or shade, you decide</h3>
            <p className="text-slate-300 leading-relaxed">
              An extendable bimini covers the entire rear deck when the sun is at its strongest, and retracts in seconds when you want to feel the breeze and the light on your skin.
            </p>
          </div>

          {/* comfort bordo */}
          <div className="pt-7 sm:pt-10 border-t border-slate-800">
            <p className="text-amber-400 text-xs tracking-[0.3em] mb-3">EVERYTHING YOU NEED</p>
            <h3 className="text-xl sm:text-2xl mb-3">A proper home at sea</h3>
            <p className="text-slate-300 leading-relaxed">
              Private bathroom on board, fresh water shower, Fusion bluetooth stereo to set the mood, generous swim platform, fridges always stocked. Nothing is missing for a full day of pleasure.
            </p>
          </div>
        </div>
      </section>

      {/* PLANIMETRIA — layout della barca dal sito jeanneau */}
      <BoatLayoutSection />

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <div className="text-center border-t border-slate-800 pt-12">
          <p className="text-slate-400 mb-6">Ready to plan your day at sea?</p>
          <Link to="/booking" className="inline-block bg-amber-400 text-slate-950 px-8 py-4 tracking-[0.3em] text-sm hover:bg-amber-300 transition">
            BOOK YOUR TOUR →
          </Link>
        </div>
      </section>

      <SharedFooter />
    </div>
  );
}


// ============ FOOTER CONDIVISO ============
function SharedFooter() {
  return (
    <footer className="border-t border-slate-800 mt-20 py-10">
      <div className="max-w-7xl mx-auto px-4 text-center" style={{ fontFamily: 'Georgia, serif' }}>
        <div className="flex justify-center mb-4"><SeaRunnerLogoCompact size="md" /></div>
        <p className="text-slate-300 text-sm tracking-[0.2em] mb-2">SEA RUNNER</p>
        <p className="text-amber-400/70 text-[10px] tracking-[0.3em] mb-4">PRIVATE BOAT TOURS</p>
        <p className="text-slate-500 text-xs tracking-[0.3em]">+39 348 828 9438 • @SEARUNNER_LASPEZIA</p>
        <p className="text-slate-700 text-[10px] tracking-[0.3em] mt-2">PORTO MIRABELLO • LA SPEZIA • ITALIAN RIVIERA</p>
      </div>
    </footer>
  );
}


// ============ ROOT APP CON ROUTER ============

// resetta lo scroll in cima ogni volta che cambia l'url — altrimenti react router
// mantiene la posizione di scroll della pagina precedente e il cliente atterra a metà pagina
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export default function SeaRunnerApp() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/boat" element={<BoatPage />} />
        <Route path="/booking" element={<BookingApp />} />
        {/* fallback: rotte non esistenti riportano a home */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
