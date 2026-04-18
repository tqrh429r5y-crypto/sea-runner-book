import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, Check, Anchor, Wine, Utensils, Lock, LogOut, X, CheckCircle, XCircle, Globe, Sparkles, Info, Camera, Fish, Edit2, Save, Euro, TrendingUp } from 'lucide-react';

// ============ LOGO COMPONENT ============
function SeaRunnerLogo({ size = 'md' }) {
  const sizes = { sm: 50, md: 70, lg: 120 };
  const s = sizes[size];
  
  return (
    <div className="flex flex-col items-center" style={{ fontFamily: 'Georgia, serif' }}>
      <svg width={s} height={s * 0.5} viewBox="0 0 200 100" style={{ marginBottom: '4px' }}>
        {/* Wave 1 - dark navy */}
        <path d="M 20,40 Q 60,15 100,35 Q 140,20 180,35" 
          stroke="#0a2540" strokeWidth="8" fill="none" strokeLinecap="round"/>
        {/* Wave 2 - medium blue */}
        <path d="M 25,55 Q 65,30 105,50 Q 145,35 180,50" 
          stroke="#1e5fa8" strokeWidth="7" fill="none" strokeLinecap="round"/>
        {/* Sand accent */}
        <path d="M 110,48 Q 140,40 170,48" 
          stroke="#d4b896" strokeWidth="6" fill="none" strokeLinecap="round"/>
      </svg>
      <div className="text-center">
        <div style={{ 
          fontSize: s * 0.2, 
          fontWeight: 'bold', 
          color: '#0a2540',
          letterSpacing: '0.15em',
          lineHeight: 1
        }}>SEA RUNNER</div>
        <div style={{ 
          fontSize: s * 0.1, 
          color: '#1e5fa8',
          letterSpacing: '0.3em',
          marginTop: '2px'
        }}>DAILY BOAT TRIP</div>
      </div>
    </div>
  );
}

// Logo ufficiale Sea Runner
function SeaRunnerLogoCompact({ size = 'sm' }) {
  const sizes = { sm: 50, md: 80 };
  const s = sizes[size];
  return (
    <img 
      src="/logo-v2.png"
      alt="Sea Runner"
      style={{ 
        height: s, 
        width: 'auto', 
        objectFit: 'contain'
      }}
      onError={(e) => {
        e.target.outerHTML = `<svg width="${s*2}" height="${s}" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M 20,40 Q 60,15 100,35 Q 140,20 180,35" stroke="#60a5fa" stroke-width="10" fill="none" stroke-linecap="round"/>
          <path d="M 25,55 Q 65,30 105,50 Q 145,35 180,50" stroke="#3b82f6" stroke-width="9" fill="none" stroke-linecap="round"/>
          <path d="M 110,48 Q 140,40 170,48" stroke="#fbbf24" stroke-width="7" fill="none" stroke-linecap="round"/>
        </svg>`;
      }}
    />
  );
}

// ============ TOUR CARD IMAGE - formato 3:2 con immagini reali ============
function TourCardImage({ tour }) {
  // Se il tour ha un'immagine reale, la mostriamo in formato 3:2
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
          style={{ 
            objectFit: 'cover',
            objectPosition: 'center'
          }}
          loading="lazy"
          onError={(e) => { 
            e.target.style.display = 'none';
          }}
        />
      </div>
    );
  }
  
  // Fallback SVG solo per Tailored (Custom)
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
          <text x="30" y="8" fontSize="4" fill="#fbbf24" textAnchor="middle" fontFamily="Georgia">N</text>
        </svg>
      </div>
    </div>
  );
}

