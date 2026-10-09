import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";
import EditableText from "./EditableText";
import {
  FiTerminal,
  FiShield,
  FiServer,
  FiCpu,
  FiAward,
  FiCheckCircle,
  FiMapPin,
  FiBookOpen,
  FiCalendar,
} from "react-icons/fi";

const TerminalSpecs = ({ specs, isEditMode, updateAbout }) => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-60px" });
  const [typedLines, setTypedLines] = useState(0);

  // Typing effect when scrolled into view
  useEffect(() => {
    if (!isInView || isEditMode) {
      if (isEditMode) setTypedLines(specs.length);
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setTypedLines(specs.length);
      return;
    }

    let line = 0;
    const interval = setInterval(() => {
      line++;
      setTypedLines(line);
      if (line >= specs.length) {
        clearInterval(interval);
      }
    }, 180);

    return () => clearInterval(interval);
  }, [isInView, specs.length, isEditMode]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        background: "rgba(10, 10, 12, 0.9)",
        borderRadius: "14px",
        border: "1px solid var(--border-subtle)",
        overflow: "hidden",
        boxShadow: "0 12px 35px rgba(0, 0, 0, 0.35)",
        fontFamily: "var(--font-mono)",
      }}
      className="terminal-hud-card"
    >
      {/* Terminal Header Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          background: "rgba(255, 255, 255, 0.03)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#EF4444", opacity: 0.7 }} />
          <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#F59E0B", opacity: 0.7 }} />
          <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#10B981", opacity: 0.7 }} />
        </div>
        <span
          style={{
            fontSize: "0.74rem",
            color: "var(--text-tertiary)",
            letterSpacing: "0.06em",
          }}
        >
          krupetch@sys-core:~# specs.env
        </span>
        <div style={{ width: "24px" }} />
      </div>

      {/* Terminal Content Body */}
      <div
        style={{
          padding: "1.1rem 1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          fontSize: "0.84rem",
          lineHeight: "1.6",
        }}
      >
        <div style={{ color: "var(--text-tertiary)", fontSize: "0.76rem" }}>
          // SYSTEM HARDWARE & EXPERTISE SPECIFICATIONS
        </div>

        {specs.map((spec, idx) => {
          const isVisible = isEditMode || idx < typedLines;
          if (!isVisible) return null;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
                paddingBottom: idx !== specs.length - 1 ? "6px" : 0,
                borderBottom: idx !== specs.length - 1 ? "1px dashed rgba(255, 255, 255, 0.05)" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ color: "var(--accent)", opacity: 0.8 }}>&gt;</span>
                <span style={{ color: "var(--text-secondary)" }}>
                  <EditableText
                    value={spec.label}
                    onSave={(val) => {
                      const updated = [...specs];
                      updated[idx] = { ...updated[idx], label: val };
                      updateAbout({ systemSpecs: updated });
                    }}
                  />
                  :
                </span>
              </div>
              <span
                style={{
                  color: "var(--text-primary)",
                  fontWeight: "600",
                  textAlign: "right",
                }}
              >
                <EditableText
                  value={spec.value}
                  onSave={(val) => {
                    const updated = [...specs];
                    updated[idx] = { ...updated[idx], value: val };
                    updateAbout({ systemSpecs: updated });
                  }}
                />
              </span>
            </motion.div>
          );
        })}

        {/* Terminal Cursor */}
        {!isEditMode && typedLines < specs.length && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--accent)" }}>
            <span>&gt;</span>
            <span className="blinking-cursor">_</span>
          </div>
        )}
      </div>
    </div>
  );
};

