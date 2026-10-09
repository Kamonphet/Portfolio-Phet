import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";
import EditableText from "./EditableText";
import Hero3D from "./Hero3D";
import {
  FiArrowRight,
  FiMail,
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiChevronDown,
} from "react-icons/fi";
import { sanitizeUrl } from "../utils/security";

const Hero = () => {
  const { data, updateHero, t } = usePortfolio();
  const heroRef = useRef(null);

  // Smooth scroll parallax for subtle depth
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.15]);
  const hero3DY = useTransform(scrollYProgress, [0, 1], [0, 70]);

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      ref={heroRef}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "8.5rem 1.5rem 4rem 1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          width: "100%",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.15fr 0.85fr",
          gap: "3.5rem",
          alignItems: "center",
        }}
        className="hero-grid"
      >
        {/* Left Column: Hero Content with Staggered Split Reveal */}
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="hero-content-col"
        >
          {/* Eyebrow Label Tag */}
          <div style={{ marginBottom: "1.2rem" }}>
            <span className="eyebrow-label">
              // 00 — INNOVATOR & CYBERSECURITY SPECIALIST
            </span>
          </div>

          {/* Status Badge: Available for Collaboration */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "5px 14px",
              borderRadius: "100px",
              background: "var(--accent-muted)",
              border: "1px solid var(--accent-border)",
              marginBottom: "1.5rem",
              backdropFilter: "blur(10px)",
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "var(--accent)",
                boxShadow: "0 0 10px var(--accent-glow)",
                display: "inline-block",
                animation: "pulseGlow 2.5s infinite ease-in-out",
              }}
            />
            <span
              style={{
                fontSize: "0.82rem",
                fontFamily: "var(--font-mono)",
                color: "var(--text-primary)",
                fontWeight: "500",
                letterSpacing: "0.01em",
              }}
            >
              <EditableText
                value={data.hero.status || "Available for collaboration & EdTech Innovation"}
                onSave={(val) => updateHero({ status: val })}
              />
            </span>
          </div>

          {/* Main Headline (Fluid Luxury Typography) */}
          <h1
            style={{
              fontSize: "clamp(2.8rem, 6vw, 5.4rem)",
              fontWeight: "700",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
              margin: "0 0 1rem 0",
              fontFamily: "var(--font-display)",
            }}
          >
            <EditableText
              value={data.hero.name || "ครูเพชร IT"}
              onSave={(val) => updateHero({ name: val })}
            />
          </h1>

          {/* Subtitle / Role Statement */}
          <h2
            style={{
              fontSize: "clamp(1.15rem, 2.2vw, 1.65rem)",
              fontWeight: "500",
              color: "var(--text-secondary)",
              lineHeight: 1.4,
              letterSpacing: "-0.015em",
              margin: "0 0 1.25rem 0",
              fontFamily: "var(--font-display)",
            }}
          >
            <EditableText
              value={data.hero.title}
              onSave={(val) => updateHero({ title: val })}
            />
          </h2>

          {/* Bio Tagline */}
          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-secondary)",
              lineHeight: 1.75,
              maxWidth: "540px",
              margin: "0 0 2rem 0",
            }}
          >
            <EditableText
              value={data.hero.tagline}
              onSave={(val) => updateHero({ tagline: val })}
              multiline
            />
          </p>

          {/* Luxury CTA Action Buttons */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            <button onClick={scrollToProjects} className="btn-luxury-primary">
              <span>{data.hero.ctaPrimary || t.hero.explore}</span>
              <FiArrowRight style={{ transition: "transform 0.25s ease" }} />
            </button>

            <button onClick={scrollToContact} className="btn-luxury-secondary">
              <FiMail style={{ opacity: 0.8 }} />
              <span>{data.hero.ctaSecondary || t.hero.contactMe}</span>
            </button>
          </div>

          {/* Social Links (Minimalist Hairline Icons) */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", marginTop: "2.2rem" }}>
            <span
              style={{
                fontSize: "0.76rem",
                color: "var(--text-tertiary)",
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {t.hero.connect} //
            </span>
            {data.contact.github && (
              <a
                href={sanitizeUrl(data.contact.github)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "1.1rem",
                  transition: "color 0.2s ease, transform 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                }}
                className="social-icon-link"
                title="GitHub"
              >
                <FiGithub />
              </a>
            )}
            {data.contact.linkedin && (
              <a
                href={sanitizeUrl(data.contact.linkedin)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "1.1rem",
                  transition: "color 0.2s ease, transform 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                }}
                className="social-icon-link"
                title="LinkedIn"
              >
                <FiLinkedin />
              </a>
            )}
            {data.contact.twitter && (
              <a
                href={sanitizeUrl(data.contact.twitter)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "1.1rem",
                  transition: "color 0.2s ease, transform 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                }}
                className="social-icon-link"
                title="Twitter / X"
              >
                <FiTwitter />
              </a>
            )}
          </div>
        </motion.div>

        {/* Right Column: 3D Holographic Core Presentation */}
        <motion.div
          style={{ y: hero3DY }}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="hero-3d-col"
        >
          <Hero3D />
        </motion.div>
      </div>

      {/* Kinetic Scroll Cue Indicator */}
      <motion.div
        onClick={scrollToAbout}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        style={{
          position: "absolute",
          bottom: "1.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          cursor: "pointer",
          color: "var(--text-tertiary)",
          userSelect: "none",
        }}
        title="Scroll to explore"
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.68rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          SCROLL
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <FiChevronDown size={14} />
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .social-icon-link:hover {
          color: var(--accent) !important;
          transform: translateY(-2px);
        }
        .btn-luxury-primary:hover svg {
          transform: translateX(4px);
        }
        @media (max-width: 960px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
            text-align: center;
          }
          .hero-content-col {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .eyebrow-label {
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
