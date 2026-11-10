// ============ TESTI IN ITALIANO (searunner.it/it/...) ============
// Stesse chiavi di en.js. Se una chiave manca qui, il sito mostra il testo inglese.
// Tono: "tu" nei pulsanti e nei moduli (azioni di chi visita il sito),
//       "voi" quando si descrive l'esperienza a bordo (di solito è un gruppo).
// Per la versione francese: copiare questo file in fr.js e tradurre i testi a destra.

const it = {
  // --- WhatsApp ---
  'wa.default': 'Ciao! Vorrei avere più informazioni sui vostri tour.',
  'wa.tours': 'Ciao! Vorrei avere più informazioni sui tour di Sea Runner.',
  'wa.tourQuestion': (tour) => `Ciao! Ho una domanda sul tour ${tour}.`,
  'wa.title': 'Scrivici su WhatsApp',
  'wa.aria': 'Scrivi a Sea Runner su WhatsApp',
  'wa.hover': 'Scrivici',

  // --- barra in alto ---
  'nav.home': 'Home',
  'nav.boat': 'La barca',
  'nav.quote': 'Richiedi un preventivo',
  'nav.faq': 'Domande',
  'nav.tagline': 'TOUR PRIVATI IN BARCA',
  'nav.toggle': 'Apri o chiudi il menu',
  'nav.language': 'Lingua',

  // --- piè di pagina ---
  'footer.tagline': 'TOUR PRIVATI IN BARCA',
  'footer.place': 'PORTO MIRABELLO • LA SPEZIA • RIVIERA LIGURE',
  'footer.privacy': 'PRIVACY POLICY',
  'footer.cookieSettings': 'IMPOSTAZIONI COOKIE',

  // --- elementi comuni dei tour ---
  'tour.altSuffix': ' – tour privato in barca da La Spezia',
  'tour.itinerary': 'ITINERARIO',
  'tour.toAgree': 'Da concordare',

  // --- prenotazione: SEO e dati per Google ---
  'booking.seoTitle': 'Preventivo gratuito — Tour privati in barca da La Spezia',
  'booking.seoDescription': 'Richiedi un preventivo gratuito per un tour in barca completamente privato alle Cinque Terre, a Portofino o nel Golfo dei Poeti. Il capitano Marco risponde entro 24 ore, nessun pagamento anticipato.',
  'booking.seoTitleTour': (tour) => `Giro in barca privato ${tour.seoName} — Preventivo gratuito`,
  'booking.seoDescriptionTour': (tour) => `Richiedi un preventivo gratuito per il giro in barca privato ${tour.seoName}. ${tour.shortDesc} Nessun pagamento richiesto, risposta entro 24 ore dal capitano Marco.`,
  'booking.h1': 'Tour privati in barca da La Spezia',
  'schema.tripName': (name) => `${name} — Tour privato in barca`,
  'schema.touristType': 'Tour privato in barca',
  'schema.tours': 'Tour',

  // --- prenotazione: passi ---
  'steps.tour': 'TOUR',
  'steps.date': 'DATA',
  'steps.details': 'DATI',

  // --- passo 1: scelta del tour ---
  'step1.kicker': 'RICHIEDI UN PREVENTIVO GRATUITO',
  'step1.title': 'Scegli il tuo tour',
  'step1.intro': "Tour privati in barca lungo la Riviera Ligure. Raccontaci cosa desideri: ti invieremo un preventivo su misura.",
  'card.price': 'PREZZO',
  'card.onRequest': 'Su richiesta',
  'card.privateFlexible': 'Privato · Itinerario flessibile',
  'card.checkPrice': 'VEDI IL PREZZO →',
  'step1.faqQuestion': 'Hai domande prima di prenotare?',
  'step1.faqLink': 'LEGGI LE DOMANDE FREQUENTI →',

  // --- passo 2: data, orario, ospiti ---
  'step2.changeTour': '← CAMBIA TOUR',
  'step2.noticeStrong': 'Questa è una richiesta di disponibilità.',
  'step2.noticeText': " Non è richiesto alcun pagamento: entro 24 ore il capitano Marco ti contatterà per confermare la disponibilità e inviarti un preventivo su misura.",
  'step2.flexibleTime': (time) => ` (~${time}, flessibile)`,
  'step2.guestsRange': (max) => `1-${max} ospiti`,
  'step2.itineraryNote': "Questo è l'itinerario indicativo: può essere adattato alle vostre preferenze e alle condizioni del mare.",
  'step2.included': 'COSA È INCLUSO',
  'step2.notIncluded': 'NON INCLUSO:',
  'step2.chooseItinerary': 'SCEGLI IL TUO ITINERARIO',
  'step2.selectDate': 'SCEGLI LA DATA',
  'step2.checkingBanner': "Stiamo verificando la disponibilità: attendi un istante prima di scegliere la data",
  'step2.weekdays': ['L', 'M', 'M', 'G', 'V', 'S', 'D'],
  'step2.checkingTitle': 'Verifica della disponibilità…',
  'step2.specialPrice': 'Prezzo speciale disponibile',
  'step2.crossedOut': 'BARRATO = NON DISPONIBILE',
  'step2.updating': 'AGGIORNAMENTO DISPONIBILITÀ...',
  'step2.upToDate': 'DISPONIBILITÀ AGGIORNATA',
  'step2.localOnly': 'DISPONIBILITÀ DA CONFERMARE',
  'step2.timeOfDay': 'MOMENTO DELLA GIORNATA',
  'step2.schedule': 'ORARIO',
  'step2.timeToAgree': 'Orario da concordare con lo skipper',
  'step2.guests': 'OSPITI',
  'step2.max': 'MAX',
  'step2.meetingPoint': "PUNTO D'INCONTRO",
  'step2.other': 'Altro',
  'step2.otherPlaceholder': "Indica il punto d'incontro che preferisci...",
  'step2.feasibility': 'LO SKIPPER CONFERMERÀ LA FATTIBILITÀ',
  'step2.continue': 'PROSEGUI →',
  'step2.changedMind': "VUOI VALUTARE ALTRE OPZIONI?",
  'step2.otherTours': 'Scopri gli altri tour',
  'step2.viewTour': 'VEDI IL TOUR →',
  'step2.backToAll': '← TORNA A TUTTI I TOUR',

  // --- passo 3: dati del cliente ---
  'step3.back': '← INDIETRO',
  'step3.kicker': 'ULTIMO PASSO: I TUOI CONTATTI',
  'step3.title': "Come possiamo contattarti?",
  'step3.intro': "Lasciaci i tuoi contatti: entro 24 ore riceverai un preventivo su misura. In questa fase non è richiesto alcun pagamento.",
  'step3.name': 'NOME E COGNOME *',
  'step3.namePlaceholder': 'Mario Rossi',
  'step3.email': 'EMAIL *',
  'step3.emailPlaceholder': 'nome@email.com',
  'step3.phone': 'TELEFONO *',
  'step3.language': 'LINGUA PREFERITA',
  'step3.dietary': 'ESIGENZE ALIMENTARI',
  'step3.allergiesCheck': 'Uno o più ospiti hanno allergie o intolleranze alimentari',
  'step3.allergiesLabel': 'INDICA ALLERGIE O INTOLLERANZE *',
  'step3.allergiesPlaceholder': 'es. senza glutine, allergia alla frutta a guscio, vegetariano, intolleranza al lattosio...',
  'step3.mobility': 'MOBILITÀ',
  'step3.mobilityCheck': 'Uno o più ospiti hanno mobilità ridotta',
  'step3.mobilityLabel': 'DESCRIVI LE ESIGENZE *',
  'step3.mobilityPlaceholder': 'es. in sedia a rotelle, difficoltà a camminare, aiuto per salire a bordo...',
  'step3.requests': 'RICHIESTE SPECIALI',
  'step3.requestsPlaceholderCustom': "Raccontaci la giornata che immagini...",
  'step3.requestsPlaceholder': "Occasioni speciali, preferenze o qualsiasi altra richiesta...",

  // --- riepilogo della richiesta ---
  'recap.title': 'LA TUA RICHIESTA',
  'recap.tour': 'Tour',
  'recap.itinerary': 'Itinerario',
  'recap.date': 'Data',
  'recap.time': 'Orario',
  'recap.guests': 'Ospiti',
  'recap.meetingPoint': "Punto d'incontro",
  'recap.tourBase': 'Prezzo base del tour',
  'recap.datePrice': 'Prezzo per questa data',
  'recap.indicative': 'Prezzo indicativo',
  'recap.estimateNote': "Il prezzo è indicativo: quello definitivo ti sarà confermato dallo skipper in base a data, numero di ospiti e richieste.",
  'recap.tailoredNote': 'Per i tour su misura il prezzo finale viene confermato dallo skipper in base alle tue richieste.',

  // --- errore di invio ---
  'error.title': 'Non è stato possibile inviare la richiesta',
  'error.spam1': 'Il nostro sistema non è riuscito a convalidare la richiesta. Controlla ',
  'error.carefully': 'con attenzione',
  'error.spam2': ' i dati inseriti: assicurati che ',
  'error.phone': 'numero di telefono',
  'error.and': ' e ',
  'error.emailAddress': 'indirizzo email',
  'error.spam3': ' siano scritti correttamente e per intero, senza errori o caratteri mancanti, poi riprova. Se il problema continua, contattaci direttamente:',
  'error.generic': "Contattaci direttamente, saremo felici di aiutarti:",
  'error.whatsapp': (tour, date) => `Ciao! Ho provato a inviare una richiesta per il tour ${tour} del ${date} ma qualcosa non ha funzionato. Potete aiutarmi?`,
  'error.technical': "DETTAGLI TECNICI (per l'assistenza)",

  // --- consensi privacy ---
  'consent.privacy1': 'Ho letto la ',
  'consent.privacyLink': 'Privacy Policy',
  'consent.privacy2': ' e so che i miei dati saranno usati per gestire la mia richiesta di prenotazione. ',
  'consent.health': 'Acconsento espressamente al trattamento dei dati relativi alla salute che sto fornendo (allergie e/o mobilità ridotta), da usare esclusivamente per garantire la sicurezza e il comfort a bordo (art. 9.2.a GDPR). ',

  // --- invio ---
  'step3.submit': 'INVIA LA RICHIESTA',
  'step3.disclaimer': "Non stai ancora prenotando né pagando: entro 24 ore ti contatteremo per confermare la disponibilità e inviarti il preventivo definitivo.",
  'step3.signature': 'CAPITANO MARCO & PAOLA · LA SPEZIA',

  // --- pagina di conferma ---
  'thanks.metaTitle': 'Grazie — Richiesta ricevuta | Sea Runner',
  'thanks.kicker': 'RICHIESTA DI PREVENTIVO RICEVUTA',
  'thanks.title': 'Grazie,',
  'thanks.body1': "La tua richiesta è arrivata. Entro 24 ore ti risponderemo all'indirizzo ",
  'thanks.body2': ' con la conferma della disponibilità e il tuo preventivo su misura. ',
  'thanks.noPayment': 'In questa fase non è richiesto alcun pagamento.',
  'thanks.reachUs': 'VUOI CONTATTARCI DIRETTAMENTE?',
  'thanks.or': 'oppure',
  'thanks.yourRequest': 'LA TUA RICHIESTA',
  'thanks.date': 'Data: ',
  'thanks.time': 'Orario: ',
  'thanks.guests': 'Ospiti: ',
  'thanks.meeting': "Punto d'incontro: ",
  'thanks.newBooking': 'NUOVA RICHIESTA',
  'thanks.moreQuestions': "Per qualsiasi altra domanda, scrivici: saremo felici di aiutarti.",
  'thanks.whatsapp': (tour, date) => `Ciao! Ho appena inviato una richiesta per il tour ${tour} del ${date}. Avrei una domanda...`,
  'thanks.whatsappButton': 'SCRIVICI SU WHATSAPP',

  // --- FAQ ---
  'faq.kicker': 'DA SAPERE',
  'faq.title': 'Domande frequenti',
  'faq.items': [
    {
      q: 'Cibo e bevande sono inclusi a bordo?',
      a: `Sì. Ogni tour include open bar e un aperitivo con prodotti tipici. Nei tour di una giornata intera (Cinque Terre, Golfo dei Poeti, Portofino) è previsto anche un pranzo leggero servito a bordo. In caso di allergie o preferenze alimentari, basta avvisarci in anticipo: adatteremo il menu alle vostre esigenze.`
    },
    {
      q: 'Cosa succede se il tempo è brutto?',
      a: `La vostra sicurezza viene prima di tutto. Il capitano Marco segue con attenzione le previsioni e valuta se le condizioni del mare permettono di uscire. Se non è così, spostiamo il tour a un'altra data di vostra scelta oppure vi rimborsiamo per intero, senza alcuna penale.`
    },
    {
      q: 'Bambini e anziani possono salire a bordo?',
      a: `Certamente. La barca è sicura, comoda e adatta alle famiglie: a bordo ci sono giubbotti di salvataggio per bambini, la plancia di poppa permette di entrare e uscire dall'acqua con facilità e non mancano zone d'ombra per le ore più calde.`
    },
    {
      q: 'Il tour è davvero privato? Ci saranno altri ospiti?',
      a: `Sì, al 100%. A bordo ci sarete solo voi e le persone che avete scelto: nessun estraneo, nessun tour condiviso. La giornata è vostra, con i vostri tempi.`
    },
    {
      q: "Possiamo personalizzare l'itinerario?",
      a: `Sì. Ogni tour ha un itinerario di riferimento, che il capitano Marco adatta alle condizioni del mare e ai vostri desideri. Una sosta più lunga in una caletta, più tempo in un borgo, una tappa in meno: basta chiedere.`
    },
    {
      q: 'Serve esperienza di navigazione per partecipare?',
      a: `Nessuna. I nostri tour sono pensati per tutti, da chi sale in barca per la prima volta a chi ha il mare nel sangue. Il capitano Marco ha la patente nautica da oltre 30 anni e gestisce ogni situazione con esperienza: a voi resta solo il piacere di rilassarvi e godervi la giornata.`
    },
    {
      q: "Siete autorizzati a entrare nell'area marina protetta delle Cinque Terre? La barca è dotata di tutte le attrezzature di sicurezza?",
      a: `Sì. Disponiamo di tutte le autorizzazioni ufficiali per navigare e ancorare nell'Area Marina Protetta delle Cinque Terre e la barca è dotata di equipaggiamento di sicurezza professionale: AIS (localizzazione in tempo reale), segnalatori di soccorso, giubbotti di salvataggio per tutti gli ospiti, kit di primo soccorso e tutte le dotazioni obbligatorie, controllate regolarmente.`
    },
    {
      q: 'Possiamo portare a bordo cibo e bevande nostri?',
      a: `Certo. Oltre a quanto serviamo a bordo, potete portare una bottiglia di vino o di champagne, una torta di compleanno o qualsiasi cosa renda speciale la giornata. Avvisateci in anticipo: prepareremo tutto al meglio.`
    },
    {
      q: "Potete organizzare la giornata per un'occasione speciale?",
      a: `Con piacere. Molti ospiti ci scelgono per una proposta di matrimonio, un viaggio di nozze, un anniversario o un compleanno: il mare è la cornice ideale per un momento da ricordare. Raccontateci cosa avete in mente e ci occuperemo noi dei dettagli: fiori, decorazioni, una torta, la musica o un momento tutto vostro al tramonto.`
    },
    {
      q: 'C’è un numero minimo di ospiti?',
      a: `No. Il tour è sempre privato, che siate in 2 o in 8. Per una coppia è uno dei modi più intimi per scoprire la costa: voi due, il mare e la Riviera Ligure.`
    },
    {
      q: 'Possiamo portare il nostro cane?',
      a: `Sì, i cani sono i benvenuti a bordo. Avvisateci in anticipo: ci assicureremo che sia tutto pronto anche per il loro comfort.`
    }
  ],

  // --- social ---
  'social.kicker': 'SEGUICI',
  'social.title': "La Riviera, giorno dopo giorno",
  'social.text': "Tramonti, calette nascoste e il dietro le quinte delle nostre giornate in mare. Seguici per non perderti la prossima uscita.",

  // --- home ---
  'home.seoTitle': 'Tour privati in barca Cinque Terre, Portofino e La Spezia',
  'home.seoDescription': 'Giri in barca privati lungo la Riviera Ligure con il capitano Marco e Paola. Cinque Terre, Portofino, Golfo dei Poeti: solo voi a bordo, itinerario su misura. Partenze da La Spezia.',
  'home.schemaDescription': 'Tour privati in barca da La Spezia lungo la Riviera Ligure. Cinque Terre, Portofino, Portovenere e il Golfo dei Poeti a bordo della pluripremiata Cap Camarat 9.0 WA con il capitano Marco e Paola: barca completamente privata, mai condivisa. Partenze da Porto Mirabello.',
  'home.heroKicker': 'LA SPEZIA · RIVIERA LIGURE',
  'home.heroTitle': 'Tour privati in barca lungo la',
  'home.heroTitleScript': 'riviera ligure',
  'home.heroText': "Cinque Terre, Portofino e il Golfo dei Poeti, a bordo di una barca tutta per voi, con il capitano Marco e Paola.",
  'home.ctaQuote': 'RICHIEDI UN PREVENTIVO',
  'home.ctaBoat': 'SCOPRI LA BARCA',
  'home.scroll': 'SCORRI',
  'home.storyKicker': 'LA NOSTRA STORIA',
  'home.storyTitle': 'La Liguria vista dal mare',
  'home.storyText1': "Siamo Marco e Paola e vi accogliamo a bordo per un'esperienza interamente privata. Nessuna folla, nessun orario imposto: solo voi e le persone a cui tenete, alla scoperta della costa con i vostri tempi.",
  'home.storyText2': "Calette nascoste, irraggiungibili per le barche più grandi. Snorkeling nell'area marina protetta, con chi la conosce da sempre. Un pranzo leggero servito a bordo, con prodotti tipici e vini liguri, davanti ai borghi colorati. Ogni giornata è pensata su misura per voi.",
  'home.reviewsKicker': "LE PAROLE DEI NOSTRI OSPITI",
  'home.reviewsTitle': '5,0 su Google · oltre 100 recensioni',
  'home.reviewsText': "Non lo diciamo noi: leggi i racconti degli ospiti che, da tutto il mondo, hanno trascorso con noi una giornata in mare.",
  'home.readOnGoogle': 'Leggi su Google',
  'home.readOnTripadvisor': 'Leggi su TripAdvisor',
  'home.toursKicker': 'ESPERIENZE ESCLUSIVE',
  'home.toursTitle': 'Scegli il tuo tour',
  'home.viewAllTours': 'VEDI TUTTI I TOUR →',
  'home.boatImageAlt': "La barca privata Sea Runner al faro dell'isola del Tino, costa delle Cinque Terre",
  'home.boatKicker': 'LA BARCA',
  'home.boatText': "Silenzio in rada grazie ai pannelli solari, navigazione stabile e morbida grazie ai flap automatici. Bimini estendibile, bagno a bordo e ogni comfort per vivere al meglio una giornata intera in mare.",
  'home.boatCta': 'SCOPRI LA BARCA →',
  'home.contactKicker': 'CONTATTI',
  'home.contactTitle': 'Scrivici direttamente',
  'home.contactText': 'Hai qualche domanda prima di prenotare? Ti rispondiamo noi, Marco e Paola, il prima possibile.',

  // --- pagina della barca ---
  'boat.seoTitle': 'La barca — Cap Camarat 9.0 WA, yacht pluripremiato per tour privati',
  'boat.seoDescription': 'Scopri la Cap Camarat 9.0 WA di Sea Runner: silenziosa grazie ai pannelli solari, navigazione stabile, bimini estendibile, bagno a bordo. La barca pluripremiata dei nostri tour privati alle Cinque Terre e a Portofino.',
  'boat.breadcrumb': 'La barca',
  'boat.kicker': 'LA BARCA',
  'boat.awards': "Barca dell'anno · pluripremiata",
  'boat.intro': "Una barca pluripremiata, scelta per un solo motivo: offrirvi il mare nel modo migliore.",
  'boat.specGuestsValue': 'fino a 8',
  'boat.specGuestsLabel': 'OSPITI',
  'boat.specGuestsNote': '+ equipaggio',
  'boat.specBathValue': 'Bagno',
  'boat.specBathLabel': 'A BORDO',
  'boat.specBiminiValue': 'Bimini',
  'boat.specBiminiLabel': 'ESTENDIBILE',
  'boat.silenceKicker': "SILENZIO ALL'ANCORA",
  'boat.silenceTitle': 'Solo il suono del mare',
  'boat.silenceText': "I pannelli solari alimentano i due frigoriferi per tutta la giornata, anche all'ancora: niente generatore, niente rumore, zero emissioni. A motori spenti si sente solo il mare.",
  'boat.cruisingKicker': 'NAVIGAZIONE MORBIDA',
  'boat.cruisingTitle': 'Stabile su ogni onda',
  'boat.cruisingText': "I flap automatici correggono l'assetto in tempo reale e rendono la navigazione stabile e confortevole. I due motori Yamaha da 225 CV offrono tutta la potenza necessaria, ma a bordo si viaggia senza fretta.",
  'boat.shadeKicker': 'OMBRA QUANDO SERVE',
  'boat.shadeTitle': 'Sole o ombra, decidete voi',
  'boat.shadeText': "Il bimini estendibile copre l'intero pozzetto di poppa nelle ore più calde e si ritrae in pochi secondi quando avete voglia di sole e di brezza.",
  'boat.comfortKicker': 'TUTTO QUELLO CHE SERVE',
  'boat.comfortTitle': "Ogni comfort, anche in mare",
  'boat.comfortText': "Bagno privato, doccia con acqua dolce, impianto audio bluetooth Fusion, un'ampia plancia per i bagni e frigoriferi sempre riforniti: tutto ciò che serve per una giornata intera in mare.",
  'boat.layoutKicker': 'PIANTA DELLA BARCA',
  'boat.layoutTitle': "Gli spazi a bordo",
  'boat.layoutComingSoon': 'PIANTA IN ARRIVO',
  'boat.layoutAlt': 'Cap Camarat 9.0 WA Sea Runner — pianta e disposizione degli spazi',
  'boat.layoutCredit': 'Pianta ufficiale Jeanneau',
  'boat.ctaText': 'Vuoi conoscere prezzi e disponibilità?',
  'boat.ctaButton': 'RICHIEDI UN PREVENTIVO →',
  'boat.photosComingSoon': 'FOTO DELLA BARCA IN ARRIVO',
  'boat.photoAlts': [
    "La barca privata Sea Runner al faro dell'isola del Tino, Cinque Terre",
    'La Cap Camarat 9.0 WA di Sea Runner in navigazione lungo la Riviera Ligure',
    'La barca Sea Runner vista dall’alto nel Golfo dei Poeti',
    'Il bagno a bordo della Cap Camarat 9.0 WA di Sea Runner',
    'Frigorifero alimentato a energia solare a bordo di Sea Runner',
    'Aperitivo al tramonto al tavolo di Sea Runner durante un tour privato',
  ],
  'boat.photoFallbackAlt': (n) => `Foto della barca Sea Runner ${n}`,
  'boat.prevPhoto': 'Foto precedente',
  'boat.nextPhoto': 'Foto successiva',
  'boat.goToPhoto': (n) => `Vai alla foto ${n}`,

  // --- banner cookie ---
  'cookie.short': 'Usiamo cookie analitici (Google Analytics) solo con il tuo consenso. ',
  'cookie.long1': 'Usiamo cookie tecnici necessari al funzionamento del sito e, solo con il tuo consenso, cookie analitici (Google Analytics) per capire come viene usato il sito e migliorarlo. Tutti i dettagli nella nostra ',
  'cookie.long2': '.',
  'cookie.privacyLink': 'Privacy Policy',
  'cookie.decline': 'RIFIUTA',
  'cookie.accept': 'ACCETTA',

  // --- pagina non trovata ---
  'notFound.metaTitle': 'Pagina non trovata | Sea Runner',
  'notFound.title': 'Pagina non trovata',
  'notFound.text': 'La pagina che cerchi non esiste. Scopri invece i nostri tour privati in barca.',
  'notFound.home': 'HOME',
  'notFound.tours': 'I NOSTRI TOUR',

  // ============ TOUR ============
  // Solo i testi. Prezzi, orari, colori e immagini restano quelli di initialTours (src/App.jsx).
  // h1 = titolo per Google della pagina del tour · seoName = come si completa "Giro in barca privato …"
  tours: {
    'cinque-terre': {
      name: 'Cinque Terre',
      subtitle: 'Giornata intera',
      duration: '7 ore',
      h1: 'Tour privato in barca alle Cinque Terre (giornata intera)',
      seoName: 'alle Cinque Terre',
      shortDesc: "I cinque borghi visti dal mare, con soste per il bagno, snorkeling e pranzo servito a bordo.",
      longDesc: "Una giornata intera dedicata alle Cinque Terre, patrimonio UNESCO, da scoprire dal mare: Riomaggiore, Manarola, Corniglia, Vernazza e Monterosso. Soste per il bagno nelle calette più suggestive, snorkeling nelle acque dell'area marina protetta e un pranzo leggero servito a bordo, con prodotti tipici liguri. A Vernazza e a Monterosso avrete il tempo di scendere a terra e passeggiare tra i vicoli.",
      itinerary: [
        { place: "Punto d'incontro", note: 'Il punto scelto da voi • Partenza' },
        { place: 'Portovenere', note: 'Passaggio panoramico davanti al borgo' },
        { place: 'Monesteroli — Campiglia', note: 'Costa selvaggia e sosta per un bagno' },
        { place: 'Riomaggiore', note: 'La prima delle Cinque Terre' },
        { place: 'Manarola', note: 'Snorkeling in acque cristalline' },
        { place: 'Corniglia', note: 'Il borgo sulla scogliera visto dal mare' },
        { place: 'Vernazza', note: 'Sosta pranzo • Tempo a terra' },
        { place: 'Monterosso', note: 'Tempo a terra • Ultima tappa' },
        { place: 'Rientro', note: "Ritorno al punto d'incontro scelto" }
      ],
      itineraryFootnote: 'Circa 7 ore • Orari flessibili',
      includes: ['Pranzo leggero con prodotti tipici', 'Open bar', 'Hostess multilingue', 'Carburante e skipper', 'Parcheggio privato', 'Teli mare e attrezzatura']
    },
    'golfo-poeti': {
      name: 'Golfo dei Poeti',
      subtitle: 'Giornata intera',
      duration: '7 ore',
      h1: 'Tour privato in barca nel Golfo dei Poeti (giornata intera)',
      seoName: 'nel Golfo dei Poeti',
      shortDesc: "Portovenere, le isole, Lerici e Tellaro: il golfo che incantò Byron e Shelley.",
      longDesc: "Il golfo che incantò Byron e Shelley, in una giornata tutta per voi. Dalla Portovenere medievale, patrimonio UNESCO, alle isole Palmaria, Tino e Tinetto, con soste per il bagno e lo snorkeling in acque limpidissime. Poi la traversata verso San Terenzo e Lerici, dominata dal suo castello, fino al piccolo borgo di Tellaro. Pranzo leggero servito a bordo.",
      itinerary: [
        { place: "Punto d'incontro", note: 'Il punto scelto da voi • Partenza' },
        { place: 'Portovenere', note: 'Borgo UNESCO • Tempo a terra' },
        { place: 'Palmaria', note: 'Grotta Azzurra • Snorkeling' },
        { place: 'Tino', note: "L'isola dell'antico monastero" },
        { place: 'Tinetto', note: "Giro panoramico attorno all'isolotto" },
        { place: 'San Terenzo', note: 'Il borgo dei pescatori e il castello' },
        { place: 'Lerici', note: 'Sosta pranzo • Vista sul castello' },
        { place: 'Tellaro', note: 'Il piccolo borgo sul mare' },
        { place: 'Rientro', note: "Ritorno al punto d'incontro scelto" }
      ],
      itineraryFootnote: 'Circa 7 ore • Orari flessibili',
      includes: ['Pranzo leggero con prodotti tipici', 'Open bar', 'Hostess multilingue', 'Carburante e skipper', 'Parcheggio privato', 'Teli mare e attrezzatura']
    },
    'portofino': {
      name: 'Portofino',
      subtitle: 'San Fruttuoso e Cinque Terre',
      duration: '10 ore',
      h1: 'Tour privato in barca a Portofino (giornata intera)',
      seoName: 'a Portofino',
      shortDesc: "Portofino e l'abbazia di San Fruttuoso, con le Cinque Terre sulla rotta del ritorno.",
      longDesc: "Una giornata lungo la Riviera di Levante, fino a uno dei porti più celebri al mondo. Prima tappa a San Fruttuoso, con la sua abbazia affacciata sul mare; poi Portofino, con tempo libero per una passeggiata e il pranzo al ristorante. Bagno e snorkeling nell'area marina protetta e, al rientro, la costa delle Cinque Terre vista dal mare.",
      itinerary: [
        { place: "Punto d'incontro", note: 'Il punto scelto da voi • Partenza' },
        { place: 'Costa ligure', note: 'Navigazione panoramica lungo la riviera' },
        { place: 'San Fruttuoso', note: "Sosta • Visita all'abbazia e bagno" },
        { place: 'Portofino', note: 'Sosta • Tempo libero e pranzo al ristorante' },
        { place: 'Riserva marina', note: 'Snorkeling in acque cristalline' },
        { place: 'Cinque Terre', note: 'Navigazione al tramonto lungo la costa' },
        { place: 'Rientro', note: "Ritorno al punto d'incontro scelto" }
      ],
      itineraryFootnote: 'Circa 10 ore • Pranzo al ristorante non incluso',
      includes: ['Pranzo leggero a bordo', 'Open bar', 'Hostess multilingue', 'Carburante e skipper', 'Parcheggio privato', 'Teli mare e attrezzatura']
    },
    'half-day-choice': {
      name: 'Mezza giornata',
      subtitle: 'Cinque Terre o Golfo dei Poeti',
      duration: '4 ore',
      h1: 'Tour privato in barca di mezza giornata: Cinque Terre o Golfo dei Poeti',
      seoName: 'di mezza giornata',
      shortDesc: "Cinque Terre o Golfo dei Poeti in quattro ore, al mattino, al pomeriggio o in serata.",
      longDesc: "Quattro ore in mare, ideali per chi ha poco tempo ma desidera comunque un'esperienza speciale. Scegliete la rotta, Cinque Terre o Golfo dei Poeti, e il momento che preferite: la luce fresca del mattino, il pomeriggio o le prime ore della sera. Con soste per il bagno e un aperitivo servito a bordo.",
      itineraryOptions: {
        cinque: {
          name: 'Cinque Terre',
          itinerary: [
            { place: "Punto d'incontro", note: 'Il punto scelto da voi • Partenza' },
            { place: 'Portovenere', note: 'Passaggio panoramico davanti al borgo' },
            { place: 'Riomaggiore', note: 'La prima delle Cinque Terre' },
            { place: 'Manarola', note: 'Snorkeling in acque cristalline' },
            { place: 'Vernazza', note: 'Tempo a terra • Ultima tappa' },
            { place: 'Rientro', note: "Ritorno al punto d'incontro scelto" }
          ]
        },
        golfo: {
          name: 'Golfo dei Poeti',
          itinerary: [
            { place: "Punto d'incontro", note: 'Il punto scelto da voi • Partenza' },
            { place: 'Portovenere', note: 'Borgo UNESCO • Tempo a terra' },
            { place: 'Palmaria', note: 'Grotta Azzurra • Snorkeling' },
            { place: 'Lerici', note: 'Vista sul castello • Tempo a terra' },
            { place: 'Tellaro', note: 'Piccolo borgo sul mare • Ultima tappa' },
            { place: 'Rientro', note: "Ritorno al punto d'incontro scelto" }
          ]
        }
      },
      itineraryFootnote: 'Circa 4 ore • Orari flessibili',
      timeOfDay: {
        morning: { label: 'Mattina' },
        afternoon: { label: 'Pomeriggio' },
        evening: { label: 'Sera' }
      },
      includes: ['Aperitivo con prodotti tipici', 'Open bar', 'Hostess multilingue', 'Carburante e skipper', 'Parcheggio privato', 'Teli mare']
    },
    'sunset': {
      name: 'Tour al tramonto',
      subtitle: 'Aperitivo al tramonto',
      duration: '3 ore e mezza',
      h1: 'Tour privato in barca al tramonto',
      seoName: 'al tramonto',
      shortDesc: "Un aperitivo in barca mentre il sole tramonta sulla costa.",
      longDesc: "Il modo più elegante per concludere la giornata: tre ore e mezza in barca, con un aperitivo ligure e una selezione di vini del territorio, mentre il sole scende sul mare. La rotta la scegliete voi: Cinque Terre o Golfo dei Poeti.",
      itineraryOptions: {
        cinque: {
          name: 'Cinque Terre al tramonto',
          itinerary: [
            { place: "Punto d'incontro", note: 'Il punto scelto da voi • Partenza' },
            { place: 'Portovenere', note: 'Le prime luci del tramonto' },
            { place: 'Riomaggiore', note: 'Il tramonto sulle scogliere' },
            { place: 'Manarola', note: 'Aperitivo • Ultima tappa' },
            { place: 'Rientro', note: "Ritorno al punto d'incontro scelto" }
          ]
        },
        golfo: {
          name: 'Golfo dei Poeti al tramonto',
          itinerary: [
            { place: "Punto d'incontro", note: 'Il punto scelto da voi • Partenza' },
            { place: 'Portovenere', note: 'Il borgo medievale al tramonto' },
            { place: 'Palmaria', note: "Il sole che scende dietro l'isola" },
            { place: 'Lerici', note: 'Aperitivo con vista sul castello' },
            { place: 'Rientro', note: "Ritorno al punto d'incontro scelto" }
          ]
        }
      },
      itineraryFootnote: 'Circa 3 ore e mezza • Orari flessibili',
      includes: ['Aperitivo con prodotti tipici', 'Open bar con vini del territorio', 'Hostess multilingue', 'Carburante e skipper', 'Parcheggio privato', 'Teli mare']
    },
    'custom': {
      name: 'Su misura',
      subtitle: "La vostra giornata, come la volete voi",
      duration: 'Flessibile',
      h1: 'Tour privato in barca su misura',
      seoName: 'su misura',
      shortDesc: "Un itinerario disegnato su misura, insieme a voi.",
      longDesc: "Raccontateci cosa desiderate: destinazioni, durata e attività le definiamo insieme, per una giornata organizzata interamente su misura.",
      includes: ['Tutto su misura per voi']
    }
  },
};

export default it;
