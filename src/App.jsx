import React from "react";
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
import KruPetchStickers from "./components/KruPetchStickers";

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

      {/* Security Auth Passcode Modal (1234) */}
      <AuthModal />

      {/* Floating Scroll To Top Button (Positioned bottom-right) */}
      <ScrollToTop />

      {/* Floating Kru Petch Companion Mascot & Sticker Gallery Drawer (Positioned bottom-left) */}
      <KruPetchStickers />
    </div>
  );
}

function App() {
  return (
    <PortfolioProvider>
      <PortfolioContent />
    </PortfolioProvider>
  );
}

export default App;
