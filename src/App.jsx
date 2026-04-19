import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, Check, Wine, Utensils, Lock, LogOut, X, CheckCircle, XCircle, Globe, Sparkles, Info, Edit2, Save, Euro, Sunset, Sun, AlertCircle, Accessibility, RefreshCw } from 'lucide-react';

// ============ GOOGLE CALENDAR SYNC ============
// l'app legge il google calendar "Prenotazioni" di sea runner tramite un proxy CORS.
// il calendario è pubblico in modalità "solo disponibilità": gli orari sono preservati,
// i titoli sono tutti "Busy" — usiamo gli orari per classificare il tipo di slot occupato.
const GOOGLE_CALENDAR_ICS_URL = 'https://calendar.google.com/calendar/ical/searunnerprenotazioni%40gmail.com/public/basic.ics';
// proxy cors pubblico — se un giorno smette di funzionare, cambiare solo questa riga.
// alternative: https://api.allorigins.win/raw?url=   oppure   https://cors-anywhere.herokuapp.com/
const CORS_PROXY = 'https://corsproxy.io/?';

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

// fa il fetch del .ics e restituisce un array di eventi normalizzati:
// [{ date: Date, slotType: 'full-day'|..., part: 'morning'|..., source: 'gcal' }]
async function fetchGoogleCalendarEvents() {
  try {
    const response = await fetch(CORS_PROXY + encodeURIComponent(GOOGLE_CALENDAR_ICS_URL));
    if (!response.ok) throw new Error('CORS proxy failed: ' + response.status);
    const icsText = await response.text();

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
      // deriviamo "part" (morning/afternoon/evening) dallo slotType per compatibilità con la logica interna
      let part = null;
      if (slotType === 'half-day-morning') part = 'morning';
      else if (slotType === 'half-day-afternoon') part = 'afternoon';
      else if (slotType === 'sunset') part = 'evening';

      // normalizziamo gli slotType half-day-* nel singolo 'half-day-choice' usato internamente
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
    console.warn('[sea-runner] google calendar sync failed, using internal bookings only:', error);
    return null; // null = errore, array vuoto = "ok ma nessun evento"
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
    shortDesc: 'All five villages by sea — swim, snorkel, Italian lunch on board.',
    longDesc: 'Cruise the entire UNESCO coastline past Riomaggiore, Manarola, Corniglia, Vernazza and Monterosso. Swim in hidden coves, snorkel the marine reserve, and enjoy a light Italian lunch on board as the colourful villages drift by.',
    includes: ['Light Italian lunch', 'Open bar', 'Snorkeling guide', 'Multilingual hostess', 'Private parking', 'Towels & equipment']
  },
  {
    id: 'golfo-poeti', name: 'Golfo dei poeti', subtitle: 'Full day Tour',
    duration: '7 hours', fixedTime: '10:00 – 17:00', slotType: 'full-day',
    basePrice: 1400, maxPeople: 8, brandColor: '#0e5d63', accent: '#fbbf24',
    cardImage: '/golfo-poeti-v2.png',
    shortDesc: "Byron's gulf — Portovenere, Palmaria island, Lerici and hidden Tellaro.",
    longDesc: 'Explore the gulf that enchanted Byron and Shelley. Medieval Portovenere, the wild islands of Palmaria and Tino, elegant Lerici and the hidden gem of Tellaro — with swim stops and a light lunch on board.',
    includes: ['Light Italian lunch', 'Open bar', 'Snorkeling guide', 'Multilingual hostess', 'Private parking', 'Towels & equipment']
  },
  {
    id: 'portofino', name: 'Portofino', subtitle: 'San Fruttuoso & Cinque Terre',
    duration: '10 hours', fixedTime: '9:00 – 19:00', slotType: 'full-day-extended',
    basePrice: 2350, maxPeople: 8, brandColor: '#065f46', accent: '#fbbf24',
    cardImage: '/portofino-v2.png',
    shortDesc: 'The full Riviera — Portofino, San Fruttuoso abbey, Cinque Terre on return.',
    longDesc: "A long day along the Riviera di Levante to Italy's most iconic harbour. Stop at the medieval abbey of San Fruttuoso, dock in Portofino for free time ashore, snorkel the Marine Protected Area, then cruise past the Cinque Terre on the way back.",
    includes: ['Light lunch on board', 'Open bar', 'Snorkeling guide', 'Private parking', 'Towels & equipment'],
    notIncluded: 'Restaurant lunch in Portofino at own expense'
  },
  {
    id: 'half-day-choice', name: 'Half day', subtitle: 'Cinque Terre or Gulf of Poets',
    duration: '4 hours', slotType: 'half-day-choice',
    basePrice: 1000, maxPeople: 8, brandColor: '#1e40af', accent: '#fbbf24',
    cardImage: '/half-day-v2.png',
    shortDesc: 'Pick your coastline, pick your moment — morning, afternoon or evening.',
    longDesc: 'A shorter escape with the same magic. Choose between the Cinque Terre route or the Gulf of Poets, then pick the light you prefer: fresh morning, sunny afternoon, or evening golden hour.',
    itineraryOptions: [
      { id: 'cinque', name: 'Cinque Terre', desc: 'Portovenere → Riomaggiore → Manarola → Vernazza' },
      { id: 'golfo', name: 'Gulf of Poets', desc: 'Portovenere → Palmaria → Lerici → Tellaro' }
    ],
    timeOfDay: [
      { id: 'morning', label: 'Morning', time: '9:30 – 13:30', icon: 'sun' },
      { id: 'afternoon', label: 'Afternoon', time: '14:00 – 18:00', icon: 'sun' },
      { id: 'evening', label: 'Evening', time: '17:00 – 21:00', icon: 'sunset' }
    ],
    includes: ['Italian aperitivo', 'Open bar', 'Snorkeling guide', 'Private parking', 'Towels']
  },
  {
    id: 'sunset', name: 'Sunset Tour', subtitle: 'Golden hour aperitivo',
    duration: '3.5 hours', fixedTime: '17:30 – 21:00', slotType: 'sunset',
    basePrice: 800, maxPeople: 8, brandColor: '#e8893b', accent: '#fdba74',
    cardImage: '/sunset-v2.png',
    shortDesc: 'Aperitivo at sea while the coast turns amber and rose.',
    longDesc: 'The most romantic way to end the day. Sail the Gulf of Poets as the sun melts behind Palmaria, sip a Ligurian aperitivo with local wines, and let the colours do the rest.',
    includes: ['Italian aperitivo', 'Open bar with local wines', 'Private parking', 'Towels']
  },
  {
    id: 'custom', name: 'Tailored', subtitle: 'Your day, your way',
    duration: 'Flexible', slotType: 'custom',
    basePrice: 0, maxPeople: 8, brandColor: '#1e293b', accent: '#fbbf24',
    shortDesc: 'Your own itinerary — Marco and Paola craft the perfect day at sea.',
    longDesc: 'Choose destinations, duration and activities. Captain Marco and Paola will craft the perfect day based on your preferences.',
    includes: ['Everything tailored to you'], isCustom: true
  }
];

