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

  const categories = t.skills.categories || ["All", "Frontend", "Backend", "Security", "3D & Creative", "DevOps"];

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
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ textAlign: "center", marginBottom: "3rem" }}
      >
        <div className="section-badge">
          <FiCode />
          <span>{t.skills.badge}</span>
        </div>
        <h2 className="section-title">
          {t.skills.titlePre} <span className="gradient-text">{t.skills.titleHighlight}</span>
        </h2>
        <p style={{ maxWidth: "600px", margin: "0 auto", color: "var(--color-text-dim)" }}>
          {t.skills.subtitle}
        </p>
      </motion.div>

      {/* Learning & Skill Mastery Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{
          maxWidth: "760px",
          margin: "0 auto 2.5rem auto",
          background: "var(--color-glass-subtle)",
          border: "1px solid var(--color-card-border)",
          borderRadius: "16px",
          padding: "0.9rem 1.4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.2rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src="/img/16.png"
            alt="ครูสาย IT"
            style={{
              width: "48px",
              height: "48px",
              objectFit: "contain",
              filter: "drop-shadow(0 2px 8px rgba(0, 242, 254, 0.3))",
            }}
          />
          <div>
            <div style={{ fontWeight: "700", color: "var(--color-text-main)", fontSize: "0.95rem" }}>
              ครูสาย IT เทคโนโลยีเพื่อการเรียนรู้
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--color-text-dim)" }}>
              มุ่งมั่นพัฒนาทักษะวิทยาการคำนวณและ Cybersecurity อย่างต่อเนื่อง
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img
            src="/img/cheers.png"
            alt="สู้ๆ นะครับ"
            style={{
              width: "42px",
              height: "42px",
              objectFit: "contain",
            }}
          />
          <div style={{ fontSize: "0.82rem", color: "var(--color-accent-2)", fontWeight: "600" }}>
            "สู้ๆ นะครับ :)"
          </div>
        </div>
      </motion.div>

      {/* Category Filter Tabs */}
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
            onClick={() => setSelectedCategory(cat)}
            style={{
              background:
                selectedCategory === cat
                  ? "linear-gradient(135deg, var(--color-primary), var(--color-secondary))"
                  : "var(--color-glass-subtle)",
              color: selectedCategory === cat ? "#fff" : "var(--color-text-dim)",
              border: selectedCategory === cat ? "none" : "1px solid var(--color-card-border)",
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
            onClick={() => openCms("skills")}
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
            <FiPlus /> {t.skills.manage}
          </button>
        )}
      </div>

      {/* Skills Grid with Scroll Cascade */}
      <motion.div
        layout
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.2rem",
        }}
      >
        <AnimatePresence>
          {filteredSkills.map((skill, index) => {
            const iconElement = ICON_MAP[skill.icon] || <FiZap />;

            return (
              <motion.div
                key={skill.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="glass-card"
                style={{
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  position: "relative",
                }}
              >
                {/* Header: Icon, Title, Category Badge */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "10px",
                        background: "var(--color-badge-bg)",
                        border: "1px solid var(--color-badge-border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.4rem",
                        color: "var(--color-primary)",
                      }}
                    >
                      {iconElement}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: "700" }}>
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
                      <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
                        {skill.category}
                      </span>
                    </div>
                  </div>

                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontWeight: "700",
                      fontSize: "0.95rem",
                      color: "var(--color-accent-2)",
                    }}
                  >
                    {skill.level}%
                  </span>
                </div>

                {/* Progress Bar with Gradient Glow */}
                <div
                  style={{
                    width: "100%",
                    height: "6px",
                    background: "var(--color-input-border)",
                    borderRadius: "10px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{
                      height: "100%",
                      borderRadius: "10px",
                      background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))",
                      boxShadow: "0 0 10px rgba(0, 242, 254, 0.5)",
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
                      marginTop: "6px",
                      paddingTop: "6px",
                      borderTop: "1px dashed rgba(255, 255, 255, 0.1)",
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
                      style={{ flex: 1, marginRight: "10px" }}
                    />
                    <button
                      onClick={() => removeSkill(skill.id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#ff4757",
                        cursor: "pointer",
                        fontSize: "0.9rem",
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
