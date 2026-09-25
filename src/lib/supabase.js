import { createClient } from '@supabase/supabase-js';

// Clean up any legacy localStorage entries for security
try {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('cyber_supabase_url');
    localStorage.removeItem('cyber_supabase_anon_key');
  }
} catch (e) {}

/**
 * Returns configuration strictly from environment variables (.env)
 */
export const getSupabaseConfig = () => {
  const url = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const anonKey = (
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    ''
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
 * Check if Supabase is configured via .env
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
