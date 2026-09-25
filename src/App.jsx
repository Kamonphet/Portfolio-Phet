import React from "react";
import { Routes, Route } from "react-router-dom";
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
      {/* Dynamic 3D Particle Constellation Background */}
      <BackgroundCanvas />

      {/* Floating 3D Cyber Objects with Scroll Parallax Physics */}
      <FloatingCyberObjects />

      {/* Main Navigation Bar */}
      <Navbar />

      {/* Sections */}
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

function App() {
  return (
    <PortfolioProvider>
      <Routes>
        <Route path="/" element={<PortfolioContent />} />
        <Route path="/projects" element={<AllProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
      </Routes>
    </PortfolioProvider>
  );
}

export default App;
