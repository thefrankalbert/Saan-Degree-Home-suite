import React, { useState } from 'react';
import { 
  Wifi, 
  KeyRound, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Sparkles, 
  BookOpen, 
  Compass, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  Coffee,
  Thermometer,
  Trash2,
  Tv,
  Star
} from 'lucide-react';
import { Property } from '../types';
import { DICTIONARY, AppLanguage } from '../utils/i18n';

interface MobileGuestViewProps {
  property: Property;
  onOpenDashboard?: () => void;
}

export const MobileGuestView: React.FC<MobileGuestViewProps> = ({ property, onOpenDashboard }) => {
  const [lang, setLang] = useState<AppLanguage>('fr');
  const [copiedWifi, setCopiedWifi] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'guide' | 'places'>('info');
  const [expandedGuideId, setExpandedGuideId] = useState<string | null>(null);

  const t = DICTIONARY[lang];

  const copyToClipboard = (text: string, type: 'wifi' | 'code') => {
    navigator.clipboard.writeText(text);
    if (type === 'wifi') {
      setCopiedWifi(true);
      setTimeout(() => setCopiedWifi(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const whatsappUrl = `https://wa.me/${property.contacts.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Bonjour, je séjourne à ${property.name} (${property.currentStay.name}). J'aurais une petite question : `
  )}`;

  return (
    <div className="min-h-screen bg-[#08090d] text-[#e2e8f0] font-sans pb-16 max-w-md mx-auto relative shadow-2xl">
      
      {/* Top Architectural Hero */}
      <div 
        className="relative h-64 bg-cover bg-center flex flex-col justify-between p-6"
        style={{
          backgroundImage: `url("${property.backgroundImage}")`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-[#08090d]/65 to-[#08090d]/40" />
        
        {/* Top Floating Controls */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-xl border border-white/10">
            {(['fr', 'en'] as AppLanguage[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 py-0.5 text-[10px] uppercase font-semibold rounded-lg transition ${
                  lang === l ? 'bg-[#c5b392] text-[#08090d]' : 'text-slate-300 hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {onOpenDashboard && (
            <button
              onClick={onOpenDashboard}
              className="text-[10px] uppercase tracking-wider text-slate-300 hover:text-white bg-black/40 px-2.5 py-1 rounded-xl border border-white/10 backdrop-blur-md"
            >
              Mode Gérant
            </button>
          )}
        </div>

        {/* Titles */}
        <div className="relative z-10 space-y-1">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#c5b392] font-medium">
            {property.type} · {property.city}
          </div>
          <h1 className="text-2xl font-normal text-white font-serif-luxury tracking-wide">
            {property.name}
          </h1>
          <p className="text-xs text-slate-300/90 font-light">
            {t.welcome}, <span className="text-[#c5b392] font-serif italic text-sm">{property.currentStay.name}</span>
          </p>
        </div>
      </div>

      {/* Segmented Control */}
      <div className="sticky top-0 z-20 bg-[#08090d]/95 backdrop-blur-xl px-4 py-2 border-b border-white/[0.08]">
        <div className="grid grid-cols-3 gap-1 bg-white/[0.03] p-1 rounded-2xl border border-white/[0.08]">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-2 text-xs font-medium rounded-xl transition ${
              activeTab === 'info' ? 'bg-[#c5b392] text-[#08090d] font-semibold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.navTabs.wifi}
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-2 text-xs font-medium rounded-xl transition ${
              activeTab === 'guide' ? 'bg-[#c5b392] text-[#08090d] font-semibold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.navTabs.guide}
          </button>
          <button
            onClick={() => setActiveTab('places')}
            className={`py-2 text-xs font-medium rounded-xl transition ${
              activeTab === 'places' ? 'bg-[#c5b392] text-[#08090d] font-semibold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.navTabs.places}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">

        {/* TAB 1: INFO & WI-FI */}
        {activeTab === 'info' && (
          <div className="space-y-4">
            
            {/* Wi-Fi Card */}
            <div className="p-5 rounded-3xl bg-[#0c0e14] border border-white/[0.08] shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/[0.04] text-[#c5b392] flex items-center justify-center border border-white/10">
                    <Wifi className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-white">{t.instantWifi}</div>
                    <div className="text-[10px] text-slate-400 font-light">Connexion rapide</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 bg-[#08090d] p-3.5 rounded-2xl border border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-light">{t.networkName} :</span>
                  <span className="text-xs font-mono font-medium text-white">{property.wifi.ssid}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                  <span className="text-[11px] text-slate-400 font-light">{t.securityKey} :</span>
                  <button
                    onClick={() => copyToClipboard(property.wifi.password, 'wifi')}
                    className="flex items-center gap-1.5 text-xs font-mono text-white bg-white/[0.04] hover:bg-white/[0.08] px-2.5 py-1 rounded-xl border border-white/[0.08] transition"
                  >
                    {copiedWifi ? <Check className="w-3.5 h-3.5 text-[#c5b392]" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{property.wifi.password}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Access Code & Check-out */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-3xl bg-[#0c0e14] border border-white/[0.08]">
                <div className="text-[10px] uppercase tracking-wider text-[#c5b392] font-medium mb-1">
                  {t.doorCodeLabel}
                </div>
                <div className="text-lg font-mono font-medium text-white tracking-widest">{property.doorCode || 'Clef standard'}</div>
                <button
                  onClick={() => copyToClipboard(property.doorCode, 'code')}
                  className="mt-2 text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
                >
                  {copiedCode ? 'Copié !' : 'Copier le code'}
                </button>
              </div>

              <div className="p-4 rounded-3xl bg-[#0c0e14] border border-white/[0.08]">
                <div className="text-[10px] uppercase tracking-wider text-[#c5b392] font-medium mb-1">
                  {t.checkoutLabel}
                </div>
                <div className="text-lg font-serif font-medium text-white">{property.currentStay.checkOutTime}</div>
                <div className="text-[10px] text-slate-400 font-light mt-1">
                  le {new Date(property.currentStay.checkOutDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                </div>
              </div>
            </div>

            {/* WhatsApp Contact */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-2xl bg-[#c5b392] hover:bg-[#d8ccb8] text-[#08090d] font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#c5b392]/15 transition"
            >
              <MessageSquare className="w-4 h-4" strokeWidth={1.5} />
              <span>{t.whatsappButton}</span>
            </a>

            {/* Direct Phone */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:+22655212293`}
                className="py-3 px-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] text-slate-200 font-medium text-xs flex items-center justify-center gap-1.5 border border-white/[0.08] transition"
              >
                <Phone className="w-3.5 h-3.5 text-[#c5b392]" strokeWidth={1.5} />
                <span>Ligne 1 (+226 55 21)</span>
              </a>
              <a
                href={`tel:+22652337669`}
                className="py-3 px-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] text-slate-200 font-medium text-xs flex items-center justify-center gap-1.5 border border-white/[0.08] transition"
              >
                <Phone className="w-3.5 h-3.5 text-[#c5b392]" strokeWidth={1.5} />
                <span>Ligne 2 (+226 52 33)</span>
              </a>
            </div>

            {/* Urgent */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs space-y-1">
              <div className="font-medium text-slate-300">{property.contacts.emergencyDoctor}</div>
              <div className="text-slate-500 text-[11px]">{property.contacts.emergencyPharmacy}</div>
            </div>

          </div>
        )}

        {/* TAB 2: GUIDE */}
        {activeTab === 'guide' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-400 font-light mb-2">{t.houseGuideSubtitle} :</div>
            {property.guide.map((item) => {
              const isExpanded = expandedGuideId === item.id;
              return (
                <div 
                  key={item.id}
                  className="rounded-2xl bg-[#0c0e14] border border-white/[0.08] overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedGuideId(isExpanded ? null : item.id)}
                    className="w-full p-4 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white/[0.04] text-[#c5b392] flex items-center justify-center shrink-0 border border-white/[0.08]">
                        {item.icon === 'Coffee' && <Coffee className="w-4 h-4" strokeWidth={1.5} />}
                        {item.icon === 'Thermometer' && <Thermometer className="w-4 h-4" strokeWidth={1.5} />}
                        {item.icon === 'Trash2' && <Trash2 className="w-4 h-4" strokeWidth={1.5} />}
                        {item.icon === 'Clock' && <Clock className="w-4 h-4" strokeWidth={1.5} />}
                        {!['Coffee', 'Thermometer', 'Trash2', 'Clock'].includes(item.icon) && (
                          <BookOpen className="w-4 h-4" strokeWidth={1.5} />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white font-serif">{item.title}</div>
                        <div className="text-xs text-[#c5b392]/90 font-light">{item.summary}</div>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-400 font-light border-t border-white/[0.06] leading-relaxed bg-[#08090d]">
                      {item.details}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: PLACES */}
        {activeTab === 'places' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-400 font-light mb-2">{t.recommendationsSubtitle} :</div>
            {property.recommendations.map((spot) => (
              <div 
                key={spot.id}
                className="p-4 rounded-2xl bg-[#0c0e14] border border-white/[0.08] space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#c5b392] font-medium">
                      {spot.category}
                    </span>
                    <h3 className="text-sm font-medium text-white font-serif mt-0.5">{spot.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400 font-light shrink-0">
                    <MapPin className="w-3 h-3 text-[#c5b392]" strokeWidth={1.5} />
                    <span>{spot.distance}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 font-mono">{spot.address}</div>
                <p className="text-xs text-slate-400 font-light leading-relaxed">{spot.description}</p>

                {spot.tip && (
                  <div className="text-[11px] text-slate-300 font-light italic bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.06]">
                    « {spot.tip} »
                  </div>
                )}

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(`${spot.name} ${spot.address}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#c5b392] hover:text-white pt-1 font-medium"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
