import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";
import {
  FiArrowLeft,
  FiExternalLink,
  FiGithub,
  FiFolder,
  FiStar,
  FiShare2,
  FiCheck,
  FiLayers,
  FiInfo,
  FiArrowRight,
} from "react-icons/fi";
import BackgroundCanvas from "./BackgroundCanvas";
import FloatingCyberObjects from "./FloatingCyberObjects";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import EditModal from "./EditModal";
import AuthModal from "./AuthModal";
import { sanitizeUrl } from "../utils/security";

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, t, language } = usePortfolio();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  const projects = data?.projects || [];
  const project = projects.find((p) => String(p.id) === String(id));

  // Other related projects (excluding current one)
  const otherProjects = projects
    .filter((p) => String(p.id) !== String(id))
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const isTh = language === "th";

  if (!project) {
    return (
      <div className="app-container">
        <BackgroundCanvas />
        <FloatingCyberObjects />
        <Navbar />

        <main style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "8rem 1.5rem 4rem" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              maxWidth: "520px",
              textAlign: "center",
              padding: "3rem 2rem",
              borderRadius: "24px",
              background: "var(--color-card-bg)",
              border: "1px solid var(--border-subtle)",
              boxShadow: "var(--color-card-shadow)",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                background: "rgba(239, 68, 68, 0.12)",
                color: "#ef4444",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                marginBottom: "1.5rem",
              }}
            >
              <FiInfo />
            </div>
            <h2 style={{ fontSize: "1.6rem", marginBottom: "0.8rem", color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
              {isTh ? "ไม่พบข้อมูลผลงานนี้" : "Project Not Found"}
            </h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", lineHeight: "1.6" }}>
              {isTh
                ? "ผลงานที่คุณกำลังค้นหาอาจถูกย้าย ลบออก หรือใส่รหัสไม่ถูกต้อง"
                : "The project you are looking for might have been moved, removed, or the link is invalid."}
            </p>
            <Link
              to="/projects"
              className="btn-luxury-primary"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 28px", borderRadius: "100px" }}
            >
              <FiArrowLeft />
              <span>{isTh ? "กลับสู่คลังผลงานทั้งหมด" : "Back to All Projects"}</span>
            </Link>
          </motion.div>
        </main>

        <Footer />
        <ScrollToTop />
      </div>
    );
  }

  return (
    <div className="app-container">
      <BackgroundCanvas />
      <FloatingCyberObjects />
      <Navbar />

      <main style={{ padding: "7.5rem 1.5rem 5rem", maxWidth: "1240px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Navigation Breadcrumb Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <Link
              to="/projects"
              className="btn-luxury-secondary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 18px",
                borderRadius: "100px",
                fontSize: "0.86rem",
              }}
            >
              <FiArrowLeft size={16} />
              <span>{isTh ? "ดูผลงานทั้งหมด" : "All Projects"}</span>
            </Link>

            <span style={{ color: "var(--text-tertiary)", fontSize: "0.85rem" }}>/</span>

            <span
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.88rem",
                maxWidth: "320px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontFamily: "var(--font-mono)",
              }}
            >
              {project.title}
            </span>
          </div>

          <button
            onClick={handleShare}
            className="btn-luxury-secondary"
            style={{
              padding: "8px 18px",
              borderRadius: "100px",
              fontSize: "0.86rem",
              color: copied ? "#10B981" : "var(--text-primary)",
              borderColor: copied ? "#10B981" : "var(--border-subtle)",
            }}
          >
            {copied ? <FiCheck size={16} /> : <FiShare2 size={16} />}
            <span>{copied ? (isTh ? "คัดลอกลิงก์แล้ว!" : "Link Copied!") : (isTh ? "แชร์ผลงานนี้" : "Share")}</span>
          </button>
        </motion.div>

        {/* Project Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: "2.5rem" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "0.9rem" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "var(--accent-muted)",
                border: "1px solid var(--border-subtle)",
                color: "var(--accent)",
                padding: "5px 14px",
                borderRadius: "100px",
                fontSize: "0.78rem",
                fontWeight: "600",
                fontFamily: "var(--font-mono)",
              }}
            >
              <FiFolder size={13} />
              <span>{project.category || "Development"}</span>
            </span>

            {project.featured && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "rgba(245, 158, 11, 0.15)",
                  border: "1px solid rgba(245, 158, 11, 0.4)",
                  color: "#F59E0B",
                  padding: "5px 14px",
                  borderRadius: "100px",
                  fontSize: "0.78rem",
                  fontWeight: "700",
                  fontFamily: "var(--font-mono)",
                }}
              >
                <FiStar size={13} />
                <span>{isTh ? "FEATURED" : "FEATURED"}</span>
              </span>
            )}
          </div>

          <h1
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3rem)",
              fontWeight: "800",
              color: "var(--text-primary)",
              lineHeight: "1.25",
              marginBottom: "1rem",
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.02em",
            }}
          >
            {project.title}
          </h1>

          <p
            style={{
              fontSize: "clamp(1rem, 1.8vw, 1.15rem)",
              color: "var(--text-secondary)",
              lineHeight: "1.75",
              maxWidth: "920px",
              margin: 0,
            }}
          >
            {project.desc}
          </p>
        </motion.div>

        {/* Action Buttons Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "2.75rem",
          }}
        >
          {project.demoUrl && (
            <a
              href={sanitizeUrl(project.demoUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-luxury-primary"
              style={{
                padding: "12px 28px",
                fontSize: "0.95rem",
                borderRadius: "100px",
                boxShadow: "0 8px 30px var(--accent-glow)",
              }}
            >
              <span>{isTh ? "เปิดดูตัวอย่างผลงานจริง" : "Launch Live Demo"}</span>
              <FiExternalLink size={17} />
            </a>
          )}

          {project.githubUrl && (
            <a
              href={sanitizeUrl(project.githubUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-luxury-secondary"
              style={{
                padding: "12px 26px",
                fontSize: "0.95rem",
                borderRadius: "100px",
              }}
            >
              <FiGithub size={17} />
              <span>{isTh ? "ดูซอร์สโค้ดโปรเจกต์" : "Source Code Repository"}</span>
            </a>
          )}
        </motion.div>

        {/* Main Showcase Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{
            overflow: "hidden",
            borderRadius: "24px",
            border: "1px solid var(--border-subtle)",
            background: "var(--color-card-bg)",
            marginBottom: "3.5rem",
            boxShadow: "var(--color-card-shadow)",
          }}
        >
          <div
            style={{
              width: "100%",
              maxHeight: "560px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <img
              src={project.image}
              alt={project.title}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "560px",
                objectFit: "contain",
                display: "block",
                transition: "transform 0.5s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
        </motion.div>

        {/* Detailed Information & Technologies Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2rem",
            marginBottom: "4.5rem",
          }}
        >
          {/* Tech Stack Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              padding: "2.2rem",
              borderRadius: "20px",
              background: "var(--color-card-bg)",
              border: "1px solid var(--border-subtle)",
              boxShadow: "var(--color-card-shadow)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.4rem" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "var(--accent-muted)",
                  color: "var(--accent)",
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FiLayers size={19} />
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "1.25rem",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-display)",
                  fontWeight: "700",
                }}
              >
                {isTh ? "เทคโนโลยีและเครื่องมือที่ใช้" : "Technologies & Tools"}
              </h3>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {project.tech &&
                project.tech.map((tech, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: "var(--accent-muted)",
                      border: "1px solid var(--border-subtle)",
                      color: "var(--text-primary)",
                      padding: "7px 16px",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      fontFamily: "var(--font-mono)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span style={{ color: "var(--accent)" }}>#</span>
                    <span>{tech}</span>
                  </span>
                ))}
            </div>
          </motion.div>

          {/* Project Highlights / Educational Value */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              padding: "2.2rem",
              borderRadius: "20px",
              background: "var(--color-card-bg)",
              border: "1px solid var(--border-subtle)",
              boxShadow: "var(--color-card-shadow)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.4rem" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "rgba(16, 185, 129, 0.12)",
                  color: "#10B981",
                  border: "1px solid rgba(16, 185, 129, 0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FiInfo size={19} />
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "1.25rem",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-display)",
                  fontWeight: "700",
                }}
              >
                {isTh ? "จุดเด่นและเป้าหมายของผลงาน" : "Key Highlights & Objectives"}
              </h3>
            </div>

            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              <li style={{ display: "flex", alignItems: "flex-start", gap: "10px", color: "var(--text-secondary)", fontSize: "0.94rem", lineHeight: "1.6" }}>
                <span style={{ color: "#10B981", marginTop: "2px", fontWeight: "bold" }}>✔</span>
                <span>{isTh ? "ออกแบบเพื่อการเรียนรู้แบบ Active Learning ตอบโจทย์การศึกษายุคดิจิทัล" : "Engineered for Active Learning and interactive digital education."}</span>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "10px", color: "var(--text-secondary)", fontSize: "0.94rem", lineHeight: "1.6" }}>
                <span style={{ color: "#10B981", marginTop: "2px", fontWeight: "bold" }}>✔</span>
                <span>{isTh ? "คำนึงถึงสถาปัตยกรรมระบบความปลอดภัยและความเสถียรตามมาตรฐานสากล" : "Adheres to cybersecurity best practices and high-performance standards."}</span>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "10px", color: "var(--text-secondary)", fontSize: "0.94rem", lineHeight: "1.6" }}>
                <span style={{ color: "#10B981", marginTop: "2px", fontWeight: "bold" }}>✔</span>
                <span>{isTh ? "รองรับการแสดงผลทุกขนาดหน้าจอ (Responsive Web Design) ทั้งคอมพิวเตอร์และมือถือ" : "Fully responsive design optimized for mobile, tablet, and desktop viewports."}</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Other Projects Section */}
        {otherProjects.length > 0 && (
          <div style={{ marginTop: "4rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: "1.55rem",
                    fontWeight: "700",
                    margin: 0,
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-display)",
                    letterSpacing: "-0.015em",
                  }}
                >
                  {isTh ? "ผลงานอื่น ๆ ที่น่าสนใจ" : "Explore More Projects"}
                </h3>
                <p style={{ color: "var(--text-secondary)", margin: "4px 0 0 0", fontSize: "0.9rem" }}>
                  {isTh ? "สำรวจโปรเจกต์เทคโนโลยี สื่อการสอน และระบบความปลอดภัยอื่น ๆ" : "Discover more EdTech, Web apps, and security innovations"}
                </p>
              </div>

              <Link
                to="/projects"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "var(--accent)",
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "0.92rem",
                  fontFamily: "var(--font-mono)",
                }}
              >
                <span>{isTh ? "ดูทั้งหมด" : "View All"}</span>
                <FiArrowRight />
              </Link>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {otherProjects.map((other) => (
                <motion.div
                  key={other.id}
                  whileHover={{ y: -5 }}
                  style={{
                    borderRadius: "20px",
                    overflow: "hidden",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    background: "var(--color-card-bg)",
                    border: "1px solid var(--border-subtle)",
                    boxShadow: "var(--color-card-shadow)",
                  }}
                  onClick={() => navigate(`/projects/${other.id}`)}
                >
                  <div style={{ height: "190px", overflow: "hidden", background: "var(--bg-elevated)" }}>
                    <img
                      src={other.image}
                      alt={other.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ padding: "1.3rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ fontSize: "0.74rem", color: "var(--accent)", fontFamily: "var(--font-mono)", fontWeight: "600" }}>
                        {other.category}
                      </span>
                      <h4 style={{ margin: "6px 0 8px", fontSize: "1.08rem", color: "var(--text-primary)", lineHeight: "1.4", fontFamily: "var(--font-display)", fontWeight: "700" }}>
                        {other.title}
                      </h4>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--accent)", fontSize: "0.85rem", fontWeight: "600", marginTop: "1rem", fontFamily: "var(--font-mono)" }}>
                      <span>{isTh ? "ดูรายละเอียดเต็ม" : "View Details"}</span>
                      <FiArrowRight size={14} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
      <EditModal />
      <AuthModal />
      <ScrollToTop />
    </div>
  );
};

export default ProjectDetailPage;
