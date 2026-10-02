/**
 * supabase.js (Legacy / Compatibility Bridge)
 * -------------------------------------------------------------
 * ไฟล์นี้ถูกเก็บไว้เพื่อให้เข้ากันได้กับโค้ดเดิม
 * ระบบปัจจุบันเปลี่ยนมาใช้ Google Sheets API (Google Apps Script) เรียบร้อยแล้ว
 */

import { isApiConfigured } from './googleSheetsApi';

export const isDbConfigured = isApiConfigured;
export const isSupabaseConfigured = isApiConfigured;
export const checkIsSupabaseConfigured = () => isApiConfigured;

export const getSupabase = () => null;

export const supabase = new Proxy({}, {
  get() {
    return () => Promise.resolve({ data: null, error: 'Database migrated to Google Sheets' });
  },
});
