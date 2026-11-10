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
  'step1.intro': 'Tour privati in barca lungo la Riviera Ligure: raccontaci cosa desideri e ti manderemo un preventivo su misura.',
  'card.price': 'PREZZO',
  'card.onRequest': 'Su richiesta',
  'card.privateFlexible': 'Privato · Itinerario flessibile',
  'card.checkPrice': 'VEDI IL PREZZO →',
  'step1.faqQuestion': 'Hai domande prima di prenotare?',
  'step1.faqLink': 'LEGGI LE DOMANDE FREQUENTI →',

  // --- passo 2: data, orario, ospiti ---
  'step2.changeTour': '← CAMBIA TOUR',
  'step2.noticeStrong': 'Questa è una richiesta di disponibilità.',
  'step2.noticeText': ' Non è richiesto alcun pagamento. Il capitano Marco ti ricontatterà entro 24 ore per confermare e inviarti un preventivo su misura.',
  'step2.flexibleTime': (time) => ` (~${time}, flessibile)`,
  'step2.guestsRange': (max) => `1-${max} ospiti`,
  'step2.itineraryNote': "Questo è l'itinerario tipo. Può variare in base alle preferenze degli ospiti o alle condizioni del meteo.",
  'step2.included': 'COSA È INCLUSO',
  'step2.notIncluded': 'NON INCLUSO:',
  'step2.chooseItinerary': 'SCEGLI IL TUO ITINERARIO',
  'step2.selectDate': 'SCEGLI LA DATA',
  'step2.checkingBanner': 'Verifica della disponibilità in corso: attendi prima di scegliere una data',
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
  'step2.changedMind': 'HAI CAMBIATO IDEA?',
  'step2.otherTours': 'Scopri gli altri tour',
  'step2.viewTour': 'VEDI IL TOUR →',
  'step2.backToAll': '← TORNA A TUTTI I TOUR',

  // --- passo 3: dati del cliente ---
  'step3.back': '← INDIETRO',
  'step3.kicker': 'ULTIMO PASSO: I TUOI CONTATTI',
  'step3.title': 'Dove possiamo risponderti?',
  'step3.intro': 'Lasciaci i tuoi dati e ti invieremo un preventivo su misura entro 24 ore. In questa fase non è richiesto alcun pagamento.',
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
  'step3.requestsPlaceholderCustom': 'Descrivi il tuo itinerario dei sogni...',
  'step3.requestsPlaceholder': 'Occasioni speciali, preferenze, qualsiasi altra cosa...',

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
  'recap.estimateNote': 'Questa è una stima. Il prezzo finale sarà confermato dallo skipper in base a data, numero di ospiti e richieste: ti ricontatteremo il prima possibile.',
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
  'error.generic': 'Contattaci direttamente, saremo felici di sentirti:',
  'error.whatsapp': (tour, date) => `Ciao! Ho provato a inviare una richiesta per il tour ${tour} del ${date} ma qualcosa non ha funzionato. Potete aiutarmi?`,
  'error.technical': "DETTAGLI TECNICI (per l'assistenza)",

  // --- consensi privacy ---
  'consent.privacy1': 'Ho letto la ',
  'consent.privacyLink': 'Privacy Policy',
  'consent.privacy2': ' e so che i miei dati saranno usati per gestire la mia richiesta di prenotazione. ',
  'consent.health': 'Acconsento espressamente al trattamento dei dati relativi alla salute che sto fornendo (allergie e/o mobilità ridotta), da usare esclusivamente per garantire la sicurezza e il comfort a bordo (art. 9.2.a GDPR). ',

  // --- invio ---
  'step3.submit': 'INVIA LA RICHIESTA',
  'step3.disclaimer': 'Non stai ancora prenotando né pagando: ti contatteremo entro 24 ore per confermare la disponibilità e inviarti il preventivo definitivo.',
  'step3.signature': 'CAPITANO MARCO & PAOLA · LA SPEZIA',

  // --- pagina di conferma ---
  'thanks.metaTitle': 'Grazie — Richiesta ricevuta | Sea Runner',
  'thanks.kicker': 'RICHIESTA DI PREVENTIVO RICEVUTA',
  'thanks.title': 'Grazie,',
  'thanks.body1': "La tua richiesta è stata inviata. Il capitano Marco e Paola ti risponderanno entro 24 ore all'indirizzo ",
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
  'thanks.moreQuestions': 'Hai altre domande? Scrivici pure, ti rispondiamo volentieri.',
  'thanks.whatsapp': (tour, date) => `Ciao! Ho appena inviato una richiesta per il tour ${tour} del ${date}. Avrei una domanda...`,
  'thanks.whatsappButton': 'SCRIVICI SU WHATSAPP',

  // --- FAQ ---
  'faq.kicker': 'DA SAPERE',
  'faq.title': 'Domande frequenti',
  'faq.items': [
    {
      q: 'Cibo e bevande sono inclusi a bordo?',
      a: `Sì. Ogni tour include open bar e un aperitivo con prodotti tipici. Nei tour di una giornata intera (Cinque Terre, Golfo dei Poeti, Portofino) serviamo anche un pranzo leggero a bordo. Se avete allergie o preferenze alimentari, avvisateci in anticipo e adatteremo tutto per voi.`
    },
    {
      q: 'Cosa succede se il tempo è brutto?',
      a: `La vostra sicurezza viene sempre prima di tutto. Il capitano Marco segue con grande attenzione le previsioni meteo e decide se le condizioni permettono di uscire. Se il mare non è sicuro per il tour, lo spostiamo a un'altra data a vostra scelta oppure vi rimborsiamo per intero. Nessuna penale, nessuno stress.`
    },
    {
      q: 'Bambini e anziani possono salire a bordo?',
      a: `Certamente. La nostra barca è adatta alle famiglie, sicura e comoda. A bordo ci sono giubbotti di salvataggio per bambini, la plancia di poppa rende facile entrare e uscire dall'acqua e ci sono zone d'ombra per le ore più calde della giornata.`
    },
    {
      q: 'Il tour è davvero privato? Ci saranno altri ospiti?',
      a: `Sì, è privato al 100%. A bordo ci sarete solo voi e le persone che scegliete di portare: mai estranei, mai tour condivisi. È la vostra giornata in mare, con i vostri tempi.`
    },
    {
      q: "Possiamo personalizzare l'itinerario?",
      a: `Sì. Ogni tour ha un percorso standard, ma il capitano Marco lo adatta alle condizioni del mare e alle vostre preferenze. Volete fermarvi più a lungo in una caletta? Passare più tempo in un borgo? Saltare una tappa? Basta dirlo: la giornata la decidete voi.`
    },
    {
      q: 'Serve esperienza di navigazione per partecipare?',
      a: `Per niente. I nostri tour sono adatti a tutti, da chi sale in barca per la prima volta agli amanti del mare più esperti. Il capitano Marco ha la patente nautica da oltre 30 anni e gestisce ogni situazione con professionalità, così potete rilassarvi e godervi la giornata in totale tranquillità.`
    },
    {
      q: "Siete autorizzati a entrare nell'area marina protetta delle Cinque Terre? La barca è dotata di tutte le attrezzature di sicurezza?",
      a: `Sì, a tutte e due le domande. Abbiamo tutte le autorizzazioni ufficiali per navigare e ancorare nell'Area Marina Protetta delle Cinque Terre. La barca è completamente equipaggiata con dotazioni di sicurezza professionali: AIS (sistema di localizzazione in tempo reale), segnalatori di soccorso, giubbotti di salvataggio per tutti gli ospiti, kit di primo soccorso e tutte le dotazioni obbligatorie, controllate regolarmente e sempre in regola.`
    },
    {
      q: 'Possiamo portare a bordo cibo e bevande nostri?',
      a: `Sì. Oltre a quello che serviamo a bordo, potete portare la vostra bottiglia di vino o di champagne, una torta di compleanno o tutto quello che serve per rendere speciale la giornata. Avvisateci in anticipo, così prepariamo tutto al meglio.`
    },
    {
      q: "Potete organizzare la giornata per un'occasione speciale?",
      a: `Certamente. Molti ospiti ci scelgono per proposte di matrimonio, viaggi di nozze, anniversari e compleanni: una giornata in mare è l'occasione perfetta per un momento da ricordare. Raccontateci cosa avete in mente e penseremo noi ai dettagli: fiori, decorazioni, una torta, la musica o un momento tutto vostro al tramonto.`
    },
    {
      q: 'C’è un numero minimo di ospiti?',
      a: `Nessun minimo. Il tour è completamente privato, che siate in 2 o in 8. Per una coppia, la barca privata è uno dei modi più intimi per scoprire la costa: solo voi due, il mare e la Riviera Ligure.`
    },
    {
      q: 'Possiamo portare il nostro cane?',
      a: `Sì, i cani sono i benvenuti a bordo. Se viaggiate con il vostro amico a quattro zampe, avvisateci in anticipo così ci assicuriamo che tutto sia pronto anche per il suo comfort.`
    }
  ],

  // --- social ---
  'social.kicker': 'SEGUICI',
  'social.title': 'Ogni giorno, uno scorcio della Riviera',
  'social.text': 'Tramonti, calette nascoste e il dietro le quinte delle nostre giornate in mare. Seguici per vedere dove ci porterà la prossima uscita.',

  // --- home ---
  'home.seoTitle': 'Tour privati in barca Cinque Terre, Portofino e La Spezia',
  'home.seoDescription': 'Giri in barca privati lungo la Riviera Ligure con il capitano Marco e Paola. Cinque Terre, Portofino, Golfo dei Poeti: solo voi a bordo, itinerario su misura. Partenze da La Spezia.',
  'home.schemaDescription': 'Tour privati in barca da La Spezia lungo la Riviera Ligure. Cinque Terre, Portofino, Portovenere e il Golfo dei Poeti a bordo della pluripremiata Cap Camarat 9.0 WA con il capitano Marco e Paola: barca completamente privata, mai condivisa. Partenze da Porto Mirabello.',
  'home.heroKicker': 'LA SPEZIA · RIVIERA LIGURE',
  'home.heroTitle': 'Tour privati in barca lungo la',
  'home.heroTitleScript': 'riviera ligure',
  'home.heroText': 'Cinque Terre, Portofino e il Golfo dei Poeti, senza nessun altro a bordo. Solo voi, il capitano Marco e Paola.',
  'home.ctaQuote': 'RICHIEDI UN PREVENTIVO',
  'home.ctaBoat': 'SCOPRI LA BARCA',
  'home.scroll': 'SCORRI',
  'home.storyKicker': 'LA NOSTRA STORIA',
  'home.storyTitle': 'La Liguria vista dal mare',
  'home.storyText1': "Il capitano Marco e Paola vi accolgono a bordo per un'esperienza completamente privata. Niente folla, niente orari fissi. Solo voi e le persone a cui tenete, alla scoperta della costa con i vostri tempi.",
  'home.storyText2': "Calette nascoste, irraggiungibili per le barche più grandi. Snorkeling nell'area marina protetta, con chi la conosce da sempre. Un pranzo leggero servito a bordo, con prodotti tipici e vini liguri, davanti ai borghi colorati. Ogni giornata è pensata su misura per voi.",
  'home.reviewsKicker': 'AMATI DAI NOSTRI OSPITI',
  'home.reviewsTitle': '5,0 su Google · oltre 100 recensioni',
  'home.reviewsText': 'Non lo diciamo noi: leggi cosa raccontano della loro giornata in mare gli ospiti arrivati da tutto il mondo.',
  'home.readOnGoogle': 'Leggi su Google',
  'home.readOnTripadvisor': 'Leggi su TripAdvisor',
  'home.toursKicker': 'ESPERIENZE ESCLUSIVE',
  'home.toursTitle': 'Scegli il tuo tour',
  'home.viewAllTours': 'VEDI TUTTI I TOUR →',
  'home.boatImageAlt': "La barca privata Sea Runner al faro dell'isola del Tino, costa delle Cinque Terre",
  'home.boatKicker': 'LA BARCA',
  'home.boatText': "Silenzio in rada grazie ai pannelli solari, navigazione morbida grazie ai flap automatici. Bimini estendibile, bagno a bordo e tutto il necessario per godersi una giornata intera in mare.",
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
  'boat.intro': 'Una barca pluripremiata, scelta per un solo motivo: farvi vivere il mare nel modo migliore.',
  'boat.specGuestsValue': 'fino a 8',
  'boat.specGuestsLabel': 'OSPITI',
  'boat.specGuestsNote': '+ equipaggio',
  'boat.specBathValue': 'Bagno',
  'boat.specBathLabel': 'A BORDO',
  'boat.specBiminiValue': 'Bimini',
  'boat.specBiminiLabel': 'ESTENDIBILE',
  'boat.silenceKicker': "SILENZIO ALL'ANCORA",
  'boat.silenceTitle': 'Solo il suono del mare',
  'boat.silenceText': "I pannelli solari alimentano i nostri due frigoriferi per tutto il giorno, anche all'ancora, senza il rumore del generatore e a emissioni zero. A motori spenti si sente solo il mare.",
  'boat.cruisingKicker': 'NAVIGAZIONE MORBIDA',
  'boat.cruisingTitle': 'Stabile su ogni onda',
  'boat.cruisingText': "I flap automatici correggono l'assetto in tempo reale e rendono morbido ogni movimento. I due motori Yamaha da 225 CV danno potenza quando serve, ma la giornata scorre senza fretta.",
  'boat.shadeKicker': 'OMBRA QUANDO SERVE',
  'boat.shadeTitle': 'Sole o ombra, decidete voi',
  'boat.shadeText': 'Un bimini estendibile copre tutto il pozzetto di poppa quando il sole è più forte e si ritrae in pochi secondi quando volete godervi il sole e la brezza.',
  'boat.comfortKicker': 'TUTTO QUELLO CHE SERVE',
  'boat.comfortTitle': 'Una vera casa sul mare',
  'boat.comfortText': "Bagno privato a bordo, doccia con acqua dolce, impianto audio bluetooth Fusion, ampia plancia per i bagni, frigoriferi sempre pieni. Non manca nulla per godersi una giornata intera in mare.",
  'boat.layoutKicker': 'PIANTA DELLA BARCA',
  'boat.layoutTitle': "Com'è organizzata la barca",
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
