import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Maximize2, 
  Smartphone, 
  Wifi, 
  Monitor, 
  Radio,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  CornerDownLeft,
  Hash
} from 'lucide-react';

interface TVTesterModalProps {
  onClose: () => void;
}

export const TVTesterModal: React.FC<TVTesterModalProps> = ({ onClose }) => {
  const [pressedKeys, setPressedKeys] = useState<{ [key: string]: boolean }>({});
  const [lastKeyPressed, setLastKeyPressed] = useState<string>('Aucune touche pressée');
  const [screenInfo, setScreenInfo] = useState<{ width: number; height: number; dpr: number; userAgent: string }>({
    width: 0,
    height: 0,
    dpr: 1,
    userAgent: ''
  });
  const [isFullscreenActive, setIsFullscreenActive] = useState<boolean>(false);

  useEffect(() => {
    setScreenInfo({
      width: window.screen.width,
      height: window.screen.height,
      dpr: window.devicePixelRatio || 1,
      userAgent: navigator.userAgent
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      setLastKeyPressed(`${e.key} (code: ${e.code || e.keyCode})`);
      setPressedKeys(prev => ({ ...prev, [e.key]: true }));

      // Temporary blink
      setTimeout(() => {
        setPressedKeys(prev => ({ ...prev, [e.key]: false }));
      }, 600);
    };

    const handleFullscreenChange = () => {
      setIsFullscreenActive(!!document.fullscreenElement);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const isAndroidTV = screenInfo.userAgent.toLowerCase().includes('android');
  const isTizen = screenInfo.userAgent.toLowerCase().includes('tizen');
  const isWebOS = screenInfo.userAgent.toLowerCase().includes('web0s') || screenInfo.userAgent.toLowerCase().includes('webos');
  const isSilk = screenInfo.userAgent.toLowerCase().includes('silk');

  let detectedPlatform = 'Navigateur standard (PC / Mac / Tablette)';
  if (isAndroidTV) detectedPlatform = 'Android TV / Google TV détecté';
  else if (isTizen) detectedPlatform = 'Samsung Smart TV (Tizen OS) détecté';
  else if (isWebOS) detectedPlatform = 'LG Smart TV (WebOS) détecté';
  else if (isSilk) detectedPlatform = 'Amazon Fire TV (Silk Browser) détecté';

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0c0e14] border border-white/[0.08] rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-[#c5b392]/30 text-[#c5b392] flex items-center justify-center">
              <Tv className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-lg font-normal text-white font-serif tracking-wide">
                Banc de Test & Diagnostic Téléviseur
              </h2>
              <p className="text-xs text-slate-400 font-light">
                Vérifiez la compatibilité de votre écran et de votre télécommande
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.06] transition"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 font-light flex-1">
          
          {/* Diagnostic Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="p-4 rounded-2xl bg-[#08090d] border border-white/[0.06] space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-[#c5b392] font-medium flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5" />
                <span>Résolution Écran</span>
              </div>
              <div className="text-base font-mono font-medium text-white">
                {screenInfo.width} × {screenInfo.height}
              </div>
              <div className="text-[11px] text-slate-500">
                {screenInfo.width >= 3840 ? 'Écran 4K Ultra HD' : screenInfo.width >= 1920 ? 'Écran Full HD 1080p' : 'Écran Standard'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#08090d] border border-white/[0.06] space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-[#c5b392] font-medium flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5" />
                <span>Système Détecté</span>
              </div>
              <div className="text-sm font-medium text-white font-serif truncate">
                {detectedPlatform}
              </div>
              <div className="text-[11px] text-[#c5b392]">
                100% compatible Kiosk Web
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#08090d] border border-white/[0.06] space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-[#c5b392] font-medium flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Mode Plein Écran</span>
              </div>
              <div className="text-sm font-medium text-white flex items-center gap-1.5">
                {isFullscreenActive ? (
                  <span className="text-emerald-400 font-medium">Actif (Plein écran immersif)</span>
                ) : (
                  <span className="text-slate-400">Fenêtré</span>
                )}
              </div>
              <button
                onClick={toggleFullscreen}
                className="text-[10px] text-[#c5b392] hover:underline pt-0.5"
              >
                {isFullscreenActive ? 'Quitter plein écran' : 'Passer en plein écran'}
              </button>
            </div>

          </div>

          {/* Interactive Remote Control Test Area */}
          <div className="p-6 rounded-3xl bg-[#08090d] border border-white/[0.08] space-y-4 text-center">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-[#c5b392] font-medium">
                Test en direct de votre Télécommande TV
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Pointez votre télécommande vers la télé et appuyez sur les flèches ou chiffres. Les touches correspondantes s'allument en direct.
              </p>
            </div>

            {/* Virtual Remote Display */}
            <div className="max-w-md mx-auto py-2 grid grid-cols-3 gap-2.5">
              
              {/* Up */}
              <div className="col-start-2">
                <div className={`p-3 rounded-2xl border transition duration-200 flex flex-col items-center gap-1 ${
                  pressedKeys['ArrowUp'] 
                    ? 'bg-[#c5b392] text-[#08090d] border-[#c5b392] scale-105 shadow-lg shadow-[#c5b392]/30' 
                    : 'bg-white/[0.02] border-white/[0.08] text-slate-300'
                }`}>
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-[10px] font-mono">Haut</span>
                </div>
              </div>

              {/* Left, OK, Right */}
              <div className="col-start-1 row-start-2">
                <div className={`p-3 rounded-2xl border transition duration-200 flex flex-col items-center gap-1 ${
                  pressedKeys['ArrowLeft'] 
                    ? 'bg-[#c5b392] text-[#08090d] border-[#c5b392] scale-105 shadow-lg shadow-[#c5b392]/30' 
                    : 'bg-white/[0.02] border-white/[0.08] text-slate-300'
                }`}>
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-[10px] font-mono">Gauche (◀)</span>
                </div>
              </div>

              <div className="col-start-2 row-start-2">
                <div className={`p-3 rounded-2xl border transition duration-200 flex flex-col items-center gap-1 ${
                  pressedKeys['Enter'] || pressedKeys['Select'] 
                    ? 'bg-[#c5b392] text-[#08090d] border-[#c5b392] scale-105 shadow-lg shadow-[#c5b392]/30' 
                    : 'bg-white/[0.04] border-white/15 text-white font-semibold'
                }`}>
                  <CornerDownLeft className="w-4 h-4 text-[#c5b392]" />
                  <span className="text-[10px] font-mono">OK / Enter</span>
                </div>
              </div>

              <div className="col-start-3 row-start-2">
                <div className={`p-3 rounded-2xl border transition duration-200 flex flex-col items-center gap-1 ${
                  pressedKeys['ArrowRight'] 
                    ? 'bg-[#c5b392] text-[#08090d] border-[#c5b392] scale-105 shadow-lg shadow-[#c5b392]/30' 
                    : 'bg-white/[0.02] border-white/[0.08] text-slate-300'
                }`}>
                  <ArrowRight className="w-4 h-4" />
                  <span className="text-[10px] font-mono">Droite (▶)</span>
                </div>
              </div>

              {/* Down */}
              <div className="col-start-2 row-start-3">
                <div className={`p-3 rounded-2xl border transition duration-200 flex flex-col items-center gap-1 ${
                  pressedKeys['ArrowDown'] 
                    ? 'bg-[#c5b392] text-[#08090d] border-[#c5b392] scale-105 shadow-lg shadow-[#c5b392]/30' 
                    : 'bg-white/[0.02] border-white/[0.08] text-slate-300'
                }`}>
                  <ArrowDown className="w-4 h-4" />
                  <span className="text-[10px] font-mono">Bas</span>
                </div>
              </div>

            </div>

            {/* Numbers Row */}
            <div className="flex justify-center gap-2 pt-2">
              {['1', '2', '3', '4', '5'].map((num) => (
                <div 
                  key={num}
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center font-mono text-xs transition duration-200 ${
                    pressedKeys[num] 
                      ? 'bg-[#c5b392] text-[#08090d] border-[#c5b392] scale-110 shadow-md' 
                      : 'bg-white/[0.02] border-white/[0.08] text-slate-400'
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>

            {/* Last detected keystroke indicator */}
            <div className="text-xs text-slate-400 pt-1 font-mono">
              Dernier signal reçu de la télécommande : <span className="text-[#c5b392] font-semibold">{lastKeyPressed}</span>
            </div>

          </div>

          {/* Checklist for Sãan Degree deployment */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
            <div className="font-medium text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#c5b392]" />
              <span>Protocole de validation pour votre téléviseur à Ouaga 2000 :</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-400 pl-1 text-[11px] leading-relaxed">
              <li><strong className="text-white">Étape 1 :</strong> Connectez la TV au Wi-Fi de l'appartement (`Saan_Degree_Fiber_5G`).</li>
              <li><strong className="text-white">Étape 2 :</strong> Ouvrez le navigateur de la TV et saisissez l'adresse de votre application.</li>
              <li><strong className="text-white">Étape 3 :</strong> Appuyez sur les touches [◀ ▶] de la télécommande pour voir défiler les rubriques.</li>
              <li><strong className="text-white">Étape 4 :</strong> Sortez votre smartphone et scannez le QR code Wi-Fi sur l'écran pour confirmer la connexion instantanée.</li>
            </ol>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/[0.08] bg-[#08090d] flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Audit télécommande conforme aux normes CEC et Smart TV Web
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#c5b392] hover:bg-[#d8ccb8] text-[#08090d] rounded-xl text-xs font-semibold transition"
          >
            Terminer le test
          </button>
        </div>

      </div>
    </div>
  );
};
