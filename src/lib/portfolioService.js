/**
 * portfolioService.js
 * --------------------------------------------------
 * Data-access layer between PortfolioContext and Google Sheets API (Google Apps Script).
 *
 * Sheet schema (one row per language in 'portfolio_data' tab):
 * - language: 'th' | 'en' | 'settings'
 * - hero: JSON string
 * - about: JSON string
 * - skills: JSON string
 * - projects: JSON string
 * - experience: JSON string
 * - contact: JSON string
 * - settings: JSON string
 * - updated_at: ISO timestamp
 */

import { callApi, isApiConfigured } from './googleSheetsApi';

// ─────────────────────────────────────────────
// TEST CONNECTION — check if Google Sheets API works
// ─────────────────────────────────────────────
export const testApiConnection = async () => {
  if (!isApiConfigured) {
    return {
      success: false,
      error: 'Google Sheets API URL is not configured. Please set VITE_GOOGLE_SHEETS_API_URL in .env',
    };
  }

  try {
    const res = await callApi('ping', 'GET');
    if (res && res.success) {
      return {
        success: true,
        message: 'Successfully connected to Google Sheets API! 🚀',
        sheetName: res.sheetName,
      };
    }

    return {
      success: false,
      error: res?.error || 'Failed to ping Google Sheets API.',
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Connection to Google Sheets failed.',
    };
  }
};

// Backward-compatible alias
export const testSupabaseConnection = testApiConnection;

// ─────────────────────────────────────────────
// READ  — fetch ALL rows and reconstruct the
//         { th, en, settings } allData object
// ─────────────────────────────────────────────
export const fetchAllData = async () => {
  if (!isApiConfigured) return null;

  try {
    const res = await callApi('fetchAll', 'GET');
    if (!res || !res.success || !res.data) {
      return null;
    }

    const { data } = res;
    if (Object.keys(data).length === 0) return null;

    return {
      th: data.th || null,
      en: data.en || null,
      settings: data.settings || {},
    };
  } catch (err) {
    console.error('[Google Sheets] fetchAllData error:', err.message);
    return null;
  }
};

// ─────────────────────────────────────────────
// WRITE — save an entire language row
// ─────────────────────────────────────────────
export const saveLanguageData = async (language, langData) => {
  if (!isApiConfigured) return false;

  try {
    const res = await callApi('saveLanguage', 'POST', {
      language,
      data: langData,
    });

    if (res && res.success) {
      return true;
    }

    console.warn(`[Google Sheets] saveLanguageData('${language}') note:`, res?.error);
    return false;
  } catch (err) {
    console.error(`[Google Sheets] saveLanguageData('${language}') error:`, err.message);
    return false;
  }
};

// ─────────────────────────────────────────────
// PUSH ALL — save th, en, settings rows
// ─────────────────────────────────────────────
export const pushAllDataToCloud = async (allData) => {
  if (!isApiConfigured || !allData) {
    return { success: false, error: 'Google Sheets API not configured' };
  }

  try {
    const res = await callApi('saveAll', 'POST', {
      data: allData.th || allData,
      settings: allData.settings,
    });
    if (res && res.success) {
      return { success: true, message: 'All portfolio data uploaded to Google Sheets!' };
    }
    return { success: false, error: res?.error || 'Failed to save all data.' };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// ─────────────────────────────────────────────
// INIT — push current allData → Google Sheets if Sheet
//        is empty (first-time migration)
// ─────────────────────────────────────────────
export const initCloudFromLocalData = async (allData) => {
  if (!isApiConfigured) return;

  const existing = await fetchAllData();
  if (existing && (existing.th || existing.en || existing.settings)) return; // already has data

  await pushAllDataToCloud(allData);
  console.log('[Google Sheets] Initial data pushed to sheet ✅');
};

// Backward-compatible alias
export const initSupabaseFromLocalData = initCloudFromLocalData;

// ─────────────────────────────────────────────
// REALTIME / POLLING — Poll for external updates
// ─────────────────────────────────────────────
export const subscribeToPortfolio = (onRowChange) => {
  if (!isApiConfigured) return null;

  // Poll every 60 seconds for updates made in Google Sheets
  const intervalId = setInterval(async () => {
    try {
      const data = await fetchAllData();
      if (data) {
        if (data.th) onRowChange({ new: { language: 'th', ...data.th } });
        if (data.en) onRowChange({ new: { language: 'en', ...data.en } });
        if (data.settings) onRowChange({ new: { language: 'settings', settings: data.settings } });
      }
    } catch {
      // Ignore polling errors in background
    }
  }, 60000);

  return intervalId;
};

export const unsubscribeFromPortfolio = (channel) => {
  if (channel) {
    clearInterval(channel);
  }
};

// ─────────────────────────────────────────────
// STORAGE — Upload Image to Google Drive + Base64 Fallback
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

  // แปลงไฟล์เป็น Base64 Data URL
  const base64DataUrl = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });

  if (!base64DataUrl) {
    return { success: false, error: 'ไม่สามารถอ่านไฟล์ภาพได้' };
  }

  // พยายามอัปโหลดขึ้น Google Drive ผ่าน Google Apps Script API
  if (isApiConfigured) {
    try {
      const fileExt = file.name.split('.').pop() || 'png';
      const cleanFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

      const res = await callApi('uploadImage', 'POST', {
        base64: base64DataUrl,
        filename: cleanFileName,
        mimeType: mime || 'image/png',
        extension: fileExt,
        folder,
      });

      if (res && res.success && res.url) {
        return { success: true, url: res.url, isCloud: true };
      }
    } catch (err) {
      console.warn('[Google Sheets / Drive] Upload error, falling back to local encoding:', err.message);
    }
  }

  // High-reliability Fallback: Base64 Data URL ทำงานได้เสมอแม้ไม่ได้ต่อ Cloud
  return { success: true, url: base64DataUrl, isCloud: false };
};

// ─────────────────────────────────────────────
// CONTACT — Save message to contact_messages Google Sheet tab
// ─────────────────────────────────────────────
export const saveContactMessage = async ({ name, email, subject, message }) => {
  if (!isApiConfigured) {
    return { success: false, error: 'Google Sheets API not configured' };
  }

  try {
    const res = await callApi('saveContactMessage', 'POST', {
      name: name?.trim() || 'Anonymous',
      email: email?.trim(),
      subject: subject?.trim() || 'General Inquiry',
      message: message?.trim(),
    });

    if (res && res.success) {
      return { success: true, messageId: res.messageId };
    }

    return { success: false, error: res?.error || 'Failed to save message to Google Sheet' };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
