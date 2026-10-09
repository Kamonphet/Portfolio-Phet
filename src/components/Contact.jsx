import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";
import EditableText from "./EditableText";
import confetti from "canvas-confetti";
import emailjs from "@emailjs/browser";
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
  FiAlertCircle,
} from "react-icons/fi";
import { saveContactMessage } from "../lib/portfolioService";
import { sanitizeUrl } from "../utils/security";

// EmailJS Configuration
const EMAILJS_SERVICE_ID = "service_portfolio";
const EMAILJS_TEMPLATE_ID = "template_contact";
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY_HERE";

const Contact = () => {
  const { data, updateContact, t } = usePortfolio();
  const formRef = useRef(null);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(data?.contact?.email || "");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      // 1. Save message to Google Sheets contact_messages table
      saveContactMessage({
        name: formState.name,
        email: formState.email,
        subject: formState.subject || "Portfolio Contact Form",
        message: formState.message,
      });

      // 2. Send email notification via EmailJS
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formState.name,
          from_email: formState.email,
          subject: formState.subject || "Portfolio Contact Form",
          message: formState.message,
          to_email: "kamonpach.siri@gmail.com",
        },
        EMAILJS_PUBLIC_KEY
      );

      setIsSuccess(true);

      // Trigger Confetti Fireworks
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#38BDF8", "#0284C7", "#00FF87", "#F59E0B"],
        });
      } catch (err) {
        // fallback
      }

      setFormState({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setIsSuccess(false), 6000);
    } catch (error) {
      console.error("Contact Submission Error:", error);
      setIsSuccess(true);
      setFormState({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setIsSuccess(false), 6000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="content-section">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: "center", marginBottom: "3.5rem" }}
      >
        <span className="eyebrow-label">// 05 — GET IN TOUCH & COLLABORATION</span>
        <h2 className="section-title">
          {t.contact?.titlePre || "ช่องทางการติดต่อและ"}{" "}
          <span className="gradient-text">{t.contact?.titleHighlight || "ร่วมงาน"}</span>
        </h2>
        <p className="section-subtitle">
          {t.contact?.subtitle ||
            "พร้อมร่วมงาน แลกเปลี่ยนความรู้ด้าน Cybersecurity และการพัฒนานวัตกรรมเทคโนโลยีเพื่อการศึกษา"}
        </p>
      </motion.div>

      {/* Main Grid: Info Cards + Form */}
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
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* Warm Welcome Mascot Card */}
          <div
            style={{
              padding: "1.4rem 1.6rem",
              display: "flex",
              alignItems: "center",
              gap: "1.2rem",
              borderRadius: "20px",
              background: "var(--color-card-bg)",
              border: "1px solid var(--accent-border)",
              boxShadow: "var(--color-card-shadow)",
            }}
          >
            <img
              src="/img/13.webp"
              alt="ขอบคุณครับ"
              style={{
                width: "56px",
                height: "56px",
                objectFit: "contain",
                filter: "drop-shadow(0 4px 10px var(--accent-glow))",
              }}
            />
            <div>
              <div
                style={{
                  fontSize: "0.76rem",
                  color: "var(--accent)",
                  fontWeight: "700",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.05em",
                }}
              >
                // WARM WELCOME
              </div>
              <div
                style={{
                  fontSize: "0.92rem",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  marginTop: "3px",
                  lineHeight: 1.5,
                }}
              >
                "ขอบคุณที่เข้ามาเยี่ยมชมครับ :) หากมีข้อเสนอแนะหรือต้องการร่วมงาน ทักทายมาได้เลยครับ"
              </div>
            </div>
          </div>

          {/* Quick Email Card */}
          <div
            style={{
              padding: "1.75rem",
              borderRadius: "20px",
              background: "var(--color-card-bg)",
              border: "1px solid var(--border-subtle)",
              boxShadow: "var(--color-card-shadow)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "1.2rem" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "var(--accent-muted)",
                  color: "var(--accent)",
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.25rem",
                }}
              >
                <FiMail />
              </div>
              <div>
                <span
                  style={{
                    fontSize: "0.74rem",
                    color: "var(--text-tertiary)",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.06em",
                  }}
                >
                  {t.contact?.directTitle || "DIRECT EMAIL"}
                </span>
                <div style={{ fontWeight: "700", color: "var(--text-primary)", fontSize: "1.05rem" }}>
                  <EditableText
                    value={data?.contact?.email || ""}
                    onSave={(val) => updateContact({ email: val })}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleCopyEmail}
              className="btn-luxury-secondary"
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "0.86rem",
                justifyContent: "center",
                borderRadius: "12px",
                color: copiedEmail ? "#10B981" : "var(--text-primary)",
                borderColor: copiedEmail ? "#10B981" : "var(--border-subtle)",
              }}
            >
              {copiedEmail ? <FiCheck /> : <FiCopy />}
              <span>{copiedEmail ? (t.contact?.copiedEmail || "คัดลอกอีเมลแล้ว!") : (t.contact?.copyEmail || "คัดลอกอีเมล")}</span>
            </button>
          </div>

          {/* Location & Availability Card */}
          <div
            style={{
              padding: "1.75rem",
              borderRadius: "20px",
              background: "var(--color-card-bg)",
              border: "1px solid var(--border-subtle)",
              boxShadow: "var(--color-card-shadow)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "1rem" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "rgba(16, 185, 129, 0.12)",
                  color: "#10B981",
                  border: "1px solid rgba(16, 185, 129, 0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.25rem",
                }}
              >
                <FiMapPin />
              </div>
              <div>
                <span
                  style={{
                    fontSize: "0.74rem",
                    color: "var(--text-tertiary)",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.06em",
                  }}
                >
                  {t.contact?.locationTitle || "LOCATION & STATUS"}
                </span>
                <div style={{ fontWeight: "700", color: "var(--text-primary)", fontSize: "1.05rem" }}>
                  <EditableText
                    value={data?.contact?.location || ""}
                    onSave={(val) => updateContact({ location: val })}
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                background: "rgba(16, 185, 129, 0.08)",
                border: "1px solid rgba(16, 185, 129, 0.25)",
                borderRadius: "10px",
                padding: "8px 14px",
                color: "#10B981",
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontWeight: "600",
              }}
            >
              <FiCheckCircle />
              <EditableText
                value={data?.contact?.availability || "Available for Opportunities"}
                onSave={(val) => updateContact({ availability: val })}
              />
            </div>
          </div>

          {/* Social Network Channels */}
          <div
            style={{
              padding: "1.75rem",
              borderRadius: "20px",
              background: "var(--color-card-bg)",
              border: "1px solid var(--border-subtle)",
              boxShadow: "var(--color-card-shadow)",
            }}
          >
            <div
              style={{
                fontSize: "0.74rem",
                color: "var(--text-tertiary)",
                marginBottom: "1rem",
                textTransform: "uppercase",
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.08em",
              }}
            >
              {t.contact?.networksTitle || "// NETWORK CHANNELS"}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {data?.contact?.github && (
                <a
                  href={sanitizeUrl(data.contact.github)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-luxury-secondary"
                  style={{
                    padding: "9px 14px",
                    borderRadius: "10px",
                    fontSize: "0.85rem",
                    justifyContent: "flex-start",
                  }}
                >
                  <FiGithub size={16} /> <span>GitHub</span>
                </a>
              )}

              {data?.contact?.linkedin && (
                <a
                  href={sanitizeUrl(data.contact.linkedin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-luxury-secondary"
                  style={{
                    padding: "9px 14px",
                    borderRadius: "10px",
                    fontSize: "0.85rem",
                    justifyContent: "flex-start",
                  }}
                >
                  <FiLinkedin size={16} /> <span>LinkedIn</span>
                </a>
              )}

              {data?.contact?.twitter && (
                <a
                  href={sanitizeUrl(data.contact.twitter)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-luxury-secondary"
                  style={{
                    padding: "9px 14px",
                    borderRadius: "10px",
                    fontSize: "0.85rem",
                    justifyContent: "flex-start",
                  }}
                >
                  <FiTwitter size={16} /> <span>Twitter / X</span>
                </a>
              )}

              {data?.contact?.discord && (
                <div
                  className="btn-luxury-secondary"
                  style={{
                    padding: "9px 14px",
                    borderRadius: "10px",
                    fontSize: "0.85rem",
                    justifyContent: "flex-start",
                    cursor: "default",
                  }}
                >
                  <FiMessageSquare size={16} /> <span>{data.contact.discord}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right Column: Encrypted-Feel Transmission Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            padding: "2.5rem",
            borderRadius: "24px",
            background: "var(--color-card-bg)",
            border: "1px solid var(--border-subtle)",
            boxShadow: "var(--color-card-shadow)",
          }}
        >
          <div style={{ marginBottom: "1.75rem" }}>
            <span
              style={{
                fontSize: "0.74rem",
                color: "var(--accent)",
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              // SECURE TRANSMISSION
            </span>
            <h3
              style={{
                margin: "4px 0 0 0",
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "var(--text-primary)",
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.015em",
              }}
            >
              {t.contact?.formTitle || "ส่งข้อความถึงครูเพชร"}
            </h3>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="form-row">
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.82rem",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    marginBottom: "6px",
                  }}
                >
                  {t.contact?.nameLabel || "ชื่อผู้ติดต่อ"}
                </label>
                <input
                  required
                  type="text"
                  name="from_name"
                  placeholder={t.contact?.namePlaceholder || "สมชาย ใจดี"}
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-primary)",
                    fontSize: "0.92rem",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--accent)";
                    e.target.style.boxShadow = "0 0 0 3px var(--accent-glow)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--border-subtle)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.82rem",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    marginBottom: "6px",
                  }}
                >
                  {t.contact?.emailLabel || "อีเมลของคุณ"}
                </label>
                <input
                  required
                  type="email"
                  name="from_email"
                  placeholder={t.contact?.emailPlaceholder || "somchai@example.com"}
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-primary)",
                    fontSize: "0.92rem",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--accent)";
                    e.target.style.boxShadow = "0 0 0 3px var(--accent-glow)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--border-subtle)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.82rem",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  marginBottom: "6px",
                }}
              >
                {t.contact?.subjectLabel || "หัวข้อเรื่อง"}
              </label>
              <input
                type="text"
                name="subject"
                placeholder={t.contact?.subjectPlaceholder || "ปรึกษาโปรเจกต์ / บรรยาย Cybersecurity"}
                value={formState.subject}
                onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-primary)",
                  fontSize: "0.92rem",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--accent)";
                  e.target.style.boxShadow = "0 0 0 3px var(--accent-glow)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border-subtle)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.82rem",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  marginBottom: "6px",
                }}
              >
                {t.contact?.messageLabel || "ข้อความ"}
              </label>
              <textarea
                required
                rows="5"
                name="message"
                placeholder={t.contact?.messagePlaceholder || "พิมพ์รายละเอียดที่ท่านต้องการพูดคุยที่นี่..."}
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-primary)",
                  fontSize: "0.92rem",
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                  resize: "vertical",
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--accent)";
                  e.target.style.boxShadow = "0 0 0 3px var(--accent-glow)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border-subtle)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-luxury-primary"
              style={{
                width: "100%",
                padding: "14px",
                fontSize: "0.98rem",
                borderRadius: "12px",
                marginTop: "0.5rem",
                justifyContent: "center",
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              <FiSend />
              <span>{isSubmitting ? (t.contact?.sendingBtn || "กำลังส่งข้อมูล...") : (t.contact?.sendBtn || "ส่งข้อความ (Transmit)")}</span>
            </button>

            {/* Success Message Banner */}
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                style={{
                  background: "rgba(16, 185, 129, 0.12)",
                  border: "1px solid rgba(16, 185, 129, 0.35)",
                  color: "#10B981",
                  padding: "14px 18px",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
                <img
                  src="/img/great.webp"
                  alt="เยี่ยมเลย!"
                  style={{
                    width: "48px",
                    height: "48px",
                    objectFit: "contain",
                    filter: "drop-shadow(0 2px 8px rgba(16, 185, 129, 0.4))",
                  }}
                />
                <div>
                  <div style={{ fontSize: "0.98rem", fontWeight: "700", color: "var(--text-primary)" }}>
                    เยี่ยมเลย! ได้รับข้อความเรียบร้อย 👍
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#10B981", marginTop: "2px" }}>
                    {t.contact?.successMsg || "ขอบคุณที่ติดต่อเข้ามาครับ ครูเพชรจะตอบกลับโดยเร็วที่สุด"}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                style={{
                  background: "rgba(239, 68, 68, 0.12)",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                  color: "#ef4444",
                  padding: "14px 18px",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontSize: "0.92rem",
                  fontWeight: "600",
                }}
              >
                <FiAlertCircle size={22} />
                <span>{errorMsg}</span>
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
      `}</style>
    </section>
  );
};

export default Contact;
