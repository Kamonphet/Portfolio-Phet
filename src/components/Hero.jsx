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
} from "react-icons/fi";
import { sanitizeUrl } from "../utils/security";

const Hero = () => {
  const { data, updateHero, t } = usePortfolio();
  const heroRef = useRef(null);

  // Scroll parallax for hero elements
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);
  const hero3DY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const hero3DScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      ref={heroRef}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "7rem 1.5rem 4rem 1.5rem",
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
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: "3rem",
          alignItems: "center",
        }}
        className="hero-grid"
      >
        {/* Left Column: Hero Content with Scroll Parallax */}
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hero-content-col"
        >
          {/* Mascot Greeting Banner */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              padding: "6px 16px 6px 8px",
              borderRadius: "40px",
              background: "var(--color-glass-subtle)",
              border: "1px solid var(--color-card-border)",
              backdropFilter: "blur(12px)",
              marginBottom: "1rem",
              boxShadow: "0 4px 20px rgba(0, 242, 254, 0.08)",
            }}
          >
            <motion.img
              src="/img/hello.png"
              alt="ครูเพชร IT สวัสดีครับ"
              animate={{ y: [0, -3, 0], rotate: [0, 3, 0, -3, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: "42px",
                height: "42px",
                objectFit: "contain",
                filter: "drop-shadow(0 2px 8px rgba(0, 242, 254, 0.35))",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--color-primary)", fontWeight: "700", letterSpacing: "0.5px" }}>
                ✨ KRU PETCH IT // OFFICIAL MASCOT
              </span>
              <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--color-text-main)" }}>
                "สวัสดีครับ ยินดีต้อนรับครับ :)"
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "1rem" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: "30px",
                background: "rgba(0, 255, 135, 0.08)",
                border: "1px solid rgba(0, 255, 135, 0.25)",
                fontSize: "0.82rem",
                fontWeight: "600",
                color: "var(--color-accent-2)",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-accent-2)",
                  boxShadow: "0 0 8px var(--color-accent-2)",
                  display: "inline-block",
                }}
              />
              <EditableText
                value={data.hero.status}
                onSave={(val) => updateHero({ status: val })}
              />
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "30px",
                background: "var(--color-badge-bg)",
                border: "1px solid var(--color-badge-border)",
                fontSize: "0.8rem",
                fontFamily: "var(--font-mono)",
                color: "var(--color-primary)",
              }}
            >
              <EditableText
                value={data.hero.greeting}
                onSave={(val) => updateHero({ greeting: val })}
              />
            </div>
          </div>

          {/* Main Headline */}
          <h1
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4.2rem)",
              fontWeight: "900",
              lineHeight: 1.1,
              letterSpacing: "-1px",
              margin: 0,
            }}
          >
            I'M{" "}
            <span className="gradient-text">
              <EditableText
                value={data.hero.name}
                onSave={(val) => updateHero({ name: val })}
              />
            </span>
          </h1>

          {/* Subtitle / Role */}
          <h2
            style={{
              fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)",
              fontWeight: "600",
              color: "var(--color-text-dim)",
              margin: "0.8rem 0 0 0",
              lineHeight: 1.3,
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
              fontSize: "1.05rem",
              color: "var(--color-text-dim)",
              lineHeight: 1.7,
              maxWidth: "560px",
              margin: "1rem 0 1.5rem 0",
            }}
          >
            <EditableText
              value={data.hero.tagline}
              onSave={(val) => updateHero({ tagline: val })}
              multiline
            />
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button onClick={scrollToProjects} className="btn-primary">
              <span>{data.hero.ctaPrimary || t.hero.explore}</span>
              <FiArrowRight />
            </button>

            <button onClick={scrollToContact} className="btn-secondary">
              <FiMail />
              <span>{data.hero.ctaSecondary || t.hero.contactMe}</span>
            </button>
          </div>

          {/* Social Quick Links */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", marginTop: "1.5rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
              {t.hero.connect}
            </span>
            {data.contact.github && (
              <a
                href={sanitizeUrl(data.contact.github)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--color-text-dim)",
                  fontSize: "1.2rem",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-dim)")}
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
                  color: "var(--color-text-dim)",
                  fontSize: "1.2rem",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-dim)")}
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
                  color: "var(--color-text-dim)",
                  fontSize: "1.2rem",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-dim)")}
                title="Twitter"
              >
                <FiTwitter />
              </a>
            )}
          </div>
        </motion.div>

        {/* Right Column: 3D Three.js Interactive Core with Scroll Parallax */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          style={{
            y: hero3DY,
            scale: hero3DScale,
            position: "relative",
            width: "100%",
            height: "100%",
            minHeight: "520px",
          }}
        >
          <Hero3D />
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          #home {
            padding: 5.5rem 1rem 3rem 1rem !important;
          }
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            text-align: center;
          }
          .hero-content-col {
            display: flex;
            flex-direction: column;
            align-items: center !important;
          }
          .hero-content-col div {
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
