import { createClient } from '@supabase/supabase-js';

const STORAGE_URL_KEY = 'cyber_supabase_url';
const STORAGE_KEY_KEY = 'cyber_supabase_anon_key';

/**
 * Returns current configuration from env or localStorage
 */
export const getSupabaseConfig = () => {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  let localUrl = '';
  let localKey = '';
  try {
    if (typeof localStorage !== 'undefined') {
      localUrl = (localStorage.getItem(STORAGE_URL_KEY) || '').trim();
      localKey = (localStorage.getItem(STORAGE_KEY_KEY) || '').trim();
    }
  } catch (e) {
    // localStorage might be unavailable in some restricted modes
  }

  const url = envUrl || localUrl;
  const anonKey = envKey || localKey;

  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey),
    source: envUrl && envKey ? 'env' : localUrl && localKey ? 'local' : 'none',
  };
};

let cachedClient = null;
let cachedKey = '';

/**
 * Gets or creates the Supabase client instance dynamically
 */
export const getSupabase = () => {
  const { url, anonKey, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  const key = `${url}___${anonKey}`;
  if (!cachedClient || cachedKey !== key) {
    try {
      cachedClient = createClient(url, anonKey, {
        realtime: { params: { eventsPerSecond: 5 } },
      });
      cachedKey = key;
    } catch (err) {
      console.error('[Supabase] Failed to initialize client:', err);
      return null;
    }
  }

  return cachedClient;
};

/**
 * Save credentials to localStorage (for web UI configuration)
 */
export const setSupabaseLocalConfig = (url, anonKey) => {
  try {
    if (url && anonKey) {
      localStorage.setItem(STORAGE_URL_KEY, url.trim());
      localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
    } else {
      localStorage.removeItem(STORAGE_URL_KEY);
      localStorage.removeItem(STORAGE_KEY_KEY);
    }
    cachedClient = null;
    cachedKey = '';
    return true;
  } catch (e) {
    console.error('Failed to save Supabase config to localStorage', e);
    return false;
  }
};

/**
 * Clears stored credentials from localStorage
 */
export const clearSupabaseLocalConfig = () => {
  try {
    localStorage.removeItem(STORAGE_URL_KEY);
    localStorage.removeItem(STORAGE_KEY_KEY);
    cachedClient = null;
    cachedKey = '';
  } catch (e) {}
};

/**
 * Reactive check if Supabase is currently configured
 */
export const checkIsSupabaseConfigured = () => {
  return getSupabaseConfig().isConfigured;
};

// Backwards-compatible export (getter)
export const isSupabaseConfigured = checkIsSupabaseConfigured();

// Direct proxy for legacy imports
export const supabase = new Proxy({}, {
  get(target, prop) {
    const client = getSupabase();
    if (!client) return undefined;
    const value = client[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});
