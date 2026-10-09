import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";
import EditableText from "./EditableText";
import {
  FiCode,
  FiPlus,
  FiTrash2,
  FiZap,
} from "react-icons/fi";
import {
  FaReact,
  FaNodeJs,
  FaPython,
  FaDatabase,
  FaShieldAlt,
  FaDocker,
} from "react-icons/fa";
import {
  SiTypescript,
  SiTailwindcss,
  SiThreedotjs,
  SiFramer,
  SiVite,
  SiNextdotjs,
  SiRust,
} from "react-icons/si";

// Map string icon names to actual React icons
const ICON_MAP = {
  FaReact: <FaReact />,
  FaNodeJs: <FaNodeJs />,
  FaPython: <FaPython />,
  FaDatabase: <FaDatabase />,
  FaShieldAlt: <FaShieldAlt />,
  FaDocker: <FaDocker />,
  SiTypescript: <SiTypescript />,
  SiTailwindcss: <SiTailwindcss />,
  SiThreeDotJs: <SiThreedotjs />,
  SiThreedotjs: <SiThreedotjs />,
  SiFramer: <SiFramer />,
  SiVite: <SiVite />,
  SiNextdotjs: <SiNextdotjs />,
  SiRust: <SiRust />,
};

const Skills = () => {
  const { data, updateSkills, removeSkill, isEditMode, openCms, t, language } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = t.skills?.categories || ["All", "Frontend", "Backend", "Security", "3D & Creative", "DevOps"];

  const filteredSkills = (data?.skills || []).filter((skill) => {
    if (selectedCategory === "All" || selectedCategory === "ทั้งหมด") return true;
    const catLower = (skill.category || "").toLowerCase();
    const selLower = selectedCategory.toLowerCase();
    if (selLower.includes("front")) return catLower.includes("front");
    if (selLower.includes("back")) return catLower.includes("back");
    if (selLower.includes("sec") || selLower.includes("ความปลอดภัย")) return catLower.includes("sec");
    if (selLower.includes("3d") || selLower.includes("ศิลป์") || selLower.includes("creative")) return catLower.includes("3d") || catLower.includes("creative");
    if (selLower.includes("devops")) return catLower.includes("devops");
    return catLower.includes(selLower);
  });

  return (
    <section id="skills" className="content-section">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: "center", marginBottom: "3rem" }}
      >
        <span className="eyebrow-label">// 03 — TECHNICAL CAPABILITIES & TOOLING</span>
        <h2 className="section-title">
          {t.skills?.titlePre || "คลังทักษะและ"}{" "}
          <span className="gradient-text">{t.skills?.titleHighlight || "ความเชี่ยวชาญ"}</span>
        </h2>
        <p className="section-subtitle">
          {t.skills?.subtitle ||
            "ความเชี่ยวชาญด้าน Modern Web Architecture, Full-Stack Engineering, และ Cybersecurity"}
        </p>
      </motion.div>

      {/* Learning & Skill Mastery Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          maxWidth: "780px",
          margin: "0 auto 2.5rem auto",
          background: "var(--color-card-bg)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "20px",
          padding: "1rem 1.6rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.2rem",
          flexWrap: "wrap",
          boxShadow: "var(--color-card-shadow)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <img
            src="/img/16.webp"
            alt="ครูสาย IT"
            style={{
              width: "48px",
              height: "48px",
              objectFit: "contain",
              filter: "drop-shadow(0 2px 8px var(--accent-glow))",
            }}
          />
          <div>
            <div style={{ fontWeight: "700", color: "var(--text-primary)", fontSize: "0.98rem", fontFamily: "var(--font-display)" }}>
              ครูสาย IT เทคโนโลยีเพื่อการเรียนรู้
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              มุ่งมั่นพัฒนาทักษะวิทยาการคำนวณและ Cybersecurity อย่างต่อเนื่อง
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src="/img/cheers.webp"
            alt="สู้ๆ นะครับ"
            style={{
              width: "42px",
              height: "42px",
              objectFit: "contain",
            }}
          />
          <div
            style={{
              fontSize: "0.82rem",
              color: "var(--accent)",
              fontWeight: "600",
              fontFamily: "var(--font-mono)",
            }}
          >
            "สู้ๆ นะครับ :)"
          </div>
        </div>
      </motion.div>

      {/* Category Filter Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "6px",
          flexWrap: "wrap",
          marginBottom: "2.75rem",
        }}
      >
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
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
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
                    layoutId="skillActiveFilter"
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
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {isEditMode && (
          <button
            onClick={() => openCms("skills")}
            className="btn-luxury-secondary"
            style={{
              padding: "7px 16px",
              fontSize: "0.82rem",
              borderRadius: "100px",
              marginLeft: "8px",
            }}
          >
            <FiPlus />
            <span>{t.skills?.manage || "จัดการทักษะ"}</span>
          </button>
        )}
      </div>

      {/* Skills Grid */}
      <motion.div
        layout
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "1.25rem",
        }}
      >
        <AnimatePresence mode="popLayout">
          {filteredSkills.map((skill, index) => {
            const iconElement = ICON_MAP[skill.icon] || <FiZap />;

            return (
              <motion.div
                key={skill.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                whileHover={{ y: -4 }}
                style={{
                  padding: "1.35rem 1.4rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  position: "relative",
                  borderRadius: "18px",
                  background: "var(--color-card-bg)",
                  border: "1px solid var(--border-subtle)",
                  boxShadow: "var(--color-card-shadow)",
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                {/* Header: Icon, Title, Level */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "12px",
                        background: "var(--accent-muted)",
                        border: "1px solid var(--border-subtle)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.35rem",
                        color: "var(--accent)",
                      }}
                    >
                      {iconElement}
                    </div>
                    <div>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "1rem",
                          fontWeight: "700",
                          color: "var(--text-primary)",
                          fontFamily: "var(--font-display)",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        <EditableText
                          value={skill.name}
                          onSave={(val) => {
                            const updated = data.skills.map((s) =>
                              s.id === skill.id ? { ...s, name: val } : s
                            );
                            updateSkills(updated);
                          }}
                        />
                      </h3>
                      <span
                        style={{
                          fontSize: "0.74rem",
                          color: "var(--text-tertiary)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {skill.category}
                      </span>
                    </div>
                  </div>

                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontWeight: "700",
                      fontSize: "0.88rem",
                      color: "var(--accent)",
                      background: "var(--accent-muted)",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    {skill.level}%
                  </span>
                </div>

                {/* Hairline Luxury Progress Bar */}
                <div
                  style={{
                    width: "100%",
                    height: "4px",
                    background: "var(--bg-elevated)",
                    borderRadius: "100px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      height: "100%",
                      borderRadius: "100px",
                      background: "linear-gradient(90deg, var(--accent), #38BDF8)",
                      boxShadow: "0 0 10px var(--accent-glow)",
                    }}
                  />
                </div>

                {/* Edit Controls when in Edit Mode */}
                {isEditMode && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "4px",
                      paddingTop: "8px",
                      borderTop: "1px dashed var(--border-subtle)",
                    }}
                  >
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={skill.level}
                      onChange={(e) => {
                        const updated = data.skills.map((s) =>
                          s.id === skill.id ? { ...s, level: Number(e.target.value) } : s
                        );
                        updateSkills(updated);
                      }}
                      style={{ flex: 1, marginRight: "10px", accentColor: "var(--accent)" }}
                    />
                    <button
                      onClick={() => removeSkill(skill.id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#ef4444",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        padding: "4px",
                      }}
                      title={language === "th" ? "ลบทักษะนี้" : "Delete Skill"}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default Skills;
