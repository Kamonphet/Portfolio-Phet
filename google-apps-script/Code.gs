// ── นิยามชื่อ Sheets ──────────────────────────────────────────────────────────
const SHEETS = {
  PROFILE: "profile",
  EDUCATION: "education",
  SKILLS: "skills",
  PROJECTS: "projects",
  EXPERIENCE: "experience",
  CONTACT: "contact",
  STATS: "stats",
  SPECS: "system_specs",
  SETTINGS: "settings",
  MESSAGES: "contact_messages"
};

const DRIVE_FOLDER = "Portfolio_Media";

// ── นิยาม Headers ของแต่ละตาราง ──────────────────────────────────────────────
const HEADERS = {
  PROFILE: [
    "id",
    "name",
    "title",
    "tagline",
    "greeting",
    "status",
    "statusColor",
    "avatarUrl",
    "bio_paragraph_1",
    "bio_paragraph_2",
    "bio_paragraph_3",
    "ctaPrimary",
    "ctaSecondary",
    "aboutBadge",
    "aboutHeading",
    "updated_at"
  ],
  EDUCATION: [
    "id",
    "degree",
    "field",
    "institution",
    "period",
    "image",
    "description",
    "updated_at"
  ],
  SKILLS: [
    "id",
    "name",
    "level",
    "category",
    "icon",
    "updated_at"
  ],
  PROJECTS: [
    "id",
    "title",
    "category",
    "description",
    "image",
    "tech_stack",
    "demo_url",
    "github_url",
    "is_featured",
    "updated_at"
  ],
  EXPERIENCE: [
    "id",
    "role",
    "company",
    "period",
    "description",
    "updated_at"
  ],
  CONTACT: [
    "email",
    "phone",
    "location",
    "availability",
    "github",
    "linkedin",
    "twitter",
    "discord",
    "updated_at"
  ],
  STATS: [
    "id",
    "label",
    "value",
    "updated_at"
  ],
  SPECS: [
    "id",
    "label",
    "value",
    "updated_at"
  ],
  SETTINGS: [
    "themePrimary",
    "themeSecondary",
    "themeAccent",
    "active3DShape",
    "updated_at"
  ],
  MESSAGES: [
    "id",
    "name",
    "email",
    "subject",
    "message",
    "created_at"
  ]
};

// ── Helper จัดการ Spreadsheet และ Sheet ──────────────────────────────────────
function getOrCreateSpreadsheet() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

function getOrCreateSheet(ss, sheetName, headers, headerColor) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  // ถ้าเพิ่งสร้างหรือยังไม่มี Header
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground(headerColor || "#1e293b");
    headerRange.setFontColor("#f8fafc");
    sheet.setFrozenRows(1);
    try {
      sheet.autoResizeColumns(1, headers.length);
    } catch (e) {}
  }
  return sheet;
}

function updateSingleRow(sheet, headers, rowData) {
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, 1, headers.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
}

function updateSheetRows(sheet, headers, rows) {
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, headers.length).clearContent();
  }
  if (rows && rows.length > 0) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ────────────────────────────────────────────────────────────────────────────
// GET ROUTER
// ────────────────────────────────────────────────────────────────────────────
function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "ping";
    var ss = getOrCreateSpreadsheet();

    // 1. ตรวจสอบสถานะการเชื่อมต่อ
    if (action === "ping") {
      var sheetNames = ss.getSheets().map(function(s) { return s.getName(); });
      return createJsonResponse({
        success: true,
        status: "online",
        message: "Google Sheets Relational Portfolio API is working properly! 🚀",
        sheetName: ss.getName(),
        sheets: sheetNames,
        timestamp: new Date().toISOString()
      });
    }

    // 2. ดึงข้อมูลทั้งหมดของ Portfolio จากตารางแยก
    if (action === "fetchAll") {
      return handleFetchAll(ss);
    }

    // 3. ดึงข้อความติดต่อจาก Contact Form
    if (action === "fetchMessages") {
      var msgSheet = getOrCreateSheet(ss, SHEETS.MESSAGES, HEADERS.MESSAGES, "#0f172a");
      var msgLastRow = msgSheet.getLastRow();
      if (msgLastRow <= 1) {
        return createJsonResponse({ success: true, messages: [] });
      }

      var msgValues = msgSheet.getRange(2, 1, msgLastRow - 1, HEADERS.MESSAGES.length).getValues();
      var messages = msgValues.map(function(r) {
        return {
          id: r[0],
          name: r[1],
          email: r[2],
          subject: r[3],
          message: r[4],
          created_at: r[5]
        };
      });

      return createJsonResponse({ success: true, messages: messages });
    }

    return createJsonResponse({ success: false, error: "Unknown GET action: " + action });
  } catch (err) {
    return createJsonResponse({ success: false, error: err.toString() });
  }
}

