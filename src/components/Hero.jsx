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

  const textY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.15]);
  const hero3DY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  const quickStats = (data?.about?.stats || []).slice(0, 3);

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
        {/* Left Column: Editorial Hero Narrative */}
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="hero-content-col"
        >
          {/* Status Pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "6px 16px",
              borderRadius: "100px",
              background: "var(--accent-muted)",
              border: "1px solid var(--accent-border)",
              marginBottom: "1.5rem",
              backdropFilter: "blur(10px)",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "var(--accent)",
                boxShadow: "0 0 10px var(--accent-glow)",
                display: "inline-block",
                animation: "pulseGlow 2.5s infinite ease-in-out",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: "0.84rem",
                fontFamily: "var(--font-sans)",
                color: "var(--text-primary)",
                fontWeight: "600",
                letterSpacing: "0.01em",
              }}
            >
              <EditableText
                value={
                  data.hero.status ||
                  "Available for collaboration & EdTech Innovation"
                }
                onSave={(val) => updateHero({ status: val })}
              />
            </span>
          </div>

          {/* Primary Identity Headline */}
          <h1
            style={{
              fontSize: "clamp(2.8rem, 6vw, 5.2rem)",
              fontWeight: "700",
              lineHeight: 1.04,
              letterSpacing: "-0.035em",
              color: "var(--text-primary)",
              margin: "0 0 0.85rem 0",
              fontFamily: "var(--font-display)",
            }}
          >
            <EditableText
              value={data.hero.name || "ครูเพชร IT"}
              onSave={(val) => updateHero({ name: val })}
            />
          </h1>

          {/* Role & Positioning Statement */}
          <h2
            style={{
              fontSize: "clamp(1.15rem, 2.1vw, 1.55rem)",
              fontWeight: "600",
              color: "var(--accent)",
              lineHeight: 1.38,
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

          {/* Narrative Tagline */}
          <p
            style={{
              fontSize: "1.04rem",
              color: "var(--text-secondary)",
              lineHeight: 1.75,
              maxWidth: "560px",
              margin: "0 0 2.1rem 0",
            }}
          >
            <EditableText
              value={data.hero.tagline}
              onSave={(val) => updateHero({ tagline: val })}
              multiline
            />
          </p>

          {/* Primary & Secondary Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <button onClick={scrollToProjects} className="btn-luxury-primary">
              <span>{data.hero.ctaPrimary || t.hero.explore}</span>
              <FiArrowRight style={{ transition: "transform 0.25s ease" }} />
            </button>

            <button onClick={scrollToContact} className="btn-luxury-secondary">
              <FiMail style={{ opacity: 0.85 }} />
              <span>{data.hero.ctaSecondary || t.hero.contactMe}</span>
            </button>
          </div>

          {/* Editorial Key Impact Strip */}
          {quickStats.length > 0 && (
            <div
              className="hero-impact-strip"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.75rem",
                flexWrap: "wrap",
                marginTop: "2.4rem",
                paddingTop: "1.6rem",
                borderTop: "1px solid var(--border-subtle)",
              }}
            >
              {quickStats.map((stat, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  <span
                    className="tabular-nums"
                    style={{
                      fontSize: "1.45rem",
                      fontWeight: "700",
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-display)",
                      letterSpacing: "-0.03em",
                      lineHeight: 1.1,
                    }}
                  >
                    {stat.value}
                  </span>
                  <span
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--text-secondary)",
                      fontWeight: "500",
                    }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Social Channels */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.1rem",
              marginTop: "1.75rem",
            }}
          >
            <span
              style={{
                fontSize: "0.78rem",
                color: "var(--text-tertiary)",
                fontWeight: "600",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {t.hero.connect}
            </span>
            <span
              style={{
                width: "20px",
                height: "1px",
                background: "var(--border-subtle)",
              }}
            />
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

        {/* Right Column: Interactive 3D Presentation */}
        <motion.div
          style={{ y: hero3DY }}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="hero-3d-col"
        >
          <Hero3D />
        </motion.div>
      </div>

      {/* Subtle Scroll Cue */}
      <motion.div
        onClick={scrollToAbout}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75, duration: 0.75 }}
        style={{
          position: "absolute",
          bottom: "1.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          cursor: "pointer",
          color: "var(--text-tertiary)",
          userSelect: "none",
        }}
        title="Scroll to explore"
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <FiChevronDown size={16} />
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
          .hero-impact-strip {
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
