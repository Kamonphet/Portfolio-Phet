import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";
import EditableText from "./EditableText";
import { sanitizeUrl } from "../utils/security";
import {
  FiExternalLink,
  FiGithub,
  FiStar,
  FiX,
  FiArrowRight,
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiCode,
  FiLayers,
  FiBookOpen,
  FiImage,
} from "react-icons/fi";

// Luxury Project Card with Cursor Spotlight & 3D Tilt (<= 6 deg)
const LuxuryProjectCard = ({
  project,
  index,
  isEditMode,
  updateProjects,
  onOpenDetail,
  allProjects,
  navigate,
}) => {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, isHovered: false });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y, isHovered: true });

    // Restrain 3D tilt to <= 6 degrees
    const maxTilt = 6;
    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;
    setTilt({
      x: -normY * maxTilt,
      y: normX * maxTilt,
    });
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, isHovered: false }));
    setTilt({ x: 0, y: 0 });
  };

  const handleGoToDetail = (e) => {
    if (e) e.stopPropagation();
    if (!isEditMode && navigate && project?.id) {
      navigate(`/projects/${project.id}`);
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleGoToDetail}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: mousePos.isHovered ? "transform 0.12s ease-out" : "transform 0.5s ease-out",
        cursor: isEditMode ? "default" : "pointer",
        position: "relative",
        overflow: "hidden",
        borderRadius: "20px",
        background: "var(--color-card-bg)",
        border: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        boxShadow: "var(--color-card-shadow)",
      }}
      className="project-luxury-card"
    >
      {/* Dynamic Cursor Spotlight Overlay */}
      {mousePos.isHovered && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 1,
            background: `radial-gradient(380px circle at ${mousePos.x}px ${mousePos.y}px, var(--accent-glow), transparent 70%)`,
          }}
        />
      )}

      {/* Image Container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "220px",
          overflow: "hidden",
          background: "var(--bg-elevated)",
        }}
      >
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
            transform: mousePos.isHovered ? "scale(1.05)" : "scale(1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, transparent 40%, var(--bg-surface) 100%)",
            opacity: 0.85,
          }}
        />

        {/* Category Pill Tag */}
        <div
          style={{
            position: "absolute",
            top: "14px",
            left: "14px",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "4px 10px",
            borderRadius: "100px",
            background: "var(--nav-pill-bg)",
            backdropFilter: "blur(12px)",
            border: "1px solid var(--border-glass)",
            fontSize: "0.72rem",
            fontFamily: "var(--font-mono)",
            color: "var(--accent)",
            fontWeight: "600",
            zIndex: 2,
          }}
        >
          {project.category}
        </div>

        {/* Featured Star Badge */}
        {project.featured && (
          <div
            style={{
              position: "absolute",
              top: "14px",
              right: "14px",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "4px 10px",
              borderRadius: "100px",
              background: "rgba(245, 158, 11, 0.15)",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              color: "#F59E0B",
              fontSize: "0.72rem",
              fontFamily: "var(--font-mono)",
              fontWeight: "700",
              zIndex: 2,
            }}
          >
            <FiStar size={11} />
            <span>FEATURED</span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div
        style={{
          padding: "1.4rem",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "space-between",
          gap: "1rem",
          zIndex: 2,
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "1.18rem",
              fontWeight: "700",
              color: "var(--text-primary)",
              lineHeight: 1.35,
              marginBottom: "8px",
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.015em",
            }}
          >
            <EditableText
              value={project.title}
              onSave={(val) => {
                const updated = allProjects.map((p) =>
                  p.id === project.id ? { ...p, title: val } : p
                );
                updateProjects(updated);
              }}
            />
          </h3>

          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.86rem",
              lineHeight: 1.6,
              margin: 0,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            <EditableText
              value={project.desc}
              onSave={(val) => {
                const updated = allProjects.map((p) =>
                  p.id === project.id ? { ...p, desc: val } : p
                );
                updateProjects(updated);
              }}
              multiline
            />
          </p>
        </div>

        {/* Tech Stack Chips & Action Cue */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "8px",
            paddingTop: "12px",
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {(project.tech || []).slice(0, 3).map((tech, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: "0.7rem",
                  fontFamily: "var(--font-mono)",
                  padding: "3px 8px",
                  borderRadius: "6px",
                  background: "var(--accent-muted)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-secondary)",
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          <div
            onClick={handleGoToDetail}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              color: "var(--accent)",
              fontSize: "0.82rem",
              fontWeight: "700",
              fontFamily: "var(--font-mono)",
              cursor: "pointer",
              transition: "transform 0.2s ease, opacity 0.2s ease",
            }}
          >
            <span>VIEW</span>
            <FiArrowRight size={13} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Projects Showcase Component
const Projects = ({ showAll = false }) => {
  const navigate = useNavigate();
  const { data, updateProjects, isEditMode, openCms, t } = usePortfolio();

  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);

  // Carousel State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [isPaused, setIsPaused] = useState(false);

  const filterTabs = [
    { id: "All", label: "All Works", icon: <FiLayers /> },
    { id: "EdTech", label: "สื่อการสอน", icon: <FiBookOpen /> },
    { id: "Stickers", label: "สติกเกอร์ & กราฟิก", icon: <FiImage /> },
    { id: "Projects", label: "โปรเจกต์ & โค้ด", icon: <FiCode /> },
  ];

  const allProjects = data?.projects || [];

  // Responsive Items Per Page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter items matching selected category
  const filteredProjects = allProjects.filter((p) => {
    if (activeCategory === "All") return true;
    const cat = (p.category || "").toLowerCase();
    const title = (p.title || "").toLowerCase();
    const desc = (p.desc || "").toLowerCase();

    if (activeCategory === "EdTech") {
      return (
        cat.includes("สื่อ") ||
        cat.includes("edtech") ||
        cat.includes("เรียน") ||
        cat.includes("สอน") ||
        title.includes("สื่อ") ||
        desc.includes("สื่อ")
      );
    }
    if (activeCategory === "Stickers") {
      return (
        cat.includes("สติก") ||
        cat.includes("sticker") ||
        cat.includes("art") ||
        cat.includes("creative") ||
        cat.includes("design") ||
        title.includes("สติก")
      );
    }
    if (activeCategory === "Projects") {
      return (
        cat.includes("web") ||
        cat.includes("app") ||
        cat.includes("sec") ||
        cat.includes("code") ||
        cat.includes("project")
      );
    }
    return true;
  });

  // Calculate carousel limits
  const maxIndex = Math.max(0, filteredProjects.length - itemsPerPage);

  // Reset index when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  // Ensure currentIndex stays within bounds when itemsPerPage changes
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  // Autoplay functionality (pauses on hover)
  useEffect(() => {
    if (showAll || isPaused || filteredProjects.length <= itemsPerPage) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(interval);
  }, [showAll, isPaused, filteredProjects.length, itemsPerPage, maxIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedProject(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section id="projects" className="content-section" style={{ overflow: "hidden" }}>
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: "center", marginBottom: "2.5rem" }}
      >
        {showAll && (
          <div style={{ marginBottom: "1.5rem" }}>
            <button
              onClick={() => navigate("/")}
              className="btn-luxury-secondary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 18px",
                fontSize: "0.85rem",
              }}
            >
              <FiArrowLeft />
              <span>กลับสู่หน้าแรก (Home)</span>
            </button>
          </div>
        )}

        <span className="eyebrow-label">// 02 — INNOVATIVE WORK & ARTIFACTS</span>
        <h2 className="section-title">
          {t.projects?.titlePre || "คลังนวัตกรรมและ"}{" "}
          <span className="gradient-text">{t.projects?.titleHighlight || "ผลงานสร้างสรรค์"}</span>
        </h2>
        <p className="section-subtitle">
          {t.projects?.subtitle ||
            "รวมผลงานพัฒนาสื่อนวัตกรรมการศึกษา สติกเกอร์สร้างสรรค์ และโปรเจกต์เทคโนโลยีความมั่นคงปลอดภัย"}
        </p>

        {/* Animated Filter Tabs */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            background: "var(--accent-muted)",
            padding: "4px",
            borderRadius: "100px",
            border: "1px solid var(--border-subtle)",
            maxWidth: "96vw",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {filterTabs.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                style={{
                  position: "relative",
                  background: "transparent",
                  border: "none",
                  color: isActive ? "var(--nav-link-active)" : "var(--nav-link-color)",
                  fontFamily: "var(--font-display)",
                  fontSize: "0.86rem",
                  fontWeight: isActive ? "700" : "500",
                  padding: "7px 18px",
                  borderRadius: "100px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  whiteSpace: "nowrap",
                  transition: "color 0.2s ease",
                  zIndex: 1,
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="projectActiveFilter"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "var(--nav-pill-bg)",
                      border: "1px solid var(--accent-border)",
                      borderRadius: "100px",
                      boxShadow: "0 4px 15px var(--accent-muted)",
                      zIndex: -1,
                    }}
                  />
                )}
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Main Display: Carousel on Home, Grid on AllProjectsPage */}
      {showAll ? (
        /* Full Grid for /projects page */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <LuxuryProjectCard
                project={project}
                index={idx}
                isEditMode={isEditMode}
                updateProjects={updateProjects}
                onOpenDetail={(proj) => setSelectedProject(proj)}
                allProjects={allProjects}
                navigate={navigate}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        /* Interactive Carousel Mode */
        <div
          className="carousel-container"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{ position: "relative", width: "100%" }}
        >
          {/* Carousel Viewport */}
          <div
            style={{
              overflow: "hidden",
              position: "relative",
              width: "100%",
              padding: "10px 0 20px 0",
            }}
          >
            <motion.div
              className="carousel-track"
              animate={{
                x: `-${currentIndex * (100 / itemsPerPage)}%`,
              }}
              transition={{
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                display: "flex",
                margin: "0 -0.75rem",
                willChange: "transform",
              }}
            >
              {filteredProjects.map((project, idx) => (
                <div
                  key={project.id || idx}
                  style={{
                    flex: `0 0 ${100 / itemsPerPage}%`,
                    maxWidth: `${100 / itemsPerPage}%`,
                    padding: "0 0.75rem",
                    boxSizing: "border-box",
                  }}
                >
                  <LuxuryProjectCard
                    project={project}
                    index={idx}
                    isEditMode={isEditMode}
                    updateProjects={updateProjects}
                    onOpenDetail={(proj) => setSelectedProject(proj)}
                    allProjects={allProjects}
                    navigate={navigate}
                  />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Carousel Navigation Bar (Prev / Next & Dots) */}
          {filteredProjects.length > itemsPerPage && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "1.25rem",
                marginTop: "1.25rem",
              }}
            >
              {/* Prev Button */}
              <button
                onClick={handlePrev}
                aria-label="Previous project"
                className="carousel-nav-btn"
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: "var(--nav-pill-bg)",
                  border: "1px solid var(--border-glass)",
                  color: "var(--text-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.2s ease",
                }}
              >
                <FiChevronLeft size={20} />
              </button>

              {/* Dots / Page Indicator */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  borderRadius: "100px",
                  background: "var(--nav-pill-bg)",
                  border: "1px solid var(--border-subtle)",
                  backdropFilter: "blur(12px)",
                }}
              >
                {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    style={{
                      width: currentIndex === idx ? "22px" : "8px",
                      height: "8px",
                      borderRadius: "100px",
                      background:
                        currentIndex === idx ? "var(--accent)" : "var(--text-tertiary)",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                      opacity: currentIndex === idx ? 1 : 0.45,
                    }}
                  />
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                aria-label="Next project"
                className="carousel-nav-btn"
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: "var(--nav-pill-bg)",
                  border: "1px solid var(--border-glass)",
                  color: "var(--text-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.2s ease",
                }}
              >
                <FiChevronRight size={20} />
              </button>
            </div>
          )}

          {/* View More Projects CTA Button */}
          <div style={{ textAlign: "center", marginTop: "2.75rem" }}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/projects")}
              className="btn-luxury-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "14px 34px",
                fontSize: "0.96rem",
                fontWeight: "600",
                letterSpacing: "0.02em",
                borderRadius: "100px",
                boxShadow: "0 8px 30px var(--accent-glow)",
                cursor: "pointer",
              }}
            >
              <span>ดูผลงานเพิ่มเติม</span>
              <FiArrowRight size={18} />
            </motion.button>
          </div>
        </div>
      )}

      {/* Empty Filter State */}
      {filteredProjects.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            color: "var(--text-secondary)",
          }}
        >
          <p>ไม่พบรายการในหมวดหมู่นี้</p>
        </div>
      )}

      {/* Add Project Button (in Edit Mode) */}
      {isEditMode && (
        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <button
            onClick={() => openCms("projects")}
            className="btn-luxury-primary"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
          >
            <FiPlus />
            <span>จัดการ / เพิ่มผลงานใหม่</span>
          </button>
        </div>
      )}

      {/* Detail Modal (Shared-Element / Luxury Glass Panel) */}
      <AnimatePresence>
        {selectedProject && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 2000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1.25rem",
            }}
          >
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0, 0, 0, 0.75)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
              }}
            />

            {/* Modal Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "760px",
                maxHeight: "90vh",
                overflowY: "auto",
                background: "var(--bg-surface)",
                border: "1px solid var(--border-glass)",
                borderRadius: "24px",
                boxShadow: "0 30px 80px rgba(0, 0, 0, 0.7)",
                zIndex: 10,
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "var(--glass-bg)",
                  border: "1px solid var(--border-glass)",
                  color: "var(--text-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 20,
                  transition: "all 0.2s ease",
                }}
                aria-label="Close modal"
              >
                <FiX size={18} />
              </button>

              {/* Modal Cover Image */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "320px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, transparent 40%, var(--bg-surface) 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "20px",
                    left: "24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: "100px",
                      background: "var(--nav-pill-bg)",
                      border: "1px solid var(--accent-border)",
                      color: "var(--accent)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.78rem",
                      fontWeight: "600",
                    }}
                  >
                    {selectedProject.category}
                  </span>
                </div>
              </div>

              {/* Modal Body */}
              <div
                style={{
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: "1.75rem",
                      fontWeight: "700",
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-display)",
                      letterSpacing: "-0.02em",
                      marginBottom: "12px",
                    }}
                  >
                    {selectedProject.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "1rem",
                      lineHeight: "1.8",
                      margin: 0,
                    }}
                  >
                    {selectedProject.desc}
                  </p>
                </div>

                {/* Tech Stack List */}
                <div>
                  <div
                    style={{
                      fontSize: "0.76rem",
                      fontFamily: "var(--font-mono)",
                      color: "var(--text-tertiary)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                    }}
                  >
                    // TECH STACK & TOOLS
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {(selectedProject.tech || []).map((t, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: "0.8rem",
                          fontFamily: "var(--font-mono)",
                          padding: "5px 12px",
                          borderRadius: "8px",
                          background: "var(--accent-muted)",
                          border: "1px solid var(--border-subtle)",
                          color: "var(--text-primary)",
                          fontWeight: "500",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    flexWrap: "wrap",
                    paddingTop: "1rem",
                    borderTop: "1px solid var(--border-subtle)",
                  }}
                >
                  {selectedProject.demoUrl && (
                    <a
                      href={sanitizeUrl(selectedProject.demoUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-luxury-primary"
                    >
                      <span>เปิดดูผลงานจริง</span>
                      <FiExternalLink />
                    </a>
                  )}

                  {selectedProject.githubUrl && (
                    <a
                      href={sanitizeUrl(selectedProject.githubUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-luxury-secondary"
                    >
                      <FiGithub />
                      <span>ดูซอร์สโค้ด (GitHub)</span>
                    </a>
                  )}

                  <button
                    onClick={() => {
                      setSelectedProject(null);
                      navigate(`/projects/${selectedProject.id}`);
                    }}
                    className="btn-luxury-secondary"
                  >
                    <span>หน้ารายละเอียดเต็ม</span>
                    <FiArrowRight />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .carousel-nav-btn:hover {
          border-color: var(--accent) !important;
          color: var(--accent) !important;
          transform: scale(1.08);
        }
      `}</style>
    </section>
  );
};

export default Projects;
