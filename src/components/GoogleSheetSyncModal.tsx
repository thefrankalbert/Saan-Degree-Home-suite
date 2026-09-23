import React, { useState } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  RefreshCw, 
  Download, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Property, GuestStay } from '../types';

interface GoogleSheetSyncModalProps {
  properties: Property[];
  onApplySync: (updatedProperties: Property[]) => void;
  onClose: () => void;
}

export const GoogleSheetSyncModal: React.FC<GoogleSheetSyncModalProps> = ({ 
  properties, 
  onApplySync, 
  onClose 
}) => {
  const [sheetUrl, setSheetUrl] = useState<string>('https://docs.google.com/spreadsheets/d/e/2PACX-1vSampleLodgeCast/pub?output=csv');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncSuccess, setSyncSuccess] = useState<boolean>(false);
  const [previewRows] = useState<{
    propSlug: string;
    guestName: string;
    checkIn: string;
    checkOut: string;
    welcomeMsg: string;
    doorCode: string;
  }[]>([
    {
      propSlug: 'marais-prestige',
      guestName: 'Madame Céleste Vaneau',
      checkIn: '2026-09-24',
      checkOut: '2026-09-29',
      welcomeMsg: 'Bienvenue à Paris. Nous restons à votre entière disposition.',
      doorCode: '4829A'
    },
    {
      propSlug: 'chalet-etoile',
      guestName: 'Alexandre & Marine D.',
      checkIn: '2026-09-25',
      checkOut: '2026-09-30',
      welcomeMsg: 'Bienvenue au sommet à Chamonix. Repos et sérénité.',
      doorCode: '7721#'
    },
    {
      propSlug: 'villa-azur',
      guestName: 'M. et Mme Laroche',
      checkIn: '2026-09-23',
      checkOut: '2026-09-27',
      welcomeMsg: 'Séjour d’exception sous le soleil de la Côte d’Azur.',
      doorCode: '1974B'
    }
  ]);

  const handleSimulateSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const updated = properties.map((prop) => {
        const matchingRow = previewRows.find(r => r.propSlug === prop.slug);
        if (!matchingRow) return prop;

        const newCurrentStay: GuestStay = {
          ...prop.currentStay,
          id: `stay-sync-${Date.now()}-${Math.random()}`,
          name: matchingRow.guestName,
          checkInDate: matchingRow.checkIn,
          checkOutDate: matchingRow.checkOut,
          welcomeMessage: matchingRow.welcomeMsg,
          status: 'active'
        };

        return {
          ...prop,
          doorCode: matchingRow.doorCode || prop.doorCode,
          currentStay: newCurrentStay,
          updatedAt: new Date().toISOString()
        };
      });

      onApplySync(updated);
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => {
        setSyncSuccess(false);
        onClose();
      }, 1500);
    }, 1000);
  };

  const downloadCsvTemplate = () => {
    const headers = ['Logement_Slug', 'Nom_Voyageur', 'Date_Arrivee', 'Date_Depart', 'Heure_Depart', 'Message_Bienvenue', 'Note_VIP', 'Code_Porte'];
    const rows = properties.map(p => [
      p.slug,
      p.currentStay.name,
      p.currentStay.checkInDate,
      p.currentStay.checkOutDate,
      p.currentStay.checkOutTime,
      `"${p.currentStay.welcomeMessage || ''}"`,
      `"${p.currentStay.specialNote || ''}"`,
      p.doorCode
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'reservations_lodgecast.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0c0e14] border border-white/[0.08] rounded-3xl max-w-2xl w-full flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-white/10 text-[#c5b392] flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-lg font-normal text-white font-serif tracking-wide">
                Synchronisation Google Sheets & Tableur
              </h2>
              <p className="text-xs text-slate-400 font-light">Automatisez les noms des voyageurs à distance</p>
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
        <div className="p-6 space-y-5 text-xs text-slate-300 font-light leading-relaxed">
          
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] text-slate-300 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-[#c5b392] shrink-0 mt-0.5" strokeWidth={1.5} />
            <div>
              <span className="font-medium text-white">Principe de fonctionnement :</span> Vous ou votre équipe de conciergerie mettez à jour votre Google Sheet partagé. Les téléviseurs interrogent la feuille et actualisent le message de bienvenue en moins de 60 secondes.
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#c5b392] font-medium block">
              Lien de votre Google Sheet (Fichier &gt; Partager &gt; Publier sur le web &gt; format CSV) :
            </label>
            <input 
              type="text"
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              className="w-full bg-[#08090d] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#c5b392]/50"
            />
          </div>

          {/* Preview rows */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-[0.15em] text-[#c5b392] font-medium">
                Aperçu des réservations détectées :
              </span>
              <button
                onClick={downloadCsvTemplate}
                className="text-xs text-slate-300 hover:text-white flex items-center gap-1 font-medium transition"
              >
                <Download className="w-3.5 h-3.5 text-[#c5b392]" strokeWidth={1.5} />
                <span>Télécharger le modèle .CSV</span>
              </button>
            </div>

            <div className="bg-[#08090d] rounded-2xl border border-white/[0.08] overflow-hidden">
              <table className="w-full text-left text-xs font-light">
                <thead className="bg-white/[0.02] text-slate-400 border-b border-white/[0.06] font-medium">
                  <tr>
                    <th className="p-3">Logement</th>
                    <th className="p-3">Voyageur</th>
                    <th className="p-3">Dates</th>
                    <th className="p-3">Digicode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {previewRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition">
                      <td className="p-3 font-mono text-[#c5b392]">{row.propSlug}</td>
                      <td className="p-3 font-serif font-medium text-white">{row.guestName}</td>
                      <td className="p-3 text-slate-400">{row.checkIn} → {row.checkOut}</td>
                      <td className="p-3 font-mono text-slate-300">{row.doorCode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/[0.08] bg-[#08090d] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-400 hover:text-white text-xs font-medium transition"
          >
            Annuler
          </button>

          <button
            onClick={handleSimulateSync}
            disabled={isSyncing || syncSuccess}
            className="px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 transition bg-[#c5b392] hover:bg-[#d8ccb8] text-[#08090d] shadow-lg shadow-[#c5b392]/15"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Lecture du fichier...</span>
              </>
            ) : syncSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Synchronisé avec succès !</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" strokeWidth={1.5} />
                <span>Appliquer la synchronisation</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
