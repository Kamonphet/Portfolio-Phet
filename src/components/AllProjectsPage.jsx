import React from "react";
import { Link } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";
import { FiArrowLeft } from "react-icons/fi";
import BackgroundCanvas from "./BackgroundCanvas";
import FloatingCyberObjects from "./FloatingCyberObjects";
import Navbar from "./Navbar";
import Projects from "./Projects";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import EditModal from "./EditModal";
import AuthModal from "./AuthModal";

const AllProjectsPage = () => {
  const { t } = usePortfolio();

  return (
    <div className="app-container">
      <BackgroundCanvas />
      <FloatingCyberObjects />
      <Navbar />

      <main>
        {/* Back to Home Link */}
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "7rem 1.5rem 0",
          }}
        >
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--color-primary)",
              textDecoration: "none",
              fontSize: "0.95rem",
              fontWeight: "600",
              padding: "8px 16px",
              borderRadius: "10px",
              background: "var(--color-badge-bg)",
              border: "1px solid var(--color-badge-border)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-glass-subtle)";
              e.currentTarget.style.borderColor = "var(--color-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--color-badge-bg)";
              e.currentTarget.style.borderColor = "var(--color-badge-border)";
            }}
          >
            <FiArrowLeft size={18} />
            <span>{t.projects.backToHome || "กลับหน้าหลัก"}</span>
          </Link>
        </div>

        {/* Full Projects Grid */}
        <Projects showAll={true} />
      </main>

      <Footer />
      <EditModal />
      <AuthModal />
      <ScrollToTop />
    </div>
  );
};

export default AllProjectsPage;