// ────────────────────────────────────────────────────────────────────────────
// POST ROUTER
// ────────────────────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({ success: false, error: "Empty POST body" });
    }

    var payload = JSON.parse(e.postData.contents);
    var action = payload.action;
    var ss = getOrCreateSpreadsheet();

    // 1. บันทึกข้อมูล Portfolio หรือ Settings
    if (action === "saveLanguage" || action === "savePortfolio") {
      if (payload.language === "settings") {
        return handleSaveSettings(ss, payload.data);
      }
      return handleSavePortfolioData(ss, payload.data);
    }

    // 2. บันทึกข้อมูลทั้งหมดในครั้งเดียว
    if (action === "saveAll") {
      var portData = payload.data ? (payload.data.th || payload.data) : null;
      var settingsData = payload.settings || (payload.data && payload.data.settings);
      
      var resPort = handleSavePortfolioData(ss, portData);
      if (settingsData) {
        handleSaveSettings(ss, settingsData);
      }
      return resPort;
    }

    // 3. บันทึกการตั้งค่า Settings
    if (action === "saveSettings") {
      return handleSaveSettings(ss, payload.settings || payload.data);
    }

    // 4. บันทึกข้อความส่งฟอร์ม Contact Form
    if (action === "saveContactMessage") {
      return handleSaveContactMessage(ss, payload);
    }

    // 5. อัปโหลดภาพไปยัง Google Drive
    if (action === "uploadImage") {
      return handleUploadImage(payload);
    }

    return createJsonResponse({ success: false, error: "Unknown POST action: " + action });
  } catch (err) {
    return createJsonResponse({ success: false, error: err.toString() });
  }
}

