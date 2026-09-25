import React from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { FiTerminal, FiLoader, FiDatabase } from "react-icons/fi";

const Footer = () => {
  const { data, t, isSupabaseConfigured, isDbLoading, isDbSyncing, dbSyncedAt } = usePortfolio();

  return (
    <footer
      style={{
        position: "relative",
        zIndex: 1,
        borderTop: "1px solid var(--color-card-border)",
        background: "var(--color-footer-bg)",
        backdropFilter: "blur(12px)",
        padding: "1.75rem 1.5rem",
        transition: "background-color 0.3s ease, border-color 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.2rem",
        }}
      >
        {/* Left: Brand Logo & Supabase Status Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#000",
                fontWeight: "bold",
              }}
            >
              <FiTerminal size={18} />
            </div>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: "700",
                color: "var(--color-text-main)",
                fontSize: "1.05rem",
              }}
            >
              {data?.hero?.name || "ครูเพชร IT"}{" "}
              <span style={{ color: "var(--color-primary)", fontSize: "0.85rem" }}>// PORTFOLIO</span>
            </span>
          </div>

          {/* Single Clean Supabase Connected Badge */}
          {isSupabaseConfigured && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "0.78rem",
                fontWeight: "600",
                background: isDbLoading || isDbSyncing
                  ? "rgba(255, 209, 102, 0.12)"
                  : "rgba(0, 255, 135, 0.12)",
                border: `1px solid ${
                  isDbLoading || isDbSyncing
                    ? "rgba(255, 209, 102, 0.4)"
                    : "rgba(0, 255, 135, 0.4)"
                }`,
                color: isDbLoading || isDbSyncing
                  ? "var(--color-accent-1)"
                  : "var(--color-accent-2)",
                boxShadow: isDbLoading || isDbSyncing
                  ? "0 0 12px rgba(255, 209, 102, 0.2)"
                  : "0 0 12px rgba(0, 255, 135, 0.2)",
                userSelect: "none",
              }}
              title={
                dbSyncedAt
                  ? `เชื่อมต่อ Supabase แล้ว - ซิงค์ล่าสุด: ${dbSyncedAt.toLocaleTimeString("th-TH")}`
                  : "เชื่อมต่อ Supabase Database แล้ว"
              }
            >
              {isDbLoading || isDbSyncing ? (
                <>
                  <FiLoader size={12} style={{ animation: "spin 1s linear infinite" }} />
                  <span>กำลังซิงค์ Supabase...</span>
                </>
              ) : (
                <>
                  <span
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      background: "var(--color-accent-2)",
                      boxShadow: "0 0 8px var(--color-accent-2)",
                      display: "inline-block",
                    }}
                  />
                  <FiDatabase size={12} />
                  <span>Supabase Connected</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right: Copyright & Made with info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            flexWrap: "wrap",
            fontSize: "0.85rem",
            color: "var(--color-text-muted)",
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} {data?.hero?.name || "ครูเพชร IT"}. {t?.footer?.rights || "สงวนลิขสิทธิ์"}
          </div>
          <div>{t?.footer?.crafted || "Crafted with Modern Tech Stack"}</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
