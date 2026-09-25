import React from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { FiTerminal, FiArrowUp, FiSettings, FiCloud, FiLoader, FiDatabase } from "react-icons/fi";

const Footer = () => {
  const { data, openCms, t, isSupabaseConfigured, isDbLoading, isDbSyncing, dbSyncedAt } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      style={{
        position: "relative",
        zIndex: 1,
        borderTop: "1px solid var(--color-card-border)",
        background: "var(--color-footer-bg)",
        backdropFilter: "blur(12px)",
        padding: "3rem 1.5rem 2rem 1.5rem",
        transition: "background-color 0.3s ease, border-color 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          {/* Logo & Cloud Status */}
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
              <span style={{ fontFamily: "var(--font-mono)", fontWeight: "700", color: "var(--color-text-main)", fontSize: "1.1rem" }}>
                {data.hero.name || "ครูเพชร IT"}{" "}
                <span style={{ color: "var(--color-primary)", fontSize: "0.85rem" }}>// PORTFOLIO</span>
              </span>
            </div>

            {/* Prominent Supabase Connected Badge */}
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
                title={dbSyncedAt ? `เชื่อมต่อ Supabase แล้ว - ซิงค์ล่าสุด: ${dbSyncedAt.toLocaleTimeString("th-TH")}` : "เชื่อมต่อ Supabase Database แล้ว"}
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

          {/* Quick Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", flexWrap: "wrap" }}>
            <button
              onClick={() => openCms("backup")}
              style={{
                background: "var(--color-glass-subtle)",
                border: "1px solid var(--color-card-border)",
                color: "var(--color-text-dim)",
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "0.82rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-dim)")}
            >
              <FiSettings /> {t.footer.backupBtn}
            </button>

            <button
              onClick={scrollToTop}
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                background: "rgba(0, 242, 254, 0.1)",
                border: "1px solid rgba(0, 242, 254, 0.3)",
                color: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              title="Back to top"
            >
              <FiArrowUp size={18} />
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid var(--color-card-border)",
            paddingTop: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            fontSize: "0.85rem",
            color: "var(--color-text-muted)",
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} {data.hero.name}. {t.footer.rights}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span>{t.footer.crafted}</span>
          </div>

          {/* Cloud sync indicator (read-only) */}
          {isSupabaseConfigured && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.78rem",
                padding: "4px 12px",
                borderRadius: "20px",
                background: isDbLoading || isDbSyncing
                  ? "rgba(255, 209, 102, 0.08)"
                  : "rgba(0, 255, 135, 0.08)",
                border: `1px solid ${
                  isDbLoading || isDbSyncing
                    ? "rgba(255, 209, 102, 0.25)"
                    : "rgba(0, 255, 135, 0.25)"
                }`,
                color: isDbLoading || isDbSyncing
                  ? "var(--color-accent-1)"
                  : "var(--color-accent-2)",
                userSelect: "none",
              }}
              title={dbSyncedAt ? `Database Connected & Synced: ${dbSyncedAt.toLocaleTimeString()}` : "Database Connected"}
            >
              {isDbLoading || isDbSyncing ? (
                <>
                  <FiLoader size={11} style={{ animation: "spin 1s linear infinite" }} />
                  <span>{isDbLoading ? "กำลังเชื่อมต่อ..." : "กำลังบันทึก..."}</span>
                </>
              ) : (
                <>
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "var(--color-accent-2)",
                      boxShadow: "0 0 8px var(--color-accent-2)",
                      display: "inline-block",
                    }}
                  />
                  <FiCloud size={12} />
                  <span>Database Connected</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