// ────────────────────────────────────────────────────────────────────────────
// READ DATA (แปลงจากตารางแยกเป็นโครงสร้าง Object ให้ Frontend)
// ────────────────────────────────────────────────────────────────────────────
function handleFetchAll(ss) {
  var profileSheet = getOrCreateSheet(ss, SHEETS.PROFILE, HEADERS.PROFILE, "#1e293b");
  var lastRow = profileSheet.getLastRow();

  // ถ้ายังไม่มีข้อมูลใน profile sheet ให้แจ้งว่า data ว่าง
  if (lastRow <= 1) {
    return createJsonResponse({ success: true, data: null });
  }

  // 1. Profile (Hero + About พื้นฐาน)
  var pRow = profileSheet.getRange(2, 1, 1, HEADERS.PROFILE.length).getValues()[0];
  var hero = {
    greeting: pRow[4] || "<สวัสดีครับ_WORLD />",
    name: pRow[1] || "ครูเพชร IT",
    title: pRow[2] || "ครูสาย IT & Creative Technologist",
    tagline: pRow[3] || "",
    status: pRow[5] || "พร้อมแบ่งปันความรู้ & สนับสนุนการศึกษาดิจิทัล",
    statusColor: pRow[6] || "#00ff87",
    ctaPrimary: pRow[11] || "ดูผลงาน & สื่อการสอน",
    ctaSecondary: pRow[12] || "ติดต่อพูดคุย"
  };

  var paragraphs = [];
  if (pRow[8]) paragraphs.push(String(pRow[8]));
  if (pRow[9]) paragraphs.push(String(pRow[9]));
  if (pRow[10]) paragraphs.push(String(pRow[10]));

  // 2. Education
  var eduSheet = getOrCreateSheet(ss, SHEETS.EDUCATION, HEADERS.EDUCATION, "#0284c7");
  var eduLastRow = eduSheet.getLastRow();
  var education = [];
  if (eduLastRow > 1) {
    var eduRows = eduSheet.getRange(2, 1, eduLastRow - 1, HEADERS.EDUCATION.length).getValues();
    education = eduRows.map(function(r) {
      return {
        id: String(r[0] || ""),
        degree: String(r[1] || ""),
        field: String(r[2] || ""),
        institution: String(r[3] || ""),
        period: String(r[4] || ""),
        image: String(r[5] || ""),
        description: String(r[6] || "")
      };
    }).filter(function(e) { return e.degree || e.institution; });
  }

  // 3. Stats
  var statsSheet = getOrCreateSheet(ss, SHEETS.STATS, HEADERS.STATS, "#059669");
  var statsLastRow = statsSheet.getLastRow();
  var stats = [];
  if (statsLastRow > 1) {
    var statsRows = statsSheet.getRange(2, 1, statsLastRow - 1, HEADERS.STATS.length).getValues();
    stats = statsRows.map(function(r) {
      return {
        label: String(r[1] || ""),
        value: String(r[2] || "")
      };
    }).filter(function(s) { return s.label; });
  }

  // 4. System Specs
  var specsSheet = getOrCreateSheet(ss, SHEETS.SPECS, HEADERS.SPECS, "#d97706");
  var specsLastRow = specsSheet.getLastRow();
  var systemSpecs = [];
  if (specsLastRow > 1) {
    var specsRows = specsSheet.getRange(2, 1, specsLastRow - 1, HEADERS.SPECS.length).getValues();
    systemSpecs = specsRows.map(function(r) {
      return {
        label: String(r[1] || ""),
        value: String(r[2] || "")
      };
    }).filter(function(s) { return s.label; });
  }

  // 5. Skills
  var skillsSheet = getOrCreateSheet(ss, SHEETS.SKILLS, HEADERS.SKILLS, "#7c3aed");
  var skillsLastRow = skillsSheet.getLastRow();
  var skills = [];
  if (skillsLastRow > 1) {
    var skillRows = skillsSheet.getRange(2, 1, skillsLastRow - 1, HEADERS.SKILLS.length).getValues();
    skills = skillRows.map(function(r) {
      return {
        id: String(r[0] || ""),
        name: String(r[1] || ""),
        level: Number(r[2]) || 0,
        category: String(r[3] || "General"),
        icon: String(r[4] || "")
      };
    }).filter(function(s) { return s.name; });
  }

  // 6. Projects
  var projectsSheet = getOrCreateSheet(ss, SHEETS.PROJECTS, HEADERS.PROJECTS, "#2563eb");
  var projLastRow = projectsSheet.getLastRow();
  var projects = [];
  if (projLastRow > 1) {
    var projRows = projectsSheet.getRange(2, 1, projLastRow - 1, HEADERS.PROJECTS.length).getValues();
    projects = projRows.map(function(r) {
      var tech = String(r[5] || "").split(",").map(function(s) { return s.trim(); }).filter(Boolean);
      var isFeatured = r[8] === true || String(r[8]).toLowerCase() === "true";
      return {
        id: String(r[0] || ""),
        title: String(r[1] || ""),
        category: String(r[2] || "Web App"),
        desc: String(r[3] || ""),
        image: String(r[4] || ""),
        tech: tech,
        demoUrl: String(r[6] || ""),
        githubUrl: String(r[7] || ""),
        featured: isFeatured
      };
    }).filter(function(p) { return p.title; });
  }

  // 7. Experience
  var expSheet = getOrCreateSheet(ss, SHEETS.EXPERIENCE, HEADERS.EXPERIENCE, "#db2777");
  var expLastRow = expSheet.getLastRow();
  var experience = [];
  if (expLastRow > 1) {
    var expRows = expSheet.getRange(2, 1, expLastRow - 1, HEADERS.EXPERIENCE.length).getValues();
    experience = expRows.map(function(r) {
      return {
        id: String(r[0] || ""),
        role: String(r[1] || ""),
        company: String(r[2] || ""),
        period: String(r[3] || ""),
        description: String(r[4] || "")
      };
    }).filter(function(e) { return e.role || e.company; });
  }

  // 8. Contact
  var contactSheet = getOrCreateSheet(ss, SHEETS.CONTACT, HEADERS.CONTACT, "#4f46e5");
  var cRow = contactSheet.getLastRow() > 1
    ? contactSheet.getRange(2, 1, 1, HEADERS.CONTACT.length).getValues()[0]
    : [];
  var contact = {
    email: String(cRow[0] || ""),
    phone: String(cRow[1] || ""),
    location: String(cRow[2] || ""),
    availability: String(cRow[3] || ""),
    github: String(cRow[4] || ""),
    linkedin: String(cRow[5] || ""),
    twitter: String(cRow[6] || ""),
    discord: String(cRow[7] || "")
  };

  // 9. Settings
  var settingsSheet = getOrCreateSheet(ss, SHEETS.SETTINGS, HEADERS.SETTINGS, "#0d9488");
  var sRow = settingsSheet.getLastRow() > 1
    ? settingsSheet.getRange(2, 1, 1, HEADERS.SETTINGS.length).getValues()[0]
    : [];
  var settings = {
    themePrimary: String(sRow[0] || "#00f2fe"),
    themeSecondary: String(sRow[1] || "#8a2be2"),
    themeAccent: String(sRow[2] || "#00ff87"),
    active3DShape: String(sRow[3] || "holoCard")
  };

  var portfolioData = {
    hero: hero,
    about: {
      badge: pRow[13] || "SYSTEM_CORE // เกี่ยวกับฉัน",
      heading: pRow[14] || "ผสานพลังระหว่างการออกแบบการเรียนรู้ เทคโนโลยีไอที และความปลอดภัยไซเบอร์",
      paragraphs: paragraphs.length > 0 ? paragraphs : [],
      avatarUrl: pRow[7] || "/img/user-profile.jpg",
      systemSpecs: systemSpecs,
      stats: stats,
      education: education
    },
    skills: skills,
    projects: projects,
    experience: experience,
    contact: contact
  };

  return createJsonResponse({
    success: true,
    data: {
      th: portfolioData,
      en: portfolioData,
      settings: settings
    }
  });
}

