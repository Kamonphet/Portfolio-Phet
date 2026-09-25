import { createClient } from '@supabase/supabase-js';

// Project credentials from Supabase
const DEFAULT_SUPABASE_URL = 'https://nhsudgerhyqjrnwxdcbo.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_hvFvHt0zY6aMRjgqWVgKcQ_wVrE6D9O';

/**
 * Returns configuration from environment variables (.env) with safe defaults
 */
export const getSupabaseConfig = () => {
  const url = (
    import.meta.env.VITE_SUPABASE_URL ||
    DEFAULT_SUPABASE_URL
  ).trim();

  const anonKey = (
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    DEFAULT_SUPABASE_KEY
  ).trim();

  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey),
  };
};

let clientInstance = null;

/**
 * Gets or creates the Supabase client instance
 */
export const getSupabase = () => {
  const { url, anonKey, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  if (!clientInstance) {
    try {
      clientInstance = createClient(url, anonKey, {
        realtime: { params: { eventsPerSecond: 5 } },
      });
    } catch (err) {
      console.error('[Supabase] Failed to initialize client:', err);
      return null;
    }
  }

  return clientInstance;
};

/**
 * Check if Supabase is configured
 */
export const checkIsSupabaseConfigured = () => {
  return getSupabaseConfig().isConfigured;
};

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