const About = () => {
  const { data, updateAbout, t, isEditMode } = usePortfolio();

  const education = data?.about?.education || [];
  const systemSpecs = data?.about?.systemSpecs || [];

  return (
    <section id="about" className="content-section">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: "center", marginBottom: "4rem" }}
      >
        <span className="eyebrow-label">// 01 — IDENTITY & SYSTEM ARCHITECTURE</span>
        <h2 className="section-title">
          {t.about.titlePre} <span className="gradient-text">{t.about.titleHighlight}</span>
        </h2>
        <div
          style={{
            maxWidth: "680px",
            margin: "0 auto",
            color: "var(--text-secondary)",
            fontSize: "1.05rem",
            lineHeight: "1.75",
          }}
        >
          <EditableText
            value={data.about.heading}
            onSave={(val) => updateAbout({ heading: val })}
            multiline
          />
        </div>
      </motion.div>

      {/* Main Grid: Left (Terminal Specs + Avatar) | Right (Narrative + Pillars) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.05fr 1.25fr",
          gap: "2.5rem",
          alignItems: "stretch",
          marginBottom: "3.5rem",
        }}
        className="about-grid"
      >
        {/* Left: Luxury Profile + Terminal Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card"
          style={{
            padding: "2.25rem 2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "1.5rem",
          }}
        >
          {/* Avatar with Crisp Hairline Glass Ring */}
          <div
            style={{
              position: "relative",
              width: "180px",
              height: "180px",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "-3px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--accent), var(--border-glass))",
                opacity: 0.45,
              }}
            />
            <img
              src={data.about.avatarUrl || "/profile.jpg"}
              alt={data.hero.name || "ครูเพชร IT"}
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid var(--border-glass)",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
              }}
            />
          </div>

          <div>
            <h3
              style={{
                fontSize: "1.4rem",
                fontWeight: "700",
                color: "var(--text-primary)",
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.02em",
                margin: "0 0 4px 0",
              }}
            >
              {data.hero.name || "ครูเพชร IT"}
            </h3>
            <p
              style={{
                color: "var(--accent)",
                fontSize: "0.88rem",
                fontFamily: "var(--font-mono)",
                margin: 0,
                fontWeight: "500",
              }}
            >
              {data.hero.title}
            </p>
          </div>

          {/* Luxury Terminal Specs with Streaming Effect */}
          <TerminalSpecs
            specs={systemSpecs}
            isEditMode={isEditMode}
            updateAbout={updateAbout}
          />

          {/* Pedagogy Motto Bar */}
          <div
            style={{
              width: "100%",
              background: "var(--accent-muted)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "12px",
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              textAlign: "left",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                background: "var(--glass-bg)",
                border: "1px solid var(--border-glass)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent)",
                flexShrink: 0,
              }}
            >
              <FiAward size={18} />
            </div>
            <div>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "var(--accent)",
                  fontFamily: "var(--font-mono)",
                  fontWeight: "700",
                  letterSpacing: "0.06em",
                }}
              >
                PEDAGOGY MOTTO //
              </div>
              <div
                style={{
                  fontSize: "0.88rem",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                }}
              >
                "การเรียนรู้ไม่มีที่สิ้นสุด :)"
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Narrative Bio & 4 Pillars of Expertise */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card"
          style={{
            padding: "2.5rem 2.25rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "2rem",
          }}
        >
          <div>
            {/* Header Tag */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.78rem",
                color: "var(--text-tertiary)",
                letterSpacing: "0.06em",
                marginBottom: "1.5rem",
                textTransform: "uppercase",
              }}
            >
              <FiTerminal size={14} style={{ color: "var(--accent)" }} />
              <span>{t.about.terminal || "CORE_NARRATIVE // PHILOSOPHY"}</span>
            </div>

            {/* Paragraphs */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {(data?.about?.paragraphs || []).map((p, idx) => (
                <p
                  key={idx}
                  style={{
                    color: "var(--text-primary)",
                    fontSize: "1rem",
                    lineHeight: "1.8",
                    margin: 0,
                  }}
                >
                  <EditableText
                    value={p}
                    onSave={(val) => {
                      const updated = [...(data?.about?.paragraphs || [])];
                      updated[idx] = val;
                      updateAbout({ paragraphs: updated });
                    }}
                    multiline
                  />
                </p>
              ))}
            </div>

            {/* 4 Pillars of Competencies (Minimalist Hairline Tech Badges) */}
            <div
              style={{
                marginTop: "2rem",
                padding: "1.25rem",
                background: "var(--accent-muted)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "14px",
              }}
            >
              <div
                style={{
                  fontSize: "0.76rem",
                  fontFamily: "var(--font-mono)",
                  fontWeight: "600",
                  color: "var(--accent)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                }}
              >
                // 4 CORE PILLARS OF EXPERTISE
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                <div className="pillar-pill">
                  <FiShield size={14} />
                  <span>Cybersecurity & CTF</span>
                </div>
                <div className="pillar-pill">
                  <FiServer size={14} />
                  <span>IT Infrastructure</span>
                </div>
                <div className="pillar-pill">
                  <FiCpu size={14} />
                  <span>Computing Science</span>
                </div>
                <div className="pillar-pill">
                  <FiAward size={14} />
                  <span>EdTech Innovation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Status & Location Footer */}
          <div
            style={{
              paddingTop: "1.25rem",
              borderTop: "1px solid var(--border-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
              fontSize: "0.85rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent)" }}>
              <FiCheckCircle />
              <span style={{ fontWeight: "600" }}>{t.about.verified || "Verified Educator & Researcher"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)" }}>
              <FiMapPin />
              <span>{data.contact.location || "Bangkok, Thailand"}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats Counter Bar with Staggered Motion */}
      <div
        className="about-stats-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1.25rem",
          marginBottom: "4.5rem",
        }}
      >
        {(data?.about?.stats || []).map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6 }}
            className="glass-card"
            style={{
              padding: "1.75rem 1.25rem",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span
              style={{
                fontSize: "2.4rem",
                fontWeight: "700",
                color: "var(--accent)",
                fontFamily: "var(--font-mono)",
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}
            >
              <EditableText
                value={stat.value}
                onSave={(val) => {
                  const updated = [...(data?.about?.stats || [])];
                  updated[idx] = { ...updated[idx], value: val };
                  updateAbout({ stats: updated });
                }}
              />
            </span>
            <span
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.86rem",
                fontWeight: "500",
              }}
            >
              <EditableText
                value={stat.label}
                onSave={(val) => {
                  const updated = [...(data?.about?.stats || [])];
                  updated[idx] = { ...updated[idx], label: val };
                  updateAbout({ stats: updated });
                }}
              />
            </span>
          </motion.div>
        ))}
      </div>

      {/* Education Timeline Section */}
      {education.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span className="eyebrow-label">// 01.2 — ACADEMIC MILESTONES</span>
            <h3 className="section-title" style={{ fontSize: "2.2rem" }}>
              {t.about.educationTitle || "ประวัติการศึกษา"}
            </h3>
          </div>

          <div className="edu-timeline">
            <div className="edu-timeline-line" />

            {education.map((edu, idx) => (
              <motion.div
                key={edu.id || idx}
                className={`edu-timeline-item ${idx % 2 === 0 ? "edu-timeline-left" : "edu-timeline-right"}`}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="edu-timeline-node">
                  <div className="edu-timeline-node-inner" />
                </div>

                <motion.div
                  className="glass-card edu-timeline-card"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="edu-timeline-card-content">
                    {edu.image && (
                      <div className="edu-timeline-img-wrap">
                        <img src={edu.image} alt={edu.institution} className="edu-timeline-img" />
                      </div>
                    )}

                    <div className="edu-timeline-text">
                      <span className="edu-timeline-period">
                        <FiCalendar size={12} style={{ display: "inline", marginRight: "4px" }} />
                        {edu.period}
                      </span>
                      <h4 className="edu-timeline-degree">{edu.degree}</h4>
                      <p className="edu-timeline-field">{edu.field}</p>
                      <p className="edu-timeline-institution">{edu.institution}</p>
                      {edu.description && <p className="edu-timeline-desc">{edu.description}</p>}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <style>{`
        .blinking-cursor {
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .pillar-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: var(--glass-bg);
          border: 1px solid var(--border-glass);
          border-radius: 8px;
          font-size: 0.82rem;
          color: var(--text-primary);
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .pillar-pill:hover {
          border-color: var(--accent-border);
          color: var(--accent);
          transform: translateY(-1px);
        }
        .pillar-pill svg {
          color: var(--accent);
          flex-shrink: 0;
        }

        @media (max-width: 960px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
        @media (max-width: 600px) {
          .about-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.8rem !important;
          }
          .pillar-pill {
            grid-column: span 2;
          }
        }

        /* ===== Education Timeline Styles ===== */
        .edu-timeline {
          position: relative;
          max-width: 880px;
          margin: 0 auto;
          padding: 2rem 0;
        }
        .edu-timeline-line {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--border-subtle);
          transform: translateX(-50%);
          border-radius: 2px;
        }
        .edu-timeline-item {
          position: relative;
          width: 50%;
          padding: 0 2rem 2.5rem;
        }
        .edu-timeline-left {
          left: 0;
          text-align: right;
          padding-right: 2.5rem;
        }
        .edu-timeline-right {
          left: 50%;
          text-align: left;
          padding-left: 2.5rem;
        }
        .edu-timeline-node {
          position: absolute;
          top: 8px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--bg-base);
          border: 2px solid var(--accent);
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .edu-timeline-node-inner {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
        }
        .edu-timeline-left .edu-timeline-node {
          right: -8px;
        }
        .edu-timeline-right .edu-timeline-node {
          left: -8px;
        }
        .edu-timeline-card {
          position: relative;
          overflow: hidden;
          border-radius: 14px !important;
        }
        .edu-timeline-card-content {
          padding: 1.25rem;
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }
        .edu-timeline-left .edu-timeline-card-content {
          flex-direction: row-reverse;
        }
        .edu-timeline-img-wrap {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          overflow: hidden;
          background: var(--glass-bg);
          border: 1px solid var(--border-glass);
          flex-shrink: 0;
        }
        .edu-timeline-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .edu-timeline-period {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: 0.74rem;
          color: var(--accent);
          font-weight: 600;
          margin-bottom: 4px;
        }
        .edu-timeline-degree {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 2px;
        }
        .edu-timeline-field {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 2px;
        }
        .edu-timeline-institution {
          font-size: 0.8rem;
          color: var(--text-tertiary);
          font-family: var(--font-mono);
          margin-bottom: 6px;
        }
        .edu-timeline-desc {
          font-size: 0.84rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        @media (max-width: 768px) {
          .edu-timeline-line {
            left: 20px !important;
          }
          .edu-timeline-item {
            width: 100% !important;
            left: 0 !important;
            padding-left: 50px !important;
            padding-right: 0 !important;
            text-align: left !important;
          }
          .edu-timeline-node {
            left: 12px !important;
          }
          .edu-timeline-left .edu-timeline-card-content {
            flex-direction: row !important;
          }
        }
      `}</style>
    </section>
  );
};

export default About;
