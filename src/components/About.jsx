import React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";
import EditableText from "./EditableText";
import {
  FiShield,
  FiServer,
  FiCpu,
  FiAward,
  FiCheckCircle,
  FiMapPin,
  FiBookOpen,
  FiCalendar,
} from "react-icons/fi";

const SpecificationList = ({ specs, updateAbout }) => {
  return (
    <div
      style={{
        width: "100%",
        paddingTop: "1.25rem",
        borderTop: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        textAlign: "left",
      }}
    >
      {specs.map((spec, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: "12px",
            paddingBottom: idx !== specs.length - 1 ? "8px" : 0,
            borderBottom:
              idx !== specs.length - 1
                ? "1px solid var(--border-subtle)"
                : "none",
            fontSize: "0.86rem",
          }}
        >
          <span
            style={{
              color: "var(--text-secondary)",
              fontWeight: "500",
            }}
          >
            <EditableText
              value={spec.label}
              onSave={(val) => {
                const updated = [...specs];
                updated[idx] = { ...updated[idx], label: val };
                updateAbout({ systemSpecs: updated });
              }}
            />
          </span>
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
        </div>
      ))}
    </div>
  );
};

const About = () => {
  const { data, updateAbout, t } = usePortfolio();

  const education = data?.about?.education || [];
  const systemSpecs = data?.about?.systemSpecs || [];

  return (
    <section id="about" className="content-section">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: "center", marginBottom: "3.75rem" }}
      >
        <h2 className="section-title">
          {t.about.titlePre}{" "}
          <span style={{ color: "var(--accent)" }}>
            {t.about.titleHighlight}
          </span>
        </h2>
        <div
          style={{
            maxWidth: "700px",
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

      {/* Main Split Layout: Left (Portrait & Specifications) | Right (Narrative & Core Pillars) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.35fr",
          gap: "2.25rem",
          alignItems: "stretch",
          marginBottom: "3rem",
        }}
        className="about-grid"
      >
        {/* Left Column: Portrait & Key Specifications (Single Card Surface) */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card"
          style={{
            padding: "2.25rem 2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            textAlign: "center",
            gap: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.1rem",
              width: "100%",
            }}
          >
            {/* Portrait with Crisp Hairline Frame */}
            <div
              style={{
                position: "relative",
                width: "168px",
                height: "168px",
              }}
            >
              <img
                src={data.about.avatarUrl || "/profile.jpg"}
                alt={data.hero.name || "ครูเพชร IT"}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid var(--accent-border)",
                  boxShadow: "0 12px 28px rgba(0, 0, 0, 0.22)",
                }}
              />
            </div>

            <div>
              <h3
                style={{
                  fontSize: "1.45rem",
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
                  fontSize: "0.9rem",
                  margin: 0,
                  fontWeight: "600",
                }}
              >
                {data.hero.title}
              </p>
            </div>

            {/* Clean Hair-lined Specification Sheet */}
            <SpecificationList specs={systemSpecs} updateAbout={updateAbout} />
          </div>

          {/* Pedagogy Motto Footer (Divided by Hairline, Not a Nested Card) */}
          <div
            style={{
              width: "100%",
              paddingTop: "1.1rem",
              borderTop: "1px solid var(--border-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              textAlign: "left",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <FiAward
                size={18}
                style={{ color: "var(--accent)", flexShrink: 0 }}
              />
              <span
                style={{
                  fontSize: "0.88rem",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                }}
              >
                “การเรียนรู้ไม่มีที่สิ้นสุด :)”
              </span>
            </div>
            <span
              style={{
                fontSize: "0.76rem",
                color: "var(--text-tertiary)",
                fontWeight: "500",
              }}
            >
              Lifelong Learner
            </span>
          </div>
        </motion.div>

        {/* Right Column: Narrative Bio & Core Pillars (Single Card Surface) */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: 0.65,
            delay: 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="glass-card"
          style={{
            padding: "2.4rem 2.25rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "2rem",
          }}
        >
          <div>
            {/* Section Label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "0.82rem",
                fontWeight: "600",
                color: "var(--accent)",
                marginBottom: "1.35rem",
              }}
            >
              <FiBookOpen size={15} />
              <span>{t.about.terminal || "แนวคิดและปรัชญาการทำงาน"}</span>
            </div>

            {/* Narrative Paragraphs */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.2rem",
              }}
            >
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

            {/* 4 Core Pillars (Divided by Hairline, No Nested Card Wrapper) */}
            <div
              style={{
                marginTop: "2rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid var(--border-subtle)",
              }}
            >
              <div
                style={{
                  fontSize: "0.82rem",
                  fontWeight: "600",
                  color: "var(--text-secondary)",
                  marginBottom: "12px",
                }}
              >
                แกนหลักความเชี่ยวชาญ 4 ด้าน
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "10px",
                }}
                className="pillars-grid"
              >
                <div className="pillar-item">
                  <FiShield size={15} />
                  <span>Cybersecurity &amp; CTF</span>
                </div>
                <div className="pillar-item">
                  <FiServer size={15} />
                  <span>IT Infrastructure</span>
                </div>
                <div className="pillar-item">
                  <FiCpu size={15} />
                  <span>Computing Science</span>
                </div>
                <div className="pillar-item">
                  <FiAward size={15} />
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
              fontSize: "0.86rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--accent)",
              }}
            >
              <FiCheckCircle />
              <span style={{ fontWeight: "600" }}>
                {t.about.verified || "Verified Educator & Researcher"}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "var(--text-secondary)",
              }}
            >
              <FiMapPin />
              <span>{data.contact.location || "Bangkok, Thailand"}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Metrics Strip with Tabular Numerals */}
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              delay: idx * 0.08,
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -4 }}
            className="glass-card"
            style={{
              padding: "1.6rem 1.25rem",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span
              className="tabular-nums"
              style={{
                fontSize: "2.35rem",
                fontWeight: "700",
                color: "var(--accent)",
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.035em",
                lineHeight: 1.05,
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

      {/* Education & Academic Milestones Timeline */}
      {education.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h3 className="section-title" style={{ fontSize: "2.1rem" }}>
              {t.about.educationTitle || "ประวัติการศึกษา"}
            </h3>
          </div>

          <div className="edu-timeline">
            <div className="edu-timeline-line" />

            {education.map((edu, idx) => (
              <motion.div
                key={edu.id || idx}
                className={`edu-timeline-item ${
                  idx % 2 === 0 ? "edu-timeline-left" : "edu-timeline-right"
                }`}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -32 : 32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.65,
                  delay: idx * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
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
                        <img
                          src={edu.image}
                          alt={edu.institution}
                          className="edu-timeline-img"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="edu-timeline-text">
                      <span className="edu-timeline-period tabular-nums">
                        <FiCalendar
                          size={12}
                          style={{ display: "inline", marginRight: "5px" }}
                        />
                        {edu.period}
                      </span>
                      <h4 className="edu-timeline-degree">{edu.degree}</h4>
                      <p className="edu-timeline-field">{edu.field}</p>
                      <p className="edu-timeline-institution">
                        {edu.institution}
                      </p>
                      {edu.description && (
                        <p className="edu-timeline-desc">{edu.description}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <style>{`
        .pillar-item {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 9px 12px;
          background: var(--accent-muted);
          border: 1px solid var(--border-subtle);
          border-radius: 10px;
          font-size: 0.84rem;
          color: var(--text-primary);
          font-weight: 500;
          transition: border-color 0.2s ease, color 0.2s ease;
        }
        .pillar-item:hover {
          border-color: var(--accent-border);
          color: var(--accent);
        }
        .pillar-item svg {
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
          .pillars-grid {
            grid-template-columns: 1fr !important;
          }
        }

        /* ===== Education Timeline Styles ===== */
        .edu-timeline {
          position: relative;
          max-width: 900px;
          margin: 0 auto;
          padding: 1.5rem 0;
        }
        .edu-timeline-line {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 1px;
          background: var(--border-subtle);
          transform: translateX(-50%);
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
          top: 14px;
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
          border-radius: 16px !important;
        }
        .edu-timeline-card-content {
          padding: 1.35rem;
          display: flex;
          gap: 1.15rem;
          align-items: flex-start;
        }
        .edu-timeline-left .edu-timeline-card-content {
          flex-direction: row-reverse;
        }
        .edu-timeline-img-wrap {
          width: 68px;
          height: 68px;
          border-radius: 14px;
          overflow: hidden;
          background: var(--bg-elevated);
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
          font-size: 0.78rem;
          color: var(--accent);
          font-weight: 600;
          margin-bottom: 4px;
        }
        .edu-timeline-degree {
          font-size: 1.04rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 2px;
        }
        .edu-timeline-field {
          font-size: 0.88rem;
          color: var(--text-secondary);
          margin-bottom: 3px;
        }
        .edu-timeline-institution {
          font-size: 0.82rem;
          color: var(--text-tertiary);
          font-weight: 500;
          margin-bottom: 6px;
        }
        .edu-timeline-desc {
          font-size: 0.86rem;
          color: var(--text-secondary);
          line-height: 1.55;
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
