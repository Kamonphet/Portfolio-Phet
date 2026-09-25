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

// ─────────────────────────────────────────────
// STORAGE — Upload Image with Cloud + Base64 Fallback
// ─────────────────────────────────────────────
export const uploadPortfolioImage = async (file, folder = 'projects') => {
  if (!file) return { success: false, error: 'ไม่ได้เลือกไฟล์ภาพ' };

  const mime = (file.type || '').toLowerCase();
  const name = (file.name || '').toLowerCase();
  const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];

  const hasValidExt = allowedExts.some((ext) => name.endsWith(ext));
  const hasValidMime = allowedMimes.includes(mime);

  if (
    mime.includes('gif') ||
    mime.includes('svg') ||
    mime.includes('bmp') ||
    name.endsWith('.gif') ||
    name.endsWith('.svg') ||
    name.endsWith('.bmp') ||
    (!hasValidMime && !hasValidExt)
  ) {
    return { success: false, error: 'ระบบรองรับเฉพาะไฟล์รูปภาพประเภท .jpg, .png, .webp เท่านั้น' };
  }

  // Max 5MB
  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: 'ขนาดไฟล์ภาพต้องไม่เกิน 5MB' };
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      const fileExt = file.name.split('.').pop() || 'png';
      const cleanFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `${folder}/${cleanFileName}`;

      const { data, error } = await supabase.storage
        .from('portfolio-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!error && data) {
        const { data: urlData } = supabase.storage
          .from('portfolio-media')
          .getPublicUrl(filePath);

        if (urlData?.publicUrl) {
          return { success: true, url: urlData.publicUrl, isCloud: true };
        }
      }
    } catch (err) {
      console.warn('[Supabase Storage] Upload error, falling back to local encoding:', err.message);
    }
  }

  // High-reliability Fallback: Read as Base64 Data URL so user is never blocked
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve({ success: true, url: e.target.result, isCloud: false });
    };
    reader.onerror = () => {
      resolve({ success: false, error: 'ไม่สามารถอ่านไฟล์ภาพได้' });
    };
    reader.readAsDataURL(file);
  });
};

// ─────────────────────────────────────────────
// CONTACT — Save message to contact_messages table
// ─────────────────────────────────────────────
export const saveContactMessage = async ({ name, email, subject, message }) => {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: 'Database not connected' };

  try {
    const { data, error } = await supabase.from('contact_messages').insert([
      {
        name: name?.trim() || 'Anonymous',
        email: email?.trim(),
        subject: subject?.trim() || 'General Inquiry',
        message: message?.trim(),
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      // If table doesn't exist yet, don't break UI
      console.warn('[Supabase] contact_messages write note:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
