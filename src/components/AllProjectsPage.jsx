import React, { useEffect, Suspense, lazy } from "react";
import BackgroundCanvas from "./BackgroundCanvas";
import Navbar from "./Navbar";
import Projects from "./Projects";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

const EditModal = lazy(() => import("./EditModal"));
const AuthModal = lazy(() => import("./AuthModal"));

const AllProjectsPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <div className="app-container">
      <BackgroundCanvas />
      <Navbar />

      <main style={{ paddingTop: "4.5rem" }}>
        <Projects showAll={true} />
      </main>

      <Footer />
      <Suspense fallback={null}>
        <EditModal />
        <AuthModal />
      </Suspense>
      <ScrollToTop />
    </div>
  );
};

export default AllProjectsPage;
