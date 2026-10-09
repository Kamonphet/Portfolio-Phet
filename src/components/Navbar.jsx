import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";
import {
  FiTerminal,
  FiUser,
  FiCode,
  FiFolder,
  FiBriefcase,
  FiMail,
  FiEdit3,
  FiSettings,
  FiMenu,
  FiX,
  FiLock,
  FiSun,
  FiMoon,
} from "react-icons/fi";

const Navbar = () => {
  const {
    data,
    theme,
    toggleTheme,
    isDarkMode,
    language,
    toggleLanguage,
    t,
    isEditMode,
    toggleEditMode,
    openCms,
    isAuthenticated,
    logout,
  } = usePortfolio();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const navItems = [
    { name: t.nav.home, id: "home", icon: <FiTerminal /> },
    { name: t.nav.about, id: "about", icon: <FiUser /> },
    { name: t.nav.skills, id: "skills", icon: <FiCode /> },
    { name: t.nav.projects, id: "projects", icon: <FiFolder /> },
    { name: t.nav.experience, id: "experience", icon: <FiBriefcase /> },
    { name: t.nav.contact, id: "contact", icon: <FiMail /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = ["contact", "experience", "projects", "skills", "about", "home"];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionId);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [isAdminParam, setIsAdminParam] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.has("admin") || params.has("edit")) {
        setIsAdminParam(true);
      }
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "E" || e.key === "e")) {
        e.preventDefault();
        toggleEditMode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleEditMode]);

  const showAdminActions = isAuthenticated || isAdminParam;

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/#${id}`;
    }
  };

  const handleCmsClick = () => {
    setMobileMenuOpen(false);
    openCms("profile");
  };

  const handleEditClick = () => {
    setMobileMenuOpen(false);
    toggleEditMode();
  };

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        top: isScrolled ? "12px" : "20px",
        left: 0,
        width: "100%",
        zIndex: 1000,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        padding: "0 1rem",
        transition: "top 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {/* Floating Glass Pill Container */}
      <div
        style={{
          width: "100%",
          maxWidth: "960px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "7px 16px 7px 20px",
          background: "var(--nav-pill-bg)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid var(--nav-pill-border)",
          borderRadius: "100px",
          boxShadow: "var(--nav-pill-shadow)",
          pointerEvents: "auto",
          transition: "all 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* Brand Identity */}
        <div
          onClick={() => scrollToSection("home")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "var(--accent-muted)",
              border: "1px solid var(--accent-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent)",
              fontSize: "0.9rem",
            }}
          >
            <FiTerminal />
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: "700",
                fontSize: "0.98rem",
                letterSpacing: "-0.02em",
                color: "var(--text-primary)",
              }}
            >
              ครูเพชร IT
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: "var(--accent)",
                letterSpacing: "0.08em",
                fontWeight: "600",
              }}
            >
              // 00
            </span>
          </div>
        </div>

        {/* Desktop Nav Items with Framer Motion Active Indicator */}
        <nav
          style={{
            display: "none",
            alignItems: "center",
            gap: "4px",
            background: "var(--accent-muted)",
            padding: "3px 4px",
            borderRadius: "100px",
            border: "1px solid var(--border-subtle)",
          }}
          className="desktop-nav"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                style={{
                  position: "relative",
                  background: "transparent",
                  border: "none",
                  color: isActive ? "var(--nav-link-active)" : "var(--nav-link-color)",
                  fontSize: "0.88rem",
                  fontWeight: isActive ? "700" : "600",
                  fontFamily: "var(--font-display)",
                  letterSpacing: "-0.01em",
                  cursor: "pointer",
                  padding: "6px 14px",
                  borderRadius: "100px",
                  transition: "color 0.2s ease",
                  zIndex: 1,
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "var(--nav-active-bg)",
                      border: "1px solid var(--nav-active-border)",
                      borderRadius: "100px",
                      zIndex: -1,
                    }}
                  />
                )}
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Action Controls: Language, Theme, & Admin */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Segmented Minimalist Language Toggle */}
          <button
            onClick={toggleLanguage}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              background: "var(--accent-muted)",
              border: "1px solid var(--border-glass)",
              borderRadius: "100px",
              padding: "4px 10px",
              fontSize: "0.76rem",
              fontFamily: "var(--font-mono)",
              color: "var(--nav-link-color)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            title={language === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"}
          >
            <span style={{ color: language === "th" ? "var(--accent)" : "inherit", fontWeight: language === "th" ? "700" : "600" }}>
              TH
            </span>
            <span style={{ opacity: 0.4 }}>/</span>
            <span style={{ color: language === "en" ? "var(--accent)" : "inherit", fontWeight: language === "en" ? "700" : "600" }}>
              EN
            </span>
          </button>

          {/* Theme Toggle (Dark / Light) */}
          <button
            onClick={toggleTheme}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "var(--accent-muted)",
              border: "1px solid var(--border-glass)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--nav-link-color)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            title={isDarkMode ? "เปลี่ยนเป็นโหมดสว่าง (ฟ้า-ขาว)" : "เปลี่ยนเป็นโหมดมืด (ฟ้า-ดำ)"}
          >
            {isDarkMode ? <FiSun size={15} style={{ color: "var(--accent)" }} /> : <FiMoon size={15} style={{ color: "var(--accent)" }} />}
          </button>

          {/* Desktop Admin Edit Button */}
          {showAdminActions && (
            <button
              onClick={handleEditClick}
              style={{
                display: "none",
                alignItems: "center",
                gap: "6px",
                background: isEditMode ? "var(--nav-active-bg)" : "var(--accent-muted)",
                color: isEditMode ? "var(--accent)" : "var(--nav-link-color)",
                border: isEditMode ? "1px solid var(--nav-active-border)" : "1px solid var(--border-glass)",
                borderRadius: "100px",
                padding: "5px 12px",
                fontSize: "0.78rem",
                fontFamily: "var(--font-mono)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontWeight: "600",
              }}
              className="desktop-action-btn"
              title="Toggle inline live text editing"
            >
              <FiEdit3 size={13} />
              <span>{isEditMode ? "EDITING" : "EDIT"}</span>
            </button>
          )}

          {/* Desktop CMS Button */}
          {showAdminActions && (
            <button
              onClick={handleCmsClick}
              style={{
                display: "none",
                alignItems: "center",
                gap: "6px",
                background: "var(--accent-muted)",
                color: "var(--nav-link-color)",
                border: "1px solid var(--border-glass)",
                borderRadius: "100px",
                padding: "5px 12px",
                fontSize: "0.78rem",
                fontFamily: "var(--font-mono)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontWeight: "600",
              }}
              className="desktop-action-btn"
              title="Open Content Manager & JSON Backup"
            >
              <FiSettings size={13} />
              <span>CMS</span>
            </button>
          )}

          {/* Desktop Logout Button */}
          {isAuthenticated && (
            <button
              onClick={logout}
              style={{
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "rgba(239, 68, 68, 0.12)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#EF4444",
                cursor: "pointer",
              }}
              className="desktop-action-btn"
              title="Lock admin session"
            >
              <FiLock size={13} />
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "var(--accent-muted)",
              border: "1px solid var(--border-glass)",
              color: "var(--text-primary)",
              cursor: "pointer",
            }}
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <FiX size={16} /> : <FiMenu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu (High Contrast Glass Panel) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute",
              top: "calc(100% + 10px)",
              left: "1rem",
              right: "1rem",
              maxWidth: "480px",
              margin: "0 auto",
              background: "var(--nav-pill-bg)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid var(--nav-pill-border)",
              borderRadius: "20px",
              padding: "1.25rem",
              boxShadow: "var(--nav-pill-shadow)",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              pointerEvents: "auto",
            }}
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  background: activeSection === item.id ? "var(--nav-active-bg)" : "transparent",
                  border: activeSection === item.id ? "1px solid var(--nav-active-border)" : "none",
                  color: activeSection === item.id ? "var(--accent)" : "var(--nav-link-color)",
                  fontSize: "0.96rem",
                  fontFamily: "var(--font-display)",
                  textAlign: "left",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontWeight: activeSection === item.id ? "700" : "600",
                }}
              >
                <span style={{ color: "var(--accent)", fontSize: "1rem" }}>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}

            {showAdminActions && (
              <>
                <div style={{ height: "1px", background: "var(--border-subtle)", margin: "6px 0" }} />
                <button
                  onClick={handleEditClick}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    background: "var(--glass-bg)",
                    border: "1px solid var(--border-glass)",
                    color: "var(--text-primary)",
                    padding: "10px",
                    borderRadius: "10px",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  <FiEdit3 />
                  <span>{isEditMode ? "โหมดแก้ไข: กำลังทำงาน" : "เปิดโหมดแก้ไข"}</span>
                </button>
                <button
                  onClick={handleCmsClick}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    background: "var(--accent-muted)",
                    border: "1px solid var(--accent-border)",
                    color: "var(--accent)",
                    padding: "10px",
                    borderRadius: "10px",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  <FiSettings />
                  <span>จัดการข้อมูลเว็บไซต์ (CMS)</span>
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 860px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-action-btn {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </motion.header>
  );
};

export default Navbar;
