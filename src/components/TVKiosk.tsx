import React, { useState, useEffect, useCallback } from 'react';
import { 
  Wifi, 
  Clock, 
  MapPin, 
  Phone, 
  Maximize2, 
  Volume2, 
  VolumeX, 
  KeyRound, 
  Coffee, 
  Trash2, 
  Thermometer, 
  Sun,
  CloudSun,
  CheckCircle2,
  Moon,
  Flame,
  Star,
  Sparkles,
  BookOpen,
  Compass
} from 'lucide-react';
import { Property, TVTab } from '../types';
import { generateWifiQrCode, generateUrlQrCode } from '../utils/qrHelper';
import { ambientSound } from '../utils/audioSynth';
import { getEstimatedWeather } from '../utils/weather';
import { DICTIONARY, AppLanguage } from '../utils/i18n';

interface TVKioskProps {
  property: Property;
  onExitKiosk?: () => void;
  isStandalone?: boolean;
}

export const TVKiosk: React.FC<TVKioskProps> = ({ property, onExitKiosk }) => {
  const [lang, setLang] = useState<AppLanguage>('fr');
  const [activeTab, setActiveTab] = useState<TVTab>('welcome');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [wifiQrUrl, setWifiQrUrl] = useState<string>('');
  const [companionQrUrl, setCompanionQrUrl] = useState<string>('');
  const [soundMode, setSoundMode] = useState<'off' | 'fireplace' | 'zen'>('off');
  const [isDimmerMode, setIsDimmerMode] = useState<boolean>(false);

  const t = DICTIONARY[lang];
  const weather = getEstimatedWeather(property.weatherCity || property.city || 'Ouagadougou');

  const displayTemp = tempUnit === 'C' 
    ? `${weather.temp}°C` 
    : `${Math.round((weather.temp * 9/5) + 32)}°F`;

  const tabs: { id: TVTab; label: string; icon: React.ReactNode; shortcut: string }[] = [
    { id: 'welcome', label: t.navTabs.welcome, icon: <Sparkles className="w-4 h-4 2xl:w-6 2xl:h-6" strokeWidth={1.5} />, shortcut: '1' },
    { id: 'wifi', label: t.navTabs.wifi, icon: <Wifi className="w-4 h-4 2xl:w-6 2xl:h-6" strokeWidth={1.5} />, shortcut: '2' },
    { id: 'guide', label: t.navTabs.guide, icon: <BookOpen className="w-4 h-4 2xl:w-6 2xl:h-6" strokeWidth={1.5} />, shortcut: '3' },
    { id: 'places', label: t.navTabs.places, icon: <Compass className="w-4 h-4 2xl:w-6 2xl:h-6" strokeWidth={1.5} />, shortcut: '4' },
    { id: 'contacts', label: t.navTabs.contacts, icon: <Phone className="w-4 h-4 2xl:w-6 2xl:h-6" strokeWidth={1.5} />, shortcut: '5' }
  ];

  // Clock ticking
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Generate QR codes
  useEffect(() => {
    generateWifiQrCode(property.wifi.ssid, property.wifi.password, property.wifi.security).then(setWifiQrUrl);
    const baseUrl = window.location.origin + window.location.pathname;
    const mobileUrl = `${baseUrl}?mode=guest&propId=${property.id}`;
    generateUrlQrCode(mobileUrl).then(setCompanionQrUrl);
  }, [property]);

  // Handle remote control navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isDimmerMode) {
      setIsDimmerMode(false);
      return;
    }

    if (e.key === 'ArrowRight') {
      setActiveTab((prev) => {
        const idx = tabs.findIndex(t => t.id === prev);
        return tabs[(idx + 1) % tabs.length].id;
      });
    } else if (e.key === 'ArrowLeft') {
      setActiveTab((prev) => {
        const idx = tabs.findIndex(t => t.id === prev);
        return tabs[(idx - 1 + tabs.length) % tabs.length].id;
      });
    } else if (e.key === '1') {
      setActiveTab('welcome');
    } else if (e.key === '2') {
      setActiveTab('wifi');
    } else if (e.key === '3') {
      setActiveTab('guide');
    } else if (e.key === '4') {
      setActiveTab('places');
    } else if (e.key === '5') {
      setActiveTab('contacts');
    } else if (e.key === 'Escape' && onExitKiosk) {
      // Secret key for dev/admin on physical keyboard
      onExitKiosk();
    }
  }, [tabs, onExitKiosk, isDimmerMode]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const toggleSound = () => {
    let next: 'off' | 'fireplace' | 'zen' = 'off';
    if (soundMode === 'off') next = 'fireplace';
    else if (soundMode === 'fireplace') next = 'zen';
    else next = 'off';

    ambientSound.setMode(next);
    setSoundMode(next);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const formattedTime = currentTime.toLocaleTimeString(lang === 'fr' ? 'fr-FR' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const formattedDate = currentTime.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  // NIGHT / DIMMER MODE
  if (isDimmerMode) {
    return (
      <div 
        onClick={() => setIsDimmerMode(false)}
        className="fixed inset-0 z-50 bg-[#050608] flex flex-col items-center justify-center cursor-pointer select-none"
      >
        <div className="text-center space-y-4 2xl:space-y-6 opacity-50 hover:opacity-100 transition-opacity duration-700">
          <div className="text-7xl md:text-8xl 2xl:text-9xl font-light text-slate-400 font-mono tracking-wider tabular-nums">
            {formattedTime}
          </div>
          <div className="text-base 2xl:text-xl text-slate-500 font-light tracking-widest uppercase">
            {property.name} · {capitalizedDate}
          </div>
          <div className="text-xs 2xl:text-sm text-[#c5b392]/60 pt-4">
            Appuyez sur n'importe quelle touche pour réactiver l'écran
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 h-screen w-screen max-h-screen max-w-screen overflow-hidden bg-[#07080b] text-slate-100 font-sans select-none flex flex-col justify-between">
      
      {/* Cinematic Luxury Wallpaper */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105 pointer-events-none"
        style={{ backgroundImage: `url(${property.backgroundImage})` }}
      />
      
      {/* Dark Luxury Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#06070a] via-[#07080bd4] to-[#07080bf0] pointer-events-none" />

      {/* Main Strict-Fit Viewport Box */}
      <div className="relative z-10 h-full w-full flex flex-col justify-between px-8 py-5 md:px-12 md:py-6 lg:px-16 lg:py-7 2xl:px-24 2xl:py-10">
        
        {/* TOP BAR: Palace Hotel Header (NO ADMIN BUTTON) */}
        <header className="shrink-0 flex items-center justify-between pb-3 border-b border-white/[0.08]">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-4 2xl:gap-6">
            <div className="w-11 h-11 2xl:w-14 2xl:h-14 rounded-2xl bg-white/[0.03] border border-[#c5b392]/40 text-[#c5b392] flex items-center justify-center font-serif text-lg 2xl:text-xl tracking-wider shadow-lg">
              SD
            </div>
            <div>
              <div className="text-[10px] 2xl:text-xs uppercase tracking-[0.25em] text-[#c5b392] font-medium">
                Sãan Degree · Ouaga 2000
              </div>
              <h1 className="text-xl md:text-2xl 2xl:text-3xl font-light tracking-wide text-white font-serif-luxury mt-0.5">
                {property.name}
              </h1>
            </div>
          </div>

          {/* Right Utilities: Weather, Clock & Discreet Controls */}
          <div className="flex items-center gap-6">
            
            {/* Weather */}
            <div 
              onClick={() => setTempUnit(tempUnit === 'C' ? 'F' : 'C')}
              className="flex items-center gap-2.5 2xl:gap-3 px-3 py-1.5 2xl:px-4 2xl:py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md cursor-pointer hover:bg-white/[0.06] transition"
              title="Changer °C / °F"
            >
              {weather.icon === 'sun' ? (
                <Sun className="w-4 h-4 2xl:w-5 2xl:h-5 text-[#c5b392]" strokeWidth={1.5} />
              ) : (
                <CloudSun className="w-4 h-4 2xl:w-5 2xl:h-5 text-[#c5b392]" strokeWidth={1.5} />
              )}
              <div className="text-left">
                <div className="text-xs 2xl:text-sm font-semibold text-white tracking-wide">{displayTemp}</div>
                <div className="text-[10px] 2xl:text-xs text-slate-400 font-light">
                  {weather.city} · {weather.temp > 20 ? t.weatherSunny : t.weatherClear}
                </div>
              </div>
            </div>

            {/* Time & Date */}
            <div className="text-right">
              <div className="text-2xl md:text-3xl 2xl:text-4xl font-light tracking-tight text-white tabular-nums font-mono leading-none">
                {formattedTime}
              </div>
              <div className="text-[11px] 2xl:text-sm text-slate-400 font-light tracking-wide mt-1">
                {capitalizedDate}
              </div>
            </div>

            {/* Language & Screen Controls */}
            <div className="flex items-center gap-2 2xl:gap-3 pl-4 border-l border-white/[0.08]">
              
              {/* Language Switcher */}
              <div className="flex items-center bg-white/[0.03] rounded-xl border border-white/[0.08] p-0.5">
                {(['fr', 'en'] as AppLanguage[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-2 py-1 2xl:px-3 2xl:py-1.5 text-[10px] 2xl:text-xs font-semibold tracking-wider uppercase rounded-lg transition ${
                      lang === l 
                        ? 'bg-[#c5b392] text-[#07080b]' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              {/* Ambient Sound */}
              <button
                onClick={toggleSound}
                className={`p-2 2xl:p-2.5 rounded-xl transition border text-xs 2xl:text-sm flex items-center gap-1.5 ${
                  soundMode !== 'off' 
                    ? 'bg-[#c5b392]/15 text-[#c5b392] border-[#c5b392]/30' 
                    : 'bg-white/[0.03] text-slate-400 border-white/[0.08] hover:bg-white/[0.06] hover:text-white'
                }`}
                title="Ambiance sonore"
              >
                {soundMode !== 'off' ? <Volume2 className="w-3.5 h-3.5 2xl:w-5 2xl:h-5 text-[#c5b392]" strokeWidth={1.5} /> : <VolumeX className="w-3.5 h-3.5 2xl:w-5 2xl:h-5" strokeWidth={1.5} />}
              </button>

              {/* Dimmer Mode */}
              <button
                onClick={() => setIsDimmerMode(true)}
                className="p-2 2xl:p-2.5 bg-white/[0.03] hover:bg-white/[0.06] text-slate-400 hover:text-white rounded-xl border border-white/[0.08] transition"
                title="Mode veille"
              >
                <Moon className="w-3.5 h-3.5 2xl:w-5 2xl:h-5" strokeWidth={1.5} />
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-2 2xl:p-2.5 bg-white/[0.03] hover:bg-white/[0.06] text-slate-400 hover:text-white rounded-xl border border-white/[0.08] transition"
                title="Plein écran"
              >
                <Maximize2 className="w-3.5 h-3.5 2xl:w-5 2xl:h-5" strokeWidth={1.5} />
              </button>

            </div>

          </div>
        </header>

        {/* CENTER CONTENT: Perfectly bounded to prevent any cut-off */}
        <main className="flex-1 min-h-0 flex items-center justify-center my-3 2xl:my-5">
          
          {/* TAB 1: ACCUEIL / LUXURY WELCOME */}
          {activeTab === 'welcome' && (
            <div className="w-full grid grid-cols-12 gap-8 lg:gap-12 2xl:gap-16 items-center">
              
              {/* Left Column: Personalized Greeting & Stay Details */}
              <div className="col-span-12 lg:col-span-7 space-y-5">
                
                <div className="space-y-2.5 2xl:space-y-4">
                  <div className="flex items-center gap-2 text-[11px] 2xl:text-sm uppercase tracking-[0.25em] text-[#c5b392] font-medium">
                    <span className="w-5 h-[1px] 2xl:w-8 bg-[#c5b392]/60" />
                    <span>{t.welcomeSub} · {property.type}</span>
                  </div>

                  <h2 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-normal tracking-tight text-white font-serif-luxury leading-[1.15]">
                    {t.welcome}, <br />
                    <span className="italic font-normal champagne-gradient font-serif">
                      {property.currentStay.name}
                    </span>
                  </h2>

                  <p className="text-sm md:text-base 2xl:text-lg text-slate-300/90 max-w-2xl 2xl:max-w-3xl font-light leading-relaxed pt-1">
                    {property.currentStay.welcomeMessage || 'Nous sommes honorés de vous recevoir et vous souhaitons un séjour agréable et serein.'}
                  </p>
                </div>

                {/* Host special note if present */}
                {property.currentStay.specialNote && (
                  <div className="p-3.5 2xl:p-5 rounded-2xl bg-white/[0.025] border border-[#c5b392]/25 backdrop-blur-md flex items-center gap-3 2xl:gap-4 max-w-2xl 2xl:max-w-3xl">
                    <div className="w-7 h-7 2xl:w-9 2xl:h-9 rounded-lg bg-[#c5b392]/10 border border-[#c5b392]/30 flex items-center justify-center shrink-0 text-[#c5b392]">
                      <Star className="w-3.5 h-3.5 2xl:w-4 2xl:h-4" strokeWidth={1.5} />
                    </div>
                    <div className="text-xs 2xl:text-sm text-slate-200 font-light leading-snug">
                      <span className="text-[#c5b392] font-medium mr-1.5">{t.specialNoteTitle} :</span>
                      {property.currentStay.specialNote}
                    </div>
                  </div>
                )}

                {/* Key Stay Details: Clean, Single Horizontal Strip */}
                <div className="grid grid-cols-3 gap-3.5 2xl:gap-5 max-w-2xl 2xl:max-w-3xl pt-1">
                  
                  <div className="p-3.5 2xl:p-5 rounded-2xl bg-white/[0.025] border border-white/[0.08] backdrop-blur-md">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px] 2xl:text-sm font-light mb-1">
                      <Clock className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-[#c5b392]" strokeWidth={1.5} />
                      <span>{t.checkoutLabel}</span>
                    </div>
                    <div className="text-base 2xl:text-xl font-medium text-white font-serif tracking-wide">{property.currentStay.checkOutTime}</div>
                    <div className="text-[10px] 2xl:text-xs text-slate-400 mt-0.5">
                      {new Date(property.currentStay.checkOutDate).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>

                  <div className="p-3.5 2xl:p-5 rounded-2xl bg-white/[0.025] border border-white/[0.08] backdrop-blur-md">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px] 2xl:text-sm font-light mb-1">
                      <KeyRound className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-[#c5b392]" strokeWidth={1.5} />
                      <span>{t.doorCodeLabel}</span>
                    </div>
                    <div className="text-base 2xl:text-xl font-mono font-medium text-white tracking-wider truncate">{property.doorCode || 'Poste Garde'}</div>
                    <div className="text-[10px] 2xl:text-xs text-slate-400 mt-0.5">Accès 24h/24</div>
                  </div>

                  <div className="p-3.5 2xl:p-5 rounded-2xl bg-white/[0.025] border border-white/[0.08] backdrop-blur-md">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px] 2xl:text-sm font-light mb-1">
                      <Phone className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-[#c5b392]" strokeWidth={1.5} />
                      <span>{t.concierge}</span>
                    </div>
                    <div className="text-xs 2xl:text-base font-mono font-medium text-white tracking-wide truncate">{property.contacts.phone}</div>
                    <div className="text-[10px] 2xl:text-xs text-[#c5b392] mt-0.5">WhatsApp 7j/7</div>
                  </div>

                </div>

              </div>

              {/* Right Column: Pristine Wi-Fi Hub */}
              <div className="col-span-12 lg:col-span-5 flex justify-center">
                <div className="p-6 md:p-7 2xl:p-8 rounded-3xl luxury-glass border border-white/[0.1] shadow-2xl max-w-sm 2xl:max-w-md w-full text-center space-y-4 2xl:space-y-5">
                  
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                    <div className="flex items-center gap-2.5 text-left">
                      <div className="w-8 h-8 2xl:w-10 2xl:h-10 rounded-xl bg-white/[0.04] border border-[#c5b392]/30 flex items-center justify-center text-[#c5b392]">
                        <Wifi className="w-4 h-4 2xl:w-5 2xl:h-5" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="text-sm 2xl:text-base font-medium text-white tracking-wide">{t.instantWifi}</h3>
                        <p className="text-[10px] 2xl:text-xs text-slate-400 font-light">{property.city} · Haute Vitesse</p>
                      </div>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="p-3 2xl:p-4 bg-white rounded-2xl shadow-xl inline-block">
                    {wifiQrUrl ? (
                      <img src={wifiQrUrl} alt="Wi-Fi QR Code" className="w-36 h-36 md:w-40 md:h-40 2xl:w-52 2xl:h-52 object-contain mx-auto" />
                    ) : (
                      <div className="w-36 h-36 2xl:w-52 2xl:h-52 bg-slate-200 animate-pulse rounded-xl" />
                    )}
                  </div>

                  {/* Network & Password */}
                  <div className="space-y-2 text-left bg-white/[0.02] p-3 2xl:p-4 rounded-xl border border-white/[0.06]">
                    <div className="flex items-center justify-between text-xs 2xl:text-sm">
                      <span className="text-slate-400 font-light text-[10px] 2xl:text-xs uppercase tracking-wider">{t.networkName}</span>
                      <span className="font-mono text-white font-medium">{property.wifi.ssid}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs 2xl:text-sm pt-1 border-t border-white/[0.04]">
                      <span className="text-slate-400 font-light text-[10px] 2xl:text-xs uppercase tracking-wider">{t.securityKey}</span>
                      <span className="font-mono text-[#c5b392] font-semibold">{property.wifi.password}</span>
                    </div>
                  </div>

                  <div className="text-[11px] 2xl:text-sm text-slate-400 font-light flex items-center justify-center gap-1.5 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-[#c5b392] shrink-0" strokeWidth={1.5} />
                    <span>{t.scanCameraTip}</span>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* TAB 2: WI-FI & ACCÈS DÉTAILLÉ */}
          {activeTab === 'wifi' && (
            <div className="w-full max-w-4xl 2xl:max-w-5xl mx-auto grid grid-cols-12 gap-8 2xl:gap-12 items-center">
              <div className="col-span-12 md:col-span-7 space-y-4 2xl:space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-[10px] 2xl:text-xs uppercase tracking-[0.2em] text-[#c5b392] font-medium mb-1">
                    <Wifi className="w-3.5 h-3.5 2xl:w-5 2xl:h-5" strokeWidth={1.5} />
                    <span>{t.navTabs.wifi}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl 2xl:text-4xl font-light text-white font-serif-luxury">
                    {t.instantWifi} · Fibre Optique Dédiée
                  </h2>
                  <p className="text-slate-400 text-xs 2xl:text-sm font-light mt-1 2xl:mt-2 leading-relaxed">
                    Connexion ultra-rapide sécurisée, optimisée pour vos réunions, appels vidéo et streaming 4K.
                  </p>
                </div>

                <div className="space-y-3 2xl:space-y-4">
                  <div className="p-4 2xl:p-5 rounded-2xl bg-white/[0.025] border border-white/[0.08]">
                    <div className="text-[10px] 2xl:text-xs uppercase tracking-[0.2em] text-[#c5b392] mb-0.5 font-medium">{t.networkName}</div>
                    <div className="text-lg 2xl:text-xl font-mono text-white font-medium tracking-wide">{property.wifi.ssid}</div>
                  </div>

                  <div className="p-4 2xl:p-5 rounded-2xl bg-white/[0.025] border border-white/[0.08]">
                    <div className="text-[10px] 2xl:text-xs uppercase tracking-[0.2em] text-[#c5b392] mb-0.5 font-medium">{t.securityKey}</div>
                    <div className="text-lg 2xl:text-xl font-mono text-[#c5b392] tracking-wider font-semibold">{property.wifi.password}</div>
                  </div>

                  <div className="p-4 2xl:p-5 rounded-2xl bg-white/[0.025] border border-white/[0.08] flex items-center gap-3 2xl:gap-4">
                    <div className="w-9 h-9 2xl:w-11 2xl:h-11 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#c5b392] shrink-0">
                      <KeyRound className="w-4 h-4 2xl:w-5 2xl:h-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="text-[10px] 2xl:text-xs uppercase tracking-[0.2em] text-[#c5b392] font-medium">{t.doorCodeLabel}</div>
                      <div className="text-base 2xl:text-lg font-mono text-white tracking-wider">{property.doorCode || 'Poste Garde 24h/24'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Large QR */}
              <div className="col-span-12 md:col-span-5 flex flex-col items-center">
                <div className="p-6 2xl:p-8 bg-white rounded-3xl shadow-2xl text-center max-w-xs 2xl:max-w-sm">
                  {wifiQrUrl ? (
                    <img src={wifiQrUrl} alt="Wi-Fi QR Code" className="w-52 h-52 2xl:w-64 2xl:h-64 mx-auto object-contain" />
                  ) : (
                    <div className="w-52 h-52 2xl:w-64 2xl:h-64 bg-slate-100 animate-pulse rounded-2xl" />
                  )}
                  <div className="mt-3 pt-2 border-t border-slate-200">
                    <div className="text-xs 2xl:text-sm font-semibold text-slate-800 tracking-wide">{t.scanCameraTip}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MANUEL DE L'APPARTEMENT & ÉQUIPEMENTS */}
          {activeTab === 'guide' && (
            <div className="w-full space-y-4 2xl:space-y-6">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div>
                  <div className="text-[10px] 2xl:text-xs uppercase tracking-[0.2em] text-[#c5b392] font-medium">{t.houseGuideTitle}</div>
                  <h2 className="text-2xl 2xl:text-3xl font-light text-white font-serif-luxury mt-0.5">{t.houseGuideSubtitle}</h2>
                </div>
                <div className="text-xs 2xl:text-sm text-slate-400 font-light">
                  Assistance concierge : <span className="font-mono text-[#c5b392]">{property.contacts.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 2xl:gap-5">
                {property.guide.map((item) => (
                  <div 
                    key={item.id}
                    className="p-5 2xl:p-6 rounded-3xl luxury-glass border border-white/[0.08] flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-9 h-9 2xl:w-11 2xl:h-11 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-[#c5b392] flex items-center justify-center mb-3">
                        {item.icon === 'Coffee' && <Coffee className="w-4 h-4 2xl:w-5 2xl:h-5" strokeWidth={1.5} />}
                        {item.icon === 'Thermometer' && <Thermometer className="w-4 h-4 2xl:w-5 2xl:h-5" strokeWidth={1.5} />}
                        {item.icon === 'Trash2' && <Trash2 className="w-4 h-4 2xl:w-5 2xl:h-5" strokeWidth={1.5} />}
                        {item.icon === 'Clock' && <Clock className="w-4 h-4 2xl:w-5 2xl:h-5" strokeWidth={1.5} />}
                        {item.icon === 'Flame' && <Flame className="w-4 h-4 2xl:w-5 2xl:h-5" strokeWidth={1.5} />}
                        {!['Coffee', 'Thermometer', 'Trash2', 'Clock', 'Flame'].includes(item.icon) && (
                          <BookOpen className="w-4 h-4 2xl:w-5 2xl:h-5" strokeWidth={1.5} />
                        )}
                      </div>
                      <h3 className="text-sm 2xl:text-base font-medium text-white mb-1 font-serif tracking-wide">{item.title}</h3>
                      <div className="text-[11px] 2xl:text-sm font-light text-[#c5b392] mb-2">{item.summary}</div>
                      <p className="text-[11px] 2xl:text-sm text-slate-400 font-light leading-relaxed">{item.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: GUIDE OUAGA 2000 & BONNES ADRESSES */}
          {activeTab === 'places' && (
            <div className="w-full space-y-4 2xl:space-y-6">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div>
                  <div className="text-[10px] 2xl:text-xs uppercase tracking-[0.2em] text-[#c5b392] font-medium">{t.recommendationsTitle}</div>
                  <h2 className="text-2xl 2xl:text-3xl font-light text-white font-serif-luxury mt-0.5">{t.recommendationsSubtitle}</h2>
                </div>
                <div className="text-xs 2xl:text-sm text-slate-400 font-light">
                  {property.city} · Sélection conciergerie
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 2xl:gap-5">
                {property.recommendations.map((spot) => (
                  <div 
                    key={spot.id}
                    className="p-5 2xl:p-6 rounded-3xl luxury-glass border border-white/[0.08] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] 2xl:text-xs font-medium uppercase tracking-widest text-[#c5b392]">
                          {spot.category}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] 2xl:text-sm text-slate-400 font-light">
                          <MapPin className="w-3 h-3 2xl:w-4 2xl:h-4 text-[#c5b392]" strokeWidth={1.5} />
                          <span>{spot.distance}</span>
                        </div>
                      </div>

                      <h3 className="text-sm 2xl:text-base font-medium text-white mb-1 font-serif tracking-wide">{spot.name}</h3>
                      <div className="text-[11px] 2xl:text-sm text-slate-500 mb-1.5 font-mono">{spot.address}</div>
                      <p className="text-[11px] 2xl:text-sm text-slate-400 font-light leading-relaxed">{spot.description}</p>
                    </div>

                    {spot.tip && (
                      <div className="mt-3 pt-2 border-t border-white/[0.06]">
                        <div className="text-[10px] 2xl:text-xs text-slate-300 font-light italic">
                          « {spot.tip} »
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CONCIERGERIE & ASSISTANCE */}
          {activeTab === 'contacts' && (
            <div className="w-full max-w-4xl 2xl:max-w-5xl mx-auto grid grid-cols-12 gap-8 2xl:gap-12 items-center">
              
              <div className="col-span-12 md:col-span-7 space-y-4 2xl:space-y-6">
                <div>
                  <div className="text-[10px] 2xl:text-xs uppercase tracking-[0.2em] text-[#c5b392] font-medium">{t.contactsTitle}</div>
                  <h2 className="text-2xl md:text-3xl 2xl:text-4xl font-light text-white font-serif-luxury mt-0.5">{t.contactsSubtitle}</h2>
                  <p className="text-slate-400 text-xs 2xl:text-sm font-light mt-1 2xl:mt-2">
                    Notre équipe est à votre disposition permanente pour rendre votre séjour à Ouagadougou d'un confort absolu.
                  </p>
                </div>

                <div className="space-y-3 2xl:space-y-4">
                  <div className="p-5 2xl:p-6 rounded-3xl luxury-glass border border-white/[0.08]">
                    <div className="flex items-center gap-3 2xl:gap-4 mb-2">
                      <div className="w-9 h-9 2xl:w-11 2xl:h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[#c5b392] flex items-center justify-center">
                        <Phone className="w-4 h-4 2xl:w-5 2xl:h-5" strokeWidth={1.5} />
                      </div>
                      <div>
                        <div className="text-sm 2xl:text-base font-medium text-white font-serif">{property.contacts.hostName}</div>
                        <div className="text-[11px] 2xl:text-sm text-slate-400 font-light">{property.contacts.role}</div>
                      </div>
                    </div>
                    <div className="text-base 2xl:text-lg font-mono text-white mt-1.5 font-medium tracking-wide">
                      {property.contacts.phone} · +226 52 33 76 69
                    </div>
                    <div className="text-xs 2xl:text-sm text-[#c5b392] font-mono mt-0.5">{property.contacts.email}</div>
                  </div>

                  <div className="p-4 2xl:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
                    <div className="text-[10px] 2xl:text-xs uppercase tracking-widest text-[#c5b392] font-medium mb-1">Permanence médicale & Urgences</div>
                    <div className="text-xs 2xl:text-sm text-slate-300 font-light">{property.contacts.emergencyDoctor}</div>
                    <div className="text-xs 2xl:text-sm text-slate-400 font-light mt-0.5">{property.contacts.emergencyPharmacy}</div>
                  </div>
                </div>
              </div>

              {/* WhatsApp QR Code */}
              <div className="col-span-12 md:col-span-5 flex flex-col items-center">
                <div className="p-6 2xl:p-8 rounded-3xl luxury-glass border border-white/[0.08] text-center max-w-xs 2xl:max-w-sm w-full space-y-3 2xl:space-y-4">
                  <div className="text-[10px] 2xl:text-xs uppercase tracking-[0.2em] text-[#c5b392] font-medium">
                    {t.mobileCompanion}
                  </div>
                  <h3 className="text-sm 2xl:text-base font-medium text-white font-serif">{t.whatsappButton}</h3>
                  <div className="p-3 2xl:p-4 bg-white rounded-2xl shadow-2xl inline-block">
                    {companionQrUrl ? (
                      <img src={companionQrUrl} alt="Companion QR" className="w-36 h-36 2xl:w-52 2xl:h-52 object-contain mx-auto" />
                    ) : (
                      <div className="w-36 h-36 2xl:w-52 2xl:h-52 bg-slate-200 animate-pulse rounded-xl" />
                    )}
                  </div>
                  <div className="text-[10px] 2xl:text-xs text-slate-400 font-light">
                    Scannez pour ouvrir le livret d'accueil sur votre téléphone
                  </div>
                </div>
              </div>

            </div>
          )}

        </main>

        {/* BOTTOM NAVIGATION: Strict Luxury TV Dock */}
        <footer className="shrink-0 border-t border-white/[0.08] pt-3 2xl:pt-4 flex items-center justify-between">
          
          {/* Navigation Tabs */}
          <nav className="flex items-center gap-2 2xl:gap-3 p-1 2xl:p-1.5 rounded-2xl bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 2xl:gap-2.5 px-3.5 py-1.5 2xl:px-5 2xl:py-2.5 rounded-xl text-xs 2xl:text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-white/[0.1] text-white border border-[#c5b392]/40 shadow-lg shadow-black/40 font-semibold' 
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <span className={isActive ? 'text-[#c5b392]' : 'text-slate-500'}>{tab.icon}</span>
                  <span className="tracking-wide">{tab.label}</span>
                  <span className={`text-[9px] 2xl:text-xs font-mono px-1 rounded ${isActive ? 'text-[#c5b392]' : 'text-slate-600'}`}>
                    [{tab.shortcut}]
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Remote Navigation Hint */}
          <div className="flex items-center gap-2 text-[11px] 2xl:text-sm text-slate-400 font-light bg-white/[0.02] px-3 py-1.5 2xl:px-4 2xl:py-2 rounded-xl border border-white/[0.06]">
            <span className="text-[#c5b392] font-medium">Télécommande :</span>
            <span className="text-slate-300">Flèches ◀ ▶ ou touches [1 à 5]</span>
          </div>

        </footer>

      </div>

    </div>
  );
};
