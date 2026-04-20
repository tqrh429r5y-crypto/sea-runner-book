import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, Check, Wine, Utensils, Lock, LogOut, X, CheckCircle, XCircle, Globe, Sparkles, Info, Edit2, Save, Euro, Sunset, Sun, AlertCircle, Accessibility, RefreshCw } from 'lucide-react';

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

export default function SeaRunnerApp() {
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
    const addOnsText = selectedAddOns.length > 0 ? selectedAddOns.map(id => addOns.find(a => a.id === id)?.name).join(', ') : 'None';
    const allergiesText = customerData.hasAllergies ? (customerData.allergiesDetails || 'Yes (details to discuss)') : 'None';
    const mobilityText = customerData.reducedMobility ? (customerData.mobilityDetails || 'Yes (details to discuss)') : 'None';
    const itineraryText = selectedTour.itineraryOptions && halfDayChoiceItinerary
      ? selectedTour.itineraryOptions.find(o => o.id === halfDayChoiceItinerary)?.name : '';
    const dateFormatted = selectedDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    // ordine richiesto: data, pax, nome, telefono, email, tipo tour, meeting point, prezzo, allergie, restrizioni
    // versione plain text (fallback)
    const emailBody = `NEW BOOKING REQUEST

QUICK INDEX
1. Date & Time
2. Guests
3. Customer
4. Contact
5. Tour
6. Meeting point
7. Price estimate
8. Allergies
9. Mobility / restrictions
10. Additional notes

=============================
1. DATE & TIME
=============================
${dateFormatted}
${getFinalTimeSlot()}
Duration: ${selectedTour.duration}

=============================
2. GUESTS
=============================
${numPeople} ${numPeople === 1 ? 'guest' : 'guests'}

=============================
3. CUSTOMER
=============================
${customerData.name}
Preferred language: ${customerData.language}

=============================
4. CONTACT
=============================
Phone: ${customerData.phone}
Email: ${customerData.email}

=============================
5. TOUR
=============================
${selectedTour.name} — ${selectedTour.subtitle}
${itineraryText ? `Itinerary: ${itineraryText}` : ''}
${selectedAddOns.length > 0 ? `Add-ons: ${addOnsText}` : 'Add-ons: none'}

=============================
6. MEETING POINT
=============================
${getFinalMeetingPoint()}

=============================
7. PRICE ESTIMATE
=============================
Base: EUR ${selectedTour.basePrice}${selectedAddOns.length > 0 ? ' + add-ons (price on request)' : ''}
(estimate — final quote from skipper)

=============================
8. ALLERGIES
=============================
${allergiesText}

=============================
9. MOBILITY / RESTRICTIONS
=============================
${mobilityText}

=============================
10. ADDITIONAL NOTES
=============================
${customerData.notes || 'No special requests'}

`.trim();

    // versione HTML con indice cliccabile e sezioni ancorate
    const emailHtml = `
<div style="font-family: Georgia, serif; max-width: 640px; margin: 0 auto; color: #1e293b; background: #f8fafc; padding: 24px;">
  <div style="background: #0a2540; color: white; padding: 20px; margin-bottom: 20px; border-left: 4px solid #fbbf24;">
    <p style="margin: 0; font-size: 10px; letter-spacing: 3px; color: #fbbf24;">SEA RUNNER</p>
    <h2 style="margin: 4px 0 0 0; font-size: 22px;">New Booking Request</h2>
    <p style="margin: 8px 0 0 0; font-size: 14px; color: #cbd5e1;">${dateFormatted} — ${numPeople} ${numPeople === 1 ? 'guest' : 'guests'}</p>
  </div>

  <div style="background: white; padding: 20px; margin-bottom: 20px; border: 1px solid #e2e8f0;">
    <p style="margin: 0 0 10px 0; font-size: 10px; letter-spacing: 2px; color: #0a2540; font-weight: bold;">QUICK INDEX</p>
    <ol style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
      <li><a href="#s1" style="color: #0a2540; text-decoration: none;">Date &amp; Time</a></li>
      <li><a href="#s2" style="color: #0a2540; text-decoration: none;">Guests</a></li>
      <li><a href="#s3" style="color: #0a2540; text-decoration: none;">Customer</a></li>
      <li><a href="#s4" style="color: #0a2540; text-decoration: none;">Contact</a></li>
      <li><a href="#s5" style="color: #0a2540; text-decoration: none;">Tour</a></li>
      <li><a href="#s6" style="color: #0a2540; text-decoration: none;">Meeting point</a></li>
      <li><a href="#s7" style="color: #0a2540; text-decoration: none;">Price estimate</a></li>
      <li><a href="#s8" style="color: #0a2540; text-decoration: none;">Allergies</a></li>
      <li><a href="#s9" style="color: #0a2540; text-decoration: none;">Mobility / restrictions</a></li>
      <li><a href="#s10" style="color: #0a2540; text-decoration: none;">Additional notes</a></li>
    </ol>
  </div>

  <div id="s1" style="background: white; padding: 20px; margin-bottom: 12px; border-left: 4px solid #fbbf24;">
    <p style="margin: 0 0 6px 0; font-size: 10px; letter-spacing: 2px; color: #94a3b8;">1 — DATE &amp; TIME</p>
    <p style="margin: 0; font-size: 18px; color: #0a2540;"><strong>${dateFormatted}</strong></p>
    <p style="margin: 4px 0 0 0; font-size: 14px; color: #475569;">${getFinalTimeSlot()} · Duration: ${selectedTour.duration}</p>
  </div>

  <div id="s2" style="background: white; padding: 20px; margin-bottom: 12px; border-left: 4px solid #fbbf24;">
    <p style="margin: 0 0 6px 0; font-size: 10px; letter-spacing: 2px; color: #94a3b8;">2 — GUESTS</p>
    <p style="margin: 0; font-size: 20px; color: #0a2540;"><strong>${numPeople}</strong> ${numPeople === 1 ? 'guest' : 'guests'}</p>
  </div>

  <div id="s3" style="background: white; padding: 20px; margin-bottom: 12px; border-left: 4px solid #fbbf24;">
    <p style="margin: 0 0 6px 0; font-size: 10px; letter-spacing: 2px; color: #94a3b8;">3 — CUSTOMER</p>
    <p style="margin: 0; font-size: 18px; color: #0a2540;"><strong>${customerData.name}</strong></p>
    <p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">Preferred language: ${customerData.language}</p>
  </div>

  <div id="s4" style="background: white; padding: 20px; margin-bottom: 12px; border-left: 4px solid #fbbf24;">
    <p style="margin: 0 0 6px 0; font-size: 10px; letter-spacing: 2px; color: #94a3b8;">4 — CONTACT</p>
    <p style="margin: 0; font-size: 15px;"><strong>Phone:</strong> <a href="tel:${customerData.phone}" style="color: #0a2540;">${customerData.phone}</a></p>
    <p style="margin: 4px 0 0 0; font-size: 15px;"><strong>Email:</strong> <a href="mailto:${customerData.email}" style="color: #0a2540;">${customerData.email}</a></p>
  </div>

  <div id="s5" style="background: white; padding: 20px; margin-bottom: 12px; border-left: 4px solid #fbbf24;">
    <p style="margin: 0 0 6px 0; font-size: 10px; letter-spacing: 2px; color: #94a3b8;">5 — TOUR</p>
    <p style="margin: 0; font-size: 18px; color: #0a2540;"><strong>${selectedTour.name}</strong></p>
    <p style="margin: 4px 0 0 0; font-size: 14px; color: #475569;">${selectedTour.subtitle}</p>
    ${itineraryText ? `<p style="margin: 8px 0 0 0; font-size: 13px; color: #475569;">Itinerary: <strong>${itineraryText}</strong></p>` : ''}
    <p style="margin: 8px 0 0 0; font-size: 13px; color: #475569;">Add-ons: ${selectedAddOns.length > 0 ? addOnsText : 'none'}</p>
  </div>

  <div id="s6" style="background: white; padding: 20px; margin-bottom: 12px; border-left: 4px solid #fbbf24;">
    <p style="margin: 0 0 6px 0; font-size: 10px; letter-spacing: 2px; color: #94a3b8;">6 — MEETING POINT</p>
    <p style="margin: 0; font-size: 16px; color: #0a2540;"><strong>${getFinalMeetingPoint()}</strong></p>
  </div>

  <div id="s7" style="background: white; padding: 20px; margin-bottom: 12px; border-left: 4px solid #fbbf24;">
    <p style="margin: 0 0 6px 0; font-size: 10px; letter-spacing: 2px; color: #94a3b8;">7 — PRICE ESTIMATE</p>
    <p style="margin: 0; font-size: 22px; color: #0a2540;"><strong>€${selectedTour.basePrice.toLocaleString()}</strong>${selectedAddOns.length > 0 ? ' <span style="font-size: 13px; color: #64748b;">+ add-ons (price on request)</span>' : ''}</p>
    <p style="margin: 6px 0 0 0; font-size: 12px; font-style: italic; color: #64748b;">Estimate — final quote to be confirmed by skipper</p>
  </div>

  <div id="s8" style="background: ${customerData.hasAllergies ? '#fef3c7' : 'white'}; padding: 20px; margin-bottom: 12px; border-left: 4px solid ${customerData.hasAllergies ? '#f59e0b' : '#fbbf24'};">
    <p style="margin: 0 0 6px 0; font-size: 10px; letter-spacing: 2px; color: #94a3b8;">8 — ALLERGIES</p>
    <p style="margin: 0; font-size: 15px; color: #0a2540;">${allergiesText}</p>
  </div>

  <div id="s9" style="background: ${customerData.reducedMobility ? '#fef3c7' : 'white'}; padding: 20px; margin-bottom: 12px; border-left: 4px solid ${customerData.reducedMobility ? '#f59e0b' : '#fbbf24'};">
    <p style="margin: 0 0 6px 0; font-size: 10px; letter-spacing: 2px; color: #94a3b8;">9 — MOBILITY / RESTRICTIONS</p>
    <p style="margin: 0; font-size: 15px; color: #0a2540;">${mobilityText}</p>
  </div>

  <div id="s10" style="background: white; padding: 20px; margin-bottom: 12px; border-left: 4px solid #fbbf24;">
    <p style="margin: 0 0 6px 0; font-size: 10px; letter-spacing: 2px; color: #94a3b8;">10 — ADDITIONAL NOTES</p>
    <p style="margin: 0; font-size: 14px; color: #475569; font-style: ${customerData.notes ? 'normal' : 'italic'};">${customerData.notes || 'No special requests'}</p>
  </div>

  <div style="margin-top: 20px; padding: 16px; background: #0a2540; color: white; text-align: center; font-size: 12px; letter-spacing: 2px;">
    SEA RUNNER · PRIVATE BOAT TOURS · LA SPEZIA
  </div>
</div>`.trim();

    if (WEB3FORMS_KEY && WEB3FORMS_KEY !== 'YOUR_ACCESS_KEY_HERE') {
      try {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: `New Booking: ${selectedTour.name} — ${customerData.name} (${dateFormatted})`,
            from_name: `Sea Runner — ${customerData.name}`,
            email: customerData.email,
            message: emailBody,
            // web3forms supporta html_message per il rendering ricco
            html_message: emailHtml
          })
        });
      } catch (error) { console.error('Email send error:', error); }
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
      <header className="border-b border-slate-800 bg-slate-950 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SeaRunnerLogoCompact size="sm" />
            <div><h1 className="text-white text-lg tracking-[0.2em]">SEA RUNNER</h1>
              <p className="text-amber-400 text-[10px] tracking-[0.3em]">PRIVATE BOAT TOURS</p></div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            {['TOUR', 'DATE', 'DETAILS'].map((label, idx) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${currentStep >= idx+1 ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>{idx + 1}</div>
                <span className={`text-xs tracking-widest ${currentStep >= idx+1 ? 'text-amber-400' : 'text-slate-500'}`}>{label}</span>
                {idx < 2 && <div className="w-6 h-px bg-slate-700 ml-2"></div>}
              </div>
            ))}
          </div>
          <button onClick={() => setShowSkipperLogin(true)} className="flex items-center gap-2 text-xs text-slate-400 hover:text-amber-400 transition tracking-widest">
            <Lock className="w-3 h-3" /> SKIPPER
          </button>
        </div>
      </header>

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

          {/* ADD-ONS */}
          <div className="bg-slate-900 border border-slate-800 p-6 mb-6">
            <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
              <p className="text-amber-400 text-[10px] tracking-[0.3em] flex items-center gap-2"><Sparkles className="w-3 h-3" /> ELEVATE YOUR EXPERIENCE <span className="text-slate-500 normal-case">(optional)</span></p>
              <div className="flex items-center gap-2 text-[10px] text-amber-400/70 bg-amber-400/10 px-3 py-1 border border-amber-400/20">
                <Info className="w-3 h-3" /> NOT INCLUDED • PRICE ON REQUEST
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              {addOns.map(addon => {
                const Icon = addon.icon;
                const selected = selectedAddOns.includes(addon.id);
                return (
                  <button key={addon.id} onClick={() => toggleAddOn(addon.id)}
                    className={`text-left p-4 border transition ${selected ? 'border-amber-400 bg-amber-400/5' : 'border-slate-700 hover:border-slate-600'}`}>
                    <Icon className={`w-6 h-6 mb-2 ${selected ? 'text-amber-400' : 'text-slate-500'}`} />
                    <p className={`text-sm mb-1 ${selected ? 'text-white' : 'text-slate-300'}`}>{addon.name}</p>
                    <p className="text-[11px] text-slate-500 leading-tight mb-2">{addon.desc}</p>
                    <p className="text-[10px] text-amber-400/70 italic">Price on request</p>
                  </button>
                );
              })}
            </div>
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
                  {selectedAddOns.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">+ price of add-ons</span>
                      <span className="text-amber-400/80 italic text-xs">on request</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-slate-700/50">
                    <span className="text-slate-300">Estimated total</span>
                    <span className="text-white text-lg">€{selectedTour?.basePrice.toLocaleString()}{selectedAddOns.length > 0 && ' + add-ons'}</span>
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

          <button onClick={handleSubmit} disabled={
              !customerData.name || !customerData.email || !customerData.phone ||
              (customerData.hasAllergies && !customerData.allergiesDetails.trim()) ||
              (customerData.reducedMobility && !customerData.mobilityDetails.trim()) ||
              (selectedTour?.isCustom && !customerData.notes)
            }
            className={`w-full py-4 tracking-[0.3em] text-sm transition ${
              customerData.name && customerData.email && customerData.phone &&
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
