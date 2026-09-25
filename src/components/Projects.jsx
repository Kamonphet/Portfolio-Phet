import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";
import EditableText from "./EditableText";
import {
  FiFolder,
  FiExternalLink,
  FiGithub,
  FiPlus,
  FiTrash2,
  FiEye,
  FiX,
  FiStar,
  FiChevronLeft,
  FiChevronRight,
  FiArrowRight,
} from "react-icons/fi";

const CAROUSEL_LIMIT = 6;
const AUTO_PLAY_INTERVAL = 4000;

const Projects = ({ showAll = false }) => {
  const { data, updateProjects, removeProject, isEditMode, openCms, t } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const carouselRef = useRef(null);

  const categories = t.projects.categories || ["All", "Web App", "3D & Creative", "Security"];

  const allProjects = data?.projects || [];

  // For main page: only show first CAROUSEL_LIMIT projects
  const displayProjects = showAll ? allProjects : allProjects.slice(0, CAROUSEL_LIMIT);

  const filteredProjects = showAll
    ? displayProjects.filter((project) => {
        if (activeCategory === "All" || activeCategory === "ทั้งหมด") return true;
        const catLower = (project.category || "").toLowerCase();
        const selLower = activeCategory.toLowerCase();
        if (selLower.includes("web")) return catLower.includes("web");
        if (selLower.includes("3d") || selLower.includes("creative")) return catLower.includes("3d") || catLower.includes("creative");
        if (selLower.includes("sec") || selLower.includes("security")) return catLower.includes("sec");
        return catLower.includes(selLower);
      })
    : displayProjects;

  const totalSlides = filteredProjects.length;

  // How many cards visible at once
  const getVisibleCount = useCallback(() => {
    if (typeof window === "undefined") return 3;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 960) return 2;
    return 3;
  }, []);

  const [visibleCount, setVisibleCount] = useState(getVisibleCount());

  useEffect(() => {
    const handleResize = () => setVisibleCount(getVisibleCount());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getVisibleCount]);

  const maxSlideIndex = Math.max(0, totalSlides - visibleCount);

  // Auto-play
  useEffect(() => {
    if (showAll || isPaused || totalSlides <= visibleCount) return;

    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev >= maxSlideIndex ? 0 : prev + 1));
    }, AUTO_PLAY_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [showAll, isPaused, totalSlides, visibleCount, maxSlideIndex]);

  const goToSlide = (idx) => {
    setCurrentSlide(Math.max(0, Math.min(idx, maxSlideIndex)));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev <= 0 ? maxSlideIndex : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev >= maxSlideIndex ? 0 : prev + 1));
  };

  // Render single project card
  const renderProjectCard = (project, index) => (
    <motion.div
      key={project.id}
      layout
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10, transition: { duration: 0.2 } }}
      className="glass-card"
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        minWidth: 0,
      }}
    >
      {/* Project Image Preview */}
      <div
        style={{
          position: "relative",
          height: "200px",
          overflow: "hidden",
          cursor: "pointer",
        }}
        onClick={() => setSelectedProject(project)}
      >
        <img
          src={project.image}
          alt={project.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, transparent 50%, var(--color-bg) 100%)",
          }}
        />

        {/* Category Badge */}
        <span
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            background: "var(--color-badge-bg)",
            backdropFilter: "blur(8px)",
            border: "1px solid var(--color-badge-border)",
            color: "var(--color-primary)",
            padding: "4px 10px",
            borderRadius: "20px",
            fontSize: "0.75rem",
            fontWeight: "600",
          }}
        >
          {project.category}
        </span>

        {project.featured && (
          <span
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              background: "rgba(255, 209, 102, 0.2)",
              border: "1px solid var(--color-accent-1)",
              color: "var(--color-accent-1)",
              padding: "4px 8px",
              borderRadius: "20px",
              fontSize: "0.72rem",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <FiStar /> {t.projects.featured}
          </span>
        )}
      </div>

      {/* Project Card Body */}
      <div
        style={{
          padding: "1.5rem",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <div>
          <h3
            style={{
              margin: "0 0 0.5rem 0",
              fontSize: "1.15rem",
              fontWeight: "700",
              color: "var(--color-text-main)",
              lineHeight: "1.4",
            }}
          >
            <EditableText
              value={project.title}
              onSave={(val) => {
                const updated = data.projects.map((p) =>
                  p.id === project.id ? { ...p, title: val } : p
                );
                updateProjects(updated);
              }}
            />
          </h3>

          <p
            style={{
              color: "var(--color-text-dim)",
              fontSize: "0.88rem",
              lineHeight: "1.6",
              margin: "0 0 1rem 0",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            <EditableText
              value={project.desc}
              onSave={(val) => {
                const updated = data.projects.map((p) =>
                  p.id === project.id ? { ...p, desc: val } : p
                );
                updateProjects(updated);
              }}
              multiline
            />
          </p>

          {/* Tech Badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {project.tech.map((t, idx) => (
              <span
                key={idx}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "var(--color-primary)",
                  padding: "3px 8px",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Links / Action Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "1rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div style={{ display: "flex", gap: "10px" }}>
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
                style={{ padding: "6px 14px", fontSize: "0.82rem", borderRadius: "8px" }}
              >
                <span>{t.projects.demo}</span>
                <FiExternalLink size={14} />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{ padding: "6px 14px", fontSize: "0.82rem", borderRadius: "8px" }}
              >
                <FiGithub size={14} />
                <span>{t.projects.code}</span>
              </a>
            )}
          </div>

          <button
            onClick={() => setSelectedProject(project)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--color-text-dim)",
              cursor: "pointer",
              fontSize: "1.1rem",
            }}
            title="View details"
          >
            <FiEye />
          </button>

          {isEditMode && (
            <button
              onClick={() => removeProject(project.id)}
              style={{
                background: "transparent",
                border: "none",
                color: "#ff4757",
                cursor: "pointer",
                fontSize: "1.1rem",
              }}
              title="Delete Project"
            >
              <FiTrash2 />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <section id="projects" className="content-section">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ textAlign: "center", marginBottom: "3rem" }}
      >
        <div className="section-badge">
          <FiFolder />
          <span>{t.projects.badge}</span>
        </div>
        <h2 className="section-title">
          {t.projects.titlePre} <span className="gradient-text">{t.projects.titleHighlight}</span>
        </h2>
        <p style={{ maxWidth: "600px", margin: "0 auto", color: "var(--color-text-dim)" }}>
          {t.projects.subtitle}
        </p>
      </motion.div>

      {/* Category Tabs (only on "View All" page) */}
      {showAll && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "2.5rem",
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background:
                  activeCategory === cat
                    ? "linear-gradient(135deg, var(--color-primary), var(--color-secondary))"
                    : "var(--color-glass-subtle)",
                color: activeCategory === cat ? "#fff" : "var(--color-text-dim)",
                border: activeCategory === cat ? "none" : "1px solid var(--color-card-border)",
                borderRadius: "30px",
                padding: "8px 20px",
                fontSize: "0.88rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {cat}
            </button>
          ))}

          {isEditMode && (
            <button
              onClick={() => openCms("projects")}
              style={{
                background: "rgba(0, 255, 135, 0.15)",
                color: "var(--color-accent-2)",
                border: "1px dashed var(--color-accent-2)",
                borderRadius: "30px",
                padding: "8px 18px",
                fontSize: "0.85rem",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <FiPlus /> {t.projects.manage}
            </button>
          )}
        </div>
      )}

      {/* ===== CAROUSEL VIEW (Main Page) ===== */}
      {!showAll && (
        <div
          className="projects-carousel-wrapper"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          ref={carouselRef}
        >
          {/* Carousel Navigation Arrows */}
          {totalSlides > visibleCount && (
            <>
              <button
                className="carousel-arrow carousel-arrow-left"
                onClick={prevSlide}
                aria-label="Previous"
              >
                <FiChevronLeft size={22} />
              </button>
              <button
                className="carousel-arrow carousel-arrow-right"
                onClick={nextSlide}
                aria-label="Next"
              >
                <FiChevronRight size={22} />
              </button>
            </>
          )}

          {/* Carousel Track */}
          <div className="projects-carousel-track-container">
            <motion.div
              className="projects-carousel-track"
              animate={{
                x: `-${currentSlide * (100 / visibleCount)}%`,
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: "flex",
                gap: "1.5rem",
              }}
            >
              {filteredProjects.map((project, index) => (
                <div
                  key={project.id}
                  className="carousel-slide"
                  style={{
                    flex: `0 0 calc(${100 / visibleCount}% - ${((visibleCount - 1) * 1.5) / visibleCount}rem)`,
                    minWidth: 0,
                  }}
                >
                  {renderProjectCard(project, index)}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Carousel Dots Indicator */}
          {totalSlides > visibleCount && (
            <div className="carousel-dots">
              {Array.from({ length: maxSlideIndex + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`carousel-dot ${currentSlide === idx ? "carousel-dot-active" : ""}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* Auto-play progress bar */}
          {!isPaused && totalSlides > visibleCount && (
            <div className="carousel-progress-bar">
              <motion.div
                className="carousel-progress-fill"
                key={currentSlide}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: AUTO_PLAY_INTERVAL / 1000, ease: "linear" }}
              />
            </div>
          )}

          {/* "View All" Button */}
          {allProjects.length > CAROUSEL_LIMIT && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              style={{ textAlign: "center", marginTop: "2.5rem" }}
            >
              <a
                href="/projects"
                className="btn-primary"
                style={{
                  padding: "14px 36px",
                  fontSize: "1rem",
                  borderRadius: "30px",
                  gap: "10px",
                }}
              >
                <span>{t.projects.viewAll || "ดูผลงานทั้งหมด"}</span>
                <FiArrowRight size={18} />
              </a>
            </motion.div>
          )}

          {/* Manage button for edit mode */}
          {isEditMode && (
            <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
              <button
                onClick={() => openCms("projects")}
                style={{
                  background: "rgba(0, 255, 135, 0.15)",
                  color: "var(--color-accent-2)",
                  border: "1px dashed var(--color-accent-2)",
                  borderRadius: "30px",
                  padding: "10px 22px",
                  fontSize: "0.88rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <FiPlus /> {t.projects.manage}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ===== GRID VIEW (All Projects Page) ===== */}
      {showAll && (
        <motion.div
          layout
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2rem",
          }}
        >
          <AnimatePresence>
            {filteredProjects.map((project, index) => renderProjectCard(project, index))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Project Detail Popup Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(3, 6, 15, 0.88)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              zIndex: 99998,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedProject(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                width: "100%",
                maxWidth: "700px",
                maxHeight: "90vh",
                overflowY: "auto",
                background: "var(--color-bg-surface)",
                border: "1px solid var(--color-card-border)",
                borderRadius: "16px",
                boxShadow: "var(--color-card-shadow-hover)",
                position: "relative",
                color: "var(--color-text-main)",
              }}
            >
              <div style={{ width: "100%", maxHeight: "360px", background: "rgba(0, 0, 0, 0.4)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  style={{ width: "100%", height: "auto", maxHeight: "360px", objectFit: "contain" }}
                />
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                style={{
                  position: "absolute",
                  top: "14px",
                  right: "14px",
                  background: "var(--color-glass-subtle)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid var(--color-card-border)",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  color: "var(--color-text-main)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <FiX size={18} />
              </button>

              <div style={{ padding: "2rem" }}>
                <span
                  style={{
                    color: "var(--color-primary)",
                    fontSize: "0.85rem",
                    fontFamily: "var(--font-mono)",
                    fontWeight: "600",
                  }}
                >
                  CATEGORY // {selectedProject.category}
                </span>
                <h2 style={{ margin: "0.5rem 0 1rem 0", fontSize: "1.8rem", color: "var(--color-text-main)" }}>
                  {selectedProject.title}
                </h2>
                <p style={{ color: "var(--color-text-dim)", lineHeight: "1.7", marginBottom: "1.5rem" }}>
                  {selectedProject.desc}
                </p>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "2rem" }}>
                  {selectedProject.tech.map((t, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: "var(--color-badge-bg)",
                        color: "var(--color-primary)",
                        border: "1px solid var(--color-badge-border)",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "0.85rem",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  {selectedProject.demoUrl && (
                    <a
                      href={selectedProject.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary"
                    >
                      <span>{t.projects.launchApp}</span>
                      <FiExternalLink />
                    </a>
                  )}
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-secondary"
                    >
                      <FiGithub />
                      <span>{t.projects.sourceRepo}</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Carousel CSS */}
      <style>{`
        .projects-carousel-wrapper {
          position: relative;
          padding: 0 0;
        }

        .projects-carousel-track-container {
          overflow: hidden;
          border-radius: 16px;
        }

        .projects-carousel-track {
          display: flex;
        }

        .carousel-slide {
          flex-shrink: 0;
        }

        .carousel-slide .glass-card {
          height: 100%;
        }

        /* Arrows */
        .carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--color-card-bg);
          backdrop-filter: blur(12px);
          border: 1px solid var(--color-card-border);
          color: var(--color-text-main);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--color-card-shadow);
          transition: all 0.2s ease;
        }

        .carousel-arrow:hover {
          border-color: var(--color-primary);
          box-shadow: 0 0 20px var(--color-primary-glow);
          color: var(--color-primary);
          transform: translateY(-50%) scale(1.1);
        }

        .carousel-arrow-left {
          left: -22px;
        }

        .carousel-arrow-right {
          right: -22px;
        }

        /* Dots */
        .carousel-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 1.5rem;
        }

        .carousel-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid var(--color-card-border);
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }

        .carousel-dot:hover {
          border-color: var(--color-primary);
        }

        .carousel-dot-active {
          background: var(--color-primary);
          border-color: var(--color-primary);
          transform: scale(1.2);
          box-shadow: 0 0 8px var(--color-primary-glow);
        }

        /* Progress bar */
        .carousel-progress-bar {
          margin-top: 1rem;
          height: 3px;
          background: var(--color-glass-subtle);
          border-radius: 3px;
          overflow: hidden;
          max-width: 300px;
          margin-left: auto;
          margin-right: auto;
        }

        .carousel-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
          border-radius: 3px;
        }

        @media (max-width: 960px) {
          .carousel-arrow-left {
            left: 8px;
          }
          .carousel-arrow-right {
            right: 8px;
          }
          .carousel-arrow {
            width: 38px;
            height: 38px;
          }
        }

        @media (max-width: 640px) {
          .carousel-arrow {
            width: 34px;
            height: 34px;
          }
          .carousel-arrow-left {
            left: 4px;
          }
          .carousel-arrow-right {
            right: 4px;
          }
        }
      `}</style>
    </section>
  );
};

export default Projects;
