import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";
import { FiLock, FiUnlock, FiKey, FiX, FiAlertTriangle, FiEye, FiEyeOff } from "react-icons/fi";

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, authenticate, language } = usePortfolio();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isAuthModalOpen) {
      setPassword("");
      setError(false);
      setIsVerifying(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) return;

    setIsVerifying(true);
    setError(false);

    const success = await authenticate(password);
    setIsVerifying(false);

    if (!success) {
      setError(true);
      inputRef.current?.select();
    }
  };

  const isTh = language === "th";

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(4, 7, 16, 0.85)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          zIndex: 100000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeAuthModal();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            width: "100%",
            maxWidth: "440px",
            background: "linear-gradient(180deg, #0e1526 0%, #080c18 100%)",
            border: error
              ? "1px solid #ff4757"
              : "1px solid rgba(0, 242, 254, 0.35)",
            borderRadius: "16px",
            boxShadow: error
              ? "0 20px 50px rgba(255, 71, 87, 0.25)"
              : "0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 242, 254, 0.2)",
            padding: "2rem",
            position: "relative",
            color: "#fff",
            overflow: "hidden",
          }}
        >
          {/* Top Cyber Line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "3px",
              background: error
                ? "#ff4757"
                : "linear-gradient(90deg, var(--color-primary), var(--color-secondary))",
            }}
          />

          {/* Close Button */}
          <button
            onClick={closeAuthModal}
            style={{
              position: "absolute",
              top: "14px",
              right: "14px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              color: "var(--color-text-dim)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          >
            <FiX size={16} />
          </button>

          {/* Icon Header */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                background: error ? "rgba(255, 71, 87, 0.15)" : "rgba(0, 242, 254, 0.12)",
                border: error ? "1px solid #ff4757" : "1px solid var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: error ? "#ff4757" : "var(--color-primary)",
                fontSize: "1.6rem",
                marginBottom: "1rem",
                boxShadow: error
                  ? "0 0 20px rgba(255, 71, 87, 0.3)"
                  : "0 0 20px rgba(0, 242, 254, 0.25)",
              }}
            >
              <FiLock />
            </div>

            <h3
              style={{
                margin: "0 0 6px 0",
                fontSize: "1.25rem",
                fontWeight: "700",
                letterSpacing: "0.5px",
                fontFamily: "var(--font-main)",
              }}
            >
              {isTh ? "ยืนยันตัวตนก่อนแก้ไข" : "Security Access Control"}
            </h3>

            <p
              style={{
                margin: 0,
                fontSize: "0.88rem",
                color: "var(--color-text-dim)",
                lineHeight: "1.5",
              }}
            >
              {isTh
                ? "กรุณาใส่รหัสผ่านเพื่อเข้าสู่โหมดแก้ไขเนื้อหาเว็บ"
                : "Please enter your passcode to access live content editing"}
            </p>
          </div>

          {/* Password Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--color-primary)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FiKey />
              </div>

              <input
                ref={inputRef}
                type={showPassword ? "text" : "password"}
                placeholder={isTh ? "ใส่รหัสผ่านความปลอดภัย" : "Enter security passcode"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                style={{
                  width: "100%",
                  padding: "12px 42px 12px 40px",
                  background: "rgba(6, 10, 20, 0.8)",
                  border: error
                    ? "1.5px solid #ff4757"
                    : "1px solid rgba(0, 242, 254, 0.3)",
                  borderRadius: "10px",
                  color: "#fff",
                  fontFamily: "var(--font-mono)",
                  fontSize: "1.05rem",
                  letterSpacing: showPassword ? "1px" : "3px",
                  outline: "none",
                  boxShadow: error
                    ? "0 0 10px rgba(255, 71, 87, 0.3)"
                    : "inset 0 2px 4px rgba(0,0,0,0.5)",
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  color: "var(--color-text-dim)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  padding: "4px",
                }}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#ff4757",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                }}
              >
                <FiAlertTriangle />
                <span>
                  {isTh ? "รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง" : "ACCESS DENIED: Invalid passcode. Try again."}
                </span>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isVerifying}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                fontSize: "0.95rem",
                marginTop: "0.5rem",
              }}
            >
              <FiUnlock />
              <span>{isVerifying ? (isTh ? "กำลังตรวจสอบ..." : "Verifying...") : (isTh ? "ปลดล็อกเข้าสู่ระบบ" : "Unlock & Edit")}</span>
            </button>

            {/* Security Indicator */}
            <div
              style={{
                textAlign: "center",
                fontSize: "0.75rem",
                color: "var(--color-text-muted)",
                marginTop: "0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                opacity: 0.8,
              }}
            >
              <FiLock size={12} />
              <span>{isTh ? "ระบบความปลอดภัยเข้ารหัส SHA-256" : "Secured with SHA-256 Authentication"}</span>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