// ============ ITINERARY MAP (stile timeline della brochure) ============
function ItineraryTimeline({ tour }) {
  const icons = { camera: Camera, snorkel: Fish, lunch: Utensils };
  return (
    <div className="bg-slate-100 rounded-lg p-6" style={{ backgroundColor: tour.brandColorLight }}>
      <h3 className="text-center text-3xl mb-6" style={{ fontFamily: 'Brush Script MT, cursive', color: tour.brandColor }}>Itinerary</h3>
      
      <div className="relative">
        <div className="absolute top-5 left-0 right-0 h-0.5" style={{ backgroundColor: tour.brandColor, opacity: 0.3 }}></div>
        <div className="relative flex justify-between">
          {tour.itinerary.map((stop, i) => (
            <div key={i} className="flex flex-col items-center flex-1">
              <div className="w-5 h-5 rounded-full border-2 bg-white z-10" style={{ borderColor: tour.brandColor, backgroundColor: i === 0 || i === tour.itinerary.length - 1 ? tour.brandColor : 'white' }}></div>
              <p className="text-[10px] text-slate-700 mt-2 text-center px-1 leading-tight" style={{ maxWidth: '80px' }}>{stop.place}</p>
              {stop.activity && (
                <div className="mt-1">
                  {stop.activity === 'camera' && <Camera className="w-3 h-3" style={{ color: tour.brandColor }} />}
                  {stop.activity === 'snorkel' && <Fish className="w-3 h-3" style={{ color: tour.brandColor }} />}
                  {stop.activity === 'lunch' && <Utensils className="w-3 h-3" style={{ color: tour.brandColor }} />}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ DATA ============
const initialTours = [
  {
    id: 'cinque-terre',
    name: 'Cinque Terre',
    subtitle: 'Full day Tour',
    duration: '7 hours',
    basePrice: 1500,
    maxPeople: 8,
    brandColor: '#0b3d7e',
    brandColorLight: '#e8edf4',
    accent: '#fbbf24',
    cardImage: '/cinque-terre-v2.png',
    cardImage: 'https://i.postimg.cc/Xpn2qPST/5-Terre-1.png',
    mapImage: 'https://i.postimg.cc/HVTSnN1D/5-Terre-3.png',
    servicesImage: 'https://i.postimg.cc/Vdz7vhQx/5-Terre-2.png',
    includedImage: 'https://i.postimg.cc/qzpmqFHf/5-Terre-4.png',
    shortDesc: 'UNESCO coastline from La Spezia to Monterosso.',
    longDesc: 'Cruise the entire UNESCO coastline passing all five iconic villages perched on dramatic cliffs. Swim in hidden coves, snorkel through the marine reserve with your guide, and savour a light Italian lunch with local wine as the colourful houses drift by.',
    timeSlots: ['10:30 – 17:30', '13:00 – 20:00'],
    itinerary: [
      { place: 'La Spezia', note: 'Porto Mirabello • Departure', activity: null },
      { place: 'Portovenere', note: 'Scenic cruise', activity: 'camera' },
      { place: 'Monasteroli', note: 'Swim stop', activity: 'snorkel' },
      { place: 'Riomaggiore', note: 'First of the Five', activity: 'camera' },
      { place: 'Manarola', note: 'Snorkeling', activity: 'snorkel' },
      { place: 'Corniglia', note: 'Clifftop village', activity: 'camera' },
      { place: 'Vernazza', note: 'Lunch ashore', activity: 'lunch' },
      { place: 'Monterosso', note: 'Final stop', activity: 'lunch' }
    ],
    includes: ['Light Italian lunch', 'Open bar', 'Snorkeling guide', 'Multilingual hostess', 'Private parking', 'Towels & equipment']
  },
  {
    id: 'golfo-poeti',
    name: 'Golfo dei poeti',
    subtitle: 'Full day Tour',
    duration: '7 hours',
    basePrice: 1400,
    maxPeople: 8,
    brandColor: '#0e5d63',
    brandColorLight: '#e6efef',
    accent: '#fbbf24',
    cardImage: '/golfo-poeti-v2.png',
    cardImage: 'https://i.postimg.cc/fknqnL8P/Golfo-dei-Poeti-1.png',
    mapImage: 'https://i.postimg.cc/WFR8vWw7/Golfo-dei-Poeti-3.png',
    servicesImage: 'https://i.postimg.cc/Q9Lm34JH/Golfo-dei-Poeti-2.png',
    includedImage: 'https://i.postimg.cc/k6rsm1vT/Golfo-dei-Poeti-4.png',
    shortDesc: 'The gulf that enchanted Byron, Shelley and D.H. Lawrence.',
    longDesc: 'Explore the gulf that enchanted Byron, Shelley and D.H. Lawrence. From Portovenere\'s medieval waterfront to the wild islands of Palmaria, Tino and Tinetto, then along the eastern shore through San Terenzo, elegant Lerici and the hidden gem of Tellaro.',
    timeSlots: ['10:30 – 17:30', '13:00 – 20:00'],
    itinerary: [
      { place: 'La Spezia', note: 'Departure', activity: null },
      { place: 'Portovenere', note: 'UNESCO • Ashore', activity: 'camera' },
      { place: 'Palmaria', note: 'Blue Grotto', activity: 'lunch' },
      { place: 'Tino', note: 'Monastery', activity: 'camera' },
      { place: 'Tinetto', note: 'Snorkeling', activity: 'snorkel' },
      { place: 'San Terenzo', note: 'Village', activity: 'camera' },
      { place: 'Lerici', note: 'Lunch stop', activity: 'lunch' },
      { place: 'Tellaro', note: 'Hidden gem', activity: 'camera' }
    ],
    includes: ['Light Italian lunch', 'Open bar', 'Snorkeling guide', 'Multilingual hostess', 'Private parking', 'Towels & equipment']
  },
  {
    id: 'portofino',
    name: 'Portofino',
    subtitle: 'San Fruttuoso & Cinque Terre',
    duration: '10 hours',
    basePrice: 2350,
    maxPeople: 8,
    brandColor: '#065f46',
    brandColorLight: '#e4f0ec',
    accent: '#6ee7b7',
    cardImage: '/portofino-v2.png',
    mapImage: null,
    servicesImage: null,
    includedImage: null,
    shortDesc: 'Full day to one of Italy\'s most glamorous destinations.',
    longDesc: 'A full day along the Riviera di Levante to one of Italy\'s most glamorous destinations. Stop at the medieval abbey of San Fruttuoso, then dock in Portofino for free time. Continue snorkeling in the Marine Protected Area. On the way back, extended Cinque Terre coastline cruise.',
    timeSlots: ['9:30 – 19:30'],
    itinerary: [
      { place: 'La Spezia', note: 'Departure', activity: null },
      { place: 'Ligurian Coast', note: 'Scenic cruise', activity: 'camera' },
      { place: 'San Fruttuoso', note: 'Abbey & swim', activity: 'snorkel' },
      { place: 'Portofino', note: 'Lunch ashore', activity: 'lunch' },
      { place: 'Marine Reserve', note: 'Snorkeling', activity: 'snorkel' },
      { place: 'Cinque Terre', note: 'Sunset cruise', activity: 'camera' }
    ],
    includes: ['Light lunch on board', 'Open bar', 'Snorkeling guide', 'Private parking', 'Towels & equipment'],
    notIncluded: 'Restaurant lunch in Portofino at own expense'
  },
  {
    id: 'sunset',
    name: 'Sunset Tour',
    subtitle: 'Golden Hour • Two itineraries',
    duration: '3.5 hours',
    basePrice: 800,
    maxPeople: 8,
    brandColor: '#e8893b',
    brandColorLight: '#fdecd9',
    accent: '#fdba74',
    cardImage: '/sunset-v2.png',
    cardImage: 'https://i.postimg.cc/9wmN6gWh/Sunset-1.png',
    mapImage: 'https://i.postimg.cc/4nP06G53/Sunset-4.png',
    mapImage2: 'https://i.postimg.cc/TpP4Qs7R/Sunset-5.png',
    servicesImage: 'https://i.postimg.cc/H8YPqvpd/Sunset-2.png',
    includedImage: 'https://i.postimg.cc/qg4Y6q2R/Sunset-3.png',
    shortDesc: 'The most romantic way to end the day.',
    longDesc: 'Watch the sun set over the Ligurian Sea as the coastline glows in shades of amber and rose. Sip an Italian aperitivo with local wines while the music plays softly. Choose between the Gulf of Poets route or a Cinque Terre sunset cruise.',
    timeSlots: ['17:30 – 21:00', '16:00 – 20:30'],
    itinerary: [
      { place: 'La Spezia', note: 'Departure', activity: null },
      { place: 'Fezzano', note: 'Fishing village', activity: 'camera' },
      { place: 'Le Grazie', note: 'Roman ruins', activity: 'camera' },
      { place: 'Portovenere', note: 'Sunset', activity: 'camera' },
      { place: 'Palmaria', note: 'Golden light', activity: 'camera' },
      { place: 'Tino & Tinetto', note: 'Islands', activity: 'camera' }
    ],
    includes: ['Italian aperitivo', 'Open bar with local wines', 'Private parking', 'Towels']
  },
  {
    id: 'custom',
    name: 'Tailored',
    subtitle: 'Your day, your way',
    duration: 'Flexible',
    basePrice: 0,
    maxPeople: 8,
    brandColor: '#1e293b',
    brandColorLight: '#e2e8f0',
    accent: '#fbbf24',
    cardImage: null,
    mapImage: null,
    shortDesc: 'Create your bespoke itinerary.',
    longDesc: 'Create your bespoke itinerary. Choose destinations, duration and activities. Captain Marco and Paola will craft the perfect day based on your preferences.',
    timeSlots: ['To be agreed'],
    itinerary: [
      { place: 'Your Start', note: 'Any meeting point', activity: null },
      { place: 'Custom stops', note: 'Discussed', activity: 'camera' },
      { place: 'Your pace', note: 'Flexible', activity: 'lunch' },
      { place: 'Your End', note: 'On request', activity: null }
    ],
    includes: ['Everything tailored to you'],
    isCustom: true
  }
];

const addOns = [
  { id: 'restaurant', name: 'Seaside Restaurant Reservation', desc: 'Waterfront restaurants in Portofino, Vernazza, Monterosso or Portovenere', icon: Utensils },
  { id: 'wine', name: 'Wine Tasting Experience', desc: 'Exclusive Cinque Terre DOC tasting with local winemaker', icon: Wine },
  { id: 'cooking', name: 'Ligurian Cooking Class', desc: 'Traditional Italian cuisine with local chef', icon: Sparkles }
];

const initialBookings = [
  { id: 1, tourId: 'cinque-terre', tourName: 'Cinque Terre', customerName: 'Marco Rossi', email: 'marco@email.com', phone: '+39 333 1234567', date: new Date(Date.now() + 3*86400000), timeSlot: '10:30 – 17:30', people: 4, notes: 'Wedding anniversary', addOns: ['wine'], status: 'pending', basePrice: 1500, finalPrice: null, language: 'IT' },
  { id: 2, tourId: 'sunset', tourName: 'Sunset Tour', customerName: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '+44 7700 900123', date: new Date(Date.now() + 5*86400000), timeSlot: '17:30 – 21:00', people: 2, notes: 'Vegetarian aperitivo', addOns: [], status: 'pending', basePrice: 800, finalPrice: null, language: 'EN' },
  { id: 3, tourId: 'golfo-poeti', tourName: 'Golfo dei poeti', customerName: 'Heinrich Mueller', email: 'h.mueller@email.de', phone: '+49 151 23456789', date: new Date(Date.now() + 7*86400000), timeSlot: '10:30 – 17:30', people: 6, notes: '', addOns: ['restaurant'], status: 'confirmed', basePrice: 1400, finalPrice: 1600, language: 'DE' },
  { id: 4, tourId: 'portofino', tourName: 'Portofino', customerName: 'Pierre Dubois', email: 'pierre@email.fr', phone: '+33 6 12345678', date: new Date(Date.now() + 10*86400000), timeSlot: '9:30 – 19:30', people: 8, notes: 'Family with 2 children', addOns: ['restaurant', 'wine'], status: 'confirmed', basePrice: 2350, finalPrice: 2550, language: 'FR' }
];

// ============ MAIN COMPONENT ============
export default function SeaRunnerApp() {
  const [tours, setTours] = useState(initialTours);
  const [mode, setMode] = useState('customer');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTour, setSelectedTour] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [numPeople, setNumPeople] = useState(2);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [meetingPoint, setMeetingPoint] = useState('Porto Mirabello');
  const [customerData, setCustomerData] = useState({ name: '', email: '', phone: '', notes: '', language: 'EN' });
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
  
  // Calendar state
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);
  const [dateOverrides, setDateOverrides] = useState({}); // { '2026-05-15': { closed: false, priceMultiplier: 1.3, note: 'High season' } }
  const [tempDatePrice, setTempDatePrice] = useState('');
  const [tempDateNote, setTempDateNote] = useState('');

  const SKIPPER_PASSWORD = 'searunner2025';

  const handleSkipperLogin = () => {
    if (password === SKIPPER_PASSWORD) {
      setSkipperAuth(true);
      setShowSkipperLogin(false);
      setMode('skipper');
      setLoginError('');
      setPassword('');
    } else {
      setLoginError('Incorrect password');
    }
  };

  const handleSkipperLogout = () => { setSkipperAuth(false); setMode('customer'); setCurrentStep(1); };

  const handleBookingAction = (id, action, finalPrice = null) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: action, finalPrice: finalPrice || b.basePrice } : b));
    setEditingPriceId(null);
  };

  const handleSavePrice = (id) => {
    const price = parseFloat(tempPrice);
    if (!isNaN(price)) {
      setBookings(bookings.map(b => b.id === id ? { ...b, finalPrice: price } : b));
    }
    setEditingPriceId(null);
    setTempPrice('');
  };

  const handleSaveTourPrice = (tourId) => {
    const price = parseFloat(tempTourPrice);
    if (!isNaN(price) && price > 0) {
      setTours(tours.map(t => t.id === tourId ? { ...t, basePrice: price } : t));
    }
    setEditingTourPrice(null);
    setTempTourPrice('');
  };

  const handleTourSelect = (tour) => { 
    setSelectedTour(tour); 
    setSelectedTimeSlot(tour.timeSlots[0]); 
    setCurrentStep(2); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const toggleAddOn = (id) => setSelectedAddOns(selectedAddOns.includes(id) ? selectedAddOns.filter(a => a !== id) : [...selectedAddOns, id]);

  // ============ GOOGLE CALENDAR SYNC ============
  const CALENDAR_ICS_URL = 'https://calendar.google.com/calendar/ical/searunnerprenotazioni%40gmail.com/public/basic.ics';
  const [calendarBookedDates, setCalendarBookedDates] = useState([]);
  const [calendarLoading, setCalendarLoading] = useState(true);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        // Usiamo un proxy CORS gratuito per leggere il file iCal
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(CALENDAR_ICS_URL)}`;
        const response = await fetch(proxyUrl);
        const data = await response.json();
        const icsText = data.contents;

        // Parse degli eventi iCal
        const bookedDates = [];
        const lines = icsText.split('\n');
        let currentEventStart = null;
        let currentEventEnd = null;
        let inEvent = false;

        for (let line of lines) {
          line = line.trim();
          if (line === 'BEGIN:VEVENT') {
            inEvent = true;
            currentEventStart = null;
            currentEventEnd = null;
          }
          if (inEvent && line.startsWith('DTSTART')) {
            // Gestisce sia date intere (DTSTART;VALUE=DATE:20260615) che datetime (DTSTART:20260615T...)
            const dateStr = line.split(':').pop().trim().substring(0, 8);
            currentEventStart = new Date(
              parseInt(dateStr.substring(0, 4)),
              parseInt(dateStr.substring(4, 6)) - 1,
              parseInt(dateStr.substring(6, 8))
            );
          }
          if (inEvent && line.startsWith('DTEND')) {
            const dateStr = line.split(':').pop().trim().substring(0, 8);
            currentEventEnd = new Date(
              parseInt(dateStr.substring(0, 4)),
              parseInt(dateStr.substring(4, 6)) - 1,
              parseInt(dateStr.substring(6, 8))
            );
          }
          if (line === 'END:VEVENT' && currentEventStart) {
            // Aggiungi tutte le date tra start e end
            const endDate = currentEventEnd || currentEventStart;
            const d = new Date(currentEventStart);
            while (d < endDate) {
              bookedDates.push(d.toDateString());
              d.setDate(d.getDate() + 1);
            }
            // Se evento di un solo giorno (start = end)
            if (!currentEventEnd || currentEventStart.toDateString() === currentEventEnd.toDateString()) {
              bookedDates.push(currentEventStart.toDateString());
            }
            inEvent = false;
          }
        }
        setCalendarBookedDates([...new Set(bookedDates)]); // rimuove duplicati
      } catch (error) {
        console.error('Calendar sync error:', error);
      } finally {
        setCalendarLoading(false);
      }
    };

    fetchCalendar();
    // Aggiorna ogni 5 minuti
    const interval = setInterval(fetchCalendar, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  // 🔧 CONFIGURAZIONE: Sostituisci con la tua chiave Web3Forms
  // Ottienila gratis su https://web3forms.com (ti ho guidato nella chat)
  const WEB3FORMS_KEY = '970b85ef-e255-4ada-8ecf-52673d5cecc5';

  const handleSubmit = async () => {
    const addOnsText = selectedAddOns.length > 0 
      ? selectedAddOns.map(id => addOns.find(a => a.id === id)?.name).join(', ')
      : 'None';

    // Corpo email formattato
    const emailBody = `
🚤 NEW BOOKING REQUEST - ${selectedTour.name}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 CUSTOMER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${customerData.name}
Email: ${customerData.email}
Phone: ${customerData.phone}
Language: ${customerData.language}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚤 TOUR DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tour: ${selectedTour.name} - ${selectedTour.subtitle}
Date: ${selectedDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
Time: ${selectedTimeSlot}
Duration: ${selectedTour.duration}
Guests: ${numPeople}
Meeting point: ${meetingPoint}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 PRICING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Base price: €${selectedTour.basePrice}
(Final price to be confirmed based on group size and date)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ ADD-ONS REQUESTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${addOnsText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 CUSTOMER NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${customerData.notes || 'No special requests'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚓ Reply directly to: ${customerData.email}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();

    // Invio a Web3Forms (se la chiave è configurata)
    if (WEB3FORMS_KEY && WEB3FORMS_KEY !== 'YOUR_ACCESS_KEY_HERE') {
      try {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: `🚤 New Booking: ${selectedTour.name} - ${customerData.name}`,
            from_name: `Sea Runner - ${customerData.name}`,
            email: customerData.email,
            message: emailBody,
            // Dati strutturati (visibili nella dashboard Web3Forms)
            customer_name: customerData.name,
            customer_email: customerData.email,
            customer_phone: customerData.phone,
            tour: selectedTour.name,
            date: selectedDate.toLocaleDateString('en-GB'),
            time: selectedTimeSlot,
            people: numPeople,
            meeting_point: meetingPoint,
            add_ons: addOnsText,
            language: customerData.language,
            notes: customerData.notes || 'None',
            base_price: `€${selectedTour.basePrice}`
          })
        });
      } catch (error) {
        console.error('Email send error:', error);
        // Continua comunque con la conferma, non bloccare l'esperienza utente
      }
    }

    // Salva localmente (per la dashboard skipper)
    const newBooking = {
      id: bookings.length + 1, tourId: selectedTour.id, tourName: selectedTour.name,
      customerName: customerData.name, email: customerData.email, phone: customerData.phone,
      date: selectedDate, timeSlot: selectedTimeSlot, people: numPeople,
      notes: customerData.notes, addOns: selectedAddOns, meetingPoint,
      status: 'pending', basePrice: selectedTour.basePrice, finalPrice: null, language: customerData.language
    };
    setBookings([newBooking, ...bookings]);
    setSubmitted(true);
  };

  const resetBooking = () => {
    setSubmitted(false); setCurrentStep(1); setSelectedTour(null); setSelectedDate(null);
    setSelectedTimeSlot(null); setSelectedAddOns([]); setNumPeople(2);
    setCustomerData({ name: '', email: '', phone: '', notes: '', language: 'EN' });
  };

  const generateCalendarDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i < 29; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const key = date.toISOString().split('T')[0];
      const override = dateOverrides[key];
      // Bloccato se: prenotazione confermata locale, override chiuso, O evento su Google Calendar
      const isBookedLocally = bookings.some(b => b.date.toDateString() === date.toDateString() && b.status === 'confirmed');
      const isBookedOnCalendar = calendarBookedDates.includes(date.toDateString());
      const isClosed = override?.closed;
      dates.push({
        date,
        available: !isBookedLocally && !isBookedOnCalendar && !isClosed,
        fromCalendar: isBookedOnCalendar, // utile per mostrare icona Google Calendar
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: date.getDate(),
        monthName: date.toLocaleDateString('en-US', { month: 'short' })
      });
    }
    return dates;
  };
  const calendarDates = generateCalendarDates();

  // Helper per formattare una data in chiave "YYYY-MM-DD"
  const dateKey = (date) => date.toISOString().split('T')[0];
  
  // Ottieni info su una data specifica
  const getDateInfo = (date) => {
    const key = dateKey(date);
    const override = dateOverrides[key];
    const dateBookings = bookings.filter(b => b.date.toDateString() === date.toDateString());
    const pendingBookings = dateBookings.filter(b => b.status === 'pending');
    const confirmedBookings = dateBookings.filter(b => b.status === 'confirmed');
    return {
      closed: override?.closed || false,
      priceMultiplier: override?.priceMultiplier || 1,
      note: override?.note || '',
      pendingBookings,
      confirmedBookings,
      hasAny: dateBookings.length > 0
    };
  };
  
  // Genera griglia calendario mensile
  const generateMonthGrid = (baseDate) => {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startWeekDay = (firstDay.getDay() + 6) % 7; // Lunedì = 0
    
    const grid = [];
    // Spazi vuoti iniziali
    for (let i = 0; i < startWeekDay; i++) {
      grid.push(null);
    }
    // Giorni del mese
    for (let d = 1; d <= lastDay.getDate(); d++) {
      grid.push(new Date(year, month, d));
    }
    return grid;
  };
  
  const toggleDateClosed = (date) => {
    const key = dateKey(date);
    const current = dateOverrides[key] || {};
    setDateOverrides({ ...dateOverrides, [key]: { ...current, closed: !current.closed } });
  };
  
  const setDatePriceMultiplier = (date, multiplier, note = '') => {
    const key = dateKey(date);
    const current = dateOverrides[key] || {};
    setDateOverrides({ ...dateOverrides, [key]: { ...current, priceMultiplier: multiplier, note } });
  };
  
  const clearDateOverride = (date) => {
    const key = dateKey(date);
    const newOverrides = { ...dateOverrides };
    delete newOverrides[key];
    setDateOverrides(newOverrides);
  };
  
  const changeMonth = (delta) => {
    const newMonth = new Date(calendarMonth);
    newMonth.setMonth(newMonth.getMonth() + delta);
    setCalendarMonth(newMonth);
  };

  // ============ SKIPPER LOGIN ============
  if (showSkipperLogin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4" style={{ fontFamily: 'Georgia, serif' }}>
        <div className="bg-slate-900 border border-amber-400/30 rounded-lg shadow-2xl p-8 max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <SeaRunnerLogoCompact size="sm" />
              <div>
                <h2 className="text-xl text-white tracking-[0.2em]">SEA RUNNER</h2>
                <p className="text-[10px] text-amber-400 tracking-[0.3em]">SKIPPER ACCESS</p>
              </div>
            </div>
            <button onClick={() => { setShowSkipperLogin(false); setPassword(''); setLoginError(''); }} className="text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
          </div>
          <p className="text-slate-400 text-sm mb-6">Enter your password to access the management dashboard</p>
          <div className="space-y-4">
            <input
              type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSkipperLogin()}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-white focus:border-amber-400 focus:outline-none"
              placeholder="••••••••" autoFocus
            />
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
              <div>
                <h1 className="text-xl tracking-[0.2em]">SEA RUNNER</h1>
                <p className="text-[10px] text-amber-400 tracking-[0.3em]">SKIPPER DASHBOARD</p>
              </div>
            </div>
            <button onClick={handleSkipperLogout} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-2">
            <p className="text-amber-600 text-xs tracking-[0.3em] mb-1">WELCOME CAPTAIN MARCO</p>
            <h2 className="text-3xl text-slate-900">Management Dashboard</h2>
          </div>

          {/* TABS */}
          <div className="flex gap-1 border-b border-slate-300 mt-6 mb-6 overflow-x-auto">
            {[
              { id: 'bookings', label: 'Bookings', icon: Calendar },
              { id: 'calendar', label: 'Calendar', icon: Calendar },
              { id: 'pricing', label: 'Pricing', icon: Euro }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setSkipperTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm tracking-wider transition whitespace-nowrap ${
                    skipperTab === tab.id ? 'bg-slate-950 text-amber-400' : 'text-slate-600 hover:bg-slate-200'
                  }`}>
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
                    className={`px-4 py-2 text-sm tracking-wider uppercase transition ${
                      skipperFilter === f ? 'bg-slate-950 text-amber-400' : 'bg-white text-slate-600 hover:bg-slate-200'
                    }`}>
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
                                  <p className="text-[10px] text-slate-400 tracking-wider line-through">€{booking.basePrice} base</p>
                                )}
                                <p className="text-xs text-slate-500 tracking-wider">{booking.people} GUESTS</p>
                              </div>
                              <button onClick={() => { setEditingPriceId(booking.id); setTempPrice(booking.finalPrice || booking.basePrice); }}
                                className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded" title="Adjust price">
                                <Edit2 className="w-4 h-4" />
                              </button>
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

                      {booking.addOns.length > 0 && (
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
                          <p className="text-xs text-slate-500 self-center italic">💡 Click the edit icon to adjust price before confirming</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {skipperTab === 'calendar' && (
            <div>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-900 font-semibold mb-1">Calendar Management</p>
                    <p className="text-xs text-blue-800 leading-relaxed">Click any date to open/close availability or set a special price multiplier (e.g. 1.3x for high season). Changes apply to all tours on that date.</p>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 mb-6 text-xs">
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-emerald-100 border-2 border-emerald-500"></div><span className="text-slate-700">Available</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-100 border-2 border-red-500"></div><span className="text-slate-700">Closed</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-amber-100 border-2 border-amber-500"></div><span className="text-slate-700">Pending booking</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-100 border-2 border-blue-500"></div><span className="text-slate-700">Confirmed booking</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-purple-100 border-2 border-purple-500"></div><span className="text-slate-700">Special price</span></div>
              </div>

              {/* Month navigation */}
              <div className="bg-white shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <button onClick={() => changeMonth(-1)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 tracking-wider text-sm">← PREV</button>
                  <h3 className="text-2xl text-slate-900">
                    {calendarMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                  </h3>
                  <button onClick={() => changeMonth(1)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 tracking-wider text-sm">NEXT →</button>
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => (
                    <div key={d} className="text-center text-[10px] tracking-widest text-slate-500 py-2">{d}</div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {generateMonthGrid(calendarMonth).map((date, idx) => {
                    if (!date) return <div key={idx} className="aspect-square"></div>;
                    
                    const info = getDateInfo(date);
                    const isPast = date < new Date().setHours(0,0,0,0);
                    const isToday = date.toDateString() === new Date().toDateString();
                    
                    // Determine color
                    let bgColor = 'bg-emerald-50 border-emerald-300 hover:bg-emerald-100';
                    let textColor = 'text-emerald-900';
                    
                    if (isPast) {
                      bgColor = 'bg-slate-50 border-slate-200';
                      textColor = 'text-slate-400';
                    } else if (info.closed) {
                      bgColor = 'bg-red-50 border-red-400 hover:bg-red-100';
                      textColor = 'text-red-900';
                    } else if (info.confirmedBookings.length > 0) {
                      bgColor = 'bg-blue-50 border-blue-400 hover:bg-blue-100';
                      textColor = 'text-blue-900';
                    } else if (info.pendingBookings.length > 0) {
                      bgColor = 'bg-amber-50 border-amber-400 hover:bg-amber-100';
                      textColor = 'text-amber-900';
                    } else if (info.priceMultiplier !== 1) {
                      bgColor = 'bg-purple-50 border-purple-400 hover:bg-purple-100';
                      textColor = 'text-purple-900';
                    }
                    
                    return (
                      <button
                        key={idx}
                        disabled={isPast}
                        onClick={() => {
                          setSelectedCalendarDate(date);
                          setTempDatePrice(info.priceMultiplier);
                          setTempDateNote(info.note);
                        }}
                        className={`aspect-square p-1 border-2 transition relative ${bgColor} ${isToday ? 'ring-2 ring-amber-500' : ''} ${isPast ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className={`text-sm font-semibold ${textColor}`}>{date.getDate()}</div>
                        {!isPast && (
                          <div className="absolute bottom-1 left-1 right-1 flex flex-col gap-0.5">
                            {info.priceMultiplier !== 1 && (
                              <div className="text-[9px] text-purple-700 font-semibold">{info.priceMultiplier}x</div>
                            )}
                            {info.pendingBookings.length > 0 && (
                              <div className="text-[9px] text-amber-700">⏳ {info.pendingBookings.length}</div>
                            )}
                            {info.confirmedBookings.length > 0 && (
                              <div className="text-[9px] text-blue-700">✓ {info.confirmedBookings.length}</div>
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

              {/* Stats for the month */}
              <div className="grid md:grid-cols-4 gap-3 mt-6">
                {(() => {
                  const monthGrid = generateMonthGrid(calendarMonth).filter(d => d);
                  const openDays = monthGrid.filter(d => d >= new Date().setHours(0,0,0,0) && !getDateInfo(d).closed).length;
                  const closedDays = monthGrid.filter(d => getDateInfo(d).closed).length;
                  const bookedDays = monthGrid.filter(d => getDateInfo(d).confirmedBookings.length > 0).length;
                  const specialPriceDays = monthGrid.filter(d => getDateInfo(d).priceMultiplier !== 1).length;
                  return (
                    <>
                      <div className="bg-white p-4 border-l-4 border-emerald-500">
                        <p className="text-[10px] tracking-widest text-slate-500 mb-1">OPEN DAYS</p>
                        <p className="text-2xl text-slate-900">{openDays}</p>
                      </div>
                      <div className="bg-white p-4 border-l-4 border-red-500">
                        <p className="text-[10px] tracking-widest text-slate-500 mb-1">CLOSED DAYS</p>
                        <p className="text-2xl text-slate-900">{closedDays}</p>
                      </div>
                      <div className="bg-white p-4 border-l-4 border-blue-500">
                        <p className="text-[10px] tracking-widest text-slate-500 mb-1">BOOKED DAYS</p>
                        <p className="text-2xl text-slate-900">{bookedDays}</p>
                      </div>
                      <div className="bg-white p-4 border-l-4 border-purple-500">
                        <p className="text-[10px] tracking-widest text-slate-500 mb-1">SPECIAL PRICING</p>
                        <p className="text-2xl text-slate-900">{specialPriceDays}</p>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* MODAL per gestire la data selezionata */}
              {selectedCalendarDate && (() => {
                const info = getDateInfo(selectedCalendarDate);
                return (
                  <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={() => setSelectedCalendarDate(null)}>
                    <div className="bg-white shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                      <div className="bg-slate-950 text-white p-5 flex items-center justify-between border-b-2 border-amber-400">
                        <div>
                          <p className="text-[10px] text-amber-400 tracking-widest">MANAGE DATE</p>
                          <h3 className="text-xl">{selectedCalendarDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h3>
                        </div>
                        <button onClick={() => setSelectedCalendarDate(null)} className="text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
                      </div>

                      <div className="p-5 space-y-5">
                        {/* Status display */}
                        <div className={`p-3 text-center text-sm tracking-wider ${info.closed ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {info.closed ? '🔒 DATE CLOSED — NOT AVAILABLE FOR BOOKING' : '✓ DATE OPEN — AVAILABLE FOR BOOKING'}
                        </div>

                        {/* Open/Close toggle */}
                        <div>
                          <p className="text-[10px] text-slate-500 tracking-widest mb-2">AVAILABILITY</p>
                          <button 
                            onClick={() => toggleDateClosed(selectedCalendarDate)}
                            className={`w-full py-3 text-sm tracking-wider transition ${
                              info.closed 
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                                : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                          >
                            {info.closed ? '🔓 OPEN THIS DATE' : '🔒 CLOSE THIS DATE'}
                          </button>
                        </div>

                        {/* Price multiplier */}
                        {!info.closed && (
                          <div>
                            <p className="text-[10px] text-slate-500 tracking-widest mb-2">PRICE MULTIPLIER FOR THIS DATE</p>
                            <div className="grid grid-cols-4 gap-2 mb-3">
                              {[
                                { val: 0.8, label: '-20%', color: 'blue' },
                                { val: 1, label: 'Normal', color: 'slate' },
                                { val: 1.2, label: '+20%', color: 'amber' },
                                { val: 1.5, label: '+50%', color: 'red' }
                              ].map(opt => (
                                <button 
                                  key={opt.val}
                                  onClick={() => setTempDatePrice(opt.val)}
                                  className={`py-2 text-xs tracking-wider transition ${
                                    parseFloat(tempDatePrice) === opt.val 
                                      ? 'bg-slate-950 text-amber-400' 
                                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-xs text-slate-500 tracking-wider">CUSTOM:</span>
                              <input 
                                type="number" 
                                step="0.1"
                                min="0.5"
                                max="3"
                                value={tempDatePrice}
                                onChange={(e) => setTempDatePrice(e.target.value)}
                                className="flex-1 px-3 py-2 border border-slate-300 text-sm"
                              />
                              <span className="text-sm text-slate-600">x</span>
                            </div>
                            
                            <input 
                              type="text"
                              value={tempDateNote}
                              onChange={(e) => setTempDateNote(e.target.value)}
                              placeholder="Note (e.g. 'High season', 'Holiday')"
                              className="w-full px-3 py-2 border border-slate-300 text-sm mb-3"
                            />

                            {/* Preview prices */}
                            <div className="bg-slate-50 p-3 text-xs mb-3">
                              <p className="text-slate-500 tracking-wider mb-2">PRICE PREVIEW ON THIS DATE:</p>
                              {tours.filter(t => !t.isCustom).map(t => (
                                <div key={t.id} className="flex justify-between py-1">
                                  <span className="text-slate-700">{t.name}</span>
                                  <span className="text-slate-900 font-semibold">
                                    €{t.basePrice} → <span className="text-amber-600">€{Math.round(t.basePrice * parseFloat(tempDatePrice || 1))}</span>
                                  </span>
                                </div>
                              ))}
                            </div>

                            <button 
                              onClick={() => {
                                setDatePriceMultiplier(selectedCalendarDate, parseFloat(tempDatePrice), tempDateNote);
                                setSelectedCalendarDate(null);
                              }}
                              className="w-full py-3 bg-amber-400 text-slate-950 text-sm tracking-wider hover:bg-amber-300 transition"
                            >
                              SAVE PRICE OVERRIDE
                            </button>
                          </div>
                        )}

                        {/* Existing bookings for this date */}
                        {info.hasAny && (
                          <div className="border-t pt-4">
                            <p className="text-[10px] text-slate-500 tracking-widest mb-3">BOOKINGS ON THIS DATE</p>
                            <div className="space-y-2">
                              {[...info.pendingBookings, ...info.confirmedBookings].map(b => (
                                <div key={b.id} className="flex items-center justify-between p-3 bg-slate-50 text-sm">
                                  <div>
                                    <p className="text-slate-900">{b.customerName}</p>
                                    <p className="text-xs text-slate-500">{b.tourName} • {b.people} guests • {b.timeSlot}</p>
                                  </div>
                                  <span className={`text-xs px-2 py-1 tracking-wider ${
                                    b.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                                  }`}>{b.status.toUpperCase()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Reset */}
                        {(info.closed || info.priceMultiplier !== 1) && (
                          <button 
                            onClick={() => {
                              clearDateOverride(selectedCalendarDate);
                              setSelectedCalendarDate(null);
                            }}
                            className="w-full py-2 text-xs text-red-600 hover:bg-red-50 tracking-wider"
                          >
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
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-amber-900 font-semibold mb-1">Dynamic Pricing</p>
                    <p className="text-xs text-amber-800 leading-relaxed">Base prices are shown to customers as "starting from". You can adjust the final price for each individual booking based on group size, season, special requests, or any other factor. These changes apply only to the specific booking and don't affect the displayed base prices.</p>
                  </div>
                </div>
              </div>

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
                        <div className="text-right">
                          <Clock className="w-4 h-4 text-slate-400 inline mr-1" />
                          <span className="text-sm text-slate-600">{tour.duration}</span>
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
                        <p className="text-xs text-slate-500 italic mt-2">Displayed as "from €{tour.basePrice}" to customers</p>
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
            Captain Marco and Paola will personally review your request and send you a detailed quote within 24 hours at <span className="text-amber-400">{customerData.email}</span>
          </p>
          
          {/* Info box per lo skipper nel preview (solo se Web3Forms non è configurato) */}
          {WEB3FORMS_KEY === 'YOUR_ACCESS_KEY_HERE' && (
            <div className="bg-amber-950/50 border border-amber-600/30 p-3 mb-6 text-left">
              <p className="text-amber-400 text-[10px] tracking-widest mb-1">⚠️ DEMO MODE</p>
              <p className="text-slate-400 text-xs leading-relaxed">Configure Web3Forms key to enable real email notifications to the skipper.</p>
            </div>
          )}
          <div className="bg-slate-900 border border-slate-800 p-6 text-left mb-6">
            <p className="text-xs text-amber-400 tracking-widest mb-3">YOUR REQUEST</p>
            <p className="text-white mb-1">{selectedTour?.name}</p>
            <p className="text-sm text-slate-400 mb-3">{selectedTour?.subtitle}</p>
            <div className="space-y-1 text-sm text-slate-300">
              <p>📅 {selectedDate?.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p>🕐 {selectedTimeSlot}</p>
              <p>👥 {numPeople} {numPeople === 1 ? 'guest' : 'guests'}</p>
              <p>⚓ {meetingPoint}</p>
              {!selectedTour?.isCustom && <p className="text-amber-400 text-xs mt-2 italic">Starting from €{selectedTour?.basePrice} • final quote coming</p>}
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
            <div>
              <h1 className="text-white text-lg tracking-[0.2em]">SEA RUNNER</h1>
              <p className="text-amber-400 text-[10px] tracking-[0.3em]">DAILY BOAT TRIP</p>
            </div>
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

      {/* STEP 1: TOUR SELECTION */}
      {currentStep === 1 && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <p className="text-amber-400 text-xs tracking-[0.4em] mb-3">EXCLUSIVE EXPERIENCES</p>
            <h2 className="text-5xl text-white mb-4">Choose Your Tour</h2>
            <div className="w-24 h-px bg-amber-400 mx-auto mb-6"></div>
            <p className="text-slate-400 max-w-2xl mx-auto">Private boat tours along the Italian Riviera — Captain Marco and Paola will craft the perfect day at sea for you</p>
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
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {tour.itinerary.length} stops</span>
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
                    <div className="border px-4 py-2 text-xs tracking-widest group-hover:bg-amber-400 group-hover:text-slate-950 transition" style={{ borderColor: tour.accent, color: tour.accent }}>
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

          {/* TOUR RECAP */}
          <div className="mb-8">
            <TourCardImage tour={selectedTour} />
            <div className="bg-slate-900 border border-slate-800 border-t-0 p-8">
              <p className="text-slate-300 leading-relaxed max-w-3xl mb-6">{selectedTour.longDesc}</p>
              <div className="flex flex-wrap gap-4 text-sm text-slate-300 mb-6 pb-6 border-b border-slate-800">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-amber-400" /> {selectedTour.duration}</span>
                <span className="flex items-center gap-1"><Users className="w-4 h-4 text-amber-400" /> 1-{selectedTour.maxPeople} guests</span>
                {!selectedTour.isCustom && (
                  <span className="flex items-center gap-1 text-amber-400 text-lg">
                    from €{selectedTour.basePrice.toLocaleString()}
                    <span className="text-[10px] text-slate-500 italic ml-1">final price confirmed by skipper</span>
                  </span>
                )}
              </div>

              {/* Timeline itinerary */}
              <p className="text-amber-400 text-[10px] tracking-[0.3em] mb-4">ITINERARY</p>
              <div className="relative mb-6">
                <div className="absolute top-3 left-3 right-3 h-0.5 bg-slate-700"></div>
                <div className="relative flex justify-between">
                  {selectedTour.itinerary.map((stop, i) => (
                    <div key={i} className="flex flex-col items-center flex-1 px-1">
                      <div className="w-6 h-6 rounded-full border-2 z-10 flex items-center justify-center" 
                        style={{ borderColor: selectedTour.accent, backgroundColor: i === 0 || i === selectedTour.itinerary.length - 1 ? selectedTour.accent : '#0f172a' }}>
                        {(i === 0 || i === selectedTour.itinerary.length - 1) && <Anchor className="w-3 h-3 text-slate-900" />}
                      </div>
                      <p className="text-[10px] text-white mt-2 text-center leading-tight">{stop.place}</p>
                      <p className="text-[9px] text-slate-500 text-center leading-tight italic mt-1">{stop.note}</p>
                      {stop.activity && (
                        <div className="mt-1">
                          {stop.activity === 'camera' && <Camera className="w-3 h-3" style={{ color: selectedTour.accent }} />}
                          {stop.activity === 'snorkel' && <Fish className="w-3 h-3" style={{ color: selectedTour.accent }} />}
                          {stop.activity === 'lunch' && <Utensils className="w-3 h-3" style={{ color: selectedTour.accent }} />}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Includes */}
              <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                <div>
                  <p className="text-amber-400 text-[10px] tracking-[0.3em] mb-3">INCLUDED</p>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedTour.includes.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" /> {item}
                      </div>
                    ))}
                  </div>
                  {selectedTour.notIncluded && (
                    <div className="flex items-start gap-2 text-xs text-slate-500 italic mt-3 pt-3 border-t border-slate-800">
                      <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>{selectedTour.notIncluded}</span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-amber-400 text-[10px] tracking-[0.3em] mb-3">SERVICES</p>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2"><Users className="w-3 h-3 text-amber-400" /> 1 - {selectedTour.maxPeople} people</div>
                    <div className="flex items-center gap-2"><Clock className="w-3 h-3 text-amber-400" /> {selectedTour.timeSlots.join(' or ')}</div>
                    <div className="flex items-center gap-2"><Globe className="w-3 h-3 text-amber-400" /> EN • IT • FR • DE</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CALENDAR & TIME */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-slate-900 border border-slate-800 p-6">
              <p className="text-amber-400 text-[10px] tracking-[0.3em] mb-4 flex items-center gap-2">
                <Calendar className="w-3 h-3" /> SELECT DATE
                {calendarLoading && <span className="text-slate-500 italic">syncing with Google Calendar...</span>}
                {!calendarLoading && <span className="text-emerald-400 italic">● synced with Google Calendar</span>}
              </p>
              <div className="grid grid-cols-7 gap-1">
                {calendarDates.map((day, idx) => (
                  <button key={idx} onClick={() => day.available && setSelectedDate(day.date)} disabled={!day.available}
                    className={`p-2 text-center transition relative ${
                      selectedDate?.toDateString() === day.date.toDateString() ? 'bg-amber-400 text-slate-950'
                      : day.available ? 'bg-slate-800 text-white hover:bg-slate-700'
                      : 'bg-slate-900 text-slate-700 cursor-not-allowed line-through'
                    }`}>
                    <div className="text-[9px] tracking-wider">{day.dayName}</div>
                    <div className="text-lg">{day.dayNum}</div>
                    <div className="text-[9px]">{day.monthName}</div>
                    {day.fromCalendar && !day.available && (
                      <div className="text-[8px] text-red-400 mt-0.5">📅</div>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 mt-3 tracking-wider">CROSSED OUT = UNAVAILABLE • 📅 = FROM GOOGLE CALENDAR</p>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 p-6">
                <p className="text-amber-400 text-[10px] tracking-[0.3em] mb-4 flex items-center gap-2"><Clock className="w-3 h-3" /> PREFERRED TIME</p>
                <div className="space-y-2">
                  {selectedTour.timeSlots.map(slot => (
                    <button key={slot} onClick={() => setSelectedTimeSlot(slot)}
                      className={`w-full text-left px-4 py-3 text-sm transition ${
                        selectedTimeSlot === slot ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}>{slot}</button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 mt-3 italic">Timings can be adjusted on request</p>
              </div>

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
                <p className="text-[10px] text-slate-500 mt-3 italic">Price may vary based on group size</p>
              </div>
            </div>
          </div>

          {/* MEETING POINT */}
          <div className="bg-slate-900 border border-slate-800 p-6 mb-6">
            <p className="text-amber-400 text-[10px] tracking-[0.3em] mb-4 flex items-center gap-2"><MapPin className="w-3 h-3" /> MEETING POINT</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['Porto Mirabello', 'Portovenere', 'Le Grazie', 'Lerici'].map(point => (
                <button key={point} onClick={() => setMeetingPoint(point)}
                  className={`px-3 py-2 text-sm transition ${meetingPoint === point ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>{point}</button>
              ))}
            </div>
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

          <button onClick={() => selectedDate && selectedTimeSlot && (setCurrentStep(3), window.scrollTo({ top: 0, behavior: 'smooth' }))} disabled={!selectedDate || !selectedTimeSlot}
            className={`w-full py-4 tracking-[0.3em] text-sm transition ${selectedDate && selectedTimeSlot ? 'bg-amber-400 text-slate-950 hover:bg-amber-300' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}>
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
            <div>
              <label className="block text-[10px] text-amber-400 tracking-widest mb-2">SPECIAL REQUESTS {selectedTour?.isCustom && '*'}</label>
              <textarea value={customerData.notes} onChange={(e) => setCustomerData({ ...customerData, notes: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white focus:border-amber-400 focus:outline-none resize-none" rows="4"
                placeholder={selectedTour?.isCustom ? "Describe your dream itinerary..." : "Dietary preferences, occasions, special requests..."} />
            </div>
          </div>

          <div className="bg-slate-900 border border-amber-400/30 p-6 my-6">
            <p className="text-amber-400 text-[10px] tracking-[0.3em] mb-4">BOOKING SUMMARY</p>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex justify-between"><span>Tour</span><span className="text-white">{selectedTour?.name}</span></div>
              <div className="flex justify-between"><span>Date</span><span className="text-white">{selectedDate?.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
              <div className="flex justify-between"><span>Time</span><span className="text-white">{selectedTimeSlot}</span></div>
              <div className="flex justify-between"><span>Guests</span><span className="text-white">{numPeople}</span></div>
              <div className="flex justify-between"><span>Meeting point</span><span className="text-white">{meetingPoint}</span></div>
              {selectedAddOns.length > 0 && <div className="flex justify-between"><span>Add-ons</span><span className="text-white text-right">{selectedAddOns.length} selected<br/><span className="text-[10px] text-amber-400/70 italic">price on request</span></span></div>}
              {!selectedTour?.isCustom && (
                <div className="pt-3 mt-3 border-t border-slate-700">
                  <div className="flex justify-between text-lg"><span className="text-slate-400">Starting from</span><span className="text-white">€{selectedTour?.basePrice.toLocaleString()}</span></div>
                  <p className="text-[10px] text-amber-400/70 italic mt-2">Final price will be confirmed by Captain Marco based on date, group size and requests</p>
                </div>
              )}
            </div>
          </div>

          <button onClick={handleSubmit} disabled={!customerData.name || !customerData.email || !customerData.phone || (selectedTour?.isCustom && !customerData.notes)}
            className={`w-full py-4 tracking-[0.3em] text-sm transition ${
              customerData.name && customerData.email && customerData.phone && (!selectedTour?.isCustom || customerData.notes)
                ? 'bg-amber-400 text-slate-950 hover:bg-amber-300' : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}>
            REQUEST QUOTE
          </button>
          <p className="text-center text-[10px] text-slate-500 tracking-widest mt-4">CAPTAIN MARCO WILL CONFIRM YOUR QUOTE WITHIN 24 HOURS</p>
        </div>
      )}

      <footer className="border-t border-slate-800 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <div className="inline-block">
              <SeaRunnerLogoCompact size="md" />
            </div>
          </div>
          <p className="text-slate-300 text-sm tracking-[0.2em] mb-2">SEA RUNNER</p>
          <p className="text-amber-400/70 text-[10px] tracking-[0.3em] mb-4">DAILY BOAT TRIP</p>
          <p className="text-slate-500 text-xs tracking-[0.3em]">+39 348 828 9438 • @SEARUNNER_LASPEZIA</p>
          <p className="text-slate-700 text-[10px] tracking-[0.3em] mt-2">PORTO MIRABELLO • LA SPEZIA • ITALIAN RIVIERA</p>
        </div>
      </footer>
    </div>
  );
}
