import React, { useState } from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";
import EditableText from "./EditableText";
import confetti from "canvas-confetti";
import {
  FiMail,
  FiSend,
  FiMapPin,
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiMessageSquare,
  FiCopy,
  FiCheck,
  FiCheckCircle,
} from "react-icons/fi";

const Contact = () => {
  const { data, updateContact, t } = usePortfolio();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(data.contact.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      // Trigger Confetti Fireworks
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#00f2fe", "#8a2be2", "#00ff87", "#ffd166"],
        });
      } catch (err) {
        // fallback
      }

      setFormState({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setIsSuccess(false), 6000);
    }, 1200);
  };

  return (
    <section id="contact" className="content-section">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ textAlign: "center", marginBottom: "3.5rem" }}
      >
        <div className="section-badge">
          <FiMail />
          <span>{t.contact.badge}</span>
        </div>
        <h2 className="section-title">
          {t.contact.titlePre} <span className="gradient-text">{t.contact.titleHighlight}</span>
        </h2>
        <p style={{ maxWidth: "600px", margin: "0 auto", color: "var(--color-text-dim)" }}>
          {t.contact.subtitle}
        </p>
      </motion.div>

      {/* Main Grid: Info Cards + Form with Scroll Motion */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.3fr",
          gap: "2.5rem",
          alignItems: "stretch",
        }}
        className="contact-grid"
      >
        {/* Left Column: Direct Info & Social Cards */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* Welcome Mascot Card featuring 13.png */}
          <div
            className="glass-card"
            style={{
              padding: "1.4rem 1.6rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              background: "linear-gradient(135deg, rgba(0, 242, 254, 0.08), rgba(138, 43, 226, 0.08))",
              border: "1px solid rgba(0, 242, 254, 0.25)",
            }}
          >
            <img
              src="/img/13.png"
              alt="ขอบคุณครับ"
              style={{
                width: "60px",
                height: "60px",
                objectFit: "contain",
                filter: "drop-shadow(0 4px 10px rgba(0, 242, 254, 0.3))",
              }}
            />
            <div>
              <div style={{ fontSize: "0.78rem", color: "var(--color-primary)", fontWeight: "700", letterSpacing: "0.5px" }}>
                ✨ WARM WELCOME // ข้อความจากครูเพชร
              </div>
              <div style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--color-text-main)", marginTop: "2px" }}>
                "ขอบคุณที่เข้ามาเยี่ยมชมครับ :) หากมีข้อเสนอแนะหรือต้องการร่วมงาน ทักทายมาได้เลยครับ"
              </div>
            </div>
          </div>

          {/* Quick Email Card */}
          <div className="glass-card" style={{ padding: "1.8rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: "rgba(0, 242, 254, 0.1)",
                  color: "var(--color-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                }}
              >
                <FiMail />
              </div>
              <div>
                <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", textTransform: "uppercase" }}>
                  {t.contact.directTitle}
                </span>
                <div style={{ fontWeight: "700", color: "var(--color-text-main)", fontSize: "1.05rem" }}>
                  <EditableText
                    value={data.contact.email}
                    onSave={(val) => updateContact({ email: val })}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleCopyEmail}
              style={{
                width: "100%",
                background: "var(--color-glass-subtle)",
                border: "1px solid var(--color-card-border)",
                color: copiedEmail ? "var(--color-accent-2)" : "var(--color-text-main)",
                borderRadius: "8px",
                padding: "8px",
                fontSize: "0.85rem",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                transition: "all 0.2s ease",
              }}
            >
              {copiedEmail ? <FiCheck /> : <FiCopy />}
              <span>{copiedEmail ? t.contact.copiedEmail : t.contact.copyEmail}</span>
            </button>
          </div>

          {/* Location & Availability Card */}
          <div className="glass-card" style={{ padding: "1.8rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: "rgba(0, 255, 135, 0.1)",
                  color: "var(--color-accent-2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                }}
              >
                <FiMapPin />
              </div>
              <div>
                <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", textTransform: "uppercase" }}>
                  {t.contact.locationTitle}
                </span>
                <div style={{ fontWeight: "700", color: "var(--color-text-main)", fontSize: "1.05rem" }}>
                  <EditableText
                    value={data.contact.location}
                    onSave={(val) => updateContact({ location: val })}
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                background: "var(--color-badge-bg)",
                border: "1px solid var(--color-badge-border)",
                borderRadius: "8px",
                padding: "10px 14px",
                color: "var(--color-accent-2)",
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FiCheckCircle />
              <EditableText
                value={data.contact.availability}
                onSave={(val) => updateContact({ availability: val })}
              />
            </div>
          </div>

          {/* Social Network Channels */}
          <div className="glass-card" style={{ padding: "1.8rem" }}>
            <div style={{ fontSize: "0.85rem", color: "var(--color-text-dim)", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "1px" }}>
              {t.contact.networksTitle}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {data.contact.github && (
                <a
                  href={data.contact.github}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    color: "var(--color-text-main)",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)")}
                >
                  <FiGithub size={16} /> GitHub
                </a>
              )}

              {data.contact.linkedin && (
                <a
                  href={data.contact.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "var(--color-glass-subtle)",
                    border: "1px solid var(--color-card-border)",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    color: "var(--color-text-main)",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-card-border)")}
                >
                  <FiLinkedin size={16} /> LinkedIn
                </a>
              )}

              {data.contact.twitter && (
                <a
                  href={data.contact.twitter}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "var(--color-glass-subtle)",
                    border: "1px solid var(--color-card-border)",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    color: "var(--color-text-main)",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-card-border)")}
                >
                  <FiTwitter size={16} /> Twitter / X
                </a>
              )}

              {data.contact.discord && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "var(--color-glass-subtle)",
                    border: "1px solid var(--color-card-border)",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    color: "var(--color-text-main)",
                    fontSize: "0.9rem",
                  }}
                >
                  <FiMessageSquare size={16} /> {data.contact.discord}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right Column: Transmission Form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="glass-card"
          style={{ padding: "2.5rem" }}
        >
          <h3 style={{ margin: "0 0 1.5rem 0", fontSize: "1.4rem", fontWeight: "700" }}>
            {t.contact.formTitle}
          </h3>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="form-row">
              <div>
                <label className="cms-label">{t.contact.nameLabel}</label>
                <input
                  required
                  type="text"
                  placeholder={t.contact.namePlaceholder}
                  className="cms-input"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                />
              </div>
              <div>
                <label className="cms-label">{t.contact.emailLabel}</label>
                <input
                  required
                  type="email"
                  placeholder={t.contact.emailPlaceholder}
                  className="cms-input"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="cms-label">{t.contact.subjectLabel}</label>
              <input
                type="text"
                placeholder={t.contact.subjectPlaceholder}
                className="cms-input"
                value={formState.subject}
                onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
              />
            </div>

            <div>
              <label className="cms-label">{t.contact.messageLabel}</label>
              <textarea
                required
                rows="5"
                placeholder={t.contact.messagePlaceholder}
                className="cms-input"
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "14px",
                fontSize: "1rem",
                borderRadius: "10px",
                marginTop: "0.5rem",
              }}
            >
              <FiSend />
              <span>{isSubmitting ? t.contact.sendingBtn : t.contact.sendBtn}</span>
            </button>

            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                style={{
                  background: "rgba(0, 255, 135, 0.15)",
                  border: "1px solid var(--color-accent-2)",
                  color: "var(--color-accent-2)",
                  padding: "14px 18px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
                <img
                  src="/img/great.png"
                  alt="เยี่ยมเลย!"
                  style={{
                    width: "48px",
                    height: "48px",
                    objectFit: "contain",
                    filter: "drop-shadow(0 2px 8px rgba(0, 255, 135, 0.4))",
                  }}
                />
                <div>
                  <div style={{ fontSize: "1rem", fontWeight: "700", color: "var(--color-text-main)" }}>
                    เยี่ยมเลย! ได้รับข้อความเรียบร้อย 👍
                  </div>
                  <div style={{ fontSize: "0.88rem", color: "var(--color-accent-2)", marginTop: "2px" }}>
                    {t.contact.successMsg}
                  </div>
                </div>
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
          .form-row {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .contact-grid .glass-card {
            padding: 1.5rem 1.2rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Contact;
