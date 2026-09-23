import React, { createContext, useContext, useState, useEffect } from "react";
import { defaultPortfolioData, UI_TRANSLATIONS, KRU_PETCH_STICKERS } from "../data/defaultData";
import { verifyPassword } from "../utils/crypto";

const STORAGE_KEY = "cyber_portfolio_data_v5";
const LANG_STORAGE_KEY = "cyber_portfolio_lang";
const AUTH_STORAGE_KEY = "cyber_admin_authenticated";
const THEME_STORAGE_KEY = "cyber_portfolio_theme_v4";
const MASCOT_STORAGE_KEY = "cyber_active_mascot";

const PortfolioContext = createContext(null);

// Deep merge helper to prevent undefined arrays/sub-objects and upgrade legacy image paths
const deepMergeLangData = (defaultLang, savedLang) => {
  if (!savedLang || typeof savedLang !== "object") return defaultLang;

  // Upgrade legacy unsplash or placeholder project images to Kru Petch artwork
  const sanitizedProjects = Array.isArray(savedLang.projects) && savedLang.projects.length > 0
    ? savedLang.projects.map((proj, idx) => {
        if (!proj.image || proj.image.includes("unsplash") || proj.image.startsWith("http")) {
          const fallback = defaultLang.projects[idx] || defaultLang.projects[0];
          return { ...proj, image: fallback.image, title: proj.title === "Quantum Cipher Web3 Platform" ? fallback.title : proj.title };
        }
        return proj;
      })
    : defaultLang.projects;

  // Upgrade legacy avatar
  const avatarUrl =
    !savedLang.about?.avatarUrl || savedLang.about.avatarUrl === "/profile.jpg"
      ? defaultLang.about.avatarUrl
      : savedLang.about.avatarUrl;

  // Upgrade hero name if it was the old default placeholder
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
      title: savedLang.hero?.title?.includes("Creative Technologist & Full-Stack Engineer") ? defaultLang.hero.title : (savedLang.hero?.title || defaultLang.hero.title),
      tagline: savedLang.hero?.tagline?.includes("สร้างสรรค์ประสบการณ์ดิจิทัลยุคใหม่") ? defaultLang.hero.tagline : (savedLang.hero?.tagline || defaultLang.hero.tagline),
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

export const PortfolioProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem(LANG_STORAGE_KEY) || "th";
    } catch {
      return "th";
    }
  });

  const [theme, setTheme] = useState(() => {
    try {
      localStorage.removeItem("cyber_portfolio_theme_v3");
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === "light" || savedTheme === "dark") {
        return savedTheme;
      }
      return "light";
    } catch {
      return "light";
    }
  });

  const [allData, setAllData] = useState(() => {
    try {
      // Check v4 first, fallback to older keys if available
      const saved =
        localStorage.getItem(STORAGE_KEY) ||
        localStorage.getItem("cyber_portfolio_data_v3");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Handle migration if saved data didn't have th/en
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

  const [isEditMode, setIsEditMode] = useState(false);
  const [isCmsOpen, setIsCmsOpen] = useState(false);
  const [cmsTab, setCmsTab] = useState("profile");
  const validShapes = ["holoCard", "pointCloud", "holoPrism", "digitalMesh"];
  const currentSavedShape = allData?.settings?.active3DShape;
  const [active3DShape, setActive3DShape] = useState(
    validShapes.includes(currentSavedShape) ? currentSavedShape : "holoCard"
  );

  // Active companion mascot & sticker gallery
  const [activeMascot, setActiveMascot] = useState(() => {
    try {
      return localStorage.getItem(MASCOT_STORAGE_KEY) || "hello";
    } catch {
      return "hello";
    }
  });
  const [isStickerGalleryOpen, setIsStickerGalleryOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(MASCOT_STORAGE_KEY, activeMascot);
    } catch (e) {
      console.error("Failed to save active mascot", e);
    }
  }, [activeMascot]);

  const openStickerGallery = () => setIsStickerGalleryOpen(true);
  const closeStickerGallery = () => setIsStickerGalleryOpen(false);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem(AUTH_STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
    } catch (e) {
      console.error("Failed to save portfolio data to localStorage", e);
    }
  }, [allData]);

  useEffect(() => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, language);
    } catch (e) {
      console.error("Failed to save language preference", e);
    }
  }, [language]);

  useEffect(() => {
    try {
      document.documentElement.setAttribute("data-theme", theme);
      document.documentElement.style.colorScheme = theme;
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      console.error("Failed to save theme preference", e);
    }
  }, [theme]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "th" ? "en" : "th"));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Active data for current language
  const activeLangData = allData[language] || allData.th || defaultPortfolioData.th;
  const data = {
    ...activeLangData,
    settings: allData.settings || defaultPortfolioData.settings,
  };

  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.th;

  // Authentication Helpers
  const requestAuth = (actionCallback) => {
    if (isAuthenticated) {
      actionCallback();
    } else {
      setPendingAction(() => actionCallback);
      setIsAuthModalOpen(true);
    }
  };

  const authenticate = async (inputPassword) => {
    const isValid = await verifyPassword(inputPassword);
    if (isValid) {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
      } catch (e) {
        // ignore
      }
      setIsAuthModalOpen(false);
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
      return true;
    }
    return false;
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingAction(null);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsEditMode(false);
    setIsCmsOpen(false);
    try {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  };

  // Protected Edit Mode toggle
  const toggleEditMode = () => {
    if (isEditMode) {
      setIsEditMode(false);
    } else {
      requestAuth(() => {
        setIsEditMode(true);
      });
    }
  };

  // Protected CMS open
  const openCms = (tab = "profile") => {
    requestAuth(() => {
      setCmsTab(tab);
      setIsCmsOpen(true);
    });
  };

  const closeCms = () => setIsCmsOpen(false);

  // Update helpers
  const updateHero = (fields) => {
    setAllData((prev) => ({
      ...prev,
      [language]: {
        ...prev[language],
        hero: { ...prev[language].hero, ...fields },
      },
    }));
  };

  const updateAbout = (fields) => {
    setAllData((prev) => ({
      ...prev,
      [language]: {
        ...prev[language],
        about: { ...prev[language].about, ...fields },
      },
    }));
  };

  const updateSkills = (skills) => {
    setAllData((prev) => ({
      ...prev,
      [language]: {
        ...prev[language],
        skills,
      },
    }));
  };

  const addSkill = (newSkill) => {
    setAllData((prev) => ({
      ...prev,
      [language]: {
        ...prev[language],
        skills: [...(prev[language]?.skills || []), { id: `s_${Date.now()}`, ...newSkill }],
      },
    }));
  };

  const removeSkill = (id) => {
    setAllData((prev) => ({
      ...prev,
      [language]: {
        ...prev[language],
        skills: (prev[language]?.skills || []).filter((s) => s.id !== id),
      },
    }));
  };

  const updateProjects = (projects) => {
    setAllData((prev) => ({
      ...prev,
      [language]: {
        ...prev[language],
        projects,
      },
    }));
  };

  const addProject = (newProject) => {
    setAllData((prev) => ({
      ...prev,
      [language]: {
        ...prev[language],
        projects: [{ id: `p_${Date.now()}`, ...newProject }, ...(prev[language]?.projects || [])],
      },
    }));
  };

  const removeProject = (id) => {
    setAllData((prev) => ({
      ...prev,
      [language]: {
        ...prev[language],
        projects: (prev[language]?.projects || []).filter((p) => p.id !== id),
      },
    }));
  };

  const updateExperience = (experience) => {
    setAllData((prev) => ({
      ...prev,
      [language]: {
        ...prev[language],
        experience,
      },
    }));
  };

  const addExperience = (newExp) => {
    setAllData((prev) => ({
      ...prev,
      [language]: {
        ...prev[language],
        experience: [{ id: `e_${Date.now()}`, ...newExp }, ...(prev[language]?.experience || [])],
      },
    }));
  };

  const removeExperience = (id) => {
    setAllData((prev) => ({
      ...prev,
      [language]: {
        ...prev[language],
        experience: (prev[language]?.experience || []).filter((e) => e.id !== id),
      },
    }));
  };

  const updateContact = (fields) => {
    setAllData((prev) => ({
      ...prev,
      [language]: {
        ...prev[language],
        contact: { ...prev[language].contact, ...fields },
      },
    }));
  };

  const updateSettings = (fields) => {
    setAllData((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...fields },
    }));
  };

  const exportData = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(allData, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", `portfolio-config-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
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
        isEditMode,
        isCmsOpen,
        cmsTab,
        active3DShape,
        setActive3DShape,
        setCmsTab,
        toggleEditMode,
        openCms,
        closeCms,
        activeMascot,
        setActiveMascot,
        isStickerGalleryOpen,
        setIsStickerGalleryOpen,
        openStickerGallery,
        closeStickerGallery,
        isAuthenticated,
        isAuthModalOpen,
        requestAuth,
        authenticate,
        closeAuthModal,
        logout,
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
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};
