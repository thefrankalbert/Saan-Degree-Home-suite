import React, { useState } from 'react';
import { Lock, ShieldCheck, AlertCircle, X, Sparkles } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticated,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      // 1. If Supabase is configured, authenticate via Supabase Auth
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMsg('Identifiants incorrects ou compte non autorisé.');
          setIsLoading(false);
          return;
        }
      } else {
        // 2. Local Master Pin/Password fallback if Supabase env is not yet entered
        // Default passcode: SaanOuaga2026 or custom password
        if (password !== 'SaanOuaga2026' && password !== 'admin') {
          setErrorMsg('Code d’accès gestionnaire incorrect.');
          setIsLoading(false);
          return;
        }
      }

      onAuthenticated();
      onClose();
    } catch {
      setErrorMsg('Erreur lors de la vérification.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#06070a]/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="relative w-full max-w-md bg-[#0d0f16] border border-[#c5b392]/30 rounded-3xl p-8 shadow-2xl shadow-black/80 animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Monogram & Title */}
        <div className="flex flex-col items-center text-center space-y-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#c5b392]/10 border border-[#c5b392]/30 flex items-center justify-center text-[#c5b392]">
            <Lock className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c5b392]/10 text-[#c5b392] text-[10px] font-medium tracking-widest uppercase mb-1">
              <Sparkles className="w-3 h-3" />
              Espace Restreint
            </div>
            <h3 className="text-xl font-light text-white tracking-wide">Accès Conciergerie</h3>
            <p className="text-xs text-slate-400 font-light mt-0.5">
              Authentification requise pour modifier les séjours et paramètres
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSupabaseConfigured && (
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                Email Professionnel
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="gestionnaire@saandegree.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#c5b392]/60 transition"
              />
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
              {isSupabaseConfigured ? 'Mot de passe' : 'Code d’accès Conciergerie'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#c5b392]/60 transition font-mono"
            />
            {!isSupabaseConfigured && (
              <p className="text-[10px] text-slate-500 mt-1">
                Mode local actif. Code maître par défaut : <span className="font-mono text-[#c5b392]">SaanOuaga2026</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-[#c5b392] hover:bg-[#d8ccb8] text-[#08090d] text-xs font-semibold tracking-wide uppercase shadow-lg shadow-[#c5b392]/20 flex items-center justify-center gap-2 transition disabled:opacity-50 mt-6"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isLoading ? 'Vérification...' : 'Déverrouiller l’accès'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
