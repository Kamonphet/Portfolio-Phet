import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { defaultPortfolioData, UI_TRANSLATIONS } from "../data/defaultData";
import { verifyPassword } from "../utils/crypto";
import {
  fetchAllData,
  saveLanguageData,
  initSupabaseFromLocalData,
  pushAllDataToCloud,
  testSupabaseConnection,
  subscribeToPortfolio,
  unsubscribeFromPortfolio,
} from "../lib/portfolioService";
import {
  getSupabaseConfig,
  setSupabaseLocalConfig,
  clearSupabaseLocalConfig,
} from "../lib/supabase";

const STORAGE_KEY = "cyber_portfolio_data_v5";
const LANG_STORAGE_KEY = "cyber_portfolio_lang";
const AUTH_STORAGE_KEY = "cyber_admin_authenticated";
const THEME_STORAGE_KEY = "cyber_portfolio_theme_v4";

// Debounce delay for Supabase writes (ms)
const SUPABASE_DEBOUNCE_MS = 1000;

const PortfolioContext = createContext(null);

// ─────────────────────────────────────────────────────────────
// Deep merge helper
// ─────────────────────────────────────────────────────────────
const deepMergeLangData = (defaultLang, savedLang) => {
  if (!savedLang || typeof savedLang !== "object") return defaultLang;

  const sanitizedProjects =
    Array.isArray(savedLang.projects) && savedLang.projects.length > 0
      ? savedLang.projects.map((proj, idx) => {
          if (!proj.image || proj.image.includes("unsplash") || proj.image.startsWith("http")) {
            const fallback = defaultLang.projects[idx] || defaultLang.projects[0];
            return {
              ...proj,
              image: fallback.image,
              title: proj.title === "Quantum Cipher Web3 Platform" ? fallback.title : proj.title,
            };
          }
          return proj;
        })
      : defaultLang.projects;

  const avatarUrl =
    !savedLang.about?.avatarUrl || savedLang.about.avatarUrl === "/profile.jpg"
      ? defaultLang.about.avatarUrl
      : savedLang.about.avatarUrl;

  const heroName =
    !savedLang.hero?.name || savedLang.hero.name === "CIPHER"
      ? defaultLang.hero.name
      : savedLang.hero.name;

  return {
    ...defaultLang,
    ...savedLang,
    hero: {
      ...defaultLang.hero,
      ...(savedLang.hero || {}),
      name: heroName,
      title: savedLang.hero?.title?.includes("Creative Technologist & Full-Stack Engineer")
        ? defaultLang.hero.title
        : savedLang.hero?.title || defaultLang.hero.title,
      tagline: savedLang.hero?.tagline?.includes("สร้างสรรค์ประสบการณ์ดิจิทัลยุคใหม่")
        ? defaultLang.hero.tagline
        : savedLang.hero?.tagline || defaultLang.hero.tagline,
    },
    about: {
      ...defaultLang.about,
      ...(savedLang.about || {}),
      avatarUrl,
      paragraphs:
        Array.isArray(savedLang.about?.paragraphs) && savedLang.about.paragraphs.length > 0
          ? savedLang.about.paragraphs
          : defaultLang.about.paragraphs,
      systemSpecs:
        Array.isArray(savedLang.about?.systemSpecs) && savedLang.about.systemSpecs.length > 0
          ? savedLang.about.systemSpecs
          : defaultLang.about.systemSpecs,
      stats:
        Array.isArray(savedLang.about?.stats) && savedLang.about.stats.length > 0
          ? savedLang.about.stats
          : defaultLang.about.stats,
      education:
        Array.isArray(savedLang.about?.education) && savedLang.about.education.length > 0
          ? savedLang.about.education
          : defaultLang.about.education,
    },
    skills:
      Array.isArray(savedLang.skills) && savedLang.skills.length > 0
        ? savedLang.skills
        : defaultLang.skills,
    projects: sanitizedProjects,
    experience:
      Array.isArray(savedLang.experience) && savedLang.experience.length > 0
        ? savedLang.experience
        : defaultLang.experience,
    contact: {
      ...defaultLang.contact,
      ...(savedLang.contact || {}),
    },
  };
};

