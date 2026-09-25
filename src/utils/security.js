/**
 * security.js
 * Security utility functions for input sanitization, safe URL handling, and image validation.
 */

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Sanitizes URLs to prevent javascript:, data:text/html, or malicious protocols from executing.
 * Only allows safe protocols: http, https, mailto, tel, relative paths, or anchors.
 * @param {string} url - The URL to sanitize
 * @param {string} fallback - Fallback URL if invalid
 * @returns {string} Safe URL
 */
export function sanitizeUrl(url, fallback = '#') {
  if (!url || typeof url !== 'string') return fallback;

  const trimmed = url.trim();

  // Disallow javascript: or data: URIs (except safe data:image/ for uploaded thumbnails)
  if (/^\s*javascript:/i.test(trimmed)) {
    return fallback;
  }

  if (/^\s*data:(?!image\/(jpeg|png|webp);base64,)/i.test(trimmed)) {
    return fallback;
  }

  // Allow standard safe protocols and relative paths for general links
  if (
    /^(https?:\/\/|mailto:|tel:|\/|#|data:image\/(jpeg|png|webp);base64,)/i.test(trimmed)
  ) {
    return trimmed;
  }

  // If protocol-less domain like "github.com/...", prepend https://
  if (/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  return fallback;
}

/**
 * Validates whether an uploaded file is a safe image (.jpg, .png, .webp only, <= 5MB).
 * @param {File} file
 * @param {number} maxSizeBytes (default: 5MB)
 * @param {boolean} isTh
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateImageFile(file, maxSizeBytes = MAX_IMAGE_SIZE_BYTES, isTh = true) {
  if (!file) {
    return {
      valid: false,
      error: isTh ? 'กรุณาเลือกไฟล์รูปภาพ' : 'No file selected.',
    };
  }

  const mime = (file.type || '').toLowerCase();
  const name = (file.name || '').toLowerCase();
  const hasValidExt = ALLOWED_IMAGE_EXTENSIONS.some((ext) => name.endsWith(ext));
  const hasValidMime = ALLOWED_IMAGE_TYPES.includes(mime);

  // Strictly block gif, svg, bmp, etc.
  if (
    mime.includes('gif') ||
    mime.includes('svg') ||
    mime.includes('bmp') ||
    name.endsWith('.gif') ||
    name.endsWith('.svg') ||
    name.endsWith('.bmp')
  ) {
    return {
      valid: false,
      error: isTh
        ? 'ไม่อนุญาตไฟล์ประเภทนี้ รองรับเฉพาะ .jpg, .png, .webp เท่านั้น'
        : 'Unsupported file format. Only .jpg, .png, and .webp are allowed.',
    };
  }

  if (!hasValidMime && !hasValidExt) {
    return {
      valid: false,
      error: isTh
        ? 'ประเภทไฟล์ไม่ถูกต้อง รองรับเฉพาะ .jpg, .png, .webp เท่านั้น'
        : 'Invalid file format. Only .jpg, .png, and .webp are supported.',
    };
  }

  if (file.size > maxSizeBytes) {
    const sizeMb = (maxSizeBytes / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: isTh
        ? `ขนาดไฟล์ภาพต้องไม่เกิน ${sizeMb}MB (ไฟล์ปัจจุบัน: ${(file.size / (1024 * 1024)).toFixed(2)}MB)`
        : `File size exceeds the ${sizeMb}MB limit.`,
    };
  }

  return { valid: true };
}

/**
 * Validates whether a string is a valid HTTP/HTTPS image URL (no local or relative paths allowed).
 * Rejects paths starting with /, ./, ../, \, drive letters, file: etc.
 * Enforces .jpg, .png, .webp extensions.
 * @param {string} url
 * @param {boolean} isTh
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateImageUrl(url, isTh = true) {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return {
      valid: false,
      error: isTh ? 'กรุณาระบุลิงก์รูปภาพ (URL)' : 'Please provide an image URL.',
    };
  }

  const trimmed = url.trim();

  // Allow data:image/(jpeg|png|webp) from uploads
  if (/^data:image\/(jpeg|png|webp);base64,/i.test(trimmed)) {
    return { valid: true };
  }

  // 1. Strictly forbid local paths, relative paths, or file system protocols
  if (
    trimmed.startsWith('/') ||
    trimmed.startsWith('\\') ||
    trimmed.startsWith('./') ||
    trimmed.startsWith('../') ||
    /^[a-zA-Z]:[\\\/]/i.test(trimmed) ||
    /^\s*file:/i.test(trimmed)
  ) {
    return {
      valid: false,
      error: isTh
        ? 'ระบบไม่อนุญาตให้ใส่ Path ไฟล์ (เช่น /img/... หรือ C:\\...) กรุณาใส่ URL ลิงก์รูปภาพแบบเต็ม (https://...) หรือเลือกใช้วิธีอัพโหลดไฟล์ภาพ'
        : 'Local or relative file paths (e.g. /img/...) are not allowed. Please enter a full HTTP/HTTPS image URL or use file upload.',
    };
  }

  // 2. Must be http:// or https://
  if (!/^https?:\/\//i.test(trimmed)) {
    return {
      valid: false,
      error: isTh
        ? 'ลิงก์รูปภาพต้องขึ้นต้นด้วย http:// หรือ https:// เท่านั้น (ห้ามใส่ Path)'
        : 'Image URL must start with http:// or https:// (no local paths allowed).',
    };
  }

  // 3. Validate URL format and allowed image extension (.jpg, .jpeg, .png, .webp)
  try {
    const parsed = new URL(trimmed);
    const pathname = parsed.pathname.toLowerCase();

    // Check if URL ends with known disallowed extensions
    if (
      pathname.endsWith('.gif') ||
      pathname.endsWith('.svg') ||
      pathname.endsWith('.bmp') ||
      pathname.endsWith('.html') ||
      pathname.endsWith('.htm') ||
      pathname.endsWith('.php') ||
      pathname.endsWith('.js')
    ) {
      return {
        valid: false,
        error: isTh
          ? 'รูปภาพต้องเป็นไฟล์ประเภท .jpg, .png, .webp เท่านั้น'
          : 'Images must be of type .jpg, .png, or .webp only.',
      };
    }

    const dotIndex = pathname.lastIndexOf('.');
    if (dotIndex !== -1) {
      const ext = pathname.substring(dotIndex);
      if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        return {
          valid: false,
          error: isTh
            ? 'รูปภาพต้องเป็นนามสกุล .jpg, .png, .webp เท่านั้น'
            : 'Image must have a .jpg, .png, or .webp extension.',
        };
      }
    } else {
      // If no file extension in pathname, check search query or known CDNs
      const isKnownImageCdn = /(images\.unsplash\.com|cloudinary\.com|supabase\.co|imgur\.com|githubusercontent\.com|res\.cloudinary\.com|cdn\.)/i.test(parsed.hostname);
      const hasImageParam = /format=(jpe?g|png|webp)/i.test(parsed.search);

      if (!isKnownImageCdn && !hasImageParam) {
        return {
          valid: false,
          error: isTh
            ? 'ลิงก์รูปภาพต้องลงท้ายด้วยนามสกุล .jpg, .png หรือ .webp'
            : 'Image URL must end with .jpg, .png, or .webp.',
        };
      }
    }

    return { valid: true };
  } catch {
    return {
      valid: false,
      error: isTh ? 'รูปแบบ URL ไม่ถูกต้อง' : 'Invalid URL format.',
    };
  }
}

/**
 * Strips HTML tags from text inputs to avoid injected markup.
 * @param {string} text
 * @returns {string}
 */
export function stripHtml(text) {
  if (!text || typeof text !== 'string') return '';
  return text.replace(/<[^>]*>?/gm, '');
}
