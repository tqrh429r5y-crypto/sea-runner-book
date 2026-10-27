// ============ TESTI IN INGLESE (lingua principale) ============
// Ogni riga: 'chiave': 'testo'. Le altre lingue (it.js, fr.js…) usano le STESSE chiavi.
// I testi dei tour in inglese stanno direttamente in initialTours (src/App.jsx).
// Alcuni testi sono "funzioni" perché contengono pezzi variabili (nome del tour, data…).

const en = {
  // --- WhatsApp ---
  'wa.default': 'Hi! I would like to know more about your tours.',
  'wa.tours': 'Hi! I would like to know more about Sea Runner tours.',
  'wa.tourQuestion': (tour) => `Hi! I have a question about the ${tour} tour.`,
  'wa.title': 'Chat with us on WhatsApp',
  'wa.aria': 'Chat with Sea Runner on WhatsApp',
  'wa.hover': 'Chat with us',

  // --- barra in alto ---
  'nav.home': 'Home',
  'nav.boat': 'The boat',
  'nav.quote': 'Request a quote',
  'nav.faq': 'FAQ',
  'nav.tagline': 'PRIVATE BOAT TOURS',
  'nav.toggle': 'Toggle menu',
  'nav.language': 'Language',

  // --- piè di pagina ---
  'footer.tagline': 'PRIVATE BOAT TOURS',
  'footer.place': 'PORTO MIRABELLO • LA SPEZIA • ITALIAN RIVIERA',
  'footer.privacy': 'PRIVACY POLICY',

  // --- elementi comuni dei tour ---
  'tour.altSuffix': ' – private boat tour from La Spezia',
  'tour.itinerary': 'ITINERARY',
  'tour.toAgree': 'To be agreed',

  // --- prenotazione: SEO e dati per Google ---
  'booking.seoTitle': 'Request a Free Quote — Private Boat Tours from La Spezia',
  'booking.seoDescription': 'Request a free quote for a fully private boat tour to Cinque Terre, Portofino or Golfo dei Poeti. Captain Marco replies within 24 hours — no payment required upfront.',
  'booking.seoTitleTour': (tour) => `${tour.name} Private Boat Tour — Request a Quote`,
  'booking.seoDescriptionTour': (tour) => `Request a free quote for the ${tour.name} private boat tour. ${tour.shortDesc} No payment required, reply within 24 hours from Captain Marco.`,
  'booking.h1': 'Private boat tours from La Spezia',
  'schema.tripName': (name) => `${name} — Private Boat Tour`,
  'schema.touristType': 'Private boat tour',
  'schema.tours': 'Tours',

  // --- prenotazione: passi ---
  'steps.tour': 'TOUR',
  'steps.date': 'DATE',
  'steps.details': 'DETAILS',

  // --- passo 1: scelta del tour ---
  'step1.kicker': 'REQUEST A FREE QUOTE',
  'step1.title': 'Choose Your Tour',
  'step1.intro': "Private boat tours along the Italian Riviera — tell us your preferences and we'll reply with a tailored quote.",
  'card.price': 'PRICE',
  'card.onRequest': 'On request',
  'card.privateFlexible': 'Private · Flexible itinerary',
  'card.checkPrice': 'CHECK PRICE →',
  'step1.faqQuestion': 'Have questions before booking?',
  'step1.faqLink': 'READ OUR FAQ →',

  // --- passo 2: data, orario, ospiti ---
  'step2.changeTour': '← CHANGE TOUR',
  'step2.noticeStrong': 'This is an availability request.',
  'step2.noticeText': ' No payment is required. Captain Marco will get back to you within 24 hours to confirm and send a tailored quote.',
  'step2.flexibleTime': (time) => ` (~${time}, flexible)`,
  'step2.guestsRange': (max) => `1-${max} guests`,
  'step2.itineraryNote': 'This is the standard itinerary. It may vary depending on guest preferences or weather conditions.',
  'step2.included': "WHAT'S INCLUDED",
  'step2.notIncluded': 'NOT INCLUDED:',
  'step2.chooseItinerary': 'CHOOSE YOUR ITINERARY',
  'step2.selectDate': 'SELECT DATE',
  'step2.checkingBanner': 'Checking availability — please wait before selecting a date',
  'step2.weekdays': ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  'step2.checkingTitle': 'Checking availability…',
  'step2.specialPrice': 'Special price available',
  'step2.crossedOut': 'CROSSED OUT = UNAVAILABLE',
  'step2.updating': 'UPDATING AVAILABILITY...',
  'step2.upToDate': 'AVAILABILITY UP TO DATE',
  'step2.localOnly': 'USING LOCAL BOOKINGS ONLY',
  'step2.timeOfDay': 'TIME OF DAY',
  'step2.schedule': 'SCHEDULE',
  'step2.timeToAgree': 'Time to be agreed with skipper',
  'step2.guests': 'GUESTS',
  'step2.max': 'MAX',
  'step2.meetingPoint': 'MEETING POINT',
  'step2.other': 'Other',
  'step2.otherPlaceholder': 'Please specify your preferred meeting point...',
  'step2.feasibility': 'SKIPPER WILL CONFIRM FEASIBILITY',
  'step2.continue': 'CONTINUE TO DETAILS →',
  'step2.changedMind': 'CHANGED YOUR MIND?',
  'step2.otherTours': 'Explore our other tours',
  'step2.viewTour': 'VIEW TOUR →',
  'step2.backToAll': '← BACK TO ALL TOURS',

  // --- passo 3: dati del cliente ---
  'step3.back': '← BACK',
  'step3.kicker': 'LAST STEP — YOUR CONTACT INFO',
  'step3.title': 'Where should we reply?',
  'step3.intro': "Leave us your details and we'll send you a tailored quote within 24 hours. No payment required at this stage.",
  'step3.name': 'FULL NAME *',
  'step3.namePlaceholder': 'Mario Rossi',
  'step3.email': 'EMAIL *',
  'step3.emailPlaceholder': 'you@email.com',
  'step3.phone': 'PHONE *',
  'step3.language': 'PREFERRED LANGUAGE',
  'step3.dietary': 'DIETARY REQUIREMENTS',
  'step3.allergiesCheck': 'One or more guests have allergies or food intolerances',
  'step3.allergiesLabel': 'PLEASE SPECIFY ALLERGIES OR INTOLERANCES *',
  'step3.allergiesPlaceholder': 'e.g. gluten-free, nut allergy, vegetarian, lactose intolerant...',
  'step3.mobility': 'MOBILITY',
  'step3.mobilityCheck': 'One or more guests have reduced mobility',
  'step3.mobilityLabel': 'PLEASE SPECIFY *',
  'step3.mobilityPlaceholder': 'e.g. wheelchair user, limited walking, needs assistance boarding...',
  'step3.requests': 'SPECIAL REQUESTS',
  'step3.requestsPlaceholderCustom': 'Describe your dream itinerary...',
  'step3.requestsPlaceholder': 'Occasions, preferences, anything else...',

  // --- riepilogo della richiesta ---
  'recap.title': 'YOUR REQUEST',
  'recap.tour': 'Tour',
  'recap.itinerary': 'Itinerary',
  'recap.date': 'Date',
  'recap.time': 'Time',
  'recap.guests': 'Guests',
  'recap.meetingPoint': 'Meeting point',
  'recap.tourBase': 'Tour base',
  'recap.datePrice': 'Price for this date',
  'recap.indicative': 'Indicative price',
  'recap.estimateNote': 'This is an estimate. The final price will be confirmed by the skipper based on date, group size and requests — you will be contacted as soon as possible.',
  'recap.tailoredNote': 'For Tailored tours, the final price is confirmed by the skipper based on your requests.',

  // --- errore di invio ---
  'error.title': 'Unable to submit your request',
  'error.spam1': 'Our system could not validate your request. Please review the details you entered ',
  'error.carefully': 'carefully',
  'error.spam2': ' — make sure your ',
  'error.phone': 'phone number',
  'error.and': ' and ',
  'error.emailAddress': 'email address',
  'error.spam3': ' are written correctly and in full, with no typos or missing characters, then try again. If the problem persists, contact us directly:',
  'error.generic': "Please contact us directly — we'd love to hear from you:",
  'error.whatsapp': (tour, date) => `Hi! I tried to submit a booking request for ${tour} on ${date} but something went wrong. Can you help?`,
  'error.technical': 'TECHNICAL DETAILS (for support)',

  // --- consensi privacy ---
  'consent.privacy1': 'I have read and accept the ',
  'consent.privacyLink': 'Privacy Policy',
  'consent.privacy2': ', and I consent to the processing of my personal data for the purpose of handling my booking request. ',
  'consent.health': 'I explicitly consent to the processing of the health-related information I am providing (allergies and/or reduced mobility), to be used exclusively to ensure my safety and comfort on board (GDPR art. 9.2.a). ',

  // --- invio ---
  'step3.submit': 'REQUEST QUOTE',
  'step3.disclaimer': "You're not booking or paying yet — we'll contact you within 24 hours to confirm availability and send your final quote.",
  'step3.signature': 'CAPTAIN MARCO & PAOLA · LA SPEZIA',

  // --- pagina di conferma ---
  'thanks.metaTitle': 'Thank you — Request received | Sea Runner',
  'thanks.kicker': 'QUOTE REQUEST RECEIVED',
  'thanks.title': 'Thank you,',
  'thanks.body1': 'Your request has been sent. Captain Marco and Paola will reply within 24 hours at ',
  'thanks.body2': ' with availability confirmation and your tailored quote. ',
  'thanks.noPayment': 'No payment is required at this stage.',
  'thanks.reachUs': 'NEED TO REACH US DIRECTLY?',
  'thanks.or': 'or',
  'thanks.yourRequest': 'YOUR REQUEST',
  'thanks.date': 'Date: ',
  'thanks.time': 'Time: ',
  'thanks.guests': 'Guests: ',
  'thanks.meeting': 'Meeting: ',
  'thanks.newBooking': 'NEW BOOKING',
  'thanks.moreQuestions': "Have any other questions? Don't hesitate to message us.",
  'thanks.whatsapp': (tour, date) => `Hi! I just submitted a booking request for ${tour} on ${date}. I have a question...`,
  'thanks.whatsappButton': 'MESSAGE US ON WHATSAPP',

  // --- FAQ ---
  'faq.kicker': 'GOOD TO KNOW',
  'faq.title': 'Frequently asked questions',
  'faq.items': [
    {
      q: 'Is food and drinks included on board?',
      a: `Yes. Every tour includes an open bar and a light Italian aperitivo. On full day tours (Cinque Terre, Golfo dei Poeti, Portofino) we also serve a light Italian lunch on board. If you have allergies or dietary preferences, just let us know in advance and we'll adapt everything for you.`
    },
    {
      q: 'What happens if the weather is bad?',
      a: `Your safety always comes first. Captain Marco monitors the weather forecast very carefully and makes the final call on conditions. If the sea is not safe for the tour, we will either reschedule to another date at your convenience or fully refund you. No penalty, no stress.`
    },
    {
      q: 'Can children and seniors come on board?',
      a: `Absolutely. Our boat is family-friendly, safe and comfortable. Children's life jackets are on board, the swim platform makes it easy to get in and out of the water, and we provide shaded areas for the hottest hours of the day.`
    },
    {
      q: 'Is the tour really private? Will other guests join?',
      a: `Yes, it is 100% private. Only you and the people you choose to bring with you will be on board — never strangers, never shared tours. It's your own day at sea, your own pace.`
    },
    {
      q: 'Can we customize the itinerary?',
      a: `Yes. While each tour has a standard route, Captain Marco adapts it to the sea conditions and your preferences. Want to spend more time swimming in a certain cove? Stop longer at a village? Skip a stop? Just tell us — we build the day around you.`
    },
    {
      q: 'Do we need any sailing experience to join?',
      a: `Not at all. Our tours are suitable for everyone, from first-time sailors to experienced sea lovers. Captain Marco has held his nautical license for over 30 years and handles every situation professionally, making sure you can relax and enjoy the day with complete peace of mind.`
    },
    {
      q: 'Are you authorized to enter the Cinque Terre marine park? Is the boat fully equipped for safety?',
      a: `Yes and yes. We hold all the official authorizations required to navigate and anchor within the Cinque Terre Marine Protected Area. The boat is fully equipped with professional safety gear: AIS (real-time tracking system), distress signalling, life jackets for all guests, first aid kit, and all mandatory equipment — regularly inspected and up to date.`
    },
    {
      q: 'Can we bring our own food and drinks on board?',
      a: `Yes, in addition to what we serve on board, you are welcome to bring your own bottle of wine, champagne, a birthday cake or anything you'd like to make the day feel truly yours. Just let us know in advance so we can prepare everything properly.`
    },
    {
      q: 'Can you organize the day for a special occasion?',
      a: `Absolutely. Many guests choose us for marriage proposals, honeymoons, anniversaries and birthdays — a day at sea is the perfect stage for unforgettable moments. Let us know what you have in mind and we'll take care of the details: flowers, decorations, a cake, music, or a private moment at sunset.`
    },
    {
      q: 'Is there a minimum number of guests?',
      a: `No minimum. The tour is fully private whether you are 2 or 8 guests. For couples, a private boat is one of the most intimate ways to discover the coast — just the two of you, the sea, and the Italian Riviera.`
    },
    {
      q: 'Can we bring our dog on board?',
      a: `Yes, dogs are very welcome on board. If you're traveling with your four-legged companion, just let us know in advance so we can make sure everything is set up for their comfort too.`
    }
  ],

  // --- social ---
  'social.kicker': 'FOLLOW THE JOURNEY',
  'social.title': 'A daily glimpse of the Riviera',
  'social.text': 'Sunsets, hidden coves and behind-the-scenes from our days at sea. Follow us to see where Sea Runner sails next.',

  // --- home ---
  'home.seoTitle': 'Private Boat Tours Cinque Terre, Portofino & La Spezia',
  'home.seoDescription': 'Exclusive private boat tours along the Italian Riviera with Captain Marco and Paola. Cinque Terre, Portofino, Golfo dei Poeti — fully private, fully tailored. Departures from La Spezia.',
  'home.schemaDescription': 'Private boat tours from La Spezia along the Italian Riviera. Discover Cinque Terre, Portofino, Portovenere and the Golfo dei Poeti aboard our award-winning Cap Camarat 9.0 WA with Captain Marco and Paola — fully private charter, never shared. Departures from Porto Mirabello.',
  'home.heroKicker': 'LA SPEZIA · ITALIAN RIVIERA',
  'home.heroTitle': 'Private boat tours along the',
  'home.heroTitleScript': 'italian riviera',
  'home.heroText': 'Cinque Terre, Golfo dei Poeti, Portofino. Exclusive day trips with Captain Marco and Paola.',
  'home.ctaQuote': 'REQUEST A QUOTE',
  'home.ctaBoat': 'DISCOVER THE BOAT',
  'home.scroll': 'SCROLL',
  'home.storyKicker': 'OUR STORY',
  'home.storyTitle': 'A different way to see Liguria',
  'home.storyText1': 'Captain Marco and Paola welcome you aboard for a fully private experience. No crowds, no fixed schedules. Just you and those you love, with the coastline unfolding at your own pace.',
  'home.storyText2': 'Swim in hidden coves the big boats never reach. Snorkel the marine reserve with a guide. Enjoy a light Italian lunch on board with local wine while the colourful villages drift by. Every day at sea is crafted around you.',
  'home.reviewsKicker': 'LOVED BY OUR GUESTS',
  'home.reviewsTitle': 'Highly rated across the web',
  'home.reviewsText': "Don't take our word for it, read what guests from all over the world have to say about their day at sea with us.",
  'home.readOnGoogle': 'Read on Google',
  'home.readOnTripadvisor': 'Read on TripAdvisor',
  'home.toursKicker': 'EXCLUSIVE EXPERIENCES',
  'home.toursTitle': 'Choose your tour',
  'home.viewAllTours': 'VIEW ALL TOURS →',
  'home.boatImageAlt': 'Sea Runner private boat at Tino island lighthouse — Cinque Terre coastline',
  'home.boatKicker': 'THE BOAT',
  'home.boatText': 'Solar-powered silence at anchor. Smooth cruising thanks to an intelligent flap system. Extendable shade, bathroom on board, and everything you need for a full day of pleasure.',
  'home.boatCta': 'DISCOVER THE BOAT →',
  'home.contactKicker': 'GET IN TOUCH',
  'home.contactTitle': 'Questions before booking?',
  'home.contactText': 'Marco and Paola reply personally, as soon as possible.',

  // --- pagina della barca ---
  'boat.seoTitle': 'The Boat — Cap Camarat 9.0 WA, Award-Winning Yacht for Private Tours',
  'boat.seoDescription': "Discover Sea Runner's Cap Camarat 9.0 WA: silent solar power, smooth cruising, extendable bimini, bathroom on board. The award-winning vessel of our Cinque Terre and Portofino private tours.",
  'boat.breadcrumb': 'The Boat',
  'boat.kicker': 'THE BOAT',
  'boat.awards': 'Best Boat of the Year · multiple awards',
  'boat.intro': 'An award-winning vessel, chosen for one reason only: it lets you feel the sea at its best.',
  'boat.specGuestsValue': 'up to 8',
  'boat.specGuestsLabel': 'GUESTS',
  'boat.specGuestsNote': '+ crew',
  'boat.specBathValue': 'Bathroom',
  'boat.specBathLabel': 'ON BOARD',
  'boat.specBiminiValue': 'Extendable',
  'boat.specBiminiLabel': 'BIMINI',
  'boat.silenceKicker': 'SILENCE AT ANCHOR',
  'boat.silenceTitle': 'Only the sound of the sea',
  'boat.silenceText': 'Solar panels keep our two fridges running all day long — even at anchor, with no generator noise and zero emissions. When the engines are off, the only soundtrack is the water.',
  'boat.cruisingKicker': 'SMOOTH CRUISING',
  'boat.cruisingTitle': 'Steady on every wave',
  'boat.cruisingText': 'An intelligent flap system adjusts the trim in real time, softening every movement. Twin Yamaha 225 HP engines deliver power when you need it, without ever feeling rushed.',
  'boat.shadeKicker': 'SHADE WHEN YOU WANT IT',
  'boat.shadeTitle': 'Sun or shade, you decide',
  'boat.shadeText': 'An extendable bimini covers the entire rear deck when the sun is at its strongest, and retracts in seconds when you want to feel the breeze and the light on your skin.',
  'boat.comfortKicker': 'EVERYTHING YOU NEED',
  'boat.comfortTitle': 'A proper home at sea',
  'boat.comfortText': 'Private bathroom on board, fresh water shower, Fusion bluetooth stereo to set the mood, generous swim platform, fridges always stocked. Nothing is missing for a full day of pleasure.',
  'boat.layoutKicker': 'BOAT LAYOUT',
  'boat.layoutTitle': 'How the boat is organized',
  'boat.layoutComingSoon': 'BOAT LAYOUT COMING SOON',
  'boat.layoutAlt': 'Cap Camarat 9.0 WA Sea Runner — boat layout and floor plan',
  'boat.layoutCredit': 'Official layout from Jeanneau',
  'boat.ctaText': 'Curious about prices and availability?',
  'boat.ctaButton': 'REQUEST A QUOTE →',
  'boat.photosComingSoon': 'BOAT PHOTOS COMING SOON',
  'boat.photoAlts': [
    'Sea Runner private boat at Tino island lighthouse, Cinque Terre',
    'Cap Camarat 9.0 WA Sea Runner cruising the Italian Riviera',
    'Sea Runner boat aerial view over the Golfo dei Poeti',
    'Bathroom on board Sea Runner Cap Camarat 9.0 WA',
    'Solar-powered fridge on board Sea Runner private boat',
    'Sunset aperitivo at the table on Sea Runner private boat tour',
  ],
  'boat.photoFallbackAlt': (n) => `Sea Runner boat photo ${n}`,
  'boat.prevPhoto': 'Previous photo',
  'boat.nextPhoto': 'Next photo',
  'boat.goToPhoto': (n) => `Go to photo ${n}`,

  // --- banner cookie ---
  'cookie.short': 'We use analytics cookies (Google Analytics) only with your consent. ',
  'cookie.long1': 'We use technical cookies necessary for the site to work and, only with your consent, analytics cookies (Google Analytics) to understand how the site is used and improve it. See our ',
  'cookie.long2': ' for details.',
  'cookie.privacyLink': 'Privacy Policy',
  'cookie.decline': 'DECLINE',
  'cookie.accept': 'ACCEPT',

  // --- pagina non trovata ---
  'notFound.metaTitle': 'Page not found | Sea Runner',
  'notFound.title': 'Page not found',
  'notFound.text': "The page you are looking for doesn't exist. Discover our private boat tours instead.",
  'notFound.home': 'HOME',
  'notFound.tours': 'OUR TOURS',
};

export default en;
