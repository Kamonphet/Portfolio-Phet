import React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";
import EditableText from "./EditableText";
import { FiBriefcase, FiCalendar, FiPlus, FiTrash2 } from "react-icons/fi";

const Experience = () => {
  const { data, updateExperience, removeExperience, isEditMode, openCms, t } = usePortfolio();

  return (
    <section id="experience" className="content-section">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: "center", marginBottom: "3.5rem" }}
      >
        <span className="eyebrow-label">// 04 — JOURNEY & MILESTONES</span>
        <h2 className="section-title">
          {t.experience?.titlePre || "เส้นทางและ"}{" "}
          <span className="gradient-text">{t.experience?.titleHighlight || "ประสบการณ์การทำงาน"}</span>
        </h2>
        <p className="section-subtitle">
          {t.experience?.subtitle ||
            "ประวัติการทำงาน การสอน และบทบาทสำคัญในการขับเคลื่อนเทคโนโลยีการศึกษา"}
        </p>

        {isEditMode && (
          <div style={{ marginTop: "1.5rem" }}>
            <button
              onClick={() => openCms("experience")}
              className="btn-luxury-secondary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 20px",
                fontSize: "0.86rem",
                borderRadius: "100px",
              }}
            >
              <FiPlus />
              <span>{t.experience?.manage || "จัดการประสบการณ์"}</span>
            </button>
          </div>
        )}
      </motion.div>

      {/* Timeline Container */}
      <div
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          position: "relative",
          paddingLeft: "34px",
        }}
      >
        {/* Hairline Luxury Vertical Line */}
        <div
          style={{
            position: "absolute",
            top: "14px",
            bottom: "20px",
            left: "8px",
            width: "1px",
            background: "linear-gradient(180deg, var(--accent) 0%, var(--border-subtle) 100%)",
            opacity: 0.8,
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {(data?.experience || []).map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: "relative" }}
            >
              {/* Timeline Node Dot */}
              <div
                style={{
                  position: "absolute",
                  left: "-34px",
                  top: "24px",
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  background: "var(--bg-surface)",
                  border: "2px solid var(--accent)",
                  boxShadow: "0 0 12px var(--accent-glow)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "var(--accent)",
                  }}
                />
              </div>

              {/* Experience Card */}
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                style={{
                  padding: "1.75rem 2rem",
                  position: "relative",
                  borderRadius: "20px",
                  background: "var(--color-card-bg)",
                  border: "1px solid var(--border-subtle)",
                  boxShadow: "var(--color-card-shadow)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "10px",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: "0 0 6px 0",
                        fontSize: "1.25rem",
                        fontWeight: "700",
                        color: "var(--text-primary)",
                        fontFamily: "var(--font-display)",
                        letterSpacing: "-0.015em",
                      }}
                    >
                      <EditableText
                        value={exp.role}
                        onSave={(val) => {
                          const updated = (data?.experience || []).map((e) =>
                            e.id === exp.id ? { ...e, role: val } : e
                          );
                          updateExperience(updated);
                        }}
                      />
                    </h3>
                    <div
                      style={{
                        color: "var(--accent)",
                        fontSize: "0.95rem",
                        fontWeight: "600",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      @{" "}
                      <EditableText
                        value={exp.company}
                        onSave={(val) => {
                          const updated = (data?.experience || []).map((e) =>
                            e.id === exp.id ? { ...e, company: val } : e
                          );
                          updateExperience(updated);
                        }}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "var(--accent-muted)",
                      border: "1px solid var(--border-subtle)",
                      padding: "4px 12px",
                      borderRadius: "100px",
                      fontSize: "0.78rem",
                      fontFamily: "var(--font-mono)",
                      color: "var(--text-secondary)",
                      fontWeight: "500",
                    }}
                  >
                    <FiCalendar size={13} />
                    <EditableText
                      value={exp.period}
                      onSave={(val) => {
                        const updated = (data?.experience || []).map((e) =>
                          e.id === exp.id ? { ...e, period: val } : e
                        );
                        updateExperience(updated);
                      }}
                    />
                  </div>
                </div>

                <p
                  style={{
                    color: "var(--text-secondary)",
                    lineHeight: "1.7",
                    margin: 0,
                    fontSize: "0.94rem",
                  }}
                >
                  <EditableText
                    value={exp.description}
                    onSave={(val) => {
                      const updated = (data?.experience || []).map((e) =>
                        e.id === exp.id ? { ...e, description: val } : e
                      );
                      updateExperience(updated);
                    }}
                    multiline
                  />
                </p>

                {/* Milestone Kru Petch Avatar */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginTop: "1.4rem",
                    paddingTop: "1rem",
                    borderTop: "1px solid var(--border-subtle)",
                  }}
                >
                  <img
                    src={
                      index === 0
                        ? "/img/work.png"
                        : index === 1
                        ? "/img/12.png"
                        : "/img/15.png"
                    }
                    alt="Milestone Avatar"
                    style={{
                      width: "36px",
                      height: "36px",
                      objectFit: "contain",
                      filter: "drop-shadow(0 2px 6px var(--accent-glow))",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.82rem",
                      color: "var(--accent)",
                      fontWeight: "500",
                      fontStyle: "italic",
                    }}
                  >
                    {index === 0
                      ? "“ทำงานไปด้วย เรียนรู้ไปด้วยครับ :)”"
                      : index === 1
                      ? "“ลุยกันต่อครับ! พร้อมก้าวข้ามทุกความท้าทาย 💪”"
                      : "“พร้อมออกเดินทางและก้าวไปข้างหน้าเสมอ 🎒”"}
                  </span>
                </div>

                {isEditMode && (
                  <div style={{ marginTop: "1rem", textAlign: "right" }}>
                    <button
                      onClick={() => removeExperience(exp.id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#ef4444",
                        cursor: "pointer",
                        fontSize: "0.88rem",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                      title={t.experience?.remove || "ลบรายการนี้"}
                    >
                      <FiTrash2 /> <span>{t.experience?.remove || "ลบรายการ"}</span>
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
