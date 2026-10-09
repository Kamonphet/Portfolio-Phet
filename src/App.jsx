import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import "./App.css";
import { PortfolioProvider } from "./context/PortfolioContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import BackgroundCanvas from "./components/BackgroundCanvas";
import FloatingCyberObjects from "./components/FloatingCyberObjects";
import EditModal from "./components/EditModal";
import AuthModal from "./components/AuthModal";
import ScrollToTop from "./components/ScrollToTop";
import AllProjectsPage from "./components/AllProjectsPage";
import ProjectDetailPage from "./components/ProjectDetailPage";

function PortfolioContent() {
  return (
    <div className="app-container">
      {/* Quiet Luxury Ambient Space Canvas */}
      <BackgroundCanvas />

      {/* Spatial Frosted Glass Polyhedrons */}
      <FloatingCyberObjects />

      {/* Floating Glass Pill Navigation Bar */}
      <Navbar />

      {/* Main Sections */}
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Visual Content Management Modal */}
      <EditModal />

      {/* Security Auth Passcode Modal */}
      <AuthModal />

      {/* Floating Scroll To Top Button (Positioned bottom-right) */}
      <ScrollToTop />
    </div>
  );
}

function ScrollToTopOnRoute() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

function App() {
  // Initialize Lenis Smooth Scrolling with Reduced Motion Check
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <PortfolioProvider>
      <ScrollToTopOnRoute />
      <Routes>
        <Route path="/" element={<PortfolioContent />} />
        <Route path="/projects" element={<AllProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
      </Routes>
    </PortfolioProvider>
  );
}

export default App;
