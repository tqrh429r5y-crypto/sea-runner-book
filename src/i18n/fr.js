// ============ TESTI IN FRANCESE (searunner.it/fr/...) ============
// Stesse chiavi di en.js. Se una chiave manca qui, il sito mostra il testo inglese.
// Tono: "vous" ovunque (forma di cortesia, standard per un servizio premium in francese).

const fr = {
  // --- WhatsApp ---
  'wa.default': "Bonjour ! J'aimerais en savoir plus sur vos excursions.",
  'wa.tours': "Bonjour ! J'aimerais en savoir plus sur les excursions Sea Runner.",
  'wa.tourQuestion': (tour) => `Bonjour ! J'ai une question sur l'excursion ${tour}.`,
  'wa.title': 'Écrivez-nous sur WhatsApp',
  'wa.aria': 'Écrire à Sea Runner sur WhatsApp',
  'wa.hover': 'Écrivez-nous',

  // --- barra in alto ---
  'nav.home': 'Accueil',
  'nav.boat': 'Le bateau',
  'nav.quote': 'Demander un devis',
  'nav.faq': 'FAQ',
  'nav.tagline': 'EXCURSIONS EN BATEAU',
  'nav.toggle': 'Ouvrir ou fermer le menu',
  'nav.language': 'Langue',

  // --- piè di pagina ---
  'footer.tagline': 'EXCURSIONS PRIVÉES EN BATEAU',
  'footer.place': 'PORTO MIRABELLO • LA SPEZIA • RIVIERA ITALIENNE',
  'footer.privacy': 'POLITIQUE DE CONFIDENTIALITÉ',

  // --- elementi comuni dei tour ---
  'tour.altSuffix': ' – excursion privée en bateau au départ de La Spezia',
  'tour.itinerary': 'ITINÉRAIRE',
  'tour.toAgree': 'À convenir',

  // --- prenotazione: SEO e dati per Google ---
  'booking.seoTitle': 'Devis gratuit — Excursions privées en bateau au départ de La Spezia',
  'booking.seoDescription': "Demandez un devis gratuit pour une excursion en bateau entièrement privée aux Cinque Terre, à Portofino ou dans le Golfe des Poètes. Le capitaine Marco vous répond sous 24 heures, aucun paiement à l'avance.",
  'booking.seoTitleTour': (tour) => `Excursion privée en bateau ${tour.seoName} — Devis gratuit`,
  'booking.seoDescriptionTour': (tour) => `Demandez un devis gratuit pour l'excursion privée en bateau ${tour.seoName}. ${tour.shortDesc} Aucun paiement demandé, réponse du capitaine Marco sous 24 heures.`,
  'booking.h1': 'Excursions privées en bateau au départ de La Spezia',
  'schema.tripName': (name) => `${name} — Excursion privée en bateau`,
  'schema.touristType': 'Excursion privée en bateau',
  'schema.tours': 'Excursions',

  // --- prenotazione: passi ---
  'steps.tour': 'EXCURSION',
  'steps.date': 'DATE',
  'steps.details': 'COORDONNÉES',

  // --- passo 1: scelta del tour ---
  'step1.kicker': 'DEMANDEZ UN DEVIS GRATUIT',
  'step1.title': 'Choisissez votre excursion',
  'step1.intro': 'Excursions privées en bateau le long de la Riviera italienne : dites-nous ce que vous souhaitez et nous vous répondrons avec un devis sur mesure.',
  'card.price': 'PRIX',
  'card.onRequest': 'Sur demande',
  'card.privateFlexible': 'Privé · Itinéraire flexible',
  'card.checkPrice': 'VOIR LE PRIX →',
  'step1.faqQuestion': 'Des questions avant de réserver ?',
  'step1.faqLink': 'LIRE LA FAQ →',

  // --- passo 2: data, orario, ospiti ---
  'step2.changeTour': "← CHANGER D'EXCURSION",
  'step2.noticeStrong': 'Il s’agit d’une demande de disponibilité.',
  'step2.noticeText': ' Aucun paiement n’est demandé. Le capitaine Marco vous recontactera sous 24 heures pour confirmer et vous envoyer un devis sur mesure.',
  'step2.flexibleTime': (time) => ` (~${time}, flexible)`,
  'step2.guestsRange': (max) => `1 à ${max} personnes`,
  'step2.itineraryNote': "Ceci est l'itinéraire standard. Il peut varier selon les envies des passagers ou les conditions météo.",
  'step2.included': 'CE QUI EST INCLUS',
  'step2.notIncluded': 'NON INCLUS :',
  'step2.chooseItinerary': 'CHOISISSEZ VOTRE ITINÉRAIRE',
  'step2.selectDate': 'CHOISISSEZ LA DATE',
  'step2.checkingBanner': 'Vérification des disponibilités en cours : merci de patienter avant de choisir une date',
  'step2.weekdays': ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
  'step2.checkingTitle': 'Vérification des disponibilités…',
  'step2.specialPrice': 'Prix spécial disponible',
  'step2.crossedOut': 'BARRÉ = INDISPONIBLE',
  'step2.updating': 'MISE À JOUR DES DISPONIBILITÉS...',
  'step2.upToDate': 'DISPONIBILITÉS À JOUR',
  'step2.localOnly': 'RÉSERVATIONS INTERNES UNIQUEMENT',
  'step2.timeOfDay': 'MOMENT DE LA JOURNÉE',
  'step2.schedule': 'HORAIRE',
  'step2.timeToAgree': 'Horaire à convenir avec le skipper',
  'step2.guests': 'PASSAGERS',
  'step2.max': 'MAX',
  'step2.meetingPoint': 'POINT DE RENDEZ-VOUS',
  'step2.other': 'Autre',
  'step2.otherPlaceholder': 'Indiquez le point de rendez-vous souhaité...',
  'step2.feasibility': 'LE SKIPPER CONFIRMERA LA FAISABILITÉ',
  'step2.continue': 'CONTINUER →',
  'step2.changedMind': 'VOUS HÉSITEZ ENCORE ?',
  'step2.otherTours': 'Découvrez nos autres excursions',
  'step2.viewTour': "VOIR L'EXCURSION →",
  'step2.backToAll': '← TOUTES LES EXCURSIONS',

  // --- passo 3: dati del cliente ---
  'step3.back': '← RETOUR',
  'step3.kicker': 'DERNIÈRE ÉTAPE : VOS COORDONNÉES',
  'step3.title': 'Où pouvons-nous vous répondre ?',
  'step3.intro': 'Laissez-nous vos coordonnées et nous vous enverrons un devis sur mesure sous 24 heures. Aucun paiement n’est demandé à ce stade.',
  'step3.name': 'NOM ET PRÉNOM *',
  'step3.namePlaceholder': 'Marie Dupont',
  'step3.email': 'E-MAIL *',
  'step3.emailPlaceholder': 'vous@email.com',
  'step3.phone': 'TÉLÉPHONE *',
  'step3.language': 'LANGUE PRÉFÉRÉE',
  'step3.dietary': 'RÉGIME ALIMENTAIRE',
  'step3.allergiesCheck': 'Un ou plusieurs passagers ont des allergies ou intolérances alimentaires',
  'step3.allergiesLabel': 'PRÉCISEZ LES ALLERGIES OU INTOLÉRANCES *',
  'step3.allergiesPlaceholder': 'ex. sans gluten, allergie aux fruits à coque, végétarien, intolérance au lactose...',
  'step3.mobility': 'MOBILITÉ',
  'step3.mobilityCheck': 'Un ou plusieurs passagers sont à mobilité réduite',
  'step3.mobilityLabel': 'MERCI DE PRÉCISER *',
  'step3.mobilityPlaceholder': "ex. fauteuil roulant, difficultés à marcher, besoin d'aide pour monter à bord...",
  'step3.requests': 'DEMANDES PARTICULIÈRES',
  'step3.requestsPlaceholderCustom': 'Décrivez l’itinéraire de vos rêves...',
  'step3.requestsPlaceholder': 'Occasion spéciale, préférences, toute autre demande...',

  // --- riepilogo della richiesta ---
  'recap.title': 'VOTRE DEMANDE',
  'recap.tour': 'Excursion',
  'recap.itinerary': 'Itinéraire',
  'recap.date': 'Date',
  'recap.time': 'Horaire',
  'recap.guests': 'Passagers',
  'recap.meetingPoint': 'Point de rendez-vous',
  'recap.tourBase': "Prix de base de l'excursion",
  'recap.datePrice': 'Prix pour cette date',
  'recap.indicative': 'Prix indicatif',
  'recap.estimateNote': 'Il s’agit d’une estimation. Le prix final sera confirmé par le skipper selon la date, le nombre de passagers et vos demandes : nous vous recontacterons au plus vite.',
  'recap.tailoredNote': 'Pour les excursions sur mesure, le prix final est confirmé par le skipper selon vos demandes.',

  // --- errore di invio ---
  'error.title': "Votre demande n'a pas pu être envoyée",
  'error.spam1': "Notre système n'a pas pu valider votre demande. Vérifiez ",
  'error.carefully': 'attentivement',
  'error.spam2': ' les informations saisies : assurez-vous que votre ',
  'error.phone': 'numéro de téléphone',
  'error.and': ' et votre ',
  'error.emailAddress': 'adresse e-mail',
  'error.spam3': ' sont écrits correctement et en entier, sans faute ni caractère manquant, puis réessayez. Si le problème persiste, contactez-nous directement :',
  'error.generic': 'Contactez-nous directement, nous serons ravis de vous lire :',
  'error.whatsapp': (tour, date) => `Bonjour ! J'ai essayé d'envoyer une demande pour l'excursion ${tour} du ${date} mais quelque chose n'a pas fonctionné. Pouvez-vous m'aider ?`,
  'error.technical': "DÉTAILS TECHNIQUES (pour l'assistance)",

  // --- consensi privacy ---
  'consent.privacy1': "J'ai lu et j'accepte la ",
  'consent.privacyLink': 'Politique de confidentialité',
  'consent.privacy2': ' et je consens au traitement de mes données personnelles pour la gestion de ma demande de réservation. ',
  'consent.health': "Je consens expressément au traitement des données de santé que je fournis (allergies et/ou mobilité réduite), utilisées exclusivement pour garantir ma sécurité et mon confort à bord (art. 9.2.a RGPD). ",

  // --- invio ---
  'step3.submit': 'DEMANDER LE DEVIS',
  'step3.disclaimer': 'Vous ne réservez et ne payez rien pour le moment : nous vous contacterons sous 24 heures pour confirmer la disponibilité et vous envoyer le devis définitif.',
  'step3.signature': 'CAPITAINE MARCO & PAOLA · LA SPEZIA',

  // --- pagina di conferma ---
  'thanks.metaTitle': 'Merci — Demande reçue | Sea Runner',
  'thanks.kicker': 'DEMANDE DE DEVIS REÇUE',
  'thanks.title': 'Merci,',
  'thanks.body1': 'Votre demande a bien été envoyée. Le capitaine Marco et Paola vous répondront sous 24 heures à l’adresse ',
  'thanks.body2': ' avec la confirmation de disponibilité et votre devis sur mesure. ',
  'thanks.noPayment': 'Aucun paiement n’est demandé à ce stade.',
  'thanks.reachUs': 'BESOIN DE NOUS JOINDRE DIRECTEMENT ?',
  'thanks.or': 'ou',
  'thanks.yourRequest': 'VOTRE DEMANDE',
  'thanks.date': 'Date : ',
  'thanks.time': 'Horaire : ',
  'thanks.guests': 'Passagers : ',
  'thanks.meeting': 'Rendez-vous : ',
  'thanks.newBooking': 'NOUVELLE DEMANDE',
  'thanks.moreQuestions': "D'autres questions ? N'hésitez pas à nous écrire.",
  'thanks.whatsapp': (tour, date) => `Bonjour ! Je viens d'envoyer une demande pour l'excursion ${tour} du ${date}. J'ai une question...`,
  'thanks.whatsappButton': 'ÉCRIVEZ-NOUS SUR WHATSAPP',

  // --- FAQ ---
  'faq.kicker': 'BON À SAVOIR',
  'faq.title': 'Questions fréquentes',
  'faq.items': [
    {
      q: 'Les repas et les boissons sont-ils inclus à bord ?',
      a: `Oui. Chaque excursion comprend un open bar et un apéritif italien léger. Pour les excursions à la journée (Cinque Terre, Golfe des Poètes, Portofino), nous servons aussi un déjeuner italien léger à bord. Si vous avez des allergies ou des préférences alimentaires, prévenez-nous à l'avance et nous adapterons tout pour vous.`
    },
    {
      q: 'Que se passe-t-il en cas de mauvais temps ?',
      a: `Votre sécurité passe toujours en premier. Le capitaine Marco suit la météo de très près et décide si les conditions permettent de sortir. Si la mer n'est pas sûre pour l'excursion, nous la reportons à une autre date de votre choix ou nous vous remboursons intégralement. Aucune pénalité, aucun stress.`
    },
    {
      q: 'Les enfants et les personnes âgées peuvent-ils monter à bord ?',
      a: `Bien sûr. Notre bateau est adapté aux familles, sûr et confortable. Des gilets de sauvetage pour enfants sont à bord, la plateforme de bain permet d'entrer et sortir de l'eau facilement, et des zones d'ombre sont prévues pour les heures les plus chaudes de la journée.`
    },
    {
      q: "L'excursion est-elle vraiment privée ? D'autres passagers peuvent-ils se joindre à nous ?",
      a: `Oui, elle est 100 % privée. Seuls vous et les personnes que vous choisissez d'emmener serez à bord : jamais d'inconnus, jamais d'excursion partagée. C'est votre journée en mer, à votre rythme.`
    },
    {
      q: "Peut-on personnaliser l'itinéraire ?",
      a: `Oui. Chaque excursion suit un parcours standard, mais le capitaine Marco l'adapte à l'état de la mer et à vos envies. Envie de rester plus longtemps dans une crique pour vous baigner ? De vous attarder dans un village ? De sauter une étape ? Dites-le-nous simplement : nous construisons la journée autour de vous.`
    },
    {
      q: "Faut-il avoir de l'expérience en navigation ?",
      a: `Pas du tout. Nos excursions conviennent à tous, de ceux qui montent sur un bateau pour la première fois aux amoureux de la mer les plus expérimentés. Le capitaine Marco a son permis bateau depuis plus de 30 ans et gère chaque situation avec professionnalisme, pour que vous puissiez vous détendre et profiter de la journée en toute sérénité.`
    },
    {
      q: 'Êtes-vous autorisés à naviguer dans le parc marin des Cinque Terre ? Le bateau est-il entièrement équipé pour la sécurité ?',
      a: `Oui, et oui. Nous disposons de toutes les autorisations officielles pour naviguer et mouiller dans l'Aire marine protégée des Cinque Terre. Le bateau est entièrement équipé de matériel de sécurité professionnel : AIS (système de suivi en temps réel), signaux de détresse, gilets de sauvetage pour tous les passagers, trousse de premiers secours et tout l'équipement obligatoire, contrôlé régulièrement et toujours à jour.`
    },
    {
      q: 'Peut-on apporter nos propres boissons et aliments à bord ?',
      a: `Oui. En plus de ce que nous servons à bord, vous pouvez apporter votre bouteille de vin ou de champagne, un gâteau d'anniversaire ou tout ce qui rendra la journée vraiment la vôtre. Prévenez-nous simplement à l'avance pour que nous puissions tout préparer au mieux.`
    },
    {
      q: 'Pouvez-vous organiser la journée pour une occasion spéciale ?',
      a: `Bien sûr. De nombreux passagers nous choisissent pour une demande en mariage, un voyage de noces, un anniversaire de mariage ou un anniversaire : une journée en mer est le cadre idéal pour des moments inoubliables. Dites-nous ce que vous imaginez et nous nous occupons des détails : fleurs, décoration, gâteau, musique ou un moment rien qu'à vous au coucher du soleil.`
    },
    {
      q: 'Y a-t-il un nombre minimum de passagers ?',
      a: `Aucun minimum. L'excursion est entièrement privée, que vous soyez 2 ou 8. Pour un couple, un bateau privé est l'une des façons les plus intimes de découvrir la côte : rien que vous deux, la mer et la Riviera italienne.`
    },
    {
      q: 'Peut-on venir avec notre chien ?',
      a: `Oui, les chiens sont les bienvenus à bord. Si vous voyagez avec votre compagnon à quatre pattes, prévenez-nous à l'avance pour que tout soit prêt pour son confort aussi.`
    }
  ],

  // --- social ---
  'social.kicker': 'SUIVEZ LE VOYAGE',
  'social.title': 'Chaque jour, un aperçu de la Riviera',
  'social.text': 'Couchers de soleil, criques cachées et coulisses de nos journées en mer. Suivez-nous pour découvrir où Sea Runner naviguera la prochaine fois.',

  // --- home ---
  'home.seoTitle': 'Excursions privées en bateau Cinque Terre, Portofino et La Spezia',
  'home.seoDescription': 'Excursions privées en bateau le long de la Riviera italienne avec le capitaine Marco et Paola. Cinque Terre, Portofino, Golfe des Poètes : bateau rien que pour vous, itinéraire sur mesure. Départs de La Spezia.',
  'home.schemaDescription': 'Excursions privées en bateau au départ de La Spezia le long de la Riviera italienne. Cinque Terre, Portofino, Portovenere et le Golfe des Poètes à bord de notre Cap Camarat 9.0 WA primé, avec le capitaine Marco et Paola : bateau entièrement privatisé, jamais partagé. Départs de Porto Mirabello.',
  'home.heroKicker': 'LA SPEZIA · RIVIERA ITALIENNE',
  'home.heroTitle': 'Excursions privées en bateau sur la',
  'home.heroTitleScript': 'riviera italienne',
  'home.heroText': 'Cinque Terre, Golfe des Poètes, Portofino. Des journées en mer exclusives avec le capitaine Marco et Paola.',
  'home.ctaQuote': 'DEMANDER UN DEVIS',
  'home.ctaBoat': 'DÉCOUVRIR LE BATEAU',
  'home.scroll': 'DÉFILER',
  'home.storyKicker': 'NOTRE HISTOIRE',
  'home.storyTitle': 'Une autre façon de découvrir la Ligurie',
  'home.storyText1': "Le capitaine Marco et Paola vous accueillent à bord pour une expérience entièrement privée. Pas de foule, pas d'horaires fixes. Juste vous et ceux que vous aimez, avec la côte qui se dévoile à votre rythme.",
  'home.storyText2': "Baignade dans des criques cachées où les grands bateaux ne vont jamais. Snorkeling guidé dans la réserve marine. Un déjeuner italien léger à bord avec du vin local, pendant que les villages colorés défilent devant vous. Chaque journée en mer est pensée pour vous.",
  'home.reviewsKicker': 'APPRÉCIÉS PAR NOS PASSAGERS',
  'home.reviewsTitle': 'Très bien notés sur le web',
  'home.reviewsText': 'Ne nous croyez pas sur parole : lisez ce que des passagers du monde entier racontent de leur journée en mer avec nous.',
  'home.readOnGoogle': 'Lire sur Google',
  'home.readOnTripadvisor': 'Lire sur TripAdvisor',
  'home.toursKicker': 'EXPÉRIENCES EXCLUSIVES',
  'home.toursTitle': 'Choisissez votre excursion',
  'home.viewAllTours': 'VOIR TOUTES LES EXCURSIONS →',
  'home.boatImageAlt': "Le bateau privé Sea Runner devant le phare de l'île du Tino, côte des Cinque Terre",
  'home.boatKicker': 'LE BATEAU',
  'home.boatText': "Le silence au mouillage grâce à l'énergie solaire. Une navigation douce grâce à un système de flaps intelligent. Taud de soleil extensible, toilettes à bord et tout le nécessaire pour une journée entière de plaisir.",
  'home.boatCta': 'DÉCOUVRIR LE BATEAU →',
  'home.contactKicker': 'CONTACT',
  'home.contactTitle': 'Des questions avant de réserver ?',
  'home.contactText': 'Marco et Paola vous répondent personnellement, dans les plus brefs délais.',

  // --- pagina della barca ---
  'boat.seoTitle': 'Le bateau — Cap Camarat 9.0 WA, yacht primé pour excursions privées',
  'boat.seoDescription': 'Découvrez le Cap Camarat 9.0 WA de Sea Runner : silence grâce au solaire, navigation douce, bimini extensible, toilettes à bord. Le bateau primé de nos excursions privées aux Cinque Terre et à Portofino.',
  'boat.breadcrumb': 'Le bateau',
  'boat.kicker': 'LE BATEAU',
  'boat.awards': "Bateau de l'année · plusieurs prix",
  'boat.intro': 'Un bateau primé, choisi pour une seule raison : vous faire vivre la mer sous son meilleur jour.',
  'boat.specGuestsValue': "jusqu'à 8",
  'boat.specGuestsLabel': 'PASSAGERS',
  'boat.specGuestsNote': '+ équipage',
  'boat.specBathValue': 'Toilettes',
  'boat.specBathLabel': 'À BORD',
  'boat.specBiminiValue': 'Bimini',
  'boat.specBiminiLabel': 'EXTENSIBLE',
  'boat.silenceKicker': 'SILENCE AU MOUILLAGE',
  'boat.silenceTitle': 'Seulement le bruit de la mer',
  'boat.silenceText': "Des panneaux solaires alimentent nos deux réfrigérateurs toute la journée, même au mouillage, sans bruit de générateur et sans émissions. Moteurs coupés, la seule bande-son est celle de l'eau.",
  'boat.cruisingKicker': 'NAVIGATION EN DOUCEUR',
  'boat.cruisingTitle': 'Stable sur chaque vague',
  'boat.cruisingText': "Un système de flaps intelligent ajuste l'assiette en temps réel et adoucit chaque mouvement. Deux moteurs Yamaha de 225 ch offrent la puissance quand il le faut, sans jamais vous presser.",
  'boat.shadeKicker': "DE L'OMBRE QUAND VOUS VOULEZ",
  'boat.shadeTitle': 'Soleil ou ombre, à vous de choisir',
  'boat.shadeText': 'Un bimini extensible couvre tout le pont arrière quand le soleil tape le plus fort, et se replie en quelques secondes quand vous voulez sentir la brise et la lumière sur votre peau.',
  'boat.comfortKicker': 'TOUT LE NÉCESSAIRE',
  'boat.comfortTitle': 'Une vraie maison sur la mer',
  'boat.comfortText': "Toilettes privées à bord, douche d'eau douce, chaîne Fusion bluetooth pour l'ambiance, grande plateforme de bain, réfrigérateurs toujours remplis. Rien ne manque pour une journée entière de plaisir.",
  'boat.layoutKicker': 'PLAN DU BATEAU',
  'boat.layoutTitle': "L'organisation du bateau",
  'boat.layoutComingSoon': 'PLAN BIENTÔT DISPONIBLE',
  'boat.layoutAlt': 'Cap Camarat 9.0 WA Sea Runner — plan et aménagement du bateau',
  'boat.layoutCredit': 'Plan officiel Jeanneau',
  'boat.ctaText': 'Envie de connaître les prix et les disponibilités ?',
  'boat.ctaButton': 'DEMANDER UN DEVIS →',
  'boat.photosComingSoon': 'PHOTOS DU BATEAU BIENTÔT DISPONIBLES',
  'boat.photoAlts': [
    "Le bateau privé Sea Runner devant le phare de l'île du Tino, Cinque Terre",
    'Le Cap Camarat 9.0 WA de Sea Runner naviguant le long de la Riviera italienne',
    'Le bateau Sea Runner vu du ciel dans le Golfe des Poètes',
    'Les toilettes à bord du Cap Camarat 9.0 WA de Sea Runner',
    "Réfrigérateur alimenté à l'énergie solaire à bord de Sea Runner",
    'Apéritif au coucher du soleil à la table de Sea Runner pendant une excursion privée',
  ],
  'boat.photoFallbackAlt': (n) => `Photo du bateau Sea Runner ${n}`,
  'boat.prevPhoto': 'Photo précédente',
  'boat.nextPhoto': 'Photo suivante',
  'boat.goToPhoto': (n) => `Aller à la photo ${n}`,

  // --- banner cookie ---
  'cookie.short': "Nous utilisons des cookies analytiques (Google Analytics) uniquement avec votre accord. ",
  'cookie.long1': "Nous utilisons des cookies techniques nécessaires au fonctionnement du site et, uniquement avec votre accord, des cookies analytiques (Google Analytics) pour comprendre comment le site est utilisé et l'améliorer. Tous les détails dans notre ",
  'cookie.long2': '.',
  'cookie.privacyLink': 'Politique de confidentialité',
  'cookie.decline': 'REFUSER',
  'cookie.accept': 'ACCEPTER',

  // --- pagina non trovata ---
  'notFound.metaTitle': 'Page introuvable | Sea Runner',
  'notFound.title': 'Page introuvable',
  'notFound.text': "La page que vous cherchez n'existe pas. Découvrez plutôt nos excursions privées en bateau.",
  'notFound.home': 'ACCUEIL',
  'notFound.tours': 'NOS EXCURSIONS',

  // ============ TOUR ============
  tours: {
    'cinque-terre': {
      name: 'Cinque Terre',
      subtitle: 'Excursion à la journée',
      duration: '7 heures',
      h1: 'Excursion privée en bateau aux Cinque Terre (journée complète)',
      seoName: 'aux Cinque Terre',
      shortDesc: 'Les cinq villages depuis la mer. Baignade, snorkeling, déjeuner italien à bord.',
      longDesc: "Longez toute la côte classée à l'UNESCO, devant Riomaggiore, Manarola, Corniglia, Vernazza et Monterosso. Baignade dans des criques cachées, snorkeling dans la réserve marine et déjeuner italien léger à bord, pendant que les villages colorés défilent sous vos yeux.",
      itinerary: [
        { place: 'Point de rendez-vous', note: 'Le point que vous avez choisi • Départ' },
        { place: 'Portovenere', note: 'Passage panoramique devant le village' },
        { place: 'Monasteroli — Campiglia', note: 'Côte sauvage et arrêt baignade' },
        { place: 'Riomaggiore', note: 'Le premier des cinq villages' },
        { place: 'Manarola', note: 'Snorkeling dans une eau cristalline' },
        { place: 'Corniglia', note: 'Le village perché vu de la mer' },
        { place: 'Vernazza', note: 'Pause déjeuner • Temps libre à terre' },
        { place: 'Monterosso', note: 'Temps libre à terre • Dernière étape' },
        { place: 'Retour', note: 'Retour au point de rendez-vous choisi' }
      ],
      itineraryFootnote: 'Environ 7 heures • Horaires flexibles',
      includes: ['Déjeuner italien léger', 'Open bar', 'Hôtesse multilingue', 'Carburant et skipper', 'Parking privé', 'Serviettes et équipement']
    },
    'golfo-poeti': {
      name: 'Golfe des Poètes',
      subtitle: 'Excursion à la journée',
      duration: '7 heures',
      h1: 'Excursion privée en bateau dans le Golfe des Poètes (journée complète)',
      seoName: 'dans le Golfe des Poètes',
      shortDesc: "Le golfe de Byron. Portovenere, l'île Palmaria, Lerici et la secrète Tellaro.",
      longDesc: "Partez à la découverte du golfe qui a enchanté Byron et Shelley. Portovenere la médiévale, les îles sauvages de Palmaria et du Tino, l'élégante Lerici et le joyau caché de Tellaro, avec des arrêts baignade et un déjeuner léger à bord.",
      itinerary: [
        { place: 'Point de rendez-vous', note: 'Le point que vous avez choisi • Départ' },
        { place: 'Portovenere', note: "Village classé à l'UNESCO • Temps libre à terre" },
        { place: 'Palmaria', note: 'Grotte Bleue • Snorkeling' },
        { place: 'Tino', note: "L'île de l'ancien monastère" },
        { place: 'Tinetto', note: "Tour panoramique de l'îlot" },
        { place: 'San Terenzo', note: 'Charmant village de bord de mer' },
        { place: 'Lerici', note: 'Pause déjeuner • Vue sur le château' },
        { place: 'Tellaro', note: 'Le joyau caché du Golfe' },
        { place: 'Retour', note: 'Retour au point de rendez-vous choisi' }
      ],
      itineraryFootnote: 'Environ 7 heures • Horaires flexibles',
      includes: ['Déjeuner italien léger', 'Open bar', 'Hôtesse multilingue', 'Carburant et skipper', 'Parking privé', 'Serviettes et équipement']
    },
    'portofino': {
      name: 'Portofino',
      subtitle: 'San Fruttuoso et Cinque Terre',
      duration: '10 heures',
      h1: 'Excursion privée en bateau à Portofino (journée complète)',
      seoName: 'à Portofino',
      shortDesc: "Toute la Riviera. Portofino, l'abbaye de San Fruttuoso et les Cinque Terre au retour.",
      longDesc: "Une longue journée le long de la Riviera du Levant jusqu'au port le plus célèbre d'Italie. Escale à l'abbaye médiévale de San Fruttuoso, arrêt à Portofino avec temps libre à terre, snorkeling dans l'Aire marine protégée, puis navigation devant les Cinque Terre sur le chemin du retour.",
      itinerary: [
        { place: 'Point de rendez-vous', note: 'Le point que vous avez choisi • Départ' },
        { place: 'Côte ligure', note: 'Navigation panoramique le long de la riviera' },
        { place: 'San Fruttuoso', note: "Escale • Visite de l'abbaye et baignade" },
        { place: 'Portofino', note: 'Escale • Temps libre et déjeuner au restaurant' },
        { place: 'Réserve marine', note: 'Snorkeling dans une eau cristalline' },
        { place: 'Cinque Terre', note: 'Navigation au coucher du soleil le long de la côte' },
        { place: 'Retour', note: 'Retour au point de rendez-vous choisi' }
      ],
      itineraryFootnote: 'Environ 10 heures • Déjeuner au restaurant non inclus',
      includes: ['Déjeuner léger à bord', 'Open bar', 'Hôtesse multilingue', 'Carburant et skipper', 'Parking privé', 'Serviettes et équipement']
    },
    'half-day-choice': {
      name: 'Demi-journée',
      subtitle: 'Cinque Terre ou Golfe des Poètes',
      duration: '4 heures',
      h1: 'Excursion privée en bateau à la demi-journée : Cinque Terre ou Golfe des Poètes',
      seoName: 'à la demi-journée',
      shortDesc: 'Choisissez votre côte et votre moment : matin, après-midi ou soir.',
      longDesc: "Une escapade plus courte, avec la même magie. Choisissez entre le parcours des Cinque Terre et le Golfe des Poètes, puis la lumière que vous préférez : la fraîcheur du matin, le soleil de l'après-midi ou l'heure dorée du soir.",
      itineraryOptions: {
        cinque: {
          name: 'Cinque Terre',
          itinerary: [
            { place: 'Point de rendez-vous', note: 'Le point que vous avez choisi • Départ' },
            { place: 'Portovenere', note: 'Passage panoramique devant le village' },
            { place: 'Riomaggiore', note: 'Le premier des cinq villages' },
            { place: 'Manarola', note: 'Snorkeling dans une eau cristalline' },
            { place: 'Vernazza', note: 'Temps libre à terre • Dernière étape' },
            { place: 'Retour', note: 'Retour au point de rendez-vous choisi' }
          ]
        },
        golfo: {
          name: 'Golfe des Poètes',
          itinerary: [
            { place: 'Point de rendez-vous', note: 'Le point que vous avez choisi • Départ' },
            { place: 'Portovenere', note: "Village classé à l'UNESCO • Temps libre à terre" },
            { place: 'Palmaria', note: 'Grotte Bleue • Snorkeling' },
            { place: 'Lerici', note: 'Vue sur le château • Temps libre à terre' },
            { place: 'Tellaro', note: 'Joyau caché • Dernière étape' },
            { place: 'Retour', note: 'Retour au point de rendez-vous choisi' }
          ]
        }
      },
      itineraryFootnote: 'Environ 4 heures • Horaires flexibles',
      timeOfDay: {
        morning: { label: 'Matin' },
        afternoon: { label: 'Après-midi' },
        evening: { label: 'Soir' }
      },
      includes: ['Apéritif italien', 'Open bar', 'Hôtesse multilingue', 'Carburant et skipper', 'Parking privé', 'Serviettes']
    },
    'sunset': {
      name: 'Coucher de soleil',
      subtitle: "Apéritif à l'heure dorée",
      duration: '3 h 30',
      h1: 'Excursion privée en bateau au coucher du soleil',
      seoName: 'au coucher du soleil',
      shortDesc: "L'apéritif en mer pendant que la côte se teinte d'ambre et de rose.",
      longDesc: "La façon la plus romantique de terminer la journée. Naviguez dans le Golfe des Poètes pendant que le soleil disparaît derrière Palmaria, savourez un apéritif ligure avec des vins locaux, et laissez les couleurs faire le reste.",
      itineraryOptions: {
        cinque: {
          name: 'Cinque Terre au coucher du soleil',
          itinerary: [
            { place: 'Point de rendez-vous', note: 'Le point que vous avez choisi • Départ' },
            { place: 'Portovenere', note: "Premiers reflets de l'heure dorée" },
            { place: 'Riomaggiore', note: 'Coucher de soleil sur les falaises' },
            { place: 'Manarola', note: 'Apéritif • Dernière étape' },
            { place: 'Retour', note: 'Retour au point de rendez-vous choisi' }
          ]
        },
        golfo: {
          name: 'Golfe des Poètes au coucher du soleil',
          itinerary: [
            { place: 'Point de rendez-vous', note: 'Le point que vous avez choisi • Départ' },
            { place: 'Portovenere', note: 'Le front de mer médiéval au crépuscule' },
            { place: 'Palmaria', note: "Le soleil qui disparaît derrière l'île" },
            { place: 'Lerici', note: 'Apéritif avec vue sur le château' },
            { place: 'Retour', note: 'Retour au point de rendez-vous choisi' }
          ]
        }
      },
      itineraryFootnote: 'Environ 3 h 30 • Horaires flexibles',
      includes: ['Apéritif italien', 'Open bar avec vins locaux', 'Hôtesse multilingue', 'Carburant et skipper', 'Parking privé', 'Serviettes']
    },
    'custom': {
      name: 'Sur mesure',
      subtitle: 'Votre journée, à votre façon',
      duration: 'Flexible',
      h1: 'Excursion privée en bateau sur mesure',
      seoName: 'sur mesure',
      shortDesc: 'Votre propre itinéraire. Marco et Paola imaginent pour vous la journée en mer idéale.',
      longDesc: 'Choisissez les destinations, la durée et les activités. Le capitaine Marco et Paola organiseront la journée idéale selon vos envies.',
      includes: ['Tout sur mesure pour vous']
    }
  },
};

export default fr;
