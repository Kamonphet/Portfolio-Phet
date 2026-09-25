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
            className="glass-card"
            style={{
              maxWidth: "520px",
              textAlign: "center",
              padding: "3rem 2rem",
              borderRadius: "20px",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                background: "rgba(255, 71, 87, 0.15)",
                color: "#ff4757",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                marginBottom: "1.5rem",
              }}
            >
              <FiInfo />
            </div>
            <h2 style={{ fontSize: "1.6rem", marginBottom: "0.8rem", color: "var(--color-text-main)" }}>
              {isTh ? "ไม่พบข้อมูลโปรเจกต์นี้" : "Project Not Found"}
            </h2>
            <p style={{ color: "var(--color-text-dim)", marginBottom: "2rem", lineHeight: "1.6" }}>
              {isTh
                ? "โปรเจกต์ที่คุณกำลังค้นหาอาจถูกย้าย ลบออก หรือใส่รหัสโปรเจกต์ไม่ถูกต้อง"
                : "The project you are looking for might have been moved, removed, or the link is invalid."}
            </p>
            <Link to="/projects" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 28px", borderRadius: "30px" }}>
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
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--color-text-main)",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: "600",
                padding: "8px 16px",
                borderRadius: "10px",
                background: "var(--color-card-bg)",
                border: "1px solid var(--color-card-border)",
                backdropFilter: "blur(8px)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-primary)";
                e.currentTarget.style.borderColor = "var(--color-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--color-text-main)";
                e.currentTarget.style.borderColor = "var(--color-card-border)";
              }}
            >
              <FiArrowLeft size={16} />
              <span>{isTh ? "ดูผลงานทั้งหมด" : "All Projects"}</span>
            </Link>

            <span style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>/</span>

            <span
              style={{
                color: "var(--color-text-dim)",
                fontSize: "0.88rem",
                maxWidth: "300px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {project.title}
            </span>
          </div>

          <button
            onClick={handleShare}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: copied ? "rgba(0, 255, 135, 0.15)" : "var(--color-card-bg)",
              border: copied ? "1px solid var(--color-accent-2)" : "1px solid var(--color-card-border)",
              color: copied ? "var(--color-accent-2)" : "var(--color-text-dim)",
              padding: "8px 16px",
              borderRadius: "10px",
              fontSize: "0.85rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
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
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "0.8rem" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "var(--color-badge-bg)",
                border: "1px solid var(--color-badge-border)",
                color: "var(--color-primary)",
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "0.82rem",
                fontWeight: "600",
                fontFamily: "var(--font-mono)",
              }}
            >
              <FiFolder size={14} />
              <span>{project.category || "Development"}</span>
            </span>

            {project.featured && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "rgba(255, 209, 102, 0.15)",
                  border: "1px solid var(--color-accent-1)",
                  color: "var(--color-accent-1)",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "0.82rem",
                  fontWeight: "700",
                }}
              >
                <FiStar size={14} />
                <span>{isTh ? "ผลงานเด่นแนะนำ" : "Featured Project"}</span>
              </span>
            )}
          </div>

          <h1
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.7rem)",
              fontWeight: "800",
              color: "var(--color-text-main)",
              lineHeight: "1.3",
              marginBottom: "1rem",
            }}
          >
            {project.title}
          </h1>

          <p
            style={{
              fontSize: "clamp(1rem, 1.8vw, 1.15rem)",
              color: "var(--color-text-dim)",
              lineHeight: "1.7",
              maxWidth: "900px",
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
            marginBottom: "2.5rem",
          }}
        >
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
              style={{
                padding: "12px 28px",
                fontSize: "0.95rem",
                borderRadius: "12px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 0 25px var(--color-primary-glow)",
              }}
            >
              <span>{isTh ? "เปิดดูตัวอย่างผลงานจริง" : "Launch Live Demo"}</span>
              <FiExternalLink size={18} />
            </a>
          )}

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
              style={{
                padding: "12px 26px",
                fontSize: "0.95rem",
                borderRadius: "12px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FiGithub size={18} />
              <span>{isTh ? "ดูซอร์สโค้ดโปรเจกต์" : "Source Code Repository"}</span>
            </a>
          )}
        </motion.div>

        {/* Main Showcase Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="glass-card"
          style={{
            overflow: "hidden",
            borderRadius: "20px",
            border: "1px solid var(--color-card-border)",
            background: "rgba(0, 0, 0, 0.4)",
            marginBottom: "3rem",
            boxShadow: "var(--color-card-shadow-hover)",
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
            marginBottom: "4rem",
          }}
        >
          {/* Tech Stack Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card"
            style={{
              padding: "2rem",
              borderRadius: "18px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.2rem" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "var(--color-badge-bg)",
                  color: "var(--color-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FiLayers size={18} />
              </div>
              <h3 style={{ margin: 0, fontSize: "1.2rem", color: "var(--color-text-main)" }}>
                {isTh ? "เทคโนโลยีและเครื่องมือที่ใช้" : "Technologies & Tools"}
              </h3>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {project.tech &&
                project.tech.map((tech, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: "var(--color-badge-bg)",
                      border: "1px solid var(--color-badge-border)",
                      color: "var(--color-primary)",
                      padding: "8px 16px",
                      borderRadius: "10px",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      fontFamily: "var(--font-mono)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span>#</span>
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
            className="glass-card"
            style={{
              padding: "2rem",
              borderRadius: "18px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.2rem" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "rgba(0, 255, 135, 0.12)",
                  color: "var(--color-accent-2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FiInfo size={18} />
              </div>
              <h3 style={{ margin: 0, fontSize: "1.2rem", color: "var(--color-text-main)" }}>
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
                gap: "12px",
              }}
            >
              <li style={{ display: "flex", alignItems: "flex-start", gap: "10px", color: "var(--color-text-dim)", fontSize: "0.95rem", lineHeight: "1.6" }}>
                <span style={{ color: "var(--color-accent-2)", marginTop: "4px" }}>✔</span>
                <span>{isTh ? "ออกแบบเพื่อการเรียนรู้แบบ Active Learning ตอบโจทย์การศึกษายุคดิจิทัล" : "Engineered for Active Learning and interactive digital education."}</span>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "10px", color: "var(--color-text-dim)", fontSize: "0.95rem", lineHeight: "1.6" }}>
                <span style={{ color: "var(--color-accent-2)", marginTop: "4px" }}>✔</span>
                <span>{isTh ? "คำนึงถึงสถาปัตยกรรมระบบความปลอดภัยและความเสถียรตามมาตรฐานสากล" : "Adheres to cybersecurity best practices and high-performance standards."}</span>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "10px", color: "var(--color-text-dim)", fontSize: "0.95rem", lineHeight: "1.6" }}>
                <span style={{ color: "var(--color-accent-2)", marginTop: "4px" }}>✔</span>
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
                <h3 style={{ fontSize: "1.5rem", fontWeight: "700", margin: 0, color: "var(--color-text-main)" }}>
                  {isTh ? "ผลงานอื่น ๆ ที่น่าสนใจ" : "Explore More Projects"}
                </h3>
                <p style={{ color: "var(--color-text-dim)", margin: "4px 0 0 0", fontSize: "0.9rem" }}>
                  {isTh ? "สำรวจโปรเจกต์เทคโนโลยี สื่อการสอน และระบบความปลอดภัยอื่น ๆ" : "Discover more EdTech, Web apps, and security innovations"}
                </p>
              </div>

              <Link
                to="/projects"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "var(--color-primary)",
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "0.92rem",
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
                  whileHover={{ y: -6 }}
                  className="glass-card"
                  style={{
                    borderRadius: "16px",
                    overflow: "hidden",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  onClick={() => navigate(`/projects/${other.id}`)}
                >
                  <div style={{ height: "180px", overflow: "hidden", background: "rgba(0,0,0,0.3)" }}>
                    <img
                      src={other.image}
                      alt={other.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ padding: "1.2rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--color-primary)", fontFamily: "var(--font-mono)" }}>
                        {other.category}
                      </span>
                      <h4 style={{ margin: "6px 0 8px", fontSize: "1.05rem", color: "var(--color-text-main)", lineHeight: "1.4" }}>
                        {other.title}
                      </h4>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-primary)", fontSize: "0.85rem", fontWeight: "600", marginTop: "1rem" }}>
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
