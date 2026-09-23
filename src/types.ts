export interface GuestStay {
  id: string;
  name: string;
  checkInDate: string;
  checkOutDate: string;
  checkInTime: string;
  checkOutTime: string;
  welcomeMessage?: string;
  specialNote?: string;
  isVip?: boolean;
  status: 'active' | 'upcoming' | 'past';
  numberOfGuests?: number;
}

export interface HouseGuideItem {
  id: string;
  title: string;
  category: 'checkin' | 'equipment' | 'rules' | 'checkout';
  icon: string;
  summary: string;
  details: string;
}

export interface RecommendationItem {
  id: string;
  name: string;
  category: 'restaurant' | 'bakery' | 'cafe' | 'supermarket' | 'visit' | 'pharmacy';
  distance: string;
  address: string;
  description: string;
  tip?: string;
}

export interface PropertyContact {
  hostName: string;
  role: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  emergencyDoctor: string;
  emergencyPharmacy: string;
}

export interface Property {
  id: string;
  name: string;
  slug: string;
  type: 'Appartement' | 'Villa' | 'Maison' | 'Chalet' | 'Loft' | 'Studio';
  address: string;
  city: string;
  weatherCity: string;
  ambientTheme: 'haussmann' | 'chalet' | 'riviera' | 'minimal' | 'botanic';
  backgroundImage: string;
  pairingCode: string;
  doorCode: string;
  wifi: {
    ssid: string;
    password: string;
    security: 'WPA' | 'WEP' | 'nopass';
  };
  currentStay: GuestStay;
  upcomingStays: GuestStay[];
  guide: HouseGuideItem[];
  recommendations: RecommendationItem[];
  contacts: PropertyContact;
  updatedAt: string;
}

export type TVTab = 'welcome' | 'wifi' | 'guide' | 'places' | 'contacts';
