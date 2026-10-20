import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";
import EditableText from "./EditableText";
import {
  FiPlus,
  FiTrash2,
  FiZap,
  FiCpu,
  FiBookOpen,
  FiServer,
  FiHeart,
  FiAward,
  FiShield,
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
  FiCpu: <FiCpu />,
  FiBookOpen: <FiBookOpen />,
  FiServer: <FiServer />,
  FiHeart: <FiHeart />,
  FiAward: <FiAward />,
  FiShield: <FiShield />,
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

const getMasteryLabel = (level, language) => {
  if (level >= 92) {
    return language === "th" ? "เชี่ยวชาญพิเศษ" : "Core Mastery";
  }
  if (level >= 85) {
    return language === "th" ? "ชำนาญการ" : "Advanced";
  }
  return language === "th" ? "ปฏิบัติการ" : "Proficient";
};

const Skills = () => {
  const {
    data,
    updateSkills,
    removeSkill,
    isEditMode,
    openCms,
    t,
    language,
  } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = t.skills?.categories || [
    "All",
    "EdTech & Pedagogy",
    "Cybersecurity & CTF",
    "Creative Web & 3D",
    "Systems & Research",
  ];

  const filteredSkills = (data?.skills || []).filter((skill) => {
    if (selectedCategory === "All" || selectedCategory === "ทั้งหมด")
      return true;
    const catLower = (skill.category || "").toLowerCase();
    const selLower = selectedCategory.toLowerCase();

    if (
      selLower.includes("edtech") ||
      selLower.includes("การสอน") ||
      selLower.includes("pedagogy")
    ) {
      return (
        catLower.includes("edtech") ||
        catLower.includes("การสอน") ||
        catLower.includes("pedagogy") ||
        catLower.includes("front")
      );
    }
    if (selLower.includes("sec") || selLower.includes("ctf")) {
      return catLower.includes("sec") || catLower.includes("ctf");
    }
    if (selLower.includes("3d") || selLower.includes("creative")) {
      return (
        catLower.includes("3d") ||
        catLower.includes("creative") ||
        catLower.includes("ศิลป์")
      );
    }
    if (
      selLower.includes("ระบบ") ||
      selLower.includes("วิจัย") ||
      selLower.includes("system") ||
      selLower.includes("research")
    ) {
      return (
        catLower.includes("ระบบ") ||
        catLower.includes("วิจัย") ||
        catLower.includes("system") ||
        catLower.includes("research") ||
        catLower.includes("back") ||
        catLower.includes("devops")
      );
    }
    return catLower.includes(selLower);
  });

  return (
    <section id="skills" className="content-section">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: "center", marginBottom: "2.75rem" }}
      >
        <h2 className="section-title">
          {t.skills?.titlePre || "คลังทักษะและ"}{" "}
          <span style={{ color: "var(--accent)" }}>
            {t.skills?.titleHighlight || "ความเชี่ยวชาญ"}
          </span>
        </h2>
        <p className="section-subtitle">
          {t.skills?.subtitle ||
            "ความเชี่ยวชาญด้านเทคโนโลยีการศึกษา วิทยาการคำนวณ การพัฒนาเว็บเชิงสร้างสรรค์ และความมั่นคงปลอดภัยไซเบอร์"}
        </p>
      </motion.div>

      {/* Educator Identity Strip */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        style={{
          maxWidth: "820px",
          margin: "0 auto 2.5rem auto",
          background: "var(--color-card-bg)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "18px",
          padding: "1rem 1.5rem",
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
            loading="lazy"
            style={{
              width: "46px",
              height: "46px",
              objectFit: "contain",
            }}
          />
          <div>
            <div
              style={{
                fontWeight: "700",
                color: "var(--text-primary)",
                fontSize: "0.96rem",
                fontFamily: "var(--font-display)",
              }}
            >
              บูรณาการศาสตร์การสอนเข้ากับเทคโนโลยีสมัยใหม่
            </div>
            <div
              style={{
                fontSize: "0.84rem",
                color: "var(--text-secondary)",
                lineHeight: 1.5,
              }}
            >
              ออกแบบบทเรียนและแล็บปฏิบัติการที่เปลี่ยนทฤษฎีซับซ้อนให้เข้าใจง่ายและลงมือทำได้จริง
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src="/img/cheers.webp"
            alt="สู้ๆ นะครับ"
            loading="lazy"
            style={{
              width: "40px",
              height: "40px",
              objectFit: "contain",
            }}
          />
          <span
            style={{
              fontSize: "0.84rem",
              color: "var(--accent)",
              fontWeight: "600",
            }}
          >
            “สู้ๆ นะครับ :)”
          </span>
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
          marginBottom: "2.5rem",
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
            const isActive =
              selectedCategory === cat ||
              (selectedCategory === "All" && cat === "ทั้งหมด");
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  position: "relative",
                  background: "transparent",
                  border: "none",
                  color: isActive
                    ? "var(--nav-link-active)"
                    : "var(--nav-link-color)",
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

      {/* Capability Matrix Grid */}
      <motion.div
        layout
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(275px, 1fr))",
          gap: "1.25rem",
        }}
      >
        <AnimatePresence mode="popLayout">
          {filteredSkills.map((skill, index) => {
            const iconElement = ICON_MAP[skill.icon] || <FiZap />;
            const masteryText = getMasteryLabel(skill.level, language);

            return (
              <motion.div
                key={skill.id}
                layout
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, delay: index * 0.03 }}
                whileHover={{ y: -3 }}
                style={{
                  padding: "1.35rem 1.45rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "14px",
                  position: "relative",
                  borderRadius: "16px",
                  background: "var(--color-card-bg)",
                  border: "1px solid var(--border-subtle)",
                  boxShadow: "var(--color-card-shadow)",
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                {/* Top Row: Icon + Skill Name & Category */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                    }}
                  >
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
                        fontSize: "1.25rem",
                        color: "var(--accent)",
                        flexShrink: 0,
                      }}
                    >
                      {iconElement}
                    </div>
                    <div>
                      <h3
                        style={{
                          margin: "0 0 3px 0",
                          fontSize: "0.98rem",
                          fontWeight: "700",
                          color: "var(--text-primary)",
                          fontFamily: "var(--font-display)",
                          letterSpacing: "-0.01em",
                          lineHeight: 1.35,
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
                          fontSize: "0.76rem",
                          color: "var(--text-tertiary)",
                          fontWeight: "500",
                        }}
                      >
                        {skill.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Mastery Tier + Precision Meter */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    paddingTop: "10px",
                    borderTop: "1px solid var(--border-subtle)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: "0.78rem",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--text-secondary)",
                        fontWeight: "600",
                      }}
                    >
                      {masteryText}
                    </span>
                    <span
                      className="tabular-nums"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontWeight: "700",
                        color: "var(--accent)",
                      }}
                    >
                      {skill.level}%
                    </span>
                  </div>

                  {/* Subtle Precision Hairline Meter */}
                  <div
                    style={{
                      width: "100%",
                      height: "3px",
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
                      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        height: "100%",
                        borderRadius: "100px",
                        background: "var(--accent)",
                      }}
                    />
                  </div>
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
                          s.id === skill.id
                            ? { ...s, level: Number(e.target.value) }
                            : s
                        );
                        updateSkills(updated);
                      }}
                      style={{
                        flex: 1,
                        marginRight: "10px",
                        accentColor: "var(--accent)",
                      }}
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
                      title={
                        language === "th" ? "ลบทักษะนี้" : "Delete Skill"
                      }
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
