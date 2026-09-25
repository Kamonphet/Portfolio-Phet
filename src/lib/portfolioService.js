/**
 * portfolioService.js
 * --------------------------------------------------
 * Data-access layer between PortfolioContext and Supabase.
 *
 * Table schema (one row per language: 'th', 'en', 'settings')
 *
 * portfolio_data:
 *   id          BIGSERIAL PRIMARY KEY
 *   language    TEXT UNIQUE NOT NULL   -- 'th' | 'en' | 'settings'
 *   hero        JSONB
 *   about       JSONB
 *   skills      JSONB
 *   projects    JSONB
 *   experience  JSONB
 *   contact     JSONB
 *   settings    JSONB
 *   updated_at  TIMESTAMPTZ DEFAULT NOW()
 */

import { getSupabase } from './supabase';

const TABLE = 'portfolio_data';

// ─────────────────────────────────────────────
// TEST CONNECTION — check if URL, key and table work
// ─────────────────────────────────────────────
export const testSupabaseConnection = async () => {
  const supabase = getSupabase();
  if (!supabase) {
    return {
      success: false,
      error: 'Supabase credentials not configured. Please provide URL and Anon Key.',
    };
  }

  try {
    const { data, error } = await supabase.from(TABLE).select('language').limit(1);

    if (error) {
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return {
          success: false,
          isMissingTable: true,
          error: `Table '${TABLE}' does not exist yet. Please run the SQL schema in your Supabase SQL Editor.`,
        };
      }
      return {
        success: false,
        error: error.message || 'Error querying database.',
      };
    }

    return {
      success: true,
      message: 'Successfully connected to Supabase!',
      rowsFound: data?.length || 0,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Connection failed.',
    };
  }
};

// ─────────────────────────────────────────────
// READ  — fetch ALL rows and reconstruct the
//         { th, en, settings } allData object
// ─────────────────────────────────────────────
export const fetchAllData = async () => {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.from(TABLE).select('*');
    if (error) throw error;
    if (!data || data.length === 0) return null;

    const result = {};
    data.forEach((row) => {
      if (row.language === 'settings') {
        result.settings = row.settings || {};
      } else {
        result[row.language] = {
          hero:       row.hero       || {},
          about:      row.about      || {},
          skills:     row.skills     || [],
          projects:   row.projects   || [],
          experience: row.experience || [],
          contact:    row.contact    || {},
        };
      }
    });

    return result;
  } catch (err) {
    console.error('[Supabase] fetchAllData error:', err.message);
    return null;
  }
};

// ─────────────────────────────────────────────
// WRITE — upsert an entire language row
// ─────────────────────────────────────────────
export const saveLanguageData = async (language, langData) => {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const payload =
      language === 'settings'
        ? { language, settings: langData, updated_at: new Date().toISOString() }
        : {
            language,
            hero:       langData.hero       || null,
            about:      langData.about      || null,
            skills:     langData.skills     || null,
            projects:   langData.projects   || null,
            experience: langData.experience || null,
            contact:    langData.contact    || null,
            updated_at: new Date().toISOString(),
          };

    const { error } = await supabase
      .from(TABLE)
      .upsert(payload, { onConflict: 'language' });

    if (error) throw error;
    return true;
  } catch (err) {
    console.error(`[Supabase] saveLanguageData('${language}') error:`, err.message);
    return false;
  }
};

// ─────────────────────────────────────────────
// PUSH ALL — upsert th, en, settings rows
// ─────────────────────────────────────────────
export const pushAllDataToCloud = async (allData) => {
  const supabase = getSupabase();
  if (!supabase || !allData) return { success: false, error: 'Database not configured' };

  try {
    const writes = [];
    if (allData.th) writes.push(saveLanguageData('th', allData.th));
    if (allData.en) writes.push(saveLanguageData('en', allData.en));
    if (allData.settings) writes.push(saveLanguageData('settings', allData.settings));

    const results = await Promise.all(writes);
    const success = results.every(Boolean);

    if (success) {
      return { success: true, message: 'All portfolio data uploaded to Supabase!' };
    } else {
      return { success: false, error: 'Failed to write one or more datasets.' };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// ─────────────────────────────────────────────
// INIT — push current allData → Supabase if DB
//        is empty (first-time migration)
// ─────────────────────────────────────────────
export const initSupabaseFromLocalData = async (allData) => {
  const supabase = getSupabase();
  if (!supabase) return;

  const existing = await fetchAllData();
  if (existing && Object.keys(existing).length > 0) return; // already has data

  await pushAllDataToCloud(allData);
  console.log('[Supabase] Initial data pushed to cloud ✅');
};

// ─────────────────────────────────────────────
// REALTIME — subscribe to table changes
// Returns the channel object so caller can unsubscribe
// ─────────────────────────────────────────────
export const subscribeToPortfolio = (onRowChange) => {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const channel = supabase
      .channel('portfolio_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLE },
        (payload) => onRowChange(payload)
      )
      .subscribe();

    return channel;
  } catch (err) {
    console.error('[Supabase] Realtime subscription error:', err);
    return null;
  }
};

export const unsubscribeFromPortfolio = (channel) => {
  const supabase = getSupabase();
  if (channel && supabase) {
    try {
      supabase.removeChannel(channel);
    } catch (e) {}
  }
};
