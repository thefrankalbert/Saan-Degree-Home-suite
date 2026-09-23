import { Property } from '../types';

export const DEFAULT_PROPERTIES: Property[] = [
  {
    id: 'saan-genesis-ouaga-2000',
    name: 'Sãan Degree · Genesis',
    slug: 'saan-degree-genesis',
    type: 'Appartement',
    address: 'Avenue Pascal Zagré, Secteur 15, Ouaga 2000',
    city: 'Ouagadougou',
    weatherCity: 'Ouagadougou',
    ambientTheme: 'haussmann',
    backgroundImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80',
    pairingCode: 'GENESIS-2000',
    doorCode: 'Poste Garde 24h/24',
    wifi: {
      ssid: 'Saan_Genesis_Fiber_5G',
      password: 'SaanGenesis2026!',
      security: 'WPA'
    },
    currentStay: {
      id: 'stay-saan-001',
      name: 'Monsieur et Madame Sanon',
      checkInDate: '2026-09-22',
      checkOutDate: '2026-09-27',
      checkInTime: '14:00',
      checkOutTime: '12:00',
      welcomeMessage: 'Soyez les bienvenus chez Sãan Degree dans votre appartement Genesis à Ouaga 2000. Nous vous souhaitons un séjour agréable et serein.',
      specialNote: 'Eau minérale fraîche et corbeille de bienvenue disposées dans le salon.',
      isVip: true,
      status: 'active',
      numberOfGuests: 2
    },
    upcomingStays: [
      {
        id: 'stay-saan-002',
        name: 'Délégation Ambassade & Partenaires',
        checkInDate: '2026-09-28',
        checkOutDate: '2026-10-05',
        checkInTime: '15:00',
        checkOutTime: '12:00',
        welcomeMessage: 'Bienvenue à Ouagadougou pour votre mission institutionnelle.',
        status: 'upcoming',
        numberOfGuests: 3
      },
      {
        id: 'stay-saan-003',
        name: 'Dr. Idrissa Ouédraogo',
        checkInDate: '2026-10-07',
        checkOutDate: '2026-10-12',
        checkInTime: '14:00',
        checkOutTime: '12:00',
        welcomeMessage: 'Excellente escale professionnelle chez Sãan Degree.',
        status: 'upcoming',
        numberOfGuests: 1
      }
    ],
    guide: [
      {
        id: 'sg-1',
        title: 'Climatisation Chambres & Salon',
        category: 'equipment',
        icon: 'Thermometer',
        summary: 'Télécommandes individuelles dans chaque chambre',
        details: 'Pour votre confort optimal, réglez la climatisation entre 22°C et 24°C. Veillez à maintenir les baies vitrées et portes closes lorsque les climatiseurs sont en marche.'
      },
      {
        id: 'sg-2',
        title: 'Sécurité & Gardiennage 24h/24',
        category: 'rules',
        icon: 'Sparkles',
        summary: 'Agent de sécurité présent en permanence au portail',
        details: 'Un agent de sécurité veille sur la résidence jour et nuit. Pour les arrivées tardives ou l’accès au parking sécurisé, signalez-vous simplement à l’entrée.'
      },
      {
        id: 'sg-3',
        title: 'Cuisine Équipée & Machine à laver',
        category: 'equipment',
        icon: 'Coffee',
        summary: 'Électroménager complet & buanderie',
        details: 'Réfrigérateur grand volume, plaque de cuisson, micro-ondes, bouilloire et lave-linge disponible dans la buanderie. Lessive fournie.'
      },
      {
        id: 'sg-4',
        title: 'Service de Ménage & Linge',
        category: 'rules',
        icon: 'Clock',
        summary: 'Ménage régulier inclus dans votre séjour',
        details: 'Le renouvellement du linge de lit et des serviettes est assuré. Si vous souhaitez définir une heure précise pour le passage de l’équipe de ménage, prévenez le concierge.'
      }
    ],
    recommendations: [
      {
        id: 'sr-1',
        name: 'Supermarché Marina Market Ouaga 2000',
        category: 'supermarket',
        distance: '4 min en voiture',
        address: 'Boulevard Muammar Kadhafi, Ouaga 2000',
        description: 'Supermarché haut de gamme complet : produits d’épicerie fine, fruits et légumes frais, boissons, boucherie et boulangerie.',
        tip: 'Très pratique pour faire vos courses dès votre arrivée.'
      },
      {
        id: 'sr-2',
        name: 'Le Bistrot Ouaga 2000',
        category: 'restaurant',
        distance: '5 min en voiture',
        address: 'Quartier Ouaga 2000, près des Ambassades',
        description: 'Table raffinée proposant cuisine française, grillades au feu de bois et spécialités sahéliennes dans un cadre feutré et climatisé.',
        tip: 'Idéal pour vos déjeuners d’affaires ou dîners calmes.'
      },
      {
        id: 'sr-3',
        name: 'Monument des Héros Nationaux',
        category: 'visit',
        distance: '6 min en voiture',
        address: 'Rond-point des Héros, Ouaga 2000',
        description: 'Monument emblématique et majestueux de Ouaga 2000, avec esplanade illuminée en soirée et vue panoramique sur la capitale.',
        tip: 'Superbe balade au coucher du soleil.'
      },
      {
        id: 'sr-4',
        name: 'Pharmacie Ouaga 2000',
        category: 'pharmacy',
        distance: '3 min en voiture',
        address: 'Avenue Pascal Zagré, Ouaga 2000',
        description: 'Pharmacie moderne, climatisée et ouverte avec permanence de garde et produits de soins internationaux.',
        tip: 'Accessible 7j/7 avec service de garde.'
      }
    ],
    contacts: {
      hostName: 'Conciergerie Sãan Degree',
      role: 'Direction Résidence Ouaga 2000',
      phone: '+226 55 21 22 93',
      whatsappNumber: '22655212293',
      email: 'saandegree@gmail.com',
      emergencyDoctor: 'SAMU Ouaga : 15 / Clinique Notre Dame de la Paix : +226 25 37 42 42',
      emergencyPharmacy: 'Pharmacie Ouaga 2000 : +226 25 37 45 45 / Police secours : 17'
    },
    updatedAt: new Date().toISOString()
  },
  {
    id: 'saan-suite-ambassade',
    name: 'Sãan Degree · Suite Diplomatique',
    slug: 'saan-suite-diplomatique',
    type: 'Appartement',
    address: 'Zone des Ambassades, Ouaga 2000',
    city: 'Ouagadougou',
    weatherCity: 'Ouagadougou',
    ambientTheme: 'minimal',
    backgroundImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80',
    pairingCode: 'SAAN-DIPLO',
    doorCode: 'Gardien 24h/24',
    wifi: {
      ssid: 'Saan_Diplomatic_Guest',
      password: 'SaanOuaga2026!',
      security: 'WPA'
    },
    currentStay: {
      id: 'stay-saan-101',
      name: 'Mme Aïssata Traoré',
      checkInDate: '2026-09-20',
      checkOutDate: '2026-09-28',
      checkInTime: '14:00',
      checkOutTime: '12:00',
      welcomeMessage: 'Bienvenue chez Sãan Degree. Nous vous souhaitons un excellent séjour professionnel.',
      specialNote: 'Thé vert et café bio à disposition dans la suite.',
      isVip: true,
      status: 'active',
      numberOfGuests: 2
    },
    upcomingStays: [],
    guide: [
      {
        id: 'sdg-1',
        title: 'Fibre Optique Dédiée',
        category: 'equipment',
        icon: 'Wifi',
        summary: 'Débit symétrique garanti pour visio & streaming',
        details: 'Routeur Wi-Fi 6 dédié dans le salon. Idéal pour vos réunions Zoom, Teams ou transferts de fichiers volumineux.'
      }
    ],
    recommendations: [
      {
        id: 'sdr-1',
        name: 'L’Eau Vive Ouagadougou',
        category: 'restaurant',
        distance: '8 min en voiture',
        address: 'Centre-ville / Ouaga',
        description: 'Restaurant réputé pour son service soigné et sa carte gastronomique internationale.',
        tip: 'Réservation recommandée pour le dîner.'
      }
    ],
    contacts: {
      hostName: 'Conciergerie Sãan Degree',
      role: 'Service Accueil & Réservations',
      phone: '+226 52 33 76 69',
      whatsappNumber: '22652337669',
      email: 'saandegree@gmail.com',
      emergencyDoctor: 'Clinique Frany Ouaga 2000 : +226 25 37 40 40',
      emergencyPharmacy: 'Pharmacie du 2000'
    },
    updatedAt: new Date().toISOString()
  }
];
