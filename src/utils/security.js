/**
 * security.js
 * Security utility functions for input sanitization, safe URL handling, and XSS prevention.
 */

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

  if (/^\s*data:(?!image\/)/i.test(trimmed)) {
    return fallback;
  }

  // Allow standard safe protocols and relative paths
  if (
    /^(https?:\/\/|mailto:|tel:|\/|#|data:image\/)/i.test(trimmed)
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
 * Validates whether an uploaded file is a safe image.
 * @param {File} file
 * @param {number} maxSizeBytes (default: 5MB)
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateImageFile(file, maxSizeBytes = 5 * 1024 * 1024) {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
  ];

  if (!allowedTypes.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: 'Invalid file format. Please upload JPG, PNG, WEBP, or GIF.',
    };
  }

  if (file.size > maxSizeBytes) {
    const sizeMb = (maxSizeBytes / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: `File size exceeds the ${sizeMb}MB limit.`,
    };
  }

  return { valid: true };
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
