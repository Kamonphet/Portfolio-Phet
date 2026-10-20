import React, { useEffect, Suspense, lazy } from "react";
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
import ScrollToTop from "./components/ScrollToTop";

// Lazy-load secondary routes and heavy admin modals for fast initial paint
const EditModal = lazy(() => import("./components/EditModal"));
const AuthModal = lazy(() => import("./components/AuthModal"));
const AllProjectsPage = lazy(() => import("./components/AllProjectsPage"));
const ProjectDetailPage = lazy(() => import("./components/ProjectDetailPage"));

function PortfolioContent() {
  return (
    <div className="app-container">
      {/* Unified GPU Shader Background Canvas (OKLab Mesh + Cursor Light + Simplex Grain) */}
      <BackgroundCanvas />

      {/* Floating Glass Pill Navigation Bar */}
      <Navbar />

      {/* Main Narrative Sections */}
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

      {/* Visual Content Management & Auth Modals */}
      <Suspense fallback={null}>
        <EditModal />
        <AuthModal />
      </Suspense>

      {/* Floating Scroll To Top Button */}
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
      duration: 1.05,
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
      <Suspense fallback={<div className="app-container" />}>
        <Routes>
          <Route path="/" element={<PortfolioContent />} />
          <Route path="/projects" element={<AllProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
        </Routes>
      </Suspense>
    </PortfolioProvider>
  );
}

export default App;