// ────────────────────────────────────────────────────────────────────────────
// WRITE DATA (บันทึกจาก Frontend ลงในตารางแยกอย่างเป็นระเบียบ)
// ────────────────────────────────────────────────────────────────────────────
function handleSavePortfolioData(ss, data) {
  if (!data) {
    return createJsonResponse({ success: false, error: "Missing data payload" });
  }

  var nowIso = new Date().toISOString();
  var hero = data.hero || {};
  var about = data.about || {};
  var paras = about.paragraphs || [];

  // 1. Profile Sheet
  var profileSheet = getOrCreateSheet(ss, SHEETS.PROFILE, HEADERS.PROFILE, "#1e293b");
  var profileRow = [
    "main_profile",
    hero.name || "",
    hero.title || "",
    hero.tagline || "",
    hero.greeting || "",
    hero.status || "",
    hero.statusColor || "#00ff87",
    about.avatarUrl || "",
    paras[0] || "",
    paras[1] || "",
    paras[2] || "",
    hero.ctaPrimary || "",
    hero.ctaSecondary || "",
    about.badge || "",
    about.heading || "",
    nowIso
  ];
  updateSingleRow(profileSheet, HEADERS.PROFILE, profileRow);

  // 2. Education Sheet
  if (Array.isArray(about.education)) {
    var eduSheet = getOrCreateSheet(ss, SHEETS.EDUCATION, HEADERS.EDUCATION, "#0284c7");
    var eduRows = about.education.map(function(item, idx) {
      return [
        item.id || ("edu_" + (idx + 1)),
        item.degree || "",
        item.field || "",
        item.institution || "",
        item.period || "",
        item.image || "",
        item.description || "",
        nowIso
      ];
    });
    updateSheetRows(eduSheet, HEADERS.EDUCATION, eduRows);
  }

  // 3. Stats Sheet
  if (Array.isArray(about.stats)) {
    var statsSheet = getOrCreateSheet(ss, SHEETS.STATS, HEADERS.STATS, "#059669");
    var statRows = about.stats.map(function(item, idx) {
      return [
        "stat_" + (idx + 1),
        item.label || "",
        String(item.value || ""),
        nowIso
      ];
    });
    updateSheetRows(statsSheet, HEADERS.STATS, statRows);
  }

  // 4. System Specs Sheet
  if (Array.isArray(about.systemSpecs)) {
    var specsSheet = getOrCreateSheet(ss, SHEETS.SPECS, HEADERS.SPECS, "#d97706");
    var specRows = about.systemSpecs.map(function(item, idx) {
      return [
        "spec_" + (idx + 1),
        item.label || "",
        String(item.value || ""),
        nowIso
      ];
    });
    updateSheetRows(specsSheet, HEADERS.SPECS, specRows);
  }

  // 5. Skills Sheet
  if (Array.isArray(data.skills)) {
    var skillsSheet = getOrCreateSheet(ss, SHEETS.SKILLS, HEADERS.SKILLS, "#7c3aed");
    var skillRows = data.skills.map(function(item, idx) {
      return [
        item.id || ("s_" + (idx + 1)),
        item.name || "",
        Number(item.level) || 0,
        item.category || "General",
        item.icon || "",
        nowIso
      ];
    });
    updateSheetRows(skillsSheet, HEADERS.SKILLS, skillRows);
  }

  // 6. Projects Sheet
  if (Array.isArray(data.projects)) {
    var projectsSheet = getOrCreateSheet(ss, SHEETS.PROJECTS, HEADERS.PROJECTS, "#2563eb");
    var projRows = data.projects.map(function(item, idx) {
      var techStr = Array.isArray(item.tech) ? item.tech.join(", ") : (item.tech || "");
      return [
        item.id || ("p_" + (idx + 1)),
        item.title || "",
        item.category || "Web App",
        item.desc || item.description || "",
        item.image || "",
        techStr,
        item.demoUrl || "",
        item.githubUrl || "",
        Boolean(item.featured),
        nowIso
      ];
    });
    updateSheetRows(projectsSheet, HEADERS.PROJECTS, projRows);
  }

  // 7. Experience Sheet
  if (Array.isArray(data.experience)) {
    var expSheet = getOrCreateSheet(ss, SHEETS.EXPERIENCE, HEADERS.EXPERIENCE, "#db2777");
    var expRows = data.experience.map(function(item, idx) {
      return [
        item.id || ("e_" + (idx + 1)),
        item.role || "",
        item.company || "",
        item.period || "",
        item.description || "",
        nowIso
      ];
    });
    updateSheetRows(expSheet, HEADERS.EXPERIENCE, expRows);
  }

  // 8. Contact Sheet
  if (data.contact) {
    var contactSheet = getOrCreateSheet(ss, SHEETS.CONTACT, HEADERS.CONTACT, "#4f46e5");
    var c = data.contact;
    var contactRow = [
      c.email || "",
      c.phone || "",
      c.location || "",
      c.availability || "",
      c.github || "",
      c.linkedin || "",
      c.twitter || "",
      c.discord || "",
      nowIso
    ];
    updateSingleRow(contactSheet, HEADERS.CONTACT, contactRow);
  }

  return createJsonResponse({
    success: true,
    message: "Portfolio data successfully saved to organized sheets! 🎉",
    updated_at: nowIso
  });
}

