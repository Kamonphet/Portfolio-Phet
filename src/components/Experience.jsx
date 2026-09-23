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
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ textAlign: "center", marginBottom: "3.5rem" }}
      >
        <div className="section-badge">
          <FiBriefcase />
          <span>{t.experience.badge}</span>
        </div>
        <h2 className="section-title">
          {t.experience.titlePre} <span className="gradient-text">{t.experience.titleHighlight}</span>
        </h2>
        <p style={{ maxWidth: "600px", margin: "0 auto", color: "var(--color-text-dim)" }}>
          {t.experience.subtitle}
        </p>

        {isEditMode && (
          <div style={{ marginTop: "1rem" }}>
            <button
              onClick={() => openCms("experience")}
              style={{
                background: "rgba(0, 255, 135, 0.15)",
                color: "var(--color-accent-2)",
                border: "1px dashed var(--color-accent-2)",
                borderRadius: "30px",
                padding: "8px 18px",
                fontSize: "0.85rem",
                fontWeight: "600",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <FiPlus /> {t.experience.manage}
            </button>
          </div>
        )}
      </motion.div>

      {/* Timeline Container */}
      <div
        style={{
          maxWidth: "840px",
          margin: "0 auto",
          position: "relative",
          paddingLeft: "30px",
        }}
      >
        {/* Glowing Vertical Connector Line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "7px",
            width: "2px",
            background: "linear-gradient(180deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
            boxShadow: "0 0 8px rgba(0, 242, 254, 0.5)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {(data?.experience || []).map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
              style={{ position: "relative" }}
            >
              {/* Timeline Node Dot with Pulse */}
              <div
                style={{
                  position: "absolute",
                  left: "-30px",
                  top: "22px",
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: "var(--color-timeline-node)",
                  border: "3px solid var(--color-primary)",
                  boxShadow: "0 0 10px var(--color-primary-glow)",
                }}
              />

              {/* Experience Card */}
              <motion.div
                whileHover={{ y: -5, x: 4 }}
                className="glass-card"
                style={{
                  padding: "1.8rem 2rem",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: "0.8rem",
                  }}
                >
                  <div>
                    <h3 style={{ margin: "0 0 4px 0", fontSize: "1.25rem", fontWeight: "700" }}>
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
                    <div style={{ color: "var(--color-primary)", fontSize: "0.95rem", fontWeight: "600" }}>
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
                      background: "var(--color-glass-subtle)",
                      border: "1px solid var(--color-card-border)",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      fontFamily: "var(--font-mono)",
                      color: "var(--color-accent-1)",
                    }}
                  >
                    <FiCalendar />
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

                <p style={{ color: "var(--color-text-dim)", lineHeight: "1.65", margin: 0, fontSize: "0.95rem" }}>
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

                {/* Milestone Kru Petch Sticker */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginTop: "1.2rem",
                    paddingTop: "0.8rem",
                    borderTop: "1px solid var(--color-card-border)",
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
                      filter: "drop-shadow(0 2px 6px rgba(0, 242, 254, 0.3))",
                    }}
                  />
                  <span style={{ fontSize: "0.82rem", color: "var(--color-primary)", fontWeight: "600" }}>
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
                        color: "#ff4757",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                      }}
                      title="Delete experience entry"
                    >
                      <FiTrash2 /> {t.experience.remove}
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .glass-card {
            padding: 1.3rem 1.1rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Experience;
