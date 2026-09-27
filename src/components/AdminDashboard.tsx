import React, { useState, useEffect, useCallback } from 'react';
import { 
  Tv, 
  Plus, 
  Wifi, 
  UserCheck, 
  Sparkles, 
  Settings, 
  Smartphone, 
  FileSpreadsheet, 
  MapPin, 
  Phone, 
  KeyRound, 
  Coffee, 
  HelpCircle, 
  Eye, 
  Sliders, 
  ChevronRight, 
  Save, 
  CheckCircle2, 
  Maximize2, 
  Calendar, 
  Compass, 
  Star, 
  ExternalLink, 
  RefreshCw, 
  Lock,
  Database,
  Copy,
  Check,
  AlertCircle
} from 'lucide-react';
import { Property, GuestStay } from '../types';
import { SyncService } from '../utils/syncService';

interface AdminDashboardProps {
  properties: Property[];
  selectedProperty: Property;
  onSelectProperty: (prop: Property) => void;
  onUpdateProperty: (prop: Property) => void;
  onAddProperty: (newProp: Property) => void;
  onOpenTVKiosk: (propId: string) => void;
  onOpenMobileView: (propId: string) => void;
  onOpenSetupGuide: () => void;
  onOpenSheetSync: () => void;
  onOpenTVTester: () => void;
  onLock?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  properties,
  selectedProperty,
  onSelectProperty,
  onUpdateProperty,
  onAddProperty,
  onOpenTVKiosk,
  onOpenMobileView,
  onOpenSetupGuide,
  onOpenSheetSync,
  onOpenTVTester,
  onLock
}) => {
  const [activeTab, setActiveTab] = useState<'guest' | 'wifi' | 'guide' | 'places' | 'theme' | 'contacts'>('guest');
  const [saveToast, setSaveToast] = useState(false);
  const [isNewPropertyModalOpen, setIsNewPropertyModalOpen] = useState(false);

  // Supabase Sync states
  const [supabaseStatus, setSupabaseStatus] = useState<{ configured: boolean; tableReady: boolean; message: string }>({
    configured: true,
    tableReady: false,
    message: 'Vérification...'
  });
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [isCheckingSupabase, setIsCheckingSupabase] = useState(false);

  const checkStatus = useCallback(async () => {
    setIsCheckingSupabase(true);
    const res = await SyncService.checkSupabaseStatus();
    setSupabaseStatus(res);
    setIsCheckingSupabase(false);
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  // Form states
  const [guestName, setGuestName] = useState(selectedProperty.currentStay.name);
  const [checkInDate, setCheckInDate] = useState(selectedProperty.currentStay.checkInDate);
  const [checkOutDate, setCheckOutDate] = useState(selectedProperty.currentStay.checkOutDate);
  const [checkInTime, setCheckInTime] = useState(selectedProperty.currentStay.checkInTime);
  const [checkOutTime, setCheckOutTime] = useState(selectedProperty.currentStay.checkOutTime);
  const [welcomeMessage, setWelcomeMessage] = useState(selectedProperty.currentStay.welcomeMessage || '');
  const [specialNote, setSpecialNote] = useState(selectedProperty.currentStay.specialNote || '');
  const [doorCode, setDoorCode] = useState(selectedProperty.doorCode);

  // Wi-Fi state
  const [wifiSsid, setWifiSsid] = useState(selectedProperty.wifi.ssid);
  const [wifiPassword, setWifiPassword] = useState(selectedProperty.wifi.password);

  // Contacts
  const [hostName, setHostName] = useState(selectedProperty.contacts.hostName);
  const [hostPhone, setHostPhone] = useState(selectedProperty.contacts.phone);
  const [whatsappNumber, setWhatsappNumber] = useState(selectedProperty.contacts.whatsappNumber);
  const [emergencyDoctor, setEmergencyDoctor] = useState(selectedProperty.contacts.emergencyDoctor);

  // Sync inputs on property switch
  React.useEffect(() => {
    setGuestName(selectedProperty.currentStay.name);
    setCheckInDate(selectedProperty.currentStay.checkInDate);
    setCheckOutDate(selectedProperty.currentStay.checkOutDate);
    setCheckInTime(selectedProperty.currentStay.checkInTime);
    setCheckOutTime(selectedProperty.currentStay.checkOutTime);
    setWelcomeMessage(selectedProperty.currentStay.welcomeMessage || '');
    setSpecialNote(selectedProperty.currentStay.specialNote || '');
    setDoorCode(selectedProperty.doorCode);
    setWifiSsid(selectedProperty.wifi.ssid);
    setWifiPassword(selectedProperty.wifi.password);
    setHostName(selectedProperty.contacts.hostName);
    setHostPhone(selectedProperty.contacts.phone);
    setWhatsappNumber(selectedProperty.contacts.whatsappNumber);
    setEmergencyDoctor(selectedProperty.contacts.emergencyDoctor);
  }, [selectedProperty]);

  const handleSaveCurrentStay = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedStay: GuestStay = {
      ...selectedProperty.currentStay,
      name: guestName,
      checkInDate,
      checkOutDate,
      checkInTime,
      checkOutTime,
      welcomeMessage,
      specialNote
    };

    const updatedProp: Property = {
      ...selectedProperty,
      doorCode,
      currentStay: updatedStay,
      wifi: {
        ...selectedProperty.wifi,
        ssid: wifiSsid,
        password: wifiPassword
      },
      contacts: {
        ...selectedProperty.contacts,
        hostName,
        phone: hostPhone,
        whatsappNumber,
        emergencyDoctor
      },
      updatedAt: new Date().toISOString()
    };

    onUpdateProperty(updatedProp);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleActivateUpcomingStay = (stay: GuestStay) => {
    const currentUpcoming = selectedProperty.upcomingStays || [];
    const updatedUpcoming = currentUpcoming.filter(s => s.id !== stay.id);
    const updatedProp: Property = {
      ...selectedProperty,
      currentStay: { ...stay, status: 'active' },
      upcomingStays: [
        ...updatedUpcoming,
        { ...selectedProperty.currentStay, status: 'upcoming' }
      ],
      updatedAt: new Date().toISOString()
    };
    onUpdateProperty(updatedProp);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleThemeChange = (theme: Property['ambientTheme'], bgUrl: string) => {
    const updatedProp: Property = {
      ...selectedProperty,
      ambientTheme: theme,
      backgroundImage: bgUrl,
      updatedAt: new Date().toISOString()
    };
    onUpdateProperty(updatedProp);
  };

  // Add property form state
  const [newPropName, setNewPropName] = useState('');
  const [newPropType, setNewPropType] = useState<Property['type']>('Appartement');
  const [newPropCity, setNewPropCity] = useState('');
  const [newPropAddress, setNewPropAddress] = useState('');

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPropName.trim()) return;

    const newSlug = newPropName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newId = `prop-${Date.now()}`;
    const newProp: Property = {
      id: newId,
      name: newPropName,
      slug: newSlug,
      type: newPropType,
      city: newPropCity || 'Paris',
      weatherCity: newPropCity || 'Paris',
      address: newPropAddress || 'Adresse',
      ambientTheme: 'haussmann',
      backgroundImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80',
      pairingCode: `TV-${Math.floor(100 + Math.random() * 900)}`,
      doorCode: '1234',
      wifi: {
        ssid: `${newPropName.replace(/\s+/g, '')}_Guest`,
        password: 'Welcome2026!',
        security: 'WPA'
      },
      currentStay: {
        id: `stay-${Date.now()}`,
        name: 'M. et Mme Nouveau Voyageur',
        checkInDate: new Date().toISOString().split('T')[0],
        checkOutDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        checkInTime: '15:00',
        checkOutTime: '11:00',
        welcomeMessage: 'Bienvenue dans notre résidence d’exception.',
        isVip: false,
        status: 'active'
      },
      upcomingStays: [],
      guide: [
        {
          id: 'g-def-1',
          title: 'Machine à café',
          category: 'equipment',
          icon: 'Coffee',
          summary: 'Capsules d’origine fournies',
          details: 'Insérer la capsule et appuyer sur le bouton tasse longue.'
        }
      ],
      recommendations: [
        {
          id: 'r-def-1',
          name: 'Boulangerie Artisanale',
          category: 'bakery',
          distance: '2 min à pied',
          address: 'Au bout de la rue',
          description: 'Pains au levain et viennoiseries d’excellence.'
        }
      ],
      contacts: {
        hostName: 'Concierge Privé',
        role: 'Responsable des Séjours',
        phone: '+33 6 00 00 00 00',
        whatsappNumber: '33600000000',
        email: 'concierge@lodgecast.fr',
        emergencyDoctor: '15 (SAMU)',
        emergencyPharmacy: 'Pharmacie la plus proche'
      },
      updatedAt: new Date().toISOString()
    };

    onAddProperty(newProp);
    setIsNewPropertyModalOpen(false);
    setNewPropName('');
    setNewPropCity('');
    setNewPropAddress('');
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-[#e2e8f0] font-sans flex flex-col">
      
      {/* Top Luxury Navbar */}
      <header className="border-b border-white/[0.08] bg-[#0c0e14]/90 backdrop-blur-xl px-6 lg:px-10 py-4 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & Monogram */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-[#c5b392]/30 flex items-center justify-center text-[#c5b392] shadow-sm">
            <span className="font-serif text-lg font-bold italic tracking-wider">SD</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white tracking-wide font-serif-luxury">SÃAN DEGREE</span>
              <span className="text-[10px] px-2 py-0.5 rounded font-medium text-[#c5b392] bg-[#c5b392]/10 border border-[#c5b392]/20">
                Ouaga 2000
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-light">Conciergerie Smart TV & Gestion des Résidences Haut Standing</p>
          </div>
        </div>

        {/* Property Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.08]">
            <span className="text-xs text-slate-400 pl-2 hidden sm:inline font-light">Résidence :</span>
            <select
              value={selectedProperty.id}
              onChange={(e) => {
                const found = properties.find(p => p.id === e.target.value);
                if (found) onSelectProperty(found);
              }}
              className="bg-[#090b10] text-[#c5b392] font-medium text-xs px-3.5 py-1.5 rounded-xl border border-white/[0.08] focus:outline-none cursor-pointer"
            >
              {properties.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.city})
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsNewPropertyModalOpen(true)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition"
              title="Ajouter une nouvelle résidence"
            >
              <Plus className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          
          <button
            onClick={onOpenTVTester}
            className="px-3.5 py-2 text-xs font-medium bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 border border-white/[0.08] rounded-xl flex items-center gap-2 transition"
            title="Tester la compatibilité de votre téléviseur et de votre télécommande"
          >
            <Tv className="w-4 h-4 text-[#c5b392]" strokeWidth={1.5} />
            <span className="hidden lg:inline">Test TV & Télécommande</span>
          </button>

          <button
            onClick={onOpenSheetSync}
            className="px-3.5 py-2 text-xs font-medium bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 border border-white/[0.08] rounded-xl flex items-center gap-2 transition"
            title="Synchroniser avec Google Sheets"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#c5b392]" strokeWidth={1.5} />
            <span className="hidden md:inline">Synchro Tableur</span>
          </button>

          <button
            onClick={onOpenSetupGuide}
            className="px-3.5 py-2 text-xs font-medium bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 border border-white/[0.08] rounded-xl flex items-center gap-2 transition"
            title="Guide d’installation sur Android TV, Fire TV, LG, Samsung"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
            <span className="hidden md:inline">Installer sur TV</span>
          </button>

          <button
            onClick={() => onOpenMobileView(selectedProperty.id)}
            className="px-3.5 py-2 text-xs font-medium bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 border border-white/[0.08] rounded-xl flex items-center gap-2 transition"
            title="Tester la vue smartphone du voyageur"
          >
            <Smartphone className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
            <span className="hidden md:inline">Vue Smartphone</span>
          </button>

          {/* Supabase Realtime Sync Status Button */}
          <button
            onClick={() => setIsSupabaseModalOpen(true)}
            className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 border transition ${
              supabaseStatus.tableReady
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20 animate-pulse'
            }`}
            title="État de la synchronisation Supabase avec la TV"
          >
            <span className={`w-2 h-2 rounded-full ${supabaseStatus.tableReady ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-amber-400'}`} />
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-medium">
              {supabaseStatus.tableReady ? 'Sync TV Directe (Active)' : 'Sync TV : Action Requise'}
            </span>
          </button>

          {onLock && (
            <button
              onClick={onLock}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition"
              title="Verrouiller l’accès Conciergerie"
            >
              <Lock className="w-4 h-4" strokeWidth={1.5} />
            </button>
          )}

          <button
            onClick={() => onOpenTVKiosk(selectedProperty.id)}
            className="px-4 py-2 text-xs font-semibold bg-[#c5b392] hover:bg-[#d8ccb8] text-[#08090d] rounded-xl shadow-lg shadow-[#c5b392]/15 flex items-center gap-2 transition"
            title="Lancer l’écran d'accueil en direct sur la télé"
          >
            <Maximize2 className="w-4 h-4" strokeWidth={1.5} />
            <span>Lancer sur la Télé (Kiosk)</span>
          </button>
        </div>

      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-10 space-y-8">
        
        {/* Supabase Setup Alert Banner if table not yet created */}
        {!supabaseStatus.tableReady && (
          <div className="p-4 rounded-2xl bg-amber-500/[0.08] border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-white flex items-center gap-2">
                  <span>Synchronisation Smart TV en attente</span>
                  <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30">Action en 1 min</span>
                </div>
                <p className="text-xs text-slate-300 font-light">
                  Pour que vos modifications sur cet écran apparaissent <strong>automatiquement sur la télé Sharp</strong> en direct, créez la table dans votre console Supabase.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#c5b392] hover:bg-[#d8ccb8] text-[#08090d] text-xs font-semibold shrink-0 cursor-pointer shadow-lg shadow-[#c5b392]/15 flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Activer la synchronisation TV (1 clic)</span>
            </button>
          </div>
        )}
        
        {/* Active Property Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-white/[0.08] p-6 lg:p-8 bg-[#0c0e14] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#c5b392]">
                {selectedProperty.type}
              </span>
              <span className="text-white/20">·</span>
              <span className="text-xs text-slate-400 font-light">Code TV :</span>
              <span className="font-mono text-xs text-slate-200 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.08]">
                {selectedProperty.pairingCode}
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-normal text-white font-serif-luxury tracking-wide">
              {selectedProperty.name}
            </h1>
            <p className="text-xs text-slate-400 font-light flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#c5b392]" strokeWidth={1.5} />
              <span>{selectedProperty.address} · {selectedProperty.city}</span>
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
              <span className="text-[#c5b392]">✦ 2 Chambres climatisées</span>
              <span className="text-white/20">·</span>
              <span>Salon & Salle à manger</span>
              <span className="text-white/20">·</span>
              <span>Cuisine équipée</span>
              <span className="text-white/20">·</span>
              <span>Wifi Fibre</span>
              <span className="text-white/20">·</span>
              <span>Gardiennage 24h/24</span>
              <span className="text-white/20">·</span>
              <span className="text-white font-medium">40 000 F CFA / nuit (dès 2 nuits)</span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/[0.025] p-4 lg:p-5 rounded-2xl border border-white/[0.08] shrink-0">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 text-[#c5b392] flex items-center justify-center">
              <UserCheck className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-[#c5b392] font-medium">Voyageur actuel sur la TV</div>
              <div className="text-base font-medium text-white font-serif tracking-wide">{selectedProperty.currentStay.name}</div>
              <div className="text-xs text-slate-400 font-light mt-0.5">
                Départ : {new Date(selectedProperty.currentStay.checkOutDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} à {selectedProperty.currentStay.checkOutTime}
              </div>
            </div>
          </div>
        </div>

        {/* Management Tabs */}
        <div className="flex border-b border-white/[0.08] gap-1 overflow-x-auto pb-1">
          {[
            { id: 'guest', label: 'Séjour & Message d’Accueil', icon: <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} /> },
            { id: 'wifi', label: 'Wi-Fi & Accès', icon: <Wifi className="w-3.5 h-3.5" strokeWidth={1.5} /> },
            { id: 'guide', label: 'Manuel Équipements', icon: <Coffee className="w-3.5 h-3.5" strokeWidth={1.5} /> },
            { id: 'places', label: 'Bonnes Adresses', icon: <Compass className="w-3.5 h-3.5" strokeWidth={1.5} /> },
            { id: 'theme', label: 'Ambiance & Photo de fond', icon: <Sliders className="w-3.5 h-3.5" strokeWidth={1.5} /> },
            { id: 'contacts', label: 'Coordonnées Concierge', icon: <Phone className="w-3.5 h-3.5" strokeWidth={1.5} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-4 text-xs font-medium flex items-center gap-2 border-b-2 transition ${
                activeTab === tab.id 
                  ? 'border-[#c5b392] text-[#c5b392]' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: Guest Stay Form */}
        {activeTab === 'guest' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Form */}
            <form onSubmit={handleSaveCurrentStay} className="lg:col-span-8 space-y-6 bg-[#0c0e14] border border-white/[0.08] p-6 lg:p-8 rounded-3xl">
              <div className="border-b border-white/[0.08] pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-white font-serif tracking-wide">Réservation en cours (diffusée en direct)</h3>
                  <p className="text-xs text-slate-400 font-light mt-0.5">La télévision met à jour son affichage dès votre validation.</p>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#c5b392] hover:bg-[#d8ccb8] text-[#08090d] font-semibold text-xs rounded-xl flex items-center gap-2 transition shadow-md shadow-[#c5b392]/15"
                >
                  <Save className="w-4 h-4" strokeWidth={1.5} />
                  <span>Diffuser sur la Télé</span>
                </button>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[11px] uppercase tracking-[0.15em] text-[#c5b392] font-medium block mb-2">
                      Nom / Prénom du ou des voyageurs *
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Ex: Sophie & Julien"
                      required
                      className="w-full bg-[#08090d] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white font-serif tracking-wide focus:outline-none focus:border-[#c5b392]/50"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-[0.15em] text-[#c5b392] font-medium block mb-2">
                      Digicode boîte à clefs ou porte d'entrée
                    </label>
                    <input
                      type="text"
                      value={doorCode}
                      onChange={(e) => setDoorCode(e.target.value)}
                      placeholder="Ex: 4829A"
                      className="w-full bg-[#08090d] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#c5b392]/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1.5 font-light">
                      Arrivée
                    </label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full bg-[#08090d] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1.5 font-light">
                      Départ
                    </label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full bg-[#08090d] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1.5 font-light">
                      Heure d'arrivée
                    </label>
                    <input
                      type="time"
                      value={checkInTime}
                      onChange={(e) => setCheckInTime(e.target.value)}
                      className="w-full bg-[#08090d] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1.5 font-light">
                      Heure de départ
                    </label>
                    <input
                      type="time"
                      value={checkOutTime}
                      onChange={(e) => setCheckOutTime(e.target.value)}
                      className="w-full bg-[#08090d] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-[0.15em] text-[#c5b392] font-medium block mb-2">
                    Message de bienvenue personnalisé sur l'écran
                  </label>
                  <textarea
                    rows={2}
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    placeholder="Ex: Nous sommes enchantés de vous recevoir et vous souhaitons un agréable séjour."
                    className="w-full bg-[#08090d] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-slate-200 font-light leading-relaxed focus:outline-none focus:border-[#c5b392]/50"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-[0.15em] text-[#c5b392] font-medium block mb-2">
                    Attention d'accueil / Note VIP (panier, fleurs, mot d'accueil)
                  </label>
                  <input
                    type="text"
                    value={specialNote}
                    onChange={(e) => setSpecialNote(e.target.value)}
                    placeholder="Ex: Une corbeille de bienvenue et du café grand cru vous attendent."
                    className="w-full bg-[#08090d] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-slate-200 font-light focus:outline-none focus:border-[#c5b392]/50"
                  />
                </div>
              </div>
            </form>

            {/* Upcoming Stays Queue */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-[#0c0e14] border border-white/[0.08] p-6 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-white font-serif tracking-wide">Prochaines Arrivées</h3>
                  <span className="text-xs text-slate-400 font-mono">
                    {(selectedProperty.upcomingStays || []).length} réservations
                  </span>
                </div>

                {!(selectedProperty.upcomingStays && selectedProperty.upcomingStays.length > 0) ? (
                  <div className="p-6 rounded-2xl bg-[#08090d] border border-white/[0.04] text-center text-xs text-slate-500 font-light">
                    Aucune réservation suivante en attente.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(selectedProperty.upcomingStays || []).map((stay) => (
                      <div 
                        key={stay.id}
                        className="p-4 rounded-2xl bg-[#08090d] border border-white/[0.06] space-y-2 hover:border-[#c5b392]/30 transition"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-sm font-medium text-white font-serif">{stay.name}</div>
                            <div className="text-xs text-slate-400 font-light mt-0.5">
                              Du {new Date(stay.checkInDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} au {new Date(stay.checkOutDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                            </div>
                          </div>
                          <button
                            onClick={() => handleActivateUpcomingStay(stay)}
                            className="px-2.5 py-1 bg-white/[0.04] hover:bg-[#c5b392] text-slate-300 hover:text-[#08090d] font-medium text-[11px] rounded-lg border border-white/[0.08] transition"
                          >
                            Activer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* TV Live Mini Preview */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs space-y-2">
                <div className="font-medium text-[#c5b392] flex items-center gap-2">
                  <Tv className="w-4 h-4" strokeWidth={1.5} />
                  <span>Diffusion temps réel</span>
                </div>
                <p className="text-slate-400 font-light text-[11px] leading-relaxed">
                  Dès que vos hôtes allument la Smart TV, l'écran s'illumine avec leurs prénoms, le Wi-Fi, les codes et le guide.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Wi-Fi Credentials */}
        {activeTab === 'wifi' && (
          <form onSubmit={handleSaveCurrentStay} className="max-w-2xl bg-[#0c0e14] border border-white/[0.08] p-6 lg:p-8 rounded-3xl space-y-6">
            <div>
              <h3 className="text-base font-medium text-white font-serif tracking-wide">Paramètres Wi-Fi</h3>
              <p className="text-xs text-slate-400 font-light mt-0.5">
                Le QR Code affiché sur la télévision permettra aux invités de se connecter sans taper aucun mot de passe.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-[0.15em] text-[#c5b392] font-medium block mb-1.5">
                  Nom du réseau Wi-Fi (SSID)
                </label>
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  required
                  className="w-full bg-[#08090d] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#c5b392]/50"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-[0.15em] text-[#c5b392] font-medium block mb-1.5">
                  Mot de passe Wi-Fi
                </label>
                <input
                  type="text"
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                  required
                  className="w-full bg-[#08090d] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#c5b392]/50"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08] flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 bg-[#c5b392] hover:bg-[#d8ccb8] text-[#08090d] font-semibold text-xs rounded-xl flex items-center gap-2 transition"
              >
                <Save className="w-4 h-4" strokeWidth={1.5} />
                <span>Enregistrer le Wi-Fi</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: House Guide */}
        {activeTab === 'guide' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-medium text-white font-serif tracking-wide">Manuel d'utilisation des équipements</h3>
              <p className="text-xs text-slate-400 font-light mt-0.5">Ces fiches sont consultables sur la télévision et sur le livret mobile.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(selectedProperty.guide || []).map((item) => (
                <div key={item.id} className="p-5 rounded-2xl bg-[#0c0e14] border border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-white font-serif">{item.title}</div>
                    <span className="text-[10px] uppercase tracking-wider font-medium text-[#c5b392]">
                      {item.category}
                    </span>
                  </div>
                  <div className="text-xs text-[#c5b392]/90 font-light">{item.summary}</div>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">{item.details}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Curated Recommendations */}
        {activeTab === 'places' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-medium text-white font-serif tracking-wide">Sélection du Quartier & Bonnes Adresses</h3>
              <p className="text-xs text-slate-400 font-light mt-0.5">Partagez vos tables préférées, boulangeries et commerces de bouche.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(selectedProperty.recommendations || []).map((spot) => (
                <div key={spot.id} className="p-5 rounded-2xl bg-[#0c0e14] border border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest font-medium text-[#c5b392]">
                      {spot.category}
                    </span>
                    <span className="text-xs text-slate-400 font-light">{spot.distance}</span>
                  </div>
                  <div className="text-sm font-medium text-white font-serif">{spot.name}</div>
                  <div className="text-xs text-slate-500 font-mono">{spot.address}</div>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">{spot.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Wallpaper & Theme */}
        {activeTab === 'theme' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-medium text-white font-serif tracking-wide">Ambiance visuelle sur l'écran Smart TV</h3>
              <p className="text-xs text-slate-400 font-light mt-0.5">Sélectionnez la photographie d'ambiance adaptée à l'architecture du bien.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  id: 'haussmann',
                  name: 'Haussmannien & Paris Chic',
                  img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80',
                  desc: 'Moulures, parquet ancien et atmosphère feutrée.'
                },
                {
                  id: 'chalet',
                  name: 'Chalet Alpin & Bois',
                  img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1920&q=80',
                  desc: 'Chaleur du bois et vue sur les massifs enneigés.'
                },
                {
                  id: 'riviera',
                  name: 'Villa Azur & Côte d’Azur',
                  img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80',
                  desc: 'Piscine, palmiers et luminosité méditerranéenne.'
                },
                {
                  id: 'minimal',
                  name: 'Loft Minimaliste',
                  img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1920&q=80',
                  desc: 'Design scandinave et lignes épurées.'
                },
                {
                  id: 'botanic',
                  name: 'Jardin & Sérénité',
                  img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1920&q=80',
                  desc: 'Végétation apaisante et lumière naturelle.'
                }
              ].map((themeOpt) => {
                const isCurrent = selectedProperty.ambientTheme === themeOpt.id;
                return (
                  <div
                    key={themeOpt.id}
                    onClick={() => handleThemeChange(themeOpt.id as Property['ambientTheme'], themeOpt.img)}
                    className={`group cursor-pointer rounded-2xl overflow-hidden border transition ${
                      isCurrent ? 'border-[#c5b392] shadow-xl shadow-[#c5b392]/10 scale-[1.01]' : 'border-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    <div 
                      className="h-36 bg-cover bg-center"
                      style={{ backgroundImage: `url("${themeOpt.img}")` }}
                    />
                    <div className="p-4 bg-[#0c0e14]">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-white font-serif">{themeOpt.name}</div>
                        {isCurrent && <CheckCircle2 className="w-4 h-4 text-[#c5b392]" />}
                      </div>
                      <div className="text-xs text-slate-400 font-light mt-1">{themeOpt.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 6: Contacts */}
        {activeTab === 'contacts' && (
          <form onSubmit={handleSaveCurrentStay} className="max-w-2xl bg-[#0c0e14] border border-white/[0.08] p-6 lg:p-8 rounded-3xl space-y-6">
            <div>
              <h3 className="text-base font-medium text-white font-serif tracking-wide">Coordonnées Conciergerie & Assistance</h3>
              <p className="text-xs text-slate-400 font-light mt-0.5">Coordonnées affichées sur l’écran TV et dans le QR code WhatsApp.</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-[0.15em] text-[#c5b392] font-medium block mb-1.5">
                    Nom du concierge
                  </label>
                  <input
                    type="text"
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    className="w-full bg-[#08090d] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-[0.15em] text-[#c5b392] font-medium block mb-1.5">
                    Téléphone d'appel direct
                  </label>
                  <input
                    type="text"
                    value={hostPhone}
                    onChange={(e) => setHostPhone(e.target.value)}
                    className="w-full bg-[#08090d] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-[0.15em] text-[#c5b392] font-medium block mb-1.5">
                  Numéro WhatsApp (avec indicatif, ex: 33612345678)
                </label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full bg-[#08090d] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-[0.15em] text-[#c5b392] font-medium block mb-1.5">
                  Numéro d'urgence médicale locale
                </label>
                <input
                  type="text"
                  value={emergencyDoctor}
                  onChange={(e) => setEmergencyDoctor(e.target.value)}
                  className="w-full bg-[#08090d] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08] flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 bg-[#c5b392] hover:bg-[#d8ccb8] text-[#08090d] font-semibold text-xs rounded-xl flex items-center gap-2 transition"
              >
                <Save className="w-4 h-4" strokeWidth={1.5} />
                <span>Enregistrer les coordonnées</span>
              </button>
            </div>
          </form>
        )}

      </div>

      {/* Save Success Toast */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#c5b392] text-[#08090d] font-semibold text-xs px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Informations actualisées en direct sur les téléviseurs.</span>
        </div>
      )}

      {/* Modal: Add new property */}
      {isNewPropertyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c0e14] border border-white/[0.08] rounded-3xl max-w-lg w-full p-6 lg:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <h2 className="text-lg font-medium text-white font-serif">Ajouter une nouvelle résidence</h2>
              <button
                onClick={() => setIsNewPropertyModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProperty} className="space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-[0.15em] text-[#c5b392] font-medium block mb-1.5">
                  Nom du bien *
                </label>
                <input
                  type="text"
                  required
                  value={newPropName}
                  onChange={(e) => setNewPropName(e.target.value)}
                  placeholder="Ex: Le Cocon Saint-Germain"
                  className="w-full bg-[#08090d] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1.5 font-light">
                    Type de bien
                  </label>
                  <select
                    value={newPropType}
                    onChange={(e) => setNewPropType(e.target.value as Property['type'])}
                    className="w-full bg-[#08090d] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="Appartement">Appartement</option>
                    <option value="Villa">Villa</option>
                    <option value="Maison">Maison</option>
                    <option value="Chalet">Chalet</option>
                    <option value="Loft">Loft</option>
                    <option value="Studio">Studio</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1.5 font-light">
                    Ville
                  </label>
                  <input
                    type="text"
                    value={newPropCity}
                    onChange={(e) => setNewPropCity(e.target.value)}
                    placeholder="Ex: Paris"
                    className="w-full bg-[#08090d] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1.5 font-light">
                  Adresse complète
                </label>
                <input
                  type="text"
                  value={newPropAddress}
                  onChange={(e) => setNewPropAddress(e.target.value)}
                  placeholder="Ex: 12 Rue Bonaparte, 75006"
                  className="w-full bg-[#08090d] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewPropertyModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#c5b392] hover:bg-[#d8ccb8] text-[#08090d] font-semibold text-xs rounded-xl transition"
                >
                  Créer la résidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supabase Realtime Sync Modal */}
      {isSupabaseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e1017] border border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#c5b392]" />
                  <h3 className="text-lg font-serif-luxury text-white">Synchronisation Smart TV en Temps Réel</h3>
                </div>
                <p className="text-xs text-slate-400 font-light">
                  Liaison directe entre votre tableau de bord Vercel et l'écran Sharp du salon
                </p>
              </div>
              <button
                onClick={() => setIsSupabaseModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition"
              >
                ✕
              </button>
            </div>

            {/* Project Status */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Projet Supabase :</span>
                <span className="font-mono text-slate-200">lseyghdywdzonvmpiovc</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Statut de la table :</span>
                <span className={`font-semibold flex items-center gap-1.5 ${supabaseStatus.tableReady ? 'text-emerald-400' : 'text-amber-400'}`}>
                  <span className={`w-2 h-2 rounded-full ${supabaseStatus.tableReady ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-amber-400'}`} />
                  {supabaseStatus.tableReady ? 'Table active & synchronisée' : 'Table requise dans Supabase'}
                </span>
              </div>
            </div>

            {/* Instruction if table not ready */}
            {!supabaseStatus.tableReady ? (
              <div className="space-y-4">
                <div className="space-y-2 text-xs text-slate-300 font-light">
                  <p className="text-white font-medium">Pour activer la transmission instantanée vers la TV :</p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-400">
                    <li>Copiez le script SQL ci-dessous en 1 clic.</li>
                    <li>Ouvrez l'éditeur SQL de votre projet Supabase.</li>
                    <li>Collez et cliquez sur <strong className="text-white font-semibold">Run</strong>.</li>
                  </ol>
                </div>

                {/* SQL Code Box */}
                <div className="relative rounded-2xl bg-black/60 border border-white/10 p-4 font-mono text-[11px] text-slate-300 overflow-x-auto">
                  <button
                    onClick={() => {
                      const sql = `CREATE TABLE IF NOT EXISTS public.property (
  id TEXT PRIMARY KEY,
  name TEXT,
  slug TEXT,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.property ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read and write" ON public.property FOR ALL USING (true) WITH CHECK (true);
ALTER PUBLICATION supabase_realtime ADD TABLE public.property;`;
                      navigator.clipboard.writeText(sql);
                      setCopiedSql(true);
                      setTimeout(() => setCopiedSql(false), 2500);
                    }}
                    className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1.5 transition font-sans cursor-pointer"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? 'Copié !' : 'Copier le SQL'}</span>
                  </button>
                  <pre className="pr-24">
{`CREATE TABLE IF NOT EXISTS public.property (
  id TEXT PRIMARY KEY,
  name TEXT,
  slug TEXT,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.property ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read and write" ON public.property FOR ALL USING (true) WITH CHECK (true);
ALTER PUBLICATION supabase_realtime ADD TABLE public.property;`}
                  </pre>
                </div>

                {/* Direct Action Link */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <a
                    href="https://supabase.com/dashboard/project/lseyghdywdzonvmpiovc/sql/new"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white text-xs flex items-center gap-2 transition"
                  >
                    <span>Ouvrir Supabase SQL Editor</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={checkStatus}
                    disabled={isCheckingSupabase}
                    className="px-5 py-2.5 bg-[#c5b392] hover:bg-[#d8ccb8] text-[#08090d] text-xs font-semibold rounded-xl flex items-center gap-2 transition shadow-lg shadow-[#c5b392]/20 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isCheckingSupabase ? 'animate-spin' : ''}`} />
                    <span>{isCheckingSupabase ? 'Vérification...' : 'Vérifier la connexion'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Tout est prêt !</p>
                    <p className="text-slate-300 font-light mt-0.5">
                      Chaque fois que vous modifiez un séjour et cliquez sur « Enregistrer », la télécommande et l'écran TV reçoivent instantanément la mise à jour sans recharger la page.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      SyncService.saveToServer(properties);
                      setIsSupabaseModalOpen(false);
                    }}
                    className="px-5 py-2.5 bg-[#c5b392] hover:bg-[#d8ccb8] text-[#08090d] text-xs font-semibold rounded-xl transition cursor-pointer shadow-lg"
                  >
                    Envoyer toutes les données vers la TV maintenant
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
