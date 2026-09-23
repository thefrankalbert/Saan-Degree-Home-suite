import React, { useState, useEffect } from 'react';
import { 
  X, 
  Tv, 
  Copy, 
  Check, 
  ExternalLink,
  Layers,
  HelpCircle,
  Sparkles,
  Smartphone,
  Star,
  QrCode,
  Link as LinkIcon,
  Send
} from 'lucide-react';
import { Property } from '../types';

interface TVSetupGuideModalProps {
  property: Property;
  onClose: () => void;
}

export const TVSetupGuideModal: React.FC<TVSetupGuideModalProps> = ({ property, onClose }) => {
  const [activeTvType, setActiveTvType] = useState<'tips' | 'android' | 'firetv' | 'samsung_lg'>('tips');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedShortUrl, setCopiedShortUrl] = useState(false);
  const [shortUrl, setShortUrl] = useState<string>('');
  const [isGeneratingShort, setIsGeneratingShort] = useState(false);

  // Simplified parameter URL (?tv=genesis or ?tv)
  const fullKioskUrl = `${window.location.origin}${window.location.pathname}?tv=${property.slug || 'genesis'}`;
  const simpleUrl = `${window.location.origin}/?tv`;

  // Fetch or prepare a memorable short link via TinyURL API
  useEffect(() => {
    let isMounted = true;
    const makeShortUrl = async () => {
      try {
        setIsGeneratingShort(true);
        const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(fullKioskUrl)}`);
        if (res.ok) {
          const text = await res.text();
          if (isMounted && text.startsWith('http')) {
            setShortUrl(text);
          }
        }
      } catch {
        // Fallback
      } finally {
        if (isMounted) setIsGeneratingShort(false);
      }
    };
    makeShortUrl();
    return () => { isMounted = false; };
  }, [fullKioskUrl]);

  const copyUrl = (url: string, isShort = false) => {
    navigator.clipboard.writeText(url);
    if (isShort) {
      setCopiedShortUrl(true);
      setTimeout(() => setCopiedShortUrl(false), 2000);
    } else {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0c0e14] border border-white/[0.08] rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-[#c5b392]/30 text-[#c5b392] flex items-center justify-center">
              <Tv className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-lg font-normal text-white font-serif tracking-wide">
                Comment ouvrir sur votre téléviseur sans taper une longue URL
              </h2>
              <p className="text-xs text-slate-400 font-light">{property.name} · Ouaga 2000</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.06] transition"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Short Link High Priority Box */}
        <div className="px-6 py-5 bg-[#08090d] border-b border-white/[0.08] space-y-3">
          
          {/* Quick Short Link */}
          {shortUrl ? (
            <div className="p-3.5 rounded-2xl bg-[#c5b392]/10 border border-[#c5b392]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#c5b392] font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Lien court ultra-facile à taper sur la télé :</span>
                </div>
                <div className="font-mono text-base font-semibold text-white tracking-wider">
                  {shortUrl.replace(/^https?:\/\//, '')}
                </div>
                <div className="text-[11px] text-slate-300 font-light">
                  Seulement quelques lettres à taper dans le navigateur de votre Smart TV !
                </div>
              </div>
              <button
                onClick={() => copyUrl(shortUrl, true)}
                className="px-4 py-2.5 bg-[#c5b392] hover:bg-[#d8ccb8] text-[#08090d] font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition shrink-0"
              >
                {copiedShortUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedShortUrl ? 'Copié !' : 'Copier'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#c5b392] font-medium">
                URL directe simplifiée pour cette TV :
              </div>
              <div className="flex items-center gap-2">
                <input 
                  readOnly 
                  value={simpleUrl}
                  className="bg-[#0c0e14] border border-white/[0.08] text-white font-mono text-xs px-3.5 py-2.5 rounded-xl flex-1 focus:outline-none"
                />
                <button
                  onClick={() => copyUrl(simpleUrl)}
                  className="px-4 py-2.5 bg-[#c5b392] hover:bg-[#d8ccb8] text-[#08090d] font-semibold text-xs rounded-xl flex items-center gap-1.5 transition"
                >
                  {copiedUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedUrl ? 'Copié' : 'Copier'}</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/[0.08] px-6 bg-white/[0.01]">
          {[
            { id: 'tips', label: '⭐ 3 Astuces : Zéro frappe au clavier' },
            { id: 'android', label: 'Android TV / Google TV' },
            { id: 'samsung_lg', label: 'Samsung / LG' },
            { id: 'firetv', label: 'Fire TV Stick' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTvType(item.id as any)}
              className={`py-3.5 px-4 text-xs font-medium border-b-2 transition ${
                activeTvType === item.id 
                  ? 'border-[#c5b392] text-[#c5b392]' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300 font-light leading-relaxed flex-1">
          
          {activeTvType === 'tips' && (
            <div className="space-y-4">
              
              {/* Tip 1: Remote app keyboard */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
                <div className="flex items-center gap-2 font-medium text-white text-sm">
                  <Smartphone className="w-4 h-4 text-[#c5b392]" />
                  <span>Astuce 1 (La plus rapide) : Le smartphone comme clavier virtuel TV</span>
                </div>
                <p className="text-slate-400 text-xs">
                  Sur toutes les Smart TV modernes, vous n'êtes jamais obligé d'utiliser les flèches de la télécommande pour taper lettre par lettre :
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
                  <li>Sur <strong className="text-white">Android TV / Google TV</strong> : Ouvrez l'application <strong className="text-[#c5b392]">Google TV</strong> sur votre téléphone (bouton « Télécommande »). Dès que le curseur est dans la barre d'adresse de la télé, votre téléphone affiche le clavier : faites simplement <strong className="text-white">« Coller »</strong> !</li>
                  <li>Sur <strong className="text-white">Samsung</strong> : Utilisez l'application <strong className="text-[#c5b392]">Samsung SmartThings</strong>.</li>
                  <li>Sur <strong className="text-white">LG</strong> : Utilisez l'application <strong className="text-[#c5b392]">LG ThinQ</strong>.</li>
                </ul>
              </div>

              {/* Tip 2: Send Tab / Cast from Phone */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
                <div className="flex items-center gap-2 font-medium text-white text-sm">
                  <Send className="w-4 h-4 text-[#c5b392]" />
                  <span>Astuce 2 : Ouvrir sur son téléphone et faire « Envoyer à la TV »</span>
                </div>
                <p className="text-slate-400 text-xs">
                  Si votre smartphone et votre télévision sont connectés au même réseau Wi-Fi avec le même compte Google :
                  ouvrez la page sur Google Chrome sur votre smartphone ou PC, cliquez sur le menu (les 3 points) puis sur <strong className="text-white">« Caster / Envoyer à vos appareils »</strong> et sélectionnez votre télévision. La page s'ouvre toute seule sur l'écran !
                </p>
              </div>

              {/* Tip 3: Bookmark once and for all */}
              <div className="p-4 rounded-2xl bg-[#c5b392]/5 border border-[#c5b392]/20 space-y-2">
                <div className="flex items-center gap-2 font-medium text-white text-sm">
                  <Star className="w-4 h-4 text-[#c5b392]" />
                  <span>Astuce 3 : L'opération ne se fait qu'UNE SEULE FOIS (Favoris TV)</span>
                </div>
                <p className="text-slate-300 text-xs">
                  Une fois la page ouverte sur la télévision la première fois :
                </p>
                <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1 font-normal">
                  <li>Appuyez sur l'icône <strong className="text-white">⭐ Favoris</strong> ou « Ajouter à l'écran d'accueil ».</li>
                  <li>Vous n'aurez plus <strong className="text-[#c5b392]">JAMAIS</strong> besoin de retaper l'adresse !</li>
                  <li>Quand vous changerez le nom du voyageur depuis votre téléphone à Ouagadougou, l'écran de la télé se mettra à jour à distance automatiquement sans rien toucher sur la télé.</li>
                </ol>
              </div>

            </div>
          )}

          {activeTvType === 'android' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] text-slate-200 text-xs">
                💡 <span className="font-medium text-[#c5b392]">Le meilleur confort hôtelier :</span> L'application gratuite <span className="font-medium text-white">Fully Kiosk Browser</span> ou <span className="font-medium text-white">TV Bro</span> disponible sur le Play Store de votre Android TV.
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex gap-3.5 items-start">
                  <div className="w-6 h-6 rounded-full bg-white/[0.04] border border-white/10 text-[#c5b392] flex items-center justify-center font-serif text-xs shrink-0">1</div>
                  <div>
                    <div className="font-medium text-white">Installer Fully Kiosk Browser</div>
                    <div className="text-slate-400 mt-0.5">Sur le Google Play Store de votre téléviseur, cherchez et installez « Fully Kiosk Browser ».</div>
                  </div>
                </div>

                <div className="flex gap-3.5 items-start">
                  <div className="w-6 h-6 rounded-full bg-white/[0.04] border border-white/10 text-[#c5b392] flex items-center justify-center font-serif text-xs shrink-0">2</div>
                  <div>
                    <div className="font-medium text-white">Définir l'URL de démarrage</div>
                    <div className="text-slate-400 mt-0.5">Saisissez le lien court généré ci-dessus dans les paramètres de Fully Kiosk.</div>
                  </div>
                </div>

                <div className="flex gap-3.5 items-start">
                  <div className="w-6 h-6 rounded-full bg-white/[0.04] border border-white/10 text-[#c5b392] flex items-center justify-center font-serif text-xs shrink-0">3</div>
                  <div>
                    <div className="font-medium text-white">Démarrage automatique à l'allumage</div>
                    <div className="text-slate-400 mt-0.5">Cochez « Start on Boot ». Dès que la TV s'allume, l'accueil Sãan Degree s'affiche instantanément en plein écran sans aucune manipulation.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTvType === 'samsung_lg' && (
            <div className="space-y-4">
              <div className="space-y-3 pt-2">
                <div className="flex gap-3.5 items-start">
                  <div className="w-6 h-6 rounded-full bg-white/[0.04] border border-white/10 text-[#c5b392] flex items-center justify-center font-serif text-xs shrink-0">1</div>
                  <div>
                    <div className="font-medium text-white">Ouvrir le navigateur de la TV</div>
                    <div className="text-slate-400 mt-0.5">Sur Samsung : ouvrez « Samsung Internet ». Sur LG : ouvrez « Navigateur Web ».</div>
                  </div>
                </div>

                <div className="flex gap-3.5 items-start">
                  <div className="w-6 h-6 rounded-full bg-white/[0.04] border border-white/10 text-[#c5b392] flex items-center justify-center font-serif text-xs shrink-0">2</div>
                  <div>
                    <div className="font-medium text-white">Entrez le lien court</div>
                    <div className="text-slate-400 mt-0.5">Tapez simplement le lien court affiché en haut de cette fenêtre.</div>
                  </div>
                </div>

                <div className="flex gap-3.5 items-start">
                  <div className="w-6 h-6 rounded-full bg-white/[0.04] border border-white/10 text-[#c5b392] flex items-center justify-center font-serif text-xs shrink-0">3</div>
                  <div>
                    <div className="font-medium text-white">Épingler sur la page d'accueil de la TV</div>
                    <div className="text-slate-400 mt-0.5">Dans les options du navigateur, cliquez sur « Ajouter aux Favoris » ou « Épingler au menu d'accueil ». L'icône Sãan Degree apparaîtra aux côtés de Netflix et YouTube !</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTvType === 'firetv' && (
            <div className="space-y-4">
              <div className="space-y-3 pt-2">
                <div className="flex gap-3.5 items-start">
                  <div className="w-6 h-6 rounded-full bg-white/[0.04] border border-white/10 text-[#c5b392] flex items-center justify-center font-serif text-xs shrink-0">1</div>
                  <div>
                    <div className="font-medium text-white">Ouvrir le navigateur Amazon Silk</div>
                    <div className="text-slate-400 mt-0.5">Installé par défaut sur toutes les clés Fire TV.</div>
                  </div>
                </div>

                <div className="flex gap-3.5 items-start">
                  <div className="w-6 h-6 rounded-full bg-white/[0.04] border border-white/10 text-[#c5b392] flex items-center justify-center font-serif text-xs shrink-0">2</div>
                  <div>
                    <div className="font-medium text-white">Entrer le lien court</div>
                    <div className="text-slate-400 mt-0.5">Enregistrez-le dans les favoris ou en page d'accueil Silk.</div>
                  </div>
                </div>

                <div className="flex gap-3.5 items-start">
                  <div className="w-6 h-6 rounded-full bg-white/[0.04] border border-white/10 text-[#c5b392] flex items-center justify-center font-serif text-xs shrink-0">3</div>
                  <div>
                    <div className="font-medium text-white">Plein écran</div>
                    <div className="text-slate-400 mt-0.5">Appuyez sur la touche Menu de la télécommande Fire TV pour basculer en plein écran immersif.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/[0.08] bg-[#08090d] flex items-center justify-between">
          <div className="text-xs text-slate-400 font-light">
            Configuration unique : une fois enregistrée, la TV est autonome pour toujours.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-white rounded-xl text-xs font-medium transition"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};