// ─────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────
export const PortfolioProvider = ({ children }) => {
  // ── Language ──────────────────────────────────────────────
  const [language, setLanguage] = useState(() => {
    try { return localStorage.getItem(LANG_STORAGE_KEY) || "th"; } catch { return "th"; }
  });

  // ── Theme ─────────────────────────────────────────────────
  const [theme, setTheme] = useState(() => {
    try {
      localStorage.removeItem("cyber_portfolio_theme_v3");
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      return saved === "light" || saved === "dark" ? saved : "light";
    } catch { return "light"; }
  });

  // ── AllData (initialise from localStorage for instant paint) ─
  const [allData, setAllData] = useState(() => {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY) ||
        localStorage.getItem("cyber_portfolio_data_v3");
      if (saved) {
        const parsed = JSON.parse(saved);
        const savedTh = parsed.th || (parsed.hero ? parsed : null);
        const savedEn = parsed.en || null;
        return {
          th: deepMergeLangData(defaultPortfolioData.th, savedTh),
          en: deepMergeLangData(defaultPortfolioData.en, savedEn),
          settings: { ...defaultPortfolioData.settings, ...(parsed.settings || {}) },
        };
      }
    } catch (e) {
      console.error("Failed to parse saved portfolio data", e);
    }
    return defaultPortfolioData;
  });

  // ── Cloud sync state ──────────────────────────────────────
  const [cloudConfig, setCloudConfig] = useState(() => getSupabaseConfig());
  const isSupabaseConfigured = cloudConfig.isConfigured;

  const [isDbSyncing, setIsDbSyncing] = useState(false);   // true while saving to Supabase
  const [isDbLoading, setIsDbLoading] = useState(cloudConfig.isConfigured);  // true on initial cloud fetch
  const [dbSyncedAt, setDbSyncedAt] = useState(null);      // timestamp of last successful sync

  // Refs to prevent feedback loops with real-time subscription
  const isUpdatingFromRealtime = useRef(false);
  const saveDebounceRef = useRef(null);
  const prevAllDataRef = useRef(allData);

  // ── UI state ──────────────────────────────────────────────
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCmsOpen, setIsCmsOpen] = useState(false);
  const [cmsTab, setCmsTab] = useState("profile");
  const validShapes = ["holoCard", "pointCloud", "holoPrism", "digitalMesh"];
  const currentSavedShape = allData?.settings?.active3DShape;
  const [active3DShape, setActive3DShape] = useState(
    validShapes.includes(currentSavedShape) ? currentSavedShape : "holoCard"
  );

  // ── Auth state ────────────────────────────────────────────
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try { return sessionStorage.getItem(AUTH_STORAGE_KEY) === "true"; } catch { return false; }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // ──────────────────────────────────────────────────────────
  // Cloud fetch helper
  // ──────────────────────────────────────────────────────────
  const loadFromCloud = useCallback(async (customData) => {
    const config = getSupabaseConfig();
    if (!config.isConfigured) return;

    setIsDbLoading(true);
    try {
      const cloudData = await fetchAllData();
      if (cloudData && Object.keys(cloudData).length > 0) {
        const merged = {
          th: deepMergeLangData(defaultPortfolioData.th, cloudData.th || null),
          en: deepMergeLangData(defaultPortfolioData.en, cloudData.en || null),
          settings: {
            ...defaultPortfolioData.settings,
            ...(cloudData.settings || {}),
          },
        };

        isUpdatingFromRealtime.current = true;
        setAllData(merged);
        setDbSyncedAt(new Date());
        setTimeout(() => { isUpdatingFromRealtime.current = false; }, 100);
        console.log("[Supabase] Loaded cloud data ✅");
      } else {
        const dataToPush = customData || allData;
        await initSupabaseFromLocalData(dataToPush);
        setDbSyncedAt(new Date());
        console.log("[Supabase] Initialised cloud with local data ✅");
      }
    } catch (err) {
      console.error("[Supabase] Cloud load error:", err);
    } finally {
      setIsDbLoading(false);
    }
  }, [allData]);

  // Cloud management methods
  const saveCloudCredentials = async (url, anonKey) => {
    setSupabaseLocalConfig(url, anonKey);
    const updated = getSupabaseConfig();
    setCloudConfig(updated);
    if (updated.isConfigured) {
      setIsDbLoading(true);
      try {
        const cloudData = await fetchAllData();
        if (cloudData && Object.keys(cloudData).length > 0) {
          const merged = {
            th: deepMergeLangData(defaultPortfolioData.th, cloudData.th || null),
            en: deepMergeLangData(defaultPortfolioData.en, cloudData.en || null),
            settings: {
              ...defaultPortfolioData.settings,
              ...(cloudData.settings || {}),
            },
          };
          isUpdatingFromRealtime.current = true;
          setAllData(merged);
          setDbSyncedAt(new Date());
          setTimeout(() => { isUpdatingFromRealtime.current = false; }, 100);
        } else {
          await initSupabaseFromLocalData(allData);
          setDbSyncedAt(new Date());
        }
      } catch (e) {
        console.error("Error connecting with new credentials:", e);
      } finally {
        setIsDbLoading(false);
      }
    }
  };

  const removeCloudCredentials = () => {
    clearSupabaseLocalConfig();
    setCloudConfig(getSupabaseConfig());
    setDbSyncedAt(null);
  };

  const testCloudConnection = async () => {
    return await testSupabaseConnection();
  };

  const pushToCloud = async () => {
    setIsDbSyncing(true);
    try {
      const res = await pushAllDataToCloud(allData);
      if (res.success) {
        setDbSyncedAt(new Date());
      }
      return res;
    } finally {
      setIsDbSyncing(false);
    }
  };

  const pullFromCloud = async () => {
    setIsDbLoading(true);
    try {
      const cloudData = await fetchAllData();
      if (cloudData && Object.keys(cloudData).length > 0) {
        const merged = {
          th: deepMergeLangData(defaultPortfolioData.th, cloudData.th || null),
          en: deepMergeLangData(defaultPortfolioData.en, cloudData.en || null),
          settings: {
            ...defaultPortfolioData.settings,
            ...(cloudData.settings || {}),
          },
        };
        isUpdatingFromRealtime.current = true;
        setAllData(merged);
        setDbSyncedAt(new Date());
        setTimeout(() => { isUpdatingFromRealtime.current = false; }, 100);
        return { success: true, message: "Downloaded cloud data successfully!" };
      }
      return { success: false, error: "No cloud data found." };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setIsDbLoading(false);
    }
  };

  // ══════════════════════════════════════════════════════════
  // EFFECT 1 — Initial cloud fetch (runs on mount or config change)
  // ══════════════════════════════════════════════════════════
  useEffect(() => {
    if (!cloudConfig.isConfigured) return;
    loadFromCloud();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cloudConfig.url, cloudConfig.anonKey]);

  // ══════════════════════════════════════════════════════════
  // EFFECT 2 — Sync allData → localStorage (immediate)
  // ══════════════════════════════════════════════════════════
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
    } catch (e) {
      console.error("Failed to save portfolio data to localStorage", e);
    }
  }, [allData]);

  // ══════════════════════════════════════════════════════════
  // EFFECT 3 — Sync allData → Supabase (debounced)
  //            Skip when the change came FROM real-time sub
  // ══════════════════════════════════════════════════════════
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    if (isUpdatingFromRealtime.current) return;

    // Detect which languages actually changed
    const prevData = prevAllDataRef.current;
    prevAllDataRef.current = allData;

    if (saveDebounceRef.current) clearTimeout(saveDebounceRef.current);

    saveDebounceRef.current = setTimeout(async () => {
      setIsDbSyncing(true);
      const writes = [];

      if (JSON.stringify(allData.th) !== JSON.stringify(prevData.th)) {
        writes.push(saveLanguageData("th", allData.th));
      }
      if (JSON.stringify(allData.en) !== JSON.stringify(prevData.en)) {
        writes.push(saveLanguageData("en", allData.en));
      }
      if (JSON.stringify(allData.settings) !== JSON.stringify(prevData.settings)) {
        writes.push(saveLanguageData("settings", allData.settings));
      }

      if (writes.length > 0) {
        const results = await Promise.all(writes);
        const allOk = results.every(Boolean);
        if (allOk) {
          setDbSyncedAt(new Date());
          console.log("[Supabase] Saved to cloud ✅");
        }
      }
      setIsDbSyncing(false);
    }, SUPABASE_DEBOUNCE_MS);

    return () => {
      if (saveDebounceRef.current) clearTimeout(saveDebounceRef.current);
    };
  }, [allData]);

  // ══════════════════════════════════════════════════════════
  // EFFECT 4 — Real-time subscription
  //            When Supabase dashboard changes data, update UI
  // ══════════════════════════════════════════════════════════
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const channel = subscribeToPortfolio((payload) => {
      const row = payload.new;
      if (!row || !row.language) return;

      isUpdatingFromRealtime.current = true;

      if (row.language === "settings") {
        setAllData((prev) => ({
          ...prev,
          settings: { ...defaultPortfolioData.settings, ...(row.settings || {}) },
        }));
      } else {
        const lang = row.language; // 'th' or 'en'
        setAllData((prev) => ({
          ...prev,
          [lang]: deepMergeLangData(defaultPortfolioData[lang], {
            hero:       row.hero,
            about:      row.about,
            skills:     row.skills,
            projects:   row.projects,
            experience: row.experience,
            contact:    row.contact,
          }),
        }));
      }

      setDbSyncedAt(new Date());
      console.log(`[Supabase] Real-time update received for '${row.language}' ✅`);

      setTimeout(() => { isUpdatingFromRealtime.current = false; }, 200);
    });

    return () => unsubscribeFromPortfolio(channel);
  }, [cloudConfig.url, cloudConfig.anonKey, isSupabaseConfigured]);

  // ══════════════════════════════════════════════════════════
  // EFFECT 5 — language / theme persistence
  // ══════════════════════════════════════════════════════════
  useEffect(() => {
    try { localStorage.setItem(LANG_STORAGE_KEY, language); } catch {}
  }, [language]);

  useEffect(() => {
    try {
      document.documentElement.setAttribute("data-theme", theme);
      document.documentElement.style.colorScheme = theme;
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {}
  }, [theme]);

  // ══════════════════════════════════════════════════════════
  // Derived state
  // ══════════════════════════════════════════════════════════
  const toggleLanguage = () => setLanguage((p) => (p === "th" ? "en" : "th"));
  const toggleTheme    = () => setTheme((p) => (p === "dark" ? "light" : "dark"));

  const activeLangData = allData[language] || allData.th || defaultPortfolioData.th;
  const data = { ...activeLangData, settings: allData.settings || defaultPortfolioData.settings };
  const t    = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.th;

  // ══════════════════════════════════════════════════════════
  // Auth helpers
  // ══════════════════════════════════════════════════════════
  const requestAuth = (actionCallback) => {
    if (isAuthenticated) { actionCallback(); }
    else { setPendingAction(() => actionCallback); setIsAuthModalOpen(true); }
  };

  const authenticate = async (inputPassword) => {
    const isValid = await verifyPassword(inputPassword);
    if (isValid) {
      setIsAuthenticated(true);
      try { sessionStorage.setItem(AUTH_STORAGE_KEY, "true"); } catch {}
      setIsAuthModalOpen(false);
      if (pendingAction) { pendingAction(); setPendingAction(null); }
      return true;
    }
    return false;
  };

  const closeAuthModal = () => { setIsAuthModalOpen(false); setPendingAction(null); };

  const logout = () => {
    setIsAuthenticated(false);
    setIsEditMode(false);
    setIsCmsOpen(false);
    try { sessionStorage.removeItem(AUTH_STORAGE_KEY); } catch {}
  };

  const toggleEditMode = () => {
    if (isEditMode) { setIsEditMode(false); }
    else { requestAuth(() => setIsEditMode(true)); }
  };

  const openCms = (tab = "profile") => {
    requestAuth(() => { setCmsTab(tab); setIsCmsOpen(true); });
  };

  const closeCms = () => setIsCmsOpen(false);

  // ══════════════════════════════════════════════════════════
  // Data update helpers  (identical API to before)
  // ══════════════════════════════════════════════════════════
  const updateLang = useCallback((fields) => (prev) => ({
    ...prev,
    [language]: { ...prev[language], ...fields },
  }), [language]);

  const updateHero = (fields) => setAllData(updateLang({ hero: { ...allData[language].hero, ...fields } }));

  const updateAbout = (fields) => setAllData(updateLang({ about: { ...allData[language].about, ...fields } }));

  const updateSkills = (skills) => setAllData(updateLang({ skills }));

  const addSkill = (newSkill) =>
    setAllData(updateLang({ skills: [...(allData[language]?.skills || []), { id: `s_${Date.now()}`, ...newSkill }] }));

  const removeSkill = (id) =>
    setAllData(updateLang({ skills: (allData[language]?.skills || []).filter((s) => s.id !== id) }));

  const updateProjects = (projects) => setAllData(updateLang({ projects }));

  const addProject = (newProject) =>
    setAllData(updateLang({ projects: [{ id: `p_${Date.now()}`, ...newProject }, ...(allData[language]?.projects || [])] }));

  const removeProject = (id) =>
    setAllData(updateLang({ projects: (allData[language]?.projects || []).filter((p) => p.id !== id) }));

  const updateExperience = (experience) => setAllData(updateLang({ experience }));

  const addExperience = (newExp) =>
    setAllData(updateLang({ experience: [{ id: `e_${Date.now()}`, ...newExp }, ...(allData[language]?.experience || [])] }));

  const removeExperience = (id) =>
    setAllData(updateLang({ experience: (allData[language]?.experience || []).filter((e) => e.id !== id) }));

  const updateContact = (fields) =>
    setAllData(updateLang({ contact: { ...allData[language].contact, ...fields } }));

  const updateSettings = (fields) =>
    setAllData((prev) => ({ ...prev, settings: { ...prev.settings, ...fields } }));

  // ── Export / Import / Reset ───────────────────────────────
  const exportData = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(allData, null, 2))}`;
    const a = document.createElement("a");
    a.setAttribute("href", jsonString);
    a.setAttribute("download", `portfolio-config-${Date.now()}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const importData = (importedJson) => {
    try {
      const parsed = typeof importedJson === "string" ? JSON.parse(importedJson) : importedJson;
      const savedTh = parsed.th || (parsed.hero ? parsed : null);
      const savedEn = parsed.en || null;
      setAllData({
        th: deepMergeLangData(defaultPortfolioData.th, savedTh),
        en: deepMergeLangData(defaultPortfolioData.en, savedEn),
        settings: { ...defaultPortfolioData.settings, ...(parsed.settings || {}) },
      });
      return { success: true, message: "Import successful!" };
    } catch (e) {
      return { success: false, message: "Invalid JSON format" };
    }
  };

  const resetToDefault = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("cyber_portfolio_data_v3");
    localStorage.removeItem(THEME_STORAGE_KEY);
    localStorage.removeItem("cyber_portfolio_theme_v3");
    setTheme("light");
    setAllData(defaultPortfolioData);
    setActive3DShape(defaultPortfolioData.settings.active3DShape);
  };

  // ══════════════════════════════════════════════════════════
  // Context value
  // ══════════════════════════════════════════════════════════
  return (
    <PortfolioContext.Provider
      value={{
        data,
        allData,
        language,
        setLanguage,
        toggleLanguage,
        theme,
        setTheme,
        toggleTheme,
        isDarkMode: theme === "dark",
        t,
        // Supabase sync indicators & methods
        isSupabaseConfigured,
        cloudConfig,
        isDbLoading,
        isDbSyncing,
        dbSyncedAt,
        saveCloudCredentials,
        removeCloudCredentials,
        testCloudConnection,
        pushToCloud,
        pullFromCloud,
        // Edit / CMS
        isEditMode,
        isCmsOpen,
        cmsTab,
        active3DShape,
        setActive3DShape,
        setCmsTab,
        toggleEditMode,
        openCms,
        closeCms,
        // Auth
        isAuthenticated,
        isAuthModalOpen,
        requestAuth,
        authenticate,
        closeAuthModal,
        logout,
        // Data updaters
        updateHero,
        updateAbout,
        updateSkills,
        addSkill,
        removeSkill,
        updateProjects,
        addProject,
        removeProject,
        updateExperience,
        addExperience,
        removeExperience,
        updateContact,
        updateSettings,
        exportData,
        importData,
        resetToDefault,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error("usePortfolio must be used within a PortfolioProvider");
  return context;
};