const addOns = [
  { id: 'restaurant', name: 'Seaside Restaurant Reservation', desc: 'Waterfront restaurants in Portofino, Vernazza, Monterosso or Portovenere', icon: Utensils },
  { id: 'wine', name: 'Wine Tasting Experience', desc: 'Exclusive Cinque Terre DOC tasting with local winemaker', icon: Wine },
  { id: 'cooking', name: 'Ligurian Cooking Class', desc: 'Traditional Italian cuisine with local chef', icon: Sparkles }
];

const defaultPickupPoints = ['Porto Mirabello', 'Portovenere', 'Le Grazie', 'Lerici'];

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
  const [meetingPoint, setMeetingPoint] = useState('Porto Mirabello');
  const [customMeetingPoint, setCustomMeetingPoint] = useState('');
  const [customerData, setCustomerData] = useState({ 
    name: '', email: '', phone: '', notes: '', language: 'EN',
    noAllergies: false, allergiesDetails: '',
    reducedMobility: false, mobilityDetails: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [showSkipperLogin, setShowSkipperLogin] = useState(false);
  const [skipperAuth, setSkipperAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [bookings, setBookings] = useState(initialBookings);
  const [skipperFilter, setSkipperFilter] = useState('all');
  const [skipperTab, setSkipperTab] = useState('bookings');
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [tempPrice, setTempPrice] = useState('');
  const [editingTourPrice, setEditingTourPrice] = useState(null);
  const [tempTourPrice, setTempTourPrice] = useState('');

  // google calendar sync state
  const [gcalEvents, setGcalEvents] = useState([]);
  const [gcalStatus, setGcalStatus] = useState('idle'); // 'idle' | 'syncing' | 'synced' | 'error'
  const [gcalLastSync, setGcalLastSync] = useState(null);

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

  const SKIPPER_PASSWORD = 'searunner2025';

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
    const allergiesText = customerData.noAllergies ? 'No allergies/intolerances' : (customerData.allergiesDetails || 'Not specified');
    const mobilityText = customerData.reducedMobility ? `Yes — ${customerData.mobilityDetails || 'details to be discussed'}` : 'No';
    const itineraryText = selectedTour.slotType === 'half-day-choice' && halfDayChoiceItinerary
      ? selectedTour.itineraryOptions.find(o => o.id === halfDayChoiceItinerary)?.name : '';

    const emailBody = `NEW BOOKING REQUEST - ${selectedTour.name}

CUSTOMER
Name: ${customerData.name}
Email: ${customerData.email}
Phone: ${customerData.phone}
Language: ${customerData.language}

TOUR DETAILS
Tour: ${selectedTour.name} - ${selectedTour.subtitle}
${itineraryText ? `Itinerary: ${itineraryText}\n` : ''}Date: ${selectedDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
Time: ${getFinalTimeSlot()}
Duration: ${selectedTour.duration}
Guests: ${numPeople}
Meeting point: ${getFinalMeetingPoint()}

ESTIMATED PRICE
Base: EUR ${selectedTour.basePrice} (estimate — final quote from skipper)
${selectedAddOns.length > 0 ? '+ add-ons (price on request)' : ''}

ADD-ONS: ${addOnsText}

HEALTH & ACCESSIBILITY
Allergies/intolerances: ${allergiesText}
Reduced mobility: ${mobilityText}

NOTES: ${customerData.notes || 'No special requests'}

Reply to: ${customerData.email}`.trim();

    if (WEB3FORMS_KEY && WEB3FORMS_KEY !== 'YOUR_ACCESS_KEY_HERE') {
      try {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: `New Booking: ${selectedTour.name} - ${customerData.name}`,
            from_name: `Sea Runner - ${customerData.name}`,
            email: customerData.email, message: emailBody
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
    setSelectedAddOns([]); setNumPeople(2); setMeetingPoint('Porto Mirabello'); setCustomMeetingPoint('');
    setCustomerData({ name: '', email: '', phone: '', notes: '', language: 'EN', noAllergies: false, allergiesDetails: '', reducedMobility: false, mobilityDetails: '' });
  };

  const generateCalendarDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i < 29; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const availInfo = selectedTour ? isTourAvailableOnDate(selectedTour, date) : { available: true };
      dates.push({
        date, available: availInfo.available,
        needsConfirmation: availInfo.needsConfirmation, reason: availInfo.reason,
        bookedParts: availInfo.bookedParts,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: date.getDate(), monthName: date.toLocaleDateString('en-US', { month: 'short' })
      });
    }
    return dates;
  };
  const calendarDates = generateCalendarDates();

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
            <div className="bg-slate-800/50 border border-slate-700 rounded p-3">
              <p className="text-xs text-slate-400 mb-1">Demo password:</p>
              <code className="text-amber-400 text-sm">searunner2025</code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============ SKIPPER DASHBOARD ============
  if (mode === 'skipper' && skipperAuth) {
    const filteredBookings = skipperFilter === 'all' ? bookings : bookings.filter(b => b.status === skipperFilter);
    const pendingCount = bookings.filter(b => b.status === 'pending').length;
    const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
    const totalRevenue = bookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + (b.finalPrice || b.basePrice), 0);

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
            {[{ id: 'bookings', label: 'Bookings', icon: Calendar }, { id: 'pricing', label: 'Pricing', icon: Euro }].map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setSkipperTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm tracking-wider transition whitespace-nowrap ${skipperTab === tab.id ? 'bg-slate-950 text-amber-400' : 'text-slate-600 hover:bg-slate-200'}`}>
                  <Icon className="w-4 h-4" /> {tab.label.toUpperCase()}
                </button>
              );
            })}
          </div>

          {skipperTab === 'bookings' && (
            <>
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white border-l-4 border-amber-400 p-5 shadow-sm">
                  <p className="text-xs tracking-widest text-slate-500 mb-2">PENDING REQUESTS</p>
                  <p className="text-4xl text-slate-900">{pendingCount}</p>
                </div>
                <div className="bg-white border-l-4 border-emerald-500 p-5 shadow-sm">
                  <p className="text-xs tracking-widest text-slate-500 mb-2">CONFIRMED TOURS</p>
                  <p className="text-4xl text-slate-900">{confirmedCount}</p>
                </div>
                <div className="bg-slate-950 border-l-4 border-amber-400 p-5 shadow-sm text-white">
                  <p className="text-xs tracking-widest text-amber-400 mb-2">REVENUE (CONFIRMED)</p>
                  <p className="text-4xl">€{totalRevenue.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-2 mb-6 flex-wrap">
                {['all', 'pending', 'confirmed', 'rejected'].map(f => (
                  <button key={f} onClick={() => setSkipperFilter(f)}
                    className={`px-4 py-2 text-sm tracking-wider uppercase transition ${skipperFilter === f ? 'bg-slate-950 text-amber-400' : 'bg-white text-slate-600 hover:bg-slate-200'}`}>
                    {f === 'all' ? 'All' : f} {f === 'pending' && pendingCount > 0 && `(${pendingCount})`}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {filteredBookings.length === 0 && <div className="bg-white p-12 text-center text-slate-400">No bookings in this category</div>}
                {filteredBookings.map(booking => (
                  <div key={booking.id} className="bg-white shadow-sm border-l-4 border-slate-300 hover:border-amber-400 transition">
                    <div className="p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1 flex-wrap">
                            <h3 className="text-xl text-slate-900">{booking.customerName}</h3>
                            <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded tracking-wider">{booking.language}</span>
                            {booking.status === 'pending' && <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 tracking-wider">PENDING</span>}
                            {booking.status === 'confirmed' && <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-800 tracking-wider">CONFIRMED</span>}
                            {booking.status === 'rejected' && <span className="text-xs px-2 py-1 bg-red-100 text-red-800 tracking-wider">REJECTED</span>}
                          </div>
                          <p className="text-amber-600 text-sm tracking-widest">{booking.tourName.toUpperCase()}</p>
                        </div>
                        <div className="text-right">
                          {editingPriceId === booking.id ? (
                            <div className="flex items-center gap-2">
                              <span className="text-slate-500">€</span>
                              <input type="number" value={tempPrice} onChange={(e) => setTempPrice(e.target.value)}
                                className="w-24 px-2 py-1 border border-slate-300 text-right text-xl" autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleSavePrice(booking.id)} />
                              <button onClick={() => handleSavePrice(booking.id)} className="p-1 bg-emerald-500 text-white hover:bg-emerald-600"><Save className="w-4 h-4" /></button>
                              <button onClick={() => { setEditingPriceId(null); setTempPrice(''); }} className="p-1 bg-slate-300 hover:bg-slate-400"><X className="w-4 h-4" /></button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 justify-end">
                              <div>
                                <p className="text-2xl text-slate-900">€{booking.finalPrice || booking.basePrice}</p>
                                {booking.finalPrice && booking.finalPrice !== booking.basePrice && (
                                  <p className="text-[10px] text-slate-400 tracking-wider line-through">€{booking.basePrice} est.</p>
                                )}
                                <p className="text-xs text-slate-500 tracking-wider">{booking.people} GUESTS</p>
                              </div>
                              <button onClick={() => { setEditingPriceId(booking.id); setTempPrice(booking.finalPrice || booking.basePrice); }}
                                className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded" title="Adjust price"><Edit2 className="w-4 h-4" /></button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-4 gap-4 text-sm mb-4 pb-4 border-b border-slate-100">
                        <div><p className="text-xs text-slate-400 tracking-wider mb-1">DATE</p><p className="text-slate-800">{booking.date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p></div>
                        <div><p className="text-xs text-slate-400 tracking-wider mb-1">TIME</p><p className="text-slate-800">{booking.timeSlot}</p></div>
                        <div><p className="text-xs text-slate-400 tracking-wider mb-1">EMAIL</p><p className="text-slate-800 truncate">{booking.email}</p></div>
                        <div><p className="text-xs text-slate-400 tracking-wider mb-1">PHONE</p><p className="text-slate-800">{booking.phone}</p></div>
                      </div>

                      {booking.addOns && booking.addOns.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-slate-400 tracking-wider mb-2">ADD-ONS REQUESTED</p>
                          <div className="flex flex-wrap gap-2">
                            {booking.addOns.map(a => {
                              const addon = addOns.find(ad => ad.id === a);
                              return <span key={a} className="text-xs bg-amber-50 text-amber-800 px-2 py-1">{addon?.name}</span>;
                            })}
                          </div>
                        </div>
                      )}

                      {(booking.allergies || booking.mobility) && (
                        <div className="bg-slate-50 p-3 mb-3 grid md:grid-cols-2 gap-3 text-xs">
                          {booking.allergies && <div><span className="text-slate-400 tracking-wider">ALLERGIES:</span> <span className="text-slate-700">{booking.allergies}</span></div>}
                          {booking.mobility && <div><span className="text-slate-400 tracking-wider">MOBILITY:</span> <span className="text-slate-700">{booking.mobility}</span></div>}
                        </div>
                      )}

                      {booking.notes && (
                        <div className="bg-slate-50 p-3 mb-4">
                          <p className="text-xs text-slate-400 tracking-wider mb-1">NOTES</p>
                          <p className="text-sm text-slate-700 italic">"{booking.notes}"</p>
                        </div>
                      )}

                      {booking.status === 'pending' && (
                        <div className="flex gap-2 flex-wrap">
                          <button onClick={() => handleBookingAction(booking.id, 'confirmed', booking.finalPrice || booking.basePrice)}
                            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 text-sm tracking-wider hover:bg-emerald-700 transition">
                            <CheckCircle className="w-4 h-4" /> CONFIRM AT €{booking.finalPrice || booking.basePrice}
                          </button>
                          <button onClick={() => handleBookingAction(booking.id, 'rejected')}
                            className="flex items-center gap-2 bg-white border border-red-300 text-red-600 px-4 py-2 text-sm tracking-wider hover:bg-red-50 transition">
                            <XCircle className="w-4 h-4" /> REJECT
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4" style={{ fontFamily: 'Georgia, serif' }}>
        <div className="max-w-md w-full text-center text-white">
          <div className="mb-6 flex justify-center"><SeaRunnerLogoCompact size="md" /></div>
          <p className="text-white text-sm tracking-[0.3em] mb-8">SEA RUNNER</p>
          <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-amber-400 rounded-full mb-6">
            <Check className="w-8 h-8 text-amber-400" />
          </div>
          <p className="text-amber-400 text-xs tracking-[0.4em] mb-3">REQUEST RECEIVED</p>
          <h2 className="text-4xl mb-6">Thank you,<br/>{customerData.name.split(' ')[0]}</h2>
          <div className="w-16 h-px bg-amber-400 mx-auto mb-6"></div>
          <p className="text-slate-300 mb-8 leading-relaxed">
            Captain Marco and Paola will review your request and contact you as soon as possible at <span className="text-amber-400">{customerData.email}</span>
          </p>
          <div className="bg-slate-900 border border-slate-800 p-6 text-left mb-6">
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
          <button onClick={resetBooking} className="border border-amber-400 text-amber-400 px-8 py-3 tracking-widest hover:bg-amber-400 hover:text-slate-950 transition">NEW BOOKING</button>
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
              <p className="text-amber-400 text-[10px] tracking-[0.3em]">DAILY BOAT TRIP</p></div>
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
                <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-amber-400" /> {selectedTour.duration}{selectedTour.fixedTime && ` (${selectedTour.fixedTime})`}</span>
                <span className="flex items-center gap-1"><Users className="w-4 h-4 text-amber-400" /> 1-{selectedTour.maxPeople} guests</span>
                {!selectedTour.isCustom && (
                  <span className="flex items-center gap-1 text-amber-400">from €{selectedTour.basePrice.toLocaleString()}</span>
                )}
              </div>
            </div>
          </div>

          {/* ITINERARY CHOICE (solo half-day-choice) */}
          {selectedTour.slotType === 'half-day-choice' && (
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
              <p className="text-amber-400 text-[10px] tracking-[0.3em] mb-4 flex items-center gap-2"><Calendar className="w-3 h-3" /> SELECT DATE</p>
              <div className="grid grid-cols-7 gap-1">
                {calendarDates.map((day, idx) => (
                  <button key={idx} onClick={() => day.available && setSelectedDate(day.date)} disabled={!day.available}
                    className={`p-2 text-center transition ${
                      selectedDate?.toDateString() === day.date.toDateString() ? 'bg-amber-400 text-slate-950'
                      : day.available && day.needsConfirmation ? 'bg-slate-800 text-amber-400 hover:bg-slate-700 border border-amber-400/30'
                      : day.available ? 'bg-slate-800 text-white hover:bg-slate-700'
                      : 'bg-slate-900 text-slate-700 cursor-not-allowed line-through'
                    }`}
                    title={day.needsConfirmation ? day.reason : ''}>
                    <div className="text-[9px] tracking-wider">{day.dayName}</div>
                    <div className="text-lg">{day.dayNum}</div>
                    <div className="text-[9px]">{day.monthName}</div>
                  </button>
                ))}
              </div>
              <div className="mt-3 space-y-1">
                <p className="text-[10px] text-slate-500 tracking-wider">CROSSED OUT = UNAVAILABLE</p>
                <p className="text-[10px] text-amber-400/70 tracking-wider">AMBER BORDER = SKIPPER WILL CONFIRM</p>
                {/* indicatore sincronizzazione google calendar */}
                <div className="flex items-center gap-2 pt-2 mt-2 border-t border-slate-800">
                  {gcalStatus === 'syncing' && (
                    <>
                      <RefreshCw className="w-3 h-3 text-slate-500 animate-spin" />
                      <p className="text-[10px] text-slate-500 tracking-wider">SYNCING CALENDAR...</p>
                    </>
                  )}
                  {gcalStatus === 'synced' && (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <p className="text-[10px] text-emerald-500/80 tracking-wider">CALENDAR SYNCED ({gcalEvents.length} events)</p>
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
                    <p className="text-2xl text-amber-400">{selectedTour.fixedTime}</p>
                    <p className="text-[10px] text-slate-500 tracking-wider mt-1">FIXED SCHEDULE</p>
                  </div>
                </div>
              ) : selectedTour.slotType === 'half-day-choice' ? (
                <div className="bg-slate-900 border border-slate-800 p-6">
                  <p className="text-amber-400 text-[10px] tracking-[0.3em] mb-4 flex items-center gap-2"><Clock className="w-3 h-3" /> TIME OF DAY</p>
                  <div className="space-y-2">
                    {selectedTour.timeOfDay.map(td => {
                      const partBooked = selectedDate && calendarDates.find(d => d.date.toDateString() === selectedDate.toDateString())?.bookedParts?.[td.id];
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
              {[...defaultPickupPoints, 'Other'].map(point => (
                <button key={point} onClick={() => setMeetingPoint(point)}
                  className={`px-3 py-2 text-sm transition ${meetingPoint === point ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>{point}</button>
              ))}
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
              if (meetingPoint === 'Other' && !customMeetingPoint.trim()) return;
              setCurrentStep(3); window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            disabled={
              !selectedDate ||
              (selectedTour.slotType === 'half-day-choice' && (!halfDayChoiceItinerary || !halfDayChoiceTime)) ||
              (meetingPoint === 'Other' && !customMeetingPoint.trim())
            }
            className={`w-full py-4 tracking-[0.3em] text-sm transition ${
              selectedDate &&
              !(selectedTour.slotType === 'half-day-choice' && (!halfDayChoiceItinerary || !halfDayChoiceTime)) &&
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
              <p className="text-[10px] text-amber-400 tracking-widest mb-3 flex items-center gap-2"><AlertCircle className="w-3 h-3" /> DIETARY REQUIREMENTS *</p>
              <label className="flex items-start gap-3 cursor-pointer p-3 bg-slate-800/50 hover:bg-slate-800 transition">
                <input type="checkbox" checked={customerData.noAllergies}
                  onChange={(e) => setCustomerData({ ...customerData, noAllergies: e.target.checked, allergiesDetails: e.target.checked ? '' : customerData.allergiesDetails })}
                  className="mt-1 w-4 h-4 accent-amber-400" />
                <span className="text-sm text-slate-300">I confirm that no guest has allergies or food intolerances</span>
              </label>
              {!customerData.noAllergies && (
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
              <p className="text-[10px] text-amber-400 tracking-widest mb-3 flex items-center gap-2"><Accessibility className="w-3 h-3" /> MOBILITY *</p>
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
              {selectedTour?.slotType === 'half-day-choice' && halfDayChoiceItinerary && (
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
              (!customerData.noAllergies && !customerData.allergiesDetails.trim()) ||
              (customerData.reducedMobility && !customerData.mobilityDetails.trim()) ||
              (selectedTour?.isCustom && !customerData.notes)
            }
            className={`w-full py-4 tracking-[0.3em] text-sm transition ${
              customerData.name && customerData.email && customerData.phone &&
              (customerData.noAllergies || customerData.allergiesDetails.trim()) &&
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
          <p className="text-amber-400/70 text-[10px] tracking-[0.3em] mb-4">DAILY BOAT TRIP</p>
          <p className="text-slate-500 text-xs tracking-[0.3em]">+39 348 828 9438 • @SEARUNNER_LASPEZIA</p>
          <p className="text-slate-700 text-[10px] tracking-[0.3em] mt-2">PORTO MIRABELLO • LA SPEZIA • ITALIAN RIVIERA</p>
        </div>
      </footer>
    </div>
  );
}
