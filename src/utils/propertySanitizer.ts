import { Property, GuestStay, HouseGuideItem, RecommendationItem, PropertyContact } from '../types';
import { DEFAULT_PROPERTIES } from '../data/defaultProperties';

const fallbackProp = DEFAULT_PROPERTIES[0];

export function sanitizeProperty(input: unknown): Property {
  const p = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;

  const defaultStay: GuestStay = {
    id: 'stay-default',
    name: 'Voyageur VIP',
    checkInDate: '2026-09-22',
    checkOutDate: '2026-09-30',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    welcomeMessage: 'Bienvenue chez vous.',
    specialNote: '',
    isVip: true,
    status: 'active',
    numberOfGuests: 2,
  };

  const rawStay = (p.currentStay && typeof p.currentStay === 'object' ? p.currentStay : {}) as Record<string, unknown>;
  const currentStay: GuestStay = {
    id: typeof rawStay.id === 'string' ? rawStay.id : defaultStay.id,
    name: typeof rawStay.name === 'string' ? rawStay.name : defaultStay.name,
    checkInDate: typeof rawStay.checkInDate === 'string' ? rawStay.checkInDate : defaultStay.checkInDate,
    checkOutDate: typeof rawStay.checkOutDate === 'string' ? rawStay.checkOutDate : defaultStay.checkOutDate,
    checkInTime: typeof rawStay.checkInTime === 'string' ? rawStay.checkInTime : defaultStay.checkInTime,
    checkOutTime: typeof rawStay.checkOutTime === 'string' ? rawStay.checkOutTime : defaultStay.checkOutTime,
    welcomeMessage: typeof rawStay.welcomeMessage === 'string' ? rawStay.welcomeMessage : defaultStay.welcomeMessage,
    specialNote: typeof rawStay.specialNote === 'string' ? rawStay.specialNote : '',
    isVip: typeof rawStay.isVip === 'boolean' ? rawStay.isVip : true,
    status: (rawStay.status === 'upcoming' || rawStay.status === 'past') ? rawStay.status : 'active',
    numberOfGuests: typeof rawStay.numberOfGuests === 'number' ? rawStay.numberOfGuests : 2,
  };

  const rawWifi = (p.wifi && typeof p.wifi === 'object' ? p.wifi : {}) as Record<string, unknown>;
  const rawSecurity = rawWifi.security;
  const security: 'WPA' | 'WEP' | 'nopass' = 
    rawSecurity === 'WEP' || rawSecurity === 'nopass' || rawSecurity === 'WPA' 
      ? rawSecurity 
      : 'WPA';

  const wifi = {
    ssid: typeof rawWifi.ssid === 'string' ? rawWifi.ssid : fallbackProp.wifi.ssid,
    password: typeof rawWifi.password === 'string' ? rawWifi.password : fallbackProp.wifi.password,
    security,
  };

  const rawContacts = (p.contacts && typeof p.contacts === 'object' ? p.contacts : {}) as Record<string, unknown>;
  const contacts: PropertyContact = {
    hostName: typeof rawContacts.hostName === 'string' ? rawContacts.hostName : fallbackProp.contacts.hostName,
    role: typeof rawContacts.role === 'string' ? rawContacts.role : fallbackProp.contacts.role,
    phone: typeof rawContacts.phone === 'string' ? rawContacts.phone : fallbackProp.contacts.phone,
    whatsappNumber: typeof rawContacts.whatsappNumber === 'string' ? rawContacts.whatsappNumber : fallbackProp.contacts.whatsappNumber,
    email: typeof rawContacts.email === 'string' ? rawContacts.email : fallbackProp.contacts.email,
    emergencyDoctor: typeof rawContacts.emergencyDoctor === 'string' ? rawContacts.emergencyDoctor : fallbackProp.contacts.emergencyDoctor,
    emergencyPharmacy: typeof rawContacts.emergencyPharmacy === 'string' ? rawContacts.emergencyPharmacy : fallbackProp.contacts.emergencyPharmacy,
  };

  const upcomingStays: GuestStay[] = Array.isArray(p.upcomingStays)
    ? (p.upcomingStays as unknown[]).filter(s => s && typeof s === 'object') as GuestStay[]
    : (fallbackProp.upcomingStays || []);

  const guide: HouseGuideItem[] = Array.isArray(p.guide)
    ? (p.guide as unknown[]).filter(g => g && typeof g === 'object') as HouseGuideItem[]
    : (fallbackProp.guide || []);

  const recommendations: RecommendationItem[] = Array.isArray(p.recommendations)
    ? (p.recommendations as unknown[]).filter(r => r && typeof r === 'object') as RecommendationItem[]
    : (fallbackProp.recommendations || []);

  return {
    id: typeof p.id === 'string' && p.id ? p.id : fallbackProp.id,
    name: typeof p.name === 'string' && p.name ? p.name : fallbackProp.name,
    slug: typeof p.slug === 'string' && p.slug ? p.slug : fallbackProp.slug,
    type: (p.type as Property['type']) || fallbackProp.type,
    address: typeof p.address === 'string' ? p.address : fallbackProp.address,
    city: typeof p.city === 'string' ? p.city : fallbackProp.city,
    weatherCity: typeof p.weatherCity === 'string' ? p.weatherCity : fallbackProp.weatherCity,
    ambientTheme: (p.ambientTheme as Property['ambientTheme']) || fallbackProp.ambientTheme,
    backgroundImage: typeof p.backgroundImage === 'string' && p.backgroundImage ? p.backgroundImage : fallbackProp.backgroundImage,
    pairingCode: typeof p.pairingCode === 'string' ? p.pairingCode : fallbackProp.pairingCode,
    doorCode: typeof p.doorCode === 'string' ? p.doorCode : fallbackProp.doorCode,
    wifi,
    currentStay,
    upcomingStays,
    guide,
    recommendations,
    contacts,
    updatedAt: typeof p.updatedAt === 'string' ? p.updatedAt : new Date().toISOString(),
  };
}

export function sanitizeProperties(input: unknown): Property[] {
  if (!Array.isArray(input) || input.length === 0) {
    return DEFAULT_PROPERTIES;
  }
  return input.map(sanitizeProperty);
}
