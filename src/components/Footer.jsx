import React from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { FiTerminal, FiLoader, FiDatabase } from "react-icons/fi";

const Footer = () => {
  const { data, t, isSupabaseConfigured, isDbLoading, isDbSyncing, dbSyncedAt, isAuthenticated } = usePortfolio();

  return (
    <footer
      style={{
        position: "relative",
        zIndex: 1,
        borderTop: "1px solid var(--border-subtle)",
        background: "var(--bg-surface)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        padding: "2rem 1.5rem",
        transition: "background-color 0.3s ease, border-color 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.5rem",
        }}
      >
        {/* Left: Brand Logo & Admin Status Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "10px",
                background: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontWeight: "bold",
                boxShadow: "0 0 15px var(--accent-glow)",
              }}
            >
              <FiTerminal size={17} />
            </div>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: "700",
                color: "var(--text-primary)",
                fontSize: "1rem",
                letterSpacing: "-0.01em",
              }}
            >
              {data?.hero?.name || "ครูเพชร IT"}{" "}
              <span style={{ color: "var(--accent)", fontSize: "0.82rem" }}>// PORTFOLIO</span>
            </span>
          </div>

          {/* Sync Badge (Only visible when admin is authenticated to protect infrastructure privacy) */}
          {isAuthenticated && isSupabaseConfigured && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                padding: "4px 12px",
                borderRadius: "100px",
                fontSize: "0.76rem",
                fontWeight: "600",
                fontFamily: "var(--font-mono)",
                background: isDbLoading || isDbSyncing
                  ? "rgba(245, 158, 11, 0.12)"
                  : "rgba(16, 185, 129, 0.12)",
                border: `1px solid ${
                  isDbLoading || isDbSyncing
                    ? "rgba(245, 158, 11, 0.35)"
                    : "rgba(16, 185, 129, 0.35)"
                }`,
                color: isDbLoading || isDbSyncing
                  ? "#F59E0B"
                  : "#10B981",
                boxShadow: isDbLoading || isDbSyncing
                  ? "0 0 12px rgba(245, 158, 11, 0.2)"
                  : "0 0 12px rgba(16, 185, 129, 0.2)",
                userSelect: "none",
              }}
              title={
                dbSyncedAt
                  ? `เชื่อมต่อ Google Sheets แล้ว - ซิงค์ล่าสุด: ${dbSyncedAt.toLocaleTimeString("th-TH")}`
                  : "เชื่อมต่อ Google Sheets API แล้ว"
              }
            >
              {isDbLoading || isDbSyncing ? (
                <>
                  <FiLoader size={12} style={{ animation: "spin 1s linear infinite" }} />
                  <span>กำลังซิงค์ Google Sheets...</span>
                </>
              ) : (
                <>
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#10B981",
                      boxShadow: "0 0 8px #10B981",
                      display: "inline-block",
                    }}
                  />
                  <FiDatabase size={12} />
                  <span>Google Sheets Connected</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right: Copyright & Crafted info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            flexWrap: "wrap",
            fontSize: "0.84rem",
            color: "var(--text-secondary)",
            fontFamily: "var(--font-sans)",
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} {data?.hero?.name || "ครูเพชร IT"}. {t?.footer?.rights || "สงวนลิขสิทธิ์"}
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-tertiary)" }}>
            {t?.footer?.crafted || "Crafted with Quiet Cyber Luxury"}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
