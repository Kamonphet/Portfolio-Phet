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
  FiGlobe,
  FiLock,
  FiSun,
  FiMoon,
} from "react-icons/fi";

const Navbar = () => {
  const {
    data,
    language,
    toggleLanguage,
    theme,
    toggleTheme,
    isDarkMode,
    t,
    isEditMode,
    toggleEditMode,
    openCms,
    isAuthenticated,
    logout,
  } = usePortfolio();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
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
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
        padding: isScrolled ? "0.8rem 1.5rem" : "1.1rem 1.5rem",
        background: isScrolled ? "var(--color-navbar-scrolled)" : "var(--color-navbar-bg)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: isScrolled
          ? "1px solid var(--color-card-border)"
          : "1px solid rgba(128, 128, 128, 0.12)",
        boxShadow: isScrolled ? "var(--color-card-shadow)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Brand Logo */}
        <div
          onClick={() => scrollToSection("home")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, rgba(0, 242, 254, 0.2), rgba(138, 43, 226, 0.3))",
              border: "1px solid var(--color-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-primary)",
              boxShadow: "0 0 15px rgba(0, 242, 254, 0.3)",
            }}
          >
            <FiTerminal size={19} />
          </div>
          <div>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: "800",
                fontSize: "1.15rem",
                letterSpacing: "0.5px",
                color: "var(--color-text-main)",
                transition: "color 0.3s ease",
              }}
            >
              {data.hero?.name || "CIPHER"}{" "}
              <span style={{ color: "var(--color-primary)", fontSize: "0.85rem" }}>.DEV</span>
            </span>
          </div>
        </div>

        {/* Desktop Nav Items (>= 860px) */}
        <nav style={{ display: "none", alignItems: "center", gap: "1.8rem" }} className="desktop-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--color-text-dim)",
                fontSize: "0.92rem",
                fontWeight: "500",
                cursor: "pointer",
                padding: "6px 0",
                position: "relative",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-dim)")}
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* Action Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Theme Toggle Button (Dark / Light) */}
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              background: "var(--color-glass-subtle)",
              border: "1px solid var(--color-card-border)",
              color: isDarkMode ? "var(--color-accent-1)" : "var(--color-primary)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              flexShrink: 0,
            }}
            title={isDarkMode ? (t.nav.themeLight || "Switch to Light Mode") : (t.nav.themeDark || "Switch to Dark Mode")}
            aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.2 }}
              style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              {isDarkMode ? <FiSun size={17} /> : <FiMoon size={17} />}
            </motion.div>
          </motion.button>

          {/* Language Toggle Switch (TH / EN) - Always Visible */}
          <button
            onClick={toggleLanguage}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              background: "var(--color-glass-subtle)",
              border: "1px solid var(--color-card-border)",
              borderRadius: "20px",
              padding: "4px 10px",
              fontSize: "0.8rem",
              fontWeight: "700",
              color: "var(--color-text-main)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              flexShrink: 0,
            }}
            title={language === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"}
          >
            <FiGlobe style={{ color: "var(--color-primary)" }} />
            <span style={{ color: language === "th" ? "var(--color-primary)" : "var(--color-text-dim)" }}>
              TH
            </span>
            <span style={{ color: "var(--color-text-muted)", opacity: 0.4 }}>|</span>
            <span style={{ color: language === "en" ? "var(--color-primary)" : "var(--color-text-dim)" }}>
              EN
            </span>
          </button>

          {/* Desktop Edit Mode Button (>= 860px) */}
          <button
            onClick={toggleEditMode}
            className={`desktop-action-btn ${isEditMode ? "edit-active-pill" : ""}`}
            style={{
              display: "none",
              alignItems: "center",
              gap: "6px",
              background: isEditMode
                ? "var(--color-btn-primary-bg)"
                : "var(--color-glass-subtle)",
              color: isEditMode ? "var(--color-btn-primary-text)" : "var(--color-text-main)",
              border: isEditMode
                ? "1px solid var(--color-primary)"
                : "1px solid var(--color-card-border)",
              borderRadius: "20px",
              padding: "6px 13px",
              fontSize: "0.82rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            title="Toggle inline live text editing"
          >
            <FiEdit3 />
            <span>{isEditMode ? t.nav.editActive : t.nav.editMode}</span>
          </button>

          {/* Desktop CMS Manager Button (>= 860px) */}
          <button
            onClick={handleCmsClick}
            className="desktop-action-btn"
            style={{
              display: "none",
              alignItems: "center",
              gap: "6px",
              background: "linear-gradient(135deg, rgba(138, 43, 226, 0.25), rgba(0, 242, 254, 0.2))",
              color: "#fff",
              border: "1px solid rgba(138, 43, 226, 0.5)",
              borderRadius: "20px",
              padding: "6px 13px",
              fontSize: "0.82rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            title="Open Full Content Manager & JSON Backup"
          >
            <FiSettings />
            <span>{t.nav.cms}</span>
          </button>

          {/* Desktop Logout/Lock button if authenticated */}
          {isAuthenticated && (
            <button
              onClick={logout}
              className="desktop-action-btn"
              style={{
                display: "none",
                alignItems: "center",
                gap: "4px",
                background: "rgba(255, 71, 87, 0.15)",
                color: "#ff4757",
                border: "1px solid rgba(255, 71, 87, 0.3)",
                borderRadius: "20px",
                padding: "6px 10px",
                fontSize: "0.78rem",
                cursor: "pointer",
              }}
              title="Lock editing (ออกจากระบบ)"
            >
              <FiLock size={13} />
            </button>
          )}

          {/* Mobile Menu Toggle Button (< 860px) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--color-glass-subtle)",
              border: "1px solid var(--color-card-border)",
              borderRadius: "8px",
              width: "38px",
              height: "38px",
              color: "var(--color-text-main)",
              cursor: "pointer",
            }}
            className="mobile-toggle"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu (< 860px) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            style={{
              background: isDarkMode ? "rgba(8, 12, 24, 0.97)" : "rgba(255, 255, 255, 0.96)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid var(--color-card-border)",
              padding: "1.2rem 1.5rem",
              marginTop: "0.8rem",
              borderRadius: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              boxShadow: "var(--color-card-shadow-hover)",
            }}
          >
            {/* Mobile Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "var(--color-glass-subtle)",
                border: "1px solid var(--color-card-border)",
                borderRadius: "10px",
                padding: "10px 14px",
                color: "var(--color-text-main)",
                fontSize: "0.95rem",
                fontWeight: "600",
                cursor: "pointer",
                marginBottom: "4px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: isDarkMode ? "var(--color-accent-1)" : "var(--color-primary)", fontSize: "1.15rem", display: "flex" }}>
                  {isDarkMode ? <FiSun /> : <FiMoon />}
                </span>
                <span>{isDarkMode ? (t.nav.themeLight || "โหมดสว่าง (Light)") : (t.nav.themeDark || "โหมดมืด (Dark)")}</span>
              </div>
              <span
                style={{
                  fontSize: "0.75rem",
                  padding: "3px 8px",
                  borderRadius: "12px",
                  background: "var(--color-badge-bg)",
                  color: "var(--color-primary)",
                  border: "1px solid var(--color-badge-border)",
                }}
              >
                {theme.toUpperCase()}
              </span>
            </button>
            {/* Nav links */}
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  background: "transparent",
                  border: "none",
                  color: "var(--color-text-main)",
                  fontSize: "1.02rem",
                  textAlign: "left",
                  padding: "10px 6px",
                  cursor: "pointer",
                  borderRadius: "6px",
                }}
              >
                <span style={{ color: "var(--color-primary)", fontSize: "1.1rem" }}>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}

            {/* Divider */}
            <div
              style={{
                height: "1px",
                background: "rgba(255, 255, 255, 0.1)",
                margin: "4px 0",
              }}
            />

            {/* Mobile Action: Content CMS Button */}
            <button
              onClick={handleCmsClick}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "12px",
                fontSize: "0.95rem",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(0, 242, 254, 0.25)",
              }}
            >
              <FiSettings size={18} />
              <span>{t.nav.cms} (Content CMS)</span>
            </button>

            {/* Mobile Action: Live Edit Button */}
            <button
              onClick={handleEditClick}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                background: isEditMode
                  ? "rgba(0, 242, 254, 0.2)"
                  : "rgba(255, 255, 255, 0.06)",
                color: isEditMode ? "var(--color-primary)" : "var(--color-text-main)",
                border: isEditMode
                  ? "1px solid var(--color-primary)"
                  : "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "10px",
                padding: "12px",
                fontSize: "0.95rem",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              <FiEdit3 size={18} />
              <span>{isEditMode ? t.nav.editActive : t.nav.editMode}</span>
            </button>

            {/* Mobile Action: Lock if authenticated */}
            {isAuthenticated && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  background: "transparent",
                  color: "#ff4757",
                  border: "1px solid rgba(255, 71, 87, 0.3)",
                  borderRadius: "8px",
                  padding: "8px",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  marginTop: "4px",
                }}
              >
                <FiLock size={14} />
                <span>{language === "th" ? "ล็อคระบบ (Logout)" : "Lock Admin Session"}</span>
              </button>
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
