/**
 * googleSheetsApi.js
 * -------------------------------------------------------------
 * API Client สำหรับเชื่อมต่อกับ Google Apps Script Web App
 * รองรับการอ่านและเขียนข้อมูลลงใน Google Sheets และ Google Drive
 */

/**
 * ดึง Web App URL จาก Environment Variables
 */
export const getApiUrl = () => {
  const url = (
    import.meta.env.VITE_GOOGLE_SHEETS_API_URL ||
    import.meta.env.VITE_GAS_URL ||
    import.meta.env.VITE_API_URL ||
    ""
  ).trim();

  return url;
};

/**
 * ตรวจสอบว่าได้กำหนดค่า Google Sheets API URL หรือยัง
 */
export const checkIsApiConfigured = () => {
  const url = getApiUrl();
  return Boolean(url && url.startsWith("https://script.google.com/"));
};

export const isApiConfigured = checkIsApiConfigured();

/**
 * ยิงคำขอไปยัง Google Apps Script Web App
 * @param {string} action - ชื่อ action เช่น 'fetchAll', 'saveLanguage', 'saveContactMessage'
 * @param {'GET' | 'POST'} method - HTTP Method
 * @param {object} payload - ข้อมูลที่ต้องการส่งไปกับ request
 * @returns {Promise<any>}
 */
export const callApi = async (action, method = "GET", payload = null) => {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    return {
      success: false,
      error: "Google Sheets API URL is not configured. Please set VITE_GOOGLE_SHEETS_API_URL in .env",
    };
  }

  try {
    if (method === "GET") {
      const separator = apiUrl.includes("?") ? "&" : "?";
      const targetUrl = `${apiUrl}${separator}action=${encodeURIComponent(action)}`;

      const response = await fetch(targetUrl, {
        method: "GET",
        redirect: "follow",
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    }

    // สำหรับ POST:
    // ใช้ Content-Type: 'text/plain;charset=utf-8' เพื่อเลี่ยง Browser Preflight (OPTIONS Request)
    // เนื่องจาก Google Apps Script Web App ไม่รองรับ OPTIONS Method
    const bodyContent = JSON.stringify({
      action,
      ...(payload || {}),
    });

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: bodyContent,
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`[GoogleSheets API] '${action}' error:`, error);
    return {
      success: false,
      error: error.message || "Failed to communicate with Google Sheets API.",
    };
  }
};
