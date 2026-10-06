import React, { useEffect } from "react";
import { usePortfolio } from "../context/PortfolioContext";
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

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <div className="app-container">
      <BackgroundCanvas />
      <FloatingCyberObjects />
      <Navbar />

      <main style={{ paddingTop: "4.5rem" }}>
        {/* Full Projects Grid (Includes back button on line 2) */}
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
