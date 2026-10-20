import React from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { FiLoader, FiDatabase } from "react-icons/fi";

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
        padding: "2.25rem 1.5rem",
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
        {/* Left: Brand Identity & Admin Sync Status */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "8px",
                background: "var(--accent-muted)",
                border: "1px solid var(--accent-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent)",
                fontWeight: "700",
                fontSize: "0.82rem",
                fontFamily: "var(--font-mono)",
              }}
            >
              KP
            </div>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: "700",
                color: "var(--text-primary)",
                fontSize: "0.96rem",
                letterSpacing: "-0.015em",
              }}
            >
              {data?.hero?.name || "ครูเพชร IT"}
            </span>
          </div>

          {isAuthenticated && isSupabaseConfigured && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                padding: "4px 12px",
                borderRadius: "100px",
                fontSize: "0.75rem",
                fontWeight: "600",
                fontFamily: "var(--font-mono)",
                background:
                  isDbLoading || isDbSyncing
                    ? "rgba(245, 158, 11, 0.12)"
                    : "rgba(16, 185, 129, 0.12)",
                border: `1px solid ${
                  isDbLoading || isDbSyncing
                    ? "rgba(245, 158, 11, 0.35)"
                    : "rgba(16, 185, 129, 0.35)"
                }`,
                color: isDbLoading || isDbSyncing ? "#F59E0B" : "#10B981",
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
                  <span>กำลังซิงค์ข้อมูล...</span>
                </>
              ) : (
                <>
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#10B981",
                      display: "inline-block",
                    }}
                  />
                  <FiDatabase size={12} />
                  <span>Cloud Connected</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right: Copyright & Tagline */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            flexWrap: "wrap",
            fontSize: "0.84rem",
            color: "var(--text-secondary)",
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} {data?.hero?.name || "ครูเพชร IT"} &middot; {t?.footer?.rights || "สงวนลิขสิทธิ์"}
          </div>
          <div style={{ fontSize: "0.82rem", color: "var(--text-tertiary)" }}>
            {t?.footer?.crafted || "สอนให้คิด ใช้เทคโนโลยี สร้างอนาคต"}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
