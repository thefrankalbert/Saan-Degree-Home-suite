export type AppLanguage = 'fr' | 'en';

export interface Translations {
  welcome: string;
  welcomeSub: string;
  stayInProgress: string;
  checkoutLabel: string;
  departureTime: string;
  accessCode: string;
  doorCodeLabel: string;
  concierge: string;
  instantWifi: string;
  wifiSubtitle: string;
  networkName: string;
  securityKey: string;
  scanCameraTip: string;
  navTabs: {
    welcome: string;
    wifi: string;
    guide: string;
    places: string;
    contacts: string;
  };
  remoteNotice: string;
  mobileCompanion: string;
  mobileCompanionDesc: string;
  specialNoteTitle: string;
  houseGuideTitle: string;
  houseGuideSubtitle: string;
  recommendationsTitle: string;
  recommendationsSubtitle: string;
  contactsTitle: string;
  contactsSubtitle: string;
  whatsappButton: string;
  soundAmbient: string;
  autoPlay: string;
  fullscreen: string;
  dimmerMode: string;
  weatherSunny: string;
  weatherClear: string;
  weatherCloudy: string;
}

export const DICTIONARY: Record<AppLanguage, Translations> = {
  fr: {
    welcome: 'Bienvenue',
    welcomeSub: 'Votre séjour d’exception',
    stayInProgress: 'Résidence Privée',
    checkoutLabel: 'Heure de départ',
    departureTime: 'Départ avant',
    accessCode: 'Sécurité & Accès',
    doorCodeLabel: 'Gardiennage & Accès',
    concierge: 'Conciergerie',
    instantWifi: 'Connexion Wi-Fi Fibre Optique',
    wifiSubtitle: 'Scannez avec l’appareil photo de votre smartphone pour vous connecter',
    networkName: 'Réseau (SSID)',
    securityKey: 'Mot de passe sécurisé',
    scanCameraTip: 'Connexion instantanée sans mot de passe à saisir',
    navTabs: {
      welcome: 'Accueil',
      wifi: 'Wi-Fi & Accès',
      guide: 'Manuel & Équipements',
      places: 'Guide Ouaga 2000',
      contacts: 'Concierge & Assistance'
    },
    remoteNotice: 'Télécommande TV : Flèches [◀ ▶] ou touches [1 à 5]',
    mobileCompanion: 'Livret sur smartphone',
    mobileCompanionDesc: 'Scannez pour emporter ce livret dans votre poche',
    specialNoteTitle: 'Attention particulière de votre hôte',
    houseGuideTitle: 'Manuel de l’Appartement',
    houseGuideSubtitle: 'Équipements et consignes pour un séjour haut standing',
    recommendationsTitle: 'Sélection Ouaga 2000 & Capitale',
    recommendationsSubtitle: 'Les adresses recommandées par Sãan Degree',
    contactsTitle: 'Votre Conciergerie Dédiée',
    contactsSubtitle: 'Une question ou un besoin spécifique pendant votre escale ?',
    whatsappButton: 'Contacter sur WhatsApp',
    soundAmbient: 'Ambiance sonore',
    autoPlay: 'Diaporama',
    fullscreen: 'Plein écran',
    dimmerMode: 'Mode Nuit / Veille',
    weatherSunny: 'Ensoleillé & Ciel Dégagé',
    weatherClear: 'Ciel Dégagé',
    weatherCloudy: 'Agréable & Doux'
  },
  en: {
    welcome: 'Welcome',
    welcomeSub: 'Your private stay',
    stayInProgress: 'Private Residence',
    checkoutLabel: 'Check-out time',
    departureTime: 'Check-out before',
    accessCode: 'Security & Access',
    doorCodeLabel: 'Security & Access',
    concierge: 'Concierge',
    instantWifi: 'High-Speed Optical Fiber Wi-Fi',
    wifiSubtitle: 'Point your smartphone camera to connect automatically',
    networkName: 'Network (SSID)',
    securityKey: 'Security Password',
    scanCameraTip: 'Zero password typing required',
    navTabs: {
      welcome: 'Welcome',
      wifi: 'Wi-Fi & Access',
      guide: 'House Manual',
      places: 'Ouaga 2000 Guide',
      contacts: 'Concierge & Support'
    },
    remoteNotice: 'TV Remote: Use arrows [◀ ▶] or numbers [1 to 5]',
    mobileCompanion: 'Mobile Booklet',
    mobileCompanionDesc: 'Scan to take this guide on your phone',
    specialNoteTitle: 'A personal note from your host',
    houseGuideTitle: 'Apartment Manual & Amenities',
    houseGuideSubtitle: 'Instructions for high-standing comfort',
    recommendationsTitle: 'Ouaga 2000 Neighborhood Guide',
    recommendationsSubtitle: 'Hand-picked dining and essentials by Sãan Degree',
    contactsTitle: 'Your Dedicated Concierge',
    contactsSubtitle: 'Any assistance needed during your stay in Ouagadougou?',
    whatsappButton: 'Chat on WhatsApp',
    soundAmbient: 'Ambient Sound',
    autoPlay: 'Autoplay',
    fullscreen: 'Fullscreen',
    dimmerMode: 'Night Mode',
    weatherSunny: 'Sunny & Clear',
    weatherClear: 'Clear Skies',
    weatherCloudy: 'Pleasant & Warm'
  }
};