function handleSaveSettings(ss, settingsData) {
  if (!settingsData) return createJsonResponse({ success: false, error: "Missing settings" });

  var settingsSheet = getOrCreateSheet(ss, SHEETS.SETTINGS, HEADERS.SETTINGS, "#0d9488");
  var nowIso = new Date().toISOString();
  var setRow = [
    settingsData.themePrimary || "#00f2fe",
    settingsData.themeSecondary || "#8a2be2",
    settingsData.themeAccent || "#00ff87",
    settingsData.active3DShape || "holoCard",
    nowIso
  ];
  updateSingleRow(settingsSheet, HEADERS.SETTINGS, setRow);

  return createJsonResponse({ success: true, message: "Settings saved!", updated_at: nowIso });
}

// ────────────────────────────────────────────────────────────────────────────
// CONTACT MESSAGE HANDLER
// ────────────────────────────────────────────────────────────────────────────
function handleSaveContactMessage(ss, payload) {
  var msgSheet = getOrCreateSheet(ss, SHEETS.MESSAGES, HEADERS.MESSAGES, "#0f172a");
  var msgId = Utilities.getUuid();
  var createdAt = new Date().toISOString();

  var newRow = [
    msgId,
    payload.name || "Anonymous",
    payload.email || "",
    payload.subject || "Portfolio Contact Form",
    payload.message || "",
    createdAt
  ];

  msgSheet.appendRow(newRow);
  return createJsonResponse({ success: true, messageId: msgId });
}

// ────────────────────────────────────────────────────────────────────────────
// DRIVE IMAGE UPLOAD HANDLER
// ────────────────────────────────────────────────────────────────────────────
function handleUploadImage(payload) {
  try {
    var base64Data = payload.base64;
    if (!base64Data) {
      return createJsonResponse({ success: false, error: "No base64 data provided" });
    }

    if (base64Data.indexOf(",") > -1) {
      base64Data = base64Data.split(",")[1];
    }

    var folderName = DRIVE_FOLDER;
    var folders = DriveApp.getFoldersByName(folderName);
    var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
    folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    var ext = payload.extension || "png";
    var filename = payload.filename || ("img_" + new Date().getTime() + "." + ext);
    var mimeType = payload.mimeType || "image/png";

    var decoded = Utilities.base64Decode(base64Data);
    var blob = Utilities.newBlob(decoded, mimeType, filename);
    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    var fileId = file.getId();
    var directUrl = "https://lh3.googleusercontent.com/d/" + fileId;

    return createJsonResponse({
      success: true,
      url: directUrl,
      fileId: fileId,
      filename: filename
    });
  } catch (err) {
    return createJsonResponse({ success: false, error: "Drive upload error: " + err.toString() });
  }
}
