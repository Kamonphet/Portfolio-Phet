import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowUp } from "react-icons/fi";
import { usePortfolio } from "../context/PortfolioContext";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { language } = usePortfolio();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const isTh = language === "th";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          className="scroll-to-top-btn"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 950,
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "var(--color-card-bg)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1px solid var(--color-primary)",
            color: "var(--color-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "var(--color-card-shadow)",
            fontSize: "1.3rem",
            transition: "all 0.2s ease",
          }}
          whileHover={{
            scale: 1.12,
            backgroundColor: "rgba(0, 242, 254, 0.2)",
            boxShadow: "0 10px 30px rgba(0, 242, 254, 0.5)",
          }}
          whileTap={{ scale: 0.9 }}
          title={isTh ? "เลื่อนกลับไปบนสุด" : "Scroll to Top"}
          aria-label={isTh ? "เลื่อนกลับไปบนสุด" : "Scroll to Top"}
        >
          <FiArrowUp />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
