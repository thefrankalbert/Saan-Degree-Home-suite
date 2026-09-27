import { createClient } from '@supabase/supabase-js';

// User Supabase Project credentials
const DEFAULT_SUPABASE_URL = 'https://lseyghdywdzonvmpiovc.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_iCC9Wz69YG0rhG5y3W4LxA_LMUq0j-g';

// Safe access to environment variables in Vite (import.meta.env) with fallback to process.env
const getEnvVar = (key: string): string => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      return String(import.meta.env[key]);
    }
  } catch {
    // Ignore
  }
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return String(process.env[key]);
    }
  } catch {
    // Ignore
  }
  return '';
};

const supabaseUrl = 
  getEnvVar('VITE_SUPABASE_URL') || 
  getEnvVar('NEXT_PUBLIC_SUPABASE_URL') || 
  getEnvVar('SUPABASE_URL') || 
  DEFAULT_SUPABASE_URL;

const supabaseAnonKey = 
  getEnvVar('VITE_SUPABASE_ANON_KEY') || 
  getEnvVar('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY') || 
  getEnvVar('SUPABASE_ANON_KEY') || 
  DEFAULT_SUPABASE_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;


