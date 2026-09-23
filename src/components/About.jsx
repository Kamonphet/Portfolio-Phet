import React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";
import EditableText from "./EditableText";
import {
  FiCpu,
  FiCheckCircle,
  FiGlobe,
  FiTerminal,
} from "react-icons/fi";

const About = () => {
  const { data, updateAbout, t } = usePortfolio();

  return (
    <section id="about" className="content-section">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ textAlign: "center", marginBottom: "3.5rem" }}
      >
        <div className="section-badge">
          <FiCpu />
          <span>{data.about.badge || t.about.badge}</span>
        </div>
        <h2 className="section-title">
          {t.about.titlePre} <span className="gradient-text">{t.about.titleHighlight}</span>
        </h2>
        <div style={{ maxWidth: "700px", margin: "0 auto", color: "var(--color-text-dim)", fontSize: "1.1rem" }}>
          <EditableText
            value={data.about.heading}
            onSave={(val) => updateAbout({ heading: val })}
            multiline
          />
        </div>
      </motion.div>

      {/* Main Grid: Avatar & Profile + System Specs HUD */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.3fr",
          gap: "2.5rem",
          alignItems: "stretch",
          marginBottom: "3rem",
        }}
        className="about-grid"
      >
        {/* Left: Avatar Card with Cyber Glow */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          whileHover={{ y: -5 }}
          className="glass-card"
          style={{
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Cyber Top Accent */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "3px",
              background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))",
            }}
          />

          <div
            style={{
              position: "relative",
              width: "200px",
              height: "200px",
              margin: "0 auto 1.5rem auto",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "-4px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                opacity: 0.8,
                filter: "blur(6px)",
              }}
            />
            <img
              src={data.about.avatarUrl}
              alt="Profile"
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid rgba(255, 255, 255, 0.2)",
              }}
            />
          </div>

          <h3 style={{ margin: "0 0 4px 0", fontSize: "1.3rem", fontWeight: "700" }}>
            {data.hero.name}
          </h3>
          <p style={{ color: "var(--color-primary)", fontSize: "0.9rem", margin: "0 0 1.2rem 0", fontFamily: "var(--font-mono)" }}>
            {data.hero.title}
          </p>

          {/* Quick HUD Specs Table */}
          <div
            style={{
              width: "100%",
              background: "var(--color-glass-subtle)",
              borderRadius: "12px",
              border: "1px solid var(--color-card-border)",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              textAlign: "left",
              fontSize: "0.85rem",
            }}
          >
            {data.about.systemSpecs.map((spec, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBottom: idx !== data.about.systemSpecs.length - 1 ? "8px" : 0,
                  borderBottom:
                    idx !== data.about.systemSpecs.length - 1 ? "1px solid var(--color-card-border)" : "none",
                }}
              >
                <span style={{ color: "var(--color-text-dim)" }}>{spec.label}:</span>
                <span style={{ color: "var(--color-accent-2)", fontWeight: "600" }}>{spec.value}</span>
              </div>
            ))}
          </div>

          {/* Motto Sticker 7.png */}
          <div
            style={{
              marginTop: "1.2rem",
              width: "100%",
              background: "var(--color-glass-subtle)",
              border: "1px solid var(--color-card-border)",
              borderRadius: "12px",
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              textAlign: "left",
            }}
          >
            <img
              src="/img/7.png"
              alt="การเรียนรู้ไม่มีที่สิ้นสุด"
              style={{ width: "45px", height: "45px", objectFit: "contain", filter: "drop-shadow(0 2px 6px rgba(0, 242, 254, 0.3))" }}
            />
            <div>
              <div style={{ fontSize: "0.72rem", color: "var(--color-primary)", fontWeight: "700", letterSpacing: "0.5px" }}>
                PEDAGOGY MOTTO
              </div>
              <div style={{ fontSize: "0.86rem", fontWeight: "600", color: "var(--color-text-main)" }}>
                "การเรียนรู้ไม่มีที่สิ้นสุดครับ :)"
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Narrative Bio & Mission */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          whileHover={{ y: -5 }}
          className="glass-card"
          style={{
            padding: "2.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.85rem",
                color: "var(--color-accent-1)",
                marginBottom: "1rem",
              }}
            >
              <FiTerminal />
              <span>{t.about.terminal}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              {data.about.paragraphs.map((p, idx) => (
                <p
                  key={idx}
                  style={{
                    color: "var(--color-text-main)",
                    fontSize: "1.05rem",
                    lineHeight: "1.75",
                    margin: 0,
                  }}
                >
                  <EditableText
                    value={p}
                    onSave={(val) => {
                      const updated = [...data.about.paragraphs];
                      updated[idx] = val;
                      updateAbout({ paragraphs: updated });
                    }}
                    multiline
                  />
                </p>
              ))}
            </div>

            {/* Specializations & Core Competencies Card with introduce.png */}
            <div
              style={{
                marginTop: "1.5rem",
                background: "var(--color-glass-subtle)",
                border: "1px solid var(--color-card-border)",
                borderRadius: "14px",
                padding: "1.1rem 1.3rem",
                display: "flex",
                alignItems: "center",
                gap: "1.2rem",
                flexWrap: "wrap",
              }}
            >
              <img
                src="/img/introduce.png"
                alt="ครูเพชร IT แนะนำตัว"
                style={{
                  width: "68px",
                  height: "68px",
                  objectFit: "contain",
                  filter: "drop-shadow(0 4px 12px rgba(0, 242, 254, 0.25))",
                }}
              />
              <div style={{ flex: 1, minWidth: "220px" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--color-primary)", letterSpacing: "0.5px", marginBottom: "6px" }}>
                  ✨ 4 เสาหลักความเชี่ยวชาญ // SPECIALIZATION BADGES
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  <span style={{ fontSize: "0.78rem", background: "rgba(0, 242, 254, 0.12)", border: "1px solid rgba(0, 242, 254, 0.3)", color: "var(--color-primary)", padding: "3px 10px", borderRadius: "12px", fontWeight: "600" }}>
                    🛡️ Cybersecurity
                  </span>
                  <span style={{ fontSize: "0.78rem", background: "rgba(138, 43, 226, 0.12)", border: "1px solid rgba(138, 43, 226, 0.3)", color: "var(--color-secondary)", padding: "3px 10px", borderRadius: "12px", fontWeight: "600" }}>
                    💻 IT Support
                  </span>
                  <span style={{ fontSize: "0.78rem", background: "rgba(0, 255, 135, 0.12)", border: "1px solid rgba(0, 255, 135, 0.3)", color: "var(--color-accent-2)", padding: "3px 10px", borderRadius: "12px", fontWeight: "600" }}>
                    🤖 วิทยาการคำนวณ
                  </span>
                  <span style={{ fontSize: "0.78rem", background: "rgba(255, 209, 102, 0.12)", border: "1px solid rgba(255, 209, 102, 0.3)", color: "var(--color-accent-1)", padding: "3px 10px", borderRadius: "12px", fontWeight: "600" }}>
                    🏃 สุขศึกษา
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Verification & Region Bar */}
          <div
            style={{
              marginTop: "1.8rem",
              paddingTop: "1.2rem",
              borderTop: "1px solid var(--color-card-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--color-accent-2)" }}>
              <FiCheckCircle />
              <span style={{ fontSize: "0.9rem", fontWeight: "600" }}>{t.about.verified}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-text-dim)", fontSize: "0.85rem" }}>
              <FiGlobe />
              <span>{data.contact.location}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats Counter Bar with Staggered Scroll Motion */}
      <div
        className="about-stats-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1.2rem",
        }}
      >
        {(data?.about?.stats || []).map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: idx * 0.12, duration: 0.6 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="glass-card"
            style={{
              padding: "1.6rem 1.2rem",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span
              style={{
                fontSize: "2.2rem",
                fontWeight: "900",
                color: "var(--color-primary)",
                fontFamily: "var(--font-mono)",
                letterSpacing: "-1px",
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
            <span style={{ color: "var(--color-text-dim)", fontSize: "0.85rem", fontWeight: "500" }}>
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

      <style>{`
        @media (max-width: 960px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
        @media (max-width: 600px) {
          .about-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.8rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default About;
