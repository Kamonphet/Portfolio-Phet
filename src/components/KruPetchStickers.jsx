import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";
import { KRU_PETCH_STICKERS } from "../data/defaultData";
import {
  FiX,
  FiCheck,
  FiDownload,
  FiMaximize2,
  FiHeart,
  FiSmile,
  FiLayers,
} from "react-icons/fi";

const CATEGORIES = [
  { id: "all", label: "ทั้งหมด (18)" },
  { id: "education", label: "🎓 การศึกษา & วิทยาการ" },
  { id: "security", label: "🛡️ Cybersecurity" },
  { id: "tech", label: "💻 Coding & Tech" },
  { id: "greeting", label: "✨ ทักทาย & กำลังใจ" },
  { id: "profile", label: "👔 โปรไฟล์ & คูลโหมด" },
];

const KruPetchStickers = () => {
  const {
    isStickerGalleryOpen,
    closeStickerGallery,
    openStickerGallery,
    activeMascot,
    setActiveMascot,
  } = usePortfolio();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightboxImage, setLightboxImage] = useState(null);
  const [copiedQuoteId, setCopiedQuoteId] = useState(null);
  const [showSpeechBubble, setShowSpeechBubble] = useState(true);

  // Find active mascot sticker info
  const activeSticker =
    KRU_PETCH_STICKERS.find((s) => s.id === activeMascot) ||
    KRU_PETCH_STICKERS.find((s) => s.id === "hello") ||
    KRU_PETCH_STICKERS[0];

  const filteredStickers = KRU_PETCH_STICKERS.filter((s) => {
    if (selectedCategory === "all") return true;
    return s.category === selectedCategory;
  });

  const handleCopyQuote = (sticker) => {
    navigator.clipboard.writeText(`"${sticker.quote}" - ครูเพชร IT`);
    setCopiedQuoteId(sticker.id);
    setTimeout(() => setCopiedQuoteId(null), 2200);
  };

  const handleDownload = (sticker) => {
    const link = document.createElement("a");
    link.href = sticker.image;
    link.download = `krupetch_${sticker.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* 1. Floating Companion Widget (Bottom-Left) */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          left: "24px",
          zIndex: 9998,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "8px",
          pointerEvents: "auto",
        }}
        className="kru-petch-companion-root"
      >
        {/* Dynamic Speech Bubble */}
        <AnimatePresence>
          {showSpeechBubble && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{
                position: "relative",
                background: "var(--color-bg-surface)",
                border: "1px solid var(--color-card-border)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4), 0 0 12px rgba(0, 242, 254, 0.15)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                borderRadius: "14px",
                padding: "8px 14px",
                maxWidth: "240px",
                fontSize: "0.84rem",
                color: "var(--color-text-main)",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>{activeSticker.quote}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSpeechBubble(false);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--color-text-dim)",
                  cursor: "pointer",
                  padding: "2px",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "0.8rem",
                }}
                title="ปิดข้อความ"
              >
                <FiX />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mascot Avatar Button */}
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (!showSpeechBubble) setShowSpeechBubble(true);
            openStickerGallery();
          }}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "var(--color-bg-surface)",
            border: "2px solid var(--color-primary)",
            boxShadow: "0 6px 24px rgba(0, 0, 0, 0.45), 0 0 16px rgba(0, 242, 254, 0.25)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderRadius: "50px",
            padding: "6px 14px 6px 8px",
            cursor: "pointer",
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          }}
          title="คลิกเพื่อเปิดคลังสติกเกอร์ ครูเพชร IT (18 แบบ)"
        >
          {/* Animated Mascot Head */}
          <motion.img
            src={activeSticker.image}
            alt={activeSticker.title}
            animate={{ y: [0, -3, 0], rotate: [0, 2, 0, -2, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: "44px",
              height: "44px",
              objectFit: "contain",
              filter: "drop-shadow(0 2px 6px rgba(0, 242, 254, 0.4))",
            }}
          />

          <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
            <span
              style={{
                fontSize: "0.68rem",
                color: "var(--color-primary)",
                fontWeight: "700",
                letterSpacing: "0.5px",
                fontFamily: "var(--font-mono)",
              }}
            >
              ครูเพชร IT 🎨
            </span>
            <span
              style={{
                fontSize: "0.78rem",
                color: "var(--color-text-main)",
                fontWeight: "600",
                whiteSpace: "nowrap",
              }}
            >
              คลังสติกเกอร์
            </span>
          </div>

          <span
            style={{
              background: "var(--color-badge-bg)",
              border: "1px solid var(--color-badge-border)",
              color: "var(--color-accent-2)",
              fontSize: "0.7rem",
              padding: "2px 7px",
              borderRadius: "12px",
              fontWeight: "700",
            }}
          >
            18
          </span>
        </motion.div>
      </div>

      {/* 2. Full Interactive Sticker Gallery Modal */}
      <AnimatePresence>
        {isStickerGalleryOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(3, 6, 15, 0.85)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              zIndex: 99999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1.5rem",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) closeStickerGallery();
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{
                width: "100%",
                maxWidth: "1100px",
                maxHeight: "92vh",
                background: "var(--color-bg-surface)",
                border: "1px solid var(--color-card-border)",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 242, 254, 0.2)",
                borderRadius: "20px",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                color: "var(--color-text-main)",
                position: "relative",
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: "1.5rem 2rem 1.2rem 2rem",
                  borderBottom: "1px solid var(--color-card-border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "1.5rem" }}>🎨</span>
                    <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: "800" }}>
                      คลังสติกเกอร์ & มาสคอต <span className="gradient-text">ครูเพชร IT</span>
                    </h2>
                    <span
                      style={{
                        background: "rgba(0, 242, 254, 0.12)",
                        border: "1px solid rgba(0, 242, 254, 0.3)",
                        color: "var(--color-primary)",
                        padding: "2px 10px",
                        borderRadius: "20px",
                        fontSize: "0.78rem",
                        fontWeight: "700",
                      }}
                    >
                      ทั้งหมด 18 แบบ
                    </span>
                  </div>
                  <p style={{ margin: "4px 0 0 0", color: "var(--color-text-dim)", fontSize: "0.9rem" }}>
                    ภาพประกอบ สติกเกอร์ และคำคมสร้างแรงบันดาลใจด้านการศึกษา เทคโนโลยี และความปลอดภัยไซเบอร์
                  </p>
                </div>

                <button
                  onClick={closeStickerGallery}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "var(--color-glass-subtle)",
                    border: "1px solid var(--color-card-border)",
                    color: "var(--color-text-main)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontSize: "1.2rem",
                  }}
                  title="ปิดหน้าต่าง"
                >
                  <FiX />
                </button>
              </div>

              {/* Category Filter Pills */}
              <div
                style={{
                  padding: "1rem 2rem 0.5rem 2rem",
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      background:
                        selectedCategory === cat.id
                          ? "linear-gradient(135deg, var(--color-primary), var(--color-secondary))"
                          : "var(--color-glass-subtle)",
                      color: selectedCategory === cat.id ? "#fff" : "var(--color-text-dim)",
                      border: selectedCategory === cat.id ? "none" : "1px solid var(--color-card-border)",
                      borderRadius: "24px",
                      padding: "6px 16px",
                      fontSize: "0.82rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Sticker Grid Container */}
              <div
                style={{
                  padding: "1rem 2rem 2rem 2rem",
                  overflowY: "auto",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: "1.2rem",
                }}
              >
                {filteredStickers.map((sticker) => {
                  const isActive = activeMascot === sticker.id;
                  const isCopied = copiedQuoteId === sticker.id;

                  return (
                    <motion.div
                      key={sticker.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.25 }}
                      whileHover={{ y: -6, transition: { duration: 0.2 } }}
                      style={{
                        background: isActive
                          ? "rgba(0, 242, 254, 0.08)"
                          : "var(--color-glass-subtle)",
                        border: isActive
                          ? "2px solid var(--color-primary)"
                          : "1px solid var(--color-card-border)",
                        borderRadius: "16px",
                        padding: "1.2rem",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        position: "relative",
                        transition: "border-color 0.2s ease, background 0.2s ease",
                      }}
                    >
                      {/* Active Companion Indicator */}
                      {isActive && (
                        <span
                          style={{
                            position: "absolute",
                            top: "10px",
                            left: "10px",
                            background: "var(--color-accent-2)",
                            color: "#000",
                            fontSize: "0.68rem",
                            fontWeight: "800",
                            padding: "2px 8px",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <FiCheck size={12} /> คู่หูที่เลือก
                        </span>
                      )}

                      {/* Badge */}
                      <span
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          background: "var(--color-badge-bg)",
                          border: "1px solid var(--color-badge-border)",
                          color: "var(--color-text-muted)",
                          fontSize: "0.68rem",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {sticker.badge}
                      </span>

                      {/* Image Viewer */}
                      <div
                        style={{
                          width: "140px",
                          height: "140px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "1.5rem 0 1rem 0",
                          cursor: "pointer",
                        }}
                        onClick={() => setLightboxImage(sticker)}
                        title="คลิกเพื่อดูภาพขนาดเต็ม"
                      >
                        <motion.img
                          whileHover={{ scale: 1.12 }}
                          src={sticker.image}
                          alt={sticker.title}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                            filter: "drop-shadow(0 4px 12px rgba(0, 242, 254, 0.25))",
                          }}
                        />
                      </div>

                      {/* Title & Quote */}
                      <h4
                        style={{
                          margin: "0 0 4px 0",
                          fontSize: "1rem",
                          fontWeight: "700",
                          color: "var(--color-text-main)",
                        }}
                      >
                        {sticker.title}
                      </h4>

                      <p
                        style={{
                          margin: "0 0 1.2rem 0",
                          fontSize: "0.82rem",
                          color: "var(--color-text-dim)",
                          fontStyle: "italic",
                          lineHeight: "1.4",
                          flex: 1,
                        }}
                      >
                        "{sticker.quote}"
                      </p>

                      {/* Card Action Buttons */}
                      <div
                        style={{
                          width: "100%",
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "6px",
                        }}
                      >
                        <button
                          onClick={() => {
                            setActiveMascot(sticker.id);
                            setShowSpeechBubble(true);
                          }}
                          style={{
                            background: isActive
                              ? "var(--color-accent-2)"
                              : "var(--color-badge-bg)",
                            color: isActive ? "#000" : "var(--color-primary)",
                            border: "1px solid var(--color-card-border)",
                            borderRadius: "8px",
                            padding: "6px",
                            fontSize: "0.75rem",
                            fontWeight: "700",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "4px",
                            transition: "all 0.2s ease",
                          }}
                          title="ตั้งเป็นมาสคอตคู่หูมุมจอ"
                        >
                          <FiSmile size={14} />
                          <span>{isActive ? "ใช้งานอยู่" : "เลือกคู่หู"}</span>
                        </button>

                        <button
                          onClick={() => handleCopyQuote(sticker)}
                          style={{
                            background: "var(--color-glass-subtle)",
                            color: isCopied ? "var(--color-accent-2)" : "var(--color-text-dim)",
                            border: "1px solid var(--color-card-border)",
                            borderRadius: "8px",
                            padding: "6px",
                            fontSize: "0.75rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "4px",
                            transition: "all 0.2s ease",
                          }}
                          title="คัดลอกคำคม"
                        >
                          {isCopied ? <FiCheck size={14} /> : <FiHeart size={14} />}
                          <span>{isCopied ? "คัดลอกแล้ว!" : "คำคม"}</span>
                        </button>
                      </div>

                      {/* Download & Maximize Row */}
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: "8px",
                          paddingTop: "6px",
                          borderTop: "1px solid var(--color-card-border)",
                          fontSize: "0.74rem",
                        }}
                      >
                        <button
                          onClick={() => setLightboxImage(sticker)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--color-text-muted)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "2px 4px",
                          }}
                          title="ดูภาพขนาดใหญ่"
                        >
                          <FiMaximize2 size={12} /> ขยายดู
                        </button>

                        <button
                          onClick={() => handleDownload(sticker)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--color-primary)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "2px 4px",
                          }}
                          title="ดาวน์โหลดรูปสติกเกอร์"
                        >
                          <FiDownload size={12} /> ดาวน์โหลด
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Lightbox Full-Screen Viewer */}
      <AnimatePresence>
        {lightboxImage && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0, 0, 0, 0.92)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              zIndex: 100000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
            }}
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              style={{
                maxWidth: "85vw",
                maxHeight: "85vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxImage.image}
                alt={lightboxImage.title}
                style={{
                  maxWidth: "100%",
                  maxHeight: "68vh",
                  objectFit: "contain",
                  filter: "drop-shadow(0 10px 30px rgba(0, 242, 254, 0.35))",
                }}
              />

              <div style={{ marginTop: "1.5rem" }}>
                <h3 style={{ margin: "0 0 6px 0", color: "#fff", fontSize: "1.3rem" }}>
                  {lightboxImage.title}
                </h3>
                <p style={{ margin: "0 0 1rem 0", color: "var(--color-accent-2)", fontSize: "1rem", fontWeight: "600" }}>
                  "{lightboxImage.quote}"
                </p>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                  <button
                    onClick={() => {
                      setActiveMascot(lightboxImage.id);
                      setLightboxImage(null);
                    }}
                    className="btn-primary"
                    style={{ padding: "8px 20px", fontSize: "0.88rem" }}
                  >
                    <span>เลือกเป็นมาสคอตคู่หู</span>
                  </button>
                  <button
                    onClick={() => handleDownload(lightboxImage)}
                    className="btn-secondary"
                    style={{ padding: "8px 20px", fontSize: "0.88rem" }}
                  >
                    <FiDownload />
                    <span>ดาวน์โหลดภาพ</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Responsive adjustments */}
      <style>{`
        @media (max-width: 600px) {
          .kru-petch-companion-root {
            bottom: 16px !important;
            left: 16px !important;
          }
        }
      `}</style>
    </>
  );
};

export default KruPetchStickers;
